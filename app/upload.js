var ftClient = require('ftp-client'),
    config = {
        host: "dys-ftp.cloudbr.net",
        port: 21,
        user: "hpdys",
        password: "N@ka@2016_2"
    },
    options = {
        logging: 'basic'
    },
    client = new ftClient(config, options);

module.exports = function (req, res) {
    var arquivo = req.files.file;
    var temporario = arquivo.path;
    var novo = "/public_html/DYS/belezapink";

    client.connect(function () {

        client.upload(temporario, novo, {baseDir: 'belezapink', overwrite: 'older'}, function (result) {
            console.log(result);
        });

        // client.download(novo, "C:/Users/Mestra/Desktop/DYS/img", {overwrite: 'all'}, function (result) {
        //     console.log(result);
        // });
    });

}