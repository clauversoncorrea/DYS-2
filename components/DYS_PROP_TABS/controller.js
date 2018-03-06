app.directive("tabsprop", function () {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_PROP_TABS/template.html",
        controller: function ($scope, $http, $rootScope) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarTabs = function (e) {
                if ($("#tabs input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = JSON.stringify($scope.tabs),
                    query = "SELECT * FROM elemento WHERE id = " + $scope.tabs.id;
                $http.put(URL + "/put/elemento/", post).success(function () {
                    $http.get(URL + "/get/" + query).success(function (data) {
                        Materialize.toast('Abas salva com sucesso!', 2000, 'green darken-1');
                        setDadosTabs(g$.elmSelected, data[0]);
                    });
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('tabsSave', function (e, elm) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = event.target.dataset.id;
                elm.dataset.tag = "tabs";
                elm.dataset.menu_id = $scope.getIDMenuItem();
                var post = JSON.stringify(elm.dataset);
                post = g$.omitirPropriedade(post);
                $http.post(URL + "/post/elemento/", post).success(function (data) {
                    var query = "SELECT * FROM elemento WHERE id = " + data.insertId;
                    $http.get(URL + "/get/" + query).success(function (data) {
                        Materialize.toast('Abas salva com sucesso!', 2000, 'green darken-1');
                        setDadosTabs(elm, data[0], true);
                    });
                });
            });

            // Exibe os dados no formulario
            $scope.$on('tabsDisplayDados', function (e) {
                $scope.tabs = {};
                $scope.tabs.id = g$.elmSelected.dataset.id;
                $scope.tabs.tela = g$.elmSelected.dataset.tela;
                $scope.tabs.pai = g$.elmSelected.dataset.pai;
                $scope.tabs.ordem = g$.elmSelected.dataset.ordem;
                $scope.tabs.tag = g$.elmSelected.dataset.tag;
            });

            // Deletar elemento
            $scope.$on('tabsDel', function (e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.dataset.id;
                $http.delete(URL + "/delete/" + query);
            });

        }
    };
});

// Seta os dados no atributo
setDadosTabs = function (elm, obj, isNew) {
    elm.dataset.id = obj.id;
    elm.dataset.tela = obj.tela;
    elm.dataset.pai = obj.pai;
    elm.dataset.ordem = obj.ordem;
    elm.dataset.tag = obj.tag;
}