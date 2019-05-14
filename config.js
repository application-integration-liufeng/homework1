const CONF = {
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'application_integration',
        pass: '123456',
        char: 'utf8mb4'
    },
    token: {
        secret: 'jwt demo',
        path: [
//            /^\/api\/v1\/user\/login/,
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
