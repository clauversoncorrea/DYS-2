app.directive("comboboxprop", function() {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_PROP_COMBOBOX/template.html",
        controller: function($scope, $http, $compile) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarCombobox = function(e) {
                if ($("#combobox input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = JSON.stringify($scope.combobox),
                    query = "SELECT * FROM elemento WHERE id = " + $scope.combobox.id;
                $http.put(URL + "/put/elemento/", post).success(function(data) {
                    $http.get(URL + "/get/" + query).success(function(response) {
                        Materialize.toast('ComboBox salvo com sucesso!', 2000, 'green darken-1');
                        setDadosCombobox(g$.elmSelected.parentElement, response[0], true);
                    });
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('comboboxSave', function(e, elm) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = elm.parentElement.dataset.id;
                elm.dataset.tag = "combobox";
                elm.dataset.combo_campo = undefined;
                elm.dataset.combo_tabela = undefined;
                elm.dataset.menu_id = $scope.getIDMenuItem();
                var post = JSON.stringify(elm.dataset);
                post = g$.omitirPropriedade(post);
                $http.post(URL + "/post/elemento/", post).success(function(response) {
                    var query = "SELECT * FROM elemento WHERE id = " + response.insertId;
                    $http.get(URL + "/get/" + query).success(function(response) {
                        Materialize.toast('ComboBox salvo com sucesso!', 2000, 'green darken-1');
                        setDadosCombobox(elm, response[0]);
                    });
                });
            });

            // Exibe os dados no formulario
            $scope.$on('comboboxDisplayDados', function(e) {
                $scope.combobox = {};
                $scope.combobox.id = g$.elmSelected.parentElement.dataset.id;
                $scope.combobox.tela = g$.elmSelected.parentElement.dataset.tela;
                $scope.combobox.pai = g$.elmSelected.parentElement.dataset.pai;
                $scope.combobox.tag = g$.elmSelected.parentElement.dataset.tag;
                $scope.combobox.combo_campo = g$.elmSelected.parentElement.dataset.comboCampo;
                $scope.combobox.combo_tabela = g$.elmSelected.parentElement.dataset.comboTabela;
            });

            // Deletar elemento
            $scope.$on('comboboxDel', function(e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.dataset.id;
                $http.delete(URL + "/delete/" + query);
                g$.elmSelected.parentElement.innerHTML = "";
            });

            // Seta os dados no atributo
            setDadosCombobox = function(elm, obj, update) {
                elm = (elm.tagName == "COMBO-BOX") ? elm : elm.parentElement;
                elm.dataset.id = obj.id;
                elm.dataset.tela = tela;
                elm.dataset.pai = obj.pai;
                elm.dataset.tag = obj.tag;
                elm.dataset.comboCampo = obj.combo_campo;
                elm.dataset.comboTabela = obj.combo_tabela;
                if (update) {
                    var id = elm.dataset.id, combo;
                    elm.innerHTML = "";
                    combo = $("#view [data-id=" + id + "]")[0];
                    combo = $compile(combo)($scope)[0];
                }
            }

        }
    };
});