var mysql = require("mysql"),
    express = require('express'),
    bodyParser = require('body-parser'),
    conexao = require('./config/conexao'),
    app = express(),
    router = express.Router(),
    request = require('request'),
    fs = require('fs'),
    regex = require('regex-match-all'),
    server = app.listen(8001),
    io = require('socket.io').listen(server),
    conexaoNot, intervalConexaoNot,
    csv = require('fast-csv');

const nodemailer = require('nodemailer');

var port = process.env.port || 8000;

var router = express.Router();
var emitir = function (req, res, next) {
    var notificar = req.query.notificacao || '';
    if (notificar != '') {
        io.emit('notificacao', notificar);
        next();
    } else {
        next();
    }
}
app.use(emitir);
app.use('/api', router);
router.route('/notificar').get(function (req, res) {
    res.json({ message: "testando essa rota" })
})

io.on('connect', function () { console.log("Usuário Conectado!") });

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('chamaSenha', function (data) {
        console.log('fui chamado')
        // we tell the client to execute 'new message'
        socket.broadcast.emit('senha', data);
    });
});

var connection = mysql.createPool({
    host: conexao.auth.host,
    user: conexao.auth.user,
    password: conexao.auth.password,
    database: conexao.auth.database
});

connection.on('error', function (err) {
    console.log(err);
    res.send({ success: false, message: 'database error', error: err });
    return;
});

// create application/json parser
var jsonParser = bodyParser.json()

app.use(express.static('./'));


app.get("/triggers/:banco", function (req, res) {
    var banco = req.params.banco,
        query = 'select ACTION_STATEMENT from information_schema.TRIGGERS where TRIGGER_SCHEMA="' + banco + '";';

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });


});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://54.233.66.37/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    return next();
});

app.use(bodyParser({ limit: '100mb' }));
// app.use(bodyParser());
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));   

app.use('/', router);

/** 
 * arquivo: string
 * view: boolean
 * pasta: string
 * nome: string
*/
app.post("/geraArquivo/", jsonParser, function (req, res) {
    var post = req.body,
        arquivo = post.arquivo,
        nome;

    if (post.caminho == "view") nome = "view/" + post.nome
    else if (post.caminho == "modal") nome = "modals/" + post.nome;
    else if (post.caminho == "raiz") nome = "DYS_TEMPLATE/" + post.nome;
    else nome = post.caminho + "/" + post.nome;

    console.log(nome);

    fs.writeFile(nome, arquivo, function () {
        res.send("ok");
        console.log("Arquivo pronto!");
    });
});

app.post("/leArquivo/", jsonParser, function (req, res) {
    var post = req.body,
        arquivo = post.arquivo;

    fs.readFile(arquivo, function (err, data) {
        res.send(data);
    });
});

// CRUD NODE
// Chamar uma Procedure
app.get("/proc/:nome", function (req, res) {
    var nome = req.params.nome,
        query = 'call ' + nome;

    console.log(query);

    query = query.replace(/\^/g, "%");
    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows, fields) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });
});

// put
app.put("/put/:table", jsonParser, function (req, res) {
    var post = req.body, propriedades = "", query, encode, valor,
        keys = Object.keys(post), name = "id", table = req.params.table;

    if (!post.id) name = Object.keys(post)[0];

    for (var i = 0; i < keys.length; i++) {
        encode = (keys[i + 1]) ? "," : "";
        if (post[keys[i]] == "null" || post[keys[i]] == null) valor = 'default';
        else if (post[keys[i]] === true || post[keys[i]] === false) valor = post[keys[i]];
        else valor = '"' + post[keys[i]] + '"';
        propriedades += keys[i] + " = " + valor + encode + " ";
    }
    query = 'UPDATE ' + table + ' SET ' + propriedades + ' WHERE ' + name + ' = ' + post[name];

    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows, results) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });
});

// post
app.post("/post/:table", jsonParser, function (req, res) {
    var post = req.body, propriedades = "", valores = "", query, encode, valor,
        keys = Object.keys(post), table = req.params.table;


    for (var i = 0; i < keys.length; i++) {
        encode = (keys[i + 1]) ? "," : "";

        if (post[keys[i]] == "null" || post[keys[i]] == null) valor = 'default';
        else if (post[keys[i]] === true || post[keys[i]] === false) valor = post[keys[i]];
        else valor = '"' + post[keys[i]] + '"';
        propriedades += keys[i] + encode;
        valores += valor + encode;
    }
    query = 'INSERT INTO ' + table + ' (' + propriedades + ') VALUES (' + valores + ')';

    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });
});

app.get("/le/:consulta/:banco/:filtro/:le3", function (req, res) {
    var consulta = req.params.consulta,
        banco = req.params.banco,
        filtro = req.params.filtro,
        le = (req.params.le3 == "true") ? "le3" : "le",
        query;

    query = 'call node.' + le + '("' + consulta + '","' + banco + '", "' + filtro + '")';
    console.log(query);
    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });

});

app.post("/xlsxtojson/", jsonParser, function (req, res) {
    var post = req.body;
    var jsonExcel = [];
    var xlsxj = require("xlsx-to-json");
    xlsxj({
        input: "teste.xlsx",
        output: "output.json"
    }, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            res.send(result);
        }
    });
});

function montaInsertExcel(data, obj) {
    var values = "", colunas = "", colunas_invisivel;

    if (data.nao_saas == 0) {
        values = data.projeto_id + ", ";
        colunas = "id_projeto, ";
    }

    for (var i = 0; i < data.coluna_inserts.length; i++) {
        if (data.coluna_inserts[i] != "") {
            values += "'" + obj[Object.keys(obj)[i]] + "'" + ",";
            colunas += data.coluna_inserts[i] + ",";
        }
    }
    if (data.colunas_invisivel && data.colunas_invisivel.trim() != "") {
        colunas_invisivel = data.colunas_invisivel.trim();
        for (var i = 0; i < colunas_invisivel.split("¦").length; i++) {
            values += "'" + colunas_invisivel.split("¦")[i].split("=")[1].trim() + "'" + ",";
            colunas += colunas_invisivel.split("¦")[i].split("=")[0].trim() + ",";
        }
    }
    return "INSERT INTO " + data.tabela + "(" + colunas.substring(0, colunas.length - 1) + ") VALUES " + "(" + values.substring(0, values.length - 1) + ")";
}

app.post("/importPlanilha/", jsonParser, function (req, res) {
    var post = req.body, insert;

    if (post.importfirstrow) {
        var obj = {};
        for (var i = 0; i < Object.keys(post.results[0]).length; i++) {
            obj[Object.keys(post.results[0])[i]] = Object.keys(post.results[0])[i];
        }
        insert = montaInsertExcel(post, obj);
        
    }

    for (var i = 0; i < 1; i++) {
        insert = montaInsertExcel(post, post.results[i]);
        
    }
    
    res.send("Inserindo..");
});

// retorna array 
app.post("/extraiQuery/", jsonParser, function (req, res) {
    var post = req.body, querys, temporaryTables;
    // querys = regex.matchAll(/(?:[Uu][Pp][Dd][Aa][Tt][Ee]|[Ss][Ee][Ll][Ee][Cc][Tt]|[Cc][Aa][Ll][Ll]|[Ii][Nn][Ss][Ee][Rr][Tt]|[Dd][Ee][Ll][Ee][Tt][Ee])(\s)(\n|.)*?;/gm, post.texto);
    // temporaryTables = regex.matchAll(/(?:[Cc][Rr][Ee][Aa][Tt][Ee] [Tt][Ee][Mm][Pp][Oo][Rr][Aa][Rr][Yy] [Tt][Aa][Bb][Ll][Ee])(\s)(.*?)([^\,]\s[^\,])/gm,post.texto);    
    // // begins = regex.matchAll(/(?:\)\sBEGIN\s))/gm,post.texto);
    // res.send({query:querys, tables:temporaryTables});
    querys = regex.matchAll(/(?:[Uu][Pp][Dd][Aa][Tt][Ee]\s(?![Oo][Nn]\s)|[Ss][Ee][Ll][Ee][Cc][Tt]\s|[Cc][Aa][Ll][Ll]\s|[Ii][Nn][Ss][Ee][Rr][Tt]\s(?![Oo][Nn]\s)|[Dd][Ee][Ll][Ee][Tt][Ee]\s(?![Oo][Nn]\s))(\n|.)*?;/gm, post.texto);
    temporaryTables = regex.matchAll(/(?:[Cc][Rr][Ee][Aa][Tt][Ee] [Tt][Ee][Mm][Pp][Oo][Rr][Aa][Rr][Yy] [Tt][Aa][Bb][Ll][Ee])(\s)(.*?)([^\,]\s[^\,])/gm, post.texto);
    begins = regex.matchAll(/(?:\)\sBEGIN\s)/gm, post.texto);
    res.send({ query: querys, tables: temporaryTables, begins: begins });
});

function montaQuery(post) {
    var tabela = "", filtro, filt, alias = "", nomeTabela,
        tipo, query, campos = "", key, campo2;

    tipo = (post.tipo == "TCELES") ? "SELECT" : (post.tipo == "ETADPU") ? "UPDATE" : (post.tipo == "GETADPU") ? "UPDATEG" : (post.tipo == "ETELED") ? "DELETE" : (post.tipo == "TRESNI") ? "INSERT" : (post.tipo == "GTRESNI") ? "INSERTG" : (post.tipo == "LLAC") ? "CALL" : "";

    if (tipo != "CALL" && post.ortlif && post.ortlif != "") {
        filt = post.ortlif;
        if (filt.oicini) {
            filt.oicini = filt.oicini.split(" dna ").join(" and ");
            filt.oicini = filt.oicini.split(" ro ").join(" or ");
            filt.oicini = filt.oicini.split(" timil ").join(" limit ");
            filt.oicini = filt.oicini.split(" yb puorg ").join(" group by ");
            filt.oicini = filt.oicini.split(" yb redro ").join(" order by ");

            filt.mif = filt.mif.split(" dna ").join(" and ");
            filt.mif = filt.mif.split(" ro ").join(" or ");
            filt.mif = filt.mif.split(" timil ").join(" limit ");
            filt.mif = filt.mif.split(" yb puorg ").join(" group by ");
            filt.mif = filt.mif.split(" yb redro ").join(" order by ");

            filtro = filt.oicini + montaQuery(filt.sub) + filt.mif;

        } else {
            filtro = filt.split(" dna ").join(" and ");
            filtro = filtro.split(" ro ").join(" or ");
            filtro = filtro.split(" timil ").join(" limit ");
            filtro = filtro.split(" yb puorg ").join(" group by ");
            filtro = filtro.split(" yb redro ").join(" order by ");
        }
    }

    if (tipo == "CALL") {
        query = "CALL " + post.morf + post.sopmac[0];
    }
    else if (tipo == "UPDATE" || tipo == "UPDATEG") {

        for (var i = 0; i < post.morf.length; i++) {
            if (typeof (post.morf[i].nome) == "string") {
                nomeTabela = post.morf[i].nome;
            }
            else {
                nomeTabela = post.morf[i].nome.oicini + montaQuery(post.morf[i].nome.sub) + post.morf[i].nome.mif;
            }
            alias = (post.morf[i].alias) ? post.morf[i].alias : "";
            if (post.morf[i].lado == "esquerda") tabela += " LEFT JOIN " + nomeTabela + " " + alias + " on " + post.morf[i].no;
            else if (post.morf[i].lado == "virgula") tabela += ", " + nomeTabela + " " + alias;
            else tabela += nomeTabela + " " + alias;
        }

        for (var i = 0; i < post.sopmac.length; i++) {
            key = (post.sopmac[i + 1]) ? ", " : "";
            if (typeof (post.sopmac[i][Object.keys(post.sopmac[i])]) == "string") {
                campos += Object.keys(post.sopmac[i]) + "=" + post.sopmac[i][Object.keys(post.sopmac[i])] + key;
            }
            else {
                console.log(JSON.stringify(post.sopmac[i]));
                campos += Object.keys(post.sopmac[i]) + "=" + post.sopmac[i][Object.keys(post.sopmac[i])].oicini + montaQuery(post.sopmac[i][Object.keys(post.sopmac[i])].sub) + post.sopmac[i][Object.keys(post.sopmac[i])].mif + key;
            }
        }
        if (tipo == "UPDATEG") {
            query = "UPDATE IGNORE " + tabela + " SET " + campos + ((filtro && filtro == "") ? "" : " WHERE " + filtro);
        } else query = "UPDATE " + tabela + " SET " + campos + ((filtro && filtro == "") ? "" : " WHERE " + filtro);
    }
    else if (tipo == "SELECT") {
        for (var i = 0; i < post.sopmac.length; i++) {
            key = (post.sopmac[i + 1]) ? ", " : "";
            if (post.sopmac[i].oicini) {
                campos += post.sopmac[i].oicini + montaQuery(post.sopmac[i].sub) + post.sopmac[i].mif + key;
            }
            else
                campos += post.sopmac[i] + key;
        }
        if (post.morf) {
            for (var i = 0; i < post.morf.length; i++) {
                if (typeof (post.morf[i].nome) == "string") {
                    nomeTabela = post.morf[i].nome;
                }
                else {
                    nomeTabela = post.morf[i].nome.oicini + montaQuery(post.morf[i].nome.sub) + post.morf[i].nome.mif;
                }
                alias = (post.morf[i].alias) ? post.morf[i].alias : "";
                if (post.morf[i].lado == "esquerda") tabela += " LEFT JOIN " + nomeTabela + " " + alias + " on " + post.morf[i].no;
                else if (post.morf[i].lado == "virgula") tabela += ", " + nomeTabela + " " + alias;
                else tabela += nomeTabela + " " + alias;
            }
            query = "SELECT " + campos + ((tabela && tabela != "") ? " FROM " + tabela + " " + ((filtro && filtro != "") ? " WHERE " + filtro : "") : "");
        } else query = "SELECT " + campos;
    }
    else if (tipo == "DELETE" && filtro != "") {
        query = "DELETE FROM " + post.morf + " " + ((filtro && filtro == "") ? "" : " WHERE " + filtro);
    }
    else if (tipo == "INSERT") {
        campo2 = (typeof (post.sopmac[1]) == "object") ? post.sopmac[1].oicini + montaQuery(post.sopmac[1].sub) + post.sopmac[1].mif : post.sopmac[1];
        console.log('INSERT' - campo2);
        query = "INSERT INTO " + post.morf + " " + post.sopmac[0] + " " + campo2;
    } else if (tipo == "INSERTG") {
        campo2 = (typeof (post.sopmac[1]) == "object") ? post.sopmac[1].oicini + montaQuery(post.sopmac[1].sub) + post.sopmac[1].mif : post.sopmac[1];
        query = "INSERT IGNORE INTO " + post.morf + " " + post.sopmac[0] + " " + campo2;
        console.log('INSERT' - campo2);
    }
    return query;
}

// post
app.post("/jsonQuery/", jsonParser, function (req, res) {
    var post = req.body;
    var query = montaQuery(post);
    var query_log;

    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");
    query = query.replace(/\❜/g, ",");
    query = query.replace(/\‿/g, " ");
    query = query.replace(/\˭/g, "=");

    if (post.script && post.script.elemento_id) {
        query_log = 'INSERT INTO node.log_script(script, usuario_id, banco, projeto_id, data, hora, tela_id, elemento_id) VALUES ("' + query + '", "' + post.script.usuario_id + '", "' + post.script.banco + '", "' + post.script.projeto_id + '", "' + post.script.data + '", "' + post.script.hora + '", "' + post.script.tela_id + '", "' + post.script.elemento_id + '")';
        connection.getConnection(function (err, connection) {
            connection.query(query_log);
            connection.release();
        });
    }

    connection.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (!err) {
                res.send({ data: rows, query: query });
            }
            else {
                res.send({ err: true, error: err.message, query: query });
            }
        });
        connection.release();
    });
});


// Enviar Email 
app.post("/sendEmail/", jsonParser, function (req, res) {
    var obj, helper, mail, emailDe, emailPara, personalization, html, content;
    obj = req.body;
    helper = require('sendgrid').mail;

    // Instanciando as classes
    mail = new helper.Mail();
    emailDe = new helper.Email(obj.emailDe, obj.nomeDe);
    personalization = new helper.Personalization();
    emailPara = new helper.Email(obj.emailPara, obj.nomePara);
    html = '<html><body>' + obj.corpo + '</body></html>';
    content = new helper.Content('text/html', html);

    // Setando os Valores
    mail.setFrom(emailDe);
    mail.setSubject(obj.titulo);
    personalization.addTo(emailPara);
    mail.addPersonalization(personalization);
    mail.addContent(content);

    // Consistencia para anexos
    // for (var i = 0; i < obj.anexo.split(",").length; i++) {
    //     if (obj.anexo.split(",")[i].trim() != "") {
    //         var attachment = new helper.Attachment(),
    //             file = fs.readFileSync(obj.anexo.split(",")[i].trim());
    //         base64File = new Buffer(file).toString('base64');
    //         attachment.setContent(base64File);
    //         attachment.setType('application/text');
    //         attachment.setFilename(obj.anexo.split(",")[i].trim());
    //         attachment.setDisposition('attachment');
    //         mail.addAttachment(attachment);
    //     }
    // }

    // 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
    var sg = require('sendgrid')("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");

    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        else {
            res.send("OK");
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
});

app.get("/sendMailPesquisa/:email/:pesquisa/:id", function (req, res) {
    var email = req.params.email,
        pesquisa = req.params.pesquisa,
        id = req.params.id;

    let transporter = nodemailer.createTransport({
        // host: 'a1-cpweb-a12.host.intranet',
        host: 'webmail.dys.com.br',
        port: 587,
        //ignoreTLS: true,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: 'faleconosco@dys.com.br',
            pass: 'isadora04'
        }
    });

    let mailOptions = {
        from: '"Pesquisa Lexus" <faleconosco@dys.com.br>', // sender address
        to: email, // list of receivers
        subject: 'Pesquisa Lexus', // Subject line
        text: 'Pesquisa Lexus!', // plain text body
        html: '<div style="text-align:center;"><img src="http://138.197.32.22/lexus/assets/dist/img/logo_lexus-big.png"></img></div><br><p>Olá, Completar esta breve pesquisa vai nos ajudar a obter os resultados para melhor atendê-lo!</p>' +
        '<p>Para acessar a Pesquisa <a href="http://dysweb.dys.com.br/lexus/pesquisaLexus.html?' + pesquisa + '?' + id + '">Clique Aqui!</a></p>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json({ error: error })
        } else {
            res.json({ info: info })
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
});

app.get("/integraAlbumFB/:pageID/:token", function (req, res) {
    var pageID = req.params.pageID,
        token = req.params.token,
        options = {
            method: 'GET',
            url: 'https://graph.facebook.com/v2.9/' + pageID + '/albums',
            qs: { access_token: token },
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})
app.post("/newAlbumFB/:pageID/:token/:nome/:desc", function (req, res) {
    var pageID = req.params.pageID,
        token = req.params.token,
        nome = req.params.nome,
        desc = req.params.desc,
        options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v2.9/' + pageID + '/albums',
            qs: {
                access_token: token,
                name: nome,
                message: desc
            },
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})
app.get("/integraFotosFB/:albumID/:token", function (req, res) {
    var albumID = req.params.albumID,
        token = req.params.token,
        options = {
            method: 'GET',
            url: 'https://graph.facebook.com/v2.9/' + albumID + '/photos',
            qs: { access_token: token }
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})
app.post("/uploadFotoFB/:token/:pageID/:alb/:url/:desc", function (req, res) {
    var token = req.params.token,
        alb = req.params.alb,
        urls = req.params.url,
        pageID = req.params.pageID,
        desc = req.params.desc,
        options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v2.9/' + alb + '/photos',
            qs: {
                access_token: token,
                url: urls,
                message: desc,
                place: pageID
            },
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})
app.get("/integraComentarioFB/:fotoID/:token", function (req, res) {
    var fotoID = req.params.fotoID,
        token = req.params.token,
        options = {
            method: 'GET',
            url: 'https://graph.facebook.com/v2.9/' + fotoID + '/comments',
            qs: { access_token: token }
        };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})

app.get("/postarFotoFB/:albumID/:urls/:desc/:token", function (req, res) {
    var albumID = req.params.albumID,
        urls = req.params.urls.replace(/½/g, "/"),
        token = req.params.token,
        desc = req.params.desc,
        options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v2.9/' + albumID + '/photos',
            qs: {
                access_token: token,
                url: urls,
                message: desc
            }
        };
    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
})

app.post("/postarTimeFB/:pageID/:img/:desc/:token", function (req, res) {
    var pageID = req.params.pageID,
        img = req.params.img.replace(/\½/g, "/"),
        desc = req.params.desc,
        token = req.params.token;

    if (img == "N") {
        var options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v2.9/' + pageID + '/feed',
            qs: {
                access_token: token,
                message: desc
            }
        };
    } else {
        var options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v2.9/' + pageID + '/photos',
            qs: {
                access_token: token,
                url: img,
                message: desc
            }
        };
    }
    request(options, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            res.json(body)
        }
    });
});

//Magento
app.post("/integraPedido/:banco/", jsonParser, function (req, res) {
    //	console.log(req.body);
    var pedido = JSON.stringify(req.body),
        banco = req.params.banco,
        query = "insert into " + banco + ".teste_procedore (teste) values ('" + pedido + "')";
    //console.log(nomeproc);
    connection.query(query, function (err, rows, fields) {
        if (!err) {
            res.json(rows);
        }
        else {
            console.log(pedido);
            res.json({ err: err });
            console.log(err);
        }
    });
});
app.get('/getPedidosMagento/:updated', function (req, res) {
    updated = req.params.updated
    magento.salesOrder.list({
        filters: {
            'updated_at': { 'gt': updated }
        }
    }, function (err, rows) {
        if (err) {
            console.log("Deu erro" + err)
            res.json(err)
        }
        else {
            //console.log(rows);
            console.log("Trouxe os Dados!");
            res.json(rows);
        }
    })
})
app.get('/getInfoPedidosMagento/:id', function (req, res) {
    id = req.params.id
    magento.salesOrder.info(
        { 'orderIncrementId': id }, function (err, rows) {
            if (err) {
                console.log("Deu Erro" + err)
            }
            else { res.json(rows) }
        });
})
app.get('/configMagento/:obj', function (req, res) {
    var obj = JSON.parse(req.params.obj)
    magento = new MagentoAPI({
        host: obj.host,
        port: obj.port,
        path: '/api/xmlrpc/',
        login: obj.login,
        pass: obj.pass
    });

    magento.login(function (err) {
        if (!err) {
            res.send("OK");
            console.log("Abriu a conexao com a Loja " + obj.host);
        }
        else {
            res.send("ERRO");
            console.log("Erro ao conectar com a Loja " + obj.host + " " + err);
        }
    });
});
//Fim Magento   

app.get('/', function (req, res) {
    res.sendfile('./www/');
});

app.listen(port, function () {
    console.log("Servidor rodando na porta 8000");
});
