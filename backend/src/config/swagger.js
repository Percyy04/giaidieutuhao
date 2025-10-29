const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Giai Điệu Tự Hào - API Documentation',
            version: '1.0.0',
            description: 'API documentation cho hệ thống chấm điểm cuộc thi "Giai Điệu Tự Hào"',
            contact: {
                name: 'Trường Phát',
                email: 'truongphat@fpt.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'http://localhost:8080',
                description: 'Production server'
            }
        ],
        tags: [
            {
                name: 'Organizations',
                description: 'Quản lý đơn vị tổ chức'
            },
            {
                name: 'Judges',
                description: 'Quản lý giám khảo'
            },
            {
                name: 'Rounds',
                description: 'Quản lý vòng thi'
            },
            {
                name: 'Teams',
                description: 'Quản lý đội thi'
            },
            {
                name: 'Performances',
                description: 'Quản lý tiết mục'
            },
            {
                name: 'Scores',
                description: 'Quản lý điểm chấm'
            },
            {
                name: 'Ranking',
                description: 'Bảng xếp hạng'
            },
            {
                name: 'Export',
                description: 'Xuất báo cáo'
            }
        ],
        components: {
            schemas: {
                Organization: {
                    type: 'object',
                    required: ['code', 'name'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID tự động tăng'
                        },
                        code: {
                            type: 'string',
                            description: 'Mã đơn vị (unique)',
                            example: 'FRC'
                        },
                        name: {
                            type: 'string',
                            description: 'Tên đơn vị',
                            example: 'FPT Retail'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Ngày tạo'
                        }
                    }
                },
                Judge: {
                    type: 'object',
                    required: ['org_id', 'full_name', 'email'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID tự động tăng'
                        },
                        org_id: {
                            type: 'integer',
                            description: 'ID đơn vị'
                        },
                        full_name: {
                            type: 'string',
                            description: 'Họ tên giám khảo',
                            example: 'Nguyễn Văn An'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email (unique)',
                            example: 'nva@fptretail.com'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Round: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        id: {
                            type: 'integer'
                        },
                        name: {
                            type: 'string',
                            example: 'Vòng Sơ Loại'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Team: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        id: {
                            type: 'integer'
                        },
                        name: {
                            type: 'string',
                            example: 'Đội A - FPT Retail'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Performance: {
                    type: 'object',
                    required: ['round_id', 'team_id', 'name'],
                    properties: {
                        id: {
                            type: 'integer'
                        },
                        round_id: {
                            type: 'integer'
                        },
                        team_id: {
                            type: 'integer'
                        },
                        name: {
                            type: 'string',
                            example: 'Nơi tình yêu bắt đầu'
                        },
                        order_in_round: {
                            type: 'integer',
                            nullable: true
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Score: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer'
                        },
                        performance_id: {
                            type: 'integer'
                        },
                        judge_id: {
                            type: 'integer'
                        },
                        details: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/ScoreDetail'
                            }
                        }
                    }
                },
                ScoreDetail: {
                    type: 'object',
                    properties: {
                        criterion_id: {
                            type: 'integer',
                            description: '1=Kỹ thuật, 2=Phong cách, 3=Kết cấu, 4=Sáng tạo'
                        },
                        point: {
                            type: 'number',
                            format: 'float',
                            minimum: 0,
                            maximum: 10,
                            example: 8.5
                        },
                        note: {
                            type: 'string',
                            example: 'Trình diễn tốt'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Lỗi xảy ra'
                        },
                        error: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js'] // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
