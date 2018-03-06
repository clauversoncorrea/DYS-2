app.directive("tabelaprop", function () {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_PROP_TABELA/template.html",
        controller: function ($scope, $http, $compile, $rootScope) {

            // $scope.$on("requeryConsulta", function (e, idTela) {
            //     $scope.menu_id = idTela;
            //     var elm = $("#tabela #consulta")[0];
            //     elm.dataset.comboQuery = "SELECT * FROM consulta WHERE menu_id=" + $scope.menu_id;
            //     $compile(elm)($scope)[0];
            // });

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarTabela = function (e) {
                if ($("#tabela input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = JSON.stringify(g$.getValuesCombo("tabela", $scope.tabela)),
                    query = "SELECT * FROM elemento WHERE id = " + $scope.tabela.id;
                $http.put(URL + "/put/elemento/", post).success(function () {
                    $http.get(URL + "/get/" + query).success(function (data) {
                        Materialize.toast('Tabela salva com sucesso!', 2000, 'green darken-1');
                        setDadosTabela(g$.elmSelected, data[0]);
                    });
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('tabelaSave', function (e, elm) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = elm.parentElement.dataset.id;
                elm.dataset.tag = "tabela";
                elm.dataset.menu_id = $scope.getIDMenuItem();
                // elm.dataset.tabela_tabela = undefined;
                var post = JSON.stringify(elm.dataset);
                post = g$.omitirPropriedade(post);
                $http.post(URL + "/post/elemento/", post).success(function (data) {
                    var query = "SELECT * FROM elemento WHERE id = " + data.insertId;
                    $http.get(URL + "/get/" + query).success(function (data) {
                        Materialize.toast('Tabela salva com sucesso!', 2000, 'green darken-1');
                        setDadosTabela(elm, data[0]);
                    });
                });
            });

            // Exibe os dados no formulario
            $scope.$on('tabelaDisplayDados', function (e) {
                $scope.tabela = {};
                $scope.tabela.id = g$.elmSelected.dataset.id;
                $scope.tabela.tela = g$.elmSelected.dataset.tela;
                $scope.tabela.pai = g$.elmSelected.dataset.pai;
                $scope.tabela.ordem = g$.elmSelected.dataset.ordem;
                $scope.tabela.tag = g$.elmSelected.dataset.tag;
                $scope.tabela.nome = g$.elmSelected.dataset.nome;
                $scope.tabela.tabela_multiselect = (g$.elmSelected.dataset.tabela_multiselect == "1") ? true : false;
                $scope.tabela.tabela_info = (g$.elmSelected.dataset.tabela_info == "1") ? true : false;
                $scope.tabela.tabela_pesquisar = (g$.elmSelected.dataset.tabela_pesquisar == "1") ? true : false;
                $scope.tabela.tabela_paginate = (g$.elmSelected.dataset.tabela_paginate == "1") ? true : false;
                $scope.tabela.tabela_botao_copiar = (g$.elmSelected.dataset.tabela_botao_copiar == "1") ? true : false;
                $scope.tabela.tabela_botao_excel = (g$.elmSelected.dataset.tabela_botao_excel == "1") ? true : false;
                $scope.tabela.tabela_botao_pdf = (g$.elmSelected.dataset.tabela_botao_pdf == "1") ? true : false;
                $scope.tabela.tabela_botao_imprimir = (g$.elmSelected.dataset.tabela_botao_imprimir == "1") ? true : false;
                $scope.tabela.tabela_botao_filtro = (g$.elmSelected.dataset.tabela_botao_filtro == "1") ? true : false;

                var obj = g$.setValuesCombo("tabela", { tabela_consulta_id: g$.elmSelected.dataset.tabela_consulta_id });

                // Elemento dentro da view vai passar na função para adicionar um evento
                $scope.$broadcast("requeryAcoes", $scope.tabela.id, "Tabela " + $scope.tabela.nome);
            });

            // Deletar elemento
            $scope.$on('tabelaDel', function (e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.dataset.id;
                $http.delete(URL + "/get/" + query);
            });

            $scope.alterarTabela = function (elm) {
                var pai = $("#view [data-id='" + $scope.tabela.pai + "']")[0],
                    tabela = pai.querySelector("table"),
                    template;
                template = tabela.tBodies[0].rows[0];
                tabela.tBodies[0].innerHTML = "";
                template.removeAttribute("ng-repeat");
                [].slice.call(template.cells).forEach(function (v) {
                    if (v.children[0] && v.children[0].tagName == "INPUT") return;
                    else v.innerHTML = v.dataset.texto;
                });
                tabela.tBodies[0].appendChild(template);
            }

        }
    };
});

// Seta os dados no atributo
// isNew - A primeira vez que ele está indo...
setDadosTabela = function (elm, obj) {
    elm.dataset.id = obj.id;
    elm.dataset.tela = obj.tela;
    elm.dataset.pai = obj.pai;
    elm.dataset.nome = obj.nome;
    elm.dataset.ordem = obj.ordem;
    elm.dataset.tag = obj.tag;
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
}