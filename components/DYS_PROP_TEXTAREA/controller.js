app.directive("textareaprop", function () {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_PROP_TEXTAREA/template.html",
        controller: function ($scope, $http, $compile) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarTextarea = function (e) {
                if ($("#textarea input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = JSON.stringify(g$.getValuesCombo("textarea", $scope.textarea)),
                    query = "SELECT * FROM elemento WHERE id = " + $scope.textarea.id;
                post = g$.omitirPropriedade(post);
                g$.montaQuery("Customizador", post, "elemento", false);
                $http.put(URL + "/put/elemento/", post).success(function (data) {
                    if (data.err) return Materialize.toast('Erro ao Alterar', 2000, 'red darken-1');
                    else {
                        g$.exibeQuery("Customizador", query);
                        $http.get(URL + "/get/" + query).success(function (data) {
                            Materialize.toast('Textarea salvo com sucesso!', 2000, 'green darken-1');
                            setDadosTextarea(g$.elmSelected, data[0]);
                        });
                    }
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('textareaSave', function (e, elm, pai) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = pai;
                elm.dataset.tag = "textarea";
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
                            Materialize.toast('Textarea salvo com sucesso!', 2000, 'green darken-1');
                            setDadosTextarea(elm, data[0], true);
                        });
                    }
                });
            });

            // Exibe os dados no formulario
            $scope.$on('textareaDisplayDados', function (e) {
                $scope.textarea = {};
                $scope.textarea.id = g$.elmSelected.dataset.id;
                $scope.textarea.tela = g$.elmSelected.dataset.tela;
                $scope.textarea.pai = g$.elmSelected.dataset.pai;
                $scope.textarea.ordem = g$.elmSelected.dataset.ordem;
                $scope.textarea.tag = g$.elmSelected.dataset.tag;

                $scope.textarea.obrigatorio = (g$.elmSelected.dataset.obrigatorio == "1") ? true : false;
                $scope.textarea.bloqueado = (g$.elmSelected.dataset.bloqueado == "1") ? true : false;

                var combo = {
                    textarea_le_da_tabela: g$.elmSelected.dataset.le_da_tabela,
                    textarea_le_do_campo: g$.elmSelected.dataset.le_do_campo,
                    textarea_grava_na_tabela: g$.elmSelected.dataset.grava_na_tabela,
                    textarea_grava_no_campo: g$.elmSelected.dataset.grava_no_campo
                };
                var obj = g$.setValuesCombo("textarea", combo);

                // Elemento dentro da view vai passar na função para adicionar um evento
                $scope.$broadcast("requeryAcoes", $scope.textarea.id, "TEXTAREA");
            });

            // Deletar elemento
            $scope.$on('textareaDel', function (e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.dataset.id;
                g$.exibeQuery("Customizador", query);
                $http.delete(URL + "/delete/" + query);
            });

        }
    };
});

// Seta os dados no atributo
setDadosTextarea = function (elm, obj, isNew) {
    elm.dataset.id = obj.id;
    elm.dataset.tela = obj.tela;
    elm.dataset.pai = obj.pai;
    elm.dataset.ordem = obj.ordem;
    elm.dataset.tag = obj.tag;
    elm.dataset.obrigatorio = obj.obrigatorio;
    elm.dataset.bloqueado = obj.bloqueado;

    //Combo
    elm.dataset.le_da_tabela = obj.le_da_tabela;
    elm.dataset.le_do_campo = obj.le_do_campo;
    elm.dataset.grava_na_tabela = obj.grava_na_tabela;
    elm.dataset.grava_no_campo = obj.grava_no_campo;

    // Elemento HTML
    if (obj.obrigatorio == "1") elm.setAttribute("required", true);
    else elm.removeAttribute("required");
    if (obj.bloqueado == "1") elm.setAttribute("disabled", true);
    else elm.removeAttribute("disabled");

}