app.directive("linhaprop", function () {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_PROP_LINHA/template.html",
        controller: function ($scope, $http, $rootScope, $compile) {

            $scope.search = {};
            $scope.customizador = { isCliente: false };
            var propriedadeID = "";

            $scope.requeryElementosCliente = function () {
                $scope.requeryElementos();
            }

            $scope.requeryElementos = function () {
                if (!$scope.getIDMenuItem()) return;
                var query = ($scope.customizador.isCliente) ? g$.selectElementosCliente($scope.getIDMenuItem()) : g$.selectElementosNode($scope.getIDMenuItem());

                $scope.search = { id: "" };
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data)) return;

                    $scope.propriedadesElementos = data.data;
                });
            }

            $scope.selecionarCelulaProp = function (cell) {
                var elm = (cell) ? cell : event.target;
                if ($(".table-customizador .border-cell-table")[0])
                    $(".table-customizador .border-cell-table")[0].classList.remove("border-cell-table");

                if (elm.children[0] && elm.children[0].tagName == "INPUT") {
                    elm.children[0].focus();
                }
                else elm.focus();

                elm.classList.add("border-cell-table");
            }

            // Move Table 
            moveTableProp = function (e) {
                var elm = event.target, cellIndex, rowIndex, linhas;

                if (elm.tagName == "INPUT" && elm.type == "checkbox") {
                    if (event.keyCode == 32) {
                        elm.checked = !elm.checked;
                        alterarCheckProp();
                    }
                    elm = elm.parentElement;
                }

                cellIndex = elm.cellIndex;
                rowIndex = elm.parentElement.rowIndex;
                linhas = $(".table-customizador tr");

                if (event.keyCode == 39) moveCelulaRightProp(linhas, rowIndex, cellIndex); // MOVE RIGHT
                else if (event.keyCode == 37) moveCelulaLeftProp(linhas, rowIndex, cellIndex); // MOVE LEFT
                else if (event.keyCode == 40) moveCelulaBottomProp(linhas, rowIndex, cellIndex); // MOVE BOTTOM
                else if (event.keyCode == 38) moveCelulaTopProp(linhas, rowIndex, cellIndex); // MOVE TOP
                else if (event.keyCode == 13) colocaElementoProp(); // Colocar Elemento dentro da celula;
            }

            function moveCelulaLeftProp(linhas, rowIndex, cellIndex) {
                if (linhas[rowIndex - 1] && linhas[rowIndex - 1].cells[0].tagName != "TH")
                    $scope.selecionarCelulaProp(linhas[rowIndex - 1].querySelectorAll("td")[cellIndex]);
            }

            function moveCelulaTopProp(linhas, rowIndex, cellIndex) {
                if (linhas[rowIndex] && linhas[rowIndex].querySelectorAll("td")[cellIndex - 2]) $scope.selecionarCelulaProp(linhas[rowIndex].querySelectorAll("td")[cellIndex - 1]);
            }

            function moveCelulaBottomProp(linhas, rowIndex, cellIndex) {
                if (linhas[rowIndex]) $scope.selecionarCelulaProp(linhas[rowIndex].querySelectorAll("td")[cellIndex + 1]);
            }

            function moveCelulaRightProp(linhas, rowIndex, cellIndex) {
                if (linhas[rowIndex + 1]) $scope.selecionarCelulaProp(linhas[rowIndex + 1].querySelectorAll("td")[cellIndex]);
            }

            function colocaElementoProp(e) {
                var input, combo, query, tipo,
                    cell = (event.target.tagName == "TD") ? event.target : event.target.parentElement,
                    row = cell.parentElement,
                    id_elemento = row.cells[1].innerHTML;

                // Se ja tiver um elemento dentro, retorna
                if (cell.children.length) return;

                if (cell.dataset.input_ativo == "true") {
                    tipo = (cell.dataset.tipo) ? cell.dataset.tipo : "text";
                    input = "<input class='form-control' type='" + tipo + "'>";
                    cell.dataset.valor = cell.innerHTML.trim();
                    cell.innerHTML = input;
                    cell.children[0].focus();
                    cell.children[0].value = cell.dataset.valor;
                    cell.children[0].addEventListener("keydown", inputKeyDownProp.bind(null, cell, row, id_elemento), false);
                }
                else if (cell.dataset.combo_dys == "true") {
                    var template = angular.element($.combo[0][cell.dataset.combo_nome])[0];
                    cell.dataset.valor = cell.innerHTML.trim();
                    cell.innerHTML = "";
                    cell.append(template);
                    cell.children[0].focus();
                    template.addEventListener("keydown", inputKeyDownProp.bind(null, cell, row, id_elemento), false);
                }
                else if (cell.dataset.combo_ativo == "true") {
                    combo = "<select id='selectbox' class='form-control'> <option value=''> </option> <option value='{{linha.id}}' ng-repeat='linha in linhas'> {{linha." + cell.dataset.coluna + "}} </option> </select>";
                    cell.dataset.valor = cell.innerHTML.trim();
                    cell.innerHTML = "";
                    cell.append($compile(angular.element(combo)[0])($scope)[0]);
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(cell.dataset.query)).success(function (data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;;

                        $scope.linhas = data.data;
                        cell.children[0].focus();
                        cell.children[0].addEventListener("keydown", inputKeyDownProp.bind(null, cell, row, id_elemento), false);
                    });
                }
                else if (cell.dataset.combo_ativo_atualiazar == "true") {
                    combo = "<select id='selectbox' class='form-control'> <option value=''> </option> <option value='{{linha.id}}' ng-repeat='linha in linhas'> {{linha." + cell.dataset.coluna + "}} </option> </select>";
                    cell.dataset.valor = cell.innerHTML.trim();
                    cell.innerHTML = "";
                    query = cell.dataset.query.split("»")[0] + "'" + row.querySelector("td[data-nome='" + cell.dataset.query.split("»")[1] + "']").innerHTML.trim() + "'";
                    cell.append($compile(angular.element(combo)[0])($scope)[0]);
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;;

                        $scope.linhas = data.data;
                        cell.children[0].focus();
                        cell.children[0].addEventListener("keydown", inputKeyDownProp.bind(null, cell, row, id_elemento), false);
                    });
                }
            }

            function inputKeyDownProp(cell, row, id_elemento) {
                if (event.keyCode == 27) {
                    event.target.parentElement.focus();
                    event.target.parentElement.innerHTML = event.target.parentElement.dataset.valor;
                }
                else if (event.keyCode == 13) salvarProp(cell, row, id_elemento);
            }

            alterarCheckProp = function () {
                var elm = event.target,
                    cell = elm.parentElement,
                    row = cell.parentElement,
                    id_elemento = row.cells[1].innerHTML;

                salvarProp(cell, row, id_elemento);
            }

            function salvarProp(cell, row, id_elemento) {
                var obj = {}, coluna, tabela,
                    elm = $("#view [data-id='" + id_elemento.trim() + "']")[0],
                    query = ($scope.customizador.isCliente) ? g$.selectElementoCliente(id_elemento) : g$.selectElementoNode(id_elemento);

                obj.id = id_elemento.trim();
                tabela = ($scope.customizador.isCliente) ? $rootScope.user.banco + ".elemento" : "node.elemento";

                // Se tiver um filho vai pegar o valor do elemento
                if (cell.children) {

                    if (cell.children[0].id == "selectbox") {
                        if (cell.children[0].value.trim() != "") {
                            coluna = (cell.dataset.coluna == "tabela") ? "le_da_tabela" : (cell.dataset.coluna == "campo") ? "le_do_campo" : "consulta_id";
                            if (cell.dataset.coluna == "tabela") texto = cell.children[0].querySelector("[value='" + cell.children[0].value + "']").innerHTML.trim();
                            else if (cell.dataset.coluna == "campo") texto = cell.children[0].querySelector("[value='" + cell.children[0].value + "']").innerHTML.trim();
                            else texto = cell.children[0].querySelector("[value='" + cell.children[0].value + "']").innerHTML.trim();
                            // texto = $("[data-name-combo='" + coluna + "'] #selectbox option[value='" + cell.children[0].value.trim() + "']")[0].dataset.inner;
                        }
                        else texto = "";
                    }
                    else texto = cell.children[0].value.trim();

                    if (cell.children[0].type == "checkbox") obj[cell.dataset.nome] = cell.children[0].checked;
                    else if (cell.children[0].value.trim() && cell.children[0].value.trim() != "") {
                        obj[cell.dataset.nome] = cell.children[0].value.trim();
                    }
                    else obj[cell.dataset.nome] = null;
                }

                if ($scope.customizador.isCliente) $scope.salvarElementoCliente(query, tabela, obj, cell, elm);
                else $scope.salvarElementoNode(query, tabela, obj, cell, elm);

            }

            $scope.salvarElementoCliente = function (query, tabela, obj, cell, elm) {
                var camposCli = ($rootScope.user.nao_saas) ? " e.*" : " null, " + $rootScope.user.projeto_id + ", 0, e.*",
                    queryClienteInsert = "INSERT IGNORE INTO " + $rootScope.user.banco + ".elemento SELECT " + camposCli + " FROM node.elemento e WHERE id = '" + obj.id + "'";

                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryClienteInsert, 1)).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data)) return;

                    if(JSON.parse(localStorage.user).nao_saas == 0) obj.id_projeto = JSON.parse(localStorage.user).projeto_id;

                    $http.put(URL + "/put/" + tabela, obj).then(function (data) {
                        data = data.data;

                        // Trata Excecao
                        if (g$.exceptionRequisicao("Customizador", data)) return;

                        Materialize.toast('Salvo com Sucesso!', 4000, 'green darken-1');
                        if (cell.children[0].type == "checkbox") {
                            cell.classList.add("border-cell-table");
                            cell.children[0].focus();
                        }
                        else {
                            cell.innerHTML = texto;
                            cell.classList.add("border-cell-table");
                            cell.focus();
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                                // Trata Excecao
                                if (g$.exceptionRequisicao("Customizador", data)) return;

                                setDadosView(elm, data.data[0], null);
                            });
                        }
                    });
                });
            }

            $scope.salvarElementoNode = function (query, tabela, obj, cell, elm) {
                $http.put(URL + "/put/" + tabela, obj).then(function (data) {
                    data = data.data;

                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data)) return;

                    Materialize.toast('Salvo com Sucesso!', 4000, 'green darken-1');
                    if (cell.children[0].type == "checkbox") {
                        cell.classList.add("border-cell-table");
                        cell.children[0].focus();
                    }
                    else {
                        cell.innerHTML = texto;
                        cell.classList.add("border-cell-table");
                        cell.focus();
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                            // Trata Excecao
                            if (g$.exceptionRequisicao("Customizador", data)) return;

                            setDadosView(elm, data.data[0], null);
                        });
                    }
                });
            }

            displayDadosProp = function (id) {
                var elm = event.target, alterCombo;
                if (!elm.dataset) return;

                if ((elm.id == "tab" && elm.tagName == "A") || elm.id == "selectbox") {
                    elm = elm.parentElement;
                    alterCombo = true;
                }
                else if (elm.id == "botao" && elm.tagName == "SPAN") elm = elm.parentElement;

                $http.get("/").success(function () {
                    $scope.search = { id: elm.dataset.id };
                });

                $("#propMenuTelas")[0].className = "play-none";
                $("#propLinha")[0].className = "";

                // Mostrar todas as acoes desse component na aba "Ações Comp"
                $("#acoes #acoesIDElemento")[0].value = elm.dataset.id;
            }

            selecionarLinhaProp = function (elm_tela) {
                var tabela = $("#controle #propriedades table")[0], check, row;

                if (elm_tela) {
                    check = $("#controle #propriedades [data-prop_id='" + elm_tela.dataset.id + "']")[0];
                    check.checked = true;
                }
                else check = event.target;

                row = check.parentElement.parentElement;

                // Remove a classe da linha anterior se existir alguma selecionada e nao for multiselect
                if (tabela.querySelector("tr.active-prop")) {
                    tabela.querySelector("tr.active-prop").cells[0].children[0].checked = false;
                    tabela.querySelector("tr.active-prop").className = "";
                }

                // Na hora de selecionar
                if (check.checked) {
                    propriedadeID = row.children[1].innerHTML.trim();
                    check.parentElement.parentElement.className = 'active-prop';
                }
                else propriedadeID = "";
            }

            $scope.deletarElemento = function () {
                if (propriedadeID == "") return Materialize.toast("Não tem nenhum elemento Selecionado.", 5000, 'red darken-1');
                if ($scope.customizador.isCliente) $scope.deleteElementoCliente()
                else $scope.deleteElementoNode();
            }

            $scope.deleteElementoCliente = function () {
                var queryDelete = "DELETE FROM " + $rootScope.user.banco + ".elemento WHERE id = '" + propriedadeID + "'",
                    elm = $("#view [data-id='" + propriedadeID + "']")[0],
                    queryElementos = g$.selectElementosCliente(elm.dataset.menu_id);

                alertjs.show({
                    type: 'confirm',
                    title: 'Confirm',
                    text: "Tem certeza que deseja apagar esse Elemento no Cliente?",
                    from: 'left', //slide from left		
                    complete: function (val) {
                        if (val) {
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryDelete)).success(function (data) {
                                // Trata Excecao
                                if (g$.exceptionRequisicao("Customizador", data)) return;

                                propriedadeID = "";
                                $scope.requeryElementos();
                                elm.parentElement.removeChild(elm);
                                Materialize.toast('Deletado com Sucesso!', 4000, 'green darken-1');
                            });
                        }
                        else return;
                    }
                });
            }

            $scope.deleteElementoNode = function () {
                var query = "SELECT id FROM elemento WHERE pai = '" + propriedadeID + "'",
                    queryDelete = "DELETE FROM elemento WHERE id = '" + propriedadeID + "'",
                    queryProc = "call apaga_elemento_e_filhos('" + propriedadeID + "')",
                    elm = $("#view [data-id='" + propriedadeID + "']")[0],
                    queryElementos = g$.selectElementosNode(elm.dataset.menu_id);

                $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data)) return;;

                    if (data.data.length) {
                        alertjs.show({
                            type: 'confirm',
                            title: 'Confirm',
                            text: "Esse elemento contém filhos. Tem certeza que deseja apagar ele e seus filhos?",
                            from: 'left', //slide from left		
                            complete: function (val) {
                                if (val) {
                                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryProc, 1)).success(function (data) {
                                        $scope.search = { id: "" };
                                        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryElementos)).success(function (data) {
                                            // Trata Excecao
                                            if (g$.exceptionRequisicao("Customizador", data)) return;;

                                            $scope.propriedadesElementos = data.data;
                                        });
                                        elm.parentElement.removeChild(elm);
                                        Materialize.toast('Elementos Deletados com Sucesso!', 4000, 'green darken-1');
                                    });
                                }
                                else return;
                            }
                        });
                    }
                    else {
                        alertjs.show({
                            type: 'confirm',
                            title: 'Confirm',
                            text: "Tem certeza que deseja apagar esse Elemento?",
                            from: 'left', //slide from left		
                            complete: function (val) {
                                if (val) {
                                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryDelete)).success(function (data) {
                                        // Trata Excecao
                                        if (g$.exceptionRequisicao("Customizador", data)) return;;

                                        propriedadeID = "";
                                        $scope.requeryElementos();
                                        elm.parentElement.removeChild(elm);
                                        Materialize.toast('Deletado com Sucesso!', 4000, 'green darken-1');
                                    });
                                }
                                else return;
                            }
                        });
                    }
                });
            }

            hrefLink = function (obj, elm) {
                var tabela, campo, query;
                tabela = $("[data-name-combo='le_da_tabela'] #selectbox option[value='" + elm.dataset.link_tabela + "']")[0].innerHTML.trim();
                campo = $("[data-name-combo='le_do_campo'] #selectbox option[value='" + elm.dataset.link_campo + "']")[0].innerHTML.trim();
                query = "SELECT " + campo + " FROM " + $rootScope.user.banco + "." + tabela + " WHERE id = " + obj["e_" + view.querySelector("[data-nome='txt_id']").dataset.id];
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Customizador", data)) return;;

                    elm.href = data.data[0][campo];
                });
            }

        }
    };
});

// Seta os estilos para mostrar na view 
setDadosView = function (elm, obj, th, alterCombo) {
    var th;

    // Colocando os Atributos
    elm.dataset.id = obj.id;

    if (obj.nome && obj.nome != "" && obj.nome != "null") elm.dataset.nome = obj.nome;
    if (obj.pai && obj.pai != "" && obj.pai != "null") elm.dataset.pai = obj.pai;
    if (obj.tipo && obj.tipo != "" && obj.tipo != "null") elm.dataset.tipo = obj.tipo;
    if (obj.consulta_id && obj.consulta_id != "" && obj.consulta_id != "null") elm.dataset.consulta_id = obj.consulta_id;
    if (obj.texto && obj.texto != "" && obj.texto != "null") elm.dataset.texto = obj.texto;
    if (obj.display && obj.display != "" && obj.display != "null") elm.dataset.display = obj.display;
    if (obj.abrir_no_sistema && obj.abrir_no_sistema != "" && obj.abrir_no_sistema != "null") elm.dataset.abrir_no_sistema = obj.abrir_no_sistema;
    if (obj.download && obj.download != "" && obj.download != "null") elm.dataset.download = obj.download;
    if (obj.menu_id && obj.menu_id != "" && obj.menu_id != "null") elm.dataset.menu_id = obj.menu_id;
    if (obj.tbl_modal && obj.tbl_modal != "" && obj.tbl_modal != "null") elm.dataset.tbl_modal = obj.tbl_modal;
    if (obj.alias && obj.alias != "" && obj.alias != "null") elm.dataset.alias = obj.alias;

    // Atributos Combo 
    if (obj.combo_tabela && obj.combo_tabela != "" && obj.combo_tabela != "null") elm.dataset.combo_tabela = obj.combo_tabela;
    if (obj.combo_campo && obj.combo_campo != "" && obj.combo_campo != "null") elm.dataset.combo_campo = obj.combo_campo;
    if (obj.le_da_tabela && obj.le_da_tabela != "" && obj.le_da_tabela != "null") elm.dataset.le_da_tabela = obj.le_da_tabela;
    if (obj.le_da_tabela_alias && obj.le_da_tabela_alias != "" && obj.le_da_tabela_alias != "null") elm.dataset.le_da_tabela_alias = obj.le_da_tabela_alias;
    if (obj.le_do_campo && obj.le_do_campo != "" && obj.le_do_campo != "null") elm.dataset.le_do_campo = obj.le_do_campo;
    if (obj.le_do_campo_id && obj.le_do_campo_id != "" && obj.le_do_campo_id != "null") elm.dataset.le_do_campo_id = obj.le_do_campo_id;
    if (obj.link_tabela && obj.link_tabela != "" && obj.link_tabela != "null") elm.dataset.link_tabela = obj.link_tabela;
    if (obj.link_campo && obj.link_campo != "" && obj.link_campo != "null") elm.dataset.link_campo = obj.link_campo;
    if (obj.grava_na_tabela && obj.grava_na_tabela != "" && obj.grava_na_tabela != "null") elm.dataset.grava_na_tabela = obj.grava_na_tabela;
    if (obj.grava_no_campo && obj.grava_no_campo != "" && obj.grava_no_campo != "null") elm.dataset.grava_no_campo = obj.grava_no_campo;
    if (obj.largura && obj.largura != "" && obj.largura != "null") elm.dataset.largura = obj.largura;
    if (obj.tamanho && obj.tamanho != "" && obj.tamanho != "null") elm.dataset.tamanho = obj.tamanho;

    if (obj.combo_query && obj.combo_query != "" && obj.combo_query != "null") elm.dataset.comboQuery = obj.combo_query;
    if (obj.combo_grava_campo && obj.combo_grava_campo != "" && obj.combo_grava_campo != "null") elm.dataset.comboGravaCampo = obj.combo_grava_campo;
    if (obj.combo_filtro && obj.combo_filtro != "" && obj.combo_filtro != "null") elm.dataset.comboFiltro = obj.combo_filtro;
    if (obj.combo_atualizar && obj.combo_atualizar != "" && obj.combo_atualizar != "null") elm.dataset.combo_atualizar = obj.combo_atualizar;
    if (obj.formato && obj.formato != "" && obj.formato != "null") elm.dataset.formato = obj.formato;
    if (obj.bloqueado && obj.bloqueado != "" && obj.bloqueado != "null") elm.dataset.bloqueado = obj.bloqueado;
    if (obj.limite && obj.limite != "" && obj.limite != "null") elm.dataset.limite = obj.limite;
    if (obj.max_length && obj.max_length != "" && obj.max_length != "null") elm.dataset.max_length = obj.max_length;

    // Elemento que ta ativo para ir na celula
    if (obj.combo_ativo && obj.combo_ativo != "" && obj.combo_ativo != "null") elm.dataset.combo_ativo = obj.combo_ativo;
    if (obj.input_ativo && obj.input_ativo != "" && obj.input_ativo != "null") elm.dataset.input_ativo = obj.input_ativo;
    if (obj.coluna_check && obj.coluna_check != "" && obj.coluna_check != "null") elm.dataset.coluna_check = obj.coluna_check;

    if (obj.cell_tipo && obj.cell_tipo != "" && obj.cell_tipo != "null") elm.dataset.cell_tipo = obj.cell_tipo;
    if (obj.ordem && obj.ordem != "" && obj.ordem != "null") elm.dataset.ordem = obj.ordem;
    if (obj.intervalo && obj.intervalo != "" && obj.intervalo != "null") elm.dataset.intervalo = obj.intervalo;
    if (obj.obrigatorio && obj.obrigatorio != "" && obj.obrigatorio != "null") elm.dataset.obrigatorio = obj.obrigatorio;

    if (elm.id != "td") elm.style.display = obj.display;
    if (obj.alinhamento && obj.alinhamento != "" && obj.alinhamento != "null") elm.style.textAlign = obj.alinhamento;
    if (obj.padding && obj.padding != "" && obj.padding != "null") elm.style.padding = obj.padding;
    if (obj.margin && obj.margin != "" && obj.margin != "null") elm.style.margin = obj.margin;
    if (obj.fundo && obj.fundo != "" && obj.fundo != "null") elm.style.background = obj.fundo;
    if (obj.borda_size && obj.borda_size != "" && obj.borda_size != "null") elm.style.border = obj.borda_size + " " + obj.borda_tipo + " " + obj.borda_cor;
    if (obj.borda_arredondada && obj.borda_arredondada != "" && obj.borda_arredondada != "null") elm.style.borderRadius = obj.borda_arredondada;
    if (obj.flutuar && obj.flutuar != "" && obj.flutuar != "null") elm.style.float = obj.flutuar;

    if (elm.id == "tabela") {
        elm.dataset.tabela_consulta_id = obj.consulta_id;
        elm.dataset.tabela_multiselect = obj.tabela_multiselect;
        elm.dataset.tabela_info = obj.tabela_info;
        elm.dataset.tabela_pesquisar = obj.tabela_pesquisar;
        elm.dataset.tabela_paginate = obj.tabela_paginate;
        elm.dataset.tabela_botao_copiar = obj.tabela_botao_copiar;
        elm.dataset.tabela_botao_excel = obj.tabela_botao_excel;
        elm.dataset.tabela_botao_pdf = obj.tabela_botao_pdf;
        elm.dataset.tabela_botao_imprimir = obj.tabela_botao_imprimir;
        elm.dataset.tabela_botao_filtro = obj.tabela_botao_filtro;
        elm.dataset.tbl_delete = obj.tbl_delete;
        elm.dataset.tbl_treeview = obj.tbl_treeview;
        elm.dataset.tbl_linhanova = obj.tbl_linhanova;
        elm.dataset.tbl_selecionarlinha = obj.tbl_selecionarlinha;
    }

    if (obj.placeholder && obj.placeholder != "") elm.setAttribute("placeholder", obj.placeholder);
    if (obj.descricao && obj.descricao != "") elm.setAttribute("title", obj.descricao);
    if (obj.max_length && obj.max_length != "") elm.setAttribute("maxlength", obj.max_length);

    if (elm.className.indexOf("new_check") < 0) {
        // Estilo elemento
        if (obj.tag == "label") {
            elm.innerHTML = obj.texto;
            if (obj.modal && obj.modal != "") {
                var params = "openModal | " + obj.modal,
                    style = elm.getAttribute("style");
                style += "color: #0277bd !important;"
                elm.setAttribute("style", style);
                elm.addEventListener("click", g$.openModal.bind(null, params, false), false);
            }
        }
        else if (obj.tag == "marquee") {
            elm.innerHTML = obj.texto;
        }
        else if (obj.tag == "video") {
            if (!obj.link_tabela && (obj.link_campo && obj.link_campo != "")) {
                elm.children[0].src = obj.link_campo;
            }
            elm.width = (obj.tamanho && obj.tamanho != "") ? obj.tamanho : 400;
        }
        else if (obj.tag == "icone") elm.className = "fa " + obj.texto;
        else if (obj.tag == "botao") elm.querySelector("span").innerHTML = obj.texto;
        else if (obj.tag == "td") {
            th = (!th) ? $("#view [data-id='" + elm.dataset.pai + "'] thead tr th")[elm.cellIndex] : th;
            th.innerHTML = obj.texto;
            if (obj.modal && obj.modal != "") {
                var params = "openModal | " + obj.modal;
                th.style.color = "#0277bd";
                th.addEventListener("click", g$.openModal.bind(null, params, false), false);
            }
        }
        else if (obj.tag == "tab") {
            elm.children[0].textContent = obj.texto;
            elm.addEventListener("click", g$.displayTab.bind(null, obj.id), false);
            // if (!g$.user.sysCli) elm.children[0].href = "#aba" + obj.id;
        }
        else if (obj.tag == "input") {
            if (obj.tipo == "checkbox") elm.className = "";

            if (obj.tipo == "date" || obj.tipo == "date-time" || obj.tipo == "file") {
                elm.type = "text";
                elm.className += " date-bootstrap";
            }
            else elm.type = obj.tipo;
        }
        else if (obj.tag == "link") {
            if (!obj.link_tabela && (obj.link_campo && obj.link_campo != "")) {
                elm.innerHTML = obj.texto;
                elm.href = obj.link_campo;
            }

            // Se for um link para download
            if (elm.dataset.download == "1") elm.setAttribute("download", true);

            // Se for para abrir no Sistema
            if (elm.dataset.abrir_no_sistema == "1") {
                elm.removeAttribute("download");
                elm.removeAttribute("href");
            }
            else elm.setAttribute("target", "_blank");
        }

        if (obj.obrigatorio == "1") elm.setAttribute("required", true);
        else elm.removeAttribute("required");

        if (obj.tag == "coluna") elm.className = "col " + obj.desktop + " " + obj.tablet + " " + obj.celular + " " + obj.classe;

        if (obj.tag == "botao") {
            elm.querySelector("span").style.fontSize = obj.size;
            elm.querySelector("span").style.fontFamily = obj.familia;
            elm.querySelector("span").style.color = obj.cor;
        }
        else {
            elm.style.fontSize = (!obj.size) ? "13px" : obj.size;
            elm.style.fontFamily = (!obj.family && obj.tag != "icone") ? "Roboto" : obj.familia;
            elm.style.color = obj.cor;
        }

        if (obj.tag == "td") {
            elm.style.minWidth = (obj.largura) ? obj.largura + "px" : "0px";
            th.style.minWidth = (obj.largura) ? obj.largura + "px" : "0px";
        }
        else if (obj.tag == "botao") {
            if (obj.largura && obj.largura != "") elm.style.width = obj.largura + "%";
        }
        else if (obj.tag == "imagem") {
            if (!obj.link_tabela && (obj.link_campo && obj.link_campo != "")) {
                elm.src = obj.link_campo;
            }

            if ((obj.largura && obj.largura != "") && (obj.classe && obj.classe != "" && obj.classe.indexOf("percentual") > -1)) {
                elm.style.width = obj.largura + "%";
            }
            else if (obj.largura && obj.largura != "") {
                if (String(obj.largura).indexOf("px") == -1 && String(obj.largura).indexOf("%") == -1) {
                    elm.style.width = (obj.largura && obj.largura != "") ? obj.largura + "px" : "100px";
                }
            }
            else elm.style.width = (obj.largura && obj.largura != "") ? obj.largura : "100px";

            if ((obj.tamanho && obj.tamanho != "") && (obj.classe && obj.classe != "" && obj.classe.indexOf("percentual") > -1)) {
                elm.style.height = obj.tamanho + "%";
            }
            else if (obj.tamanho && obj.tamanho != "") {
                if (String(obj.tamanho).indexOf("px") == -1 && String(obj.tamanho).indexOf("%") == -1) {
                    elm.style.height = (obj.tamanho && obj.tamanho != "") ? obj.tamanho + "px" : "100px";
                }
            }
            else elm.style.height = (obj.tamanho && obj.tamanho != "") ? obj.tamanho : "100px";

            // if (obj.tamanho && obj.tamanho != "") {
            //     if (String(obj.tamanho).indexOf("px") == -1 && String(obj.tamanho).indexOf("%") == -1) {
            //         elm.style.height = (obj.tamanho && obj.tamanho != "") ? obj.tamanho + "px" : "100px";
            //     }
            //     else elm.style.height = (obj.tamanho && obj.tamanho != "") ? obj.tamanho : "100px";
            // }
        }
        else if (obj.tag == "grafico") {
            elm.style.width = (obj.largura && obj.largura != "") ? obj.largura + "px" : "200px";
            elm.style.height = (obj.tamanho && obj.tamanho != "") ? obj.tamanho + "px" : "200px";
        }
        else if (obj.tag == "input") {
            var style = elm.getAttribute("style");;
            if (obj.tamanho && obj.tamanho != "") style += "height: " + obj.tamanho + "% !important;";
            if (obj.largura && obj.largura != "") style += "width: " + obj.largura + "% !important;";
            elm.setAttribute("style", style);
        }
        else if (obj.tag == "coluna" || obj.tag == "linha") {
            if ((obj.tamanho && obj.tamanho != "") && (obj.classe && obj.classe != "" && obj.classe.indexOf("percentual") > -1)) {
                elm.style.height = obj.tamanho + "%";
            }
            else if (obj.tamanho && parseInt(obj.tamanho) && obj.tamanho != "") {
                elm.style.height = obj.tamanho + "px";
            }
            if ((obj.largura && obj.largura != "") && (obj.classe && obj.classe != "" && obj.classe.indexOf("percentual") > -1)) {
                elm.style.width = obj.largura + "%";
            }
            else if (obj.largura && parseInt(obj.largura) && obj.largura != "") {
                elm.style.width = obj.largura + "px";
            }
            var style = elm.getAttribute("style");
            if (obj.padding && obj.padding != "") style += "padding: " + obj.padding + " !important;";
            if (obj.margin && obj.margin != "") style += "margin: " + obj.margin + " !important;";
            if (obj.borda_size && obj.borda_size != "1") style += "border-width: " + obj.borda_size + " !important;";
            if (obj.borda_arredondada && obj.borda_arredondada != "1") style += "border-radius: " + obj.borda_arredondada + " !important;";
            if (obj.borda_tipo && obj.borda_tipo != "1") style += "border-style: " + obj.borda_tipo + " !important;";
            if (obj.borda_cor && obj.borda_cor != "1") style += "border-color: " + obj.borda_cor + " !important;";
            if (obj.borderBottom && obj.borderBottom != "1") style += "border-bottom: " + obj.borderBottom + " !important;";
            if (obj.borderTop && obj.borderTop != "1") style += "border-top: " + obj.borderTop + " !important;";
            if (obj.borderLeft && obj.borderLeft != "1") style += "border-left: " + obj.borderLeft + " !important;";
            if (obj.borderRight && obj.borderRight != "1") style += "border-right: " + obj.borderRight + " !important;";
            elm.setAttribute("style", style);
        }

        else if (obj.tag == "textarea") elm.style.height = (obj.tamanho && obj.tamanho != "") ? obj.tamanho + "px" : "200px";
        else {
            elm.style.width = obj.largura;
        }

        if (obj.tag == "icone") elm.style.fontSize = (obj.size != "") ? obj.size : "13px";

        if (obj.tag != "td") {
            elm.style.borderBottom = (obj.borderBottom != "1") ? "" : obj.borderBottom;
            elm.style.borderTop = (obj.borderTop != "1") ? "" : obj.borderTop;
            elm.style.borderLeft = (obj.borderLeft != "1") ? "" : obj.borderLeft;
            elm.style.borderRight = (obj.borderRight != "1") ? "" : obj.borderRight;
        }

        if (obj.tipo == "email") elm.type = "email";

        elm.className += " " + obj.classe;
        if (obj.bloqueado == "1") elm.setAttribute("disabled", true);
        else elm.removeAttribute("disabled");
    }
    else {
        elm.parentElement.style.margin = obj.margin;
        if (obj.bloqueado == "1") elm.setAttribute("disabled", true);
        else elm.removeAttribute("disabled");
    }
}