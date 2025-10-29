const Score = require('../models/score.model');
const Round = require('../models/round.model');
const Organization = require('../models/organization.model');

class PublicController {
    // Get public ranking (no authentication required)
    static async getPublicRanking(req, res) {
        try {
            const { round_id } = req.query;

            let ranking;
            if (round_id) {
                ranking = await Score.getRanking(round_id);
            } else {
                ranking = await Score.getAllRankings();
            }

            res.json({
                success: true,
                data: ranking
            });
        } catch (error) {
            console.error('Get public ranking error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get rounds list
    static async getRounds(req, res) {
        try {
            const rounds = await Round.findAll();
            res.json({
                success: true,
                data: rounds
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get organizations list (for login dropdown)
    static async getOrganizations(req, res) {
        try {
            const organizations = await Organization.findAll();
            res.json({
                success: true,
                data: organizations
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = PublicController;