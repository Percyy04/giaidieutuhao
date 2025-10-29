const Judge = require('../models/judge.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

class AuthController {
    // Judge login with email and organization
    static async judgeLogin(req, res) {
        try {
            const { email, org_id } = req.body;

            if (!email || !org_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Email và đơn vị là bắt buộc'
                });
            }

            // Find judge by email and organization
            const judge = await Judge.findByEmailAndOrg(email, org_id);

            if (!judge) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc đơn vị không đúng'
                });
            }

            // Get assigned rounds for this judge's organization
            const rounds = await Judge.getRoundsForOrganization(org_id);

            // Generate JWT token
            const token = jwt.sign(
                {
                    judge_id: judge.id,
                    email: judge.email,
                    org_id: judge.org_id,
                    role: 'judge'
                },
                config.jwtSecret,
                { expiresIn: config.jwtExpire }
            );

            res.json({
                success: true,
                data: {
                    token,
                    judge: {
                        id: judge.id,
                        full_name: judge.full_name,
                        email: judge.email,
                        org_id: judge.org_id,
                        org_name: judge.org_name
                    },
                    rounds
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi đăng nhập'
            });
        }
    }

    // Admin login (simple implementation)
    static async adminLogin(req, res) {
        try {
            const { username, password } = req.body;

            // Simple admin check (should be improved with proper authentication)
            if (username === 'admin' && password === 'admin123') {
                const token = jwt.sign(
                    {
                        username,
                        role: 'admin'
                    },
                    config.jwtSecret,
                    { expiresIn: config.jwtExpire }
                );

                res.json({
                    success: true,
                    data: {
                        token,
                        user: { username, role: 'admin' }
                    }
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Tên đăng nhập hoặc mật khẩu không đúng'
                });
            }
        } catch (error) {
            console.error('Admin login error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi đăng nhập'
            });
        }
    }

    // Verify token
    static async verifyToken(req, res) {
        try {
            res.json({
                success: true,
                data: req.user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi xác thực'
            });
        }
    }
}

module.exports = AuthController;