app.directive("menutelasprop", function() {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_PROP_MENU_TELAS/template.html",
        controller: function($scope, $http, $compile, $rootScope) {
            
            g$.openModalPopup = function() {
                if (!$scope.dadosMenuTela) return Materialize.toast("Nenhuma Tela Secionada", 5000, 'red darken-1');
                for (var i = 1; i <= 4; i++) {
                    $("#modal-popup #pop-" + i)[0].removeAttribute("checked");
                    $("#modal-popup #pop-" + i)[0].removeAttribute("value");
                }
                $("#modal-popup #" + $("#prop_menu_telas #popup")[0].value)[0].setAttribute("checked", true)
                g$.openModalCust('modal-popup');
            }

            g$.selecionaPopup = function() {
                $("#prop_menu_telas #popup")[0].value = event.target.id;
                g$.closeModalCust('modal-popup');
            }

            // Passar o parametro id
            // Mecanismo para detelar um item do menuTelas
            $scope.deletarItemMenuTela = function(e) {
                var queryProjetoMenu = "SELECT * FROM projeto_menu = menu_id = " + $scope.dadosMenuTela.id,
                    queryMenu = "DELETE FROM menu where id = " + $scope.dadosMenuTela.id;

                if ($scope.btDeleteMenuTelaDisabled) return;
                if (confirm("Tem certeza que deseja excluir o item menu " + $scope.dadosMenuTela.menu + "?")) {
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryProjetoMenu.trim())).success(function(data) {
                        // Trata Excecao
                        g$.exceptionRequisicao("Menu", data);
                        data = data.data;

                        // data.forEach(function)

                        $http.delete(URL + '/delete/' + query).success(function(data) {
                            // Trata Excecao
                            g$.exceptionRequisicao("Menu", data);

                            $.createMenuTelas($rootscope.user.projeto_id);
                        });
                    });
                }
            }

            $scope.novoItemMenuTela = function(e) {
                if ($scope.dadosMenuTela.pai == "0" && !$scope.dadosMenuTela.id) return;
                $scope.dadosMenuTela.pai = $scope.dadosMenuTela.id;
                delete $scope.dadosMenuTela.id;
                delete $scope.dadosMenuTela.menu;
                delete $scope.dadosMenuTela.icone;
            }

            $scope.novoItemMenuTelaRaiz = function(e) {
                delete $scope.dadosMenuTela.id;
                delete $scope.dadosMenuTela.menu;
                delete $scope.dadosMenuTela.icone;
                $scope.dadosMenuTela.pai = "0";
            }

            // Mecanismo para criar e alterar um item do menuTelas
            $scope.salvarItemMenuTela = function(e) {
                if ($("#prop_menu_telas #id")[0].value == "") $scope.insertItemMenuTela();
                else $scope.updateItemMenuTela();
            }

            $scope.insertItemMenuTela = function(e) {
                var obj;
                // Não tem na tabela menu
                delete $scope.dadosMenuTela.menu_id;
                $scope.dadosMenuTela = g$.omitirPropriedade($scope.dadosMenuTela);
                $scope.dadosMenuTela.popup = $("#prop_menu_telas #popup")[0].value;

                $http.post(URL + '/post/menu/', $scope.dadosMenuTela).success(function(data) {
                    // Trata Excecao
                    g$.exceptionRequisicao("Menu", data);

                    data = data.data;
                    obj = { menu_id: data.insertId, projeto_id: $rootScope.user.projeto_id };
                    $http.post(URL + '/post/projeto_menu/', obj).success(function(data) {
                        // Trata Excecao
                        g$.exceptionRequisicao("Menu", data);

                        $.createMenuTelas($rootScope.user.projeto_id);
                    });

                });
            }

            $scope.updateItemMenuTela = function(e) {
                // Não tem na tabela menu
                delete $scope.dadosMenuTela.menu_id;
                $scope.dadosMenuTela = g$.omitirPropriedade($scope.dadosMenuTela);
                $scope.dadosMenuTela.popup = $("#prop_menu_telas #popup")[0].value;

                // Altera na tabela Menu
                $http.put(URL + '/put/menu/', $scope.dadosMenuTela).success(function(data) {
                    // Trata Excecao
                    g$.exceptionRequisicao("Menu", data);

                    if (data.err) return Materialize.toast("Erro ao Gravar", 5000, 'red darken-1');
                    Materialize.toast("Salvo com sucesso", 5000, 'green darken-1');

                    $.createMenuTelas($rootScope.user.projeto_id);
                });
            }
        }
    };
});