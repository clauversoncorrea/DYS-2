app.directive("iconeprop", function () {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_PROP_ICONE/template.html",
        controller: function ($scope, $http, $rootScope) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarIcone = function (e) {
                if ($("#icone input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = JSON.stringify($scope.icone),
                    query = "SELECT * FROM elemento WHERE id = " + $scope.icone.id;
                post = g$.omitirPropriedade(post);
                g$.montaQuery("Customizador", post, "elemento", false);
                $http.put(URL + "/put/elemento/", post).success(function (data) {
                    if (data.err) return Materialize.toast('Erro ao Alterar', 2000, 'red darken-1');
                    else {
                        g$.exibeQuery("Customizador", query);
                        $http.get(URL + "/get/" + query).success(function (data) {
                            Materialize.toast('Ícone salvo com sucesso!', 2000, 'green darken-1');
                            setDadosIcone(g$.elmSelected, data[0]);
                        });
                    }
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('iconeSave', function (e, elm, pai) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = pai;
                elm.dataset.tag = "icone";
                elm.dataset.texto = "fa-share-square-o";
                elm.dataset.tamanho = "20";
                elm.dataset.menu_id = $scope.getIDMenuItem();
                var post = JSON.stringify(elm.dataset);
                post = g$.omitirPropriedade(post);
                g$.montaQuery("Customizador", post, "elemento", true);
                $http.post(URL + "/post/elemento/", post).success(function (data) {
                    if (data.err) return Materialize.toast('Erro ao Gravar', 2000, 'red darken-1');
                    else {
                        var query = "SELECT * FROM elemento WHERE id = " + data.insertId;
                        g$.exibeQuery("Customizador", query);
                        $http.get(URL + "/get/" + query).success(function (data) {
                            Materialize.toast('Ícone salvo com sucesso!', 2000, 'green darken-1');
                            setDadosIcone(elm, data[0], true);
                        });
                    }
                });
            });

            // Exibe os dados no formulario
            $scope.$on('iconeDisplayDados', function (e) {
                $scope.icone = {};
                $scope.icone.id = g$.elmSelected.dataset.id;
                $scope.icone.tela = g$.elmSelected.dataset.tela;
                $scope.icone.pai = g$.elmSelected.dataset.pai;
                $scope.icone.ordem = g$.elmSelected.dataset.ordem;
                $scope.icone.tag = g$.elmSelected.dataset.tag;
                $scope.icone.texto = g$.elmSelected.dataset.texto;
                $scope.icone.tamanho = g$.elmSelected.dataset.tamanho;
            });

            // Deletar elemento
            $scope.$on('iconeDel', function (e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.dataset.id;
                g$.exibeQuery("Customizador", query);
                $http.delete(URL + "/delete/" + query);
            });

        }
    };
});

// Seta os dados no atributo
setDadosIcone = function (elm, obj, isNew) {
    elm.dataset.id = obj.id;
    elm.dataset.tela = obj.tela;
    elm.dataset.pai = obj.pai;
    elm.dataset.ordem = obj.ordem;
    elm.dataset.tag = obj.tag;
    elm.dataset.texto = obj.texto;
    elm.dataset.tamanho = obj.tamanho;
    elm.className = "fa " + obj.texto;
    elm.style.fontSize = obj.tamanho + "px";
    if ($("div [data-id='" + elm.dataset.pai + "']")[0].id == "coluna") {
        $("div [data-id='" + elm.dataset.pai + "'] input")[0].style.width = "calc(100% - " + (parseInt(elm.dataset.tamanho) + 6) + "px)";
    }
}