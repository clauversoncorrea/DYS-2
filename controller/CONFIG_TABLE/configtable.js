app.controller("configtable", function ($scope, $http, $rootScope) {

    g$._initConfigTabela = function (elm) {

        $scope.configtables = [];
        var teste = [];

        var cellsTbody = elm.tBodies[0].rows[0].cells;
        var cell, vfyData = ["DD_MM_YYYY", "DD-MM-YYYY", "YYYY_MM_DD"];

        for (var i = 0; i < cellsTbody.length; i++) {
            cell = cellsTbody[i];
            if (cell.id == "td") {
                teste[teste.length] =
                    {
                        tabela_id: elm.dataset.id,
                        coluna_id: cell.dataset.id,
                        nome_tabela: elm.dataset.nome,
                        le_do_campo: cell.dataset.le_do_campo,
                        le_do_campo_id: cell.dataset.le_do_campo_id,
                        nome_coluna: cell.dataset.texto,
                        tipo_elemento: cell.dataset.tipo,
                        intervalo: (cell.dataset.intervalo == "1"),
                        visivel: true,
                        filtro: "",
                        ate: "",
                        ordem: "",
                        sentido: "",
                        total: ""
                    }
            }
        }
        var query = "SELECT coluna_id, visivel FROM node.elemento_nao_visivel WHERE tabela_id = " + elm.dataset.id + " AND user_id = " + g$.user.id;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            data.data.forEach(function (coluna, i) {
                for (var i = 0; i < teste.length; i++) {
                    if (coluna.coluna_id == teste[i].coluna_id) {
                        teste[i].visivel = (coluna.visivel) ? true : false;
                        break;
                    }
                };
            });
            $scope.configtables = teste;
        });
        $scope.coluna = "";

        $http.get(URL + "/").success(function () {
            $('#popconfigtable [data-tipo="date"]').datepicker({
                orientation: "auto left",
                format: "dd/mm/yyyy",
                language: "pt-BR"
            });
        });
    };

    $scope.limparFiltro = function () {
        $scope.configtables[i].filtro = "";
        $scope.configtables[i].ate = "";
        $scope.configtables[i].sentido = "";
        $scope.configtables[i].ordem = "";
    }

    $scope.carregaData = function () {
        $http.get(URL + "/").success(function () {
            $('#popconfigtable [data-tipo="date"]').datepicker({
                orientation: "auto left",
                format: "dd/mm/yyyy",
                language: "pt-BR"
            });
        });
    }

    $scope.consultarTabela = function (e) {
        var elm_tabela = $("#view [data-id='" + $scope.configtables[0].tabela_id + "']")[0],
            filtro_tabela = "", filtro, ate, arrOrdem = [], orderBY = " ORDER BY ", sentido;

        for (var i = 0; i < $scope.configtables.length; i++) {
            if ($scope.configtables[i].filtro != "" || $scope.configtables[i].ate != "") {

                if ($scope.configtables[i].tipo_elemento == "date") {
                    filtro = g$.formataDataBanco($scope.configtables[i].filtro);
                }
                else filtro = $scope.configtables[i].filtro;

                // if ($scope.configtables[i].filtro.length == 10) filtro = $scope.configtables[i].filtro;
                // else filtro = ($scope.configtables[i].tipo_elemento === "date") ? g$.formataDataBanco($scope.configtables[i].filtro) : $scope.configtables[i].filtro;

                if ($scope.configtables[i].intervalo) {

                    if ($scope.configtables[i].ate != "") {

                        if (filtro_tabela == "")
                            filtro_tabela += "»" + $scope.configtables[i].le_do_campo_id + "» BETWEEN '" + filtro + "'";
                        else
                            filtro_tabela += " AND »" + $scope.configtables[i].le_do_campo_id + "» BETWEEN '" + filtro + "'";


                        if ($scope.configtables[i].tipo_elemento == "date") {
                            ate = g$.formataDataBanco($scope.configtables[i].ate);
                        }
                        else ate = $scope.configtables[i].ate;
                        // if ($scope.configtables[i].ate.length == 10) ate = $scope.configtables[i].ate;
                        // else ate = () ? g$.formataData($scope.configtables[i].ate) : $scope.configtables[i].ate;

                        filtro_tabela += " AND '" + ate + "'";
                    }

                    else {
                        if (filtro_tabela == "")
                            filtro_tabela += "»" + $scope.configtables[i].le_do_campo_id + "» = '" + filtro + "'";
                        else
                            filtro_tabela += " AND »" + $scope.configtables[i].le_do_campo_id + "» = '" + filtro + "'";
                    }

                }

                else {
                    // Se ele for diferente de inteiro colocamos um like
                    filtro = (!parseInt(filtro)) ? "LIKE‰" + filtro + "‰" : filtro;
                    if (filtro_tabela == "")
                        filtro_tabela += "»" + $scope.configtables[i].le_do_campo_id + ((filtro.indexOf("LIKE") > -1) ? "»|" + filtro + "|" : "» = |" + filtro + "|");
                    else
                        filtro_tabela += " AND »" + $scope.configtables[i].le_do_campo_id + ((filtro.indexOf("LIKE") > -1) ? "» |" + filtro + "|" : "» = |" + filtro + "|");
                }

            }

            // array com ordem
            if ($scope.configtables[i].ordem != "") arrOrdem[$scope.configtables[i].ordem] = $scope.configtables[i];
        }

        for (var i = 0; i < arrOrdem.length; i++) {
            if (arrOrdem[i]) {
                orderBY += "»" + arrOrdem[i].le_do_campo_id + "» " + arrOrdem[i].sentido + ((arrOrdem[i + 1]) ? "," : "");
            }
        }

        filtro_tabela = (orderBY.length > 10) ? filtro_tabela + orderBY : filtro_tabela;

        $("#modal-configtable").modal("close");
        requeryTabelaFiltro(elm_tabela, filtro_tabela);
    }

    $scope.salvarPerfil = function () {
        $scope.configtables.forEach(function (v, i) {
            var tds = $("[data-id='" + v.coluna_id + "']"),
                tabela = tds[0].parentElement.parentElement.parentElement,
                th = tabela.querySelectorAll("th")[tds[0].cellIndex];
            if (!v.visivel) {
                tds.addClass("play-none");
                th.classList.add("play-none");
            }
            else {
                tds.removeClass("play-none");
                th.classList.remove("play-none");
            }
        });

        $("#modal-configtable").modal("close");

        $scope.configtables.forEach(function (v, i) {
            var query = "INSERT INTO node.elemento_nao_visivel (tabela_id, coluna_id, visivel, user_id) VALUES (" + $scope.configtables[i].tabela_id + ", " + $scope.configtables[i].coluna_id + " , " + $scope.configtables[i].visivel + " , " + g$.user.id + ");";
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                query = "UPDATE node.elemento_nao_visivel SET tabela_id = " + $scope.configtables[i].tabela_id + ", coluna_id = " + $scope.configtables[i].coluna_id + " , visivel = " + $scope.configtables[i].visivel + " , visivel = " + $scope.configtables[i].visivel + " , user_id = " + g$.user.id + " WHERE user_id = " + g$.user.id + " AND coluna_id = " + $scope.configtables[i].coluna_id;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim()));
            });
        });
    }

});