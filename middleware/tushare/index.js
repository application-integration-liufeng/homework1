const request = require('request');

module.exports = (requestData) =>{
    return new Promise((resolve, reject)=>{
        const url = "http://api.tushare.pro";
        const option = {
            url: url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: requestData
        };
        request(option, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(body)
            }
        });
    });
};
