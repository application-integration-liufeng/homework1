const CONF = {
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'stock',
        pass: '123456',
        char: 'utf8mb4'
    },
    token: {
        secret: 'jwt demo',
        path: [
            /^\/tushare\/detail/,
            /^\/tushare\/list/,
            /^\/xueqiu\/stocklist/,
            /^\/xueqiu\/stockcomment/,
            /^\/xueqiu\/stockkline/,
            /^\/xueqiu\/companylist/
        ]
    },
    url: {
        prefix: ''
    },
    validate_mailer: {
        host: '',
        port: 465,
        user: '',
        pass: '',
        from: ''
    },
    tushare: {
        token: '582eee2fb6aa974db8555e9cf101b4c3a3a577e6ab3be0523f6b62aa'
    }
};

module.exports = CONF;
