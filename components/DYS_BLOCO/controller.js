app.controller("bloco", function ($scope, $http, $rootScope, $compile) {

    // FUNCAO INICIA Bloco
    _initBloco = function (elm, filtro_bloco, filtro_proc, nome_procedure, idFuncao, isTela, idColunaNone) {
        var nome = elm.children[0].dataset.nome + elm.children[0].dataset.id, template = "", datable;
        if (filtro_bloco && filtro_bloco.trim() != "") {
            var filtro = filtro_bloco.split("¦"),
                elemento_filtro = $("[data-id='" + filtro[0].trim() + "']")[0],
                id_filtro_bloco = filtro[1].trim(),
                pai_elemento = elemento_filtro.parentElement;
            pai_elemento.removeChild(elemento_filtro);
            elemento_filtro.setAttribute("ng-model", "e_" + id_filtro_bloco);
            elemento_filtro = $compile(elemento_filtro)($scope)[0];
            elemento_filtro.dataset.elmBloco = elm.dataset.id;
            pai_elemento.appendChild(elemento_filtro);
            $("[data-id='" + filtro[0].trim() + "']")[0].addEventListener("keydown", g$.filtroBloco.bind(null, idFuncao), false);
            elm.setAttribute("ng-repeat", nome + " in " + nome + "s | filter:{e_" + id_filtro_bloco + ": e_" + id_filtro_bloco + "}" + " | limitTo: " + elm.dataset.limite);
        }
        else elm.setAttribute("ng-repeat", nome + " in " + nome + "s | limitTo: " + elm.dataset.limite);
        elm.dataset.obj = "{{" + nome + "}}";

        if (!elm.parentElement.dataset.template) template = atualizarBloco(elm, nome);
        template = elm.parentElement.dataset.template;
        get(elm, template, nome, filtro_proc, nome_procedure, idFuncao, isTela, idColunaNone);
    }

    g$.filtroBloco = function (idFuncao) {
        var elm = event.target,
            elmBloco = $("[data-id='" + elm.dataset.elmBloco + "']")[0];
        // if (event.keyCode == "8") $scope.addEventosElmsBloco(elmBloco, elmBloco.parentElement);
        g$.vfyFuncaoDepois(idFuncao, false);
    }

    // FUNCAO MONTA E ATUALIZA Bloco PARA O FUNCIONAMENTO DA TABELA
    atualizarBloco = function (elm, nome) {
        var filhos = elm.querySelectorAll("[data-le_da_tabela]");

        for (var i = 0; i < filhos.length; i++) {
            filhos[i].dataset.elemento_bloco_id = "{{$index + 1}} _" + filhos[i].dataset.id;

            if (filhos[i].dataset.nome && filhos[i].dataset.nome == "order_angular") {
                filhos[i].innerHTML = "{{$index + 1}} º";
            }

            if (filhos[i].dataset.le_da_tabela && filhos[i].dataset.le_da_tabela != "" && filhos[i].dataset.le_da_tabela != "null") {
                if (filhos[i].classList.contains("new_check")) {
                    var formato = g$.formato[0][filhos[i].dataset.formato];
                    var nome_label = filhos[i].parentElement.querySelector("label").getAttribute("for");
                    formato = (!formato) ? "" : formato;
                    filhos[i].setAttribute("value", "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}");
                }
                else if (filhos[i].tagName == "LABEL") {
                    var formato = g$.formato[0][filhos[i].dataset.formato];
                    formato = (!formato) ? "" : formato;
                    if (filhos[i].dataset.nome && filhos[i].dataset.nome != "") {
                        filhos[i].dataset[filhos[i].dataset.nome] = "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}";
                    }
                    filhos[i].innerHTML = "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}";
                }
                else if (filhos[i].tagName == "VIDEO") {
                    filhos[i].children[0].src = "{{" + nome + ".e_" + filhos[i].dataset.id + "}}";
                }
                else if (filhos[i].id == "input") {
                    var formato = g$.formato[0][filhos[i].dataset.formato];
                    formato = (!formato) ? "" : formato;
                    filhos[i].setAttribute("value", "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}");
                }
                else if (filhos[i].id == "imagem") {
                    filhos[i].dataset.valorImagem = "{{" + nome + ".e_" + filhos[i].dataset.id + "}}";
                    if (filhos[i].dataset.id.split("http")[1]) {
                        filhos[i].src = "{{" + nome + ".e_" + filhos[i].dataset.id + "}}";
                    } else {
                        filhos[i].src = "{{" + nome + ".e_" + filhos[i].dataset.id + "}}";
                    }
                }
                else if (filhos[i].id == "link") {
                    filhos[i].innerHTML = "{{" + nome + ".e_" + filhos[i].dataset.id + "}}";
                }
            }
        }

        elm.parentElement.dataset.template = elm.outerHTML;
        return elm;
    }

    // Monta o template adequando com o select
    g$.atualizarBlocoSelect = function (elm, nome) {
        var filhos = elm.querySelectorAll("[data-le_da_tabela]");

        for (var i = 0; i < filhos.length; i++) {
            if (filhos[i].dataset.nome && filhos[i].dataset.nome == "order_angular") {
                filhos[i].innerHTML = "{{$index + 1}} º";
            }

            if (filhos[i].dataset.nome && filhos[i].dataset.nome != "" && filhos[i].id != "coluna") {
                if (filhos[i].tagName == "LABEL") {
                    if (filhos[i].dataset.nome && filhos[i].dataset.nome != "") {
                        filhos[i].dataset[filhos[i].dataset.nome] = "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}";
                    }
                    var formato = g$.formato[0][filhos[i].dataset.formato];
                    formato = (!formato) ? "" : formato;
                    filhos[i].innerHTML = "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}";
                }
                else if (filhos[i].id == "input") {
                    var formato = g$.formato[0][filhos[i].dataset.formato];
                    formato = (!formato) ? "" : formato;
                    filhos[i].setAttribute("value", "{{" + nome + ".e_" + filhos[i].dataset.id + formato + "}}");
                }
                else if (filhos[i].id == "imagem") {
                    if (filhos[i].dataset.id.split("http")[1]) {
                        filhos[i].src = "{{" + nome + ".e_" + filhos[i].dataset.id + "}}";
                    } else {
                        filhos[i].src = "https://dys.net.br/{{user.projeto}}/{{" + nome + ".e_" + filhos[i].dataset.id + "}}";
                    }
                }
                else if (filhos[i].id == "link") {
                    filhos[i].innerHTML = "{{" + nome + ".e_" + filhos[i].dataset.id + "}}";
                }
            }
        }

        elm.parentElement.dataset.template = elm.outerHTML;
        return elm;
    }

    // FUNÇÂO READ  
    get = function (elm, template, nome, filtro, nome_procedure, idFuncao, isTela, idColunaNone) {
        var keys, td, query, idBloco, queryEventsBlocos, elemento_bloco = elm.parentElement, elementos, obj, selectCompleto, j, select,
            nomeProc;

        elm.classList.add("play-none");

        if (nome_procedure && nome_procedure != "") {
            if (nome_procedure.split("¦")[1]) {
                nomeProc = "call " + nome_procedure.split("¦")[0].trim() + '(' + nome_procedure.split("¦")[1] + ',"' + elm.children[0].dataset.consulta_id + '")';
            }
            else {
                nome_procedure = nome_procedure.split("¦")[0].trim()
                if (nome_procedure.toLocaleLowerCase().indexOf("select") < 10) {
                    nomeProc = nome_procedure; select = true;
                    selectCompleto = ""; j = 0;
                    campos = nomeProc.toLocaleLowerCase().substring(nomeProc.toLocaleLowerCase().indexOf("select ") + 7, nomeProc.toLocaleLowerCase().indexOf(" from ")).split(",");
                    var filhos = elm.querySelectorAll("[data-le_da_tabela]");

                    for (var i = 0; i < filhos.length; i++) {
                        if (filhos[i].dataset.nome && filhos[i].dataset.nome != "" && filhos[i].id != "coluna") {
                            selectCompleto += campos[j] + " as e_" + filhos[i].dataset.id + ((filhos[i + 1]) ? ", " : "");
                            j++;
                        }
                    }

                    template = g$.atualizarBlocoSelect(elm, nome);

                    nomeProc = "select " + selectCompleto + nomeProc.toLocaleLowerCase().substring(nomeProc.toLocaleLowerCase().indexOf(" from "));
                }
                else {
                    // Chama a proc passada por parametro
                    nomeProc = "call " + nome_procedure + '(' + elm.children[0].dataset.consulta_id + ',"' + $rootScope.user.banco + '", "' + filtro + '")';
                }
            }

            $http.post(URL + "/jsonQuery/", g$.trataQuery(nomeProc)).success(function (data) {
                // Trata Excecao
                if (g$.exceptionRequisicao("ProcLe - Bloco", data)) return;;

                // Compila o template
                template = angular.element(template)[0];
                template.dataset.template = elm.dataset.template;
                template = $compile(template)($scope)[0];
                $scope[nome + "s"] = (select) ? data.data : data.data[0];

                if (data.data.length) {
                    if (template) {
                        // template.classList.remove("play-none");
                        $("#view [data-id='" + elm.dataset.pai + "']")[0].innerHTML = ""
                        $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(template);
                    }

                    // $("[data-id='" + elm.dataset.id + "']").removeClass("play-none");
                    g$.alteraChecksBloco(elm);
                    hrefLinkBloco(elm);
                    setAttributesCellsBloco(elm);
                    $scope.addEventosElmsBloco(elm, elemento_bloco);
                    g$.vfyFuncaoDepois(idFuncao, isTela);
                }
                else {
                    $("[data-id='" + elm.dataset.id + "']").addClass("play-none");
                    if (idColunaNone) $("[data-id='" + idColunaNone + "']").addClass("play-block");
                    $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(elm);
                    g$.vfyFuncaoDepois(idFuncao, isTela);
                }

            });
        }
        else {
            filtro = (filtro == "") ? "0=0" : filtro;
            filtro = filtro.replace(/\%/g, "‰");
            $http.get(URL + "/le/" + elm.children[0].dataset.consulta_id + "/" + $rootScope.user.banco + "/" + filtro + "/false/").success(function (data) {
                if (g$.exceptionRequisicao("ProcLe - Bloco", data)) return;;

                $http.post(URL + "/jsonQuery/", g$.trataQuery(data.data[0][0].consulta)).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Query Bloco - Bloco", data)) return;

                    // Compila o template
                    template = $compile(angular.element(template)[0])($scope)[0];

                    if (data.data.length) {
                        $scope[nome + "s"] = data.data;

                        if (template) {
                            // template.classList.remove("play-none");
                            $("#view [data-id='" + elm.dataset.pai + "']")[0].innerHTML = ""
                            $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(template);
                        }

                        // Adiciona os HREF nos links
                        // $("[data-id='" + elm.dataset.id + "']").removeClass("play-none");
                        g$.alteraChecksBloco(elm);
                        hrefLinkBloco(elm);
                        setAttributesCellsBloco(elm);
                        $scope.addEventosElmsBloco(elm, elemento_bloco);
                        g$.vfyFuncaoDepois(idFuncao, isTela);
                    }
                    else {
                        $("[data-id='" + elm.dataset.id + "']").addClass("play-none");
                        $("#view [data-id='" + elm.dataset.pai + "']")[0].appendChild(elm);
                        g$.vfyFuncaoDepois(idFuncao, isTela);
                    }
                });
            });
        }
    }

    // Adiciona os eventos nos elementos da tela
    $scope.addEventosElmsBloco = function (elm, elemento_bloco) {
        var queryEventsBlocos = "SELECT ef.*, e.menu_id FROM node.elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and e.menu_id = " +
            elm.dataset.menu_id + " AND evento_bloco='1' and isnull(ef.depois) ORDER BY ef.ordem";

        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryEventsBlocos.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Eventos Bloco - Bloco", data)) return;

            data.data.forEach(function (v) {
                var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                    params = v.funcao,
                    elementos = elemento_bloco.querySelectorAll("[data-id='" + v.elemento_id + "']");

                for (var i = 0; i < elementos.length; i++) {
                    // elementos[i].removeEventListener("'" + v.evento + "', g$." + funcao.trim()) + ".bind(" + null + "," + params + "," + false + ")";
                    if (!(elementos[i].tagName == "LABEL" && elementos[i].classList.contains("new_check")))
                        elementos[i].addEventListener(v.evento, g$[funcao.trim()].bind(null, params, false), false);
                }
            });
        });
    }

    g$.alteraChecksBloco = function (elm) {
        $http.get("/").success(function (data) {
            var elms = $("[data-id='" + elm.dataset.id + "'] input.new_check");
            for (var i = 0; i < elms.length; i++) {
                elms[i].id = elms[i].id + "_" + i;
                elms[i].parentElement.querySelector("label").setAttribute("for", elms[i].id);
                elms[i].checked = (elms[i].value == "1" || elms[i].value == "true") ? true : false;
            }
        });
    }

    setAttributesCellsBloco = function (elm) {
        var blocos, labels, campo, elmsCorDoBloco, style, imagens;
        $http.get("/").success(function () {
            blocos = $("#view [data-id='" + elm.dataset.id + "']")[0].parentElement.children;
            imagens = $("#view [data-id='" + elm.dataset.id + "'] #imagem");

            for (var i = 0; i < imagens.length; i++) {
                if (imagens[i].dataset.valorImagem && imagens[i].dataset.valorImagem.indexOf("http") == -1) {
                    if (imagens[i].dataset.valorImagem == "") imagens[i].src = "https://dys.net.br/img/sem-imagem.jpg";
                    else imagens[i].src = "https://dys.net.br/" + $rootScope.user.projeto + "/" + imagens[i].dataset.valorImagem;
                }
                else imagens[i].src = "https://dys.net.br/img/sem-imagem.jpg";
            };

            for (var i = 0; i < blocos.length; i++) {
                elmsCorDoBloco = [].slice.call(blocos[i].querySelectorAll("[data-nome='corDoBloco']"));
                elmsCorDoBloco.forEach(function (elm) {
                    elm.parentElement.classList.add(elm.innerHTML.trim());
                });
            };

            for (var i = 0; i < blocos.length; i++) {
                labels = blocos[i].querySelectorAll("label");
                for (var j = 0; j < labels.length; j++) {
                    if (labels[j].innerHTML && labels[j].innerHTML.indexOf("«cor=") > -1) {
                        labels[j].parentElement.parentElement.setAttribute("data-bloco_cor", labels[j].innerHTML.split("«")[1].split("=")[1]);
                        labels[j].innerHTML = labels[j].innerHTML.split("«")[2];
                    }
                }
            }
        });
    }

    hrefLinkBloco = function (elm) {
        var tabela, campo, query, blocos, elms, campoBloco;

        $http.get("/").success(function () {
            blocos = [].slice.call($("[data-id='" + elm.dataset.id + "']"));

            blocos.forEach(function (v) {

                // Quebra de Linha e Espaco
                elms = [].slice.call(v.querySelectorAll("#link, img, label"));
                elms.forEach(function (elm) {

                    if (elm.tagName == "LABEL") {
                        var valor = elm.innerHTML.replace(/&lt;/g, "<");
                        valor = valor.replace(/&gt;/g, ">");
                        valor = valor.replace(/<br>/g, "\n").replace(/<space>/g, " ");
                        elm.innerText = valor;
                    }
                    else {
                        elm.innerHTML = elm.innerHTML.replace(/\&lt;br \/&gt;/g, "<br>")

                        if (elm.dataset.link_tabela != "" && elm.dataset.link_campo != "") {
                            tabela = g$.filterTabela(elm.dataset.link_tabela, true);
                            campo = g$.filterCampo(elm.dataset.link_campo);
                            campoBloco = g$.filterCampo(v.querySelector("[data-nome='bloco_id']").dataset.le_do_campo);

                            query = "SELECT " + campo + " FROM " + $rootScope.user.banco + "." + tabela + " WHERE " + campoBloco + " = " + v.querySelector("[data-nome='bloco_id']").innerHTML;
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
                                // Trata Excecao
                                if (g$.exceptionRequisicao("Query Links - Bloco", data)) return;

                                data = data.data;

                                if (elm.id == "imagem") {
                                    elm.setAttribute("onclick", "g$.openLink('" + data[0][campo] + "')");
                                }
                                else elm.setAttribute("onclick", "g$.openLink('" + data[0][campo] + "')");
                            });
                        }
                    }
                });
            });
        });
    }

});