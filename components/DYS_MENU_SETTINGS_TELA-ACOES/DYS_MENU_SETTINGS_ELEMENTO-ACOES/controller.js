app.directive("elementoAcoes", function() {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_MENU_SETTINGS_ELEMENTO-ACOES/template.html",
        controller: function($scope, $http, $compile) {

            // Ações
            $scope.$on("requeryAcoes", function(e, idElemento, nameTela, naoaddeventos) {
                $scope.acoes = [];
                $scope.elemento = { id: idElemento, nome: nameTela };
                var query = "SELECT * FROM elemento_funcao WHERE elemento_id=" + idElemento + " ORDER BY ordem";
                $http.get(URL + "/get/" + query).success(function(response) {
                    $scope.acoes = response;
                    var acao = { id: "", funcao: "", elemento_id: idElemento, evento: "", ordem: "" };
                    $scope.acoes[$scope.acoes.length] = acao;
                });
            });

            // Retorno ao Selecionar uma Consulta
            $scope.retDados = function(funcao, combo, evt) {
                var nameCombo = combo.id,
                    irow = nameCombo.slice(nameCombo.indexOf("-") + 1);
                value = (evt == "ENTER") ? event.target.value : event.target.innerHTML;

                value = (evt == "ESC") ? combo.querySelector("input").value : value;
                $scope.acoes[irow][combo.dataset.comboCampo] = value;
                combo.style.display = "none";
                if (evt == "ESC") return
                if ($scope.acoes[irow].id != "") $scope.alterarAcao(irow);
                else $scope.salvarAcao(irow);
            }

            $scope.alterarAcao = function(irow, acao) {
                var acao = (irow == null) ? acao : $scope.acoes[irow];
                var query = "SELECT * FROM elemento_funcao WHERE id = " + acao.id;
                $http.put(URL + "/put/elemento_funcao", acao).success(function(response) {
                    $http.get(URL + "/get/" + query).success(function(response) {
                        $scope.acoes[irow] = response[0];
                    });
                });
            }

            $scope.salvarElemento = function(acao) {
                if (event.keyCode == 13) $scope.alterarAcao(null, acao);
            }

            $scope.salvarAcao = function(irow) {
                var query;
                $scope.acao = {
                    id: "",
                    funcao: $scope.acoes[irow].funcao,
                    elemento_id: $scope.elemento.id,
                    evento: $scope.acoes[irow].evento,
                    ordem: $scope.acoes[irow].ordem,
                    consulta_id: $scope.acoes[irow].consulta_id
                };
                $http.post(URL + "/post/elemento_funcao", $scope.acao).success(function(response) {
                    query = "SELECT * FROM elemento_funcao WHERE id = " + response.insertId;
                    $http.get(URL + "/get/" + query).success(function(response) {
                        $scope.acoes[irow] = response[0];
                        $scope.acoes[$scope.acoes.length] = { id: "", funcao: "", elemento_id: $scope.elemento.id, evento: "", ordem: "", consulta_id: "" };
                    });
                });
            }

            // Consulta - Delete 
            $scope.deleteAcao = function(acao) {
                var tabela = $("#acoes #table-acoes")[0],
                    query = "DELETE FROM elemento_funcao WHERE id = " + acao.id,
                    rowIndex = parseInt(event.target.parentElement.dataset.indexRow) + 1;
                if (confirm("Tem certeza que deseja fazer excluir a ação " + acao.id + "?")) {
                    $http.delete(URL + "/delete/" + query).success(function(response) {
                        $scope.acoes.forEach(function(v, i) {
                            if ($scope.acoes[i].id == acao.id) {
                                $scope.acoes.splice(i, 1);
                                tabela.deleteRow(i + 1);
                            }
                        });
                    });
                }
            }

            // Seleciona uma linha e remove a Linha selecionada // Certo
            $scope.selecionarLinha = function(view, obj, elm) {
                var tabela = $("#filtros #table-" + view)[0],
                    elm = (!elm) ? event.target : elm, row;
                row = tabela.rows[elm.parentElement.parentElement.rowIndex];
                if (elm.type != "checkbox") $scope.addCampo('filtro', obj);
                if (tabela.querySelector("tr.blue")) {
                    tabela.querySelector("tr.blue").cells[0].children[0].checked = false;
                    tabela.querySelector("tr.blue").className = "";
                }
                row.className = 'light-blue darken-2';
            }

            // Consistência para colocar o combo e colocar a célula
            $scope.addCampoAcoes = function(prop) {
                var cell = event.target, value;
                if (cell.tagName != "TD") cell = cell.parentElement;
                if (!cell) return;
                if (cell.tagName == "COMBO-BOX") return;
                if (cell.dataset.alter != "true") return;
                if (cell.children[1]) {
                    value = cell.children[1].textContent;
                    $scope.acoes[cell.dataset.indexRow][prop] = "";
                    cell.children[0].style.display = "block";
                    cell.children[0].querySelector("input").value = value.trim();
                    cell.children[0].querySelector("input").focus();
                }
            }

        }
    };
});