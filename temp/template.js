var app = angular.module('myApp', []);

// const URL = "http://dysweb.dys.com.br";
const URL = "";
if (!g$) var g$ = {};

g$.urlObj = function (url) {
    var url = url.split("?")[1],
        url = url.split("&"), obj = {};
    for (var i = 0; i < url.length; i++) {
        obj[url[i].split("=")[0].trim()] = url[i].split("=")[1].replace("%20", " ");
    }
    return obj;
}

app.controller("inicial", function ($scope, $http, $rootScope) {

    g$.queryTemplate = function (query, callback) {
        var query = query.trim();
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            
            if(query.indexOf("call") > -1){
                data = data.data[0];
                if (!data) return;
                
            }else{
                data = data.data;

                if (!data) return;

                if (data[0]) data[0] = (data[0][0]) ? data[0][0] : data[0];
            }


            if(callback) callback(data);

        });
    }

});


/**
 * ADCIONAR NO HTML
 * <html ng-app="myApp">
 * <body ng-controller="inicial">
 * <div ng-controller="template"> -- Contianer, pai de todos
 
 
 * ADICIONAR NA CONTROLLER TEMPLATE  
 
app.controller("template", function ($scope, $http, $rootScope) {
    
    // Funcao para carregar a query
    g$.queryTemplate("select * from node.usuario", function (data) {
        console.log(data);
    });

});

*/

/**
 * 1.0 Gerar o arquivo template.js (template(Apenas com os modals que tem no elemento.funcao do projeto))
 * 1.1 Gerar arquivo atualiza funcao do modal (se nao tiver o if daquele modal ele coloca, senao sobrepoe)
 * 1.2 Toda vez que gerar uma tela e modal faz o 1.0
 * 1.3 Quando gerar o modal vai pra pasta modals raiz e quando for app colocar os modals do template.js no app
 * 1.4 Mudar o close do modal quando gerar, passar o nome tela
 * 1.5 Reduzir HTML - se o atributo estiver null não coloca (verificar se pode quebrar, e tratar)
 * 1.6 Mundar o le_da_tabela e outros ao invés de trazer o id, trazer o nome 
 * 1.7 Inicial.html
 * 1.8 Rotas
 * 1.9 abas
 */