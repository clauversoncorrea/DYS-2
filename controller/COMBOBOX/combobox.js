/*
	NomeColunas - Nome em que preencherá o cabeçalho
	colgroup - Largura das colunas, cabecalho e dados
	model - Nome em que sera realizado para buscar os dados e procurado no array para colocar no value do input  
*/

app.directive("comboBox", function () {
    return {
        restrict: 'E',
        templateUrl: "../controller/COMBOBOX/templateCombobox.html",
        scope: {},

        controller: function ($scope, $element, $http, $compile) {
            var elm = $element[0], query,
                inFilter = elm.querySelector("input");

            query = elm.dataset.comboQuery;

            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (response) {
                // Trata Excecao
                if (g$.exceptionRequisicao("Customizador", response)) return;;

                $scope.name_combo = elm.id;
                $scope.filtro = "";
                $scope.isOpened = false;
                $scope.linhas = response.data;
                $scope.coluna = elm.dataset.comboCampo;
                $http.get("/").success(function () {
                    elm.querySelector("input").value = elm.dataset.value;
                    elm.querySelector("input").focus();
                });
            });

            $scope.selectLine = function (linha) {
                var combo = event.target.parentElement.parentElement.parentElement.parentElement.parentElement,
                    input = combo.querySelector("input");
                if (combo.dataset.comboSelect) g$[combo.dataset.comboSelect](linha, combo);
            }

            $scope.filterKeyDown = function (e) {
                var combo, input, linha, td, existe = false;
                elm = event.target.parentElement.querySelectorAll("tbody tr");

                input = event.target;
                combo = input.parentElement;
                td = input.parentElement.parentElement;

                if (event.keyCode == 40 && event.altKey) $scope.isOpened = true;
                else if (event.keyCode == 9) {
                    $scope.isOpened = false;
                }
                else if (event.keyCode == 27) {
                    td.innerHTML = td.dataset.texto;
                }
                else if (event.keyCode == 13) {
                    $scope.isOpened = false;
                }
            }

            $scope.filterKeyPress = function () {
                if (event.keyCode == 13) {
                    var combo = event.target.parentElement,  
                        value = event.target.value;
                    return g$[combo.dataset.comboSelect](null, combo, true);
                }
                $scope.isOpened = true;
            }

        }
    };
});