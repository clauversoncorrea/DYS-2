var app2 = angular.module('myApp', ['ionic'])

    .run(function ($ionicPlatform, $rootScope) {

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $ionicPlatform.registerBackButtonAction(function (event) {
            if ($ionicHistory.currentStateName() === 'someStateName') {
                event.preventDefault();
            } else {
                $ionicHistory.goBack();
            }
        }, 100);

    });

const URL = "";
// const URL = "http://dys.net.br";
const syek = {
    select: "TCELES",
    update: "ETADPU",
    delete: "ETELED",
    insert: "TRESNI",
    call: "LLAC"
}
g$ = {};

g$.trataQuery = function (query) {
    var query = query.toLocaleLowerCase(),
        tipo, sopmac, morf, ortilf, arrmorf = [], arrfiltro = [], arrsopmac = [];
    key = (query.indexOf(" where ") > -1) ? " where " : (query.indexOf(" group by ") > -1) ? " group by " : (query.indexOf(" order by ") > -1) ? " order by " : (query.indexOf(" limit ") > -1) ? " limit " : "";
    ortlif = (key.trim() == "") ? "" : trataFiltro(query.substring((key.indexOf(" where ") > -1) ? query.indexOf(key) + 7 : query.indexOf(key), query.length));

    if (query.indexOf("insert") > -1) {
        tipo = syek["insert"];
        morf = query.substring(query.indexOf(" into ") + 6, query.indexOf(" ("));
        arrsopmac[0] = query.substring(query.indexOf("("), query.indexOf(")") + 1);
        arrsopmac[1] = query.substring(query.indexOf(")") + 1);
        return { tipo: tipo, sopmac: arrsopmac, morf: morf, ortlif: null };
    }
    else if (query.indexOf("call") > -1) {
        tipo = syek["call"];
        morf = query.substring(query.indexOf(" call ") + 6, query.indexOf("("));
        sopmac = query.substring(query.indexOf("("));
        return { tipo: tipo, sopmac: sopmac, morf: morf, ortlif: null };
    }
    else if (query.indexOf("update") > -1) {
        var k = 0,
            arr = [];
        tipo = syek["update"];
        morf = query.substring(query.indexOf("update") + 7, query.indexOf(" set "));
        sopmac = query.substring(query.indexOf(" set ") + 5, query.indexOf(key));
        arrmorf[0] = { nome: morf.split(" ")[0], alias: morf.split(" ")[1] };
        for (var i = 0; i < sopmac.split(",").length; i++) {
            var novapalavra = sopmac.split(",")[i];
            for (var j = i; j < sopmac.split(",").length; j++) {
                if (sopmac.split(",")[j + 1] && sopmac.split(",")[j + 1].indexOf("=") == -1) novapalavra += "," + sopmac.split(",")[j + 1];
                else { i = j; break; }
            }
            arr[k] = novapalavra;
            k++;
        }
        for (var i = 0; i < arr.length; i++) {
            arrsopmac[i] = {};
            arrsopmac[i][arr[i].split("=")[0]] = arr[i].split("=")[1];
        }
        return { tipo: tipo, sopmac: arrsopmac, morf: arrmorf, ortlif: ortlif };
    }
    else if (query.indexOf("select") > -1) {
        tipo = syek["select"];
        sopmac = query.substring(query.indexOf("select") + 7, query.indexOf(" from ")).split(",");
        morf = query.substring(query.indexOf(" from ") + 6, (key.trim() == "") ? query.length : query.indexOf(key));
        var teste;
        // ortlif = trataFiltro(query.substring((key.indexOf("where") > -1) ? query.indexOf(key) + 7 : query.indexOf(key), query.length));
        if (morf.indexOf(",") > -1) {
            arrmorf = morf.split(",");
            arrmorf[0] = { nome: arrmorf[0].split(" ")[0], alias: arrmorf[0].split(" ")[1] };
            for (var i = 1; i < arrmorf.length; i++) {
                if (i + 1 == arrmorf.length) {
                    teste = arrmorf[i].split(" left join ");
                    arrmorf[i] = { nome: teste[0].trim().split(" ")[0], alias: teste[0].trim().split(" ")[1], lado: "virgula" };
                    for (var j = 1; j < teste.length; j++) {
                        arrmorf[i + j] = teste[j].trim().split(" on ");
                        arrmorf[i + j] = { nome: arrmorf[i + j][0].split(" ")[0], alias: arrmorf[i + j][0].split(" ")[1], lado: "esquerda", no: arrmorf[i + j][1].trim() };
                    }
                    break;
                }
                else {
                    arrmorf[i] = arrmorf[i].trim().split(" , ");
                    arrmorf[i] = { nome: arrmorf[i][0].split(" ")[0], alias: arrmorf[i][0].split(" ")[1], lado: "virgula" };
                }
            }
        }
        else if (morf.indexOf("left join") > -1) {
            arrmorf = morf.split("left join");
            arrmorf[0] = { nome: arrmorf[0].split(" ")[0], alias: arrmorf[0].split(" ")[1] };
            for (var i = 1; i < arrmorf.length; i++) {
                arrmorf[i] = arrmorf[i].trim().split(" on ");
                arrmorf[i] = { nome: arrmorf[i][0].split(" ")[0], alias: arrmorf[i][0].split(" ")[1], lado: "esquerda", no: arrmorf[i][1].trim() };
            }
        }
        else {
            arrmorf[0] = { nome: morf.split(" ")[0], alias: morf.split(" ")[1] };
        }
        return { tipo: tipo, sopmac: sopmac, morf: arrmorf, ortlif: ortlif };
    }
    else if (query.indexOf("delete") > -1) {
        tipo = syek["delete"];
        morf = query.substring(query.indexOf(" from ") + 5, query.indexOf(" where "));
        return { tipo: tipo, sopmac: null, morf: morf, ortlif: ortlif };
    }
    // return {tipo: "ETADPU", sopmac: [{fantasia: "DYS"}, {teste: "NETINHO"}], morf: [{nome: "claudio", alias: "a", lado: "esquerda", no: {}}], 
    // ortlif: [{nome: "ola", valor: "1", comparador: "="}, {nome: "ola", valor: "1", comparador: "=", and: true}]}
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

// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function () {
    //   Enable to debug issues.
    //   window.plugins.OneSignal.setLogLevel({ logLevel: 4, visualLevel: 4 });

    var notificationOpenedCallback = function (jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    window.plugins.OneSignal
        .startInit("5de85e8d-d1ef-4e17-b0b6-3e0bbc4805f3")

        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();

    var ids = window.plugins.OneSignal.getIds(function (ids) {
        localStorage.app = JSON.stringify({id_one: ids.userId});
    });

    //   Call syncHashedEmail anywhere in your app if you have the user's email.
    //   This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
    //   window.plugins.OneSignal.syncHashedEmail(userEmail);
}, false);