app.directive("linhaprop", function() {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_PROP_LINHA/template.html",
        controller: function($scope, $http, $rootScope, $compile) {

            var propriedadeID = "";
            $('.tooltipped').tooltip({ delay: 50 });

            $scope.requeryElementos = function() {
                if (!$scope.getIDMenuItem()) return;
                var query = "SELECT e.id,e.nome,e.tag,e.tipo,e.texto,e.tela,e.menu_id,e.pai,e.ordem, e.download, e.abrir_no_sistema, tl.tabela le_da_tabela,cl.campo le_do_campo,lt.tabela link_tabela,coalesce(lc.campo,e.link_campo) link_campo,tg.tabela grava_na_tabela,c.consulta consulta_id,cg.campo grava_no_campo,e.celular,e.tablet,e.desktop,e.largura,e.tamanho,coalesce(cc.campo,e.combo_campo) combo_campo,tc.tabela combo_tabela,e.combo_grava_value,e.formato,e.display,e.size,e.familia,e.padding,e.margin,e.fundo,e.cor,e.combo_grava_campo,e.combo_atualizar,e.combo_id_elemento,e.combo_campo_filho,e.borda_size,e.borda_tipo,e.borda_cor,e.borda_arredondada,e.obrigatorio,e.combo_ativo,e.input_ativo,e.row_select,e.row_delete,e.cell_tipo,e.coluna_check,e.alinhamento,e.intervalo,e.borderTop,e.borderBottom,e.borderLeft,e.borderRight,e.bloqueado,e.classe,e.flutuar,e.combo_filtro,e.tabela_paginate,e.tabela_pesquisar,e.tabela_info,e.tabela_multiselect,e.tabela_botao_filtro,e.tabela_botao_imprimir,e.tabela_botao_pdf,e.tabela_botao_excel,e.tabela_botao_copiar,e.combo_query FROM node.elemento e LEFT JOIN node.tabela tl ON e.le_da_tabela = tl.id LEFT JOIN node.campo cl ON e.le_do_campo = cl.id LEFT JOIN node.tabela tg ON e.grava_na_tabela = tg.id LEFT JOIN node.campo cg ON e.grava_no_campo = cg.id LEFT JOIN node.tabela tc ON e.combo_tabela = tc.id LEFT JOIN node.campo cc ON e.combo_campo = cc.id LEFT JOIN node.consulta c ON e.consulta_id = c.id "
                    + "LEFT JOIN node.tabela lt ON e.link_tabela = lt.id LEFT JOIN node.campo lc ON e.link_campo = lc.id " +
                    "WHERE e.menu_id = '" + $scope.getIDMenuItem() + "' ORDER BY ordem";

                $scope.search = { id: "" };
                $http.get(URL + "/get/" + query).success(function(data) {
                    $scope.propriedadesElementos = data;
                });

            }

            $scope.selecionarCelulaProp = function(cell) {
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
            moveTableProp = function(e) {
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
                    $http.get(URL + "/get/" + cell.dataset.query).success(function(data) {
                        $scope.linhas = data;
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
                    $http.get(URL + "/get/" + query).success(function(data) {
                        $scope.linhas = data;
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

            alterarCheckProp = function() {
                var elm = event.target,
                    cell = elm.parentElement,
                    row = cell.parentElement,
                    id_elemento = row.cells[1].innerHTML;

                salvarProp(cell, row, id_elemento);
            }

            function salvarProp(cell, row, id_elemento) {
                var obj = {}, coluna,
                    elm = $("#view [data-id='" + id_elemento.trim() + "']")[0],
                    query = "SELECT e.id,e.nome,e.tag,e.tipo,e.texto,e.tela,e.menu_id,e.pai,e.ordem, tl.tabela le_da_tabela,cl.campo le_do_campo,tg.tabela grava_na_tabela,c.consulta consulta_id,cg.campo grava_no_campo,e.celular,e.tablet,e.desktop,e.largura,e.tamanho,if ( ISNULL(cc.campo) OR cc.campo <> '', e.combo_campo, cc.campo) combo_campo,tc.tabela combo_tabela,e.combo_grava_value,e.formato,e.display,e.size,e.familia,e.padding,e.margin,e.fundo,e.cor,e.combo_grava_campo,e.combo_atualizar,e.combo_id_elemento,e.combo_campo_filho,e.borda_size,e.borda_tipo,e.borda_cor,e.borda_arredondada,e.obrigatorio,e.combo_ativo,e.input_ativo,e.row_select,e.row_delete,e.cell_tipo,e.coluna_check,e.alinhamento,e.intervalo,e.borderTop,e.borderBottom,e.borderLeft,e.borderRight,e.bloqueado,e.classe,e.flutuar,e.combo_filtro,e.tabela_paginate,e.tabela_pesquisar,e.tabela_info,e.tabela_multiselect,e.tabela_botao_filtro,e.tabela_botao_imprimir,e.tabela_botao_pdf,e.tabela_botao_excel,e.tabela_botao_copiar,e.combo_query FROM node.elemento e LEFT JOIN node.tabela tl ON e.le_da_tabela = tl.id LEFT JOIN node.campo cl ON e.le_do_campo = cl.id LEFT JOIN node.tabela tg ON e.grava_na_tabela = tg.id LEFT JOIN node.campo cg ON e.grava_no_campo = cg.id LEFT JOIN node.tabela tc ON e.combo_tabela = tc.id LEFT JOIN node.campo cc ON e.combo_campo = cc.id LEFT JOIN node.consulta c ON e.consulta_id = c.id " +
                        "WHERE e.id = '" + id_elemento + "' ORDER BY ordem";

                obj.id = id_elemento.trim();

                // Se tiver um filho vai pegar o valor do elemento
                if (cell.children) {

                    if (cell.children[0].id == "selectbox") {
                        if (cell.children[0].value.trim() != "") {
                            coluna = (cell.dataset.coluna == "tabela") ? "le_da_tabela" : (cell.dataset.coluna == "campo") ? "le_do_campo" : "consulta_id";
                            texto = $("[data-name-combo='" + coluna + "'] #selectbox option[value='" + cell.children[0].value.trim() + "']")[0].dataset.inner;
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

                $http.put(URL + "/put/elemento", obj).then(function(data) {
                    if (data.data.err) Materialize.toast("ERROR: " + data.data.err.code, 5000, 'red darken-1');
                    else {
                        Materialize.toast('Salvo com Sucesso!', 4000, 'green darken-1');
                        if (cell.children[0].type == "checkbox") {
                            cell.classList.add("border-cell-table");
                            cell.children[0].focus();
                        }
                        else {
                            cell.innerHTML = texto;
                            cell.classList.add("border-cell-table");
                            cell.focus();
                            $http.get(URL + "/get/" + query).success(function(data) {
                                // $scope.propriedadesElementos.forEach(function(v, i) {
                                //     if (v.id == row.dataset.irow) {

                                //     }
                                // });
                                setDadosView(elm, data[0], null, (data[0].tag == "selectbox"));
                            });
                        }
                    }
                });

            }

            displayDadosProp = function() {
                var elm = event.target, alterCombo;

                // Se ele clicou na TAB e a tag for A, pega o pai 
                if ((elm.id == "tab" && elm.tagName == "A") || elm.id == "selectbox") {
                    elm = elm.parentElement;
                    alterCombo = true;
                }
                else if (elm.id == "botao" && elm.tagName == "SPAN") elm = elm.parentElement;
                $scope.search = { id: elm.dataset.id };

                // Mostrar todas as acoes desse component na aba "Ações Comp"
                $scope.$broadcast("requeryAcoes", elm.dataset.id, elm.dataset.tag);
            }

            selecionarLinhaProp = function(elm_tela) {
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

            $scope.duplicarTela = function() {
                // select m.id, m.menu from projeto_menu p left join menu m on p.menu_id = m.id where projeto_id = 5;
                var queryProjetos = "SELECT id, projeto FROM node.projeto"; 
                $http.get(URL + "/get/" + queryProjetos).success(function (data){
                    $scope.projetos = data;
                });
                $('#modal-duplicartela').modal('open');
            }

            atualizarProjetoDe = function() {
                var queryTelasDe = "select m.id, m.menu from node.projeto_menu p left join node.menu m on p.menu_id = m.id where projeto_id = " + $("#modal-duplicartela #projetoDe")[0].value; 
                $http.get(URL + "/get/" + queryTelasDe).success(function (data){
                    $scope.telasDe = data;
                });
            }

            atualizarProjetoPara = function() {
                var queryTelasPara = "select m.id, m.menu from node.projeto_menu p left join node.menu m on p.menu_id = m.id where projeto_id = " + $("#modal-duplicartela #projetoPara")[0].value;
                $http.get(URL + "/get/" + queryTelasPara).success(function (data){
                    $scope.telasPara = data;
                });
            }

            $scope.deletarElemento = function() {
                if (propriedadeID == "") return Materialize.toast("Não tem nenhum elemento Selecionado.", 5000, 'red darken-1');

                var query = "SELECT id FROM elemento WHERE pai = '" + propriedadeID + "'",
                    queryDelete = "DELETE FROM elemento WHERE id = '" + propriedadeID + "'",
                    elm = $("#view [data-id='" + propriedadeID + "']")[0];
                $http.get(URL + "/get/" + query).success(function(data) {
                    if (data.length) return Materialize.toast("Esse elemento contém filhos.", 5000, 'red darken-1');
                    else if (!confirm("Tem certeza que deseja excluir esse Elemento?")) return;
                    else {
                        $http.delete(URL + "/delete/" + queryDelete).success(function(data) {
                            $scope.propriedadesElementos.forEach(function(v, i) {
                                if (v.id == propriedadeID) {
                                    $scope.search.id = "";
                                    $scope.propriedadesElementos.splice(i, 1);
                                }
                            });
                            propriedadeID = "";
                            elm.parentElement.removeChild(elm);
                            Materialize.toast('Deletado com Sucesso!', 4000, 'green darken-1');
                        });
                    }
                });
            }

            hrefLink = function(obj, elm) {
                var tabela, campo, query;
                tabela = $("[data-name-combo='le_da_tabela'] #selectbox option[value='" + elm.dataset.link_tabela + "']")[0].innerHTML.trim();
                campo = $("[data-name-combo='le_do_campo'] #selectbox option[value='" + elm.dataset.link_campo + "']")[0].innerHTML.trim();
                query = "SELECT " + campo + " FROM " + $rootScope.user.banco + "." + tabela + " WHERE id = " + obj["e_" + view.querySelector("[data-nome='txt_id']").dataset.id];
                $.get(URL + "/get/" + query).success(function(data) {
                    elm.href = data[0][campo];
                });
            }
            $scope.criaColuna = function(){
                alert("clicou!");
            }
        }
    };
});

// Seta os estilos para mostrar na view 
setDadosView = function(elm, obj, th, alterCombo) {
    var th;

    // Colocando os Atributos
    elm.dataset.id = obj.id;
    elm.dataset.nome = obj.nome;
    elm.dataset.pai = obj.pai;
    elm.dataset.tipo = obj.tipo;
    elm.dataset.consulta_id = obj.consulta_id;
    elm.dataset.texto = obj.texto;
    elm.dataset.display = obj.display;
    elm.dataset.abrir_no_sistema = obj.abrir_no_sistema;
    elm.dataset.download = obj.download;

    // Atributos Combo 
    elm.dataset.combo_tabela = obj.combo_tabela;
    elm.dataset.combo_campo = obj.combo_campo;
    elm.dataset.le_da_tabela = obj.le_da_tabela;
    elm.dataset.le_do_campo = obj.le_do_campo;
    elm.dataset.link_tabela = obj.link_tabela;
    elm.dataset.link_campo = obj.link_campo;
    elm.dataset.grava_na_tabela = obj.grava_na_tabela;
    elm.dataset.grava_no_campo = obj.grava_no_campo;

    // Elemento que ta ativo para ir na celula
    elm.dataset.combo_ativo = obj.combo_ativo;
    elm.dataset.input_ativo = obj.input_ativo;
    elm.dataset.coluna_check = obj.coluna_check;

    elm.dataset.cell_tipo = obj.cell_tipo;
    elm.dataset.intervalo = obj.intervalo;
    elm.dataset.obrigatorio = obj.obrigatorio;

    // Estilo elemento
    if (obj.tag == "label") elm.innerHTML = obj.texto;
    else if (obj.tag == "icone") elm.className = "fa " + obj.texto;
    else if (obj.tag == "botao") elm.querySelector("span").innerHTML = obj.texto;
    else if (obj.tag == "td") {
        th = (!th) ? $("#view [data-id='" + elm.dataset.pai + "'] thead tr th")[elm.cellIndex] : th;
        th.innerHTML = obj.texto;
    }
    else if (obj.tag == "tab") {
        elm.children[0].textContent = obj.texto;
        elm.children[0].href = "#aba" + obj.id;
    }
    else if (obj.tag == "input") {
        if (obj.tipo == "checkbox") elm.className = "";

        if (obj.tipo == "date" || obj.tipo == "date-time") {
            elm.type = "text";
            elm.className += " date-bootstrap";
        }
        else elm.type = obj.tipo;

        if (obj.obrigatorio == "1") elm.setAttribute("required", true);
        else elm.removeAttribute("required");

        if (obj.bloqueado == "1") elm.setAttribute("disabled", true);
        else elm.removeAttribute("disabled");
    }
    else if (obj.tag == "link") {
        if (obj.texto && obj.texto != "") {
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


    if (obj.tag == "coluna") elm.className = "col " + obj.desktop + " " + obj.tablet + " " + obj.celular + " " + obj.classe;;

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
    else elm.style.width = obj.largura;

    if (obj.tag == "icone") elm.style.fontSize = obj.tamanho;
    else elm.style.height = (obj.tamanho == 0) ? null : obj.tamanho + "px";

    elm.style.display = obj.display;
    elm.style.textAlign = obj.alinhamento;
    elm.style.padding = obj.padding;
    elm.style.margin = obj.margin;
    elm.style.background = obj.fundo;
    elm.style.border = obj.borda_size + " " + obj.borda_tipo + " " + obj.borda_cor;
    elm.style.borderRadius = obj.borda_arredondada;
    elm.style.float = obj.flutuar;
    elm.className += " " + obj.classe;

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
    elm.dataset.comboQuery = (!obj.combo_query) ? "" : obj.combo_query;
    elm.dataset.comboGravaCampo = obj.combo_grava_campo;
    elm.dataset.comboFiltro = obj.combo_filtro;
    elm.dataset.comboAtualizar = obj.combo_atualizar;
    elm.dataset.combo_campo = obj.combo_campo;
    elm.dataset.selectbox_combo_campo = obj.combo_campo;
    elm.dataset.selectbox_combo_tabela = obj.combo_tabela;
    elm.dataset.combo_campo = obj.combo_campo;
    elm.dataset.le_da_tabela = obj.le_da_tabela;
    elm.dataset.le_do_campo = obj.le_do_campo;
    elm.dataset.grava_na_tabela = obj.grava_na_tabela;
    elm.dataset.grava_no_campo = obj.grava_no_campo;
    elm.dataset.formato = obj.formato;

    if (obj.tag != "td") {
        elm.style.borderBottom = (obj.borderBottom != "1") ? "" : obj.borderBottom;
        elm.style.borderTop = (obj.borderTop != "1") ? "" : obj.borderTop;
        elm.style.borderLeft = (obj.borderLeft != "1") ? "" : obj.borderLeft;
        elm.style.borderRight = (obj.borderRight != "1") ? "" : obj.borderRight;
    }

    // Se alterar o combo pra ele atualizar na hora na view
    if (alterCombo) {
        var id = elm.dataset.id, select;
        elm.innerHTML = "";
        select = $("#view [data-id=" + id + "]")[0];
        select = $compile(select)($scope)[0];
    }
}