app.directive("botaoprop", function () {
    return {
        restrict: 'E',
        templateUrl: "components/DYS_PROP_BOTAO/template.html",
        controller: function ($scope, $http, $rootScope) {

            // Alterar o elemento e traz o elemento que foi alterado
            $scope.salvarBotao = function (e) {
                if ($("#botao input:invalid").length > 0) return Materialize.toast('Há campo(s) obrigatório(s) com erro(s)!', 2000, 'red darken-1');
                var post = $scope.botao,
                    query = "SELECT * FROM elemento WHERE id = " + $scope.botao.id;
                post = g$.omitirPropriedade(post);
                g$.montaQuery("Customizador", post, "elemento", false);

                $http.put(URL + "/put/elemento/", post).success(function (data) {
                    if (data.err) return Materialize.toast('Erro ao Alterar', 2000, 'red darken-1');
                    else {
                        g$.exibeQuery("Customizador", query);
                        $http.get(URL + "/get/" + query).success(function (data) {
                            Materialize.toast('Botão salvo com sucesso!', 2000, 'green darken-1');
                            setDadosBotao(g$.elmSelected, data[0]);
                        });
                    }
                });
            };

            // Salva o elemento que foi arrastado
            $scope.$on('botaoSave', function (e, elm) {
                elm.dataset.tela = $scope.getNameTela();
                elm.dataset.pai = elm.parentElement.dataset.id;
                elm.dataset.tag = "botao";
                elm.dataset.texto = "button";
                elm.dataset.menu_id = $scope.getIDMenuItem();
                var post = JSON.stringify(elm.dataset);
                g$.montaQuery("Customizador", post, "elemento", true);
                $http.post(URL + "/post/elemento/", post).success(function (data) {
                    if (data.err) return Materialize.toast('Erro ao Gravar', 2000, 'red darken-1');
                    else {
                        var query = "SELECT * FROM elemento WHERE id = " + data.insertId;
                        g$.exibeQuery("Customizador", query);
                        $http.get(URL + "/get/" + query).success(function (data) {
                            Materialize.toast('Botão salvo com sucesso!', 2000, 'green darken-1');
                            setDadosBotao(elm, data[0], true);
                        });
                    }
                });
            });

        }
    };
});

// Seta os dados no atributo
setDadosBotao = function (elm, obj, isNew) {
    // Colocando os Atributos
    elm.dataset.id = obj.id;

    // Estilo elemento
    elm.querySelector("span").innerHTML = obj.texto;
    elm.style.display = obj.display;
    elm.querySelector("span").style.fontSize = obj.size;
    elm.querySelector("span").style.fontFamily = obj.familia;
    elm.querySelector("span").style.color = obj.cor;

    elm.style.width = obj.largura + "px";
    elm.style.padding = obj.padding;
    elm.style.margin = obj.margin;
    elm.style.background = obj.fundo;
    elm.style.float = obj.flutuar;
    elm.className += " " + obj.classe;
}