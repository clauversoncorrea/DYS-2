app.directive("menuTelas", function () {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_MENU_TELAS/template.html",
        controller: function ($scope, $http, $compile, $rootScope) {

            //Request da consulta dos itens do menu
            $.createMenuTelas = function (projeto_id) {
                //Request da consulta dos itens do menu
                var query = "call node.montaMenuProjeto_novo('" + projeto_id + "', '" + $rootScope.user.id + "')";
                // var query = "node.montaMenuProjeto('" + projeto_id + "')";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    g$.exceptionRequisicao("Monta Menu", data);
                    createMenuTelas(data.data[0]);
                });
            }

            // Set os dados nos campos através do objeto e verifica se for um item novo
            g$.retDadosMenuTela = function (e) {
                var elm = (event.target.tagName == "A") ? event.target.parentElement : event.target.parentElement.parentElement;
                $scope.dadosMenuTela = angular.copy($scope.menuTelas[elm.dataset.id]);
                $scope.dadosMenuTela.app_menu = ($scope.dadosMenuTela.app_menu == 1) ? true : false;
                $scope.dadosMenuTela.web_menu = ($scope.dadosMenuTela.web_menu == 1) ? true : false;
                $scope.dadosMenuTela.fullscreen = ($scope.dadosMenuTela.fullscreen == 1) ? true : false;
                $scope.dadosMenuTela.menu_tela_inicial = ($scope.dadosMenuTela.menu_tela_inicial == 1) ? true : false;
                // Se for um item novo, ele remove a id e menu, e deixa apenas o pai, e set isNewItemMenuTela como true  
                if (event.target.classList.contains("fa-plus-circle")) {
                    $scope.dadosMenuTela.pai = $scope.dadosMenuTela.id;
                    delete $scope.dadosMenuTela.id;
                    delete $scope.dadosMenuTela.menu;
                }
                modalMenuTelas();
                $("#propMenuTelas")[0].className = "";
                $("#propLinha")[0].className = "play-none";
            }

            $scope.setIDMenuItem = function (id) {
                $scope.dadosMenuTela = { 'id': id };
            }

            $scope.getIDMenuItem = function () {
                return (!$scope.dadosMenuTela) ? undefined : $scope.dadosMenuTela.id;
            }

            $scope.getNameTela = function () {
                return (!$scope.dadosMenuTela) ? undefined : $scope.dadosMenuTela.menu;
            }

            modalMenuTelas = function () {
                var li;
                li = (event.target.tagName == "I") ? event.target.parentElement.parentElement : event.target.parentElement;
                // $('#modal-menuTelas .modal-content')[0].innerHTML = "";
                if (!$("#menutelas")[0].classList.contains("menu-ativo")) {
                    if (li.querySelectorAll(".treeview-menu").length) {
                        document.body.classList.remove("sidebar-collapse");
                        controlWidthView(this, $("#menutelas")[0]);
                    }
                }
            }

            // Create Menu Telas
            createMenuTelas = function (data) {
                $scope.menuTelas = data, queryMenuOrdem = "";
                $("#menu0")[0].innerHTML = "";
                $("#container-menu")[0].innerHTML = "";

                for (var i = 0; i < data.length; i++) {
                    var li = "<li onClick='g$.retDadosMenuTela();' data-popup='" + data[i].popup + "' data-app_menu='" + data[i].app_menu + "' data-web_menu='" + data[i].web_menu +
                        "' data-name='" + data[i].menu + "' data-id='" + i + "' class='treeview' id='menu" + data[i].id + "' data-fullscreen='" + data[i].fullscreen + "'> " +
                        "<a id='menu-telas' data-popup='" + data[i].popup + "' href='#'>" +
                        "<i id='icone-telas' data-popup='" + data[i].popup + "' class='fa " + data[i].icone + "'> </i>" +
                        "<span id='menu-telas' data-popup='" + data[i].popup + "'>" + data[i].menu + "</span> " +
                        "</a> </li>",
                        icon = g$.newElement("i", "fa", "fa-angle-right", "pull-right");

                    var template = angular.element(li);

                    if (data[i].tipo == "grupo") template[0].querySelector("a").appendChild(icon);

                    var elm = template[0];
                    if ($("#menu" + data[i].pai)[0] != undefined && data[i].pai != 0) { //Se ele encontrar o menu pai e for diferente de menu0 
                        var ul = g$.newElement("ul", "treeview-menu");
                        ul.appendChild(template[0]);
                        elm = ul;
                    }

                    if (data[i].tipo == "tela") {
                        if (data[i].menu_tela_inicial == "1") {
                            var menu_bloco = angular.element($.template[0]["menu_bloco"])[0];
                            var nome_tela = data[i].menu.split(" ").join("") + data[i].id;
                            menu_bloco.dataset.app_menu = data[i].app_menu;
                            menu_bloco.dataset.web_menu = data[i].web_menu;
                            menu_bloco.dataset.popup = data[i].popup;
                            menu_bloco.children[0].children[0].dataset.popup = menu_bloco.children[0].dataset.popup = data[i].popup;
                            if (menu_bloco.children[0].children[0].children[0]) menu_bloco.children[0].children[0].children[0].dataset.popup = data[i].popup;
                            menu_bloco.children[0].children[0].children[1].dataset.popup = data[i].popup;
                            menu_bloco.querySelector("#icone_menu").className = "fa " + data[i].icone;
                            menu_bloco.querySelector("#texto_menu").innerHTML = data[i].menu;
                            $("#container-menu")[0].appendChild(menu_bloco);
                            if (g$.user.sysCli) {
                                menu_bloco.addEventListener("click", g$.openTela.bind(null, nome_tela), false);
                                menu_bloco.addEventListener("click", g$.openTela.bind(null, nome_tela), false);
                            }
                            else {
                                menu_bloco.addEventListener("click", g$.retBlocoMenuTela.bind(null, data[i]), false);
                                menu_bloco.addEventListener("click", g$.criaTela.bind(null, data[i].menu, data[i].id), false);
                            }
                        }
                        if (g$.user.sysCli)
                            template[0].children[0].addEventListener("click", g$.openTela.bind(null, nome_tela), false);
                        else
                            template[0].children[0].addEventListener("click", g$.criaTela.bind(null, data[i].menu, data[i].id), false);
                    }

                    var element = $compile(elm)($scope);

                    // queryMenuOrdem += "UPDATE menu set ordem = " + i + " WHERE id = " + data[i].id + ";";

                    if ($("#menu" + data[i].pai)[0]) $("#menu" + data[i].pai)[0].appendChild(element[0]);
                    else g$.exibeQuery("Menu Tela", "Quebrou o menu " + data[i].menu + " ID: " + data[i].id);
                    if (i + 1 == data.length && $("#loadzinTelamenu")[0]) {
                        $("#loadzinTelamenu")[0].outerHTML = "";
                    }
                }

                // $("#queryMenu")[0].value = queryMenuOrdem;
                g$._init();
            }

            g$.retBlocoMenuTela = function (data) {
                $scope.dadosMenuTela = angular.copy(data);
                $scope.dadosMenuTela.app_menu = (data.app_menu == 1) ? true : false;
                $scope.dadosMenuTela.web_menu = (data.web_menu == 1) ? true : false;
                $scope.dadosMenuTela.menu_tela_inicial = (data.menu_tela_inicial == 1) ? true : false;
                $("#propMenuTelas")[0].className = "";
                $("#propLinha")[0].className = "play-none";
            }

            // Passa o pai e set itemMenuTela como true, essa função serve apenas para o novoItemMenuTela da raiz
            $scope.novoItemMenuTela = function (e) {
                $scope.dadosMenuTela = { pai: 0 };
                $scope.btDeleteMenuTelaDisabled = g$.isNewItemMenuTela = true;
            }

        }
    };
});