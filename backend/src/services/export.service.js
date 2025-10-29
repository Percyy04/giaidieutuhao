const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ExportService {
    // Export ranking to CSV
    static exportRankingToCSV(rankingData) {
        try {
            const fields = [
                { label: 'Hạng', value: 'rank' },
                { label: 'Tên tiết mục', value: 'performance_name' },
                { label: 'Đội', value: 'team_name' },
                { label: 'Vòng thi', value: 'round_name' },
                { label: 'Điểm TB', value: 'avg_score' },
                { label: 'Số giám khảo', value: 'judge_count' }
            ];

            const parser = new Parser({ fields, withBOM: true }); // withBOM for Vietnamese
            const csv = parser.parse(rankingData);
            return csv;
        } catch (error) {
            throw new Error('Lỗi khi tạo file CSV: ' + error.message);
        }
    }

    // Export performance details to CSV
    static exportPerformanceDetailsToCSV(performanceData) {
        try {
            const fields = [
                { label: 'Tiết mục', value: 'performance_name' },
                { label: 'Đội', value: 'team_name' },
                { label: 'Giám khảo', value: 'judge_name' },
                { label: 'Đơn vị', value: 'org_name' },
                { label: 'Tiêu chí', value: 'criterion_name' },
                { label: 'Điểm', value: 'point' },
                { label: 'Ghi chú', value: 'note' }
            ];

            const parser = new Parser({ fields, withBOM: true });
            const csv = parser.parse(performanceData);
            return csv;
        } catch (error) {
            throw new Error('Lỗi khi tạo file CSV chi tiết: ' + error.message);
        }
    }

    // Export ranking to PDF
    static exportRankingToPDF(rankingData, roundName) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const chunks = [];

                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Register Vietnamese font (optional - requires font file)
                // doc.registerFont('Arial', 'path/to/arial.ttf');
                // doc.font('Arial');

                // Header
                doc.fontSize(20).text('BẢNG XẾP HẠNG', { align: 'center' });
                doc.fontSize(14).text(roundName || 'Toàn cuộc thi', { align: 'center' });
                doc.moveDown(2);

                // Table header
                const tableTop = 150;
                const colWidths = [50, 200, 150, 80, 80];
                const headers = ['Hạng', 'Tiết mục', 'Đội', 'Điểm TB', 'SL GK'];

                doc.fontSize(10).font('Helvetica-Bold');
                let xPos = 50;
                headers.forEach((header, i) => {
                    doc.text(header, xPos, tableTop, { width: colWidths[i] });
                    xPos += colWidths[i];
                });

                // Table rows
                doc.font('Helvetica');
                let yPos = tableTop + 20;

                rankingData.forEach((item, index) => {
                    if (yPos > 700) {
                        doc.addPage();
                        yPos = 50;
                    }

                    xPos = 50;
                    const rowData = [
                        item.rank || (index + 1),
                        item.performance_name || '',
                        item.team_name || '',
                        (item.avg_score || 0).toFixed(2),
                        item.judge_count || 0
                    ];

                    rowData.forEach((data, i) => {
                        doc.text(String(data), xPos, yPos, { width: colWidths[i] });
                        xPos += colWidths[i];
                    });

                    yPos += 20;
                });

                // Footer
                doc.fontSize(8).text(
                    `Tạo ngày: ${new Date().toLocaleString('vi-VN')}`,
                    50,
                    doc.page.height - 50,
                    { align: 'center' }
                );

                doc.end();
            } catch (error) {
                reject(new Error('Lỗi khi tạo file PDF: ' + error.message));
            }
        });
    }

    // Export detailed scores to PDF
    static exportDetailedScoresToPDF(performanceData, performanceName) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const chunks = [];

                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Header
                doc.fontSize(18).text('BẢNG ĐIỂM CHI TIẾT', { align: 'center' });
                doc.fontSize(12).text(performanceName || '', { align: 'center' });
                doc.moveDown(2);

                // Group by judge
                const groupedByJudge = {};
                performanceData.forEach(item => {
                    if (!groupedByJudge[item.judge_name]) {
                        groupedByJudge[item.judge_name] = {
                            org_name: item.org_name,
                            scores: []
                        };
                    }
                    groupedByJudge[item.judge_name].scores.push({
                        criterion_name: item.criterion_name,
                        point: item.point,
                        note: item.note
                    });
                });

                // Render each judge's scores
                let yPos = 150;
                Object.keys(groupedByJudge).forEach(judgeName => {
                    const judgeData = groupedByJudge[judgeName];

                    if (yPos > 650) {
                        doc.addPage();
                        yPos = 50;
                    }

                    doc.fontSize(12).font('Helvetica-Bold')
                        .text(`Giám khảo: ${judgeName}`, 50, yPos);
                    yPos += 15;

                    doc.fontSize(10).font('Helvetica')
                        .text(`Đơn vị: ${judgeData.org_name}`, 50, yPos);
                    yPos += 20;

                    // Criteria scores
                    judgeData.scores.forEach(score => {
                        doc.text(`${score.criterion_name}: ${score.point}/10`, 70, yPos);
                        if (score.note) {
                            yPos += 15;
                            doc.fontSize(9).text(`Ghi chú: ${score.note}`, 90, yPos);
                            doc.fontSize(10);
                        }
                        yPos += 20;
                    });

                    const avgScore = judgeData.scores.reduce((sum, s) => sum + s.point, 0) / judgeData.scores.length;
                    doc.font('Helvetica-Bold')
                        .text(`Tổng điểm TB: ${avgScore.toFixed(2)}`, 70, yPos);

                    yPos += 30;
                    doc.font('Helvetica');
                });

                // Footer
                doc.fontSize(8).text(
                    `Tạo ngày: ${new Date().toLocaleString('vi-VN')}`,
                    50,
                    doc.page.height - 50,
                    { align: 'center' }
                );

                doc.end();
            } catch (error) {
                reject(new Error('Lỗi khi tạo file PDF chi tiết: ' + error.message));
            }
        });
    }
}

module.exports = ExportService;
