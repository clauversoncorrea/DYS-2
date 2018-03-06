app.controller("checkbox", function ($scope, $http, $rootScope, $compile) {

    // FUNCAO INICIA CheckBox
    g$._initCheckbox = function (elm, filtro, idFuncao, isTela) {
        var nome = elm.dataset.nome + elm.dataset.id, template = "";
        elm.setAttribute("ng-repeat", nome + " in " + nome + "s | limitTo: 20");
        elm.dataset.obj = "{{" + nome + "}}";

        if (!elm.parentElement.dataset.template) template = atualizarTemplateCheck(elm, nome);
        template = elm.parentElement.dataset.template;
        g$.getCheckbox(elm, template, nome, filtro, idFuncao, isTela);
    }

    // FUNCAO MONTA E ATUALIZA Bloco PARA O FUNCIONAMENTO DA TABELA
    atualizarTemplateCheck = function (elm, nome) {
        var filhos = elm.querySelectorAll("[data-le_da_tabela]");

        for (var i = 0; i < filhos.length; i++) {
            if (filhos[i].dataset.le_da_tabela && filhos[i].dataset.le_da_tabela != "" && filhos[i].dataset.le_da_tabela != "null") {
                if (filhos[i].tagName == "LABEL") {
                    if (filhos[i].dataset.nome && filhos[i].dataset.nome != "") {
                        filhos[i].dataset[filhos[i].dataset.nome] = "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}";
                    }
                    var formato = g$.formato[0][filhos[i].dataset.formato];
                    formato = (!formato) ? "" : formato;
                    filhos[i].innerHTML = "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}";
                }
                else if (filhos[i].classList.contains("new_check")) {
                    var formato = g$.formato[0][filhos[i].dataset.formato];
                    formato = (!formato) ? "" : formato;
                    filhos[i].parentElement.querySelector("label").innerHTML = "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}";
                }
            }
        }

        elm.parentElement.dataset.template = elm.outerHTML;
        return elm;
    }

    // FUNÇÂO READ  
    g$.getCheckbox = function (elm, template, nome, filtro, idFuncao, isTela) {
        var keys, td, query, idBloco, queryEventsCheck, elemento_check = elm.parentElement, elementos,
            filtro = (filtro) ? filtro : "";
        
        filtro = filtro.replace(/\%/g, "‰");
        $http.get(URL + "/le/" + elm.dataset.consulta_id + "/" + $rootScope.user.banco + "/" + filtro + "/false/").success(function (data) {
            if (g$.exceptionRequisicao("ProcLe - CheckBox", data)) return;;

            $http.post(URL + "/jsonQuery/", g$.trataQuery(data.data[0][0].consulta)).success(function (data) {

                // Trata Excecao
                if (g$.exceptionRequisicao("Query CheckBox - CheckBox", data)) return;

                // Compila o template
                template = $compile(angular.element(template)[0])($scope)[0];

                if (data.data.length) {
                    $scope[nome + "s"] = data.data;

                    if (template) {
                        // template.classList.remove("play-none");
                        $("#view [data-id='" + elm.dataset.pai + "']")[0].innerHTML = ""
                        $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(template);
                    }

                    // Adiciona os HREF nos links 
                    g$.alteraChecks(elm);
                    // setAttributesCellsBloco(elm);
                    $scope.addEventosElmsCheck(elm, elemento_check);
                    // g$.vfyFuncaoDepois(idFuncao, isTela);
                }
                else {
                    elm.classList.add("play-none");
                    $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(elm);
                    // g$.vfyFuncaoDepois(idFuncao, isTela);
                }
            });
        });
    }

    g$.alteraChecks = function (elm) {
        $http.get("/").success(function (data) {
            var elms = $("[data-id='" + elm.dataset.id + "'] input.new_check");
            for (var i = 0; i < elms.length; i++) {
                elms[i].id = elms[i].id + "_" + i;
                elms[i].parentElement.querySelector("label").setAttribute("for", elms[i].id);
            }
        });
    }

    // Adiciona os eventos nos elementos da tela
    $scope.addEventosElmsCheck = function (elm, elemento_check) {
        var queryEventsCheck = "SELECT ef.*, e.menu_id FROM node.elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and e.menu_id = " +
            elm.dataset.menu_id + " AND evento_check='1' and isnull(ef.depois) ORDER BY ef.ordem";

        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryEventsCheck)).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Eventos Bloco - Bloco", data)) return;;

            data.data.forEach(function (v) {
                var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                    params = v.funcao,
                    elementos = elemento_check.querySelectorAll("input[data-id='" + v.elemento_id + "']");

                for (var i = 0; i < elementos.length; i++) {
                    elementos[i].addEventListener(v.evento, g$[funcao.trim()].bind(null, params, false), false);
                }
            });
        });
    }

});