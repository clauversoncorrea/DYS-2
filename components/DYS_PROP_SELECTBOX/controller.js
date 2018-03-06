app.directive("selectboxprop", function() {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_PROP_SELECTBOX/template.html",
        controller: function($scope, $http, $compile) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarSelectBox = function(e) {
                if ($("#selectbox input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = g$.getValuesCombo("selectbox", $scope.selectbox),
                    query = "SELECT * FROM elemento WHERE id = " + $scope.selectbox.id;

                delete post.undefined;
                post = g$.omitirPropriedade(post);

                if ($scope.query_ativo) {
                    post.combo_campo = $scope.combo_campo;
                    post.combo_query = (!post.combo_query) ? null : post.combo_query;
                }

                $http.put(URL + "/put/elemento/", post).success(function(data) {
                    // Trata Excecao
                    if(g$.exceptionRequisicao("Customizador", data)) return;;

                    data = data.data;
                    $http.get(URL + "/get/" + query).success(function(response) {
                        // Trata Excecao
                        if(g$.exceptionRequisicao("Customizador", data)) return;;

                        Materialize.toast('SelectBox salva com sucesso!', 2000, 'green darken-1');
                        setDadosSelectBox(g$.elmSelected.parentElement, response.data[0], true);
                    });
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('selectboxSave', function(e, elm) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = elm.parentElement.dataset.id;
                elm.dataset.tag = "selectbox";
                elm.dataset.menu_id = $scope.getIDMenuItem();
                var post = JSON.stringify(elm.dataset);
                post = g$.omitirPropriedade(post);
                $http.post(URL + "/post/elemento/", post).success(function(response) {
                    // Trata Excecao
                    if(g$.exceptionRequisicao("Customizador", data)) return;;

                    response = response.data;
                    var query = "SELECT * FROM elemento WHERE id = " + response.insertId;
                    $http.get(URL + "/get/" + query).success(function(response) {
                        Materialize.toast('SelectBox salva com sucesso!', 2000, 'green darken-1');
                        setDadosSelectBox(elm, response.data[0]);
                    });
                });
            });

            // Exibe os dados no formulario
            $scope.$on('selectboxDisplayDados', function(e) {
                $scope.selectbox = {};
                $scope.selectbox.id = g$.elmSelected.parentElement.dataset.id;
                $scope.selectbox.tela = g$.elmSelected.parentElement.dataset.tela;
                $scope.selectbox.pai = g$.elmSelected.parentElement.dataset.pai;
                $scope.selectbox.tag = g$.elmSelected.parentElement.dataset.tag;
                $scope.selectbox.ordem = g$.elmSelected.parentElement.dataset.ordem;
                $scope.combo_campo = g$.elmSelected.parentElement.dataset.combo_campo;
                $scope.selectbox.combo_grava_campo = g$.elmSelected.parentElement.dataset.comboGravaCampo;
                $scope.selectbox.combo_filtro = g$.elmSelected.parentElement.dataset.comboFiltro;
                $scope.selectbox.combo_query = g$.elmSelected.parentElement.dataset.comboQuery;

                var combo = {
                    selectbox_combo_tabela: g$.elmSelected.parentElement.dataset.selectbox_combo_tabela,
                    selectbox_combo_campo: g$.elmSelected.parentElement.dataset.selectbox_combo_campo,
                    selectbox_le_da_tabela: g$.elmSelected.parentElement.dataset.selectbox_le_da_tabela,
                    selectbox_le_do_campo: g$.elmSelected.parentElement.dataset.selectbox_le_do_campo,
                    selectbox_grava_na_tabela: g$.elmSelected.parentElement.dataset.selectbox_grava_na_tabela,
                    selectbox_grava_no_campo: g$.elmSelected.parentElement.dataset.selectbox_grava_no_campo,
                };
                var obj = g$.setValuesCombo("selectbox", combo);

                if ($scope.selectbox.combo_query != "") {
                    $scope.query_ativo = true;
                    $scope.tabela_ativo = false;
                }
                else {
                    $scope.tabela_ativo = true;
                    $scope.query_ativo = false;
                }

                $scope.selectbox.combo_atualizar = (g$.elmSelected.parentElement.dataset.comboAtualizar == 1) ? true : false;
                $scope.selectbox.combo_id_elemento = g$.elmSelected.parentElement.dataset.comboIdElemento;
                $scope.selectbox.combo_campo_filho = g$.elmSelected.parentElement.dataset.comboCampoFilho;
                // Elemento dentro da view vai passar na função para adicionar um evento
                $scope.$broadcast("requeryAcoes", $scope.selectbox.id, "Select " + $scope.selectbox.id);
            });

            // Deletar elemento
            $scope.$on('selectboxDel', function(e) {
                var query = "DELETE FROM elemento WHERE id = " + g$.elmSelected.parentElement.dataset.id;
                $http.delete(URL + "/delete/" + query).success(function(data) {
                    // Trata Excecao
                    if(g$.exceptionRequisicao("Customizador", data)) return;;
                });
            });

        }
    };
});

// Seta os dados no atributo
setDadosSelectBox = function(elm, obj, update) {
    elm.dataset.id = obj.id;
    elm.dataset.tela = obj.tela;
    elm.dataset.pai = obj.pai;
    elm.dataset.ordem = obj.ordem;
    elm.dataset.tag = obj.tag;
    elm.dataset.comboQuery = (!obj.combo_query) ? "" : obj.combo_query;
    elm.dataset.comboGravaCampo = obj.combo_grava_campo;
    elm.dataset.comboFiltro = obj.combo_filtro;
    elm.dataset.comboAtualizar = obj.combo_atualizar;
    elm.dataset.combo_campo = obj.combo_campo;

    // Combo 
    elm.dataset.selectbox_combo_tabela = obj.combo_tabela;
    elm.dataset.selectbox_combo_campo = obj.combo_campo;
    elm.dataset.selectbox_le_da_tabela = obj.le_da_tabela;
    elm.dataset.selectbox_le_do_campo = obj.le_do_campo;
    elm.dataset.selectbox_grava_na_tabela = obj.grava_na_tabela;
    elm.dataset.selectbox_grava_no_campo = obj.grava_no_campo;

    if (update) {
        var id = elm.dataset.id, select;
        elm.innerHTML = "";
        select = $("#view [data-id=" + id + "]")[0];
        select = $compile(select)($scope)[0];
    }

}