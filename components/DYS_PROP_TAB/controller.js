app.directive("tabprop", function () {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_PROP_TAB/template.html",
        controller: function ($scope, $http, $compile) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarTab = function (e) {
                if ($("#tab input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = JSON.stringify($scope.tab),
                    query = "SELECT * FROM elemento WHERE id = " + $scope.tab.id;
                $http.put(URL + "/put/elemento/", post).success(function () {
                    $http.get(URL + "/get/" + query).success(function (data) {
                        Materialize.toast('Aba salva com sucesso!', 2000, 'green darken-1');
                        setDadosTab(g$.elmSelected.parentElement, data[0]);
                    });
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('tabSave', function (e, elm, pai) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = pai;
                elm.dataset.tag = "tab";
                elm.dataset.texto = "Texto";
                elm.dataset.menu_id = $scope.getIDMenuItem();
                var post = JSON.stringify(elm.dataset);
                post = g$.omitirPropriedade(post);
                $http.post(URL + "/post/elemento/", post).success(function (data) {
                    var query = "SELECT * FROM elemento WHERE id = " + data.insertId;
                    $http.get(URL + "/get/" + query).success(function (data) {
                        Materialize.toast('Aba salva com sucesso!', 2000, 'green darken-1');
                        setDadosTab(elm, data[0]);
                    });
                });
            });

            // Exibe os dados no formulario
            $scope.$on('tabDisplayDados', function (e) {
                $scope.tab = {};
                $scope.tab.id = g$.elmSelected.parentElement.dataset.id;
                $scope.tab.tela = g$.elmSelected.parentElement.dataset.tela;
                $scope.tab.pai = g$.elmSelected.parentElement.dataset.pai;
                $scope.tab.ordem = g$.elmSelected.parentElement.dataset.ordem;
                $scope.tab.tag = g$.elmSelected.parentElement.dataset.tag;
                $scope.tab.texto = g$.elmSelected.parentElement.dataset.texto;

                // Elemento dentro da view vai passar na função para adicionar um evento
                $scope.$broadcast("requeryAcoes", $scope.tab.id, "Tab " + $scope.tab.texto);
            });

            // Deletar elemento
            $scope.$on('tabDel', function (e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.dataset.id;
                $http.delete(URL + "/delete/" + query);
            });

        }
    };
});

// Seta os dados no atributo
setDadosTab = function (elm, obj) {
    elm.dataset.id = obj.id;
    elm.dataset.tela = obj.tela;
    elm.dataset.pai = obj.pai;
    elm.dataset.ordem = obj.ordem;
    elm.dataset.tag = obj.tag;
    elm.dataset.texto = obj.texto;

    // Elemento HTML
    elm.children[0].textContent = obj.texto;
    elm.children[0].href = "#aba" + obj.id;
}