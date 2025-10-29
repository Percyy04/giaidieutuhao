const Organization = require('../models/organization.model');
const Round = require('../models/round.model');
const Team = require('../models/team.model');
const Judge = require('../models/judge.model');
const Performance = require('../models/performance.model');
const Criterion = require('../models/criterion.model');
const Score = require('../models/score.model');

class AdminController {
    // ===== ORGANIZATION MANAGEMENT =====
    static async getOrganizations(req, res) {
        try {
            const organizations = await Organization.findAll();
            res.json({ success: true, data: organizations });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async createOrganization(req, res) {
        try {
            const organization = await Organization.create(req.body);
            res.status(201).json({ success: true, data: organization });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateOrganization(req, res) {
        try {
            const organization = await Organization.update(req.params.id, req.body);
            res.json({ success: true, data: organization });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deleteOrganization(req, res) {
        try {
            await Organization.delete(req.params.id);
            res.json({ success: true, message: 'Đã xóa đơn vị' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ===== ROUND MANAGEMENT =====
    static async getRounds(req, res) {
        try {
            const rounds = await Round.findAll();
            res.json({ success: true, data: rounds });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async createRound(req, res) {
        try {
            const round = await Round.create(req.body);
            res.status(201).json({ success: true, data: round });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateRound(req, res) {
        try {
            const round = await Round.update(req.params.id, req.body);
            res.json({ success: true, data: round });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deleteRound(req, res) {
        try {
            await Round.delete(req.params.id);
            res.json({ success: true, message: 'Đã xóa vòng thi' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async assignOrganizationsToRound(req, res) {
        try {
            const { org_ids } = req.body;
            await Round.assignOrganizations(req.params.id, org_ids);
            res.json({ success: true, message: 'Đã phân công đơn vị' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ===== TEAM MANAGEMENT =====
    static async getTeams(req, res) {
        try {
            const teams = await Team.findAll();
            res.json({ success: true, data: teams });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async createTeam(req, res) {
        try {
            const team = await Team.create(req.body);
            res.status(201).json({ success: true, data: team });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateTeam(req, res) {
        try {
            const team = await Team.update(req.params.id, req.body);
            res.json({ success: true, data: team });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deleteTeam(req, res) {
        try {
            await Team.delete(req.params.id);
            res.json({ success: true, message: 'Đã xóa đội' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ===== JUDGE MANAGEMENT =====
    static async getJudges(req, res) {
        try {
            const judges = await Judge.findAll();
            res.json({ success: true, data: judges });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async createJudge(req, res) {
        try {
            const judge = await Judge.create(req.body);
            res.status(201).json({ success: true, data: judge });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateJudge(req, res) {
        try {
            const judge = await Judge.update(req.params.id, req.body);
            res.json({ success: true, data: judge });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deleteJudge(req, res) {
        try {
            await Judge.delete(req.params.id);
            res.json({ success: true, message: 'Đã xóa giám khảo' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ===== PERFORMANCE MANAGEMENT =====
    static async getPerformances(req, res) {
        try {
            const { round_id } = req.query;
            const performances = round_id
                ? await Performance.findByRound(round_id)
                : await Performance.findAll();
            res.json({ success: true, data: performances });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async createPerformance(req, res) {
        try {
            const performance = await Performance.create(req.body);
            res.status(201).json({ success: true, data: performance });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updatePerformance(req, res) {
        try {
            const performance = await Performance.update(req.params.id, req.body);
            res.json({ success: true, data: performance });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deletePerformance(req, res) {
        try {
            await Performance.delete(req.params.id);
            res.json({ success: true, message: 'Đã xóa tiết mục' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ===== CRITERION MANAGEMENT =====
    static async getCriteria(req, res) {
        try {
            const criteria = await Criterion.findAll();
            res.json({ success: true, data: criteria });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async createCriterion(req, res) {
        try {
            const criterion = await Criterion.create(req.body);
            res.status(201).json({ success: true, data: criterion });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateCriterion(req, res) {
        try {
            const criterion = await Criterion.update(req.params.id, req.body);
            res.json({ success: true, data: criterion });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ===== RANKING =====
    static async getRanking(req, res) {
        try {
            const { round_id } = req.query;
            const ranking = round_id
                ? await Score.getRanking(round_id)
                : await Score.getAllRankings();
            res.json({ success: true, data: ranking });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getPerformanceDetails(req, res) {
        try {
            const scores = await Performance.getScoresByPerformance(req.params.id);
            res.json({ success: true, data: scores });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = AdminController;