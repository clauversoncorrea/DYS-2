app.directive("elementoAcoes", function () {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_MENU_SETTINGS_ELEMENTO-ACOES/template.html",
        controller: function ($scope, $http, $compile) {

            // Ações
            g$.requeryAcoes = function () {
                $scope.acoes = [];
                $scope.elemento = { id: $("#acoes #acoesIDElemento")[0].value };
                if ($scope.elemento.id && $scope.elemento.id != "") {
                    var query = "SELECT * FROM node.elemento_funcao WHERE elemento_id=" + $scope.elemento.id + " ORDER BY ordem";
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;
                        $scope.acoes = data.data;
                        $scope.novaLinhaElementoAcao($scope.elemento.id);
                    });
                }
            };

            $scope.novaLinhaElementoAcao = function (idElemento) {
                $scope.acoes[$scope.acoes.length] = { id: "", funcao: "", elemento_id: idElemento, evento: "", ordem: "", depois: "", consulta_id: "" };
            }

            $scope.colocaComboAcao = function () {
                var elm = event.target,
                    valor = elm.innerText.replace(/"/g, '\\"'),
                    texto = valor,
                    template = '<combo-box id="funcao" data-value="' + texto + '" data-combo-select="salvarFuncaoElemento" data-combo-query="SELECT * FROM node.funcao" data-combo-campo="funcao"></combo-box>';

                elm.dataset.texto = texto;

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName != "TD" || elm.classList.contains("cell-combo")) return;

                template = $compile(angular.element(template)[0])($scope)[0];
                elm.innerHTML = "";
                elm.appendChild(template);
            }
            // $scope.colocaComboConsulta = function () {
            //     var elm = event.target,
            //         valor = elm.innerText.replace(/"/g, '\\"'),
            //         texto = valor,
            //         template = '<combo-box id="consulta" data-value="id" data-combo-select="salvarFuncaoElemento" data-combo-query="SELECT * FROM node.consulta" data-combo-campo="consulta"></combo-box>';

            //     elm.dataset.texto = texto;

            //     // Se ele clicar no input, retorna, para nao colocar outro input la
            //     if (elm.tagName != "TD" || elm.classList.contains("cell-combo")) return;

            //     template = $compile(angular.element(template)[0])($scope)[0];
            //     elm.innerHTML = "";
            //     elm.appendChild(template);
            // }

            $scope.colocaElmentoAcao = function (id) {
                var elm = event.target,
                    texto = elm.innerText,
                    input = "<input id='" + id + "' title='ESC para voltar e ENTER para Salvar' type='text' autofocus='on' class='form-control'" +
                        "onkeydown='g$.alterarOrdemDepoisAcao()' data-valor='" + texto + "'>";

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName == "INPUT") return;

                elm.innerHTML = input;
                elm.querySelector("input").value = texto;
                $http.get("/").success(function () {
                    elm.querySelector("input").focus();
                });
            }

            g$.alterarOrdemDepoisAcao = function () {
                var colCelula = event.target.parentElement;
                if (event.keyCode == 27) colCelula.innerHTML = event.target.dataset.texto;
                else if (event.keyCode == 13) g$.salvarFuncaoElemento();
            }

            $scope.colocaComboEvento = function () {
                var elm = event.target,
                    texto = elm.innerText,
                    template = '<combo-box id="evento" data-value="' + texto + '" data-combo-select="salvarFuncaoElemento" data-combo-query="SELECT * FROM node.evento" data-combo-campo="evento"></combo-box>';

                elm.dataset.texto = texto;

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName != "TD" || elm.classList.contains("cell-combo")) return;

                template = $compile(angular.element(template)[0])($scope)[0];
                elm.innerHTML = "";
                elm.appendChild(template);
            }

            // Retorno ao Selecionar um funcao
            g$.salvarFuncaoElemento = function (linha, combo) {
                var elm = (combo) ? combo : event.target,
                    colCelula = elm.parentElement,
                    row = colCelula.parentElement,
                    irowTabela = row.dataset.irow,
                    obj;

                obj = {
                    id: "",
                    elemento_id: $scope.elemento.id,
                    funcao: $scope.acoes[irowTabela].funcao,
                    evento: $scope.acoes[irowTabela].evento,
                    ordem: $scope.acoes[irowTabela].ordem,
                    consulta: $scope.acoes[irowTabela].consulta
                };

                if (combo) {
                    if (linha) obj[combo.id] = linha[combo.id];
                    else obj[combo.id] = event.target.value;
                }
                else obj[event.target.id] = event.target.value;

                if ($scope.acoes[irowTabela].id == "") $scope.inserirFuncaoElemento(obj, irowTabela);
                else {
                    obj.id = $scope.acoes[irowTabela].id
                    $scope.alterarFuncaoElemento(obj, irowTabela);
                }
            }

            $scope.alterarFuncaoElemento = function (obj, irowTabela) {
                var acaoElemento = g$.omitirPropriedade(obj);

                $http.put(URL + "/put/node.elemento_funcao/", acaoElemento).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        $scope.acoes[irowTabela] = obj;
                        return Materialize.toast("Alterado com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            $scope.inserirFuncaoElemento = function (obj, irowTabela) {
                var acaoElemento = g$.omitirPropriedade(obj);

                $http.post(URL + "/post/node.elemento_funcao/", acaoElemento).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        obj.id = data.data.insertId;
                        $scope.acoes[irowTabela] = obj;
                        $scope.novaLinhaElementoAcao($scope.elemento.id);
                        return Materialize.toast("Salvo com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            $scope.deleteAcao = function (acao) {
                var tabela = $("#acoes #table-acoes")[0],
                    query = "DELETE FROM node.elemento_funcao WHERE id = " + acao.id,
                    rowIndex = parseInt(event.target.parentElement.dataset.indexRow) + 1;
                if (confirm("Tem certeza que deseja fazer excluir a ação " + acao.id + "?")) {
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;;

                        $scope.acoes.forEach(function (v, i) {
                            if ($scope.acoes[i].id == acao.id) {
                                $scope.acoes.splice(i, 1);
                                tabela.deleteRow(i + 1);
                            }
                        });
                    });
                }
            }

        }
    };
});