/*
	NomeColunas - Nome em que preencherá o cabeçalho
	colgroup - Largura das colunas, cabecalho e dados
	model - Nome em que sera realizado para buscar os dados e procurado no array para colocar no value do input  
*/

app.directive("selectBox", function () {
    return {
        restrict: 'E',
        templateUrl: "../controller/SELECTBOX/templateSelectBox.html",
        scope: {},

        controller: function ($scope, $element, $http, $compile, $rootScope) {
            var elm = $element[0], query, tabela, campo;

            if (parseInt(elm.dataset.selectbox_combo_tabela)) {
                tabela = g$.filterTabela(elm.dataset.selectbox_combo_tabela, true);
            }
            else tabela = elm.dataset.comboTabela;

            if (parseInt(elm.dataset.selectbox_combo_campo)) {
                campo = g$.filterCampo(elm.dataset.selectbox_combo_campo);
            }
            else campo = elm.dataset.comboCampo;

            // $scope.idCombo = "combo" + elm.dataset.id;
            $scope.idCombo = "";
            $scope.coluna = campo;
            $scope.value = elm.dataset.comboGravaCampo || "id";

            if (elm.dataset.tela) {
                elm.children[1].addEventListener("focus", atualizarComboTela, false);
                elm.children[1].addEventListener("click", function (e) {
                    g$.openAndCloseCombo(true);
                }, false);
            }
            else if (elm.dataset.tableMove == "true") {
                var query, template, value = elm.dataset.comboValue,
                    campo = g$.filterCampo(elm.parentElement.dataset.combo_campo),
                    alias = g$.filterTabela(elm.parentElement.dataset.combo_tabela, false);
                filtro = (!elm.dataset.comboFiltro || elm.dataset.comboFiltro == "null") ? "" : elm.dataset.comboFiltro;
                if (elm.dataset.comboQuery) {
                    $scope.coluna = elm.parentElement.dataset.combo_campo;
                    query = elm.parentElement.dataset.comboQuery;
                }
                else query = "SELECT " + ((elm.dataset.comboGravaCampo == "" || elm.dataset.comboGravaCampo == "undefined") ? 'id' : elm.dataset.comboGravaCampo) +
                    "," + campo + " FROM " + $rootScope.user.banco + "." + tabela + " " + alias + " " + ((filtro.length) ? " WHERE " : " ") + filtro;

                query = g$.alterSargentos(query)[0];

                $http.get(URL + "/get/" + query).success(function (response) {
                    // Trata Excecao
                    g$.exceptionRequisicao("Combobox", response);

                    response = response.data;
                    if (response[0][0]) response = response[0];
                    $scope.linhas = response;
                    $http.get(URL + "/").success(function (data) {
                        // elm.children[1].focus();
                        value = (value != "") ? g$.vfyDescOption(elm.children[1], value) : "";
                        elm.children[1].value = (!value) ? "" : value;
                    });
                });
            }
            else {
                var alias = (elm.dataset.comboAlias) ? 'alias, ' : '';
                query = (elm.dataset.comboQuery) ? elm.dataset.comboQuery : "SELECT id, " + alias + campo + " FROM " + tabela;

                $http.get(URL + "/get/" + query).success(function (response) {
                    // Trata Excecao
                    g$.exceptionRequisicao("Combobox", response);

                    response = response.data;
                    if (response[0][0]) response = response[0];
                    $scope.linhas = response;
                });

                elm.children[1].addEventListener("change", function () {
                    if (elm.dataset.comboAtualizar == "1") elm.children[1].dataset.comboAlter = true;
                }, false);

                if (elm.dataset.comboAtualizar == "1") {
                    // _initCombo();
                    $("[data-id='" + elm.dataset.comboIdElemento + "']")[0].dataset.addEvento = "focus";
                }

                if (elm.dataset.addEvento == "focus") elm.children[1].addEventListener("focus", atualizar, false);
            }

            function atualizar() {
                var comboPai = $("[data-id='" + elm.dataset.comboPai + "'] #selectbox")[0];

                if (elm.dataset.tela)
                    elm.dataset.comboQuery = "SELECT * FROM " + $rootScope.user.banco + "." + tabela + " WHERE " +
                        elm.dataset.comboAtributo + " = " + comboPai.value + " group by 2";
                else elm.dataset.comboQuery = "SELECT * FROM " + tabela + " WHERE " +
                    elm.dataset.comboAtributo + " = " + comboPai.value + " group by 2";

                if (comboPai.dataset.comboAlter != "false") {
                    comboPai.dataset.comboAlter = false;
                    $compile(elm)($scope)[0];
                }
            }

            if (elm.dataset.blur) elm.children[1].onblur = $scope.$parent[elm.dataset.blur];
            if (elm.dataset.keydown) elm.children[1].onkeydown = $scope.$parent[elm.dataset.keydown];
            if (elm.dataset.change) elm.children[1].onchange = $scope.$parent[elm.dataset.change];

            if (elm.dataset.obrigatorio == "1") elm.children[1].setAttribute("required", true);
            else elm.children[1].removeAttribute("required");

            function atualizarComboTela() {

                var query, template,
                    filtro = (!elm.dataset.comboFiltro || elm.dataset.comboFiltro == "null") ? "" : elm.dataset.comboFiltro;
                if (elm.dataset.comboQuery) {
                    $scope.coluna = elm.dataset.selectbox_combo_campo;
                    query = elm.dataset.comboQuery;
                }
                else query = "SELECT " + ((elm.dataset.comboGravaCampo == "" || elm.dataset.comboGravaCampo == "undefined") ? 'id' : elm.dataset.comboGravaCampo) +
                    "," + campo + " FROM " + $rootScope.user.banco + "." + tabela + ((filtro.length) ? " WHERE " : " ") + filtro;

                query = g$.alterSargentos(query)[0];

                // Retira as TR false
                for (var i = 0; i < elm.querySelectorAll(".trFalse").length; i++) {
                    elm.querySelector(".container_combo tbody").removeChild(elm.querySelectorAll(".trFalse")[i]);
                }

                // g$.openAndCloseCombo(true);

                if (!elm.dataset.comboRequery) {
                    $http.get(URL + "/get/" + query).success(function (response) {
                        // Trata Excecao
                        g$.exceptionRequisicao("Combobx", response);

                        response = response.data;
                        if (response[0][0]) response = response[0];
                        $scope.linhas = response;
                        if (elm.dataset.comboAtualizar != "1") elm.dataset.comboRequery = true;
                    });
                }

                displayDadosProp();
            }

            // Consistencia combobox 
            g$.filterKeyDown = function (e) {
                var combo, input, linha, existe = false;
                elm = event.target.parentElement.querySelectorAll("tbody tr");
                // ALT + TAB ABRE
                if (event.keyCode == 40 && event.altKey) g$.openAndCloseCombo(true);
                // ESC ou TAB
                else if (event.keyCode == 9 || event.keyCode == 27) g$.closeAllCombos();
                else if (event.keyCode == 13) {
                    if (event.target.parentElement.querySelector(".container_combo tr")) {
                        event.target.value = event.target.parentElement.querySelector(".container_combo tr td").dataset.inner;
                        g$.closeAllCombos();

                        // Se for um combo na tabela passa para o combokeydown
                        // if (event.target.parentElement.dataset.tableMove == "true") g$.comboKEYDOWN();
                        // else {
                            // Verifica os eventos change
                            queryElementoChange = "SELECT funcao FROM elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and ef.elemento_id = " +
                                idElemento + " and evento = 'change' ORDER BY ef.ordem;"
                            $http.get(URL + "/get/" + queryElementoChange).success(function (data) {
                                // Trata Excecao
                                if (g$.exceptionRequisicao("Tela", data)) return;;

                                data.data.forEach(function (v) {
                                    var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                                        params = v.funcao;
                                    g$[funcao.trim()](params);
                                });
                            });
                        // }
                    }
                }
            }

            g$.filterKeyPress = function () {
                var idElemento = event.target.parentElement.dataset.id, queryElementoChange;
                if (event.keyCode != 13) g$.openAndCloseCombo(true);
            }

            g$.selecionarOption = function () {
                var td = event.target, queryElementoChange,
                    combo = td.parentElement.parentElement.parentElement.parentElement.parentElement,
                    elm = combo.querySelector("#selectbox"),
                    idElemento = elm.parentElement.dataset.id;
                elm.value = td.dataset.inner;
                $(".container_combo").addClass("play-none");

                // se for um combo da tabela, chama a funcao de Consistencia do combo para salvar
                // if (elm.parentElement.dataset.tableMove == "true") g$.comboKEYDOWN();

                // Chama todas as funcoes change
                queryElementoChange = "SELECT funcao FROM elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and ef.elemento_id = " +
                    idElemento + " and evento = 'change' ORDER BY ef.ordem;"
                $http.get(URL + "/get/" + queryElementoChange).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Tela", data)) return;;

                    data.data.forEach(function (v) {
                        var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                            params = v.funcao;
                        g$[funcao.trim()](params);
                    });
                });
            }

            g$.openAndCloseCombo = function (isOpened, elm) {
                var elm = (elm) ? elm : event.target;

                // Se for abrir algum, ele fecha todos os outros]
                if (event.target.id == "selectbox" && event.target.tagName == "INPUT") {
                    g$.closeAllCombos();
                    event.target.dataset.comboAtivo = 1;
                }
                else g$.closeAllCombos(true);

                if (event && event.target.classList.contains("fa-sort-desc")) {
                    if (event.target.parentElement.querySelector("#selectbox").dataset.comboAtivo == "1") {
                        event.target.parentElement.querySelector("#selectbox").dataset.comboAtivo = 0;
                        return g$.closeAllCombos();
                    }
                    else {
                        event.target.parentElement.querySelector("#selectbox").focus();
                        event.target.parentElement.querySelector("#selectbox").dataset.comboAtivo = 1;
                    }
                }

                if (elm.id == "selectbox") {
                    container = elm.parentElement.querySelector(".container_combo");
                    if (isOpened) container.classList.remove("play-none");
                    // else container.classList.add("play-none");
                    // elm.focus();
                }
            }

            g$.closeAllCombos = function (setComboAtivo) {
                var combo;
                // Se passar true, nao zera os atributos (negando para nao bugar os outros que nao estao passando)
                if (!setComboAtivo) {
                    for (var i = 0; i < $("#selectbox [data-combo-ativo='1']").length; i++) {
                        combo = $("#selectbox [data-combo-ativo='1']")[i];
                        combo.dataset.comboAtivo = 0;
                    }
                }
                $(".container_combo").addClass("play-none");
            }

        }

    }
});