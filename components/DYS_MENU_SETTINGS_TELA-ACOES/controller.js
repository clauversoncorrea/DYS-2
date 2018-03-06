    app.directive("telaAcoes", function() {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_MENU_SETTINGS_TELA-ACOES/template.html",
        controller: function($scope, $http, $compile) {

            // Ações
            g$.requeryTelaAcoes = function() {
                $scope.telaacoes = [];
                $scope.elementoTela = { id: $("#telaacoes-head .form-control")[0].value, nome: $("#menu0 #menu" + $("#telaacoes-head .form-control")[0].value)[0].dataset.name };
                if ($scope.elementoTela.id && $scope.elementoTela.id != "") {
                    var query = "SELECT * FROM tela_funcao WHERE tela_id=" + $scope.elementoTela.id + " ORDER BY ordem";
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) { 
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;
                        $scope.telaacoes = data.data;
                        $scope.novaLinhaTelaAcao($scope.elementoTela.id);
                    });
                }
            };

            g$.limpaTelaAcoes = function() {
                $http.get("/").success(function() {
                    $scope.telaacoes = [];
                    $scope.dadosMenuTela = {};
                });
            }

            $scope.novaLinhaTelaAcao = function(idTela) {
                $scope.telaacoes[$scope.telaacoes.length] = { id: "", funcao: "", tela_id: idTela, evento: "", ordem: "", depois: "" };
            }

            $scope.colocaComboTelaAcao = function() {
                var elm = event.target,
                    texto = elm.innerText,
                    template = '<combo-box id="funcao" data-value="' + texto + '" data-combo-select="salvarFuncaoTela" data-combo-query="SELECT * FROM node.funcao" data-combo-campo="funcao"></combo-box>';

                elm.dataset.texto = texto;

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName != "TD" || elm.classList.contains("cell-combo")) return;

                template = $compile(angular.element(template)[0])($scope)[0];
                elm.innerHTML = "";
                elm.appendChild(template);
            }

            $scope.colocaElmTelaAcao = function(id) {
                var elm = event.target,
                    texto = elm.innerText,
                    input = "<input id='" + id + "' title='ESC para voltar e ENTER para Salvar' type='text' autofocus='on' class='form-control'" +
                        "onkeydown='g$.alterarOrdemDepoisTelaAcao()' data-valor='" + texto + "'>";

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName == "INPUT") return;

                elm.innerHTML = input;
                elm.querySelector("input").value = texto;
                $http.get("/").success(function() {
                    elm.querySelector("input").focus();
                });
            }

            g$.alterarOrdemDepoisTelaAcao = function() {
                var colCelula = event.target.parentElement;
                if (event.keyCode == 27) colCelula.innerHTML = event.target.dataset.texto;
                else if (event.keyCode == 13) g$.salvarFuncaoTela();
            }

            $scope.colocaComboEventoTela = function() {
                var elm = event.target,
                    texto = elm.innerText,
                    template = '<combo-box id="evento" data-value="' + texto + '" data-combo-select="salvarFuncaoTela" data-combo-query="SELECT * FROM node.evento" data-combo-campo="evento"></combo-box>';

                elm.dataset.texto = texto;

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName != "TD" || elm.classList.contains("cell-combo")) return;

                template = $compile(angular.element(template)[0])($scope)[0];
                elm.innerHTML = "";
                elm.appendChild(template);
            }

            // Retorno ao Selecionar um funcao
            g$.salvarFuncaoTela = function(linha, combo) {
                var elm = (combo) ? combo : event.target,
                    colCelula = elm.parentElement,
                    row = colCelula.parentElement,
                    irowTabela = row.dataset.irow,
                    obj;

                obj = {
                    id: "",
                    tela_id: $scope.elementoTela.id,
                    funcao: $scope.telaacoes[irowTabela].funcao,
                    evento: $scope.telaacoes[irowTabela].evento,
                    ordem: $scope.telaacoes[irowTabela].ordem
                };

                if (combo) {
                    if (linha) obj[combo.id] = linha[combo.id];
                    else obj[combo.id] = event.target.value;
                }
                else obj[event.target.id] = event.target.value;

                if ($scope.telaacoes[irowTabela].id == "") $scope.inserirFuncaoTela(obj, irowTabela);
                else {
                    obj.id = $scope.telaacoes[irowTabela].id
                    $scope.alterarFuncaoTela(obj, irowTabela);
                }
            }

            $scope.alterarFuncaoTela = function(obj, irowTabela) {
                var acaoTela = g$.omitirPropriedade(obj);

                $http.put(URL + "/put/node.tela_funcao/", acaoTela).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        $scope.telaacoes[irowTabela] = obj;
                        return Materialize.toast("Alterado com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            $scope.inserirFuncaoTela = function(obj, irowTabela) {
                var acaoTela = g$.omitirPropriedade(obj);

                $http.post(URL + "/post/node.tela_funcao/", acaoTela).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        obj.id = data.data.insertId;
                        $scope.telaacoes[irowTabela] = obj;
                        $scope.novaLinhaTelaAcao($scope.elementoTela.id);
                        return Materialize.toast("Salvo com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            // Consulta - Delete 
            $scope.deleteTelaAcao = function(telaacao) {
                var tabela = $("#acoes #table-telaacoes")[0],
                    query = "DELETE FROM node.tela_funcao WHERE id = " + telaacao.id,
                    rowIndex = parseInt(event.target.parentElement.dataset.indexRow) + 1;
                if (confirm("Tem certeza que deseja fazer excluir a ação " + telaacao.id + "?")) {
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function(data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;;

                        $scope.telaacoes.forEach(function(v, i) {
                            if ($scope.telaacoes[i].id == telaacao.id) {
                                $scope.telaacoes.splice(i, 1);
                                tabela.deleteRow(i + 1);
                            }
                        });
                    });
                }
            }

        }
    };
});