app.directive("labelprop", function () {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_PROP_LABEL/template.html",
        controller: function ($scope, $http, $compile) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarLabel = function (e) {
                var query = "SELECT * FROM elemento where id = " + $scope.label.id;
                if ($("#label input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = g$.getValuesCombo("label", $scope.label);
                post = g$.omitirPropriedade(post);
                g$.montaQuery("Customizador", post, "elemento", false);
                $http.put(URL + "/put/elemento/", post).success(function (data) {
                    if (data.err) return Materialize.toast('Erro ao Alterar', 2000, 'red darken-1');
                    else {
                        g$.exibeQuery("Customizador", query);
                        $http.get(URL + "/get/" + query).success(function (data) {
                            Materialize.toast('Label salvo com sucesso!', 2000, 'green darken-1');
                            setDadosLabel(g$.elmSelected, data[0]);
                        });
                    }
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('labelSave', function (e, elm, pai, atualizar) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = pai;
                elm.dataset.tag = "label";
                elm.dataset.texto = "label";
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
                            Materialize.toast('Label salvo com sucesso!', 2000, 'green darken-1');
                            if (atualizar) $scope.atualizarLabel(elm, insertId);
                            else setDadosLabel(elm, data[0], true);
                        });
                    }
                });
            });

            // Atualiza o pai do elemento e traz o elemento
            $scope.atualizarLabel = function (elm, insertId) {
                var post = JSON.stringify({ id: insertId, pai: elm.parentElement.dataset.id }),
                    query = "SELECT * FROM elemento where id = " + insertId;
                $http.put(URL + "/put/elemento/", post).success(function () {
                    $http.get(URL + "/get/" + query).success(function (data) {
                        Materialize.toast('Label salvo com sucesso!', 2000, 'green darken-1');
                        setDadosLabel(elm, data[0], true);
                    });
                });
            }

            // Exibe os dados no formulario
            $scope.$on('labelDisplayDados', function (e) {
                $scope.label = {};
                $scope.label.id = g$.elmSelected.dataset.id;
                $scope.label.tela = g$.elmSelected.dataset.tela;
                $scope.label.pai = g$.elmSelected.dataset.pai;
                $scope.label.ordem = g$.elmSelected.dataset.ordem;
                $scope.label.tag = g$.elmSelected.dataset.tag;
                $scope.label.texto = g$.elmSelected.dataset.texto;
                $scope.label.alinhamento = g$.elmSelected.dataset.alinhamento;
                $scope.label.display = g$.elmSelected.dataset.display;
                $scope.label.size = g$.elmSelected.dataset.size;
                $scope.label.familia = g$.elmSelected.dataset.familia;
                $scope.label.cor = g$.elmSelected.dataset.cor;
                $scope.label.padding = g$.elmSelected.dataset.padding;
                $scope.label.margin = g$.elmSelected.dataset.margin;
                $scope.label.fundo = g$.elmSelected.dataset.fundo;
                $scope.label.borda_size = g$.elmSelected.dataset.borda_size;
                $scope.label.borda_tipo = g$.elmSelected.dataset.borda_tipo;
                $scope.label.borda_cor = g$.elmSelected.dataset.borda_cor;
                $scope.label.borda_arredondada = g$.elmSelected.dataset.borda_arredondada;

                $scope.label.borderBottom = (g$.elmSelected.dataset.borderBottom == "1") ? true : false;
                $scope.label.borderTop = (g$.elmSelected.dataset.borderTop == "1") ? true : false;
                $scope.label.borderLeft = (g$.elmSelected.dataset.borderLeft == "1") ? true : false;
                $scope.label.borderRight = (g$.elmSelected.dataset.borderRight == "1") ? true : false;

                var combo = {
                    label_le_da_tabela: g$.elmSelected.dataset.le_da_tabela,
                    label_le_do_campo: g$.elmSelected.dataset.le_do_campo
                };
                var obj = g$.setValuesCombo("label", combo);

                // Elemento dentro da view vai passar na função para adicionar um evento
                $scope.$broadcast("requeryAcoes", $scope.label.id, "LABEL " + $scope.label.texto);
            });

            // Deletar elemento
            $scope.$on('labelDel', function (e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.dataset.id;
                g$.exibeQuery("Customizador", query);
                $http.delete(URL + "/delete/" + query);
            });

        }
    };
});