app.directive("filtros", function() {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_MENU_SETTINGS_FILTROS/template.html",
        controller: function($scope, $http, $compile, $rootScope) {

            g$.requeryConsulta = function() {
                var query = "SELECT * FROM node.consulta WHERE tela_id=" + $("#filtros-head .form-control")[0].value;
                $scope.tela = $("#menu0 #menu" + $("#filtros-head .form-control")[0].value)[0].dataset.name;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                    if (g$.exceptionRequisicao("Customizador", data)) return;
                    $scope.consultas = data.data;
                    $scope.tabelaconsultas = [];
                    $scope.filtros = [];
                    $scope.novaLinhaConsulta();
                });
            };

            g$.limpaConsultas = function() {
                $http.get("/").success(function() {
                    $scope.consultas = [];
                    $scope.tabelaconsultas = [];
                    $scope.filtros = [];
                    $scope.dadosMenuTela = {};
                });
            }

            $scope.colocaElmconsulta = function() {
                var elm = event.target,
                    query = "SELECT * FROM node.consulta WHERE tela_id=" + $("#filtros-head .form-control")[0].value,
                    texto = elm.innerText,
                    input = "<input title='ESC para voltar e ENTER para Salvar' type='text' autofocus='on' class='form-control'" +
                        "onkeydown='g$.salvarConsulta()' data-valor='" + texto + "'>";

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName == "INPUT") return;

                elm.innerHTML = input;
                elm.querySelector("input").value = texto;
                $http.get("/").success(function() {
                    elm.querySelector("input").focus();
                });
            }

            g$.salvarConsulta = function() {
                var elm = event.target,
                    colCelula = elm.parentElement,
                    irow = colCelula.parentElement.dataset.irow,
                    consulta = angular.copy($scope.consultas[irow]);
                if (event.keyCode == 27) colCelula.innerHTML = elm.dataset.valor;

                // Valor que vai ser salvo no objeto
                consulta.consulta = elm.value;
                consulta = g$.omitirPropriedade(consulta);

                // ENTER PARA SALVAR
                if (event.keyCode == 13) {
                    // SE FOR DIFERENTE DE VAZIO, ESTÁ ALTERANDO, CASO NAO, ESTA INSERINDO
                    if (consulta.id && consulta.id != "") {
                        $http.put(URL + "/put/node.consulta", consulta).success(function(data) {
                            // Trata Excecao
                            if (g$.exceptionRequisicao("Customizador", data));

                            if (data.err) {
                                if (data.error.indexOf("Duplicate") > 1) return Materialize.toast("Já existe uma consulta com esse nome", 4000, 'red darken-1');
                                else return Materialize.toast(data.error, 4000, 'red darken-1');
                            }
                            else {
                                $scope.consultas[irow] = consulta;
                                colCelula.innerHTML = consulta.consulta;
                                return Materialize.toast("Alterado com Sucesso", 4000, 'green darken-1');
                            }
                        });
                    }
                    else {
                        $http.post(URL + "/post/node.consulta", consulta).success(function(data) {
                            // Trata Excecao
                            if (g$.exceptionRequisicao("Customizador", data));

                            if (data.err) {
                                if (data.error.indexOf("Duplicate") > 1) return Materialize.toast("Já existe uma consulta com esse nome", 4000, 'red darken-1');
                                else return Materialize.toast(data.error, 4000, 'red darken-1');
                            }
                            else {
                                consulta.id = data.data.insertId;
                                $scope.consultas[irow] = consulta;
                                colCelula.innerHTML = consulta.consulta;
                                $scope.novaLinhaConsulta();
                                return Materialize.toast("Salvo com Sucesso", 4000, 'green darken-1');
                            }
                        });
                    }
                }
            }

            // Traz todos os Filtros com o id da consulta 
            $scope.selecionaColsulta = function(consulta) {
                var consulta = consulta,
                    elm = event.target,
                    query = "SELECT * FROM node.consulta_filtro WHERE consulta_id = " + consulta.id,
                    queryConsultaTabela = "SELECT c.id, t.tabela, c.tabela_id, c.ordem FROM node.consulta_tabela c LEFT JOIN node.tabela t ON c.tabela_id = t.id WHERE consulta_id = " + consulta.id;
                if (consulta.id == "") return event.target.checked = false;

                for (var i = 0; i < $("#table-consulta [name='group3']").length; i++) {
                    $("#table-consulta [name='group3']")[i].checked = false;
                    $("#table-consulta tr").removeClass("active-consulta");
                }

                elm.parentElement.parentElement.classList.add("active-consulta");
                elm.checked = true;

                $scope.nomeconsulta = consulta.consulta.toUpperCase();

                // Filtros
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data)) return;
                    $scope.filtros = data.data;
                    $scope.novaLinhaFiltro(consulta);
                });

                // Tabelas
                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryConsultaTabela)).success(function (data) { 
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data)) return;
                    $scope.tabelaconsultas = data.data;
                    $scope.novaLinhaTabela(consulta);
                });
            }

            // Consulta - Delete 
            $scope.deleteConsulta = function(consulta) {
                if (consulta.id == "") return;

                var tabela = $("#filtros #table-consulta")[0],
                    query = "DELETE FROM node.consulta WHERE id = " + consulta.id,
                    rowIndex = parseInt(event.target.parentElement.dataset.indexRow) + 1;

                if (confirm("Tem certeza que deseja fazer excluir a consulta " + consulta.consulta + "?")) {
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function(data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;

                        $scope.consultas.forEach(function(v, i) {
                            if (v.id == consulta.id) {
                                $scope.consultas.splice(i, 1);
                                tabela.deleteRow(i + 1);
                            }

                            // Senao tiver nenhuma selecionada, limpa as dependentes
                            if (!$("#filtros #table-consulta :checked")[0]) {
                                $scope.tabelaconsultas = [];
                                $scope.filtros = [];
                            }
                        });
                    });

                }
            }

            $scope.colocaComboTabela = function() {
                var elm = event.target,
                    query = "SELECT * FROM node.consulta WHERE tela_id=" + $("#filtros-head .form-control")[0].value,
                    texto = elm.innerText,
                    template = '<combo-box data-value="' + texto + '" data-combo-select="salvarTabelaConsulta" data-combo-query="SELECT * FROM node.tabela" data-combo-campo="tabela"></combo-box>';

                elm.dataset.texto = texto;

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName != "TD" || elm.classList.contains("cell-combo")) return;

                template = $compile(angular.element(template)[0])($scope)[0];
                elm.innerHTML = "";
                elm.appendChild(template);
            }

            $scope.colocaElmordem = function() {
                var elm = event.target,
                    texto = elm.innerText,
                    input = "<input title='ESC para voltar e ENTER para Salvar' type='text' autofocus='on' class='form-control'" +
                        "onkeydown='g$.alterarOrdemTabelaConsulta()' data-valor='" + texto + "'>";

                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName == "INPUT") return;

                elm.innerHTML = input;
                elm.querySelector("input").value = texto;
                $http.get("/").success(function() {
                    elm.querySelector("input").focus();
                });
            }

            g$.alterarOrdemTabelaConsulta = function() {
                var elm = event.target,
                    colCelula = elm.parentElement,
                    irow = colCelula.parentElement.dataset.irow,
                    tabelaConsulta = angular.copy($scope.tabelaconsultas[irow]);
                if (event.keyCode == 27) colCelula.innerHTML = elm.dataset.valor;


                // ENTER PARA SALVAR
                if (event.keyCode == 13) {
                    delete tabelaConsulta.tabela;

                    // Valor que vai ser salvo no objeto
                    colCelula.innerHTML = elm.value;
                    tabelaConsulta.ordem = colCelula.innerHTML;
                    tabelaConsulta = g$.omitirPropriedade(tabelaConsulta);

                    $http.put(URL + "/put/node.consulta_tabela", tabelaConsulta).success(function(data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data));

                        if (data.err) {
                            return Materialize.toast(data.error, 4000, 'red darken-1');
                        }
                        else {
                            $scope.tabelaconsultas[irow].ordem = tabelaConsulta.ordem;
                            return Materialize.toast("Ordem alterada com Sucesso", 4000, 'green darken-1');
                        }
                    });
                }
            }

            g$.salvarTabelaConsulta = function(linha, combo, keyEnter) {
                var colCelula = combo.parentElement,
                    row = colCelula.parentElement,
                    irowTabela = row.dataset.irow,
                    irowConsulta = $("#table-consulta .active-consulta")[0].dataset.irow;

                if (keyEnter) return g$.vfyTabela(combo, event.target.value);
                else {
                    if ($scope.tabelaconsultas[irowTabela].id == "") $scope.inserirTabela(linha, irowTabela, irowConsulta);
                    else $scope.alterarTabela(linha, irowTabela, irowConsulta);
                }
            }

            g$.vfyTabela = function(combo, name) {
                var query = "select * from node.tabela where tabela = '" + name + "';";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) { 
                    var obj = { tabela: name };
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (!data.data.length) {
                        $http.post(URL + "/post/node.tabela/", obj).success(function(data) {
                            obj.id = data.data.insertId;
                            g$.salvarTabelaConsulta(obj, combo, false);
                        });
                    }
                    else g$.salvarTabelaConsulta(data.data[0], combo, false);
                });
            }

            // Alterar tabela na consulta
            $scope.alterarTabela = function(linha, irowTabela, irowConsulta) {
                var tabelaconsulta = { id: $scope.tabelaconsultas[irowTabela].id, tabela_id: linha.id, consulta_id: $scope.consultas[irowConsulta].id, ordem: $scope.tabelaconsultas[irowTabela].ordem };

                $http.put(URL + "/put/node.consulta_tabela/", tabelaconsulta).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        if (data.error.indexOf("Duplicate") > 1) return Materialize.toast("Já existe uma tabela com esse nome nessa consulta", 4000, 'red darken-1');
                        else return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        delete tabelaconsulta.tabela_id;
                        tabelaconsulta.tabela = linha.tabela;
                        $scope.tabelaconsultas[irowTabela] = tabelaconsulta;
                        return Materialize.toast("Alterado com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            // Inserir tabela na consulta
            $scope.inserirTabela = function(linha, irowTabela, irowConsulta) {

                tabelaconsulta = { id: "", tabela_id: linha.id, consulta_id: $scope.consultas[irowConsulta].id, ordem: $scope.tabelaconsultas[irowTabela].ordem };
                tabelaconsulta = g$.omitirPropriedade(tabelaconsulta);

                $http.post(URL + "/post/node.consulta_tabela/", tabelaconsulta).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        if (data.error.indexOf("Duplicate") > 1) return Materialize.toast("Já existe uma tabela com esse nome nessa consulta", 4000, 'red darken-1');
                        else return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        delete tabelaconsulta.tabela_id;
                        tabelaconsulta.id = data.data.insertId;
                        tabelaconsulta.tabela = linha.tabela;
                        $scope.tabelaconsultas[irowTabela] = tabelaconsulta;
                        $scope.novaLinhaTabela(tabelaconsulta);
                        return Materialize.toast("Salvo com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            // Deleta a tabela daquela consulta
            $scope.deleteTabelaConsulta = function(tabelaconsulta) {
                if (tabelaconsulta.id == "") return;

                var tabela = $("#tabelaConsulta #table-consulta")[0],
                    query = "DELETE FROM consulta_tabela WHERE id = " + tabelaconsulta.id,
                    rowIndex = parseInt(event.target.parentElement.dataset.indexRow) + 1;

                if (confirm("Tem certeza que deseja fazer excluir a Tabela Consulta " + tabelaconsulta.tabela + "?")) {
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function(data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;;

                        $scope.tabelaconsultas.forEach(function(v, i) {
                            if (v.id == tabelaconsulta.id) {
                                $scope.tabelaconsultas.splice(i, 1);
                                tabela.deleteRow(i + 1);
                            }
                        });
                    });
                }
            }

            $scope.colocaElmFiltro = function() {
                var elm = event.target,
                    irowConsulta = $("#filtros #table-consulta input:checked")[0].parentElement.dataset.indexRow,
                    texto = elm.innerText,
                    template = '<combo-box data-value="' + texto + '" data-combo-select="salvarFiltroConsulta" data-combo-query="SELECT * FROM node.consulta_filtro" data-combo-campo="filtro"></combo-box>';

                elm.dataset.texto = texto;
                // Se ele clicar no input, retorna, para nao colocar outro input la
                if (elm.tagName != "TD" || elm.classList.contains("cell-combo")) return;

                template = $compile(angular.element(template)[0])($scope)[0];
                elm.innerHTML = "";
                elm.appendChild(template);
            }

            // Retorno ao Selecionar um Filtro
            g$.salvarFiltroConsulta = function(linha, combo) {
                var colCelula = combo.parentElement, value,
                    row = colCelula.parentElement,
                    irowTabela = row.dataset.irow,
                    irowConsulta = $("#table-consulta .active-consulta")[0].dataset.irow;

                value = (linha) ? linha.filtro : combo.querySelector("input").value;
                linha = { value: value };

                if ($scope.filtros[irowTabela].id == "") $scope.inserirFiltro(linha, irowTabela, irowConsulta);
                else $scope.alterarFiltro(linha, irowTabela, irowConsulta);
            }

            // Altera uma linha e retorna a linha para preencher a tabela no HTML.
            $scope.alterarFiltro = function(linha, irowTabela, irowConsulta) {
                var filtro = { id: $scope.filtros[irowTabela].id, filtro: linha.value, consulta_id: $scope.consultas[irowConsulta].id };
                filtro = g$.omitirPropriedade(filtro);

                $http.put(URL + "/put/node.consulta_filtro/", filtro).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        if (data.error.indexOf("Duplicate") > 1) return Materialize.toast("Esse filtro já existe", 4000, 'red darken-1');
                        else return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        $scope.filtros[irowTabela] = filtro;
                        return Materialize.toast("Alterado com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            // Filtro - Salva uma nova linha e retorna a linha para preencher a tabela no HTML. //Certo
            $scope.inserirFiltro = function(linha, irowTabela, irowConsulta) {
                var filtro = { filtro: linha.value, consulta_id: $scope.consultas[irowConsulta].id };
                filtro = g$.omitirPropriedade(filtro);

                $http.post(URL + "/post/node.consulta_filtro/", filtro).success(function(data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data));

                    if (data.err) {
                        if (data.error.indexOf("Duplicate") > 1) return Materialize.toast("Esse filtro já existe", 4000, 'red darken-1');
                        else return Materialize.toast(data.error, 4000, 'red darken-1');
                    }
                    else {
                        filtro.id = data.data.insertId;
                        $scope.filtros[irowTabela] = filtro;
                        $scope.novaLinhaFiltro();
                        return Materialize.toast("Salvo com Sucesso", 4000, 'green darken-1');
                    }
                });
            }

            // Deletar linha na tabela
            $scope.deleteFiltro = function(filtro) {
                if (filtro.id == "") return;

                var tabela = $("#filtros #table-filtro")[0],
                    query = "DELETE FROM node.consulta_filtro WHERE id = " + filtro.id,
                    rowIndex = parseInt(event.target.parentElement.dataset.indexRow) + 1;
                if (confirm("Tem certeza que deseja fazer excluir o filtro " + filtro.id + "?")) {
                    g$.exibeQuery("Customizador", query);
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function(data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;;

                        $scope.filtros.forEach(function(v, i) {
                            if (v.id == filtro.id) {
                                $scope.filtros.splice(i, 1);
                                tabela.deleteRow(i + 1);
                            }

                            if (v.consulta_id == $rootScope.consultas_filtros[i].id) $rootScope.consultas_filtros.splice(i, 1);
                        });
                    });
                }
            }



            $scope.novaLinhaConsulta = function() {
                $scope.consultas[$scope.consultas.length] = { id: "", consulta: "", tela_id: $("#filtros-head .form-control")[0].value };
            }

            $scope.novaLinhaTabela = function(consulta) {
                $scope.tabelaconsultas[$scope.tabelaconsultas.length] = { id: "", tabela: "", consulta_id: consulta.id, ordem: "" };
            }

            $scope.novaLinhaFiltro = function(consulta) {
                $scope.filtros[$scope.filtros.length] = { id: "", filtro: "", consulta_id: consulta.id };
            }

        }
    };
});