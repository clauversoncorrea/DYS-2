app.controller("modal", function ($scope, $http, $rootScope, $compile) {

    g$.criaModal = function (id, nome, pai) {
        var query, modal, queryEventosElm, elm = event.target;

        query = "call pega_descendentes('" + pai + "');";
        modal = $scope.montaModal(id, nome);

        $(".wrapper")[0].appendChild(modal);

        $http.get(URL + "/get/" + query).success(function (response) {
            // Trata Excecao
            if(g$.exceptionRequisicao("Tela", response)) return;;

            response.data[0].forEach(function (obj) {
                if (obj.tag == "linha") $scope.montaLinhaModal(modal, obj);
                else if (obj.tag == "coluna") $scope.montaColunaModal(modal, obj);
                else if (obj.tag == "label") $scope.montaLabelModal(modal, obj);
                else if (obj.tag == "input") $scope.montaInputModal(modal, obj);
                else if (obj.tag == "textarea") $scope.montaTextareaModal(modal, obj);
                else if (obj.tag == "icone") $scope.montaIconeModal(modal, obj);
                else if (obj.tag == "botao") $scope.montaBotaoModal(modal, obj);
                else if (obj.tag == "combobox") $scope.montaComboboxModal(modal, obj);
                else if (obj.tag == "tabela") $scope.montaTabelaModal(modal, obj);
                else if (obj.tag == "td") $scope.montaTDModal(modal, obj);
                else if (obj.tag == "selectbox") $scope.montaSelectBoxModal(modal, obj);
                else if (obj.tag == "tabs") $scope.montaTabsModal(modal, obj);
                else if (obj.tag == "tab") $scope.montaTabModal(modal, obj);
                else if (obj.tag == "link") $scope.montaLinkModal(modal, obj);
            });

            // Guarda as consuntas e os filtros em um Array
            // $scope.consultas_filtros(tela);

            // addEventosElm
            // queryEventosElm = "SELECT e.nome, ef.*, e.menu_id FROM elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and " +
            //     "e.menu_id = " + tela + " and coalesce(nome, '') <> 'evento_bloco' ORDER BY ef.ordem;";
            // $http.get(URL + "/get/" + queryEventosElm).success(function (data) {
            //     $scope.addEventos(data);
            // });

            //Inicia todas as abas do materializeCSS que estao no Popup
            $('ul.tabs').tabs();

            $('.date-bootstrap').datepicker({
                orientation: "auto left",
                format: "dd/mm/yyyy",
                language: "pt-BR"
            });

            modal.classList.add("open");
        });
    };

    $scope.montaModal = function (id, nome) {
        var modal = "<div id=" + id + " class='modal'> " +
            "<div class='popup card col s12'> <div class='card-header'> <div class='card-title'> " + nome + " </div><div class='card-icone'>" +
            "<i class='fa fa-close' onclick='g$.closeModal('" + id + "')>  </i> </div> </div> <div class='card-content'> </div> </div> </div>";
        return angular.element(modal)[0];
    }

    $scope.consultas_filtros = function (tela) {
        var query = "select c.id, f.id as id_filtro, f.filtro from consulta c LEFT JOIN consulta_filtro f ON c.id = f.consulta_id where c.tela_id = " + tela;
        $http.get(URL + "/get/" + query).success(function (data) {
            // Trata Excecao
            if(g$.exceptionRequisicao("Tela", data)) return;;

            $rootScope.consultas_filtros = data.data;
            // Carrega os eventos loads da tela
            $scope.addEventosPopup(tela);
        });
    }

    $scope.montaLinhaModal = function (modal, obj) {
        var template = angular.element($.template[0]["linha"])[0];
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        modal.querySelector(".card-content").appendChild(template);
    };

    $scope.montaColunaModal = function (modal, obj) {
        var template = angular.element($.template[0]["coluna"])[0];
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        modal.querySelector(".card-content [data-id='" + obj.pai + "']").appendChild(template);
    };

    $scope.montaLabelModal = function (modal, obj) {
        var template = angular.element($.template[0]["label"])[0];
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        modal.querySelector(".card-content [data-id='" + obj.pai + "']").appendChild(template);
    }

    $scope.montaInputModal = function (modal, obj) {
        var template = angular.element($.template[0]["input"])[0];
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        modal.querySelector(".card-content [data-id='" + obj.pai + "']").appendChild(template);
        if (obj.tipo == "date")
            modal.querySelector(".card-content [data-id='" + obj.pai + "']").innerHTML +=
                "<i class='fa fa-calendar input-date' onclick='_initDate()' data-id='" + obj.id + "'> </i>";
    }

    $scope.montaTextareaModal = function (modal, obj) {
        var template = angular.element($.template[0]["textarea"])[0];
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        modal.querySelector(".card-content [data-id='" + obj.pai + "']").appendChild(template);
    }

    $scope.montaIconeModal = function (modal, obj) {
        var template = angular.element($.template[0]["icone"])[0],
            pai = modal.querySelector(".card-content [data-id='" + obj.pai + "']");
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        if (pai.id == "coluna") pai.appendChild(template);
        else if (pai.id == "botao") pai.insertBefore(template, pai.firstChild);
    }

    $scope.montaBotaoModal = function (modal, obj) {
        var template = angular.element($.template[0]["botao"])[0];
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        modal.querySelector(".card-content [data-id='" + obj.pai + "']").appendChild(template);
    }

    $scope.montaTabelaModal = function (modal, obj) {
        var template = angular.element($.template[0]["tabela"])[0];
        setDadosView(template, obj, false);
        modal.querySelector(".card-content [data-id='" + obj.pai + "']").appendChild(template);
    }

    $scope.montaTDModal = function (modal, obj) {
        var th = angular.element($.template[0]["th"])[0],
            td = angular.element($.template[0]["td"])[0];
        setDadosView(td, obj, th, false);
        // td = $compile(td)($scope)[0];
        if (td.dataset.display && td.dataset.display.trim() != "none") {
            modal.querySelector(".card-content [data-id='" + obj.pai + "'] thead tr").appendChild(th);
            modal.querySelector(".card-content [data-id='" + obj.pai + "'] tbody tr").appendChild(td);
            th.style.minWidth = th.offsetWidth + 10 + "px";
            td.style.minWidth = td.offsetWidth + 10 + "px";
        }
    }

    $scope.montaSelectBoxModal = function (modal, obj) {
        var template = angular.element($.template[0]["selectbox"])[0];
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        modal.querySelector(".card-content [data-id='" + obj.pai + "']").appendChild(template);
    }

    $scope.montaTabsModal = function (modal, obj) {
        var template = angular.element($.template[0]["tabs"])[0];
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        modal.querySelector(".card-content [data-id='" + obj.pai + "']").appendChild(template);
    }

    $scope.montaTabModal = function (modal, obj) {
        var template = angular.element($.template[0]["tab"])[0], corpoTab;
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        corpoTab = angular.element($.template[0]["corpoTab"])[0];
        corpoTab.id = "aba" + template.dataset.id;
        corpoTab.dataset.id = template.dataset.id;

        modal.querySelector(".card-content ul[data-id='" + obj.pai + "']").appendChild(template);
        modal.querySelector(".card-content ul[data-id='" + obj.pai + "']").parentElement.parentElement.appendChild(corpoTab);
    }

    $scope.montaLinkModal = function (modal, obj) {
        var template = angular.element($.template[0]["link"])[0];
        setDadosView(template, obj, false);
        template = $compile(template)($scope)[0];
        modal.querySelector(".card-content div[data-id='" + obj.pai + "']").appendChild(template);
    }

    $scope.addEventos = function (data) {
        data.forEach(function (v, i) {
            var elm = $("#view [data-id=" + v.elemento_id + "]")[0];
            funcao = v.funcao.split("|")[0],
                params = v.funcao;
            if (elm.id == "selectbox") {
                elm.children[1].addEventListener(v.evento, g$[funcao.trim()].bind(null, params), false);
            }
            else if (elm.id == "tab" && v.evento == "keydown") {
                $("#view [data-id='" + elm.dataset.id + "'")[1].addEventListener(v.evento, g$[funcao.trim()].bind(null, params), false);
            }
            else elm.addEventListener(v.evento, g$[funcao.trim()].bind(null, params, elm), false);
        });
    }

    $scope.addEventosPopup = function (tela) {
        var popup = $("#view #" + tela)[0];
        query = "SELECT * FROM tela_funcao WHERE tela_id=" + tela + " ORDER BY ordem";
        $http.get(URL + "/get/" + query).success(function (response) {
            // Trata Excecao
            if(g$.exceptionRequisicao("Tela", response)) return;;

            response.data.forEach(function (v, i) {
                var funcao = v.funcao.split("|")[0].trim(),
                    params = v.funcao;
                if (v.evento == "load") g$[funcao].bind(null, params)();
                else if (v.evento == "keydown") {
                    popup.querySelector(".card-content").addEventListener(v.evento, g$[funcao.trim()].bind(null, params), false);
                }
            });
        });
    }
});