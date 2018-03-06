app.controller('customizador', function ($scope, $compile, $http) {

    dragStart = function (e) {
        var elm = event.target;
        if (elm.dataset.id && parseInt(elm.dataset.id)) {
            event.dataTransfer.setData("template", elm.outerHTML);
            event.dataTransfer.setData("isNewElm", false);
        }
        else {
            event.dataTransfer.setData("template", $.templateCustomizador[0][elm.dataset.template]);
            event.dataTransfer.setData("isNewElm", true);
        }
    }

    dragOver = function (e) {
        event.preventDefault();
    }

    dragDrop = function (e) {
        event.preventDefault();
        var elm = event.target,
            template = angular.element(event.dataTransfer.getData("template"))[0],
            isNewElm = event.dataTransfer.getData("isNewElm"),
            isBody = elm.classList.contains("card-content");

        // Se ele for um elemento novo no body
        if (isNewElm == "true") {
            if ($scope.getIDMenuItem()) {
                // Se colocar um elemento que nao seja linha no container pai, ele retorna;
                if (isBody && !template.classList.contains("row")) return alert("No container pai só pode colocar linha!!");
                // Se colocar um elemento que nao seja linha no container pai, ele retorna;
                else if (elm.classList.contains("row") && !template.classList.contains("col")) {
                    event.stopPropagation();
                    return alert("Na linha só pode colocar coluna!!");
                }
                // Se colocar um elemento que nao seja linha no container pai, ele retorna;
                // else if (elm.classList.contains("col") && (template.classList.contains("row") || template.classList.contains("col"))) {
                // 	event.stopPropagation();
                // 	return alert("Na coluna só naõ pode colocar linha ou coluna!!");
                // }
                template = $compile(template)($scope)[0];

                elm = (elm.id == "input") ? elm.parentElement : elm;

                // Consistência se o elmento for Icone só pode colocar no botão ou na frente do input
                if (template.id == "icone") {
                    if (elm.id == "coluna") {
                        if ($("div [data-id=" + elm.dataset.id + "] input")[0])
                            $("div [data-id=" + elm.dataset.id + "] input")[0].style.width = "calc(100% - 26px)";
                        elm.appendChild(template);
                    }
                    else if (elm.id == "botao") {
                        elm = (elm.tagName == "SPAN") ? elm.parentElement : elm;
                        elm.insertBefore(template, elm.firstChild);
                    }
                    salvarElemento(template, template.id);
                }
                else if (template.id == "td") {
                    elm = elm.querySelector("thead tr");
                    elm.appendChild(template);
                    salvarElemento(template, template.id);
                }
                else {
                    elm.appendChild(template);
                    salvarElemento(template, template.id);
                }

                // Salva os elementos filho
                // if (template.dataset.id == "ltb") {
                // 	for (var i = 0; i < 2; i++) {
                // 		name_funcao = template.children[i].id + "Save";
                // 		$scope.$parent.$parent.$broadcast(name_funcao, template.children[i], null, true);
                // 	}
                // }

                // $("#view-visibility")[0].className = $("#view-delete")[0].className = "material-icons";
                // $("#view .card-content")[0].classList.remove("modo-del"); // Remove modo Delete se estiver ativo
            }
            // else alert("Selecione uma Tela para customizar");
        }
        // Se ele for um elemento que ja esta no body
        // else {
            // if (template.id == "coluna") {
            // Verifica se ele esta arrastando para a linha
            // if (elm.id != "linha") {
            // event.stopPropagation();
            // for (var i = 0; i < 80; i++) {
            //     if(i == 0) alert("VOCE É BURRO CARA");
            //     else if (i == 1) alert("COMO PODE SER TÃO BURRO ASSIM? ISSO NÃO SE FAZ");
            //     else alert("PODE PEGAR SUA CARTEIRA E IR PRA SALA DE REUNIAO");
            // }
            // }
            // name_funcao = template.id + "AlteraPai";
            // $scope.$parent.$parent.$broadcast(name_funcao, template, elm.dataset.id);
            // template = $compile(template)($scope)[0];
            // $("#view [data-id=" + template.dataset.pai + "]")[0].removeChild($("#view [data-id=" + template.dataset.id + "]")[0]);
            // elm.appendChild(template);
            // event.stopPropagation();
            // }
        // }
        event.stopPropagation();
    }

    // Salvar elemento no banco
    function salvarElemento(elm, tag) {
        elm.dataset.tela = $scope.getNameTela();
        elm.dataset.pai = elm.parentElement.dataset.id || 0;
        elm.dataset.tag = tag;
        elm.dataset.menu_id = $scope.getIDMenuItem();
        elm.dataset.tela = $scope.getNameTela();
        if (tag == "label") elm.dataset.texto = "label";
        else if (tag == "marquee") elm.dataset.texto = "marquee marquee marquee";
        else if (tag == "video") elm.dataset.tamanho = 400;
        else if (tag == "botao") elm.dataset.texto = "button";
        else if (tag == "coluna") {
            elm.dataset.desktop = "l4";
            elm.dataset.tablet = "m4";
            elm.dataset.celular = "s4";
        }
        else if (tag == "icone") {
            elm.dataset.tag = "icone";
            elm.dataset.texto = "fa-share-square-o";
            elm.dataset.tamanho = "20";
        }
        else if (tag == "input") {
            elm.dataset.tag = "input";
            elm.dataset.tipo = "text";
        }
        else if (tag == "tab") {
            elm.dataset.texto = "Texto";
        }
        else if (tag == "td") {
            elm.dataset.texto = "Texto";
            elm.dataset.pai = elm.parentElement.parentElement.parentElement.dataset.id;
        }

        var post = JSON.stringify(elm.dataset);
        post = g$.omitirPropriedade(post);
        $http.post(URL + "/post/elemento/", post).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Customizador", data)) return;;

            data = data.data;
            var query = "SELECT * FROM elemento WHERE id = " + data.insertId;
            elm.setAttribute("title", data.insertId + " - " + elm.dataset.tag);
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                // Trata Excecao
                if (g$.exceptionRequisicao("Customizador", data)) return;;

                Materialize.toast('Elemento salvo com sucesso!', 2000, 'green darken-1');
                setDadosView(elm, data.data[0], null, (data.data.tag == "selectbox"));
            });

        });
    }

    // show View 100% x 100%
    preview = function (e) {
        var elm = event.target;
        if (elm.classList.contains("disabled")) { return event.preventDefault() };
        $("#view-overscan")[0].classList.toggle("active");
        $("#view")[0].classList.toggle("preview");
        if ($("#view-overscan")[0].classList.contains("active")) {
            $("#view .card-content")[0].classList.add("no-borderelms");
            $("#view .card-content")[0].classList.remove("modo-del");
            $("#view-visibility")[0].innerHTML = "visibility-off";
            $("#view-visibility")[0].className = $("#view-delete")[0].className = "material-icons";
        }
        else {
            $("#view .card-content")[0].classList.remove("no-borderelms");
            $("#view-visibility")[0].innerHTML = "visibility";
            $("#view-visibility")[0].className = "material-icons active";
        }
    }

    // Customizador Propriedade - Ativa as propriedades do elemento cliclado
    customProp = function (elm) {
        var elm = (elm == undefined) ? event.target : elm;
        elm = (elm.tagName == "LI") ? elm.children[0] : elm;

        $("#controle #propriedades [data-prop_id='" + event.target.dataset.id + "']")[0].focus();
        // Seleciona a linha do display e deixa o check true
        selecionarLinhaProp(true);


        if (elm.tagName == "TD" && elm.classList.contains("cell-combo")) return;
        if (elm.dataset.elemento == "check-table") return;
        if (elm.children[0] && elm.children[0].dataset.elemento == "check-table") return;
        $("#propriedades").children().removeClass("play-block");
        $("#propriedades").children().addClass("play-none");
        $("#propriedades #" + elm.id).addClass("play-block");
    };

    // Consistência para remover e adicionar borda de todos os elementos que estão na View
    showBorder = function (e) {
        var elm = event.target.parentElement;
        $("#view")[0].classList.toggle("no-borderelms");
        if (elm.querySelector(".fa").className == "fa fa-toggle-on") {
            elm.querySelector(".fa").className = "fa fa-toggle-off";
            elm.querySelector("label").innerHTML = "S/ Borda";
        }
        else {
            elm.querySelector(".fa").className = "fa fa-toggle-on";
            elm.querySelector("label").innerHTML = "C/ Borda";
        }
    }

});