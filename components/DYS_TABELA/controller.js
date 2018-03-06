app.controller("tabela", function ($scope, $http, $compile, $rootScope) {

    // FUNCAO INICIA TABELA
    g$._initTabela = function (elm, filtro, nome_procedure, idFuncao, isTela) {
        var nome = elm.dataset.nome + elm.dataset.id, template = "", datable;
        elm.tBodies[0].rows[0].setAttribute("ng-repeat", nome + " in " + nome + "s");
        elm.tBodies[0].rows[0].setAttribute("data-tt-id", "{{" + nome + ".e_" + elm.tBodies[0].rows[0].cells[1].dataset.id + "}}");
        for (var i = 0; i < elm.tBodies[0].rows[0].cells.length; i++) {
            if (elm.tBodies[0].rows[0].cells[i].id == "td" && elm.tBodies[0].rows[0].cells[i].dataset.le_do_campo && (g$.filterCampo(elm.tBodies[0].rows[0].cells[i].dataset.le_do_campo).toUpperCase().trim() == "PAI" || g$.filterCampo(elm.tBodies[0].rows[0].cells[i].dataset.le_do_campo).toUpperCase().trim().indexOf("_PAI") > -1))
                elm.tBodies[0].rows[0].setAttribute("data-tt-parent-id", "{{" + nome + ".e_" + elm.tBodies[0].rows[0].cells[i].dataset.id + "}}");
        }
        if (elm.dataset.tbl_treeview == "1") {
            var cellTree = "<i id='seta_treeview' class='fa fa-caret-right' onclick='g$.clickTreeView()'>"
            elm.tBodies[0].rows[0].cells[0].innerHTML = cellTree;
            elm.tBodies[0].rows[0].classList.add("play-none");
        }
        // Se nao tiver a coluna delete na tabela, ele adiciona
        if (elm.dataset.tbl_selecionarlinha == "1" && elm.dataset.tabela_multiselect == "1" && elm.querySelector("th")) {
            elm.tHead.rows[0].cells[0].innerHTML = "<input id='selecionarTodos' onclick='selecionarTodos()' type='checkbox'>";
        }
        if (elm.dataset.tbl_selecionarlinha == "0") {
            elm.querySelectorAll("th")[0].classList.add("play-none");
            elm.tBodies[0].rows[0].children[0].classList.add("play-none");
        }
        if (elm.dataset.tbl_delete == "1" && !elm.querySelector("#deleteRow")) {
            elm.querySelector("thead").rows[0].appendChild(angular.element("<th id='thDelete' style='width: 35px; max-width: 35px;'></th>")[0])
            elm.querySelector("tbody").rows[0].appendChild(angular.element($.template[0]["tdDel"])[0])
        }
        if (!elm.dataset.ativo) template = $scope.atualizarTemplate(elm, nome);
        $scope.get(elm, template, nome, filtro, nome_procedure, idFuncao, isTela);
    }

    // FUNCAO ATUALIZA TABELA
    requeryTabela = function (elm, filtro) {
        var nome = elm.dataset.nome + elm.dataset.id, tbody,
            filtro = (filtro) ? filtro : "",
            consultaID = elm.dataset.tabela_consulta_id,
            queryConsultaFiltro = "select c.id, f.id as id_filtro, f.filtro from node.consulta c LEFT JOIN node.consulta_filtro f ON c.id = f.consulta_id where f.consulta_id = " + consultaID;

        // tbody = elm.querySelector("tbody");
        // tbody.innerHTML = "";
        // tbody.appendChild(angular.element(elm.dataset.template)[0].tBodies[0].rows[0]);
        // template = $scope.atualizarTemplate(elm, nome);

        delete g$[elm.dataset.nome + "ID"];
        delete g$[elm.dataset.nome];

        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryConsultaFiltro)).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Tela", data)) return;

            data.data.forEach(function (v) {
                if (!v.filtro) return
                var params = g$.alterSargentos(v.filtro);
                if (filtro == "") filtro += params;
                else filtro += " AND " + params;
            });

            g$._initTabela(elm, filtro);
        });
    };

    // FUNCAO ATUALIZA TABELA
    requeryTabelaFiltro = function (elm, filtro) {
        var nome = elm.dataset.nome + elm.dataset.id, tbody,
            filtro = (filtro) ? filtro : "",
            consultaID = elm.dataset.tabela_consulta_id,
            queryConsultaFiltro = "select c.id, f.id as id_filtro, f.filtro from node.consulta c LEFT JOIN node.consulta_filtro f ON c.id = f.consulta_id where f.consulta_id = " + consultaID;

        delete g$[elm.dataset.nome + "ID"];
        delete g$[elm.dataset.nome];

        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryConsultaFiltro.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Tela", data)) return;

            data.data.forEach(function (v) {
                if (!v.filtro) return
                var params = g$.alterSargentos(v.filtro);
                if (filtro == "") filtro += params;
                else filtro += " AND " + params;
            });

            // if(filtro.length > 0) filtro = filtro + " AND " + filtro_config;
            // else filtro = filtro_config;

            g$._initTabela(elm, filtro);
        });
    };

    // FUNCAO MONTA E ATUALIZA TEMPLATE PARA O FUNCIONAMENTO DA TABELA
    $scope.atualizarTemplate = function (elm, nome) {
        var cells = [].slice.call(elm.tBodies[0].rows[0].cells), formato;
        elm.outerHTML = "";
        [].slice.call(cells).forEach(function (v) {
            if (v.querySelector(".tblTdFalse")) v.removeChild(v.querySelector(".tblTdFalse"));
            if (v.id == "tdSelecionar") v.dataset.indexRow = "{{$index}}";
            if (v.children[0] && (v.children[0].tagName == "TEXTAREA" || v.children[0].tagName == "INPUT"))
                if (v.children[0].id = "selecionarLinha") {
                    v.children[0].setAttribute("onclick", "selecionarLinha('" + nome + "')");
                    v.dataset.indexRow = "{{$index}}";
                }
                else return;
            else if (v.id == "deleteRow") return;
            else if (v.dataset.coluna_check == "1") {
                v.setAttribute("onclick", "selecionarCelula();")
                var input = "<input type='checkbox' onclick='checkCLICK();' ng-checked = {{" + nome + ".e_" + v.dataset.id + "}}>";
                v.innerHTML = input;
            }
            else if (v.children[0]) {
                formato = g$.formato[0][v.dataset.formato];
                formato = (!formato) ? "" : formato;
                v.innerHTML += "<span id='span' style='line-height: 35px;'> {{" + nome + ".e_" + v.dataset.id + formato + "}} </span>";
                // if (v.dataset.combo_ativo == "1") {
                //     v.appendChild(angular.element("<i class='fa fa-caret-down dropcombotable' onclick='colocaCombo()'> </i>")[0]);
                // }
                if (v.dataset.nome && v.dataset.nome.trim() != "null" && v.dataset.nome != "" && v.dataset.nome.indexOf("visible") == -1) {
                    v.querySelectorAll("span")[1].classList.add("play-none");
                }
                v.setAttribute("onclick", "selecionarCelula();")
                v.setAttribute("onkeydown", "moveTable();");
                return;
            }
            else {
                formato = g$.formato[0][v.dataset.formato];
                formato = (!formato) ? "" : formato;
                v.innerHTML = "{{" + nome + ".e_" + v.dataset.id + formato + "}}";
                if (v.dataset.combo_ativo == "1") {
                    v.appendChild(angular.element("<i class='fa fa-caret-down dropcombotable' onclick='colocaCombo()'> </i>")[0]);
                }
                v.setAttribute("onclick", "selecionarCelula();")
                v.setAttribute("onkeydown", "moveTable();");
            }
        });
        elm.dataset.ativo = true;
        elm.dataset.template = elm.outerHTML;
        // elm = $scope.desativaCelulas(angular.element(elm.outerHTML)[0]);
        return elm;
    }

    // Desativa as colunas que nao estao visiveis no perfil do usuario
    $scope.desativaCelulas = function (elm) {
        var colunas_tabelas = JSON.parse(window.localStorage.tabelas),
            cells = elm.tBodies[0].rows[0].cells;

        for (var i = 0; i < cells.length; i++) {

            for (var j = 0; j < colunas_tabelas.length; j++) {

                if (cells[i].dataset.id == colunas_tabelas[j].coluna_id) {

                    if (!colunas_tabelas[j].visivel) {
                        elm.querySelectorAll("th")[cells[i].cellIndex].classList.add("play-none");
                        cells[i].classList.add("play-none");
                    }
                    break;

                }
            }
        }
        return elm.outerHTML;
    }

    g$.removeRowTable = function (params) {
        var params = g$.alterSargentos(params),
            table = $("[data-id='" + params[1].trim() + "']"),
            row = table[0].querySelector("[data-tt-id='" + params[2].trim() + "']"),
            table = table.DataTable();
        table
            .row(row)
            .remove()
            .draw();
    }

    // FUNÇÂO READ  
    $scope.get = function (elm, template, nome, filtro, nome_procedure, idFuncao, isTela) {
        var keys, td, elm = elm, nome_proc_parametro, obj, select, campos, j = 0, nomeProc;

        if (nome_procedure && nome_procedure != "") {
            if (nome_procedure.split("¦")[1]) {
                nomeProc = "call " + nome_procedure.split("¦")[0].trim() + '(' + nome_procedure.split("¦")[1] + ',"' + elm.dataset.tabela_consulta_id + '")'
            }
            else {
                nome_procedure = nome_procedure.split("¦")[0].trim()
                if (query.toLocaleLowerCase().indexOf("select") < 10) {
                    nomeProc = nome_procedure; select = true;
                    campos = nomeProc.toLocaleLowerCase().substring(nomeProc.toLocaleLowerCase().indexOf("select "), nomeProc.toLocaleLowerCase().indexOf(" from ")).split(",");
                    selectCompleto = nomeProc;
                    nomeProc = "";
                    for (i = 0; i < elm.tBodies[0].rows[0].cells.length; i++) {
                        if (!(((elm.dataset.tbl_selecionarlinha == "1" || elm.dataset.tbl_selecionarlinha) && i == 0) || (elm.dataset.tbl_delete == "1" && i == elm.tBodies[0].rows[0].cells.length - 1))) {

                            nomeProc = (j == campos.length - 1) ? nomeProc + campos[j] + " as e_" + elm.tBodies[0].rows[0].cells[i].dataset.id + selectCompleto.toLocaleLowerCase().substring(selectCompleto.toLocaleLowerCase().indexOf(" from ")) : nomeProc + campos[j] + " as e_" + elm.tBodies[0].rows[0].cells[i].dataset.id + ",";
                            j++;

                        }
                    }
                }
                else {
                    // Chama a proc passada por parametro
                    nomeProc = "call " + nome_procedure + '(' + elm.dataset.tabela_consulta_id + ',"' + $rootScope.user.banco + '", "' + filtro + '")';
                }
            }
            $http.post(URL + "/jsonQuery/", g$.trataQuery(nomeProc)).success(function (data) {
                // Executa a proc passada por parametro
                if (g$.exceptionRequisicao("ProcLe - Tabela", data)) return;

                if (data.error) {
                    $("#loadzinTelaTb")[0].outerHTML = "";
                }

                var table = $("#view [data-id=" + elm.dataset.id + "]").DataTable();
                table.destroy();

                // Compila o template
                template = $compile(template)($scope)[0];
                template = (template) ? template : elm;
                $scope[nome + "s"] = (select) ? data.data : data.data[0];
                $scope[nome + "s"][$scope[nome + "s"].length] = {};
                if (elm.dataset.tbl_treeview != "null" && elm.dataset.tbl_treeview == "1") {
                    elm.dataset.tbl_linhanova = "0";
                    $scope[nome + "s"][$scope[nome + "s"].length] = {};
                }

                $("#view [data-id='" + elm.dataset.pai + "']")[0].innerHTML = ""
                $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(template);

                // Instancia o DataTable
                $scope.dataTable(elm, nome);
                $scope.setAttributesCells(elm);
                $scope.addEventosElmsTabela(elm);

                // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao

                if ($("#loadzinTabelaz")[0]) {
                    $("#loadzinTabelaz")[0].outerHTML = "";
                }
                g$.vfyFuncaoDepois(idFuncao, isTela);
            });
        }
        else {
            filtro = (filtro == "") ? "0=0" : filtro;
            filtro = filtro.replace(/\%/g, "‰");
            $http.get(URL + "/le/" + elm.dataset.consulta_id + "/" + $rootScope.user.banco + "/" + filtro + "/false/").success(function (data) {
                if (g$.exceptionRequisicao("ProcLe - TABELA", data)) return;

                $http.post(URL + "/jsonQuery/", g$.trataQuery(data.data[0][0].consulta)).success(function (data) {

                    // Trata Excecao
                    if (g$.exceptionRequisicao("Query - Tabela", data)) return;

                    if (data.error) {
                        $("#loadzinTabelaz")[0].outerHTML = "";
                    }

                    var table = $("#view [data-id=" + elm.dataset.id + "]").DataTable();
                    table.destroy();

                    // Compila o template
                    template = $compile(template)($scope)[0];
                    template = (template) ? template : elm;
                    $scope[nome + "s"] = data.data;
                    $scope[nome + "s"][$scope[nome + "s"].length] = {};

                    if (elm.dataset.tbl_treeview != "null" && elm.dataset.tbl_treeview == "1") {
                        elm.dataset.tbl_linhanova = "0";
                        $scope[nome + "s"][$scope[nome + "s"].length] = {};
                    }

                    $("#view [data-id='" + elm.dataset.pai + "']")[0].innerHTML = ""
                    $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(template);

                    // Instancia o DataTable
                    $scope.dataTable(elm, nome);
                    $scope.setAttributesCells(elm);
                    $scope.addEventosElmsTabela(elm);

                    // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
                    if ($("#loadzinTabelaz")[0]) {
                        $("#loadzinTabelaz")[0].outerHTML = "";
                    }
                    g$.vfyFuncaoDepois(idFuncao, isTela);
                });
            });
        }
    }

    $scope.dataTable = function (elm, nome) {
        var query = "SELECT coluna_id, visivel FROM node.elemento_nao_visivel WHERE tabela_id = " + elm.dataset.id + " AND user_id = " + g$.user.id;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {

            data.data.forEach(function (v) {
                var tds = $("[data-id='" + v.coluna_id + "']"),
                    tabela = tds[0].parentElement.parentElement.parentElement,
                    th = tabela.querySelectorAll("th")[tds[0].cellIndex];
                if (!v.visivel) {
                    tds.addClass("play-none");
                    th.classList.add("play-none");
                }
                else {
                    tds.removeClass("play-none");
                    th.classList.remove("play-none");
                }
            });

            if (elm.dataset.tbl_linhanova && elm.dataset.tbl_linhanova == "1" && !elm.dataset.templateLinha) {
                elm.dataset.templateLinha = $("#view [data-id=" + elm.dataset.id + "] tr")[$("#view [data-id=" + elm.dataset.id + "] tr").length - 1].outerHTML;
            }
            $("#view [data-id=" + elm.dataset.id + "]").DataTable({
                dom: 'l' + ((elm.dataset.tabela_botao_filtro == "1") ? 'c' : '') +
                ((elm.dataset.tbl_modal && elm.dataset.tbl_modal.trim() != "" && elm.dataset.tbl_modal.trim() != "null") ? 'm' : '') + 'Brtip',
                "language": {
                    "url": "../lib/datatable/js/Portuguese-Brasil.json"
                },
                "paging": (elm.dataset.tabela_paginate == "1") ? true : false,
                "searching": (elm.dataset.tabela_pesquisar == "1") ? true : false,
                "info": (elm.dataset.tabela_info == "1") ? true : false,
                "buttons": [
                    ((elm.dataset.tabela_botao_copiar == "1") ? 'copy' : undefined),
                    ((elm.dataset.tabela_botao_excel == "1") ? 'excel' : undefined),
                    ((elm.dataset.tabela_botao_pdf == "1") ? 'pdf' : undefined),
                    ((elm.dataset.tabela_botao_imprimir == "1") ? 'print' : undefined)
                ]
            });
            if (elm.dataset.tbl_linhanova == "0" || elm.dataset.bloqueado == "1")
                elm.querySelectorAll("tr")[elm.querySelectorAll("tr").length - 1].classList.add("play-none");
            if (elm.dataset.tbl_treeview == "1") {
                var template = "<input id='selecionarLinha' type='checkbox' onclick=\"selecionarLinha('" + nome + "')\">";
                $scope.init_treeview(elm);
                for (var i = 0; i < elm.tBodies[0].rows.length; i++) {
                    elm.tBodies[0].rows[i].cells[0].innerHTML += template;
                }
            }
        });
    }

    /*
        Achar todos os filhos, se tiver
            Se ele tiver pai deixa play-none tambem..
            senao 
                mostra a linha 
                Deixa a setinha
                Deixar o display none nos filhos 
        Senao
            Tirar a setinha
    */
    $scope.init_treeview = function (elm) {
        var filhos;
        for (var i = 0; i < elm.tBodies[0].rows.length; i++) {
            // Achar os filhos do pai
            filhos = $("[data-id='" + elm.dataset.id + "'] tr[data-tt-parent-id='" + elm.tBodies[0].rows[i].dataset.ttId + "']")
            if (elm.tBodies[0].rows[i].dataset.ttParentId == "") {
                if (!filhos || !filhos.length) {
                    elm.tBodies[0].rows[i].cells[0].innerHTML = "";
                }
                // Se ele tiver pai, deixa play-none tambem
                elm.tBodies[0].rows[i].classList.remove("play-none");
            }
            else {
                if (!filhos || !filhos.length) {
                    elm.tBodies[0].rows[i].cells[0].innerHTML = "";
                }
                // elm.tBodies[0].rows[i].classList.remove("play-none");
            }
        }
    }

    g$.clickTreeView = function () {
        var elm = event.target,
            cell = elm.parentElement,
            row = cell.parentElement,
            tbl = row.parentElement.parentElement,
            filhos = $("[data-id='" + tbl.dataset.id + "'] tr[data-tt-parent-id='" + row.dataset.ttId + "']");
        if (row.dataset.aberto == "1") {
            elm.className = "fa fa-caret-right";
            row.dataset.aberto = 0;
            filhos.addClass("play-none");
            // for()
        }
        else {
            elm.className = "fa fa-caret-down";
            filhos.removeClass("play-none");
            row.dataset.aberto = 1;
        }
    }

    function removeFilhos(filhos) {
        for (var i = 0; i < filhos.length; i++) {
            filhos[i].cells[0].children[0].className = "fa fa-caret-down";
            filhos[i].removeClass("play-none");
            filhos[i].dataset.aberto = 1;
        }
    }

    $scope.setAttributesCells = function (elm) {
        var trs, cells, campo;
        $http.get("/").success(function () {
            trs = $("#view [data-id='" + elm.dataset.id + "']")[0].tBodies[0].rows;

            for (var i = 0; i < trs.length; i++) {
                cells = trs[i].cells;
                for (var j = 0; j < cells.length; j++) {
                    // Se tiver uma coluna na tabela com o campo cor da linha, pinta a linha toda 
                    if (cells[j].dataset.texto && cells[j].dataset.texto.toUpperCase() == "CORDALINHA")
                        trs[i].style.background = cells[j].innerHTML.trim();

                    if (cells[j].dataset.texto && cells[j].dataset.texto.toUpperCase() == "CORDAFONTE")
                        trs[i].style.color = cells[j].innerHTML.trim();

                    // Display
                    if (cells[j].dataset.nome && cells[j].dataset.nome != "null" && cells[j].dataset.nome.indexOf("|") > -1) {
                        var params = g$.alterSargentos(cells[j].dataset.nome),
                            elemento = params[0].trim(),
                            prop = params[1].trim(),
                            valorprop = params[2].trim(),
                            filtro = params[3].trim();

                        if (cells[j].querySelectorAll("span")[1]) filtro = filtro.replace("valor", cells[j].querySelectorAll("span")[1].innerHTML);
                        else if (cells[j].querySelectorAll("input")[0]) {
                            if (cells[j].querySelectorAll("input")[0].type == "checkbox") filtro = filtro.replace("valor", cells[j].querySelectorAll("input")[0].checked ? 1 : 0);
                            else filtro = filtro.replace("valor", cells[j].querySelectorAll("input")[0].value);
                        }
                        else filtro = filtro.replace("valor", cells[j].innerHTML);

                        filtro = g$.validaCondicao(filtro);

                        if (filtro) {
                            elemento.split("¦").forEach(function (v) {
                                if (prop == "display") cells[j].parentElement.querySelector("[data-id='" + v.trim() + "']").style.display = valorprop;
                                else if (prop == "nome" && $("[data-id='" + v.trim() + "']")[0].id == "icone") {
                                    cells[j].parentElement.querySelector("[data-id='" + v.trim() + "']").className = "fa " + valorprop;
                                }

                            });
                        }

                    }

                    if (cells[j].innerHTML && cells[j].innerHTML.indexOf("«") > -1) {
                        cells[j].innerHTML = "<label data-" + cells[j].innerHTML.split("«")[1].split("=")[0] + "=" +
                            cells[j].innerHTML.split("«")[1].split("=")[1] + "> " + cells[j].innerHTML.split("«")[2] + "</label>";
                    }
                }
            }

            cells = trs[0].cells;
            for (var i = 0; i < cells.length; i++) {
                if (cells[i].dataset.display == "none") {
                    $("[data-id='" + elm.dataset.id + "'] [data-id='" + cells[i].dataset.id + "']").addClass("play-none");
                    $("#view [data-id='" + elm.dataset.pai + "'] thead tr th")[cells[i].cellIndex].classList.add("play-none");
                }
            }
        });
    }

    // Adiciona os eventos nos elementos da tela
    $scope.addEventosElmsTabela = function (elmTabela) {
        var queryEventsTabela = "SELECT ef.*, e.menu_id FROM node.elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and e.menu_id = " +
            elmTabela.dataset.menu_id + " AND evento_tabela='1' and isnull(ef.depois) ORDER BY ef.ordem";

        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryEventsTabela.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Eventos - Tabela", data)) return;

            data.data.forEach(function (v, i) {
                elementos = $("[data-id = '" + elmTabela.dataset.id + "']")[0].querySelectorAll("[data-id='" + v.elemento_id + "']");
                funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                    params = v.funcao;

                for (var i = 0; i < elementos.length; i++) {
                    elementos[i].addEventListener(v.evento, g$[funcao.trim()].bind(null, params, false), false);
                }
            });
        });
    }

    g$.setAttributeCell = function (td, valor) {
        td.innerHTML = "<label data-" + valor.split("«")[1].split("=")[0] + "=" +
            valor.split("«")[1].split("=")[1] + "> " + valor.split("«")[2] + "</label>";
    }

    // FUNCAO SELECIONAR LINHA NA TABELA
    selecionarLinha = function (nome) {
        var valor, obj = $scope[nome + "s"][event.target.parentElement.dataset.indexRow],
            row = event.target.parentElement.parentElement, coluna_id,
            tabela = $("#view [data-pai='" + row.parentElement.parentElement.dataset.pai + "']")[0],
            multiselect = (tabela.dataset.tabela_multiselect == "1") ? true : false;

        // Remove a classe da linha anterior se existir alguma selecionada e nao for multiselect
        if (tabela.querySelector("tr.active") && !multiselect) {
            tabela.querySelector("tr.active").cells[0].children[0].checked = false;
            tabela.querySelector("tr.active").className = "";
        }

        // Na hora de selecionar
        if (event.target.checked) {
            row.className = 'active';
            valor = (row.cells[1].querySelectorAll("span")[0]) ? row.cells[1].querySelectorAll("span")[row.cells[1].querySelectorAll("span").length - 1].innerHTML : row.cells[1].innerHTML;
            g$[tabela.dataset.nome + "ID"] = valor;
            g$[tabela.dataset.nome + "_elemento"] = row;

            if (multiselect) {
                if (!g$[tabela.dataset.nome + "_array"]) g$[tabela.dataset.nome + "_array"] = [];
                g$[tabela.dataset.nome + "_array"].push(obj);
            }
        }
        // Deseleciona
        else {
            if (multiselect) {
                // Remove a classe apenas daquela linha no multiselect
                coluna_id = "e_" + event.target.parentElement.parentElement.cells[1].dataset.id;
                event.target.parentElement.parentElement.className = "";
                g$[tabela.dataset.nome + "_array"].forEach(function (v, i) {
                    if (v[coluna_id] == obj[coluna_id]) g$[tabela.dataset.nome + "_array"].splice(i, 1);
                })
            }

            delete g$[tabela.dataset.nome + "ID"];
            delete g$[tabela.dataset.nome + "_elemento"];
        }
    }

    // FUNCAO SELECIONAR TODOS NA TABELA
    selecionarTodos = function () {
        var tabela = event.target.parentElement.parentElement.parentElement.parentElement,
            rows = tabela.querySelectorAll("tbody tr td:first-child"),
            obj = $scope[tabela.dataset.nome + tabela.dataset.id + "s"];

        // Na hora de selecionar
        if (event.target.checked) {
            $("[data-id='" + tabela.dataset.id + "'] tr").addClass("active");
            g$[tabela.dataset.nome + "_array"] = obj;
            for (var i = 0; i < rows.length; i++) {
                rows[i].children[0].checked = true;
            }
        }
        // Deseleciona
        else {
            $("[data-id='" + tabela.dataset.id + "'] tr").removeClass("active");
            for (var i = 0; i < rows.length; i++) {
                rows[i].children[0].checked = false;
            }
            delete g$[tabela.dataset.nome + "_array"];
        }

        delete g$[tabela.dataset.nome + "ID"];
        delete g$[tabela.dataset.nome + "_elemento"];
    }

    // FUNCAO DELETAR LINHA NA TABELA
    deletarLinha = function (e) {
        var elm = event.target, queryResult, tabela,
            row = (elm.tagName == "I") ? elm.parentElement.parentElement : elm.parentElement,
            campo = g$.filterCampo(row.cells[1].dataset.le_do_campo),
            elmTabela = row.parentElement.parentElement,
            queryBanco = "SELECT * FROM consulta WHERE tela_id = " + $scope.getIDMenuItem();

        tabela = g$.filterTabela(row.cells[1].dataset.le_da_tabela, true);

        if (elmTabela.dataset.bloqueado == "1") return Materialize.toast('Tabela Bloqueada!', 2000, 'red darken-1');

        if (!confirm("Tem certeza que deseja excluir essa linha " + tabela + "?")) return;

        // Deleta a linha da tabela
        var table = $(elmTabela).DataTable();
        table.row(row).remove().draw();

        // $http.get(URL + "/get/" + queryBanco).success(function(data) {
        //     // Trata Excecao
        //     if (g$.exceptionRequisicao("Delete Linha - Tabela", data)) return;;

        //     // Abre a Conexao com o banco do Usuario

        // banco = (!data.data[0].banco) ? $rootScope.user.banco : data.data[0].banco;

        var banco = $rootScope.user.banco;
        tabela = (tabela.indexOf(".") > -1) ? tabela : banco + "." + tabela;

        queryResult = "DELETE FROM " + tabela + " WHERE " + campo + " = " + row.cells[1].innerHTML;
        queryResult = g$.trataQuery(queryResult.trim());

        queryResult.script.tela_id = g$.tela_id;
        queryResult.script.elemento_id = "Tabela";

        // Insere 
        $http.post(URL + "/jsonQuery/", queryResult)
            .success(function (data) {
                // data = data.data;

                // Trata Excecao
                if (g$.exceptionRequisicao("Delete Linha - Tabela", data)) return;

                Materialize.toast('Deletado com Sucesso!', 4000, 'green darken-1');

                //depoisDeExcluir
                var query = "SELECT * FROM node.elemento_funcao WHERE elemento_id = " + elmTabela.dataset.id +
                    " AND evento = 'depoisDeExcluir' and isnull(depois) order by ordem";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Tabela", data)) return;

                    data.data.forEach(function (v) {
                        var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                            params = v.funcao;
                        g$[funcao.trim()](params);
                    });
                });
            });
        // });
    }

    // FUNCAO SELECIONAR CELULA NA TABELA e COLOCA O ELEMENTO DENTRO DA CELULA
    selecionarCelula = function (cell, input_move_left) {
        var elm = event.target, obj, selectbox, tabela, campo, input;

        if (elm.id == "seta_treeview") return;

        // DETALHE: Quando é move com as setas, nao passa o parametro o cell

        // Procura a CELULA
        if (cell) {
            elm = cell;
            if (elm.children[0] && (elm.children[0].tagName == "TEXTAREA" || elm.children[0].tagName == "INPUT")) {
                if (elm.children[0].type != "checkbox") {
                    if (input_move_left) {
                        elm.children[0].selectionStart = 0;
                        elm.children[0].focus();
                    }
                    else {
                        elm.children[0].selectionStart = elm.children[0].value.length - 1;
                        elm.children[0].focus();
                    }
                }
                else elm.children[0].focus();
            }
            // Verifica se dentro da celula tem combo 
            // else if (elm.children[0] && elm.children[0].id == "selectbox") {
            //     if (elm.children[0].children[1]) elm.children[0].children[1].focus();
            // }
            else elm.focus();
        }
        // Se clicar no icone, verifica se o pai é um botao(elemento arrastado), senao ele sai
        else if (elm.id == "icone") {
            if (elm.parentElement.id == "botao") elm = elm.parentElement.parentElement;
            else return;
        }
        else if (elm.id == "botao") {
            if (elm.tagName == "SPAN") elm = elm.parentElement.parentElement;
            else elm = elm.parentElement;
        }
        else if (elm.id != "td") {
            elm = elm.parentElement;
        }

        var pai = (elm.id == "tdSelecionar") ? elm.parentElement.parentElement.parentElement.dataset.pai : elm.dataset.pai;

        tabela = $("#view [data-id='" + pai + "']")[0];

        g$.idDaLinha = elm.parentElement.cells[1].innerHTML;
        g$[tabela.dataset.nome + "_elemento"] = elm.parentElement;

        // Procura na tabela alguma td com a classe border-cell-table
        $("#view [data-id='" + elm.dataset.pai + "'] tr td").removeClass("border-cell-table");
        elm.classList.add("border-cell-table");

        elm.onkeydown = moveTable;
    }

    function colocaElemento(cell, input_move_left) {
        var elm = cell, obj = cell.dataset, input;

        if (elm.parentElement.parentElement.parentElement.dataset.bloqueado == "1") return Materialize.toast('Tabela Bloqueada!', 2000, 'red darken-1');

        if (event.keyCode == 13) {
            event.stopPropagation();
            event.preventDefault();
        }

        // Se ele seliconar o combobox, chama a funcao
        if (event.keyCode == 32 && event.target.type == "checkbox") checkCLICK(true);

        if (elm.children[0]) {
            elm.dataset.valueantigo = elm.querySelector("input").value;
            $scope.texto = elm.querySelector("input").value;
        }
        else {
            if (obj.cell_tipo == "date") {
                elm.dataset.valueantigo = g$.formataDataBanco(elm.innerHTML);
                $scope.texto = g$.formataDataBanco(elm.innerHTML);
            }
            else {
                elm.dataset.valueantigo = elm.innerHTML;
                $scope.texto = elm.innerHTML;
            }
        }

        // Implementar Valor do campo e se for igual nao salvar e se der ESC colocar o valor que estava antes, sem salvar novamente

        // Se for input
        if (obj.input_ativo == "1") {

            // Adiciona classe para tirar o padding da celula
            elm.classList.add("no-padding");

            if (obj.cell_tipo == "date") {
                input = angular.element("<input type='date' class='form-control' />")[0];
            }
            else {
                input = angular.element("<textarea class='form-control textarea-table'> </textarea>")[0];
                input.style.height = elm.offsetHeight + "px";
            }

            if (elm.children[0]) elm.children[0].focus();
            else {
                elm.innerHTML = ""; //Coloca o input dentro da tag
                elm.appendChild(input);
                if (elm.dataset.cell_tipo == "date") {
                    elm.querySelector("input").value = $scope.texto; //Coloca o texto da Celula dentro do input
                }
                else elm.children[0].value = $scope.texto; //Coloca o texto da Celula dentro do input

                // Coloca o valor de antes na celula
                elm.dataset.value = $scope.texto;

                //Adiciona os eventos no INPUT
                if (elm.children[0].tagName == "LABEL") elm = elm.children[0];
                elm.children[0].addEventListener("blur", salvarTabela, false);
                elm.children[0].addEventListener("keydown", inputKEYDOWN, false);

                elm.children[0].focus(); //Coloca o focus no input
            }
        }
        else if (obj.combo_ativo == "1") colocaCombo(event.target);
    }

    checkCLICK = function (keyCode) {
        var elmTabela = event.target.parentElement.parentElement.parentElement.parentElement;

        if (elmTabela.dataset.bloqueado == "1") {
            event.target.checked = !event.target.checked;
            return Materialize.toast('Tabela Bloqueada!', 2000, 'red darken-1');
        }

        // Se nao tiver alterando pelo space, ele coloca o valor oposto;
        if (keyCode) event.target.checked = !event.target.checked;
        salvarTabela(true);
        g$.idDaLinha = event.target.parentElement.parentElement.cells[1].textContent;
    }

    // Evento quando apertar a tecla ENTER e ESC, chama a função abaixo
    function inputKEYDOWN() {

        var elm = event.target,
            td = (elm.type == "date") ? elm.parentElement.parentElement : event.target.parentElement;

        if (event.keyCode == 27) {
            g$.TABLE_ESC = true;
            // Remove classe para tirar o padding da celula
            td.classList.remove("no-padding");
            td.focus();
            if (td.dataset.cell_tipo == "date") {
                td.innerHTML = g$.formataDataBarra(td.dataset.value);
            }
            else td.innerHTML = td.dataset.value;
        }
        else if (event.keyCode == 13) {
            // Se ENTER for igual true é porque o texto é igual
            if (elm.value.trim() == td.dataset.value.trim()) {
                g$.mesmoTexto = true;
                g$.TABLE_ENTER = true;
                td.innerHTML = td.dataset.value;
            }
            else {
                g$.TABLE_ESC = false;
                g$.TABLE_ENTER = true;
                td.innerHTML = elm.value; // ENTER
            }
        }

    }

    // Move Table 
    moveTable = function (e) {
        var elm = event.target, cellIndex, rowIndex, linhas;

        if (elm.tagName == "INPUT" || elm.tagName == "TEXTAREA") {
            if (elm.type != "checkbox") {
                // $scope.texto = event.target.value;
                if (event.keyCode == 37 && elm.selectionStart > 0) return;
                else if (event.keyCode == 39 && elm.selectionStart < elm.value.length) return;
            }
            elm = elm.parentElement;
        }
        // elm = (elm.type == "checkbox" || elm.id == "selectbox") ? elm.parentElement : elm;
        cellIndex = elm.cellIndex;
        if (elm.parentElement) rowIndex = elm.parentElement.rowIndex;
        linhas = $("#view [data-id='" + elm.dataset.pai + "'] tr")


        if (event.keyCode == 39) moveCelulaRight(linhas, rowIndex, cellIndex); // MOVE RIGHT
        else if (event.keyCode == 37) moveCelulaLeft(linhas, rowIndex, cellIndex); // MOVE LEFT
        else if (event.keyCode == 40) moveCelulaBottom(linhas, rowIndex, cellIndex); // MOVE BOTTOM
        else if (event.keyCode == 38) moveCelulaTop(linhas, rowIndex, cellIndex); // MOVE TOP
        else colocaElemento(elm);
    }

    colocaCombo = function (elm) {
        var elm = (elm) ? elm : event.target.parentElement,
            tbl = elm.parentElement.parentElement.parentElement,
            obj = elm.dataset, option;
        tabela = g$.filterTabela(obj.combo_tabela, true);
        campo = g$.filterCampo(obj.combo_campo);

        g$.idDaLinha = elm.parentElement.cells[1].innerHTML;
        g$[tbl.dataset.nome + "_elemento"] = elm.parentElement;

        obj.comboQuery = (obj.comboQuery) ? obj.comboQuery : "";
        obj.comboFiltro = (obj.comboFiltro) ? obj.comboFiltro : "";

        if (tbl.dataset.bloqueado == "1") return Materialize.toast('Tabela Bloqueada!', 2000, 'red darken-1');

        selectbox = "<combo-tabela id='selectbox' data-nome='" + obj.texto + "' data-combo-query='" + obj.comboQuery + "' data-combo-value = '" + elm.innerHTML.split("<i")[0] +
            "' data-table-move='true' data-combo-filtro=\"" + obj.comboFiltro + "\" " + "data-combo-tabela='" + tabela +
            "' data-combo-campo='" + campo + "' data-combo-grava-campo='" + obj.comboGravaCampo + "'> </combo-tabela>";
        // elm.dataset.value = elm.innerHTML.split("<i")[0];
        // elm.innerHTML = "";
        selectbox = $compile(angular.element(selectbox)[0])($scope)[0];
        elm.appendChild(selectbox);

        // Adiciona classe para tirar o padding da celula
        // elm.classList.add("no-padding");
    }

    function moveCelulaLeft(linhas, rowIndex, cellIndex) {
        var i = 1, cells = linhas[rowIndex].querySelectorAll("td:not(.tdCombo)");

        // Se a celula nao estiver visivel, procura a visivel
        if (cells[cellIndex - i].classList.contains("play-none")) {
            // Enquanto encontrar uma coluna play - none, vai procurando a proxima
            while (cells[cellIndex - i].classList.contains("play-none")) i++;
            if (cells[cellIndex - i].id != "") selecionarCelula(cells[cellIndex - i], true);
        }
        else if (cells[cellIndex - i].id != "") {
            selecionarCelula(cells[cellIndex - i], true);
        }
        event.stopPropagation();
        event.preventDefault();
    }

    function moveCelulaTop(linhas, rowIndex, cellIndex) {
        if (linhas[rowIndex - 1] && linhas[rowIndex - 1].cells[0].tagName != "TH") {
            selecionarCelula(linhas[rowIndex - 1].querySelectorAll("td:not(.tdCombo)")[cellIndex]);
        }
        event.stopPropagation();
        event.preventDefault();
    }

    function moveCelulaBottom(linhas, rowIndex, cellIndex) {
        if (linhas[rowIndex + 1]) {
            selecionarCelula(linhas[rowIndex + 1].querySelectorAll("td:not(.tdCombo)")[cellIndex]);
        }
        event.stopPropagation();
        event.preventDefault();
    }

    function moveCelulaRight(linhas, rowIndex, cellIndex) {
        var i = 1, cells = linhas[rowIndex].querySelectorAll("td:not(.tdCombo)");

        // Se a celula nao estiver visivel, procura a visivel
        if (cells[cellIndex + i].classList.contains("play-none")) {
            // Enquanto encontrar uma coluna play - none, vai procurando a proxima
            while (cells[cellIndex + i].classList.contains("play-none")) i++;
            if (cells[cellIndex + 1].id != "deleteRow") selecionarCelula(cells[cellIndex + i]);
        }
        else if (cells[cellIndex + 1].id != "deleteRow") selecionarCelula(cells[cellIndex + 1]);
        event.stopPropagation();
        event.preventDefault();
    }

    g$.comboKEYDOWN = function (e) {
        var value = event.target.parentElement.parentElement.dataset.value, elm;

        if (event.keyCode == 27) {
            g$.TABLE_ESC = true;
            event.target.parentElement.parentElement.classList.remove("no-padding");
            event.target.parentElement.parentElement.focus();
            event.target.parentElement.parentElement.innerHTML = value + "<i class='fa fa-caret-down dropcombotable' onclick='colocaCombo()'> </i>"; // ESC
        }
    }

    salvarTabela = function (check, elm) {
        var elm = (elm) ? elm : event.target, lenCells,
            td = (elm.type == "date") ? elm.parentElement.parentElement : elm,
            obj = {}, tabela, campo, row, elementoTabela;

        if (elm.tagName == "TD") colCelula = elm;
        else if (td.tagName == "TD") colCelula = td;
        else colCelula = elm.parentElement;

        if (g$.TABLE_ESC) {
            g$.TABLE_ESC = false;

            // if (elm.id == "selectbox") {
            //     // Remove a classe que tira o padding da celula
            //     elm.parentElement.parentElement.classList.remove("no-padding");
            //     elm.parentElement.parentElement.innerHTML = elm.parentElement.parentElement.dataset.value;
            // }
            // else {
            colCelula.classList.remove("no-padding");
            colCelula.innerHTML = colCelula.dataset.value;
            // }
            event.stopPropagation();
            return event.preventDefault();
        }

        if (g$.mesmoTexto) {
            g$.TABLE_ENTER = false;
            g$.mesmoTexto = false;
            // Remove a classe que tira o padding da celula
            colCelula.classList.remove("no-padding");
            colCelula.focus();
            return Materialize.toast('Mesmo Texto!', 2000, 'orange darken-1');
        }

        if (elm.tagName == "TEXTAREA" || (elm.tagName == "INPUT" && elm.type != "checkbox" && elm.id != "selectbox")) {
            elm = (elm.id == "selectbox") ? elm.parentElement : elm;
            if (elm.value.trim() == colCelula.dataset.value.trim()) {
                // Remove a classe que tira o padding da celula
                colCelula.classList.remove("no-padding");
                colCelula.innerHTML = colCelula.dataset.value;
                return Materialize.toast('Mesmo Texto!', 2000, 'orange darken-1');
            }
        }

        row = colCelula.parentElement;
        elementoTabela = row.parentElement.parentElement;

        check = (event.target.type == "check") ? true : false;

        if (row.children[1].innerHTML != "") {
            tabela = g$.filterTabela(row.cells[1].dataset.grava_na_tabela, true);
            campo = g$.filterCampo(colCelula.dataset.grava_no_campo);
            obj[g$.filterCampo(row.cells[1].dataset.grava_no_campo)] = (row.cells[1].querySelectorAll("span")[1]) ? row.cells[1].querySelectorAll("span")[1].innerHTML.trim() : row.cells[1].innerHTML;

            // Se for check coloca 1 ou 0
            if (colCelula.dataset.coluna_check == "1") {
                obj[campo] = (colCelula.children[0].checked) ? 1 : 0;
            }
            // Se for combobox 
            else if (colCelula.dataset.combo_ativo == "1") {
                if (colCelula.dataset.value) obj[campo] = (colCelula.dataset.value != "") ? colCelula.dataset.value : null;
            }
            // Se for Data
            else if (colCelula.dataset.cell_tipo == "date") {
                obj[campo] = colCelula.querySelector("input").value.split("/").reverse().join("-");
            }
            else if (colCelula.querySelector("span")) {
                obj[campo] = (colCelula.querySelector("span").innerHTML.trim().length) ? colCelula.querySelector("span").innerHTML.trim() : null;
            }
            // Se for input
            else obj[campo] = (colCelula.children[0].value.trim().length) ? colCelula.children[0].value : null;

            // if (elm.id == "selectbox")
            // obj = g$.omitirPropriedade(obj);
            obj[campo] = (obj[campo] == "") ? null : obj[campo];
            inputAlterar(tabela, obj, row, colCelula, elementoTabela);
        }
        else {
            lenCells = (elementoTabela.dataset.tbl_delete == 1) ? row.cells.length - 1 : row.cells.length;
            for (var i = 1; i < lenCells; i++) {
                if (!row.cells[i].dataset.grava_na_tabela || !row.cells[i].dataset.grava_no_campo || (row.cells[i].dataset.grava_na_tabela == "null" || row.cells[i].dataset.grava_na_tabela == "") ||
                    (row.cells[i].dataset.grava_no_campo == "null" || row.cells[i].dataset.grava_no_campo == "")) {
                    g$.exibeQuery("Elemento Tela", "O elemento " + row.cells[i].dataset.id + " está sem o grava na tabela ou grava no campo!");
                    continue;
                }

                tabela = g$.filterTabela(row.cells[i].dataset.grava_na_tabela, true);
                campo = g$.filterCampo(row.cells[i].dataset.grava_no_campo);

                if (tabela != "" && campo != "") {
                    // && !row.cells[i].children[0].classList.contains("dropcombotable") no id abaixo
                    if (row.cells[i].children[0]) {
                        // Se for check coloca 1 ou 0
                        if (row.cells[i].dataset.coluna_check == "1") obj[campo] = (row.cells[i].children[0].checked) ? 1 : 0;
                        // Se for combobox 
                        else if (row.cells[i].dataset.combo_ativo == "1") {
                            if (row.cells[i].dataset.value) obj[campo] = (row.cells[i].dataset.value != "") ? row.cells[i].dataset.value : null;
                        }
                        // Se for Data
                        else if (row.cells[i].dataset.cell_tipo == "date") {
                            obj[campo] = row.cells[i].querySelector("input").value.split("/").reverse().join("-");
                        }
                        else if (row.cells[i].querySelector("span")) {
                            obj[campo] = (row.cells[i].querySelector("span").innerHTML.trim().length) ? row.cells[i].querySelector("span").innerHTML.trim() : null;
                        }
                        // Se for input
                        else obj[campo] = (row.cells[i].children[0].value.trim().length) ? row.cells[i].children[0].value : null;
                    }
                    // Se for combo
                    else if (row.cells[i].dataset.combo_ativo == "1") continue;
                    // Se for Data
                    else if (row.cells[i].dataset.cell_tipo == "date") {
                        obj[campo] = row.cells[i].innerHTML.split("/").reverse().join("-");
                    }
                    else obj[campo] = row.cells[i].innerHTML;

                    if (obj[campo] === "") {
                        if (row.cells[i].dataset.obrigatorio == "1") {
                            if (g$.TABLE_ENTER == true) {
                                g$.TABLE_ENTER = false;
                                // if (event.target.id == "selectbox") event.target.parentElement.parentElement.focus();
                                // else 
                                event.target.parentElement.focus();
                            }
                            // se for data coloca o valor formatado
                            if (colCelula.dataset.cell_tipo == "date") {
                                colCelula.innerHTML = g$.formataDataBarra(colCelula.querySelector("input").value);
                            }
                            return Materialize.toast('O campo ' + campo + ' é obrigatório!', 4000, 'red darken-1');
                        }
                        else delete obj[campo];
                    }
                }
            }
            obj = g$.omitirPropriedade(obj);
            inputNovo(tabela, obj, row, colCelula, elementoTabela);
        }
    }

    function inputNovo(tabela, obj, row, colCelula, elementoTabela) {
        var banco, grava_tabela, queryInsert,
            query = "select * from elemento_funcao where elemento_id = " + row.parentElement.parentElement.dataset.id,
            queryBanco = "SELECT * FROM consulta WHERE tela_id = " + $scope.getIDMenuItem();

        // $http.get(URL + "/get/" + queryBanco).success(function (data) {
        //     // Trata Excecao
        //     if (g$.exceptionRequisicao("Tabela", data)) return;;

        //     // Abre a Conexao com o banco do Usuario
        //     banco = (!data.data[0].banco) ? $rootScope.user.banco : data.data[0].banco;

        var banco = $rootScope.user.banco, script;

        // Coloca as colunas invisíveis no objeto
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (g$.exceptionRequisicao("gravanaTabela - Tabela", data)) return;

            if (data.data.length) {
                for (var i = 0; i < data.data.length; i++) {
                    var params = g$.alterSargentos(data.data[i].funcao);
                    if (params[0].trim() == "gravanaTabela") {
                        var campo = params[1].trim();
                        valor = params[3].trim();
                        obj[campo] = valor;
                    }
                }
            }


            if (tabela.indexOf("node.") == -1) {
                grava_tabela = banco + "." + tabela;
            } else {
                grava_tabela = tabela;
            }

            // Procura se tem algum evento antes de inserir
            query = "SELECT * FROM node.elemento_funcao WHERE elemento_id = " + row.parentElement.parentElement.dataset.id +
                " AND evento = 'antesDeGravar' AND isnull(depois) order by ordem";
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                // Trata Excecao
                if (g$.exceptionRequisicao("AntesDeGravar - Tabela", data)) return;

                for (var i = 0; i < data.data.length; i++) {
                    var funcao = data.data[i].funcao.split("|")[0].split("¦")[0].trim(),
                        params = data.data[i].funcao, retorno;
                    retorno = g$[funcao.trim()](params);
                    if (retorno) {
                        if (colCelula.dataset.combo_ativo == "1") {
                            colCelula.innerHTML = colCelula.dataset.innerHTMLantigo;
                            colCelula.value = colCelula.dataset.valueAntigo;
                        }
                        else if (colCelula.dataset.coluna_check == "1") {
                            colCelula.querySelector("input").checked = !colCelula.querySelector("input").checked;
                        }
                        else {
                            colCelula.innerHTML = colCelula.dataset.valueantigo;
                        }
                        return;
                    }
                }

                // Insere 
                queryInsert = g$.trataQueryInsert(grava_tabela, obj);
                queryInsert = g$.trataQuery(queryInsert.trim());

                queryInsert.script.tela_id = g$.tela_id;
                queryInsert.script.elemento_id = "Tabela";

                $http.post(URL + "/jsonQuery/", queryInsert)
                    // $http.post(URL + "/post/" + grava_tabela + "/", obj)
                    .then(function (data) {
                        data = data.data;

                        // Trata Excecao
                        if (g$.exceptionRequisicao("Insert - Tabela", data)) return;

                        var id = data.data.insertId;

                        script = {
                            script: data.query.replace(/"/g, "'"),
                            usuario_id: $rootScope.user.id,
                            banco: $rootScope.user.banco,
                            projeto_id: $rootScope.user.projeto_id,
                            data: new Date().toLocaleDateString().split("/").reverse().join("-"),
                            hora: new Date().toLocaleTimeString(),
                            tela_id: g$.tela_id,
                            elemento_id: elementoTabela.dataset.id
                        };

                        // g$.insertLog(script);

                        Materialize.toast('Salvo com Sucesso!', 4000, 'green darken-1');
                        //depoisDeGravar
                        query = "SELECT * FROM node.elemento_funcao WHERE elemento_id = " + row.parentElement.parentElement.dataset.id +
                            " AND evento = 'depoisDeGravar' AND isnull(depois) order by ordem";
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                            // Trata Excecao
                            if (g$.exceptionRequisicao("DepoisDeGravar - Tabela", data)) return;;


                            data.data.forEach(function (v) {
                                var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                                    params = v.funcao;
                                g$[funcao.trim()](params);
                            });

                            var filtro = (filtro) ? filtro : "",
                                queryConsultaFiltro = "select c.id, f.id as id_filtro, f.filtro from node.consulta c LEFT JOIN node.consulta_filtro f ON c.id = f.consulta_id where f.consulta_id = " + elementoTabela.dataset.consulta_id;
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryConsultaFiltro.trim())).success(function (data) {
                                // Trata Excecao
                                if (g$.exceptionRequisicao("Tela", data)) return;

                                data.data.forEach(function (v) {
                                    if (!v.filtro) return
                                    var params = g$.alterSargentos(v.filtro);
                                    if (filtro == "") filtro += params;
                                    else filtro += " AND " + params;
                                });

                                if (filtro.indexOf("WHERE") > -1) filtro = filtro.substring(0, filtro.indexOf("WHERE"));
                                if (filtro.indexOf("ORDER") > -1) filtro = filtro.substring(0, filtro.indexOf("ORDER"));

                                var alias = g$.filterTabela(row.cells[1].dataset.le_da_tabela_alias, false),
                                    campo = (!$rootScope.user.nao_saas && g$.filterCampo(row.children[1].dataset.le_do_campo) == 'id') ? '_id' : g$.filterCampo(row.children[1].dataset.le_do_campo),
                                    filtro2 = alias + "." + campo + " = " + id,
                                    nomeProc;

                                filtro += (filtro && filtro != "") ? " AND " + filtro2 : filtro2;
                                nomeProc = 'node.le(' + elementoTabela.dataset.consulta_id + ',"' + $rootScope.user.banco + '", "' + filtro + '")';

                                $http.get(URL + "/proc/" + nomeProc).success(function (response) {
                                    if (g$.exceptionRequisicao("ProcLe - Tabela", response)) return;;

                                    var consulta = response.data[0][0].consulta;
                                    $http.post(URL + "/jsonQuery/", g$.trataQuery(consulta.trim())).success(function (data) {
                                        // Trata Excecao
                                        if (g$.exceptionRequisicao("Query - Tabela", data)) return;

                                        if (row.classList.contains("active")) row.classList.remove("active");
                                        g$.refreshRow(elementoTabela, row, data.data);
                                        elementoTabela.querySelector(".border-cell-table").focus();
                                        $scope.addEventosRowTabela(elementoTabela, row);
                                        if (elementoTabela.dataset.tbl_linhanova && elementoTabela.dataset.tbl_linhanova == "1") {
                                            var tableJquery = $("[data-id='" + elementoTabela.dataset.id + "']").DataTable();
                                            var templateLinha = angular.element(elementoTabela.dataset.templateLinha)[0];
                                            var novaLinha = [];
                                            for (var i = 0; i < templateLinha.cells.length; i++) {
                                                novaLinha.push(templateLinha.cells[i].innerHTML);
                                            }
                                            $scope[elementoTabela.dataset.nome + elementoTabela.dataset.id + "s"][$scope[elementoTabela.dataset.nome + elementoTabela.dataset.id + "s"].length] = {};
                                            $http.get("/").success(function () {
                                                var row2 = $("#view [data-id=" + elementoTabela.dataset.id + "] tr")[$("#view [data-id=" + elementoTabela.dataset.id + "] tr").length - 1];
                                                var rowNode = tableJquery.row.add(row2).draw();
                                            });
                                        }
                                    });
                                });

                            });
                            // requeryTabela(row.parentElement.parentElement);
                        });

                    });
            });
        });
        // });
    }

    function inputAlterar(tabela, obj, row, colCelula, elementoTabela) {
        var banco, grava_tabela, queryUpdate,
            query = "select * from elemento_funcao where elemento_id = " + row.parentElement.parentElement.dataset.id,
            queryBanco = "SELECT * FROM consulta WHERE tela_id = " + $scope.getIDMenuItem();

        // $http.get(URL + "/get/" + queryBanco).success(function (data) {
        //     // Trata Excecao
        //     if (g$.exceptionRequisicao("Tabela", data)) return;;

        //     // Abre a Conexao com o banco do Usuario
        //     banco = (!data.data[0].banco) ? $rootScope.user.banco : data.data[0].banco;

        var banco = $rootScope.user.banco, script;

        // Coloca as colunas invisíveis no objeto
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("gravanaTabela - Tabela", data)) return;

            if (data.data.length) {
                for (var i = 0; i < data.data.length; i++) {
                    var params = g$.alterSargentos(data.data[i].funcao);
                    if (params[0].trim() == "gravanaTabela") {
                        var campo = params[1].trim();
                        valor = params[3].trim();
                        obj[campo] = valor;
                    }
                }
            }

            if (tabela.indexOf("node.") == -1) {
                grava_tabela = banco + "." + tabela;
            } else {
                grava_tabela = tabela;
            }

            // Procura se tem algum evento antes de inserir
            query = "SELECT * FROM node.elemento_funcao WHERE elemento_id = " + row.parentElement.parentElement.dataset.id +
                " AND evento = 'antesDeGravar' AND isnull(depois) order by ordem";
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                // Trata Excecao
                if (g$.exceptionRequisicao("AntesDeGravar - Tabela", data)) return;

                for (var i = 0; i < data.data.length; i++) {
                    var funcao = data.data[i].funcao.split("|")[0].split("¦")[0].trim(),
                        params = data.data[i].funcao, retorno;
                    retorno = g$[funcao.trim()](params);
                    if (retorno) {
                        if (colCelula.dataset.combo_ativo == "1") {
                            colCelula.innerHTML = colCelula.dataset.innerHTMLantigo;
                            colCelula.value = colCelula.dataset.valueAntigo;
                        }
                        else if (colCelula.dataset.coluna_check == "1") {
                            colCelula.querySelector("input").checked = !colCelula.querySelector("input").checked;
                        }
                        else {
                            colCelula.innerHTML = colCelula.dataset.valueantigo;
                        }
                        return;
                    }
                }

                // Update
                queryUpdate = g$.trataQueryUpdate(grava_tabela, obj);
                queryUpdate = g$.trataQuery(queryUpdate.trim());

                queryUpdate.script.tela_id = g$.tela_id;
                queryUpdate.script.elemento_id = "Tabela";

                $http.post(URL + "/jsonQuery/", queryUpdate)
                    .then(function (data) {
                        data = data.data;

                        // Trata Excecao
                        if (g$.exceptionRequisicao("Update - Tabela", data)) return;

                        script = {
                            script: data.query.replace(/"/g, "'"),
                            usuario_id: $rootScope.user.id,
                            banco: $rootScope.user.banco,
                            projeto_id: $rootScope.user.projeto_id,
                            data: new Date().toLocaleDateString().split("/").reverse().join("-"),
                            hora: new Date().toLocaleTimeString(),
                            tela_id: g$.tela_id,
                            elemento_id: elementoTabela.dataset.id
                        };

                        // g$.insertLog(script);

                        Materialize.toast('Salvo com Sucesso!', 4000, 'green darken-1');

                        //depoisDeGravar
                        var query = "SELECT * FROM node.elemento_funcao WHERE elemento_id = " + row.parentElement.parentElement.dataset.id +
                            " AND evento = 'depoisDeGravar' and isnull(depois) order by ordem";
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                            // Trata Excecao
                            if (g$.exceptionRequisicao("DepoisDeGravar - Tabela", data)) return;;

                            data.data.forEach(function (v) {
                                var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                                    params = v.funcao;
                                g$[funcao.trim()](params);
                            });

                            var alias = g$.filterTabela(row.cells[1].dataset.le_da_tabela_alias, false),
                                campo = g$.filterCampo(row.children[1].dataset.le_do_campo),
                                filtro = alias + "." + campo + " = " + g$.idDaLinha,
                                nomeProc = 'call node.le(' + elementoTabela.dataset.consulta_id + ',"' + $rootScope.user.banco + '", "' + filtro + '")';

                            $http.post(URL + "/jsonQuery/", g$.trataQuery(nomeProc.trim(), 1)).success(function (data) {
                                if (g$.exceptionRequisicao("ProcLe - Tabela", data)) return;;

                                var consulta = data.data[0][0].consulta;
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(consulta.trim())).success(function (data) {
                                    // Trata Excecao
                                    if (g$.exceptionRequisicao("Query - Tabela", data)) return;;

                                    if (row.classList.contains("active")) row.classList.remove("active");
                                    g$.refreshRow(elementoTabela, row, data.data);
                                    elementoTabela.querySelector(".border-cell-table").focus();
                                });
                            });
                        });

                    });
            });
        });

    }

    // Adiciona os eventos nos elementos de uma linha da tabela
    $scope.addEventosRowTabela = function (elmTabela, row) {
        var queryEventsTabela = "SELECT ef.*, e.menu_id FROM node.elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and e.menu_id = " +
            elmTabela.dataset.menu_id + " AND evento_tabela='1' and isnull(ef.depois) ORDER BY ef.ordem";

        $http.get(URL + "/get/" + queryEventsTabela).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Eventos - Tabela", data)) return;

            data.data.forEach(function (v, i) {
                elementos = row.querySelectorAll("[data-id='" + v.elemento_id + "']");
                var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                    params = v.funcao;

                for (var i = 0; i < elementos.length; i++) {
                    elementos[i].addEventListener(v.evento, g$[funcao.trim()].bind(null, params, false), false);
                }
            });
        });
    }

    g$.refreshRow = function (elm, row, response) {
        var novaLinha = [], cell;
        for (var i = 0; i < row.cells.length; i++) {
            cell = row.cells[i];

            // Remove a classe que tira o padding da celula
            cell.classList.remove("no-padding");

            // Primeira Celula
            if (cell.children[0] && cell.children[0].id == "selecionarLinha") {
                novaLinha.push(cell.children[0].outerHTML);
            }
            // se tiver um filho e for botao
            else if (cell.children[0] && cell.children[0].id == "botao") novaLinha.push(cell.children[0].outerHTML);
            // Se for coluna check
            else if (cell.dataset.coluna_check == "1") {
                novaLinha.push("<input type='checkbox' onclick='checkCLICK();' " + ((response[0]["e_" + cell.dataset.id] == 1) ? "checked" : '') + ">");
            }
            // Se alterar um check, nao check, so coloca o check la
            else if (cell.children[0] && cell.children[0].type == "checkbox") {
                novaLinha.push(cell.children[0].outerHTML);
            }
            // Se for Data 
            else if (cell.dataset.cell_tipo == "date") {
                if (response[0]["e_" + cell.dataset.id] != "" && response[0]["e_" + cell.dataset.id]) {
                    novaLinha.push(g$.formataDataBarra(g$.formataDataCell(response[0]["e_" + cell.dataset.id])));
                }
                else novaLinha.push("");
            }
            // se tiver a uma celula de delete
            else if (cell.id == "deleteRow") {
                novaLinha.push(cell.children[0].outerHTML);
            }
            else if (cell.dataset.combo_ativo == "1") {
                if (response[0]["e_" + cell.dataset.id] == undefined || response[0]["e_" + cell.dataset.id] == null)
                    novaLinha.push("<i class='fa fa-caret-down dropcombotable' onclick='colocaCombo()'> </i>");
                else novaLinha.push(response[0]["e_" + cell.dataset.id] + "<i class='fa fa-caret-down dropcombotable' onclick='colocaCombo()'> </i>");
            }
            // Se for null ou undefined coloca vazio
            else if (response[0]["e_" + cell.dataset.id] == undefined || response[0]["e_" + cell.dataset.id] == null) novaLinha.push("");
            // Se tiver o atributo cor
            else if (response[0]["e_" + cell.dataset.id].indexOf && response[0]["e_" + cell.dataset.id].indexOf("«") > -1) {
                response[0]["e_" + cell.dataset.id] = "<label data-" + response[0]["e_" + cell.dataset.id].split("«")[1].split("=")[0] + "=" +
                    response[0]["e_" + cell.dataset.id].split("«")[1].split("=")[1] + "> " +
                    response[0]["e_" + cell.dataset.id].split("«")[2] + "</label>"
                novaLinha.push(response[0]["e_" + cell.dataset.id]);
            }
            // Senao coloca o valor do objeto
            else {
                novaLinha.push(response[0]["e_" + cell.dataset.id]);
            }
        }
        $(elm).DataTable().row(row).data(novaLinha);
    }

    g$.openModalConfigTable = function (e) {
        var tabela = event.target.parentElement.parentElement.querySelector("#tabela");
        $("#modal-configtable").modal("open");
        g$._initConfigTabela(tabela);
    }

});