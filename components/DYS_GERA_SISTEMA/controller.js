app.directive("geraSistema", function() {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_GERA_SISTEMA/template.html",
        controller: function($scope, $http, $compile, $rootScope) {

            // consistencia para gerar o html e JS(funcoes da tela) e a rota da tela que esta aberta
            $scope.gerarTela = function() {
                var nomeTela = $("#view .popup")[0].dataset.nome.split(" ").join("") + $("#view .popup")[0].dataset.tela,
                    id_tela = $("#view .popup")[0].dataset.tela,
                    tela = g$.tela,
                    isTela_cliente = false,
                    query, objTela, objController;
                tela = tela.split('onclick="displayDadosProp()"').join("");
                tela = tela.split('ng-controller="customizador"').join("");
                tela = tela.split('ondrop="dragDrop(this)"').join("");
                tela = tela.split('title=').join("");
                tela = tela.split('ondragover="dragOver(this)"').join("");
                tela = tela.split('g$.requeryAcoesTela()').join("");
                objTela = { arquivo: tela, caminho: "view", nome: nomeTela + ".html" };
                objController = { arquivo: g$.controllerTela + "});", caminho: "view", nome: nomeTela + ".js" };
                // query para verficiar se tem elemento da tela na base do cliente
                query = "select id from " + $rootScope.user.banco + ".elemento where menu_id = " + id_tela;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function(data) {
                    if (data.data.length) {
                        objTela.caminho = $rootScope.user.banco + "/view";
                        objController.caminho = $rootScope.user.banco + "/view";
                        objController.arquivo = objController.arquivo.replace(nomeTela, $rootScope.user.banco + nomeTela);
                        isTela_cliente = true;
                    }
                    // HTML e JS
                    $http.post(URL + "/geraArquivo/", objTela).success(function(data) {
                        $http.post(URL + "/geraArquivo/", objController);
                    });
                    // Chama a funcao que cria a rota da tela
                    $scope.atualizaRouter(nomeTela, isTela_cliente);
                });
            }

            // Atualiza a rota da tela que foi passada por parametro
            $scope.atualizaRouter = function(nomeTela, isTela_cliente) {
                $http.post(URL + "/leArquivo/", { arquivo: "DYS_TEMPLATE/router.js" }).success(function(data) {
                    var conteudo = data, busca, troca, temp, caminho, nomeRota;
                    nomeController = (isTela_cliente) ? $rootScope.user.banco + nomeTela : nomeTela;
                    caminho = (isTela_cliente) ? "view/" : "../view/";
                    caminho += nomeTela;
                    nomeRota = (isTela_cliente) ? "/" + $rootScope.user.banco + "/" + nomeTela : "/" + nomeTela;
                    busca = nomeRota;
                    if (data == "" || !data) {
                        conteudo = "app.config(function($routeProvider) { $routeProvider " + " .when('" + nomeRota +
                            "', {templateUrl :" + caminho + ".html',controller: '" + nomeController + "'})});";
                    } else {
                        if (conteudo.indexOf(busca) == -1) {
                            conteudo = conteudo.substring(0, conteudo.length - 3);
                            conteudo += ".when('" + nomeRota + "', {templateUrl : '" + caminho + ".html',controller: '" + nomeController + "'})});"
                        }
                    }
                    var objRouter = {
                        arquivo: conteudo,
                        caminho: "raiz",
                        nome: "router.js",
                    }
                    $http.post(URL + "/geraArquivo/", objRouter);
                });
            }

            // Consistencia para gerar o modal e JS(funcoes da tela) e atualiza as funcoes do modal
            $scope.gerarModal = function() {
                var nomeTela = $("#view .popup")[0].dataset.nome.split(" ").join("") + $("#view .popup")[0].dataset.tela,
                    tela = g$.tela;
                tela = tela.split('onclick="displayDadosProp()"').join("");
                tela = tela.split('ng-controller="customizador"').join("");
                tela = tela.split('ondrop="dragDrop(this)"').join("");
                tela = tela.split('ondragover="dragOver(this)"').join("");
                tela = tela.split('title=').join("");
                tela = tela.replace("popClose", "closeModalView('" + nomeTela + "')");
                tela = tela.split('g$.requeryAcoesTela()').join("");
                var objTela = {
                    arquivo: tela,
                    caminho: "modal",
                    nome: "modal" + nomeTela + ".html"
                },
                    objController = {
                        arquivo: g$.controllerModal + "}}});",
                        caminho: "modal",
                        nome: "modal" + nomeTela + ".js"
                    },
                    id_tela = $("#view .popup")[0].dataset.tela;

                // HTML e JS
                $http.post(URL + "/geraArquivo/", objTela).success(function(data) {
                    $http.post(URL + "/geraArquivo/", objController);
                });
                // Chama a funcao para atualizar as funcoes do model
                $scope.funcoesModal(id_tela);
            }

            // Consistencia para atualizar as funcoes do modal
            $scope.funcoesModal = function(id_tela) {
                $http.post(URL + "/leArquivo/", { arquivo: "DYS_TEMPLATE/funcaomodal.js" }).success(function(data) {
                    var conteudo = data, busca = "if (tela == \"" + id_tela + "\")", troca, temp;
                    if (data == "" || !data) {
                        conteudo = "g$.atualizaFuncoes = function (tela) { " + busca + " {" + g$.funcoesModal + "} }"
                    } else {
                        if (conteudo.indexOf(busca) == -1) {
                            conteudo = conteudo.substring(0, conteudo.lastIndexOf("}")) + " else " + busca + " {" + g$.funcoesModal + "}}";
                        } else {
                            temp = conteudo.substring(conteudo.indexOf(busca));
                            trocar = temp.substring(0, temp.indexOf("}") + 1);
                            conteudo = conteudo.replace(trocar, busca + " {" + g$.funcoesModal + "}");
                        }
                    }
                    objFuncoesModal = {
                        arquivo: conteudo,
                        caminho: "raiz",
                        nome: "funcaomodal.js",
                    }
                    $http.post(URL + "/geraArquivo/", objFuncoesModal);
                });
            }

            // Consistencia para criar a directive do modal
            $scope.geraTemplateModals = function() {
                var objTemplateJs,
                    query = "call node.template_modal(" + $rootScope.user.projeto_id + ")";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function(data) {
                    g$.exceptionRequisicao("Template Modsal", data);
                    objTemplateJs = {
                        arquivo: data.data[0][0].modal,
                        caminho: "raiz",
                        nome: "templateModal.js",
                    }
                    $http.post(URL + "/geraArquivo/", objTemplateJs);
                });
            }

            // Consistencia para trazer todos os links de scripts dos modals
            $scope.linksModals = function() {
                var query = "call node.js_modal(" + $rootScope.user.projeto_id + ")";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function(data) {
                    g$.exceptionRequisicao("Template Modal", data);
                    console.log(data.data[0][0].modal);
                });
            }

        }
    };
});