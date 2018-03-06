const URL = "";
// var URL = "http://dys.net.br";

const KEYPAYGOL = "gXdeOtns6R1Iex0qQ77hq8O7fRlKOcTs%2bDE5yqJkpWjggbXzfMIKfgR6kOH1L6hT1vQ193YiLer15y04yPGACvFqep2Ns2brBkjW%2bV8flwE%3d";
const URLPAYGOL = "http://pay2alldemo.azurewebsites.net/webapi";
const syek = {
    select: "TCELES",
    update: "ETADPU",
    updateg: "GETADPU",
    delete: "ETELED",
    insert: "TRESNI",
    insertg: "GTRESNI",
    call: "LLAC"
}

window.addEventListener('native.keyboardshow', function (e) {
    setTimeout(function () {
        document.activeElement.scrollIntoViewIfNeeded();
    }, 100);
});

document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown(e) {
    e.preventDefault();
    if (!g$.arrayTelas.length) return;
    else {
        if (g$.arrayTelas[g$.arrayTelas.length - 1] == "ModalCombo") g$.closeModalCust('modal-comboDYS');
        else if (g$.arrayTelas[g$.arrayTelas.length - 1] == "ModalPerfil") {
            $("#modal-perfil").modal("close");
            g$.arrayTelas = g$.arrayTelas.filter(v => v.toString() != "ModalPerfil");
        }
        else $("#view #" + g$.arrayTelas[g$.arrayTelas.length - 1] + " .fa-close")[0].click();
    }
}

var g$ = {
    isNewItemMenuTela: false,
    TABLE_ESC: false,
    elmSelected: "",
    popAtivos: [],
    memo1: "",
    memo2: "",
    memo3: "",
    memo4: "",
    memo5: "",
    desktop: 1,
    arrayTelas: []
};

g$.newElement = function () {
    var el = document.createElement(arguments[0]);
    for (var i = 1; i < arguments.length; i++) {
        el.classList.add(arguments[i]);
    }
    return el;
};

g$.trataQueryUpdate = function (tabela, obj) {
    var post = obj, propriedades = "", query, encode, valor,
        keys = Object.keys(post), name = "id", table = tabela;

    if (!post.id) name = Object.keys(post)[0];

    for (var i = 0; i < keys.length; i++) {
        encode = (keys[i + 1]) ? "," : "";
        if (post[keys[i]] == "null" || post[keys[i]] == null) valor = 'NULL';
        else if (post[keys[i]] === true || post[keys[i]] === false) valor = post[keys[i]];
        else valor = '"' + post[keys[i]] + '"';
        propriedades += keys[i] + " = " + valor + encode + " ";
    }
    query = 'UPDATE ' + table + ' SET ' + propriedades + ' WHERE ' + name + ' = ' + post[name];
    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");
    return query;
}

g$.trataQueryInsert = function (tabela, obj) {
    var post = obj, propriedades = "", valores = "", query, encode, valor,
        keys = Object.keys(post), table = tabela;

    for (var i = 0; i < keys.length; i++) {
        encode = (keys[i + 1]) ? "," : "";

        if (post[keys[i]] == "null" || post[keys[i]] == null) valor = 'NULL';
        else if (post[keys[i]] === true || post[keys[i]] === false) valor = post[keys[i]];
        else valor = '"' + post[keys[i]] + '"';
        propriedades += keys[i] + encode;
        valores += valor + encode;
    }
    query = 'INSERT INTO ' + table + ' (' + propriedades + ') VALUES (' + valores + ')';

    query = query.replace(/\½/g, "/");
    query = query.replace(/\‰/g, "%");
    return query;
}

g$.pegaSelect = function (query) {
    var y = query,
        res = y.substring(y.indexOf("(select"), y.length), cont = 1, sair = 0;
    i = 1;
    while (i < res.length && sair == 0) {
        char = res.substring(i, i + 1);
        if (char == "(") cont = cont + 1
        else if (char == ")") cont = cont - 1
        if (cont == 0) sair = 1;
        else i++;
    }
    return { oicini: y.replace('( select', '(select').split('(select')[0] + "(", sub: g$.trataQuery(res.substring(res.indexOf("(select") + 1, i + 1)), mif: res.substring(i + 1, res.length) }
}

g$.colocaFiltroSaas = function (jsonQuery) {
    b = jsonQuery;
    if (b.ortlif && b.ortlif.oicini && b.ortlif == "") b.ortlif = '1=1';
    if (b.tipo == "LLAC") {
        if (!b.sopmac[0].oicini) {
            b.sopmac[0] = b.sopmac[0].substring(0, b.sopmac[0].lastIndexOf(")")) + ", " + JSON.parse(localStorage.user).projeto_id + b.sopmac[0].substring(b.sopmac[0].lastIndexOf(")"));
        } else {
            b.sopmac[0].mif = b.sopmac[0].mif.substring(0, b.sopmac[0].mif.lastIndexOf(")")) + ", " + JSON.parse(localStorage.user).projeto_id + b.sopmac[0].mif.substring(b.sopmac[0].mif.lastIndexOf(")"));
        }
    } else {
        for (i = 0; i < b.morf.length; i++) {
            // todo: trocar user.banco por sas.
            if (typeof (b.morf[i].nome) == "string") {
                if (b.morf[i].nome.indexOf('node.') == -1 && b.morf[i].nome.indexOf('.') > -1) {
                    if (!b.morf[i].lado || b.morf[i].lado == 'virgula') {
                        var tab = ((b.morf[i].alias && b.morf[i].alias != '') ? b.morf[i].alias : b.morf[i].nome);
                        if (b.ortlif.oicini) b.ortlif.oicini = tab + '.id_projeto=' + JSON.parse(localStorage.user).projeto_id + ' and coalesce(' + tab + '._inativo,0)=0 and ' + b.ortlif.oicini;
                        else b.ortlif = tab + '.id_projeto=' + JSON.parse(localStorage.user).projeto_id + ' and coalesce(' + tab + '._inativo,0)=0 and ' + b.ortlif;
                    } else {
                        b.morf[i].no = ((b.morf[i].alias && b.morf[i].alias != '') ? b.morf[i].alias : b.morf[i].nome) + '.id_projeto=' + JSON.parse(localStorage.user).projeto_id + ' and ' + b.morf[i].no;
                    }
                }
            }
        }
    }
    return b;
}

g$.achaKey = function (query, key) {
    var res = query.toLocaleLowerCase(), cont = 0;
    i = 1;
    while (i < res.length) {
        char = res.substring(i, i + 1);
        if (char == "(") cont = cont + 1
        else if (char == ")") cont = cont - 1
        if (cont == 0) {
            if (res.substring(i, i + key.length) == key) {
                return i;
            }
        }
        i++;
    }
    return -1;
}

g$.separaMantendoParenteses = function (query, key) {
    var res = query, cont = 0, campos;
    i = 0;
    for (var i = 0; i < res.length; i++) {
        char = res.substring(i, i + 1);
        if (char == "(") cont = cont + 1
        else if (char == ")") cont = cont - 1
        if (cont > 0) {
            if (char == ",") {
                res = res.slice(0, i) + "»»" + res.slice(i + 1)
            }
        }
    }
    campos = res.split(",");
    // campos.forEach(function(elm) {
    //     elm = elm.replace(/\»»/g, ',')
    //     if (elm.indexOf('select')>-1) elm = g$.trataQuery(elm);
    // });

    for (var j = 0; j < campos.length; j++) {
        campos[j] = campos[j].replace(/\»»/g, ',').trim();
        if (campos[j].indexOf('select ') > -1) {
            var y = campos[j].replace('( select ', '(select '),
                res = y.substring(y.indexOf("(select "), y.length), cont = 1, sair = 0;
            i = 1;
            while (i < res.length && sair == 0) {
                char = res.substring(i, i + 1);
                if (char == "(") cont = cont + 1
                else if (char == ")") cont = cont - 1
                if (cont == 0) sair = 1;
                else i++;
            }
            campos[j] = { oicini: y.replace('( select ', '(select ').split('(select ')[0] + "(", sub: g$.trataQuery(res.substring(res.indexOf("(select ") + 1, i)), mif: res.substring(i, res.length) }

        }
    }

    return campos;
}

g$.pegaFiltro = function (query, key) {
    var ortlif = (key.trim() == "") ? "" : trataFiltro(query.substring((key.indexOf(" where ") > -1) ? g$.achaKey(query, key) + 7 : g$.achaKey(query, key), query.length));

    if (ortlif.indexOf('select ') > -1) {
        // var simple, sub;
        // simple = ortlif.split('select')[0];
        // sub = 'select' + ortlif.split('select')[1];
        // ortlif.sub = g$.trataQuery(sub);
        // ortlif.simple = simple;
        // ortlif = g$.pegaSelect(ortlif);
        var y = ortlif.replace('( select', '(select'),
            res = y.substring(y.indexOf("(select"), y.length), cont = 1, sair = 0;
        i = 1;
        while (i < res.length && sair == 0) {
            char = res.substring(i, i + 1);
            if (char == "(") cont = cont + 1
            else if (char == ")") cont = cont - 1
            if (cont == 0) sair = 1;
            else i++;
        }
        ortlif = { oicini: y.replace('( select', '(select').split('(select')[0] + "(", sub: g$.trataQuery(res.substring(res.indexOf("(select") + 1, i)), mif: res.substring(i, res.length) }
    }
    return ortlif;
}

g$.separaMorf = function (query) {
    var arrmorf = [], temp;
    temp = g$.separaMantendoParenteses(query);

    for (var i = 0; i < temp.length; i++) {
        if (typeof (temp[i]) == "string") {
            if (temp[i].indexOf(" left join ") > -1) {
                temp2 = temp[i].split(" left join ");
                for (var j = 0; j < temp2.length; j++) {
                    if (i == 0 && j == 0) temp2[j] = { nome: temp2[j].split(" ")[0], alias: (temp2[j].split(" ")[1]) ? temp2[j].split(" ")[1] : "" };
                    else if (i > 0 && j == 0) temp2[j] = { nome: temp2[j].split(" ")[0], alias: (temp2[j].split(" ")[1]) ? temp2[j].split(" ")[1] : "", lado: "virgula" };
                    else {
                        temp2[j] = temp2[j].trim().split(" on ");
                        temp2[j] = { nome: temp2[j][0].split(" ")[0], alias: temp2[j][0].split(" ")[1], lado: "esquerda", no: temp2[j][1].trim() };
                    }
                    arrmorf.push(temp2[j])
                }
            }
            else {
                if (i == 0) temp[i] = { nome: temp[i].split(" ")[0], alias: (temp[i].split(" ")[1]) ? temp[i].split(" ")[1] : "" }
                else temp[i] = { nome: temp[i].split(" ")[0], alias: (temp[i].split(" ")[1]) ? temp[i].split(" ")[1] : "", lado: "virgula" }
                arrmorf.push(temp[i]);
            }
        }
        else {
            temp[i].alias = temp[i].mif.split(" ")[1];
            temp[i].nome = { oicini: temp[i].oicini, sub: temp[i].sub, mif: temp[i].mif.split(" ")[0] };
            if (i > 0) temp[i].lado = "virgula";
            delete temp[i].oicini;
            delete temp[i].sub;
            delete temp[i].mif;
            arrmorf.push(temp[i]);
        }
    }
    return arrmorf;
}

g$.tiraVirgulaEntreAspas = function (query) {
    var res = query, simples = -1, dupla = -1, campos;
    i = 0;
    for (var i = 0; i < res.length; i++) {
        char = res.substring(i, i + 1);
        if (char == "'" && res.substring(i - 1, i) != '\\') simples = simples * -1;
        else if (char == "\"" && res.substring(i - 1, i) != '\\') dupla = dupla * -1;
        if (simples > 0 || dupla > 0) {
            if (char == ",") {
                res = res.slice(0, i) + "❜" + res.slice(i + 1)
            }
            else if (char == " ") {
                res = res.slice(0, i) + "‿" + res.slice(i + 1)
            }
            else if (char == "=") {
                res = res.slice(0, i) + "˭" + res.slice(i + 1)
            }
        }
    }
    //console.log(res);
    return res;
}

g$.trataQuery = function (query, semFiltro) {

    var query = g$.tiraVirgulaEntreAspas(g$.keyWords(query).replace(/\%/g, "‰")), queryTemp,
        tipo, sopmac, morf, morf_posicao, ortlif, arrmorf = [], arrfiltro = [], arrsopmac = [];

    if (!semFiltro && JSON.parse(localStorage.user).nao_saas == 1) { semFiltro = 1 }

    key = (g$.achaKey(query, " where ") > -1) ? " where " : (g$.achaKey(query, " group by ") > -1) ? " group by " : (g$.achaKey(query, " order by ") > -1) ? " order by " : (g$.achaKey(query, " limit ") > -1) ? " limit " : "";

    if (query.indexOf("insert ") > -1) {
        tipo = (query.indexOf("insert ignore") > -1) ? syek["insertg"] : syek["insert"];
        queryTemp = query.substring(query.indexOf(" into ") + 6, (query.indexOf(" select ") > -1) ? query.indexOf(" select ") : query.length).trim();
        queryTemp = queryTemp.substring(0, (queryTemp.indexOf(" values ") > -1) ? queryTemp.indexOf(" values ") : queryTemp.length).trim();
        morf = queryTemp.substring(0, (queryTemp.indexOf("(") > -1) ? queryTemp.indexOf("(") : queryTemp.length).trim();
        arrsopmac[0] = query.substring(query.indexOf("("), query.indexOf(")") + 1);
        arrsopmac[1] = query.substring((query.indexOf(" values ") > -1) ? query.indexOf(" values ") : query.indexOf(" select "), query.length);
        // if(JSON.parse(localStorage.user).banco = 'sas'){
        arrsopmac[0] = (morf.indexOf("node.") > -1 || morf.indexOf('.') == -1 || semFiltro) ? arrsopmac[0] : arrsopmac[0].substring(0, arrsopmac[0].lastIndexOf(")")) + ", id_projeto)";
        if ((typeof (arrsopmac[1]) == "string" && arrsopmac[1].indexOf('values ') > -1) || (typeof (arrsopmac[1]) != "string" && arrsopmac[1].oicini.indexOf('values ') > -1)) {
            // arrsopmac[1].forEach(function (e,i) {
            arrsopmac[1] = g$.separaMantendoParenteses(arrsopmac[1])
            for (var i = 0; i < arrsopmac[1].length; i++) {
                e = arrsopmac[1][i];
                valores = e;
                if (typeof (arrsopmac[1][0]) == "string") e = (morf.indexOf("node.") > -1 || morf.indexOf('.') == -1 || semFiltro) ? e : valores.substring(0, valores.lastIndexOf(')')) + ", " + JSON.parse(localStorage.user).projeto_id + valores.substring(valores.lastIndexOf(')'));
                else e.mif = (morf.indexOf("node.") > -1 || morf.indexOf('.') == -1 || semFiltro) ? e.mif : valores.mif.substring(0, valores.mif.lastIndexOf(')')) + ", " + JSON.parse(localStorage.user).projeto_id + valores.mif.substring(valores.mif.lastIndexOf(')'));
                // if (e.indexOf('select ', 8) > -1) {
                //     // var simple, sub;
                //     // simple = ortlif.split('select')[0];
                //     // sub = 'select' + ortlif.split('select')[1];
                //     // ortlif.sub = g$.trataQuery(sub);
                //     // ortlif.simple = simple;
                //     // ortlif = g$.pegaSelect(ortlif);
                //     var y = e.replace('( select ', '(select '),
                //         res = y.substring(y.indexOf("(select "), y.length), cont = 1, sair = 0;
                //     i = 1;
                //     while (i < res.length && sair == 0) {
                //         char = res.substring(i, i + 1);
                //         if (char == "(") cont = cont + 1
                //         else if (char == ")") cont = cont - 1
                //         if (cont == 0) sair = 1;
                //         else i++;
                //     }
                //     e = { oicini: y.split('(select ')[0] + "(", sub: g$.trataQuery(res.substring(res.indexOf("(select ") + 1, i)), mif: res.substring(i, res.length) }
                // }
                arrsopmac[1][i] = e;
            };
            arrsopmac[1] = arrsopmac[1].join(",");
        } else if ((typeof (arrsopmac[1]) == "string" && arrsopmac[1].indexOf('select ') > -1) || (typeof (arrsopmac[1]) != "string" && arrsopmac[1].oicini.indexOf('select ') > -1)) {
            valores = (morf.indexOf("node.") == -1 && morf.indexOf('.') > -1 && !semFiltro) ? arrsopmac[1].replace(" from ", ", " + JSON.parse(localStorage.user).projeto_id + " from ") : arrsopmac[1];
            arrsopmac[1] = { oicini: "", sub: g$.trataQuery(valores), mif: "" };
        }
        // }
        return { tipo: tipo, sopmac: arrsopmac, morf: morf, ortlif: null, script: { usuario_id: JSON.parse(localStorage.user).id, data: new Date().toLocaleDateString().split("/").reverse().join("-"), hora: new Date().toLocaleTimeString(), banco: JSON.parse(localStorage.user).banco, projeto_id: JSON.parse(localStorage.user).projeto_id } };
    }
    else if (query.indexOf("call ") > -1) {
        tipo = syek["call"];
        morf = query.substring(query.indexOf(" call ") + 6, query.indexOf("("));
        morf = (semFiltro && (morf.indexOf("node.") > -1 || morf.indexOf(".") == -1)) ? "node._old_" + morf.substring(morf.indexOf(".") + 1) : morf;
        sopmac = query.substring(query.indexOf("("));
        sopmac = g$.separaMantendoParenteses(sopmac);
        jsonQuery = { tipo: tipo, sopmac: sopmac, morf: morf, ortlif: null };
        // if ($rootScope.user.banco = 'sas'){
        jsonQuery = (semFiltro) ? jsonQuery : g$.colocaFiltroSaas(jsonQuery);
        //}        
        jsonQuery.script = { usuario_id: JSON.parse(localStorage.user).id, data: new Date().toLocaleDateString().split("/").reverse().join("-"), hora: new Date().toLocaleTimeString(), banco: JSON.parse(localStorage.user).banco, projeto_id: JSON.parse(localStorage.user).projeto_id };
        return jsonQuery;

    }
    else if (query.indexOf("update ") > -1) {
        var k = 0,
            arr = [];
        tipo = (query.indexOf("update ignore ") > -1) ? syek["updateg"] : syek["update"];
        morf = query.substring((query.indexOf("update ignore ") > -1) ? query.indexOf("update ignore") + 14 : query.indexOf("update") + 7, g$.achaKey(query, " set "));
        ortlif = g$.pegaFiltro(query, key);
        key = (key.length) ? g$.achaKey(query, key) : query.length;
        sopmac = query.substring(query.indexOf(" set ") + 5, key);
        sopmac = g$.separaMantendoParenteses(sopmac);
        arrmorf = g$.separaMorf(morf);

        for (var i = 0; i < sopmac.length; i++) {
            var novapalavra, a;
            arrsopmac[i] = {};
            if (typeof (sopmac[i]) == "string") {
                if (sopmac[i].split("=").length > 2) {
                    var b = sopmac[i].split("=");
                    b.splice(0, 1)
                    arrsopmac[i][sopmac[i].split("=")[0]] = b.join("=");
                }
                else arrsopmac[i][sopmac[i].split("=")[0]] = sopmac[i].split("=")[1];
            }
            else {
                a = sopmac[i].oicini.split("=");
                novapalavra = a[0].trim();
                a.splice(0, 1);
                sopmac[i].oicini = a.join("");
                arrsopmac[i][novapalavra] = sopmac[i];
            }
        }
        jsonQuery = { tipo: tipo, sopmac: arrsopmac, morf: arrmorf, ortlif: ortlif };
        // if ($rootScope.user.banco = 'sas'){
        jsonQuery = (semFiltro) ? jsonQuery : g$.colocaFiltroSaas(jsonQuery);
        //}  
        jsonQuery.script = { usuario_id: JSON.parse(localStorage.user).id, data: new Date().toLocaleDateString().split("/").reverse().join("-"), hora: new Date().toLocaleTimeString(), banco: JSON.parse(localStorage.user).banco, projeto_id: JSON.parse(localStorage.user).projeto_id }
        return jsonQuery;

    }
    else if (query.indexOf("select ") > -1) {
        tipo = syek["select"];
        if (g$.achaKey(query, " from ") > -1) {
            sopmac = g$.separaMantendoParenteses(query.substring(query.indexOf("select ") + 7, g$.achaKey(query, " from ")));
        }
        else {
            sopmac = g$.separaMantendoParenteses(query.substring(query.indexOf("select ") + 7, query.length));
            return { tipo: tipo, sopmac: sopmac, morf: null, ortlif: null }

        }
        morf = query.substring(g$.achaKey(query, " from ") + 6, (key.trim() == "") ? query.length : g$.achaKey(query, key));
        ortlif = (key.trim() == "") ? "" : trataFiltro(query.substring((key.indexOf(" where ") > -1) ? g$.achaKey(query, key) + 7 : g$.achaKey(query, key), query.length));
        if (key.indexOf(" where ") == -1) ortlif = '1=1' + ortlif;
        if (ortlif.indexOf('select ') > -1) {

            var y = ortlif.replace('( select ', '(select '),
                res = y.substring(y.indexOf("(select "), y.length), cont = 1, sair = 0;
            i = 1;
            while (i < res.length && sair == 0) {
                char = res.substring(i, i + 1);
                if (char == "(") cont = cont + 1
                else if (char == ")") cont = cont - 1
                if (cont == 0) sair = 1;
                else i++;
            }
            ortlif = { oicini: y.replace('( select ', '(select ').split('(select ')[0] + "(", sub: g$.trataQuery(res.substring(res.indexOf("(select ") + 1, i)), mif: res.substring(i, res.length) }
        }
        var teste;
        // ortlif = trataFiltro(query.substring((key.indexOf("where") > -1) ? query.indexOf(key) + 7 : query.indexOf(key), query.length));
        if (g$.achaKey(query, " from ") > -1) {
            arrmorf = g$.separaMorf(morf);

        }
        else {
            sopmac = query.substring(query.indexOf("select ") + 7, query.length).split(",");
        }
        jsonQuery = { tipo: tipo, sopmac: sopmac, morf: arrmorf, ortlif: ortlif };
        // if ($rootScope.user.banco = 'sas'){
        jsonQuery = (semFiltro) ? jsonQuery : g$.colocaFiltroSaas(jsonQuery);
        //} TODO: tratar para casos onde tenha mais de um 'where' 
        jsonQuery.script = { usuario_id: JSON.parse(localStorage.user).id, data: new Date().toLocaleDateString().split("/").reverse().join("-"), hora: new Date().toLocaleTimeString(), banco: JSON.parse(localStorage.user).banco, projeto_id: JSON.parse(localStorage.user).projeto_id }
        return jsonQuery;
    }
    else if (query.indexOf("delete ") > -1) {
        tipo = syek["delete"];
        morf = query.substring(query.indexOf(" from ") + 5, query.indexOf(" where "));
        ortlif = g$.pegaFiltro(query, key);
        // if ($rootScope.user.banco = 'sas'){
        query = 'UPDATE ' + morf + ' SET _inativo = 1 WHERE ' + ortlif;
        jsonQuery = (semFiltro || morf.indexOf("node.") > -1 || morf.indexOf(".") == -1) ? { tipo: tipo, sopmac: null, morf: morf, ortlif: ortlif } : g$.trataQuery(query)
        jsonQuery.script = { usuario_id: JSON.parse(localStorage.user).id, data: new Date().toLocaleDateString().split("/").reverse().join("-"), hora: new Date().toLocaleTimeString(), banco: JSON.parse(localStorage.user).banco, projeto_id: JSON.parse(localStorage.user).projeto_id }
        return jsonQuery;
        //}
        //return { tipo: tipo, sopmac: null, morf: morf, ortlif: ortlif };
    }
    // return {tipo: "ETADPU", sopmac: [{fantasia: "DYS"}, {teste: "NETINHO"}], morf: [{nome: "claudio", alias: "a", lado: "esquerda", no: {}}], 
    // ortlif: [{nome: "ola", valor: "1", comparador: "="}, {nome: "ola", valor: "1", comparador: "=", and: true}]}
}

g$.montaQuery = function (post) {
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

            filtro = filt.oicini + g$.montaQuery(filt.sub) + filt.mif;

        } else {
            filtro = filt.split(" dna ").join(" and ");
            filtro = filtro.split(" ro ").join(" or ");
            filtro = filtro.split(" timil ").join(" limit ");
            filtro = filtro.split(" yb puorg ").join(" group by ");
            filtro = filtro.split(" yb redro ").join(" order by ");
        }
    }

    if (tipo == "CALL") {
        if (typeof (post.sopmac[0]) == "string") {
            query = "CALL " + post.morf + post.sopmac[0];
        } else {
            query = "CALL " + post.morf + post.sopmac[0].oicini + g$.montaQuery(post.sopmac[0].sub) + post.sopmac[0].mif
        }
    }
    else if (tipo == "UPDATE" || tipo == "UPDATEG") {

        for (var i = 0; i < post.morf.length; i++) {
            if (typeof (post.morf[i].nome) == "string") {
                nomeTabela = post.morf[i].nome;
            }
            else {
                nomeTabela = post.morf[i].nome.oicini + g$.montaQuery(post.morf[i].nome.sub) + post.morf[i].nome.mif;
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
                campos += Object.keys(post.sopmac[i]) + "=" + post.sopmac[i][Object.keys(post.sopmac[i])].oicini + g$.montaQuery(post.sopmac[i][Object.keys(post.sopmac[i])].sub) + post.sopmac[i][Object.keys(post.sopmac[i])].mif + key;
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
                campos += post.sopmac[i].oicini + g$.montaQuery(post.sopmac[i].sub) + post.sopmac[i].mif + key;
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
                    nomeTabela = post.morf[i].nome.oicini + g$.montaQuery(post.morf[i].nome.sub) + post.morf[i].nome.mif;
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
        query = "DELETE " + post.morf + " " + ((filtro && filtro == "") ? "" : " WHERE " + filtro);
    }
    else if (tipo == "INSERT") {
        campo2 = (typeof (post.sopmac[1]) == "object") ? post.sopmac[1].oicini + g$.montaQuery(post.sopmac[1].sub) + post.sopmac[1].mif : post.sopmac[1];
        query = "INSERT INTO " + post.morf + " " + post.sopmac[0] + " " + campo2;
    } else if (tipo == "INSERTG") {
        campo2 = (typeof (post.sopmac[1]) == "object") ? post.sopmac[1].oicini + g$.montaQuery(post.sopmac[1].sub) + post.sopmac[1].mif : post.sopmac[1];
        query = "INSERT IGNORE INTO " + post.morf + " " + post.sopmac[0] + " " + campo2;
    }
    return query;
}

g$.keyWords = function (query) {
    query = query.replace(/[Ss][Ee][Ll][Ee][Cc][Tt]"/g, ' select "')
    query = query.replace(/[Ss][Ee][Ll][Ee][Cc][Tt]'/g, ' select \'')
    query = query.replace(/[Ss][Ee][Ll][Ee][Cc][Tt]\s/g, ' select ')
    query = query.replace(/\s[Ff][Rr][Oo][Mm]\s/g, ' from ')
    query = query.replace(/\s[Ff][Rr][Oo][Mm]'/g, ' from \'')
    query = query.replace(/\s[Ff][Rr][Oo][Mm]"/g, ' from "')
    query = query.replace(/'[Ff][Rr][Oo][Mm]\s/g, '\' from ')
    query = query.replace(/"[Ff][Rr][Oo][Mm]\s/g, '" from ')
    query = query.replace(/\s[Ww][Hh][Ee][Rr][Ee]\s/g, ' where ')
    query = query.replace(/\s[Ww][Hh][Ee][Rr][Ee]'/g, ' where \'')
    query = query.replace(/\s[Ww][Hh][Ee][Rr][Ee]"/g, ' where "')
    query = query.replace(/'[Ww][Hh][Ee][Rr][Ee]\s/g, '\' where ')
    query = query.replace(/"[Ww][Hh][Ee][Rr][Ee]\s/g, '" where ')
    query = query.replace(/[Cc][Aa][Ll][Ll]\s/g, 'call ')
    query = query.replace(/[Cc][Aa][Ll][Ll]"/g, 'call "')
    query = query.replace(/[Cc][Aa][Ll][Ll]'/g, 'call \'')
    query = query.replace(/[Ii][Nn][Ss][Ee][Rr][Tt]\s/g, 'insert ')
    query = query.replace(/[Ii][Nn][Ss][Ee][Rr][Tt]'/g, 'insert \'')
    query = query.replace(/[Ii][Nn][Ss][Ee][Rr][Tt]"/g, 'insert "')
    query = query.replace(/\s[Ii][gG][Nn][Oo][Rr][Ee]\s/g, ' ignore ')
    query = query.replace(/\s[Ii][gG][Nn][Oo][Rr][Ee]'/g, ' ignore \'')
    query = query.replace(/\s[Ii][gG][Nn][Oo][Rr][Ee]"/g, ' ignore "')
    query = query.replace(/'[Ii][gG][Nn][Oo][Rr][Ee]\s/g, '\' ignore ')
    query = query.replace(/"[Ii][gG][Nn][Oo][Rr][Ee]\s/g, '" ignore ')
    query = query.replace(/\s[Ii][Nn][Tt][Oo]\s/g, ' into ')
    query = query.replace(/\s[Ii][Nn][Tt][Oo]'/g, ' into \'')
    query = query.replace(/\s[Ii][Nn][Tt][Oo]"/g, ' into "')
    query = query.replace(/'[Ii][Nn][Tt][Oo]\s/g, '\' into ')
    query = query.replace(/"[Ii][Nn][Tt][Oo]\s/g, '" into ')
    query = query.replace(/[Uu][Pp][Dd][Aa][Tt][Ee]\s/g, 'update ')
    query = query.replace(/[Uu][Pp][Dd][Aa][Tt][Ee]'/g, 'update \'')
    query = query.replace(/[Uu][Pp][Dd][Aa][Tt][Ee]"/g, 'update "')
    query = query.replace(/[Dd][Ee][Ll][Ee][Tt][Ee]\s/g, 'delete ')
    query = query.replace(/[Dd][Ee][Ll][Ee][Tt][Ee]'/g, 'delete \'')
    query = query.replace(/[Dd][Ee][Ll][Ee][Tt][Ee]"/g, 'delete "')
    query = query.replace(/\s[Vv][Aa][Ll][Uu][Ee][Ss]\s/g, ' values ')
    query = query.replace(/\s[Vv][Aa][Ll][Uu][Ee][Ss]'/g, ' values \'')
    query = query.replace(/\s[Vv][Aa][Ll][Uu][Ee][Ss]"/g, ' values "')
    query = query.replace(/'[Vv][Aa][Ll][Uu][Ee][Ss]\s/g, '\' values ')
    query = query.replace(/"[Vv][Aa][Ll][Uu][Ee][Ss]\s/g, '" values ')

    query = query.replace(/\s[Vv][Aa][Ll][Uu][Ee]\s/g, ' values ')
    query = query.replace(/\s[Vv][Aa][Ll][Uu][Ee]'/g, ' values \'')
    query = query.replace(/\s[Vv][Aa][Ll][Uu][Ee]"/g, ' values "')
    query = query.replace(/'[Vv][Aa][Ll][Uu][Ee]\s/g, '\' values ')
    query = query.replace(/"[Vv][Aa][Ll][Uu][Ee]\s/g, '" values ')

    query = query.replace(/\s[Gg][Rr][Oo][Uu][Pp]\s[Bb][Yy]\s/g, ' group by ')
    query = query.replace(/\s[Gg][Rr][Oo][Uu][Pp]\s[Bb][Yy]'/g, ' group by \'')
    query = query.replace(/\s[Gg][Rr][Oo][Uu][Pp]\s[Bb][Yy]"/g, ' group by "')
    query = query.replace(/'[Gg][Rr][Oo][Uu][Pp]\s[Bb][Yy]\s/g, '\' group by ')
    query = query.replace(/"[Gg][Rr][Oo][Uu][Pp]\s[Bb][Yy]\s/g, '" group by ')
    query = query.replace(/\s[Oo][Rr][Dd][Ee][Rr]\s[Bb][Yy]\s/g, ' order by ')
    query = query.replace(/\s[Oo][Rr][Dd][Ee][Rr]\s[Bb][Yy]'/g, ' order by \'')
    query = query.replace(/\s[Oo][Rr][Dd][Ee][Rr]\s[Bb][Yy]"/g, ' order by "')
    query = query.replace(/'[Oo][Rr][Dd][Ee][Rr]\s[Bb][Yy]\s/g, '\' order by ')
    query = query.replace(/"[Oo][Rr][Dd][Ee][Rr]\s[Bb][Yy]\s/g, '" order by ')
    query = query.replace(/\s[Ll][Ee][Ff][Tt]\s[Jj][Oo][Ii][Nn]\s/g, ' left join ')
    query = query.replace(/\s[Ll][Ee][Ff][Tt]\s[Jj][Oo][Ii][Nn]'/g, ' left join \'')
    query = query.replace(/\s[Ll][Ee][Ff][Tt]\s[Jj][Oo][Ii][Nn]"/g, ' left join "')
    query = query.replace(/'[Ll][Ee][Ff][Tt]\s[Jj][Oo][Ii][Nn]\s/g, '\' left join ')
    query = query.replace(/"[Ll][Ee][Ff][Tt]\s[Jj][Oo][Ii][Nn]\s/g, '" left join ')
    query = query.replace(/\s[Aa][Nn][Dd]\s/g, ' and ')
    query = query.replace(/\s[Aa][Nn][Dd]'/g, ' and \'')
    query = query.replace(/\s[Aa][Nn][Dd]"/g, ' and "')
    query = query.replace(/"[Aa][Nn][Dd]\s/g, '" and ')
    query = query.replace(/'[Aa][Nn][Dd]\s/g, '\' and ')
    query = query.replace(/\s[Or][Rr]]\s/g, ' or ')
    query = query.replace(/\s[Or][Rr]]'/g, ' or \'')
    query = query.replace(/\s[Or][Rr]]"/g, ' or "')
    query = query.replace(/'[Or][Rr]]\s/g, '\' or ')
    query = query.replace(/"[Or][Rr]]\s/g, '" or ')
    query = query.replace(/\s[Ss][Ee][Tt]\s/g, ' set ')
    query = query.replace(/\s[Ss][Ee][Tt]'/g, ' set \'')
    query = query.replace(/\s[Ss][Ee][Tt]"/g, ' set "')
    query = query.replace(/'[Ss][Ee][Tt]\s/g, '\' set ')
    query = query.replace(/"[Ss][Ee][Tt]\s/g, '" set ')
    query = query.replace(/\s[Oo][Nn]\s/g, ' on ')
    query = query.replace(/\s[Oo][Nn]'/g, ' on \'')
    query = query.replace(/\s[Oo][Nn]"/g, ' on "')
    query = query.replace(/"[Oo][Nn]\s/g, '" on ')
    query = query.replace(/'[Oo][Nn]\s/g, '\' on ')
    query = query.replace(/\s[Ll][Ii][Mm][Ii][Tt]\s/g, ' limit ')
    query = query.replace(/\s[Ll][Ii][Mm][Ii][Tt]'/g, ' limit \'')
    query = query.replace(/\s[Ll][Ii][Mm][Ii][Tt]"/g, ' limit "')
    query = query.replace(/'[Ll][Ii][Mm][Ii][Tt]\s/g, '\' limit ')
    query = query.replace(/"[Ll][Ii][Mm][Ii][Tt]\s/g, '" limit ')
    return query;
}

// 16/10 a 20/10

g$.testeSelect = function (post) {
    var campos = "", keys, alias, tabela = "", query, filtro;

    filtro = post.ortlif;
    filtro = filtro.split(" dna ").join(" and ");
    filtro = filtro.split(" or ").join(" ro ");
    filtro = filtro.split(" timil ").join(" limit ");
    filtro = filtro.split(" yb puorg ").join(" group by ");
    filtro = filtro.split(" yb redro ").join(" order by ");

    for (var i = 0; i < post.sopmac.length; i++) {
        keys = (post.morf[i + 1]) ? ", " : "";
        campos += post.sopmac[i] + keys;
    }
    for (var i = 0; i < post.morf.length; i++) {
        keys = (post.morf[i + 1]) ? ", " : "";
        alias = (post.morf[i].alias) ? post.morf[i].alias : "";
        if (post.morf[i].lado) tabela += post.morf[i].nome + " " + alias + " LEFT JOIN " + post.morf[i].no + keys;
        else tabela += post.morf[i].nome + " " + alias + keys;
    }
    return query = "SELECT " + campos + " FROM " + tabela + " WHERE " + filtro;
}

function trataFiltro(filtro) {
    // ORDER BY, LIMIT, GROUP BY, DESC, AND, OR
    filtro = filtro.split(" and ").join(" dna ");
    filtro = filtro.split(" or ").join(" ro ");
    filtro = filtro.split(" limit ").join(" timil ");
    filtro = filtro.split(" group by ").join(" yb puorg ");
    filtro = filtro.split(" order by ").join(" yb redro ");

    return filtro;
}

function _initDate() {
    var elm = $("[data-id='" + event.target.dataset.id + "']");
    elm.focus();
}

g$.setValuesCombo = function (view, obj) {
    var combo, tr, keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        $("#" + view + " [data-id='" + keys[i] + "'] #selectbox")[0].value = obj[keys[i]];
    }
}

g$.getValuesCombo = function (view, obj) {
    var combo = {}, elm,
        keys = Object.keys(obj),
        combos = $("#" + view + " select-box");
    for (var i = 0; i < combos.length; i++) {
        combo[combos[i].dataset.nameCombo] = combos[i].querySelector("#selectbox").value;
    }
    return angular.extend(combo, obj);
}

g$.hasError = function (container) {
    var elm,
        valid1 = container.querySelector(":invalid"),
        valid2 = container.querySelector(".invalid");
    if (valid1 && valid2) {
        if (parseInt(valid1.dataset.ordem) > parseInt(valid2.dataset.ordem)) elm = valid1;
        else elm = valid2;
    }
    else if (valid1) elm = valid1;
    else if (valid2) elm = valid2;
    return elm;
};

g$.array_formato = ["DD_MM_YYYY", "DD-MM-YYYY", "YYYY_MM_DD", "DD_MM_YYYY h:mm:ss", "h:mm"];
g$.mantem_mascara = ["R$ Money", "Money", "Peso", "Altura", "Time", "Date Time"];

g$.formpagpaygo = {
    "credito": 21,
    "debito": 22
};

g$.formato = [
    {
        "DD_MM_YYYY": " | date : 'dd/MM/yyyy'",
        "DD-MM-YYYY": " | date : 'dd-MM-yyyy'",
        "YYYY_MM_DD": " | date : 'yyyy/MM/dd'",
        "DD_MM_YYYY h:mm:ss": " | date: 'dd/MM/yyyy HH:mm:ss'",
        "h:mm": " | date: 'HH:mm'",
        "Time": '00:00:00',
        "Date Time": "00/00/0000 00:00:00",
        "Date": "00/00/0000",
        "Cep": "00000-000",
        "Telefone": "0000-0000",
        "Telefone DDD": "(00) 0000-0000",
        "Celular": "00000-0000",
        "Celular DDD": "(00) 00000-0000",
        "CNS": "000000000000000",
        "CPF": "000.000.000-00",
        "RG": "00.000.000-0",
        "Inscricao Estadual": "000.000.000.000",
        "CNPJ": "00.000.000/0000-00",
        "Money": "#.##0,00",
        "R$ Money": "#.##0,00",
        "Peso": "#.000",
        "Altura": "#.000",
        "PA": "00mmHg",
        "FC": "000bpm",
        "Glicemia": "000mg/dl",
        "Temperatura": "00°C"
    }
]

g$.popHelp = function () {
    alert("Help em manutenção");
}


g$.urlObj = function (url) {
    var url = url.slice(1).split("&"), obj = {};
    for (var i = 0; i < url.length; i++) {
        obj[url[i].split("=")[0].trim()] = (url[i].split("=")[0].trim() == "foto" && url[0].split("=")[1] == "FACE") ? url[i].slice(5) + "&" + url[4] : url[i].split("=")[1].replace("%20", " ");
    }
    return obj;
}

g$.formataPeso = function () {

    var v = this.value, integer = v.split('.')[0];
    v = v.replace(/\D/, "");
    v = v.replace(/^[0]+/, "");
    v = v.substring(0, 6);
    if (v.length <= 3 || !integer) {
        if (v.length === 1) v = '0.00' + v;
        if (v.length === 2) v = '0.0' + v;
        if (v.length === 3) v = '0.' + v;
    } else {
        v = v.replace(/^(\d{1,})(\d{3})$/, "$1.$2");
    }

    this.value = v;
}

addEventListener("keydown", function (e) {
    // Sargento = alt + 1
    if (event.altKey && event.keyCode == "49") {
        if (event.target.tagName == "INPUT") {
            event.target.value += "»";
        }
    }

    // Parametro = alt + 1
    if (event.altKey && event.keyCode == "50") {
        if (event.target.tagName == "INPUT") {
            event.target.value += "¦";
        }
    }

    // Barra = alt + 3
    if (event.altKey && event.keyCode == "51") {
        if (event.target.tagName == "INPUT") {
            event.target.value += "½";
        }
    }

    // Porcentagem = alt + 4
    if (event.altKey && event.keyCode == "52") {
        if (event.target.tagName == "INPUT") {
            event.target.value += "‰";
        }
    }

    if (event.ctrlKey && event.altKey && event.keyCode == "76") {
        $('#modal-log').modal('open');
    }

    if (event.ctrlKey && event.altKey && event.keyCode == "8") {
        var user = JSON.parse(localStorage.user);
        user.id = user.logado.id;
        user.banco = user.logado.banco;
        user.projeto = user.logado.projeto;
        user.projeto_id = user.logado.projeto_id;
        user.nao_saas = user.logado.nao_saas;
        localStorage.user = JSON.stringify(user);
        location.reload();
    }

});

// Nova data
g$.validaData = function () {
    var v = this.value.split('-'), date;
    if (this.value.length >= 10) {
        date = v[0].substring(0, 4) + '-' + v[1] + '-' + v[2];
        this.value = date;
    }
}
g$.formataData = function (data) {
    data = new Date(data);
    return dataFormatada = data.getFullYear() + "-" + ("0" + (data.getMonth() + 1)).substr(-2) + "-" + ("0" + data.getDate()).substr(-2);
}

g$.formataDateTime = function (data) {
    var data = new Date(data);
    return data.toLocaleDateString() + " " + data.toLocaleTimeString();
}

// Formata a data no formato do mySql
g$.formataDataBanco = function (data) {
    var data = data.split(" ")
    return data[0].split("/").reverse().join("-") + ((data[1]) ? " " + data[1] : "");
}

g$.formataDataBarra = function (data) {
    return data.split("-").reverse().join("/");
}

// Formata data para tabela 
g$.formataDataCell = function (data) {
    return new Date(data).toLocaleDateString();
}

// Mostra os dados na tela
g$.controllerToview = function (obj, user) {
    var keys = Object.keys(obj), elm, query, tabela, campo, tr;
    for (var i = 0; i < keys.length; i++) {
        elm = $("#view [data-id='" + keys[i].slice(2, keys[i].length) + "']")[0];
        if (elm) {
            if (elm.dataset.tipo == "date-time" && obj[keys[i]] != 'null')
                elm.value = (obj[keys[i]]) ? "" : g$.formataDateTime(obj[keys[i]]);
            else if (elm.dataset.tipo == "date" && obj[keys[i]] != 'null') {
                elm.value = (!obj[keys[i]]) ? "" : g$.formataData(obj[keys[i]]);
            }
            else if (elm.type == "checkbox") elm.checked = obj[keys[i]];
            else if (elm.id == "selectbox") {
                if (elm.dataset.comboQuery) {
                    var valor = (!obj[keys[i]]) ? "" : obj[keys[i]];
                    g$.getValorComboBanco(elm, valor);
                    elm.querySelector("#selectbox").dataset.value = valor;
                }
                else {
                    elm.querySelector("#selectbox").dataset.value = (!obj[keys[i]]) ? "" : obj[keys[i]].split("¿")[0];
                    elm.querySelector("#selectbox").value = (!obj[keys[i]]) ? "" : obj[keys[i]].split("¿")[1];
                }
            }
            else if ((elm.id == "label") && obj[keys[i]] != 'null') {
                if (elm.dataset.formato && elm.dataset.formato != "" && elm.dataset.formato != "null") {
                    elm.innerHTML = $(elm).masked((!obj[keys[i]]) ? "" : obj[keys[i]]);
                }
                else elm.innerHTML = (!obj[keys[i]]) ? "" : obj[keys[i]];
            }
            else if (elm.id == "link" && elm.dataset.texto != "") {
                elm.innerHTML = obj[keys[i]];
                hrefLink(obj, elm);
            }
            else if (elm.dataset.tipo == "file") elm.parentElement.querySelectorAll("input")[1].value = obj[keys[i]];
            else if (elm.id == "imagem") {
                if (obj[keys[i]] && obj[keys[i]].split("http")[1]) {
                    elm.src = obj[keys[i]];
                }
                else if (!obj[keys[i]] || obj[keys[i]] == "" || obj[keys[i]] == "null") {
                    elm.src = "http://dysweb.dys.com.br/img/sem-imagem.jpg";
                }
                else {
                    elm.src = "http://54.233.66.37/" + user.projeto + "/" + obj[keys[i]];
                }
            }
            else {
                if (elm.dataset.formato && elm.dataset.formato != "" && elm.dataset.formato != "null") {
                    if (elm.dataset.formato == "Money" || elm.dataset.formato == "R$ Money") {
                        if (obj[keys[i]].toString() != "") elm.value = g$.setValorFormatado(obj[keys[i]]);
                    }
                    else elm.value = (!obj[keys[i]]) ? "" : $(elm).masked(obj[keys[i]]);
                }
                else elm.value = (obj[keys[i]] == null || obj[keys[i]] == undefined) ? "" : obj[keys[i]];
            }
        }
    }
}

g$.setValorFormatado = function (valor) {
    var val = (valor.toString().indexOf(".") == -1) ? valor.toString() + ".00" : parseFloat(valor).toFixed(2);
    num = val.substring(0, val.indexOf(".")),
        c = num.length, y = "";
    for (j = 0; j < (c / 3); j++) {
        y = num.substring(c - ((j + 1) * 3), c - (j * 3)) + "." + y;
    }
    num = y.substring(0, y.length - 1);
    val = num + "," + val.substring(val.indexOf(".") + 1, val.length)
    return val;
}

g$.openIframe = function (src) {
    document.body.innerHTML += "<iframe id='iframe01' class='iframe' src='" + src + "'></iframe>";
    $("#closeIframe").removeClass("play-none");
}

g$.openModalCust = function (id) {
    var id = (!id) ? event.target.id : id;
    $('#' + id).modal('open');
}

g$.closeModalCust = function (id) {
    var id = (!id) ? event.target.id : id;
    $('#' + id).modal('close');
    $('#' + id)[0].classList.remove("play-block");
    if (id == "modal-comboDYS") g$.arrayTelas = g$.arrayTelas.filter(v => v.toString() != "ModalCombo");
}

g$.closeIframe = function (src) {
    document.body.removeChild($("#iframe01")[0]);
    $("#closeIframe").addClass("play-none");
}

g$.omitirPropriedade = function (obj) {
    var keys = Object.keys(obj), elm;
    for (var i = 0; i < keys.length; i++) {
        if (obj[keys[i]] === null || obj[keys[i]] === 'null' || obj[keys[i]] === '') delete obj[keys[i]];
    }
    return obj;
}

g$.openLink = function (link) {
    // if (link.indexOf(".pdf") > 0) {
    //     var ref = window.open(link, '_system', 'location=yes');
    //     ref.addEventListener('loadstart', function () {
    //         console.log("START");
    //     });
    // }
    // else {
    //     var ref = window.open(link, '_blank', 'location=yes');
    //     ref.addEventListener('loadstart', function () {
    //         console.log("START");
    //     });
    // }
    window.open(link, '_blank');
}

// Modal icone
g$.selecionarIcone = function (e) {
    var elm = event.target, classe;
    classe = elm.classList.contains("btn") ? elm.children[0].classList[1] : elm.classList[1];
    $("#propriedades .play-block #icone")[0].value = classe;
    $('#modal-icone').modal('close');
}

// Funcoes do Popup
g$.requeryAcoesTela = function () {
    var elm = event.target.parentElement.parentElement;
    elm = elm.classList.contains("card-header") ? elm.parentElement : elm;

    $("#filtros-head .form-control")[0].value = elm.dataset.tela;
    $("#telaacoes-head .form-control")[0].value = elm.dataset.tela;
}