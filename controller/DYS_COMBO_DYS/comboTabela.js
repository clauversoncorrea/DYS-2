app.directive("comboTabela", function () {
    return {
        restrict: 'E',
        scope: {},

        controller: function ($scope, $element, $http, $compile, $rootScope) {
            var elm = $element[0], query, tabela, campo, elmTabela;

            if (parseInt(elm.dataset.combo_tabela)) {
                tabela = g$.filterTabela(elm.dataset.combo_tabela, true);
            }
            else tabela = elm.dataset.comboTabela;

            if (parseInt(elm.dataset.combo_campo)) {
                campo = g$.filterCampo(elm.dataset.combo_campo);
            }
            else campo = elm.dataset.comboCampo;

            $scope.idCombo = "";
            $scope.coluna = campo;
            $scope.value = elm.dataset.comboGravaCampo || "id";


            var query, template,
                filtro = (!elm.dataset.comboFiltro || elm.dataset.comboFiltro == "null") ? "" : elm.dataset.comboFiltro;

            if (elm.dataset.comboQuery) {
                $scope.coluna = campo;
                query = elm.dataset.comboQuery;
            }
            else query = "SELECT " + ((elm.dataset.comboGravaCampo == "" || elm.dataset.comboGravaCampo == "undefined") ? 'id' : elm.dataset.comboGravaCampo) +
                "," + campo + " FROM " +  ((tabela.indexOf('node.')==-1) ?$rootScope.user.banco + ".":'') + tabela + ((filtro.length) ? " WHERE " : " ") + filtro;
                      
            query = g$.alterSargentos(query)[0];

            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {

                elmTabela = $("[data-id='" + elm.parentElement.dataset.pai + "']")[0];

                if (g$.exceptionRequisicao("Combobox", data)) return;
                // variavel da linha selecionada | id da celula selecionada
                id = elmTabela.dataset.nome + "_elemento | " + elm.parentElement.dataset.id;
                data = data.data;
                // id do elemento, json, nome do popup, descricao, valor, isTela
                _initCombo(id, data, elm.dataset.nome, $scope.coluna, $scope.value, false);

            });


            g$.selecionarComboTabela = function (linha, id) {
                var td = g$[id.split("|")[0].trim()].querySelector("[data-id='"+id.split("|")[1].trim()+"']");
                td.dataset.innerHTMLantigo = td.innerHTML;
                td.dataset.valueAntigo = td.dataset.value;
                td.innerHTML = linha[Object.keys(linha)[1]] + td.querySelector("i").outerHTML;
                td.dataset.value = linha[Object.keys(linha)[0]];
                salvarTabela(false, td);    
            };

        }
    };
});