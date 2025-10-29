const ExportModel = require('../models/export.model');

class ExportController {
    static async exportRankingCSV(req, res) {
        try {
            const { roundId } = req.params;
            const data = await ExportModel.getRankingDataForExport(roundId);

            if (!data || data.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không có dữ liệu để xuất'
                });
            }

            // Tạo CSV content
            const csvHeader = 'STT,Tiết mục,Thứ tự,Vòng thi,Điểm TB,Số giám khảo,Giám khảo chấm\n';
            const csvRows = data.map((row, index) => {
                return `${index + 1},"${row.performance_name}",${row.order_in_round},"${row.round_name}",${row.avg_score || 0},${row.judge_count},"${row.judges || 'N/A'}"`;
            }).join('\n');

            const csvContent = csvHeader + csvRows;

            // Set headers để download file
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="ranking_round_${roundId}_${Date.now()}.csv"`);
            res.status(200).send('\uFEFF' + csvContent); // Add BOM for Excel UTF-8
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xuất file',
                error: error.message
            });
        }
    }
}

module.exports = ExportController;
