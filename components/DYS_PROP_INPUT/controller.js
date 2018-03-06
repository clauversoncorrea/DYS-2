app.directive("inputprop", function () {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_PROP_INPUT/template.html",
        controller: function ($scope, $http, $compile) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarInput = function (e) {
                if ($("#input input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = JSON.stringify(g$.getValuesCombo("input", $scope.input)),
                    query = "SELECT * FROM elemento WHERE id = " + $scope.input.id;
                post = g$.omitirPropriedade(post);
                g$.montaQuery("Customizador", post, "elemento", false);
                $http.put(URL + "/put/elemento/", post).success(function (data) {
                    if (data.err) return Materialize.toast('Erro ao Alterar', 2000, 'red darken-1');
                    else {
                        g$.exibeQuery("Customizador", query);
                        $http.get(URL + "/get/" + query).success(function (data) {
                            Materialize.toast('Input salvo com sucesso!', 2000, 'green darken-1');
                            setDadosInput(g$.elmSelected, data[0]);
                        });
                    }
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('inputSave', function (e, elm, pai, atualizar) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = pai;
                elm.dataset.tag = "input";
                elm.dataset.tipo = "text";
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
                            Materialize.toast('Input salvo com sucesso!', 2000, 'green darken-1');
                            if (atualizar) $scope.atualizarInput(elm, insertId);
                            else setDadosInput(elm, data[0], true);
                        });
                    }
                });
            });

            // Atualiza o pai do elemento e traz o elemento
            $scope.atualizarInput = function (elm, insertId) {
                var post = JSON.stringify({ id: insertId, pai: elm.parentElement.dataset.id }),
                    query = "SELECT * FROM elemento WHERE id = " + insertId;
                $http.put(URL + "/put/elemento/", post).success(function () {
                    $http.get(URL + "/get/" + query).success(function (data) {
                        setDadosInput(elm, data[0], true);
                    });
                });
            }

            // Exibe os dados no formulario
            $scope.$on('inputDisplayDados', function (e) {
                $scope.input = {};
                $scope.input.id = g$.elmSelected.dataset.id;
                $scope.input.tela = g$.elmSelected.dataset.tela;
                $scope.input.pai = g$.elmSelected.dataset.pai;
                $scope.input.ordem = g$.elmSelected.dataset.ordem;
                $scope.input.tag = g$.elmSelected.dataset.tag;
                $scope.input.tipo = g$.elmSelected.dataset.tipo;

                $scope.input.obrigatorio = (g$.elmSelected.dataset.obrigatorio == "1") ? true : false;
                $scope.input.bloqueado = (g$.elmSelected.dataset.bloqueado == "1") ? true : false;

                var combo = {
                    input_le_da_tabela: g$.elmSelected.dataset.le_da_tabela,
                    input_le_do_campo: g$.elmSelected.dataset.le_do_campo,
                    input_grava_na_tabela: g$.elmSelected.dataset.grava_na_tabela,
                    input_grava_no_campo: g$.elmSelected.dataset.grava_no_campo
                };
                var obj = g$.setValuesCombo("input", combo);

                // Elemento dentro da view vai passar na função para adicionar um evento
                $scope.$broadcast("requeryAcoes", $scope.input.id, "Input");
            });

            // Deletar elemento
            $scope.$on('inputDel', function (e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.dataset.id;
                g$.exibeQuery("Customizador", query);
                $http.delete(URL + "/delete/" + query);
            });
        }
    };
});

// Seta os dados no atributo
setDadosInput = function (elm, obj, isNew) {
    elm.dataset.id = obj.id;
    elm.dataset.tela = obj.tela;
    elm.dataset.pai = obj.pai;
    elm.dataset.ordem = obj.ordem;
    elm.dataset.tag = obj.tag;
    elm.dataset.tipo = obj.tipo;
    elm.dataset.obrigatorio = obj.obrigatorio;
    elm.dataset.bloqueado = obj.bloqueado;

    //Combo
    elm.dataset.le_da_tabela = obj.le_da_tabela;
    elm.dataset.le_do_campo = obj.le_do_campo;
    elm.dataset.grava_na_tabela = obj.grava_na_tabela;
    elm.dataset.grava_no_campo = obj.grava_no_campo;

    // Elemento HTML
    elm.type = obj.tipo;

    if (obj.tipo != "text" && obj.tipo != "date") elm.className = "";
    if (obj.obrigatorio == "1") elm.setAttribute("required", true);
    else elm.removeAttribute("required");
    if (obj.bloqueado == "1") elm.setAttribute("disabled", true);
    else elm.removeAttribute("disabled");
}