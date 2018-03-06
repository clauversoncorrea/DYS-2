app.directive("teste", function () {
    return {
        restrict: 'E',
        templateUrl: "../controller/DYS_COMBO_DYS/template.html",
        scope: {},

        controller: function ($scope, $element, $http, $compile, $rootScope) {
            var elm = $element[0], query, tabela, campo;

            if (elm.dataset.combo_tabela) {
                tabela = g$.filterTabela(elm.dataset.combo_tabela, true);
            }
            else tabela = elm.dataset.comboTabela;

            if (elm.dataset.combo_campo) {
                campo = g$.filterCampo(elm.dataset.combo_campo);
            }
            else campo = elm.dataset.comboCampo;

            if (elm.dataset.obrigatorio == "1") elm.querySelector("input").required = true;
            if (elm.dataset.bloqueado == "1") elm.querySelector("input").disabled = true;
            if (elm.dataset.largura && elm.dataset.largura != "") {
                elm.querySelector("input").style.width = elm.dataset.largura + "%";
            }

            $scope.idCombo = "";
            $scope.coluna = campo;
            $scope.value = elm.dataset.comboGravaCampo || "id";

            g$.openCombo = function () {
                var query, template, elm = event.target.parentElement,
                    filtro = (!elm.dataset.comboFiltro || elm.dataset.comboFiltro == "null") ? "" : elm.dataset.comboFiltro;

                if (elm.dataset.combo_tabela) {
                    tabela = g$.filterTabela(elm.dataset.combo_tabela, true);
                }
                else tabela = elm.dataset.comboTabela;

                if (elm.dataset.combo_campo) {
                    campo = g$.filterCampo(elm.dataset.combo_campo);
                }
                else campo = elm.dataset.comboCampo;

                idCombo = "";
                coluna = campo;
                value = elm.dataset.comboGravaCampo || "id";

                if (elm.dataset.bloqueado == "1") return;

                if (elm.dataset.comboQuery) {
                    coluna = elm.dataset.combo_campo;
                    query = elm.dataset.comboQuery;
                }
                else query = "SELECT " + ((!elm.dataset.comboGravaCampo) ? 'id' : elm.dataset.comboGravaCampo) +
                    "," + campo + " FROM " + ((tabela.indexOf('node.') == -1) ? $rootScope.user.banco + "." : '') + tabela + ((filtro.length) ? " WHERE " : " ") + filtro;

                console.log(g$.alterSargentos(query)[0]);
                query = g$.alterSargentos(query)[0];

                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {

                    if (g$.exceptionRequisicao("Combobox", data)) return;
                    id = elm.dataset.id;
                    data = (data.data[0] && data.data[0][0]) ? data.data[0] : data.data;
                    // id do elemento, json, nome do popup, descricao, valor, isTela
                    _initCombo(id, data, elm.dataset.nome, coluna, value, true);

                });
            }

            g$.selecionarComboTela = function (linha, id) {
                if ($("[data-id='" + id + "']")[0]) {
                    $("[data-id='" + id + "'] #selectbox")[0].value = linha[Object.keys(linha)[1]];
                    $("[data-id='" + id + "'] #selectbox")[0].dataset.value = linha[Object.keys(linha)[0]];
                    onComboChange(id);
                }
                else g$.selecionarLinhaCombo(true);
            };

            function onComboChange(id) {
                // Chama todas as funcoes change
                var queryElementoChange = "SELECT funcao FROM node.elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and ef.elemento_id = " +
                    id + " and evento = 'change' and isnull(ef.depois) ORDER BY ef.ordem;"
                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryElementoChange.trim())).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Tela", data)) return;;

                    data.data.forEach(function (v) {
                        var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                            params = v.funcao;
                        g$[funcao.trim()](params);
                    });
                });
            }

            // Monta a query para buscar a descricao no banco de acordo com o valor que ta vindo e atualiza no Combobox 
            g$.getValorComboBanco = function (elemento, valor) {

                elemento.querySelector("#selectbox").dataset.value = valor;

                var campo, tabela, query, chave, banco_tabela;

                tabela = g$.filterTabela(elemento.dataset.combo_tabela, true);
                campo = (elemento.dataset.combo_campo) ? g$.filterCampo(elemento.dataset.combo_campo) : elemento.dataset.combo_campo;
                chave = elemento.dataset.comboGravaCampo || "id";
                banco_tabela = (tabela.indexOf('.') > -1) ? tabela : $rootScope.user.banco + "." + tabela;

                query = "SELECT " + campo + " FROM " + banco_tabela + " WHERE " + chave + " = '" + valor + "'";

                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {

                    if (g$.exceptionRequisicao("Combobox", data)) return;
                    data = data.data;

                    if (data.length) elemento.querySelector("#selectbox").value = data[0][campo];
                    // onComboChange(elemento.dataset.id);
                });

            }

        }
    };
});