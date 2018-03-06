app.directive("tdprop", function () {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_PROP_TD/template.html",
        controller: function ($scope, $http, $rootScope, $compile) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarTD = function (e) {
                if ($("#td input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = g$.getValuesCombo("td", $scope.td),
                    query = "SELECT * FROM elemento WHERE id = " + $scope.td.id;
                delete post.undefined;
                post = g$.omitirPropriedade(post);
                g$.montaQuery("Customizador", post, "elemento", false);
                $http.put(URL + "/put/elemento/", post).success(function (data) {
                    if (data.err) return Materialize.toast('Erro ao Alterar', 2000, 'red darken-1');
                    else {
                        g$.exibeQuery("Customizador", query);
                        $http.get(URL + "/get/" + query).success(function (data) {
                            Materialize.toast('Coluna da tabela salva com sucesso!', 2000, 'green darken-1');
                            setDadosTD(g$.elmSelected, data[0]);
                        });
                    }
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('tdSave', function (e, elm) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = elm.parentElement.parentElement.parentElement.dataset.id;
                elm.dataset.tag = "td";
                elm.dataset.texto = "Texto";
                elm.dataset.formato = null;
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
                            setDadosTD(elm, data[0], null, true);
                        });
                    }
                });
            });

            // Exibe os dados no formulario
            $scope.$on('tdDisplayDados', function (e) {
                $scope.td = {};
                $scope.td.id = g$.elmSelected.dataset.id;
                $scope.td.tela = g$.elmSelected.dataset.tela;
                $scope.td.pai = g$.elmSelected.dataset.pai;
                $scope.td.ordem = g$.elmSelected.dataset.ordem;
                $scope.td.tag = g$.elmSelected.dataset.tag;
                $scope.td.texto = g$.elmSelected.dataset.texto;
                $scope.td.formato = g$.elmSelected.dataset.formato;
                $scope.td.alinhamento = g$.elmSelected.dataset.alinhamento;
                $scope.td.largura = g$.elmSelected.dataset.largura;
                $scope.td.combo_grava_campo = g$.elmSelected.dataset.combo_grava_campo;

                // Elemento que ta ativo para ir na celula

                $scope.td.combo_ativo = (g$.elmSelected.dataset.combo_ativo == "1") ? true : false;
                $scope.td.input_ativo = (g$.elmSelected.dataset.input_ativo == "1") ? true : false;
                $scope.td.intervalo = (g$.elmSelected.dataset.intervalo == "1") ? true : false;
                $scope.td.coluna_check = (g$.elmSelected.dataset.coluna_check == "1") ? true : false;
                $scope.td.obrigatorio = (g$.elmSelected.dataset.obrigatorio == "1") ? true : false;
                $scope.td.cell_tipo = g$.elmSelected.dataset.cell_tipo;

                var combo = {
                    td_le_da_tabela: g$.elmSelected.dataset.le_da_tabela,
                    td_le_do_campo: g$.elmSelected.dataset.le_do_campo,
                    td_grava_na_tabela: g$.elmSelected.dataset.grava_na_tabela,
                    td_grava_no_campo: g$.elmSelected.dataset.grava_no_campo,
                    td_combo_tabela: g$.elmSelected.dataset.td_combo_tabela,
                    td_combo_campo: g$.elmSelected.dataset.td_combo_campo
                };
                var obj = g$.setValuesCombo("td", combo);
            });

            // Deletar elemento
            $scope.$on('tdDel', function (e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.dataset.id;
                g$.exibeQuery("Customizador", query);
                $http.delete(URL + "/delete/" + query);
            });

        }
    };
});

// Seta os dados no atributo
setDadosTD = function (elm, obj, th, isNew) {
    th = (!th) ? $("#view [data-id='" + elm.dataset.pai + "'] thead tr th")[elm.cellIndex] : th;
    elm.dataset.id = obj.id;
    elm.dataset.tela = obj.tela;
    elm.dataset.pai = obj.pai;
    elm.dataset.ordem = obj.ordem;
    elm.dataset.tag = obj.tag;
    elm.dataset.formato = obj.formato;
    elm.dataset.alinhamento = obj.alinhamento;
    elm.dataset.intervalo = obj.intervalo;
    elm.dataset.largura = obj.largura;

    // Elemento que ta ativo para ir na celula
    elm.dataset.combo_ativo = obj.combo_ativo;
    elm.dataset.input_ativo = obj.input_ativo;
    elm.dataset.coluna_check = obj.coluna_check;

    elm.dataset.cell_tipo = obj.cell_tipo;
    elm.dataset.intervalo = obj.intervalo;
    elm.dataset.obrigatorio = obj.obrigatorio;

    //Combo
    elm.dataset.grava_na_tabela = obj.grava_na_tabela;
    elm.dataset.grava_no_campo = obj.grava_no_campo;
    elm.dataset.le_da_tabela = obj.le_da_tabela;
    elm.dataset.le_do_campo = obj.le_do_campo;

    elm.dataset.td_combo_tabela = obj.combo_tabela;
    elm.dataset.td_combo_campo = obj.combo_campo;
    elm.dataset.combo_grava_campo = obj.combo_grava_campo;

    // Elemento no html
    elm.innerHTML = obj.texto;
    elm.dataset.texto = obj.texto;
    elm.style.textAlign = obj.alinhamento;
    th.innerHTML = obj.texto;
    elm.style.minWidth = (obj.largura) ? obj.largura + "px" : "0px";
    th.style.minWidth = (obj.largura) ? obj.largura + "px" : "0px";
}