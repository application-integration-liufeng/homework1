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
    }

};

module.exports = CONF;
