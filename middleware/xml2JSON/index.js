const xml2js = require('xml2js');
const fs = require('fs');
const xmlParser = new xml2js.Parser({explicitArray: false, ignoreAttrs: true});

module.exports = (xmlPath) =>{
    return new Promise((resolve, reject)=>{
        fs.readFile(xmlPath, function(err, data) {
            xmlParser.parseString(data, function (err, result) {
                console.log(JSON.parse(JSON.stringify(result)));
                resolve(JSON.parse(JSON.stringify(result)));
            });
        });
    });
};
