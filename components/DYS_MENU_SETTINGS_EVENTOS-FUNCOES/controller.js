app.directive("eventosFuncoes", function() {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_MENU_SETTINGS_EVENTOS-FUNCOES/template.html",
        controller: function($scope, $http, $compile) {

            $scope.eventos = [];
            $scope.funcoes = [];

            // Atualiaza as duas tabelas, eventos e ações
            $scope.atualizaEventosAcoes = function() {
                $scope.atualizarEventos();
                $scope.atualizarFuncoes();
            }

            $scope.atualizarEventos = function() {
                var query = "SELECT * FROM node.evento order by id";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data)) return;
                    $scope.eventos = data.data;
                    $scope.novaLinhaEvento();
                });
            }

            $scope.novaLinhaEvento = function() {
                $scope.eventos[$scope.eventos.length] = { id: "", evento: "" };
            }

            $scope.colocaElmEvento = function() {
                var elm = event.target,
                    texto = elm.innerText,
                    template = '<combo-box data-value="' + texto + '" data-combo-select="salvarEvento" data-combo-query="SELECT * FROM node.evento" data-combo-campo="evento"></combo-box>';

                elm.dataset.texto = texto;

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName != "TD" || elm.classList.contains("cell-combo")) return;

                template = $compile(angular.element(template)[0])($scope)[0];
                elm.innerHTML = "";
                elm.appendChild(template);
            }

            // Retorno ao Selecionar um Filtro
            g$.salvarEvento = function(linha, combo) {
                var colCelula = combo.parentElement, value,
                    row = colCelula.parentElement,
                    irowTabela = row.dataset.irow;

                value = (linha) ? linha.evento : combo.querySelector("input").value;
                linha = { value: value };

                if ($scope.eventos[irowTabela].id == "") $scope.inserirEvento(linha, irowTabela);
                else $scope.alterarEvento(linha, irowTabela);
            }

            $scope.alterarEvento = function(linha, irowTabela) {
                var evento = { id: $scope.eventos[irowTabela].id, evento: linha.value };
                evento = g$.omitirPropriedade(evento);

                $http.put(URL + "/put/node.evento/", evento).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        if (data.error.indexOf("Duplicate") > 1) return Materialize.toast("Esse evento já existe", 4000, 'red darken-1');
                        else return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        $scope.eventos[irowTabela] = evento;
                        return Materialize.toast("Alterado com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            $scope.inserirEvento = function(linha, irowTabela) {
                var evento = { evento: linha.value };
                evento = g$.omitirPropriedade(evento);

                $http.post(URL + "/post/node.evento/", evento).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        if (data.error.indexOf("Duplicate") > 1) return Materialize.toast("Esse evento já existe", 4000, 'red darken-1');
                        else return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        evento.id = data.data.insertId;
                        $scope.eventos[irowTabela] = evento;
                        $scope.novaLinhaEvento();
                        return Materialize.toast("Salvo com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            // Consulta - Delete 
            $scope.deleteEvento = function(evento) {
                var tabela = $("#eventos #table-eventos")[0],
                    query = "DELETE FROM node.evento WHERE id = " + evento.id,
                    rowIndex = parseInt(event.target.parentElement.dataset.indexRow) + 1;
                if (confirm("Tem certeza que deseja fazer excluir o evento " + evento.id + "?")) {
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function(data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;;

                        $scope.eventos.forEach(function(v, i) {
                            if (v.id == evento.id) {
                                $scope.eventos.splice(i, 1);
                                tabela.deleteRow(i + 1);
                            }
                        });
                    });
                }
            }



            // Funções
            $scope.atualizarFuncoes = function() {
                var query = "SELECT * FROM node.funcao order by id";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data)) return;;

                    $scope.funcoes = data.data;
                    $scope.novaLinhaFuncao();
                });
            }

            $scope.novaLinhaFuncao = function() {
                $scope.funcoes[$scope.funcoes.length] = { id: "", funcao: "" };
            }

            $scope.colocaElmFuncao = function() {
                var elm = event.target,
                    texto = elm.innerText,
                    template = '<combo-box data-value="' + texto + '" data-combo-select="salvarFuncao" data-combo-query="SELECT * FROM node.funcao" data-combo-campo="funcao"></combo-box>';

                elm.dataset.texto = texto;

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName != "TD" || elm.classList.contains("cell-combo")) return;

                template = $compile(angular.element(template)[0])($scope)[0];
                elm.innerHTML = "";
                elm.appendChild(template);
            }

            // Retorno ao Selecionar um funcao
            g$.salvarFuncao = function(linha, combo) {
                var colCelula = combo.parentElement, value,
                    row = colCelula.parentElement,
                    irowTabela = row.dataset.irow;

                value = (linha) ? linha.funcao : combo.querySelector("input").value;
                linha = { value: value };

                if ($scope.funcoes[irowTabela].id == "") $scope.inserirFuncao(linha, irowTabela);
                else $scope.alterarFuncao(linha, irowTabela);
            }

            $scope.alterarFuncao = function(linha, irowTabela) {
                var funcao = { id: $scope.funcoes[irowTabela].id, funcao: linha.value };
                funcao = g$.omitirPropriedade(funcao);

                $http.put(URL + "/put/node.funcao/", funcao).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        if (data.error.indexOf("Duplicate") > 1) return Materialize.toast("Esse evento já existe", 4000, 'red darken-1');
                        else return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        $scope.funcoes[irowTabela] = funcao;
                        return Materialize.toast("Alterado com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            $scope.inserirFuncao = function(linha, irowTabela) {
                var funcao = { funcao: linha.value };
                funcao = g$.omitirPropriedade(funcao);

                $http.post(URL + "/post/node.funcao/", funcao).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        if (data.error.indexOf("Duplicate") > 1) return Materialize.toast("Esse evento já existe", 4000, 'red darken-1');
                        else return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        funcao.id = data.data.insertId;
                        $scope.funcoes[irowTabela] = funcao;
                        $scope.novaLinhaFuncao();
                        return Materialize.toast("Salvo com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            // Consulta - Delete 
            $scope.deleteFuncao = function(funcao) {
                var tabela = $("#eventos #table-funcoes")[0],
                    query = "DELETE FROM node.funcao WHERE id = " + funcao.id,
                    rowIndex = parseInt(event.target.parentElement.dataset.indexRow) + 1;
                if (confirm("Tem certeza que deseja fazer excluir a função " + funcao.id + "?")) {
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function(data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;;

                        $scope.funcoes.forEach(function(v, i) {
                            if (v.id == funcao.id) {
                                $scope.funcoes.splice(i, 1);
                                tabela.deleteRow(i + 1);
                            }
                        });
                    });
                }
            }

        }
    };
});