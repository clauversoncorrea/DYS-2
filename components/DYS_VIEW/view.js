app.directive("view", function () {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_VIEW/view.html",
        controller: function ($scope, $http, $compile, $rootScope, $timeout) {

            g$.criaTela = function (nome, tela, idModal, isModal, closeMenu, tamanho, pesquisa) {
                if (tela) {
                    g$.controllerTela = "app.controller('" + nome.split(" ").join("") + tela + "', function ($scope){ g$.configTela('" + nome + "');";

                    if (!$("#loadzinTelam")[0]) {
                        loadzinTela = angular.element($.template[0]["loadzinTela"])[0];
                        document.body.append(loadzinTela);
                        $("#loadzinTela")[0].id = "loadzinTelam";
                    }
                }
                var query, popup, queryEventosElm, elm = event.target, modal;

                if (!tela) return;
                else if (nome.indexOf("|") > -1) {
                    tela = parseInt(nome.split('|')[2].trim());
                    nome = nome.split('|')[1].trim();
                }

                if (!closeMenu) {
                    // Quando criar a tela, vai fechar o Menu
                    if (!document.body.classList.contains("sidebar-collapse")) {
                        $("#menutelas").click();
                        controlWidthView(this, $('#menutelas')[0]);
                    }
                }

                g$.tela_id = tela;
                g$.arrayTelas.push(tela);
                query = g$.queryMontaTela(tela);

                popup = $scope.montaPopup(nome, tela, isModal);

                g$.controllerModal = "app.directive('modal" + nome.split(" ").join("").toLowerCase() + tela + "', function () {return {restrict: 'E',templateUrl: '../modals/modal" + nome.split(" ").join("") + tela + ".html', scope: {}, controller: function ($scope, $element, $http, $compile, $rootScope) {g$.configTela('" + nome + "');";
                g$.funcoesModal = "";
                if (isModal == true || isModal == "true") {
                    g$.isModal = 1;
                    modal = angular.element("<div class='tela-modal open'>")[0];
                    modal.appendChild(popup);

                    modal.id = idModal;

                    if ($("#menu" + tela)[0] && $("#menu" + tela)[0].children[0].dataset.popup == "pop-3") popup.classList.add("pop-3");
                    else popup.classList.add("pop-2");
                    popup.classList.remove("col", "s12");
                    popup.style.borderRadius = "4px";
                    popup.querySelector(".fa-close").removeAttribute("onclick");
                    popup.querySelector(".fa-close").setAttribute("onclick", "g$.closeModalView('" + modal.id + "')")

                    if (tamanho && $rootScope.user.customiza == "0") {
                        if (tamanho.indexOf("fullscreen") > -1) {
                            popup.classList.add("fullscreen");
                            popup.parentElement.classList.add("fullscreen");
                        }
                        if (tamanho.trim() == "fullscreen_full") {
                            popup.querySelector(".card-header").classList.add("play-none");
                        }
                    }

                    $("#view")[0].appendChild(modal);
                }
                else {
                    g$.isModal = 0;
                    if ($("#view .popup")[0]) $("#view")[0].removeChild($("#view .popup")[0]);
                    popup.classList.add((event.target.dataset && event.target.dataset.popup) ? event.target.dataset.popup : "pop-2");

                    // Limpa todos os filtros do bloco dentro do scope e depois apaga no localStorage
                    if (localStorage.filtro_bloco) {
                        JSON.parse(localStorage.filtro_bloco).forEach(function (v) {
                            $scope.$parent[v] = "";
                        });
                    }

                    delete localStorage.filtro_bloco;
                    if (!localStorage.filtro_bloco) localStorage.filtro_bloco = JSON.stringify([]);

                    // Consistencia se o popup for fullscreen
                    if ($("#menu" + tela)[0] && $("#menu" + tela)[0].dataset.fullscreen == "1" && $rootScope.user.customiza == "0") {
                        popup.querySelector(".card-header").classList.add("play-none");
                        $("#view")[0].style.width = "100%";
                        $("#view")[0].classList.add("fullscreen");
                    }
                    else $("#view")[0].classList.remove("fullscreen");

                    if (pesquisa) {
                        popup.classList.add("fullscreen");
                        $("#view")[0].classList.add("fullscreen");
                        popup.querySelector(".card-header").removeChild(popup.querySelector(".card-icone"));
                    }

                    $("#view")[0].insertBefore(popup, $("#view")[0].firstChild);
                    $("#container-menu")[0].style.display = "none";
                }

                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Monta Tela", data)) return;

                    if (data.data.length == 0) {
                        $("#loadzinTelam")[0].outerHTML = "";
                    }

                    data.data.forEach(function (obj, i) {
                        if (obj.tag == "linha") $scope.montaLinha(nome, obj);
                        else if (obj.tag == "coluna") $scope.montaColuna(nome, obj);
                        else if (obj.tag == "label") $scope.montaLabel(nome, obj);
                        else if (obj.tag == "marquee") $scope.montaMarquee(nome, obj);
                        else if (obj.tag == "video") $scope.montaVideo(nome, obj);
                        else if (obj.tag == "input") $scope.montaInput(nome, obj);
                        else if (obj.tag == "textarea") $scope.montaTextarea(nome, obj);
                        else if (obj.tag == "icone") $scope.montaIcone(nome, obj);
                        else if (obj.tag == "botao") $scope.montaBotao(nome, obj);
                        else if (obj.tag == "combobox") $scope.montaCombobox(nome, obj);
                        else if (obj.tag == "tabela") $scope.montaTabela(nome, obj);
                        else if (obj.tag == "td") $scope.montaTD(nome, obj);
                        else if (obj.tag == "selectbox") $scope.montaSelectBox(nome, obj);
                        else if (obj.tag == "tabs") $scope.montaTabs(nome, obj);
                        else if (obj.tag == "tab") $scope.montaTab(nome, obj);
                        else if (obj.tag == "link") $scope.montaLink(nome, obj);
                        else if (obj.tag == "imagem") $scope.montaImagem(nome, obj);
                        else if (obj.tag == "grafico") $scope.montaGrafico(nome, obj);
                        else if (obj.tag == "graficoTorre") $scope.montaGraficoTorre(nome, obj);
                    });

                    // Guarda as consuntas e os filtros em um Array
                    $scope.addEventosPopup(tela, isModal);
                    // $scope.consultas_filtros(tela);

                    if ($rootScope.user.customiza == "1") $(".barra-fixa").addClass("barra-fixa-customize");
                    else $(".barra-fixa").addClass("barra-fixa-notcustomize");

                    // addEventosElm
                    loadzinTela = angular.element($.template[0]["loadzinTela"])[0];
                    // document.body.append(loadzinTela);
                    // $("#loadzinTela")[0].id = "loadzinTelaf"
                    queryEventosElm = "SELECT e.nome, ef.*, e.menu_id FROM elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and " +
                        "e.menu_id = " + tela + " and coalesce(evento_bloco, '0') <> '1' and coalesce(evento_check, '0') <> '1' and coalesce(evento_tabela, '0') <> '1' and isnull(ef.depois) ORDER BY ef.ordem;";
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryEventosElm.trim())).success(function (data) {
                        // Trata Excecao
                        if (g$.exceptionRequisicao("Eventos elementos", data)) return;;

                        $scope.addEventos(data.data, isModal);
                    });

                    //Inicia todas as abas do materializeCSS que estao no Popup
                    $('ul.tabs').tabs();

                    // $('.date-bootstrap').datepicker({
                    //     orientation: "auto left",
                    //     format: "dd/mm/yyyy",
                    //     language: "pt-BR"
                    // });

                    //$("#loadzinTelam")[0].outerHTML = "";
                    event.stopPropagation();
                    return event.preventDefault();
                });
            };

            $scope.montaPopup = function (nome, tela) {
                var template;
                if ($rootScope.user.customiza == 1) template = angular.element($.templateCustomizador[0]["popup"])[0];
                else template = angular.element($.template[0]["popup"])[0];
                template.dataset.nome = nome;
                template.dataset.tela = tela;
                template.id = tela;
                template.querySelector(".card-title").textContent = nome;
                template = $compile(template)($scope)[0];
                return template;
            }

            $scope.consultas_filtros = function (tela) {
                var query = "select c.id, f.id as id_filtro, f.filtro from consulta c LEFT JOIN consulta_filtro f ON c.id = f.consulta_id where c.tela_id = " + tela;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Tela", data)) return;;

                    $rootScope.consultas_filtros = data.data;
                    // Carrega os eventos loads da tela
                    $scope.addEventosPopup(tela);
                });
            }

            $scope.montaLinha = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["linha"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["linha"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if (obj.pai == "0") $("[data-nome='" + tela + "'] .card-content")[0].appendChild(template);
                else $("[data-nome='" + tela + "'] .card-content [data-id='" + obj.pai + "']")[1].appendChild(template);
            };

            $scope.montaColuna = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["coluna"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["coluna"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
            };

            $scope.montaLabel = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["label"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["label"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do LABEL ID: " + obj.id);
            }

            $scope.montaMarquee = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["marquee"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["marquee"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do Marquee ID: " + obj.id);
            }

            $scope.montaVideo = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["video"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["video"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do Video ID: " + obj.id);
                // inicia o elemento
                $('[data-id="' + obj.id + '"]').mediaelementplayer({
                    hls: {
                        debug: true
                    },

                    success: function (media, node, instance) {
                        
                        // para dar o play
                        // media.play()

                        // o evento de quando acabou o video|
                        media.addEventListener("ended", function () {
                            console.log('acabou!');
                        });

                        // o evento de quando der play no video
                        media.addEventListener("play", function () {
                            console.log('play');
                        });

                        media.addEventListener("pause", function (event, data) {
                            // All the code when this event is reached...
                            console.log("pausada");
                        });

                        media.addEventListener("paused", function (event, data) {
                            // All the code when this event is reached...
                            console.log("pausada");
                        });
                    }
                });
            }

            $scope.montaInput = function (tela, obj) {
                var template;
                // eventoFile = ($rootScope.user.customiza == 1) ? "onclick='displayDadosProp('" + obj.id + "')'" : "";
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["input"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["input"])[0];
                setDadosView(template, obj, false);
                if (obj.tipo == "checkbox" && (obj.nome && obj.nome.trim() != "") && (obj.texto && obj.texto.trim() != "")) {
                    if ($rootScope.user.customiza == 1) template = angular.element($.templateCustomizador[0]["checkMaterialize"])[0];
                    else template = angular.element($.template[0]["checkMaterialize"])[0];
                    if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                        $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                    }
                    else g$.exibeQuery("Erro", "Não encontrou o pai do INPUT ID: " + obj.id);
                    setDadosView(template.querySelector("input"), obj, false);
                    template.querySelector("input").className += " " + obj.classe;
                    template.querySelector("input").id = obj.nome + obj.id;
                    template.querySelector("label").setAttribute("for", obj.nome + obj.id);
                    template.querySelector("label").innerHTML = obj.texto;
                    template.querySelector("label").dataset.id = obj.id;
                }
                else {
                    if (obj.tipo == "file" && obj.nome && obj.nome.indexOf("importar_excel") > -1) {
                        template.classList.add("file-path");
                        template.setAttribute("onchange", "g$.importExcel()");
                        template = "<div class='file-field'> <div class='btn' style='background: #4CAF50;' data-tipo='file' data-id = " + obj.id + "> <i class='fa fa-file-excel-o no-margin'></i> <input type='file' data-id = " + obj.id + "> </div>" +
                            "<div class='file-path-wrapper'> " + template.outerHTML + "</div> </div>";
                        template = angular.element(template)[0];
                        template.dataset.nome = obj.nome;
                    }
                    else if (obj.tipo == "file") {
                        template.classList.add("file-path");
                        template.setAttribute("onchange", "g$.uploadFile()");
                        template = "<div class='file-field'> <div class='btn' data-tipo='file' data-id = " + obj.id + "> <i class='fa fa-search no-margin'></i> <input type='file' data-id = " + obj.id + "> </div>" +
                            "<div class='file-path-wrapper'> " + template.outerHTML + "</div> </div>";
                        template = angular.element(template)[0];
                    }
                    if (obj.tipo == "date") {
                        template.type = "date";
                        template.className = "form-control";
                        if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                            $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].innerHTML += template.outerHTML;
                        }
                        else g$.exibeQuery("Erro", "Não encontrou o pai do INPUT ID: " + obj.id);
                    }
                    else
                        if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                            $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                        }
                        else g$.exibeQuery("Erro", "Não encontrou o pai do INPUT ID: " + obj.id);
                }

                // Se o campo tiver mascara 
                if (obj.tipo == "email") {
                    if (obj.obrigatorio == "0")
                        return $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaEmail, false);
                } if (obj.tipo == "date") {
                    return $("[data-id='" + obj.id + "']")[0].addEventListener("keyup", g$.validaData, false);
                }
                else if (obj.formato == "Peso") {
                    return $("[data-id='" + obj.id + "']")[0].addEventListener("keyup", g$.formataPeso, false);
                }
                else if (obj.formato == "Telefone DDD") {
                    if (obj.obrigatorio == "0")
                        $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 14 | 0', false), false);
                    else $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 14 | 1', false), false);
                }
                else if (obj.formato == "Telefone") {
                    if (obj.obrigatorio == "0")
                        $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 9 | 0', false), false);
                    else $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 9 | 1', false), false);
                }
                else if (obj.formato == "Cep") {
                    if (obj.obrigatorio == "0")
                        $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaCep, false);
                    else $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaCep, false);
                }
                else if (obj.formato == "Celular DDD") {
                    if (obj.obrigatorio == "0")
                        $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 15 | 0', false), false);
                    else $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 15 | 1', false), false);
                }
                else if (obj.formato == "Celular") {
                    if (obj.obrigatorio == "0")
                        $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 10 | 0', false), false);
                    else $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaTel.bind(null, 'validaTel | 0 ¦ 10 | 1', false), false);
                }
                else if (obj.formato == "Money") {
                    $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
                }
                else if (obj.formato == "R$ Money") {
                    $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
                }
                else if (obj.formato == "PA") {
                    $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', suffix: 'mmHg', precision: 0, allowNegative: true, thousands: '', decimal: '', affixesStay: false });
                }
                else if (obj.formato == "FC") {
                    $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', suffix: 'bpm', precision: 0, allowNegative: true, thousands: '', decimal: '', affixesStay: false });
                }
                else if (obj.formato == "Glicemia") {
                    $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', suffix: 'mg/dl', precision: 0, allowNegative: true, thousands: '', decimal: '', affixesStay: false });
                }
                else if (obj.formato == "Temperatura") {
                    $("[data-id='" + obj.id + "']").maskMoney({ prefix: '', suffix: '°C', precision: 0, allowNegative: true, thousands: '', decimal: ',', affixesStay: false });
                }
                else if (obj.formato == "CPF") {
                    $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaCPF.bind(null, "validaCPF | »" + obj.id + "» | " + obj.id, false), false);
                }
                else if (obj.formato == "CNS") {
                    $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaCNS.bind(null, "validaCNS | »" + obj.id + "» | " + obj.id, false), false);
                }
                else if (obj.formato == "CNPJ") {
                    $("[data-id='" + obj.id + "']")[0].addEventListener("blur", g$.validaCNPJ.bind(null, "validaCNPJ | »" + obj.id + "» | " + obj.id, false), false);
                }

                // Validacao se for tipo number e maxlength
                if (obj.tipo == "number" && obj.max_length != "") {
                    $("[data-id='" + obj.id + "']")[0].addEventListener("keydown", g$.validaTamanho.bind(null, obj.max_length, false), false);
                }

                // $("[data-id='" + obj.id + "']")[0].addEventListener("keydown", g$.nextElemento, false);

                // Colocando o formato da mascara
                if (obj.mask && obj.mask != "") {
                    if (obj.mask.toLowerCase().indexOf("i") == -1) {
                        $("[data-id='" + obj.id + "']").mask(obj.mask);
                    }
                    else {
                        $("[data-id='" + obj.id + "']").mask(obj.mask.replace("i", ""), { reverse: true });
                    }
                }

                // Colocando o formato da mascara
                if (obj.formato && obj.formato != "" && $("[data-id='" + obj.id + "']")[0].dataset.tipo != "") {
                    if (g$.array_formato.indexOf(obj.formato) == -1) $("[data-id='" + obj.id + "']").mask(g$.formato[0][obj.formato]);
                }

                // $("[data-id='" + obj.id + "']")[0].setAttribute("tabindex", obj.ordem);
            }

            $scope.montaTextarea = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["textarea"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["textarea"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do TEXTAREA ID: " + obj.id);
            }

            $scope.montaIcone = function (tela, obj) {
                var template,
                    pai = $("[data-nome='" + tela + "'] .card-content [data-id='" + obj.pai + "']")[0];
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["icone"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["icone"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if (pai) {
                    if (pai.id == "coluna") pai.appendChild(template);
                    else if (pai.id == "botao") pai.insertBefore(template, pai.firstChild);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do ICONE ID: " + obj.id);
            }

            $scope.montaBotao = function (tela, obj) {
                var template,
                    pai = $("[data-nome='" + tela + "'] .card-content [data-id='" + obj.pai + "']")[0];
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["botao"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["botao"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if (pai) {
                    if (pai.id == "td") template.setAttribute("onclick", "selecionarCelula();")
                    pai.appendChild(template);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do BOTAO ID: " + obj.id);
            }

            $scope.montaTabela = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["tabela"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag + " - " + obj.nome);
                }
                else template = angular.element($.template[0]["tabela"])[0];
                setDadosView(template, obj, false);
                if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do TABELA ID: " + obj.id);
            }

            $scope.montaTD = function (tela, obj) {
                var th = angular.element($.template[0]["th"])[0],
                    td;
                if ($rootScope.user.customiza == 1) {
                    td = angular.element($.templateCustomizador[0]["td"])[0];
                    td.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else td = angular.element($.template[0]["td"])[0];
                setDadosView(td, obj, th, false);
                // td = $compile(td)($scope)[0];
                if ($("[data-nome='" + tela + "'] .card-content [data-id='" + obj.pai + "']")[0]) {
                    // if (td.dataset.display && td.dataset.display.trim() != "none") {
                    $("[data-nome='" + tela + "'] .card-content [data-id='" + obj.pai + "'] thead tr")[0].appendChild(th);
                    $("[data-nome='" + tela + "'] .card-content [data-id='" + obj.pai + "'] tbody tr")[0].appendChild(td);
                    th.style.minWidth = th.offsetWidth + 10 + "px";
                    td.style.minWidth = td.offsetWidth + 10 + "px";
                    // }
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do TD ID: " + obj.id);

            }

            $scope.montaSelectBox = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["selectbox"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["selectbox"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do COMBOBOX ID: " + obj.id);
            }

            $scope.montaTabs = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["tabs"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["tabs"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do TABS ID: " + obj.id);
            }

            $scope.montaTab = function (tela, obj) {
                var template, corpoTab;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["tab"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["tab"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                corpoTab = angular.element($.template[0]["corpoTab"])[0];
                corpoTab.classList.add("corpoTab");
                if (!g$.user.sysCli) corpoTab.id = "aba" + template.dataset.id;
                corpoTab.dataset.id = template.dataset.id;
                if ($("[data-nome='" + tela + "'] .card-content ul[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content ul[data-id='" + obj.pai + "']")[0].appendChild(template);
                    $("[data-nome='" + tela + "'] .card-content ul[data-id='" + obj.pai + "']")[0].parentElement.parentElement.appendChild(corpoTab);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do TAB ID: " + obj.id);
            }

            $scope.montaLink = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["link"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["link"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do LINK ID: " + obj.id);
            }

            $scope.montaImagem = function (tela, obj) {
                var template;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["imagem"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["imagem"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do IMAGEM ID: " + obj.id);
            }

            $scope.montaGrafico = function (tela, obj) {
                var template, legend;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["grafico"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["grafico"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                template.dataset.template = template.outerHTML;
                legend = angular.element("<div id='legend-" + obj.id + "' class='chart-legend'></div>")[0];
                if ($("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0]) {
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
                    $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(legend);
                }
                else g$.exibeQuery("Erro", "Não encontrou o pai do IMAGEM ID: " + obj.id);
            }

            $scope.montaGraficoTorre = function (tela, obj) {
                var template, legend;
                if ($rootScope.user.customiza == 1) {
                    template = angular.element($.templateCustomizador[0]["graficoTorre"])[0];
                    template.setAttribute("title", obj.id + " - " + obj.tag);
                }
                else template = angular.element($.template[0]["graficoTorre"])[0];
                setDadosView(template, obj, false);
                template = $compile(template)($scope)[0];
                template.dataset.template = template.outerHTML;
                $("[data-nome='" + tela + "'] .card-content div[data-id='" + obj.pai + "']")[0].appendChild(template);
            }

            $scope.addEventos = function (data) {
                if (data.length == 0) {
                    $("#loadzinTelam")[0].outerHTML = "";
                }

                // Chamar o configTela

                var ultimo = data.length - 1
                data.forEach(function (v, i) {
                    var elm = $("[data-id=" + v.elemento_id + "]")[0],
                        funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                        params = v.funcao;
                    if (elm) {
                        if (elm.id == "tab" && v.evento == "keydown") {
                            $("[data-id='" + elm.dataset.id + "'")[1].addEventListener(v.evento, g$[funcao.trim()].bind(null, params, false), false);
                            g$.controllerTela += '$("[data-id=' + elm.dataset.id + ']")[1].addEventListener(' + v.evento + ', g$.' + funcao.trim() + '.bind(null, "' + params.replace(/\"/g, "\\\"") + '", false), false);';
                            g$.funcoesModal += '$("[data-id=' + elm.dataset.id + ']")[1].addEventListener(' + v.evento + ', g$.' + funcao.trim() + '.bind(null, "' + params.replace(/\"/g, "\\\"") + '", false), false);';
                        }
                        else {
                            elm.addEventListener(v.evento, g$[funcao.trim()].bind(null, params, false, false), false);
                            g$.controllerTela += '$("[data-id=' + elm.dataset.id + ']")[0].addEventListener("' + v.evento + '", g$.' + funcao.trim() + '.bind(null, "' + params.replace(/\"/g, "\\\"") + '", false), false);';
                            g$.funcoesModal += '$("[data-id=' + elm.dataset.id + ']")[0].addEventListener("' + v.evento + '", g$.' + funcao.trim() + '.bind(null, "' + params.replace(/\"/g, "\\\"") + '", false), false);';
                        }
                    }
                    if (ultimo == i) {
                        $("#loadzinTelam")[0].outerHTML = "";
                    }
                });
            }

            $scope.addEventosPopup = function (tela, isModal) {
                var popup = $("#" + tela)[0];
                query = "SELECT * FROM tela_funcao WHERE isnull(depois) and tela_id=" + tela + " ORDER BY ordem";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {

                    g$.displayTab(null, popup.dataset.nome);

                    // Trata Excecao
                    if (g$.exceptionRequisicao("Eventos Tela", data)) return;;

                    g$.tela = $("#view .popup")[0].outerHTML;

                    data.data.forEach(function (v, i) {
                        var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                            params = v.funcao;
                        if (v.evento == "load") {
                            g$[funcao].bind(null, params, true)();
                            g$.controllerTela += 'g$.' + funcao.trim() + '("' + params.replace(/\"/g, "\\\"") + '", true);';
                            g$.funcoesModal += 'g$.' + funcao.trim() + '("' + params.replace(/\"/g, "\\\"") + '", true);';
                        }
                        else if (v.evento == "keydown") {
                            popup.querySelector(".card-content").addEventListener(v.evento, g$[funcao.trim()].bind(null, params, false), false);
                        }
                    });
                });
            }

            $http.get("/").success(function () {
                $http.get("/").success(function () {
                    var modal = (location.href.indexOf("=") > -1) ? location.href.substring(location.href.indexOf("modal")) : undefined;
                    if (modal && modal.length) {
                        modal = modal.split("=")[1].replace("%7C", "|");
                        g$.criaTela(modal.split("|")[1], modal.split("|")[0], modal.split("|")[1], false, true, false, true);

                        $timeout(function () {
                            var query = "SELECT * FROM tela_funcao ef WHERE evento='close' and tela_id='" + modal.split("|")[0] + "' and isnull(ef.depois) ORDER BY ordem";

                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                // Trata Excecao
                                if (g$.exceptionRequisicao("Close Modal", data)) return;

                                if (data.data.length) {
                                    data.data.forEach(function (v) {
                                        var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                                            params = v.funcao;
                                        g$[funcao.trim()](params, true);
                                        $timeout(function () {
                                            window.close();
                                        }, 1 * 1000 * 5);
                                    });
                                }
                                else window.close();

                            })
                        }, 1 * 1000 * 50);
                    }
                });
            })
        }
    };

});