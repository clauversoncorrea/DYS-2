var express = require('express'),
app = express();

var port = process.env.port || 8089;

app.use(express.static('./')); 

app.get('/', function (req, res) {
res.sendfile('./');
});

app.listen(port, function () {
console.log("Servidor rodando na porta 8084");
});