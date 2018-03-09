var app = angular.module('myApp', []);

app.controller("inicial", function ($scope, $http, $rootScope, $timeout, $compile) {

    var d = document;
    var w = window;
    if (d.readyState == 'complete') {
        l();
    }
    else {
        if (w.attachEvent) {
            w.attachEvent('onload', l);
        }
        else {
            w.addEventListener('load', l, false);
        }
    }

    function l() {
        var imgAnonimo, queryLogado;
        g$.user = JSON.parse(localStorage.user);
        g$.filtroTabela = [];

        // Log 
        $scope.logs = [];

        g$.exibeQuery = function (tipo, query) {
            var data = new Date();
            data = data.toLocaleTimeString();
            $scope.logs[$scope.logs.length] = { data: data, tipo: tipo, query: query };
        }

        g$.converteQuerySaas = function () {
            $http.post(URL + "/leArquivo/", { arquivo: "DYS_TEMPLATE/trg.sql" }).success(function (data) {
                g$.extraiQuerys(data);
            });
        }



        g$.extraiQuerys = function (text) {
            var json = { texto: text }, querySaas = [], t, tables = [];
            $http.post(URL + "/extraiQuery/", json).success(function (data) {
                if (data.tables[0]) {
                    data.tables[0].forEach(function (table, i) {
                        t = table.substring(table.indexOf('TABLE ') + 6, table.length);
                        t = (t.indexOf("'") == 0) ? t.split(".")[1].split(" ")[0] : t.split(" ")[0];
                        tables.push(t);
                    });
                }

                g$.tables = tables;

                // if (data.begins[0]) {
                //     data.begins[0].forEach(function (begin, i) {
                //         t = ",v_id_projeto)"
                //         t = (t.indexOf("'") == 0) ? t.split(".")[1].split(" ")[0] : t.split(" ")[0];
                //         begins.push(t);
                //     });
                // }

                data.query[0].forEach(function (query, i) {
                    console.log(query);
                    if (query.indexOf(" UNION ") == -1) {
                        qSaas = g$.montaQuery(g$.trataQuery(query, true));
                        qSaas = qSaas.replace(/\½/g, "/");
                        qSaas = qSaas.replace(/\‰/g, "%");
                        qSaas = qSaas.replace(/\❜/g, ",");
                        qSaas = qSaas.replace(/\‿/g, " ");
                        qSaas = qSaas.replace(/\˭/g, "=");
                    } else qSaas = query;
                    querySaas.push({
                        query: query,
                        querySaas: qSaas
                    });
                    console.log(querySaas[i].querySaas);
                    text = text.replace(querySaas[i].query, querySaas[i].querySaas)
                });

                var objSaas = {
                    arquivo: text,
                    caminho: "raiz",
                    nome: "querySaas.txt",
                }
                $http.post(URL + "/geraArquivo/", objSaas);

                // console.log(querySaas);
                // console.log(text);
            });
        }

        g$.exceptionRequisicao = function (tipo, data) {
            if (data.err) {
                // Materialize.toast(data.error, 4000, 'red darken-1');
                g$.exibeQuery(tipo, data.query);
                g$.exibeQuery("ERRO", data.error);
                event.preventDefault();
                event.stopPropagation();
                return true;
            }
            else {
                g$.exibeQuery(tipo, data.query);
                return false;
            }
        }

        // altera o projeto sem fazer o login de novo
        g$.alteraProjeto = function () {
            var query;
            if ($("[data-id='49352'] input")[0].dataset.value && $("[data-id='49352'] input")[0].dataset.value != "") {
                query = "SELECT u.*, UPPER(p.projeto) projeto, COALESCE(p.nao_saas, 0) nao_saas FROM node.usuario u, node.projeto p WHERE u.projeto_id = p.id and u.id=" + $("[data-id='49352'] input")[0].dataset.value;
            }
            else query = "SELECT u.*, UPPER(p.projeto) projeto, COALESCE(p.nao_saas, 0) nao_saas FROM node.usuario u, node.projeto p WHERE u.projeto_id = p.id and u.projeto_id = " + $("[data-id='49346'] input")[0].dataset.value + " and u.customiza = 1 limit 1";
            // procura um usuario daquele projeto que tenha customizador(pra nao tirar o customizador), pra guardar os dados, ex: projeto_id, banco
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {

                g$.exceptionRequisicao("Update Projeto", data);

                if (data.data[0]) {
                    var projeto_id = data.data[0].projeto_id, local;
                    local = JSON.parse(localStorage.user);

                    // altera no localStorage, scope e g$, rootscope (dados em memoria)
                    local.id = localStorage.user.id = $rootScope.user.id = $scope.user.id = g$.user.id = data.data[0].id;
                    local.banco = localStorage.user.banco = $rootScope.user.banco = $scope.user.banco = g$.user.banco = data.data[0].banco;
                    local.projeto = localStorage.user.projeto = $rootScope.user.projeto = $scope.user.projeto = g$.user.projeto = data.data[0].projeto;
                    local.projeto_id = localStorage.user.projeto_id = $rootScope.user.projeto_id = $scope.user.projeto_id = g$.user.projeto_id = data.data[0].projeto_id;
                    local.nao_saas = localStorage.user.nao_saas = $rootScope.user.nao_saas = $scope.user.nao_saas = g$.user.nao_saas = data.data[0].nao_saas;
                    localStorage.user = JSON.stringify(local);

                    g$.closeModalView('Projetos')
                    // altera o tema do sistema 
                    g$.configSystem(projeto_id);
                    // remonta o menu 
                    $.createMenuTelas(projeto_id);
                }
            });
        }

        g$.configUser = function () {
            var id_one;

            // Pergunta se quer alterar se o id_one for diferente
            if (localStorage.app) {
                id_one = JSON.parse(localStorage.app).id_one;
                if (g$.user.id_one != id_one) {
                    alertjs.show({
                        type: 'confirm',
                        title: 'Confirme',
                        text: "Indentificamos que esse aparelho não é o seu titular, deseja considerar esse aparelho como seu titular?",
                        from: 'left', //slide from left		
                        complete: function (val) {
                            if (val) {
                                queryID_one = "UPDATE node.usuario SET id_one = '" + id_one + "' where id = " + g$.user.id;
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryID_one.trim()));
                                g$.user.id_one = id_one;
                                g$.alerta("Alerta!", "Aparelho alterado com sucesso!");
                            }
                        }
                    });
                }
            }

            // Se o IP for diferente do que está la salva o IP
            // $.ajax({
            //     url: "http://jsonip.com/",
            //     dataType: "jsonp",
            //     jsonpCallback:function(){var fnc='cb'+$.now();this.url+=fnc;return fnc;},
            //     jsonp:false,
            //     success: function(data) {
            //         queryLogado = "UPDATE node.usuario SET ip = '" + data.ip + "', logado = 1 where id = " + user.id
            //         $http.post(URL + "/jsonQuery/", g$.trataQuery(queryLogado.trim()))
            //     }
            // }); 

            $rootScope.user = g$.user;
            imgAnonimo = (g$.user.customiza || g$.user.sysCli) ? "../img/anonimo.png" : "img/anonimo.png";
            g$.user.foto = (!g$.user.foto) ? imgAnonimo : g$.user.foto;

            $(".user-image")[0].src = $(".logo-user")[0].src = g$.user.foto;

            if (!g$.user.sysCli) {
                g$.configSystem(g$.user.projeto_id);
            }

            var query = "select perf.id, perf.intervalo, perf.modal FROM " + g$.user.banco + ".cliente_fornecedor c LEFT JOIN " + g$.user.banco + ".perfil perf on perf.id = c.perfil_id WHERE c.node_usuario_id = " + g$.user.id;
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                if (g$.exceptionRequisicao("Query perfil - intervalo", data)) return;
                g$.user.intervalo = data.data[0].intervalo;
                g$.user.modal = data.data[0].modal;
                g$.user.perfil_id = data.data[0].id;
                if (g$.user.intervalo > 0) {
                    g$.openTelaTemp(g$.user.intervalo, g$.user.modal);
                }

                $http.get("/").success(function () {
                    $http.get("/").success(function () {
                        $.createMenuTelas(g$.user.projeto_id);
                    });
                });
            })

        }

        $scope.logout = function () {
            query = "UPDATE node.usuario SET ip = null, logado = 0 where id = " + g$.user.id;
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                delete localStorage.user;
                location.href = "http://" + location.href.split("/")[2];
            });
        }

        g$.configSystem = function (projeto_id) {
            var query = "SELECT * FROM node.projeto WHERE id = " + projeto_id,
                estilo = "", menu_bloco = "";
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                // Trata Excecao
                g$.exceptionRequisicao("Config System", data);

                data = data.data;

                menu_bloco = "#menu-bloco{background: " + ((!data[0].config_system) ? "#222d32" : data[0].barra_fundo) + " !important; " +
                    "color: " + ((!data[0].config_system) ? "#b8c7ce" : data[0].barra_cor) + " !important;}";
                if (data[0].tamanho_fonte_menu && data[0].tamanho_fonte_menu > 14) {
                    if (data[0].tamanho_icone_menu) {
                        estilo = "span#menu-telas {font-size: " + data[0].tamanho_fonte_menu + "px;} " +
                            "i#icone-telas {font-size: " + data[0].tamanho_icone_menu + "px;margin-right: 7px;}";
                    }
                    else estilo = "span#menu-telas {font-size: " + data[0].tamanho_fonte_menu + "px;} ";
                }
                estilo = "<style> " + estilo + menu_bloco + " </style>";
                document.head.appendChild(angular.element(estilo)[0]);

                estilo = "";
                if (data[0].config_system) {
                    estilo = "<style> .skin-blue .main-header .navbar, .skin-blue .main-header li.user-header{background-color: " + data[0].barra_fundo + "!important;}" +
                        ".skin-blue .wrapper, .skin-blue .main-sidebar, .skin-blue .left-side {background-color: " + data[0].menu_fundo + " !important;}" +
                        ".skin-blue .sidebar-menu > li:hover > a, .skin-blue .sidebar-menu > li.active > a{border-left-color: " + data[0].barra_fundo_logo + " !important;}" +
                        ".skin-blue .sidebar-menu > li:hover > a, .skin-blue .sidebar-menu > li.active > a{background-color: " + data[0].menu_fundo_hover + " !important;}" +
                        ".skin-blue .sidebar-menu > li:hover > a, .skin-blue .sidebar-menu > li.active > a{color: " + data[0].menu_cor_hover + " !important;}" +
                        ".skin-blue .sidebar-menu > li:hover > a > .fa, .skin-blue .sidebar-menu > li.active > a > .fa{color: " + data[0].menu_cor_hover + " !important;}" +
                        ".skin-blue .sidebar a, .sidebar-menu > li > a > .fa, .sidebar-menu .treeview-menu > li > a > .fa {color: " + data[0].menu_cor + " !important;}" +
                        ".skin-blue .main-header .logo:hover{background-color: " + data[0].barra_fundo_logo + "!important;}" +
                        ".main-header .fa, .user-menu span, .skin-blue .main-header li.user-header p{color: " + data[0].barra_cor + " !important;}" +
                        ".skin-blue .main-header .navbar .sidebar-toggle{color: " + data[0].barra_cor + "!important;}" +
                        ".skin-blue .sidebar-menu > li > .treeview-menu{background-color: " + data[0].menu_filho_fundo + " !important;}" +
                        ".skin-blue .treeview-menu > li > a, .skin-blue .treeview-menu > li > a > .fa{color: " + data[0].menu_filho_cor + " !important;}" +
                        ".skin-blue .treeview-menu > li > a:hover{font-weight: 600;}" +
                        "::-webkit-scrollbar-thumb {background: " + data[0].cor_scroll + " !important;}" +
                        "#closeIframe {background: " + data[0].barra_fundo + " !important;}" +
                        "#closeIframe .fa {color: " + data[0].barra_cor + " !important;}" +
                        ".pop-4 .card-header{background: " + data[0].barra_fundo_logo + " !important;}" +
                        ".pop-4 .card-title {color: " + data[0].barra_cor + " !important;}" +
                        ".pop-4 .card-icone .fa{color: " + data[0].barra_cor + " !important;}" +
                        ".skin-blue .main-header .navbar .sidebar-toggle:hover{background-color: " + data[0].barra_fundo + "!important;}" +
                        ".skin-blue .main-header .logo{background-color: " + data[0].barra_fundo_logo + "!important;} </style>";
                    document.head.appendChild(angular.element(estilo)[0]);
                }

            });
        }

        // Passa como o nome da tabela e recebe o nome ou o alias
        g$.filterTabela = function (nome, isName) { return nome; }

        // Passa como o id da consulta e recebe o nome
        g$.filterCampo = function (nome) { return nome; }

        // Passa como o id da consulta e recebe o nome
        g$.filterConsulta = function (nome) { return nome; }

        // getValueOptionString
        g$.getValueOption = function (elm, valor) {
            return elm.dataset.value;
        }

        // Pega da lista pelo valor no campo
        g$.vfyDescOption = function (elm, valor) {
            var value = (valor) ? valor : elm.value;
            if (!elm.parentElement.querySelector(".container_combo [data-inner='" + value + "'] ")) {
                event.stopPropagation();
                event.preventDefault();
                return;
            }
            return elm.parentElement.querySelector(".container_combo [data-inner='" + value + "'] ").dataset.inner;
        }

        g$.alerta = function (titulo, texto) {
            $("#myCustomDialog .dialogWrapper")[0].innerHTML = texto;
            alertjs.show({
                title: titulo,
                text: '#myCustomDialog', //must be an id
                from: 'top'
            });
        }

        g$.selectElementosCliente = function (id) {
            return "SELECT IF(ISNULL(cli.id),e.id, cli.id) AS id,IF(ISNULL(cli.id),e.nome, cli.nome) AS nome,IF(ISNULL(cli.id),e.tag, cli.tag) AS tag," +
                "IF(ISNULL(cli.id),e.tipo, cli.tipo) AS tipo,IF(ISNULL(cli.id),e.texto, cli.texto) AS texto," +
                "IF(ISNULL(cli.id),e.placeholder, cli.placeholder) AS placeholder,IF(ISNULL(cli.id),e.tela, cli.tela) AS tela," +
                "IF(ISNULL(cli.id),e.menu_id, cli.menu_id) AS menu_id,IF(ISNULL(cli.id),e.pai, cli.pai) AS pai," +
                "IF(ISNULL(cli.id),e.modal, cli.modal) AS modal,IF(ISNULL(cli.id),e.descricao, cli.descricao) AS descricao," +
                "IF(ISNULL(cli.id),e.ordem, cli.ordem) AS ordem, IF(ISNULL(cli.id),e.download,cli.download) AS download," +
                "IF(ISNULL(cli.id),e.abrir_no_sistema,cli.abrir_no_sistema) AS abrir_no_sistema, tl.tabela le_da_tabela, tl.alias le_da_tabela_alias,cl.campo le_do_campo, e.le_do_campo le_do_campo_id, " +
                "IF(ISNULL(cli.id),e.tbl_selecionarlinha, cli.tbl_selecionarlinha) AS tbl_selecionarlinha, IF(ISNULL(cli.id),e.tbl_linhanova, cli.tbl_linhanova) AS tbl_linhanova, " +
                "IF(ISNULL(cli.id),e.tbl_pageLength, cli.tbl_pageLength) AS tbl_pageLength, " +
                "lt.tabela link_tabela,coalesce(lc.campo,e.link_campo) link_campo,tg.tabela grava_na_tabela," +
                "e.consulta_id,cg.campo grava_no_campo," + "IF(ISNULL(cli.id),e.limite, cli.limite) AS limite, " +
                "IF(ISNULL(cli.id),e.celular, cli.celular) AS celular,IF(ISNULL(cli.id),e.tablet, cli.tablet) AS tablet," +
                "IF(ISNULL(cli.id),e.desktop, cli.desktop) AS desktop,IF(ISNULL(cli.id),e.largura, cli.largura) AS largura," +
                "IF(ISNULL(cli.id),e.tamanho, cli.tamanho) AS tamanho," +
                "coalesce(cc.campo,e.combo_campo) combo_campo,tc.tabela combo_tabela," +
                "IF(ISNULL(cli.id),e.combo_grava_value, cli.combo_grava_value) AS combo_grava_value," +
                "IF(ISNULL(cli.id),e.formato, cli.formato) AS formato,IF(ISNULL(cli.id),e.display, cli.display) AS display," +
                "IF(ISNULL(cli.id),e.size, cli.size) AS size,IF(ISNULL(cli.id),e.familia, cli.familia) AS familia," +
                "IF(ISNULL(cli.id),e.evento_tabela, cli.evento_tabela) AS evento_tabela, IF(ISNULL(cli.evento_check),e.evento_check, cli.evento_check) AS evento_check," +
                "IF(ISNULL(cli.id),e.evento_bloco, cli.evento_bloco) AS evento_bloco," +
                "IF(ISNULL(cli.id),e.padding, cli.padding) AS padding,IF(ISNULL(cli.id),e.margin, cli.margin) AS margin," +
                "IF(ISNULL(cli.id),e.fundo, cli.fundo) AS fundo,IF(ISNULL(cli.id),e.cor, cli.cor) AS cor," +
                "IF(ISNULL(cli.id),e.combo_grava_campo, cli.combo_grava_campo) AS combo_grava_campo," +
                "IF(ISNULL(cli.id),e.combo_atualizar, cli.combo_atualizar) AS combo_atualizar," +
                "IF(ISNULL(cli.id),e.combo_id_elemento, cli.combo_id_elemento) AS combo_id_elemento," +
                "IF(ISNULL(cli.id),e.combo_campo_filho, cli.combo_campo_filho) AS combo_campo_filho," +
                "IF(ISNULL(cli.id),e.borda_size, cli.borda_size) AS borda_size,IF(ISNULL(cli.id),e.borda_tipo, cli.borda_tipo) AS borda_tipo," +
                "IF(ISNULL(cli.id),e.borda_cor, cli.borda_cor) AS borda_cor,IF(ISNULL(cli.id),e.borda_arredondada, cli.borda_arredondada) AS borda_arredondada," +
                "IF(ISNULL(cli.id),e.obrigatorio, cli.obrigatorio) AS obrigatorio,IF(ISNULL(cli.id),e.combo_ativo, cli.combo_ativo) AS combo_ativo," +
                "IF(ISNULL(cli.id),e.input_ativo, cli.input_ativo) AS input_ativo,IF(ISNULL(cli.id),e.row_select, cli.row_select) AS row_select," +
                "IF(ISNULL(cli.id),e.row_delete, cli.row_delete) AS row_delete,IF(ISNULL(cli.id),e.cell_tipo, cli.cell_tipo) AS cell_tipo," +
                "IF(ISNULL(cli.id),e.coluna_check, cli.coluna_check) AS coluna_check,IF(ISNULL(cli.id),e.alinhamento, cli.alinhamento) AS alinhamento," +
                "IF(ISNULL(cli.id),e.intervalo, cli.intervalo) AS intervalo,IF(ISNULL(cli.id),e.borderTop, cli.borderTop) AS borderTop," +
                "IF(ISNULL(cli.id),e.borderBottom, cli.borderBottom) AS borderBottom,IF(ISNULL(cli.id),e.borderLeft, cli.borderLeft) AS borderLeft," +
                "IF(ISNULL(cli.id),e.borderRight, cli.borderRight) AS borderRight,IF(ISNULL(cli.id),e.bloqueado, cli.bloqueado) AS bloqueado," +
                "IF(ISNULL(cli.id),e.classe, cli.classe) AS classe,IF(ISNULL(cli.id),e.flutuar,cli.flutuar) AS flutuar," +
                "IF(ISNULL(cli.id),e.combo_filtro, cli.combo_filtro) AS combo_filtro,IF(ISNULL(cli.id),e.tabela_paginate, cli.tabela_paginate) AS tabela_paginate," +
                "IF(ISNULL(cli.id),e.tabela_pesquisar, cli.tabela_pesquisar) AS tabela_pesquisar,IF(ISNULL(cli.id),e.tabela_info, cli.tabela_info) AS tabela_info," +
                "IF(ISNULL(cli.id),e.tabela_multiselect, cli.tabela_multiselect) AS tabela_multiselect," +
                "IF(ISNULL(cli.id),e.tbl_resultados_por_pagina, cli.tbl_resultados_por_pagina) AS tbl_resultados_por_pagina," +
                "IF(ISNULL(cli.id),e.tabela_botao_filtro, cli.tabela_botao_filtro) AS tabela_botao_filtro," +
                "IF(ISNULL(cli.id),e.tabela_botao_imprimir, cli.tabela_botao_imprimir) AS tabela_botao_imprimir," +
                "IF(ISNULL(cli.id),e.tabela_botao_pdf, cli.tabela_botao_pdf) AS tabela_botao_pdf," +
                "IF(ISNULL(cli.id),e.tabela_botao_excel, cli.tabela_botao_excel) AS tabela_botao_excel," +
                "IF(ISNULL(cli.id),e.tabela_botao_copiar, cli.tabela_botao_copiar) AS tabela_botao_copiar," +
                "IF(ISNULL(cli.id),e.max_length, cli.max_length) AS max_length," +
                "e.tbl_treeview, e.tbl_modal,e.mask," +
                "IF(ISNULL(cli.id),e.combo_query, cli.combo_query) AS combo_query,IF(ISNULL(cli.id),e.tbl_delete, cli.tbl_delete) AS tbl_delete " +
                "FROM node.elemento e " +
                "LEFT JOIN " + JSON.parse(localStorage.user).banco + ".elemento cli ON cli.id = e.id " +
                "LEFT JOIN node.tabela tl ON e.le_da_tabela = tl.id " +
                "LEFT JOIN node.campo cl ON e.le_do_campo = cl.id " +
                "LEFT JOIN node.tabela tg ON e.grava_na_tabela = tg.id " +
                "LEFT JOIN node.campo cg ON e.grava_no_campo = cg.id " +
                "LEFT JOIN node.tabela tc ON e.combo_tabela = tc.id " +
                "LEFT JOIN node.campo cc ON e.combo_campo = cc.id " +
                "LEFT JOIN node.consulta c ON e.consulta_id = c.id " +
                "LEFT JOIN node.tabela lt ON e.link_tabela = lt.id " +
                "LEFT JOIN node.campo lc ON e.link_campo = lc.id " +
                "WHERE e.menu_id = '" + id + "' ORDER BY ordem";
        }

        g$.selectElementoCliente = function (id) {
            return "SELECT IF(ISNULL(cli.id),e.id, cli.id) AS id,IF(ISNULL(cli.id),e.nome, cli.nome) AS nome,IF(ISNULL(cli.id),e.tag, cli.tag) AS tag," +
                "IF(ISNULL(cli.id),e.tipo, cli.tipo) AS tipo,IF(ISNULL(cli.id),e.texto, cli.texto) AS texto," +
                "IF(ISNULL(cli.id),e.placeholder, cli.placeholder) AS placeholder,IF(ISNULL(cli.id),e.tela, cli.tela) AS tela," +
                "IF(ISNULL(cli.id),e.menu_id, cli.menu_id) AS menu_id,IF(ISNULL(cli.id),e.pai, cli.pai) AS pai," +
                "IF(ISNULL(cli.id),e.ordem, cli.ordem) AS ordem, IF(ISNULL(cli.id),e.download,cli.download) AS download," +
                "IF(ISNULL(cli.id),e.abrir_no_sistema,cli.abrir_no_sistema) AS abrir_no_sistema, tl.tabela le_da_tabela, tl.alias le_da_tabela_alias, cl.campo le_do_campo, e.le_do_campo le_do_campo_id," +
                "IF(ISNULL(cli.id),e.tbl_selecionarlinha, cli.tbl_selecionarlinha) AS tbl_selecionarlinha, IF(ISNULL(cli.id),e.tbl_linhanova, cli.tbl_linhanova) AS tbl_linhanova, " +
                "lt.tabela link_tabela,coalesce(lc.campo,e.link_campo) link_campo,tg.tabela grava_na_tabela," +
                "e.consulta_id,cg.campo grava_no_campo," + "IF(ISNULL(cli.id),e.limite, cli.limite) AS limite, " +
                "IF(ISNULL(cli.id),e.celular, cli.celular) AS celular,IF(ISNULL(cli.id),e.tablet, cli.tablet) AS tablet," +
                "IF(ISNULL(cli.id),e.desktop, cli.desktop) AS desktop,IF(ISNULL(cli.id),e.largura, cli.largura) AS largura," +
                "IF(ISNULL(cli.id),e.tamanho, cli.tamanho) AS tamanho," +
                "IF(ISNULL(cli.id),e.modal, cli.modal) AS modal," +
                "IF(ISNULL(cli.id),e.tbl_pageLength, cli.tbl_pageLength) AS tbl_pageLength," +
                "IF(ISNULL(cli.id),e.descricao, cli.descricao) AS descricao," +
                "IF(ISNULL(cli.id),e.evento_tabela, cli.evento_tabela) AS evento_tabela, IF(ISNULL(cli.evento_check),e.evento_check, cli.evento_check) AS evento_check," +
                "IF(ISNULL(cli.id),e.evento_bloco, cli.evento_bloco) AS evento_bloco," +
                "coalesce(cc.campo,e.combo_campo) combo_campo,tc.tabela combo_tabela," +
                "IF(ISNULL(cli.id),e.combo_grava_value, cli.combo_grava_value) AS combo_grava_value," +
                "IF(ISNULL(cli.id),e.formato, cli.formato) AS formato,IF(ISNULL(cli.id),e.display, cli.display) AS display," +
                "IF(ISNULL(cli.id),e.size, cli.size) AS size,IF(ISNULL(cli.id),e.familia, cli.familia) AS familia," +
                "IF(ISNULL(cli.id),e.padding, cli.padding) AS padding,IF(ISNULL(cli.id),e.margin, cli.margin) AS margin," +
                "IF(ISNULL(cli.id),e.fundo, cli.fundo) AS fundo,IF(ISNULL(cli.id),e.cor, cli.cor) AS cor," +
                "IF(ISNULL(cli.id),e.combo_grava_campo, cli.combo_grava_campo) AS combo_grava_campo," +
                "IF(ISNULL(cli.id),e.combo_atualizar, cli.combo_atualizar) AS combo_atualizar," +
                "IF(ISNULL(cli.id),e.combo_id_elemento, cli.combo_id_elemento) AS combo_id_elemento," +
                "IF(ISNULL(cli.id),e.combo_campo_filho, cli.combo_campo_filho) AS combo_campo_filho," +
                "IF(ISNULL(cli.id),e.max_length, cli.max_length) AS max_length," +
                "IF(ISNULL(cli.id),e.borda_size, cli.borda_size) AS borda_size,IF(ISNULL(cli.id),e.borda_tipo, cli.borda_tipo) AS borda_tipo," +
                "IF(ISNULL(cli.id),e.borda_cor, cli.borda_cor) AS borda_cor,IF(ISNULL(cli.id),e.borda_arredondada, cli.borda_arredondada) AS borda_arredondada," +
                "IF(ISNULL(cli.id),e.obrigatorio, cli.obrigatorio) AS obrigatorio,IF(ISNULL(cli.id),e.combo_ativo, cli.combo_ativo) AS combo_ativo," +
                "IF(ISNULL(cli.id),e.input_ativo, cli.input_ativo) AS input_ativo,IF(ISNULL(cli.id),e.row_select, cli.row_select) AS row_select," +
                "IF(ISNULL(cli.id),e.row_delete, cli.row_delete) AS row_delete,IF(ISNULL(cli.id),e.cell_tipo, cli.cell_tipo) AS cell_tipo," +
                "IF(ISNULL(cli.id),e.coluna_check, cli.coluna_check) AS coluna_check,IF(ISNULL(cli.id),e.alinhamento, cli.alinhamento) AS alinhamento," +
                "IF(ISNULL(cli.id),e.intervalo, cli.intervalo) AS intervalo,IF(ISNULL(cli.id),e.borderTop, cli.borderTop) AS borderTop," +
                "IF(ISNULL(cli.id),e.borderBottom, cli.borderBottom) AS borderBottom,IF(ISNULL(cli.id),e.borderLeft, cli.borderLeft) AS borderLeft," +
                "IF(ISNULL(cli.id),e.borderRight, cli.borderRight) AS borderRight,IF(ISNULL(cli.id),e.bloqueado, cli.bloqueado) AS bloqueado," +
                "IF(ISNULL(cli.id),e.classe, cli.classe) AS classe,IF(ISNULL(cli.id),e.flutuar,cli.flutuar) AS flutuar," +
                "IF(ISNULL(cli.id),e.combo_filtro, cli.combo_filtro) AS combo_filtro,IF(ISNULL(cli.id),e.tabela_paginate, cli.tabela_paginate) AS tabela_paginate," +
                "IF(ISNULL(cli.id),e.tabela_pesquisar, cli.tabela_pesquisar) AS tabela_pesquisar,IF(ISNULL(cli.id),e.tabela_info, cli.tabela_info) AS tabela_info," +
                "IF(ISNULL(cli.id),e.tabela_multiselect, cli.tabela_multiselect) AS tabela_multiselect," +
                "IF(ISNULL(cli.id),e.tbl_resultados_por_pagina, cli.tbl_resultados_por_pagina) AS tbl_resultados_por_pagina," +
                "IF(ISNULL(cli.id),e.tabela_botao_filtro, cli.tabela_botao_filtro) AS tabela_botao_filtro," +
                "IF(ISNULL(cli.id),e.tabela_botao_imprimir, cli.tabela_botao_imprimir) AS tabela_botao_imprimir," +
                "IF(ISNULL(cli.id),e.tabela_botao_pdf, cli.tabela_botao_pdf) AS tabela_botao_pdf," +
                "IF(ISNULL(cli.id),e.tabela_botao_excel, cli.tabela_botao_excel) AS tabela_botao_excel," +
                "IF(ISNULL(cli.id),e.tabela_botao_copiar, cli.tabela_botao_copiar) AS tabela_botao_copiar," + "e.tbl_treeview,e.tbl_modal,e.mask, " +
                "IF(ISNULL(cli.id),e.combo_query, cli.combo_query) AS combo_query,IF(ISNULL(cli.id),e.tbl_delete, cli.tbl_delete) AS tbl_delete " +
                "FROM node.elemento e " +
                "LEFT JOIN " + JSON.parse(localStorage.user).banco + ".elemento cli ON cli.id = e.id " +
                "LEFT JOIN node.tabela tl ON e.le_da_tabela = tl.id " +
                "LEFT JOIN node.campo cl ON e.le_do_campo = cl.id " +
                "LEFT JOIN node.tabela tg ON e.grava_na_tabela = tg.id " +
                "LEFT JOIN node.campo cg ON e.grava_no_campo = cg.id " +
                "LEFT JOIN node.tabela tc ON e.combo_tabela = tc.id " +
                "LEFT JOIN node.campo cc ON e.combo_campo = cc.id " +
                "LEFT JOIN node.consulta c ON e.consulta_id = c.id " +
                "LEFT JOIN node.tabela lt ON e.link_tabela = lt.id " +
                "LEFT JOIN node.campo lc ON e.link_campo = lc.id " +
                "WHERE e.id = '" + id + "' ORDER BY ordem";
        }

        g$.selectElementosNode = function (id) {
            return "SELECT e.id,e.nome,e.evento_tabela,e.evento_bloco,e.evento_check,e.tag,e.tipo,e.texto,e.placeholder,e.tela,e.menu_id,e.pai,e.ordem, e.download, e.abrir_no_sistema, " +
                "tl.tabela le_da_tabela, tl.alias le_da_tabela_alias,cl.campo le_do_campo, e.le_do_campo le_do_campo_id,lt.tabela link_tabela,coalesce(lc.campo,e.link_campo) link_campo,tg.tabela grava_na_tabela, " +
                "e.tbl_selecionarlinha, e.tbl_linhanova, e.max_length, e.tbl_pageLength, " +
                "e.consulta_id,cg.campo grava_no_campo,e.celular,e.tablet,e.desktop,e.largura,e.tamanho,coalesce(cc.campo,e.combo_campo) combo_campo, " +
                "tc.tabela combo_tabela,e.combo_grava_value,e.limite,e.formato,e.display,e.size,e.familia,e.padding,e.margin,e.fundo,e.cor,e.combo_grava_campo, " +
                "e.combo_atualizar,e.combo_id_elemento,e.combo_campo_filho,e.borda_size,e.borda_tipo,e.borda_cor,e.borda_arredondada,e.obrigatorio,e.combo_ativo, " +
                "e.input_ativo,e.row_select,e.row_delete,e.cell_tipo,e.coluna_check,e.alinhamento,e.intervalo,e.borderTop,e.borderBottom,e.borderLeft,e.borderRight, " +
                "e.bloqueado,e.classe,e.flutuar,e.combo_filtro,e.tabela_paginate,e.tabela_pesquisar,e.tabela_info,e.tabela_multiselect,e.tbl_resultados_por_pagina,e.tabela_botao_filtro, e.tbl_treeview, e.tbl_modal,e.mask," +
                "e.descricao,e.modal,e.tabela_botao_imprimir,e.tabela_botao_pdf,e.tabela_botao_excel,e.tabela_botao_copiar,e.combo_query, e.tbl_delete FROM node.elemento e " +
                "LEFT JOIN node.tabela tl ON e.le_da_tabela = tl.id LEFT JOIN node.campo cl ON e.le_do_campo = cl.id LEFT JOIN node.tabela tg ON e.grava_na_tabela " +
                "= tg.id LEFT JOIN node.campo cg ON e.grava_no_campo = cg.id LEFT JOIN node.tabela tc ON e.combo_tabela = tc.id LEFT JOIN node.campo cc ON " +
                "e.combo_campo = cc.id LEFT JOIN node.consulta c ON e.consulta_id = c.id " +
                "LEFT JOIN node.tabela lt ON e.link_tabela = lt.id LEFT JOIN node.campo lc ON e.link_campo = lc.id " +
                "WHERE e.menu_id = '" + id + "' ORDER BY ordem"
        }

        g$.selectElementoNode = function (id) {
            return "SELECT e.id,e.nome,e.evento_tabela,e.evento_bloco,e.evento_check,e.tag,e.tipo,e.texto,e.placeholder,e.tela,e.menu_id,e.pai,e.ordem, e.download, e.abrir_no_sistema, " +
                "tl.tabela le_da_tabela, tl.alias le_da_tabela_alias,cl.campo le_do_campo, e.le_do_campo le_do_campo_id,lt.tabela link_tabela,coalesce(lc.campo,e.link_campo) link_campo,tg.tabela grava_na_tabela, " +
                "e.tbl_selecionarlinha, e.tbl_linhanova, e.max_length, e.tbl_pageLength" +
                "e.consulta_id,cg.campo grava_no_campo,e.celular,e.tablet,e.desktop,e.largura,e.tamanho,coalesce(cc.campo,e.combo_campo) combo_campo, " +
                "tc.tabela combo_tabela,e.combo_grava_value,e.limite,e.formato,e.display,e.size,e.familia,e.padding,e.margin,e.fundo,e.cor,e.combo_grava_campo, " +
                "e.combo_atualizar,e.combo_id_elemento,e.combo_campo_filho,e.borda_size,e.borda_tipo,e.borda_cor,e.borda_arredondada,e.obrigatorio,e.combo_ativo, " +
                "e.input_ativo,e.row_select,e.row_delete,e.cell_tipo,e.coluna_check,e.alinhamento,e.intervalo,e.borderTop,e.borderBottom,e.borderLeft,e.borderRight, " +
                "e.bloqueado,e.classe,e.descricao,e.modal,e.flutuar,e.combo_filtro,e.tabela_paginate,e.tabela_pesquisar,e.tabela_info,e.tabela_multiselect,e.tbl_resultados_por_pagina,e.tabela_botao_filtro, " +
                "e.tabela_botao_imprimir,e.tabela_botao_pdf,e.tabela_botao_excel,e.tabela_botao_copiar,e.combo_query, e.tbl_treeview,e.tbl_modal,e.mask, e.tbl_delete FROM node.elemento e " +
                "LEFT JOIN node.tabela tl ON e.le_da_tabela = tl.id LEFT JOIN node.campo cl ON e.le_do_campo = cl.id LEFT JOIN node.tabela tg ON e.grava_na_tabela " +
                "= tg.id LEFT JOIN node.campo cg ON e.grava_no_campo = cg.id LEFT JOIN node.tabela tc ON e.combo_tabela = tc.id LEFT JOIN node.campo cc ON " +
                "e.combo_campo = cc.id LEFT JOIN node.consulta c ON e.consulta_id = c.id " +
                "LEFT JOIN node.tabela lt ON e.link_tabela = lt.id LEFT JOIN node.campo lc ON e.link_campo = lc.id " +
                "WHERE e.id = '" + id + "' ORDER BY ordem"
        }

        g$.queryMontaTela = function (id) {
            return "SELECT IF(ISNULL(cli.id),e.id, cli.id) AS id,IF(ISNULL(cli.id),e.nome, cli.nome) AS nome,IF(ISNULL(cli.id),e.tag, cli.tag) AS tag," +
                "IF(ISNULL(cli.id),e.tipo, cli.tipo) AS tipo,IF(ISNULL(cli.id),e.texto, cli.texto) AS texto," +
                "IF(ISNULL(cli.id),e.placeholder, cli.placeholder) AS placeholder,IF(ISNULL(cli.id),e.tela, cli.tela) AS tela," +
                "IF(ISNULL(cli.id),e.menu_id, cli.menu_id) AS menu_id,IF(ISNULL(cli.id),e.pai, cli.pai) AS pai," +
                "IF(ISNULL(cli.id),e.ordem, cli.ordem) AS ordem, IF(ISNULL(cli.id),e.download,cli.download) AS download," +
                "IF(ISNULL(cli.id),e.abrir_no_sistema,cli.abrir_no_sistema) AS abrir_no_sistema, tl.tabela le_da_tabela, tl.alias le_da_tabela_alias,cl.campo le_do_campo, e.le_do_campo le_do_campo_id," +
                "IF(ISNULL(cli.id),e.tbl_selecionarlinha, cli.tbl_selecionarlinha) AS tbl_selecionarlinha, IF(ISNULL(cli.id),e.tbl_linhanova, cli.tbl_linhanova) AS tbl_linhanova, " +
                "lt.tabela link_tabela,coalesce(lc.campo,e.link_campo) link_campo,tg.tabela grava_na_tabela," +
                "e.consulta_id,cg.campo grava_no_campo," + "IF(ISNULL(cli.id),e.limite, cli.limite) AS limite, " +
                "IF(ISNULL(cli.id),e.celular, cli.celular) AS celular,IF(ISNULL(cli.id),e.tablet, cli.tablet) AS tablet," +
                "IF(ISNULL(cli.id),e.desktop, cli.desktop) AS desktop,IF(ISNULL(cli.id),e.largura, cli.largura) AS largura," +
                "IF(ISNULL(cli.id),e.tamanho, cli.tamanho) AS tamanho," +
                "IF(ISNULL(cli.id),e.modal, cli.modal) AS modal," +
                "IF(ISNULL(cli.id),e.tbl_pageLength, cli.tbl_pageLength) AS tbl_pageLength," +
                "IF(ISNULL(cli.id),e.descricao, cli.descricao) AS descricao," +
                "IF(ISNULL(cli.id),e.evento_tabela, cli.evento_tabela) AS evento_tabela, IF(ISNULL(cli.evento_check),e.evento_check, cli.evento_check) AS evento_check," +
                "IF(ISNULL(cli.id),e.evento_bloco, cli.evento_bloco) AS evento_bloco," +
                "coalesce(cc.campo,e.combo_campo) combo_campo,tc.tabela combo_tabela," +
                "IF(ISNULL(cli.id),e.combo_grava_value, cli.combo_grava_value) AS combo_grava_value," +
                "IF(ISNULL(cli.id),e.formato, cli.formato) AS formato,IF(ISNULL(cli.id),e.display, cli.display) AS display," +
                "IF(ISNULL(cli.id),e.size, cli.size) AS size,IF(ISNULL(cli.id),e.familia, cli.familia) AS familia," +
                "IF(ISNULL(cli.id),e.padding, cli.padding) AS padding,IF(ISNULL(cli.id),e.margin, cli.margin) AS margin," +
                "IF(ISNULL(cli.id),e.fundo, cli.fundo) AS fundo,IF(ISNULL(cli.id),e.cor, cli.cor) AS cor," +
                "IF(ISNULL(cli.id),e.combo_grava_campo, cli.combo_grava_campo) AS combo_grava_campo," +
                "IF(ISNULL(cli.id),e.combo_atualizar, cli.combo_atualizar) AS combo_atualizar," +
                "IF(ISNULL(cli.id),e.combo_id_elemento, cli.combo_id_elemento) AS combo_id_elemento," +
                "IF(ISNULL(cli.id),e.combo_campo_filho, cli.combo_campo_filho) AS combo_campo_filho," +
                "IF(ISNULL(cli.id),e.max_length, cli.max_length) AS max_length," +
                "IF(ISNULL(cli.id),e.borda_size, cli.borda_size) AS borda_size,IF(ISNULL(cli.id),e.borda_tipo, cli.borda_tipo) AS borda_tipo," +
                "IF(ISNULL(cli.id),e.borda_cor, cli.borda_cor) AS borda_cor,IF(ISNULL(cli.id),e.borda_arredondada, cli.borda_arredondada) AS borda_arredondada," +
                "IF(ISNULL(cli.id),e.obrigatorio, cli.obrigatorio) AS obrigatorio,IF(ISNULL(cli.id),e.combo_ativo, cli.combo_ativo) AS combo_ativo," +
                "IF(ISNULL(cli.id),e.input_ativo, cli.input_ativo) AS input_ativo,IF(ISNULL(cli.id),e.row_select, cli.row_select) AS row_select," +
                "IF(ISNULL(cli.id),e.row_delete, cli.row_delete) AS row_delete,IF(ISNULL(cli.id),e.cell_tipo, cli.cell_tipo) AS cell_tipo," +
                "IF(ISNULL(cli.id),e.coluna_check, cli.coluna_check) AS coluna_check,IF(ISNULL(cli.id),e.alinhamento, cli.alinhamento) AS alinhamento," +
                "IF(ISNULL(cli.id),e.intervalo, cli.intervalo) AS intervalo,IF(ISNULL(cli.id),e.borderTop, cli.borderTop) AS borderTop," +
                "IF(ISNULL(cli.id),e.borderBottom, cli.borderBottom) AS borderBottom,IF(ISNULL(cli.id),e.borderLeft, cli.borderLeft) AS borderLeft," +
                "IF(ISNULL(cli.id),e.borderRight, cli.borderRight) AS borderRight,IF(ISNULL(cli.id),e.bloqueado, cli.bloqueado) AS bloqueado," +
                "IF(ISNULL(cli.id),e.classe, cli.classe) AS classe,IF(ISNULL(cli.id),e.flutuar,cli.flutuar) AS flutuar," +
                "IF(ISNULL(cli.id),e.combo_filtro, cli.combo_filtro) AS combo_filtro,IF(ISNULL(cli.id),e.tabela_paginate, cli.tabela_paginate) AS tabela_paginate," +
                "IF(ISNULL(cli.id),e.tabela_pesquisar, cli.tabela_pesquisar) AS tabela_pesquisar,IF(ISNULL(cli.id),e.tabela_info, cli.tabela_info) AS tabela_info," +
                "IF(ISNULL(cli.id),e.tabela_multiselect, cli.tabela_multiselect) AS tabela_multiselect," +
                "IF(ISNULL(cli.id),e.tbl_resultados_por_pagina, cli.tbl_resultados_por_pagina) AS tbl_resultados_por_pagina," +
                "IF(ISNULL(cli.id),e.tabela_botao_filtro, cli.tabela_botao_filtro) AS tabela_botao_filtro," +
                "IF(ISNULL(cli.id),e.tabela_botao_imprimir, cli.tabela_botao_imprimir) AS tabela_botao_imprimir," +
                "IF(ISNULL(cli.id),e.tabela_botao_pdf, cli.tabela_botao_pdf) AS tabela_botao_pdf," +
                "IF(ISNULL(cli.id),e.tabela_botao_excel, cli.tabela_botao_excel) AS tabela_botao_excel," +
                "IF(ISNULL(cli.id),e.tabela_botao_copiar, cli.tabela_botao_copiar) AS tabela_botao_copiar," + "e.tbl_treeview,e.tbl_modal,e.mask, " +
                "IF(ISNULL(cli.id),e.combo_query, cli.combo_query) AS combo_query,IF(ISNULL(cli.id),e.tbl_delete, cli.tbl_delete) AS tbl_delete " +
                "FROM node.elemento e " +
                "LEFT JOIN " + JSON.parse(localStorage.user).banco + ".elemento cli ON cli.id = e.id " +
                "LEFT JOIN node.tabela tl ON e.le_da_tabela = tl.id " +
                "LEFT JOIN node.campo cl ON e.le_do_campo = cl.id " +
                "LEFT JOIN node.tabela tg ON e.grava_na_tabela = tg.id " +
                "LEFT JOIN node.campo cg ON e.grava_no_campo = cg.id " +
                "LEFT JOIN node.tabela tc ON e.combo_tabela = tc.id " +
                "LEFT JOIN node.campo cc ON e.combo_campo = cc.id " +
                // "LEFT JOIN node.consulta c ON e.consulta_id = c.id " +
                "LEFT JOIN node.tabela lt ON e.link_tabela = lt.id " +
                "LEFT JOIN node.campo lc ON e.link_campo = lc.id " +
                "LEFT JOIN node.usuario u ON u.id = '" + JSON.parse(localStorage.user).id + "' " +
                "WHERE e.menu_id = '" + id + "' " +
                "AND e.id NOT IN (SELECT elemento_id " +
                "FROM " + JSON.parse(localStorage.user).banco + ".perfil_element pel, " + JSON.parse(localStorage.user).banco + ".cliente_fornecedor clf " +
                "WHERE pel.perfil_id = clf.perfil_id " +
                "AND clf.node_usuario_id = '" + JSON.parse(localStorage.user).id + "' " +
                "AND COALESCE(pel.nao_ver,0)=1) " +
                "ORDER BY ordem";
        }

        g$.createTelaMinhaConta = function () {
            var query = "SELECT m.id FROM node.menu m LEFT JOIN projeto_menu pm ON pm.menu_id = m.id WHERE pm.projeto_id = " + $rootScope.user.projeto_id + " AND m.menu = 'Minha Conta'";

            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                if (g$.exceptionRequisicao("Minha Conta", data)) return;
                g$.criaTela("Minha Conta", data.data[0].id, "MinhaConta", true, true);
                if (!$("#menutelas")[0].classList.contains("menu-ativo")) {
                    $("#menutelas").click();
                    controlWidthView(this, $('#menutelas')[0]);
                }
            });
        }

        g$.criaColuna = function () {
            g$.openModal("openModal | Criar Coluna | CriarColuna | 735");
        }
        g$.criaTabela = function () {
            g$.openModal("openModal | Criar Tabela | CriarTabela | 736");
        }

        g$.validaTamanho = function (tamanho) {
            if (event.target.value.length >= parseInt(tamanho)) {
                event.target.value = event.target.value.substring(0, tamanho);
            }
        }

        g$.nextElemento = function () {
            if (event.keyCode == 13 || event.keyCode == 9) {
                var elm = event.target,
                    tab = 9999999,
                    indice = 0,
                    ordem = parseInt(elm.dataset.ordem),
                    elms = $("#" + elm.dataset.menu_id + " input");
                for (var i = 0; i < elms.length; i++) {
                    if (parseInt(elms[i].dataset.ordem) > ordem && parseInt(elms[i].dataset.ordem) < tab && elms[i].dataset.display != "none") {
                        tab = parseInt(elms[i].dataset.ordem);
                        indice = i;
                    }
                }
                if (event.keyCode == 9) {
                    elms[indice].click();
                }
                else {
                    if (elms[indice].id == "selectbox") {
                        elms[indice].click();
                    }
                    else elms[indice].focus();
                }
            }
        }

        g$.validaEmail = function () {
            if (event.target.value.length) {
                if (event.target.value.indexOf("@") == -1 || event.target.value.indexOf(".") == -1) return event.target.classList.add("invalid");
                else return event.target.classList.remove("invalid");
            }
            else return event.target.classList.remove("invalid");
        }

        g$.validaCep = function () {
            if (event.target.dataset.obrigatorio == "0") {
                if (event.target.value.length && event.target.value.length < 9) return event.target.classList.add("invalid");
                else return event.target.classList.remove("invalid");
            }
            else {
                if (event.target.value.length < 9) return event.target.classList.add("invalid");
                else return event.target.classList.remove("invalid");
            }
        }

        g$.validaTel = function (params) {
            var params = g$.alterSargentos(params),
                min = parseInt(params[1].trim().split("¦")[0]),
                max = parseInt(params[1].trim().split("¦")[1]),
                obrigatorio = parseInt(params[2].trim());
            if (!obrigatorio) {
                if (event.target.value.length == min) return event.target.classList.remove("invalid");
                else if (event.target.value.length > 0 && event.target.value.length < max) return event.target.classList.add("invalid");
                else return event.target.classList.remove("invalid");
            }
            else {
                if (event.target.value.length < max) return event.target.classList.add("invalid");
                else return event.target.classList.remove("invalid");
            }
        }

        g$.validaCNS = function (params) {
            var params = g$.alterSargentos(params),
                cns = params[1].trim(),
                campo = params[2];
            if (cns.trim() != "") {
                function CNS(cns) {
                    if (cns.trim().length != 15) {
                        return (false);
                    }
                    var soma, resto, dv, pis, resultado;
                    if (cns.substring(0, 1) == "1" || cns.substring(0, 1) == "2") {
                        pis = cns.substring(0, 11);

                        soma = ((parseInt(pis.substring(0, 1)) * 15) +
                            (parseInt(pis.substring(1, 2)) * 14) +
                            (parseInt(pis.substring(2, 3)) * 13) +
                            (parseInt(pis.substring(3, 4)) * 12) +
                            (parseInt(pis.substring(4, 5)) * 11) +
                            (parseInt(pis.substring(5, 6)) * 10) +
                            (parseInt(pis.substring(6, 7)) * 9) +
                            (parseInt(pis.substring(7, 8)) * 8) +
                            (parseInt(pis.substring(8, 9)) * 7) +
                            (parseInt(pis.substring(9, 10)) * 6) +
                            (parseInt(pis.substring(10, 11)) * 5));

                        resto = soma % 11;
                        dv = 11 - resto;

                        if (dv == 11) {
                            dv = 0;
                        }

                        if (dv == 10) {
                            soma = ((parseInt(pis.substring(0, 1)) * 15) +
                                (parseInt(pis.substring(1, 2)) * 14) +
                                (parseInt(pis.substring(2, 3)) * 13) +
                                (parseInt(pis.substring(3, 4)) * 12) +
                                (parseInt(pis.substring(4, 5)) * 11) +
                                (parseInt(pis.substring(5, 6)) * 10) +
                                (parseInt(pis.substring(6, 7)) * 9) +
                                (parseInt(pis.substring(7, 8)) * 8) +
                                (parseInt(pis.substring(8, 9)) * 7) +
                                (parseInt(pis.substring(9, 10)) * 6) +
                                (parseInt(pis.substring(10, 11)) * 5)) + 2;

                            resto = soma % 11;
                            dv = 11 - resto;
                            resultado = pis + "001" + dv;
                        }
                        else {
                            resultado = pis + "000" + dv;
                        }

                        if (cns != resultado) {
                            return (false);
                        }
                        else {
                            return (true);
                        }
                    }
                    else if (cns.substring(0, 1) == "7" || cns.substring(0, 1) == "8" || cns.substring(0, 1) == "9") {

                        soma = ((parseInt(cns.substring(0, 1)) * 15) +
                            (parseInt(cns.substring(1, 2)) * 14) +
                            (parseInt(cns.substring(2, 3)) * 13) +
                            (parseInt(cns.substring(3, 4)) * 12) +
                            (parseInt(cns.substring(4, 5)) * 11) +
                            (parseInt(cns.substring(5, 6)) * 10) +
                            (parseInt(cns.substring(6, 7)) * 9) +
                            (parseInt(cns.substring(7, 8)) * 8) +
                            (parseInt(cns.substring(8, 9)) * 7) +
                            (parseInt(cns.substring(9, 10)) * 6) +
                            (parseInt(cns.substring(10, 11)) * 5)) +
                            (parseInt(cns.substring(11, 12)) * 4) +
                            (parseInt(cns.substring(12, 13)) * 3) +
                            (parseInt(cns.substring(13, 14)) * 2) +
                            (parseInt(cns.substring(14, 15)) * 1);

                        resto = soma % 11;

                        if (resto != 0) {
                            return (false);
                        }
                        else {
                            return (true);
                        }
                    } else return (false);
                }
                var k = CNS(cns)
                if (k == false) {
                    $("[data-id=" + campo + "]")[0].value = "";
                    Materialize.toast("CNS Inválido", 4000, 'red darken-1');
                    $("[data-id=" + campo + "]")[0].focus();
                }
            }
        }

        g$.validaCPF = function (params) {
            var params = g$.alterSargentos(params),
                cpf = params[1].trim(),
                campo = params[2];
            if (cpf.trim() != "") {
                function CPF(cpf) {
                    var numeros, digitos, soma, i, resultado, digitos_iguais;
                    digitos_iguais = 1;
                    if (cpf.length < 11)
                        return false;
                    for (i = 0; i < cpf.length - 1; i++)
                        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
                            digitos_iguais = 0;
                            break;
                        }
                    if (!digitos_iguais) {
                        numeros = cpf.substring(0, 9);
                        digitos = cpf.substring(9);
                        soma = 0;
                        for (i = 10; i > 1; i--)
                            soma += numeros.charAt(10 - i) * i;
                        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                        if (resultado != digitos.charAt(0))
                            return false;
                        numeros = cpf.substring(0, 10);
                        soma = 0;
                        for (i = 11; i > 1; i--)
                            soma += numeros.charAt(11 - i) * i;
                        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                        if (resultado != digitos.charAt(1))
                            return false;
                        return true;
                    }
                    else
                        return false;
                }
                var k = CPF(cpf)
                if (k == false) {
                    $("[data-id=" + campo + "]")[0].value = "";
                    Materialize.toast("CPF Inválido", 4000, 'red darken-1');
                    $("[data-id=" + campo + "]")[0].focus();
                }
            }
        }
        g$.validaCNPJ = function (params) {
            var params = g$.alterSargentos(params),
                cnpjDig = params[1],
                campo = params[2];

            function CNPJ(cnpj) {
                cnpj = cnpj.replace(/[^\d]+/g, '');
                if (cnpj == '') return false;
                if (cnpj.length != 14)
                    return false;
                // Elimina CNPJs invalidos conhecidos
                if (cnpj == "00000000000000" ||
                    cnpj == "11111111111111" ||
                    cnpj == "22222222222222" ||
                    cnpj == "33333333333333" ||
                    cnpj == "44444444444444" ||
                    cnpj == "55555555555555" ||
                    cnpj == "66666666666666" ||
                    cnpj == "77777777777777" ||
                    cnpj == "88888888888888" ||
                    cnpj == "99999999999999")
                    return false;
                // Valida DVs
                tamanho = cnpj.length - 2
                numeros = cnpj.substring(0, tamanho);
                digitos = cnpj.substring(tamanho);
                soma = 0;
                pos = tamanho - 7;
                for (i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2)
                        pos = 9;
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(0))
                    return false;

                tamanho = tamanho + 1;
                numeros = cnpj.substring(0, tamanho);
                soma = 0;
                pos = tamanho - 7;
                for (i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2)
                        pos = 9;
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(1))
                    return false;

                return true;
            }
            if (cnpjDig.trim() != "") {
                var k = CNPJ(cnpjDig)
                if (k == false) {
                    $("[data-id=" + campo + "]")[0].value = "";
                    Materialize.toast("CNPJ Inválido", 4000, 'red darken-1');
                    $("[data-id=" + campo + "]")[0].focus();
                }
            }
        }

        g$.openTelaTemp = function (tempo, modal) {
            var tempInterval = setInterval(function () {
                window.open("https://dys.net.br/customizador/inicial.html?" + "modal=" + modal, "", "width=600, height=600");
            }, tempo * 1000 * 60);
        }

        // Adiciona eventos nos campos da tela
        g$.configTela = function (nomeTela) {
            if ($(".popup[data-nome='" + nomeTela + "']")[0].querySelector("#tab")) g$.displayTab(null, nomeTela);
            var campos, obj, retorno;
            campos = $(".popup[data-nome='" + nomeTela + "'] #input, .popup[data-nome='" + nomeTela + "'] #label, .popup[data-nome='" + nomeTela + "'] #tab");

            for (var i = 0; i < campos.length; i++) {
                retorno = 0;
                obj = campos[i].dataset;
                if (campos[i].id == "label") {
                    if (obj.formato == "Money") {
                        $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
                    }
                    else if (obj.formato == "R$ Money") {
                        $("[data-id='" + obj.id + "']").maskMoney({ prefix: 'R$ ', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
                    }
                    else if (obj.formato && obj.formato != "") {
                        if (g$.array_formato.indexOf(obj.formato) == -1) $("[data-id='" + obj.id + "']").mask(g$.formato[0][obj.formato]);
                    }

                    if (obj.mask && obj.mask != "") {
                        if (obj.mask.toLowerCase().indexOf("i") == -1) {
                            $("[data-id='" + obj.id + "']").mask(obj.mask);
                        }
                        else {
                            $("[data-id='" + obj.id + "']").mask(obj.mask.replace("i", ""), { reverse: true });
                        }
                    }
                }
                else if (campos[i].id == "input") {
                    if (obj.tipo == "email") {
                        if (obj.obrigatorio == "0") {
                            campos[i].addEventListener("blur", g$.validaEmail, false);
                            retorno = "1";
                        }
                    }
                    if (obj.tipo == "date") {
                        campos[i].addEventListener("keyup", g$.validaData, false);
                        retorno = "1";
                    }
                    else if (obj.formato == "Peso") {
                        campos[i].addEventListener("keyup", g$.formataPeso, false);
                        retorno = "1";
                    }
                    else if (obj.formato == "Telefone DDD") {
                        if (obj.obrigatorio == "0")
                            campos[i].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 14 | 0', false), false);
                        else campos[i].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 14 | 1', false), false);
                    }
                    else if (obj.formato == "Telefone") {
                        if (obj.obrigatorio == "0")
                            campos[i].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 9 | 0', false), false);
                        else campos[i].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 9 | 1', false), false);
                    }
                    else if (obj.formato == "Cep") {
                        if (obj.obrigatorio == "0")
                            campos[i].addEventListener("blur", g$.validaCep, false);
                        else campos[i].addEventListener("blur", g$.validaCep, false);
                    }
                    else if (obj.formato == "Celular DDD") {
                        if (obj.obrigatorio == "0")
                            campos[i].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 15 | 0', false), false);
                        else campos[i].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 15 | 1', false), false);
                    }
                    else if (obj.formato == "Celular") {
                        if (obj.obrigatorio == "0")
                            campos[i].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 10 | 0', false), false);
                        else campos[i].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 10 | 1', false), false);
                    }
                    else if (obj.formato == "Money") {
                        $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
                    }
                    else if (obj.formato == "R$ Money") {
                        $("[data-id='" + obj.id + "']").maskMoney({ prefix: 'R$ ', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
                    }
                    else if (obj.formato == "PA") {
                        $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', suffix: 'mmHg', precision: 0, allowNegative: true, thousands: '', decimal: '', affixesStay: false });
                    }
                    else if (obj.formato == "FC") {
                        $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', suffix: 'bpm', precision: 0, allowNegative: true, thousands: '', decimal: '', affixesStay: false });
                    }
                    else if (obj.formato == "Glicemia") {
                        $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', suffix: 'mg/dl', precision: 0, allowNegative: true, thousands: '', decimal: '', affixesStay: false });
                    }
                    else if (obj.formato == "Temperatura") {
                        $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', suffix: '°C', precision: 0, allowNegative: true, thousands: '', decimal: '', affixesStay: false });
                    }
                    else if (obj.formato == "CPF") {
                        campos[i].addEventListener("blur", g$.validaCPF.bind(null, "validaCPF | »" + obj.id + "» | " + obj.id, false), false);
                    }
                    else if (obj.formato == "CNS") {
                        campos[i].addEventListener("blur", g$.validaCNS.bind(null, "validaCNS | »" + obj.id + "» | " + obj.id, false), false);
                    }
                    else if (obj.formato == "CNPJ") {
                        campos[i].addEventListener("blur", g$.validaCNPJ.bind(null, "validaCNPJ | »" + obj.id + "» | " + obj.id, false), false);
                    }

                    // Validacao se for tipo number e maxlength
                    if (obj.tipo == "number" && obj.max_length != "") {
                        campos[i].addEventListener("keydown", g$.validaTamanho.bind(null, obj.max_length, false), false);
                    }

                    // campos[i].addEventListener("keydown", g$.nextElemento, false);

                    // Colocando o formato da mascara
                    if (obj.mask && obj.mask != "") {
                        if (obj.mask.toLowerCase().indexOf("i") == -1) {
                            $("[data-id='" + obj.id + "']").mask(obj.mask);
                        }
                        else {
                            $("[data-id='" + obj.id + "']").mask(obj.mask.replace("i", ""), { reverse: true });
                        }
                    }

                    // Colocando o formato da mascara
                    if (retorno != "1" && obj.formato && obj.formato != "" && campos[i].dataset.tipo != "") {
                        if (g$.array_formato.indexOf(obj.formato) == -1) $("[data-id='" + obj.id + "']").mask(g$.formato[0][obj.formato]);
                    }
                }
                else if (campos[i].id == "tab") {
                    campos[i].addEventListener("click", g$.displayTab.bind(null, obj.id), false);
                }
            }
        }

        // Controla Abas
        g$.displayTab = function (id, nomeTela) {

            if (event.target.id == "tab") {
                elm = event.target;
                id = elm.parentElement.dataset.id;
            }
            else {
                if (!$(".popup[data-nome='" + nomeTela + "']")[0].querySelector("#tab")) return;
                elm = $(".popup[data-nome='" + nomeTela + "']")[0].querySelector("#tab");
                id = elm.dataset.id;
            }

            paiUl = elm.parentElement.parentElement;
            // Faz um for para adicionar os play-nones em todos os corpos 
            // as abas do pai
            lis = paiUl.querySelectorAll("li#tab")

            // Desativa todas as abas do pai
            for (var i = 0; i < lis.length; i++) {
                paiUls = $("[data-id='" + lis[i].dataset.id + "']")[1].classList.add("play-none");
            }

            // Ativa a aba que acabou de clicar
            paiUl.querySelector(".active").classList.remove("active");
            elm.classList.add("active");
            $("[data-id='" + id + "']")[1].classList.remove("play-none");

            // filhos da aba ativa
            filhosLis = $("[data-id='" + id + "']")[1].querySelectorAll("li#tab");
            filhosLis.forEach(function (v) {
                $("[data-id='" + v.dataset.id + "']")[1].classList.add("play-none");
            });
            // Ativa a primeira aba do filho
            if (filhosLis && filhosLis.length) $("[data-id='" + filhosLis[0].dataset.id + "']")[1].classList.remove("play-none");
            $("[data-id='" + id + "'] a")[0].classList.add("active");
        }

        // Inicia o menu
        g$._init = function (menu) {
            $("li a").on('click', function (e) {
                //Get the clicked link and the next element
                var $this = $(this);
                var checkElement = $this.next();

                if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
                    checkElement.slideUp('normal', function () {
                        for (var i = 0; i < checkElement.parent().find(".menu-open").length; i++) {
                            checkElement.removeClass('.menu-open');
                            checkElement.parent().find(".menu-open")[i].style.display = "none";
                        }
                    });
                    checkElement.parent("li").removeClass("active");
                }

                else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
                    var parent = $this.parents('ul').first();
                    var ul = parent.find('ul:visible').slideUp('normal');
                    ul.removeClass('menu-open');
                    var parent_li = $this.parent("li");

                    checkElement.slideDown('normal', function () {
                        parent.find('li.active').removeClass('active');
                        for (var i = 0; i < parent_li[0].children.length; i++) {
                            if (parent_li[0].children[i].tagName == "UL") {
                                parent_li[0].children[i].style.display = "block";
                                parent_li[0].children[i].classList.add("active");
                                parent_li[0].children[i].classList.add("menu-open");
                            }
                        }
                    });
                }

                else if ($this.parent("li").is('.treeview')) {
                    if ($this.parent("li").parent("ul").is('.treeview-menu')) return; // Se for filho de alguem só retorna
                    else {
                        $(".menu-open").removeClass('.menu-open');
                        for (var i = 0; i < $(".menu-open").length; i++) {
                            $(".menu-open")[i].style.display = "none";
                        }
                        for (var i = 0; i < $('li.active').length; i++) {
                            $('li.active')[i].className = "treeview";
                        }
                        $this.parent('li').addClass('active');
                    }
                }
            });
        }

        // g$.criaTela = function () { };

        g$.openMenuBloco = function (tela) {
            location.href = "#/" + tela;
        }

        if (g$.user.sysCli) g$._init("#menu0");
        $('.modal').modal();
        g$.configUser();

        $scope.showMessage = function (e) {
            if (event.target.tagName == 'P' || event.target.tagName == 'IMG' || event.target.tagName == 'H4' || event.target.tagName == 'SMALL' || event.target.tagName == 'I' || event.target.tagName == 'DIV') {
                event.target.parentElement.click()
                return
            }
            var k = event.target
            g$.memoMensagem = event.target.dataset.id;
            g$.criaTela("Mensagem", "933");
        }

        $scope.showTarefa = function (e) {
            var elm = event.target;
            while (!elm.dataset.irow) {
                elm = elm.parentElement;
            }
            g$.projectindex = elm.dataset.irow;
            g$.criaTela("Tarefa", "965");
        }

        // Chama a proc que conta os alertas, mensagens e tarefas 
        var query = "call conta_alertas('" + JSON.parse(localStorage.user).logado.id + "')";
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            // Trata Excecao
            g$.exceptionRequisicao("CONTA ALERTAS", data);
            $scope.numAlert = data.data[0][0].alerta;
            $scope.numMensagem = data.data[0][0].mensagem;
            $scope.numTarefa = data.data[0][0].tarefa;
        });

        //Array de Alertas
        g$.openAlertas = function () {
            var query = "SELECT id,progresso,alerta FROM node.alerta where usuario_id = " + JSON.parse(localStorage.user).logado.id;
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                // Trata Excecao
                g$.exceptionRequisicao("ARRAY ALERTA", data);
                $scope.nodeAlerta = data.data;
            });
        }

        //Array de Mensagens
        g$.openMensagens = function () {
            var query = "SELECT ms.id,ms.lido,ms.mensagem,ms.titulo,us.foto,us.nome FROM node.mensagem ms " +
                "LEFT JOIN node.usuario us on us.id = ms.remetente " +
                "where ms.usuario_id = " + JSON.parse(localStorage.user).logado.id;
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                // Trata Excecao
                g$.exceptionRequisicao("ARRAY MENSAGEM", data);
                $scope.nodeMensagem = data.data;
            });
        }

        //Array de Tarefas
        g$.openTarefas = function () {
            var query = "SELECT id, tarefa, progresso FROM node.tarefa ta left join node.tarefa_usuario_notificicao tu on   ta.id = tu.tarefa_id where tu.usuario_notificado_id = " + JSON.parse(localStorage.user).logado.id + " or ta.usuario_id = " + JSON.parse(localStorage.user).logado.id + " order by ta.ordem, ta.inicio_p;";
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                // Trata Excecao
                g$.exceptionRequisicao("ARRAY TAREFA", data);
                $scope.nodeTarefa = data.data;
            });
        }

        // Funcao para abria a tela
        g$.openTela = function (nomeTela) {
            // se tiver alguma tela aberta, fecha
            if ($("#view .popup")[0]) $("#view")[0].removeChild($("#view .popup")[0]);

            var nm_arquivo = "view/" + nomeTela + ".html", popup;

            //  Verifica a tela no banco do cliente 
            $http.post(URL + "/leArquivo/", { arquivo: $rootScope.user.banco + "/" + nm_arquivo }).success(function (data) {
                if (data == "") {
                    // Se nao tiver, pega da raiz
                    $http.post(URL + "/leArquivo/", { arquivo: nm_arquivo }).success(function (data) {
                        criaPopup(data, nomeTela);
                    });
                }
                else criaPopup(data, $rootScope.user.banco + nomeTela);
            });
        }

        function criaPopup(data, nomeTela) {
            popup = angular.element(data)[0];
            popup.querySelector(".card-content").setAttribute("ng-controller", nomeTela);
            $("#view")[0].insertBefore(popup, $("#view")[0].firstChild);
            popupp = $compile(popup)($scope)[0];
        }

        // Notificação Tarefa Socket
        g$._socket = typeof (io) == "undefined" ? null : io.connect("https://dys.net.br");

        g$.NotificationTarefa = function (params) {
            var params = g$.alterSargentos(params),
                tarefa_id = params[1].split("¦")[0],
                user_id = params[1].split("¦")[1],
                msg = params[2],
                cond = params[3],
                idFuncao = params[0].split("¦")[1];

            if (cond && cond.trim().length && cond.split(" OU ").length > 1) {
                for (var i = 0; i < cond.split(" OU ").length; i++) {
                    valida = g$.validaCondicao(cond.split(" OU ")[i]);
                    if (valida) break;
                }
            }
            else valida = (!cond) ? true : g$.validaCondicao(cond);

            if (valida == false) {
                console.log("Não executou porque " + cond + " é falso");
                return g$.vfyFuncaoDepois(idFuncao);
            };

            g$._socket.emit('tarefasocket', {
                tarefa_id: tarefa_id,
                msg: msg,
                user_id: (user_id && user_id.trim() != "") ? user_id : false,
                tipo: 'success'
            });

            g$.vfyFuncaoDepois(idFuncao);
        }

        g$._socket.on('tarefasocket', function (data) {
            var query = "SELECT NOFA.usuario_id AS user_tarefa, NOFA.descricao AS descricao, TAUN._id AS id, USTA.nome AS nome, USU.id AS user_id FROM node.tarefa_usuario_notificicao " +
                "TAUN LEFT JOIN node.usuario USU on USU.id = TAUN.usuario_notificado_id LEFT JOIN node.tarefa NOFA on NOFA.id = TAUN.tarefa_id LEFT JOIN node.usuario USTA ON USTA.id = NOFA.usuario_id WHERE TAUN.tarefa_id = " + data.tarefa_id,
                tipo = data.tipo, tarefas, msg = data.msg, user_id = data.user_id,
                query_tarefa_user = "SELECT USU.id AS id, NOFA.descricao AS descricao, USU.nome AS nome FROM  node.usuario USU LEFT JOIN node.tarefa NOFA ON  USU.id = NOFA.usuario_id WHERE NOFA.id = " + data.tarefa_id;

            if (!data.user_id) {
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Notificação Tarefa", data)) return;
                    // so vai fazer se tiver alguem pra ser notificado pra aquela tarefa
                    if (data.data[0]) {
                        // se o usuario que ta logado tiver pra receber notificacao a funcao retorna 1
                        tarefas = data.data.filter(function (v) { return v.user_id == JSON.parse(localStorage.user).id });
                        if (tarefas.length) g$.notificationDesktop("success", "Tarefa - " + tarefas[0].nome, msg);
                    }
                });
            }
            else {
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query_tarefa_user.trim())).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Notificação Tarefa", data)) return;
                    // so vai fazer se tiver alguem pra ser notificado pra aquela tarefa
                    if ("'" + g$.user.id + "'" == user_id.trim())
                        g$.notificationDesktop("success", "Tarefa - " + data.data[0].nome, msg + data.data[0].nome + ".");
                });
            }
        });

        g$.notificationDesktop = function (tipo, titulo, mensagem) {
            iziToast[tipo]({
                title: titulo,
                message: mensagem,
                timeout: 100000000,
                progressBar: true,
                progressBarColor: '',
                progressBarEasing: 'linear',
            });
        }

    }
});