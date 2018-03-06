app.directive("colunaprop", function () {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_PROP_COLUNA/template.html",
        controller: function ($scope, $http, $compile) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarColuna = function (e) {
                if ($("#propriedades #coluna input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = g$.getValuesCombo("coluna", $scope.coluna),
                    query = "SELECT * FROM elemento WHERE id = " + $scope.coluna.id;
                post = g$.omitirPropriedade(post);
                g$.montaQuery("Customizador", post, "elemento", false);
                $http.put(URL + "/put/elemento/", post).success(function (data) {
                    if (data.err) return Materialize.toast('Erro ao Alterar', 2000, 'red darken-1');
                    else {
                        g$.exibeQuery("Customizador", query);
                        $http.get(URL + "/get/" + query).success(function (data) {
                            Materialize.toast('Coluna salva com sucesso!', 2000, 'green darken-1');
                            setDadosColuna(g$.elmSelected, data[0], true);
                        });
                    }
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('colunaSave', function (e, elm, pai) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = pai;
                elm.dataset.tag = "coluna";
                elm.dataset.desktop = "l4";
                elm.dataset.tablet = "m4";
                elm.dataset.celular = "s4";
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
                            Materialize.toast('Coluna salva com sucesso!', 2000, 'green darken-1');
                            setDadosColuna(elm, data[0]);
                        });
                    }
                });
            });

            // Exibe os dados no formulario
            $scope.$on('colunaDisplayDados', function (e) {
                $scope.coluna = {};
                $scope.coluna.id = g$.elmSelected.dataset.id;
                $scope.coluna.tela = g$.elmSelected.dataset.tela;
                $scope.coluna.pai = g$.elmSelected.dataset.pai;
                $scope.coluna.ordem = g$.elmSelected.dataset.ordem;
                $scope.coluna.tag = g$.elmSelected.dataset.tag;
                $scope.coluna.nome = g$.elmSelected.dataset.nome;
                $scope.coluna.texto = g$.elmSelected.dataset.texto;
                $scope.coluna.display = g$.elmSelected.dataset.display;
                $scope.coluna.padding = g$.elmSelected.dataset.padding;
                $scope.coluna.margin = g$.elmSelected.dataset.margin;
                $scope.coluna.desktop = g$.elmSelected.dataset.desktop;
                $scope.coluna.tablet = g$.elmSelected.dataset.tablet;
                $scope.coluna.celular = g$.elmSelected.dataset.celular;
                $scope.coluna.classe = g$.elmSelected.dataset.classe;

                var obj = g$.setValuesCombo("coluna", { coluna_consulta_id: g$.elmSelected.dataset.coluna_consulta_id });
            });

            // Deletar elemento
            $scope.$on('colunaDel', function (e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.dataset.id;
                g$.exibeQuery("Customizador", query);
                $http.delete(URL + "/delete/" + query);
            });

            // Altera Pai
            $scope.$on('colunaAlteraPai', function (e, elm, pai) {
                var query = "UPDATE elemento set pai = " + pai + " WHERE id = " + elm.dataset.id,
                    querySelect = "SELECT * FROM elemento WHERE id = " + elm.dataset.id;
                $http.get(URL + "/get/" + query).success(function (data) {
                    $http.get(URL + "/get/" + querySelect).success(function (data) {
                        Materialize.toast('O pai da Coluna foi alterado com sucesso!', 2000, 'green darken-1');
                        setDadosColuna(elm, data[0]);
                    });
                });
            });

        }
    };
});

// Seta os dados no atributo
setDadosColuna = function (elm, obj, isNew) {
    elm.dataset.id = obj.id;
    elm.dataset.tela = obj.tela;
    elm.dataset.pai = obj.pai;
    elm.dataset.ordem = obj.ordem;
    elm.dataset.tag = obj.tag;
    elm.dataset.nome = obj.nome;
    elm.dataset.texto = obj.texto;
    elm.dataset.display = obj.display;
    elm.dataset.padding = obj.padding;
    elm.dataset.margin = obj.margin;
    elm.dataset.desktop = obj.desktop;
    elm.dataset.tablet = obj.tablet;
    elm.dataset.celular = obj.celular;
    elm.dataset.classe = obj.classe;

    elm.dataset.coluna_consulta_id = obj.consulta_id;

    // Elemento HTML
    elm.className = "col " + obj.desktop + " " + obj.tablet + " " + obj.celular + " " + obj.classe;;

    elm.style.display = obj.display;
    elm.style.padding = obj.padding;
    elm.style.margin = obj.margin;
}