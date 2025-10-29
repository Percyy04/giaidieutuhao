const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// Validation rules for organization
const validateOrganization = [
    body('code').trim().notEmpty().withMessage('Mã đơn vị không được để trống')
        .isLength({ max: 20 }).withMessage('Mã đơn vị tối đa 20 ký tự'),
    body('name').trim().notEmpty().withMessage('Tên đơn vị không được để trống')
        .isLength({ max: 100 }).withMessage('Tên đơn vị tối đa 100 ký tự'),
    handleValidationErrors
];

// Validation rules for round
const validateRound = [
    body('name').trim().notEmpty().withMessage('Tên vòng thi không được để trống')
        .isLength({ max: 100 }).withMessage('Tên vòng thi tối đa 100 ký tự'),
    handleValidationErrors
];

// Validation rules for team
const validateTeam = [
    body('name').trim().notEmpty().withMessage('Tên đội không được để trống')
        .isLength({ max: 100 }).withMessage('Tên đội tối đa 100 ký tự'),
    handleValidationErrors
];

// Validation rules for judge
const validateJudge = [
    body('org_id').isInt({ min: 1 }).withMessage('ID đơn vị không hợp lệ'),
    body('full_name').trim().notEmpty().withMessage('Tên giám khảo không được để trống')
        .isLength({ max: 100 }).withMessage('Tên giám khảo tối đa 100 ký tự'),
    body('email').isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),
    handleValidationErrors
];

// Validation rules for performance
const validatePerformance = [
    body('round_id').isInt({ min: 1 }).withMessage('ID vòng thi không hợp lệ'),
    body('team_id').isInt({ min: 1 }).withMessage('ID đội không hợp lệ'),
    body('name').trim().notEmpty().withMessage('Tên tiết mục không được để trống')
        .isLength({ max: 200 }).withMessage('Tên tiết mục tối đa 200 ký tự'),
    body('order_in_round').optional().isInt({ min: 1 }).withMessage('Thứ tự không hợp lệ'),
    handleValidationErrors
];

// Validation rules for criterion
const validateCriterion = [
    body('name').trim().notEmpty().withMessage('Tên tiêu chí không được để trống')
        .isLength({ max: 50 }).withMessage('Tên tiêu chí tối đa 50 ký tự'),
    body('max_score').isFloat({ min: 0, max: 100 }).withMessage('Điểm tối đa không hợp lệ'),
    body('order_idx').isInt({ min: 1 }).withMessage('Thứ tự không hợp lệ'),
    handleValidationErrors
];

// Validation rules for score submission
const validateScoreSubmission = [
    body('details').isArray({ min: 1 }).withMessage('Dữ liệu điểm không hợp lệ'),
    body('details.*.criterion_id').isInt({ min: 1 }).withMessage('ID tiêu chí không hợp lệ'),
    body('details.*.point').isFloat({ min: 0, max: 10 }).withMessage('Điểm phải từ 0 đến 10'),
    body('details.*.note').optional().trim(),
    handleValidationErrors
];

// Validation rules for login
const validateJudgeLogin = [
    body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
    body('org_id').isInt({ min: 1 }).withMessage('Vui lòng chọn đơn vị'),
    handleValidationErrors
];

const validateAdminLogin = [
    body('username').trim().notEmpty().withMessage('Tên đăng nhập không được để trống'),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
    handleValidationErrors
];

module.exports = {
    validateOrganization,
    validateRound,
    validateTeam,
    validateJudge,
    validatePerformance,
    validateCriterion,
    validateScoreSubmission,
    validateJudgeLogin,
    validateAdminLogin
};