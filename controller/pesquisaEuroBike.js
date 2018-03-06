var app = angular.module('pesquisaApp', []);
app.controller("pesquisaEuroBike", function ($scope, $http, $rootScope) {
    var idUser, idPesq
    if(window.location.href.split("?")[2]){
        idUser = window.location.href.split("?")[2]
        idPesq = window.location.href.split("?")[1]
    }else{
        window.location.href = "http://www.eurobike.com.br/"
    }

    var query = "select * from jsl.auto_pesquisa where ape_codigo=" + idPesq
    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
        $("#namePesq")[0].textContent = data[0].ape_nome
    })
    var query = "select * from jsl.auto_pesquisa_perguntas where ape_codigo=" + idPesq;
    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
        var k = data;
        k.forEach(function(v,i){
            var templatePergunta = '<div id="pergunta'+ v.app_codigo +'"><p><b><span>'+ parseInt(i + 1) +'-</span>'+ v.app_pergunta +'</b></p></div>';
            $("#perguntas")[0].innerHTML += templatePergunta
            if(v.app_nota == 1){
                trazRange(v.app_codigo);
            }else{
                trazOptions(v.app_codigo);
            }
        })
    })
    function trazOptions(id){
        var query = "select * from jsl.auto_pergunta_opcoes where app_codigo = " + id
        $("#pergunta" + id)[0].innerHTML += '<form id="for'+ id +'" action="#"></form>'
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var k = data.data
            k.forEach(function(v,i){
                var templateOption = '<p><input class="with-gap" name="gp'+ id +'" type="radio" id="op'+ v.apo_codigo +'" ng-click="selecionaOption($event)"/>' + 
                                '<label for="op'+ v.apo_codigo +'">'+ v.app_opcao +'</label></p>'
                $("#for" + id)[0].innerHTML += templateOption
                
            })
        })
    }
    function trazRange(id){
        var query = "select * from jsl.auto_pergunta_nota where app_codigo = "+ id
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var templateRange = '<form action="#" id="perg'+ id +'"><p class="range-field"><input value="0" type="range" id="rg'+ data.data[0].apn_codigo +'" min="'+ data.data[0].apn_inicio +'" max="'+ data.data[0].apn_fim +'" /></p></form>'
            $("#pergunta" + id)[0].innerHTML += templateRange
        })
    }

    $scope.savePesquisa = function(e){
        var query = "select * from jsl.auto_pesquisa_perguntas where ape_codigo = " + idPesq
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var k = data
            k.forEach(function(v,i){
                var valor
                if(v.app_nota == 1){
                    valor = $("#perg" + v.app_codigo)[0].querySelector("input").value
                }else{
                    valor = $("#for" + v.app_codigo)[0].querySelectorAll("input:checked")[0].nextElementSibling.textContent 
                }
                var query = "insert into jsl.auto_pesquisa_resposta (aus_codigo,app_codigo,ape_codigo,apr_resposta) values ("+ idUser +","+ v.app_codigo +","+ idPesq +",'"+ valor +"')";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {                 
                    $("#pesqs")[0].style.display = "none";
                    $("#agrade")[0].style.display = "block";
                    var query = "update jsl.auto_crm set "+ v.app_nome_campo_crm + "= '"+ valor +"' where aus_codigo = "+ idUser;
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        var k = data
                    })
                })
            })
        })
    }
    
});
