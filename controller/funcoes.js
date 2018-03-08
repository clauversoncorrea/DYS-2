app.controller("funcoes", function ($scope, $http, $rootScope, $compile) {
    var gerando = 0;

    // Troca todos os sargentos que estão na string 
    g$.alterSargentos = function (params) {
        var texto = params.split("»"), campo, encode, inArray = "";
        for (var i = 0; i < texto.length; i++) {
            if (texto[i].indexOf("|") == -1 && texto[i].indexOf("¦") == -1 && !!parseInt(texto[i])) {
                campo = $("[data-id='" + texto[i] + "']")[0]
                if (campo) {
                    if (texto[i].indexOf("_combo_desc") > -1) {
                        campo = $("[data-id='" + texto[i].split("_")[0].trim() + "']")[0]
                        texto[i] = (campo.querySelector("#selectbox").value == "") ? null : campo.querySelector("#selectbox").value;
                    }
                    else if (campo.id == "label") {
                        if (campo.dataset.formato && campo.dataset.formato != "" && campo.dataset.formato != "null") {
                            if (campo.dataset.formato == "R$ Money") texto[i] = campo.innerHTML.replace('.', '').replace(',', '.');
                            else if (g$.mantem_mascara.indexOf(campo.dataset.formato) > -1) {
                                texto[i] = campo.innerHTML.trim();
                            }
                            else texto[i] = $(campo).cleanVal()
                        }
                        else texto[i] = campo.innerHTML.trim();
                    }
                    else if (campo.id == "selectbox") texto[i] = g$.getValueOption(campo.querySelector("#selectbox"));
                    else if (campo.type == "checkbox") texto[i] = (campo.checked) ? 1 : 0;
                    else if (campo.dataset.tipo == "file") {
                        if (campo.children[1].files.length) {
                            texto[i] = (campo.children[1].files[0].name && campo.children[1].files[0].name != '') ? "http:½½dys.net.br½" + $rootScope.user.projeto + "½" + campo.children[1].files[0].name : '';
                        }
                        else {
                            texto[i] = (campo.parentElement.querySelectorAll("input")[1].value && campo.parentElement.querySelectorAll("input")[1].value != '') ? "http:½½dys.net.br½" + $rootScope.user.projeto + "½" + campo.parentElement.querySelectorAll("input")[1].value : '';
                        }
                    }
                    else {
                        if (campo.dataset.tipo == "date" || campo.dataset.tipo == "date-time")
                            texto[i] = g$.formataDataBanco(campo.value);
                        else {
                            if (campo.dataset.formato == "R$ Money") texto[i] = campo.value.replace('.', '').replace(',', '.');
                            else if (campo.dataset.formato && campo.dataset.formato != "" && campo.dataset.formato != "null") {
                                if (g$.mantem_mascara.indexOf(campo.dataset.formato) > -1) {
                                    if (campo.dataset.formato == "R$ Money") texto[i] = campo.value.replace('.', '').replace(',', '.');
                                    else texto[i] = campo.value;
                                }
                                else texto[i] = $(campo).cleanVal();
                            }
                            else texto[i] = campo.value;
                        }
                    }
                }
                else if (texto[i].indexOf("_combo_desc") > -1) {
                    campo = $("[data-id='" + texto[i].split("_")[0].trim() + "']")[0]
                    texto[i] = (campo.querySelector("#selectbox").value == "") ? null : campo.querySelector("#selectbox").value;
                }

                else if (texto[i].indexOf("file") > -1) {
                    campo = $("[data-id='" + texto[i].split("_")[0].trim() + "']")[0];
                    if (campo.children[1].files.length) {
                        texto[i] = campo.children[1].files[0].name;
                    }
                    else {
                        texto[i] = campo.parentElement.querySelectorAll("input")[1].value;
                    }
                }
            }
            else if (texto[i].indexOf("_array") > -1) {
                if (g$[texto[i].split("_")[0] + "_array"]) {
                    for (var j = 0; j < g$[texto[i].split("_")[0] + "_array"].length; j++) {
                        encode = (g$[texto[i].split("_")[0] + "_array"][j + 1]) ? "," : "";
                        inArray += g$[texto[i].split("_")[0] + "_array"][j]["e_" + texto[i].split("_")[2]] + encode;
                    }
                }
                texto[i] = inArray;
                inArray = "";
            }
            else if (texto[i].indexOf("_elemento") > -1) {
                if (g$[texto[i].split("_")[0] + "_elemento"]) {
                    campo = g$[texto[i].split("_")[0] + "_elemento"].querySelector("[data-id='" + texto[i].split("_")[2] + "']");
                    if (campo.children[0]) {
                        // Se for check coloca 1 ou 0
                        if (campo.dataset.coluna_check == "1") inArray = (campo.children[0].checked) ? 1 : 0;
                        else {
                            if (campo.querySelector("#span")) inArray = campo.querySelector("#span").innerHTML;
                            else inArray = campo.innerText;
                        }
                    }
                    // Se for Data
                    else if (campo.dataset.cell_tipo == "date") {
                        inArray = campo.innerHTML.split("/").reverse().join("-");
                    }
                    else inArray = campo.innerText;
                    texto[i] = inArray;
                }
                else texto[i] = "";
            }
            else if (texto[i] == "now") {
                var data = new Date();
                texto[i] = data.toLocaleDateString().split("/").reverse().join("-") + " " + data.toLocaleTimeString();
            }
            else if (texto[i].indexOf("date_today") > -1) {
                var data = new Date();
                texto[i] = texto[i].replace("date_today", data.toLocaleDateString().split("/").reverse().join("-"));
            }
            else if (texto[i].indexOf("g$.isModal") > -1) texto[i] = g$.isModal;
            else if (texto[i] != "memo" && texto[i].indexOf("|") < 0 && texto[i].slice(0, 4) == "memo") texto[i] = g$[texto[i].trim()];
            else if (texto[i].indexOf("user.") > -1) texto[i] = $rootScope.user[texto[i].split(".")[1]];
            else if (texto[i].indexOf("g$.") > -1) texto[i] = (g$[texto[i].split(".")[1]] == "") ? "" : g$[texto[i].split(".")[1]];
        }
        var regexp = new RegExp('dysweb.dys.com.br/' + $rootScope.user.projeto.toLowerCase() + '/', 'g');
        return texto.join("").replace(regexp, 'dys.net.br/' + $rootScope.user.projeto + '/').split('|');
    }

    // Função Alert
    g$.mensagem = function (params, isTela) {
        var params = g$.alterSargentos(params),
            cond = params[2],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = params[0].split("¦")[1];
        tipo = (params[3] && params[3].trim() != "") ? params[3].trim() : 'alert';

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        if (tipo == 'toast') Materialize.toast(params[1], 4000, 'grey darken-3');
        else g$.alerta("Alerta", params[1]);

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    // Função guarda e limpa memo,
    // A funcao memo se fosse bloco nao podia ter depois, por causa do event.target(onde o usuario clicou), porque quando faz a requisicao depois, 
    // o evento passa a ser os metodos da requisacao
    // Entao tratamos na funcao que faz o depois, ele guarda o elemento que clicou e se tiver que executar o depois, passa o elm por parametro
    g$.memo = function (params, isTela, elm) {
        var params = g$.alterSargentos(params), obj,
            memo = params[1].trim(),
            valor = (params[2] && params[2] != "") ? params[2].trim() : "",
            cond = params[3],
            idFuncao = params[0].split("¦")[1],
            elm = (elm && elm.tagName) ? elm : event.target,
            elmBloco;

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        // Verifica 3 vezes o pai para achar o bloco pai e pegar o valor do objeto, se o valor for ID_BLOCO
        if (valor.indexOf("ID_BLOCO") > -1) valor = g$.procuraBlocoMemo(elm, valor);
        else if (valor.indexOf("ID_CHECK") > -1) valor = g$.procuraCheckMemo(elm, valor);
        else if (valor.indexOf("valor_check") > -1) {
            valor = (elm.parentElement.querySelector("input").checked) ? 1 : 0;
        }

        g$[memo] = valor;

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.procuraBlocoMemo = function (elm, valor) {
        if (elm.dataset.nome == "BLOCO") {
            elmBloco = elm;
            obj = JSON.parse(elmBloco.dataset.obj);
        }
        else if (elm.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement;
            obj = JSON.parse(elmBloco.dataset.obj);
        }
        else if (elm.parentElement.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement.parentElement;
            obj = JSON.parse(elmBloco.dataset.obj);
        }
        else if (elm.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement.parentElement.parentElement;
            obj = JSON.parse(elmBloco.dataset.obj);
        }
        else if (elm.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement.parentElement.parentElement.parentElement;
            obj = JSON.parse(elmBloco.dataset.obj);
        }
        else if (elm.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement.parentElement.parentElement.parentElement.parentElement;
            obj = JSON.parse(elmBloco.dataset.obj);
        }
        else if (elm.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO") {
            elmBloco = elm.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            obj = JSON.parse(elmBloco.dataset.obj);
        }

        // Depois que achou o elemento e o objeto
        if (valor.split("¦")[1] && valor.split("¦")[1].trim() != "") {
            if (elmBloco.querySelector("[data-id='" + valor.split("¦")[1].trim() + "']").dataset.elemento_bloco_id) {
                if (elmBloco.querySelector("[data-id='" + valor.split("¦")[1].trim() + "']").id == "input") {
                    valor = elmBloco.querySelector("[data-id='" + valor.split("¦")[1].trim() + "']").value;
                }
                else if (elmBloco.querySelector("[data-id='" + valor.split("¦")[1].trim() + "']").querySelector("input")) {
                    valor = elmBloco.querySelector("[data-id='" + valor.split("¦")[1].trim() + "']").querySelector("input").dataset.value;
                }
                else {
                    valor = JSON.parse(elmBloco.dataset.obj)["e_" + elmBloco.querySelector("[data-id='" + valor.split("¦")[1].trim() + "']").dataset.id];
                }
            }
            else valor = valor.replace("ID_BLOCO", obj["e_" + valor.split("¦")[1].trim()]).split("¦")[0];
        }
        else valor = valor.replace("ID_BLOCO", obj["e_" + elmBloco.querySelector("[data-nome='bloco_id']").dataset.id])

        return valor;
    }

    g$.procuraCheckMemo = function (elm, valor) {
        var elmCheck;
        if (elm.parentElement.dataset.nome == "BLOCO_CHECK") {
            elmCheck = elm.parentElement;
            obj = JSON.parse(elmCheck.dataset.obj);
        }
        else if (elm.parentElement.parentElement.dataset.nome == "BLOCO_CHECK") {
            elmCheck = elm.parentElement.parentElement;
            obj = JSON.parse(elmCheck.dataset.obj);
        }
        else if (elm.parentElement.parentElement.parentElement.dataset.nome == "BLOCO_CHECK") {
            elmCheck = elm.parentElement.parentElement.parentElement;
            obj = JSON.parse(elmCheck.dataset.obj);
        }
        else if (elm.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO_CHECK") {
            elmCheck = elm.parentElement.parentElement.parentElement.parentElement;
            obj = JSON.parse(elmCheck.dataset.obj);
        }

        // Depois que achou o elemento e o objeto
        if (valor.split("¦")[1] && valor.split("¦")[1].trim() != "") {
            valor = valor.replace("ID_CHECK", obj["e_" + valor.split("¦")[1].trim()]).split("¦")[0];
        }
        else valor = valor.replace("ID_CHECK", obj["e_" + elmCheck.querySelector("[data-nome='check_id']").dataset.id]);

        return valor;
    }

    g$.limparMemo = function (params, isTela) {
        var params = g$.alterSargentos(params), obj,
            memo = params[1].trim(),
            valor = (params[2] && params[2] != "") ? params[2].trim() : "",
            cond = params[3],
            idFuncao = params[0].split("¦")[1];

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        // Saber se é o último
        g$[memo] = g$[memo].split(",");
        for (var i = 0; i < g$[memo].length; i++) {
            if (g$[memo][i].trim() == valor.trim()) {
                g$[memo].splice(i, 1);
            }
        }
        g$[memo] = g$[memo].join(",");

        // return g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.atualizarTabela = function (params, isTela) {
        var params = g$.alterSargentos(params), filtro = "",
            elm = $("table[data-id=" + params[1].trim() + "]")[0],
            nome_procedure = (params[2] && params[2].trim() != "") ? params[2].trim() : "",
            idFuncao = params[0].split("¦")[1],
            consultaID, cond = params[4], queryConsultaFiltro;

        filtro = (params[3]) ? params[3].trim() : "";
        if (!$("#loadzinTabelaz")[0]) {
            loadzinTela = angular.element($.template[0]["loadzinTela"])[0];
            document.body.append(loadzinTela);
            $("#loadzinTela")[0].id = "loadzinTabelaz";
        }

        if (!elm) {
            $("#loadzinTabelaz")[0].outerHTML = "";
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        }

        consultaID = elm.dataset.tabela_consulta_id;
        queryConsultaFiltro = "select c.id, f.id as id_filtro, f.filtro from node.consulta c LEFT JOIN node.consulta_filtro f ON c.id = f.consulta_id where f.consulta_id = " + consultaID;

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            if ($("#loadzinTabelaz")[0]) $("#loadzinTabelaz")[0].outerHTML = "";
            if ($("#loadzinTela")[0]) $("#loadzinTela")[0].outerHTML = "";
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        delete g$[elm.dataset.nome + "ID"];
        delete g$[elm.dataset.nome + "_elemento"];
        delete g$[elm.dataset.nome + "_array"];

        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryConsultaFiltro)).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("ConsultaFiltro - Tabela", data)) return;

            data.data.forEach(function (v) {
                if (!v.filtro) return
                var params = g$.alterSargentos(v.filtro);
                if (filtro == "") filtro += params;
                else filtro += " AND " + params;
            });

            g$._initTabela(elm, filtro, nome_procedure, idFuncao, isTela);
        });
    }

    g$.atualizarCheckbox = function (params, isTela) {
        var params = g$.alterSargentos(params), filtro = "",
            elm = $("[data-id=" + params[1].trim() + "]")[0],
            idFuncao = params[0].split("¦")[1],
            consultaID, cond = params[2], queryConsultaFiltro;

        if (!elm) return g$.vfyFuncaoDepois(idFuncao, isTela);

        consultaID = elm.dataset.consulta_id;
        queryConsultaFiltro = "select c.id, f.id as id_filtro, f.filtro from node.consulta c LEFT JOIN node.consulta_filtro f ON c.id = f.consulta_id where f.consulta_id = " + consultaID;

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryConsultaFiltro.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("ConsultaFiltro - Tabela", data)) return;

            data.data.forEach(function (v) {
                if (!v.filtro) return
                var params = g$.alterSargentos(v.filtro);
                if (filtro == "") filtro += params;
                else filtro += " AND " + params;
            });

            g$._initCheckbox(elm, filtro, idFuncao, isTela);
        });
    }

    g$.atualizarBloco = function (params, isTela) {
        var params = g$.alterSargentos(params), filtro_bloco = "", filtro = "",
            elm = $("#view [data-id=" + params[1].trim() + "]")[0],
            nome_procedure = (params[2] && params[2].trim() != "") ? params[2].trim() : "",
            idFuncao = params[0].split("¦")[1],
            idColunaNone = params[5],
            cond = params[4], filtro, consultaID, queryConsultaFiltro;

        delete g$[elm.dataset.nome + "ID"];

        if (!elm) return g$.vfyFuncaoDepois(idFuncao, isTela);

        consultaID = elm.children[0].dataset.consulta_id;
        queryConsultaFiltro = "select c.id, f.id as id_filtro, f.filtro from node.consulta c LEFT JOIN node.consulta_filtro f ON c.id = f.consulta_id where f.consulta_id = " + consultaID;

        filtro_bloco = (params[3]) ? params[3].trim() : "";

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        if (!$("#loadzinTelam")[0]) {
            loadzinTela = angular.element($.template[0]["loadzinTela"])[0];
            document.body.append(loadzinTela);
            $("#loadzinTela")[0].id = "loadzinTelam";
        }

        if (!elm) {
            $("#loadzinTelam")[0].outerHTML = "";
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        }

        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryConsultaFiltro.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("ConsultaFiltro - Bloco", data)) return;

            data.data.forEach(function (v) {
                if (!v.filtro) return
                var params = g$.alterSargentos(v.filtro);
                if (filtro == "") filtro += params;
                else filtro += " AND " + params;
            });

            _initBloco(elm, filtro_bloco, filtro, nome_procedure, idFuncao, isTela, idColunaNone);
        });
    }

    g$.loadzinTabela = function (params, isTela) {
        var tempInterval, queryLoadzin, elemento, tbl, tds, td,
            params = g$.alterSargentos(params),
            query = params[1],
            array = params[2].split(","),
            elementos = params[3].split("¦"),
            tempo = parseInt(params[4].trim()),
            cond = params[5],
            idFuncao = params[0].split("¦")[1],
            contInterval = tempo;

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        // Coloca Loadzin no elemento
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < elementos.length; j++) {
                elemento = $("#view [data-id='" + elementos[j].trim() + "']")[0];
                tbl = elemento.parentElement.parentElement.parentElement;
                td = $("#view [data-id='" + tbl.dataset.id + "'] tr[data-tt-id='" + array[i].trim() + "'] td[data-id='" + elemento.dataset.id + "']")[0];

                td.classList.add("center-align");
                if (td.children[0]) {
                    if (td.children[0].getAttribute("data-cor")) td.setAttribute("data-cor", td.children[0].getAttribute("data-cor"));
                }
                td.innerHTML = "";

                td.append(angular.element($.template[0]["loadzin"])[0]);
            }

            // for (var j = 0; j < tds.length; j++) {
            //     tds[j].classList.add("center-align");
            //     if (tds[j].children[0]) {
            //         if (tds[j].children[0].getAttribute("data-cor")) tds[j].setAttribute("data-cor", tds[j].children[0].getAttribute("data-cor"));
            //     }
            //     tds[j].innerHTML = "";
            // }

            // // Adiciona em todas as TDS com as linhas selecionadas
            // tds.append(angular.element($.template[0]["loadzin"])[0]);
        }

        tempInterval = setInterval(function () {
            array.forEach(function (v, i) {
                if (v != "encontrado") {
                    queryLoadzin = query.trim() + array[i].trim();
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryLoadzin.trim())).success(function (data) {
                        data = data.data;

                        // Trata Excecao
                        if (g$.exceptionRequisicao("LoadzinTabela - Tela", data)) return;;

                        if (data.length) {
                            // Coloca Loadzin no elemento
                            for (var i = 0; i < elementos.length; i++) {
                                elemento = $("#view [data-id='" + elementos[i].trim() + "']")[0];
                                td = tbl.querySelector("tr[data-tt-id='" + data[0].id + "'] td[data-id='" + elemento.dataset.id + "']");

                                // Verifica se tem o attribute cor 
                                if (typeof (data[0][Object.keys(data[0])[i + 1]]) == "string" && data[0][Object.keys(data[0])[i + 1]].indexOf("cor") > -1) g$.setAttributeCell(td, data[0][Object.keys(data[0])[i + 1]]);
                                else td.innerHTML = data[0][Object.keys(data[0])[i + 1]];
                            }
                            array.splice(i, 1);
                            g$.vfyFuncaoDepois(idFuncao, isTela);
                            clearInterval(tempInterval);
                        }
                    });
                }
            });
            contInterval += tempo;
            if (contInterval >= 120000) {
                tbl = elemento.parentElement.parentElement.parentElement;
                tds = $("#view [data-id='" + tbl.dataset.id + "'] tr.active td[data-id='" + elemento.dataset.id + "'] .preloader-wrapper");
                tds.parent().text("");
                clearInterval(tempInterval);
            }
        }, tempo);

    }

    g$.loadzinTela = function (params, isTela) {
        var tempInterval, queryLoadzin, elemento, loadzin,
            params = g$.alterSargentos(params),
            query = params[1],
            idFuncao = params[0].split("¦")[1],
            elementos = params[2].split("¦"),
            tempo = parseInt(params[3].trim()),
            contInterval = tempo;

        // Coloca Loadzin no elemento
        for (var i = 0; i < elementos.length; i++) {
            if (elementos[i].indexOf("tela") == -1) elemento = $("#view [data-id='" + elementos[i].trim() + "']")[0];

            if (elemento) {
                if (elemento.getAttribute("loadzin-tela") == "true") return;

                elemento.setAttribute("loadzin-tela", true);

                if (elemento.id == "selectbox") {
                    elemento = elemento.querySelector("#selectbox");
                }

                elemento.value = "";
                elemento.disabled = true;
                elemento.style.width = "80%";

                // Se tiver label e nao estiver com display block, ele coloca
                if (elemento.parentElement.querySelector("label")) {
                    if (elemento.parentElement.querySelector("label").style.display != "block") {
                        elemento.parentElement.querySelector("label").style.display = "block";
                        elemento.parentElement.setAttribute("setLabelBlock", true);
                    }
                }

                loadzin = angular.element($.template[0]["loadzin"])[0];
                loadzin.classList.add("loadzin-input");
                elemento.parentElement.append(loadzin);
            }
            else if (elementos[i].indexOf("tela") > 0) {
                if (!$("#loadzinTelam")[0]) {
                    loadzinTela = angular.element($.template[0]["loadzinTela"])[0];
                    document.body.append(loadzinTela);
                    $("#loadzinTela")[0].id = "loadzaoTela";
                }
            }

        }

        tempInterval = setInterval(function () {
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {

                // Trata Excecao
                if (g$.exceptionRequisicao("LoadzinTela - Tela", data)) return;

                data = data.data;

                if (data.length) {
                    // Coloca Loadzin no elemento
                    for (var j = 0; j < elementos.length; j++) {
                        if (elementos[j].indexOf("tela") > -1) {
                            if ($("#loadzaoTela")[0]) $("#loadzaoTela")[0].outerHTML = "";
                        }
                        else {
                            if (elementos[j].trim().indexOf("memo") > -1) {
                                g$[elementos[j].trim()] = data[0][Object.keys(data[0])[j]];
                            }
                            else {
                                elemento = $("#view [data-id='" + elementos[j].trim() + "']")[0];
                                if (elemento.parentElement.getAttribute("setLabelBlock") == "true") {
                                    elemento.parentElement.querySelector("label").style = "";
                                }

                                elemento.removeAttribute("loadzin-tela");
                                elemento.parentElement.removeChild(elemento.parentElement.querySelector(".preloader-wrapper"));

                                if (elemento.dataset.bloqueado != "true") {
                                    if (elemento.id == "selectbox") {
                                        g$.getValorComboBanco(elemento, data[0][Object.keys(data[0])[j]]);
                                        elemento.children[1].disabled = false;
                                    }
                                    else {
                                        elemento.value = data[0][Object.keys(data[0])[j]];
                                        elemento.disabled = false;
                                    }
                                }
                                else {
                                    elemento.value = data[0][Object.keys(data[0])[j]];
                                }
                                elemento.style.width = "100%";
                            }
                        }
                    }
                    clearInterval(tempInterval);
                    if ($("#loadzaoTela")[0]) $("#loadzaoTela")[0].outerHTML = "";
                    g$.vfyFuncaoDepois(idFuncao);
                }
                contInterval += tempo;
                if (contInterval >= 120000) {
                    clearInterval(tempInterval);
                    if ($("#loadzaoTela")[0]) $("#loadzaoTela")[0].outerHTML = "";
                    g$.vfyFuncaoDepois(idFuncao);
                }
            });

            contInterval += tempo;
            if (contInterval >= 120000) {
                for (var j = 0; j < elementos.length; j++) {
                    elemento = $("#view [data-id='" + elementos[j].trim() + "']")[0];
                    if (elemento.parentElement.getAttribute("setLabelBlock") == "true") {
                        elemento.parentElement.querySelector("label").style = "";
                    }
                    elemento.removeAttribute("loadzin-tela");
                    elemento.parentElement.removeChild(elemento.parentElement.querySelector(".preloader-wrapper"));

                    if (elemento.dataset.bloqueado != "true") {
                        elemento = (elemento.id == "selectbox") ? elemento.querySelector("#selectbox") : elemento;
                        elemento.disabled = false;
                    }
                    elemento.style.width = "100%";
                }
                clearInterval(tempInterval);
            }
        }, tempo);

    }

    g$.leTela = function (params, isTela) {
        var proc, params, filtro, obj,
            params = g$.alterSargentos(params),
            view = params[1].trim(),
            consultaID = params[2].trim(),
            idFuncao = params[0].split("¦")[1],
            cond = params[4],
            queryConsultaFiltro = "select c.id, f.id as id_filtro, f.filtro from node.consulta c LEFT JOIN node.consulta_filtro f ON c.id = f.consulta_id where f.consulta_id = " + consultaID;

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        g$.limparDadosView("limparDadosView | " + view);

        filtro = (params[3]) ? params[3].trim() : "";

        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryConsultaFiltro.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("ConsultaFiltro - LeTela", data)) return;

            data.data.forEach(function (v) {
                if (v.id == consultaID) {
                    if (!v.filtro) return
                    var params = g$.alterSargentos(v.filtro);
                    if (filtro == "") filtro += params;
                    else filtro += " AND " + params;
                }
            });

            filtro = filtro.replace(/\%/g, "‰");
            $http.get(URL + "/le/" + consultaID + "/" + $rootScope.user.banco + "/" + filtro + "/true/").success(function (data) {

                if (g$.exceptionRequisicao("Proc le3 - LeTela", data)) return;

                var consulta = (data.data[0][0].consulta.indexOf("»") > - 1) ? g$.alterSargentos(data.data[0][0].consulta).join("") : data.data[0][0].consulta;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(consulta)).success(function (data) {
                    // Trata Excecao
                    if (g$.exceptionRequisicao("Consulta - LeTela", data)) return;

                    data = data.data;

                    // Se nao trazer nada ele sai
                    if (!data || !data[0]) return g$.vfyFuncaoDepois(idFuncao, isTela);
                    else {
                        g$.controllerToview(data[0], $rootScope.user);
                        g$.vfyFuncaoDepois(idFuncao, isTela);
                    }
                });
            });
        });
    }

    g$.gravanaTabela = function (params) { }

    g$.salvarTela = function (params, isTela, id_elemento) {
        var params = g$.alterSargentos(params), elemento_id,
            view = params[1].trim(),
            limpar = (params[2] && params[2].trim() == "false") ? true : false,
            idTabela, obj = {}, elms, tabela, retornoIvalid,
            cond = params[3],
            showMsg = (params[4] && params[4].trim() == "false") ? true : false,
            idFuncao = params[0].split("¦")[1];

        // Se ele passar view, vai pegar o Popup
        if (view == "view") view = $("#view")[0].children[0];
        else {
            if ($("#view [data-id = " + view + "]")[0].id == "tab") view = $("#view [data-id = " + view + "]")[1];
            else view = $("#view [data-id = " + view + "]")[0];
        }

        retornoIvalid = g$.hasError(view);
        if (retornoIvalid) {
            if (retornoIvalid.value.length)
                return g$.alerta("Alerta", "Campo " + retornoIvalid.parentElement.querySelector("label").innerHTML + " inválido");
            else {
                retornoIvalid = (retornoIvalid.id == "selectbox") ? retornoIvalid.parentElement : retornoIvalid;
                return g$.alerta("Alerta", "Campo " + retornoIvalid.parentElement.querySelector("label").innerHTML + " é obrigatório");
            }
        }

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        elms = view.querySelectorAll("input, select, textarea");

        if (view.querySelector("[data-nome='txt_id']")) idTabela = view.querySelector("[data-nome='txt_id']").dataset.grava_na_tabela
        else {
            if (elms[0].id == "selectbox") idTabela = elms[0].parentElement.dataset.grava_na_tabela;
            else idTabela = elms[0].dataset.grava_na_tabela;
        }

        // elms = view.querySelectorAll("input[data-grava_na_tabela='" + idTabela + "'], select-box[data-selectbox_grava_na_tabela='" + idTabela + "']");

        tabela = g$.filterTabela(idTabela, true);
        console.log('---------------------------------- for de elemento salvarTela --------------------------------- ');
        for (var k = 0; k < elms.length; k++) {
            console.log(elms[k].parentElement.dataset.grava_no_campo, ' - ', elms[k].parentElement.dataset.id, ' - ', g$.filterCampo(elms[k].parentElement.dataset.grava_no_campo));
            if (elms[k].id == "selectbox") {
                if (!elms[k].parentElement.dataset.grava_na_tabela || elms[k].parentElement.dataset.grava_na_tabela == "null" || elms[k].parentElement.dataset.grava_na_tabela == "" ||
                    !elms[k].parentElement.dataset.grava_no_campo || elms[k].parentElement.dataset.grava_no_campo == "undefined" || elms[k].parentElement.dataset.grava_no_campo == "null" || elms[k].parentElement.dataset.grava_no_campo == "") {
                    g$.exibeQuery("Elemento Tela", "O elemento " + elms[k].parentElement.dataset.id + " está sem o grava na tabela ou grava no campo!");
                    console.log('validou');
                    continue
                };
            }
            else {
                if (!elms[k].dataset.grava_na_tabela || elms[k].dataset.grava_na_tabela == "null" || elms[k].dataset.grava_na_tabela == "" ||
                    !elms[k].dataset.grava_no_campo || elms[k].dataset.grava_no_campo == "null" || elms[k].dataset.grava_no_campo == "") {
                    g$.exibeQuery("Elemento Tela", "O elemento " + elms[k].dataset.id + " está sem o grava na tabela ou grava no campo!");
                    continue
                };
            }

            // Selectbox
            if (elms[k].id == "selectbox") {
                campo = g$.filterCampo(elms[k].parentElement.dataset.grava_no_campo);
                obj[campo] = (elms[k].value.trim() == "" || elms[k].value.trim() == "null") ? null : g$.getValueOption(elms[k], elms[k].value);
            }
            // Input
            else {
                campo = g$.filterCampo(elms[k].dataset.grava_no_campo);
                if (elms[k].dataset.tipo == "date") {
                    obj[campo] = (elms[k].value.trim() == "" || elms[k].value.trim() == "null") ? null : g$.formataDataBanco(elms[k].value);
                }
                else {
                    if (elms[k].type == "checkbox") {
                        obj[campo] = elms[k].checked;
                    }
                    else if (elms[k].value.trim() == "" || elms[k].value == "null") obj[campo] = null
                    else {
                        if (elms[k].dataset.formato && elms[k].dataset.formato != "" && elms[k].dataset.formato != "null") {
                            if (g$.mantem_mascara.indexOf(elms[k].dataset.formato) > -1) {
                                obj[campo] = elms[k].value;
                                if (elms[k].dataset.formato == "Date Time") obj[campo] = g$.formataDataBanco(obj[campo]);
                                if (elms[k].dataset.formato == "R$ Money") obj[campo] = elms[k].value.replace('.', '').replace(',', '.');
                            }
                            else {
                                obj[campo] = $(elms[k]).cleanVal();
                            }
                        }
                        else {
                            if (elms[k].dataset.mask && elms[k].dataset.mask != "" && elms[k].dataset.mask != "null") {
                                elms[k].value = elms[k].value.replace(".", "");
                                obj[campo] = elms[k].value.replace(",", ".");
                            } else {
                                obj[campo] = elms[k].value.replace(/\"/gm, '\\"');
                            }
                        }
                    }
                }
            }
        }

        if (event.target && event.target.tagName) {
            var elemento = event.target;
            while (!elemento.dataset.id) {
                elemento = elemento.parentElement;
            }
            elemento_id = elemento.dataset.id;
        }
        else if (isTela) {
            if (!id_elemento) {
                elemento_id = "loadTela"
            }
            else elemento_id = id_elemento;
        }
        else elemento_id = id_elemento;

        if (!view.querySelector("[data-nome='txt_id']") || view.querySelector("[data-nome='txt_id']").value == "") {
            obj = g$.omitirPropriedade(obj, true);
            g$.insertUpdateTela(obj, tabela, true, view, limpar, idFuncao, showMsg, elemento_id);
        }
        else {
            obj = g$.omitirPropriedade(obj, false);
            g$.insertUpdateTela(obj, tabela, false, view, limpar, idFuncao, showMsg, elemento_id);
        }
    }

    g$.insertUpdateTela = function (obj, tabela, insert, view, limpar, idFuncao, showMsg, elemento_id) {
        // Pega todos os objetos e faz uma requisicao com cada objeto a sua tabela 
        var banco, script, query;

        // var queryConsulta = "SELECT * FROM consulta WHERE tela_id = " + view.children[0].dataset.menu_id;

        // $http.get(URL + "/get/" + queryConsulta).success(function(data) {

        //     data = data.data;

        //     // Trata Excecao
        //     if (g$.exceptionRequisicao("Insert - SalvarTela", data)) return;;

        // Abre a Conexao com o banco do Usuario
        // banco = (!data[0].banco) ? $rootScope.user.banco : data[0].banco;

        banco = $rootScope.user.banco;
        banco_tabela = (tabela && tabela.indexOf('.') > -1) ? tabela : banco + "." + tabela;

        if (insert) {
            // Insert 
            query = g$.trataQueryInsert(banco_tabela, obj);
            query = g$.trataQuery(query.trim());

            if (g$.mySql_keys.indexOf(query.tipo) > -1) {
                query.script.tela_id = g$.tela_id;
                query.script.elemento_id = elemento_id;
            }
            $http.post(URL + "/jsonQuery/", query)
                .then(function (data, status) {
                    var texto;
                    data = data.data;

                    // Trata Excecao
                    if (g$.exceptionRequisicao("Insert - SalvarTela", data)) {
                        if (data.error.indexOf("Duplicate") > 1) {
                            texto = data.error;
                            return Materialize.toast("O valor " + texto.substring(texto.indexOf("for key ") + 9, texto.length - 1).replace("_UNIQUE", "") + " informado já está registrado!", 4000, 'red darken-1');
                        }
                        else return;
                    }

                    // script = {
                    //     script: data.query.replace(/"/g, "'"),
                    //     usuario_id: $rootScope.user.id,
                    //     banco: $rootScope.user.banco,
                    //     projeto_id: $rootScope.user.projeto_id,
                    //     data: new Date().toLocaleDateString().split("/").reverse().join("-"),
                    //     hora: new Date().toLocaleTimeString(),
                    //     tela_id: g$.tela_id,
                    //     elemento_id: elemento_id
                    // };

                    // g$.insertLog(script);

                    // pega id atravez do _id
                    if (JSON.parse(localStorage.user).nao_saas == 0) {
                        queryID = "SELECT id FROM " + banco + "." + tabela + " WHERE _id = " + data.data.insertId;
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryID.trim()))
                            .then(function (data) {


                                view.querySelector("[data-nome='txt_id']").value = data.data.data[0].id;
                                // Verifica se é pra limpar, se nao for para limpar, ele nao limpa
                                if (!limpar) g$.limparDadosView(false, view);
                                if (!showMsg) g$.alerta("Alerta", "Salvo com Sucesso");

                                // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
                                g$.vfyFuncaoDepois(idFuncao);
                            });
                    }
                    else {
                        view.querySelector("[data-nome='txt_id']").value = data.data.insertId;
                        // Verifica se é pra limpar, se nao for para limpar, ele nao limpa
                        if (!limpar) g$.limparDadosView(false, view);
                        if (!showMsg) g$.alerta("Alerta", "Salvo com Sucesso");

                        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
                        g$.vfyFuncaoDepois(idFuncao);
                    }
                });
        }
        else {
            // update
            query = g$.trataQueryUpdate(banco_tabela, obj);
            query = g$.trataQuery(query.trim());

            if (g$.mySql_keys.indexOf(query.tipo) > -1) {
                query.script.tela_id = g$.tela_id;
                query.script.elemento_id = elemento_id;
            }
            $http.post(URL + "/jsonQuery/", query)
                .then(function (data) {
                    var texto;

                    data = data.data;

                    // script = {
                    //     script: data.query.replace(/"/g, "'"),
                    //     usuario_id: $rootScope.user.id,
                    //     banco: $rootScope.user.banco,
                    //     projeto_id: $rootScope.user.projeto_id,
                    //     data: new Date().toLocaleDateString().split("/").reverse().join("-"),
                    //     hora: new Date().toLocaleTimeString(),
                    //     tela_id: g$.tela_id,
                    //     elemento_id: elemento_id
                    // };

                    // g$.insertLog(script);

                    // Trata Excecao
                    if (g$.exceptionRequisicao("Insert - SalvarTela", data)) {
                        if (data.error.indexOf("Duplicate") > 1) {
                            texto = data.error;
                            return Materialize.toast("O valor " + texto.substring(texto.indexOf("for key ") + 9, texto.length - 1).replace("_UNIQUE", "") + " informado já está registrado!", 4000, 'red darken-1');
                        }
                        else return;
                    }

                    if (!showMsg) g$.alerta("Alerta", "Salvo com Sucesso");

                    // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
                    g$.vfyFuncaoDepois(idFuncao);

                });
        }
    }

    g$.limparDadosView = function (params, view) {
        var view, elms;

        if (event.target.id == "seta_treeview") return;

        if (params) {
            var params = g$.alterSargentos(params),
                view = params[1].trim(),
                cond = params[2],
                idFuncao = params[0].split("¦")[1],
                valida = (!cond) ? true : g$.validaCondicao(cond);

            if (valida == false) {
                console.log("Não executou porque" + cond + " é falso");
                return g$.vfyFuncaoDepois(idFuncao);
            };

            // Se ele passar view, vai pegar o Popup
            if (view == "view") view = $("#view .card-content")[0];
            else {
                if ($("#view [data-id = " + view + "]")[0].id == "tab") view = $("#view [data-id = " + view + "]")[1];
                else view = $("#view [data-id = " + view + "]")[0];
            }
        }
        else view = view;

        if (!view) return;
        elms = view.querySelectorAll("input, select, textarea, img");

        for (var i = 0; i < elms.length; i++) {
            elm = elms[i];
            if (elm.type == "checkbox") elm.checked = false;
            else if (elm.id == "selectbox") {
                elm.dataset.value = "";
                elm.value = "";
            }
            else if (elm.id == "imagem") elm.src = "http://54.233.66.37/img/sem-imagem.jpg"
            else elm.value = "";
        }

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao);

        return event.preventDefault();
    }

    g$.showHide = function (params, isTela) {
        var params = g$.alterSargentos(params),
            elms = params[1].split("¦"), elm,
            idFuncao = params[0].split("¦")[1],
            cond = params[2],
            classe = (params[3] && params[3].trim() != "") ? params[3].trim() : params[3],
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        for (var i = 1; i < elms.length; i++) {
            elm = $("#view [data-id='" + elms[i].trim() + "']")[0];

            if (elm) {
                if (classe && classe != "") {
                    elm.classList.remove(classe.split("¦")[1].trim());
                    elm.classList.add(classe.split("¦")[0].trim());
                }
                else {
                    if (elm.id == "botao") {
                        elm.classList.remove("play-block");
                        elm.classList.add("play-none");
                    }
                    else {
                        elm.classList.remove("dys-show");
                        elm.classList.add("dys-hide");
                    }
                }
            }
        }

        elm = $("#view [data-id='" + elms[0].trim() + "']")[0];
        if (elm) {
            if (!classe) {
                elm.classList.toggle("dys-show");
                elm.classList.toggle("dys-hide");
            }
        }

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.alteraPropriedadeBloco = function (params, isTela) {
        var params = g$.alterSargentos(params),
            elemento, elmBloco, lenBlocos, elmsBloco, params,
            id_elemento = params[1].trim(),
            propriedade = params[2].trim(),
            valor = (params[3] && params[3].trim() != "") ? params[3].trim() : params[3],
            filtro = (params[4] && params[4].trim() != "") ? "[data-" + params[4].trim() + "]" : "",
            cond = params[5],
            idFuncao = params[0].split("¦")[1];

        elemento = $("[data-id='" + id_elemento + "']")[0];

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        elmBloco = g$.procuraBloco(elemento);
        elmsBloco = $("[data-id='" + elmBloco.dataset.id + "'] " + filtro);
        lenBlocos = elmsBloco.length;

        for (var i = 0; i < lenBlocos; i++) {
            elmBloco = g$.procuraBloco(elmsBloco[i]);
            elemento = (elmBloco.dataset.id == id_elemento) ? elmBloco : elmBloco.querySelector("[data-id='" + id_elemento + "']");
            params = " || " + propriedade + " | " + valor + " | ";
            g$.alteraPropriedade(params, false, elemento);
        }

        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.alteraGraficoTorreBloco = function (params, isTela) {
        var params = g$.alterSargentos(params),
            elemento, elmBloco, lenBlocos, elmsBloco, params,
            id_elemento = params[1].trim(),
            porcentagem = params[2].trim(),
            cor = params[3].trim(),
            descricao = params[4].trim(),
            filtro = (params[5] && params[5].trim() != "") ? "[data-" + params[5].trim() + "]" : "",
            cond = params[6],
            idFuncao = params[0].split("¦")[1];

        elemento = $("[data-id='" + id_elemento + "']")[0];

        elmBloco = g$.procuraBloco(elemento);
        elmsBloco = $("[data-id='" + elmBloco.dataset.id + "'] " + filtro);
        lenBlocos = elmsBloco.length;

        for (var i = 0; i < lenBlocos; i++) {
            elmBloco = g$.procuraBloco(elmsBloco[i]);
            elemento = (elmBloco.dataset.id == id_elemento) ? elmBloco : elmBloco.querySelector("[data-id='" + id_elemento + "']");
            if (porcentagem.indexOf("ID_BLOCO") > -1) {
                params = porcentagem.replace(porcentagem, elmBloco.querySelector("[data-id='" + porcentagem.split("ID_BLOCO ¦")[1].trim() + "']").innerHTML);
            }
            else params = porcentagem
            if (cor.indexOf("ID_BLOCO ¦") > -1) {
                params += " | " + cor.replace(cor, elmBloco.querySelector("[data-id='" + cor.split("ID_BLOCO ¦")[1].trim() + "']").innerHTML);
            }
            else params += " | " + cor;
            if (descricao.indexOf("ID_BLOCO ¦") > -1) {
                params += " | " + descricao.replace(descricao, elmBloco.querySelector("[data-id='" + descricao.split("ID_BLOCO ¦")[1].trim() + "']").innerHTML);
            }
            else params += " | " + descricao;

            params = " || " + params;
            g$.graficoTorre(params, false, null, elemento);
        }

        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.alteraPropriedadeTabela = function (params, isTela) {
        var params = g$.alterSargentos(params),
            elemento, elmTabela, lenTabela, elmsTabela, params,
            id_elemento = params[1].trim(),
            propriedade = params[2].trim(),
            valor = (params[3] && params[3].trim() != "") ? params[3].trim() : params[3],
            filtro = (params[4] && params[4].trim() != "") ? "[data-" + params[4].trim() + "]" : "",
            cond = params[5],
            idFuncao = params[0].split("¦")[1];

        elemento = $("[data-id='" + id_elemento + "']")[0];

        elmTabela = g$.procuraTabela(elemento);
        elmsTabela = $("[data-id='" + elmTabela.dataset.id + "'] " + filtro);
        lenTabela = elmsTabela.length;

        for (var i = 0; i < lenTabela; i++) {
            elmTabela = g$.procuraTabela(elmsBloco[i]);
            elemento = (elmBloco.dataset.id == id_elemento) ? elmBloco : elmBloco.querySelector("[data-id='" + id_elemento + "']");
            params = " || " + propriedade + " | " + valor + " | ";
            g$.alteraPropriedade(params, false, elemento);
        }

        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    // Procura o bloco e retorna o elemento que quer alterar
    g$.procuraBloco = function (elm) {
        var elmBloco;
        if (elm.dataset.nome == "BLOCO" || elm.dataset.nome == "BLOCO_CHECK") {
            elmBloco = elm.parentElement;
        }
        else if (elm.parentElement.dataset.nome == "BLOCO" || elm.parentElement.dataset.nome == "BLOCO_CHECK") {
            elmBloco = elm.parentElement;
        }
        else if (elm.parentElement.parentElement.dataset.nome == "BLOCO" || elm.parentElement.parentElement.dataset.nome == "BLOCO_CHECK") {
            elmBloco = elm.parentElement.parentElement;
        }
        else if (elm.parentElement.parentElement.parentElement.dataset.nome == "BLOCO" || elm.parentElement.parentElement.parentElement.dataset.nome == "BLOCO_CHECK") {
            elmBloco = elm.parentElement.parentElement.parentElement;
        }
        else if (elm.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO" || elm.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO_CHECK") {
            elmBloco = elm.parentElement.parentElement.parentElement.parentElement;
        }
        else if (elm.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO" || elm.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO_CHECK") {
            elmBloco = elm.parentElement.parentElement.parentElement.parentElement.parentElement;
        }
        else if (elm.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO" || elm.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.nome == "BLOCO_CHECK") {
            elmBloco = elm.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        }
        return elmBloco;
    }

    g$.alteraPropriedade = function (params, isTela, elm) {
        var params = g$.alterSargentos(params),
            // elemento = (elm && elm.tagName) ? elm : $("#view [data-id='" + params[1].trim() + "']")[0],
            propriedade = params[2].trim(),
            valor = (params[3] && params[3].trim() != "") ? params[3].trim() : params[3],
            cond = params[4],
            idFuncao = params[0].split("¦")[1],
            elementos = params[1].split("¦"),
            valores = (valor && valor != "") ? params[3].split("¦") : false;

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        elementos.forEach(function (v, i) {
            elemento = (elm && elm.tagName) ? elm : $("#view [data-id='" + v.trim() + "']")[0];

            if (valores.length > 1) {
                if (valores[i] && valores[i].trim() != "") valor = valores[i].trim()
                else valor = valores[i];
            }
            else if (valores[0] && valores[0].trim() != "") {
                if (elemento.dataset.filtro_bloco) {
                    $scope.$parent.$parent["e_" + elemento.dataset.id_filtro_bloco] = valores[0].trim();
                }
                else valor = valores[0].trim();
            }
            else {
                if (elemento.dataset.filtro_bloco) {
                    $scope.$parent.$parent["e_" + elemento.dataset.id_filtro_bloco] = valores[0].trim();
                }
                else valor = valores[0];
            }

            // if(elemento.indexOf("_bloco") > 1) g$.procuraElementoBloco(elemento);
            // else elemento = $("#view [data-id='" + elemento + "']")[0];

            if (propriedade == "cor") elemento.style.color = valor;
            else if (propriedade == "fundo") elemento.style.background = valor;
            else if (propriedade == "valor") {
                if (elemento.id == "selectbox") g$.getValorComboBanco(elemento, valor);
                else if (elemento.dataset.tipo == "checkbox") elemento.checked = (valor.trim() == "1");
                else if (elemento.tagName == "INPUT") {
                    if (elemento.dataset.formato && elemento.dataset.formato != "" && elemento.dataset.formato != "null") {
                        if (elemento.dataset.formato == "Money" || elemento.dataset.formato == "R$ Money") {
                            if (valor.toString() != "") elemento.value = g$.setValorFormatado(valor);
                        }
                        else {
                            if (elemento.dataset.filtro_bloco) {
                                elemento.value = (valor && valor.trim() != "") ? $(elemento).masked(valor) : "";
                                $scope["e_" + elemento.dataset.id_filtro_bloco] = elemento.value;
                            }
                            else elemento.value = (valor && valor.trim() != "") ? $(elemento).masked(valor) : "";
                        }
                    }
                    else elemento.value = valor;
                }
                else if (elemento.tagName == "TEXTAREA") elemento.value = valor.replace(/\\n/g, "\n");
                else if (elemento.tagName == "LABEL") {
                    if (elemento.dataset.formato && elemento.dataset.formato != "" && elemento.dataset.formato != "null") {
                        if (elemento.dataset.formato == "Money" || elemento.dataset.formato == "R$ Money") {
                            if (valor.toString() != "") elemento.innerHTML = g$.setValorFormatado(valor);
                        }
                        else elemento.innerHTML = (valor && valor.trim() != "") ? $(elemento).masked(valor) : "";
                    }
                    else elemento.innerHTML = valor;
                }
                else if (elemento.id == "botao") elemento.innerHTML = valor;
                else if (elemento.tagName == "IMG") {
                    if (valor.indexOf("http") > -1) elemento.src = valor;
                    else elemento.src = "http://54.233.66.37/" + $rootScope.user.banco + "/" + valor;
                }
                else if (elemento.id == "coluna") elemento.innerText = valor;
                else if (elemento.id == "td") $("[data-id='" + elemento.dataset.pai + "'] th")[elemento.cellIndex].innerHTML = valor;
            }
            else if (propriedade == "largura") {
                if (valor && valor != "") elemento.setAttribute("style", elemento.getAttribute("style") + " width: " + valor + "px !important;");
            }
            else if (propriedade == "tamanho") {
                if (valor && valor != "") elemento.setAttribute("style", elemento.getAttribute("style") + " height: " + valor + "px !important;");
            }
            else if (propriedade == "foco") {
                if (elemento.id == "selectbox") elemento.querySelector("#selectbox").focus();
                else if (elemento.tagName == "INPUT") elemento.focus();
                else elemento.focus();
            }
            else if (propriedade == "display") {
                if (valor.trim() == "" && elemento.tagName != "I") valor = "block";
                if (elemento.id == "selectbox") elemento.querySelector("#selectbox").style.display = valor;
                else if (elemento.tagName == "INPUT") elemento.style.display = valor;
                else if (elemento.tagName == "TD") {
                    var tds = $("[data-id='" + v.trim() + "']"),
                        tabela = tds[0].parentElement.parentElement.parentElement,
                        th = tabela.querySelectorAll("th")[tds[0].cellIndex];
                    if (valor == "none") {
                        tds.addClass("play-none");
                        th.classList.add("play-none");
                    }
                    else {
                        tds.removeClass("play-none");
                        th.classList.remove("play-none");
                    }
                }
                else elemento.style.display = valor.trim();
            }
            else if (propriedade == "disabled") {
                if (elemento.id == "selectbox") {
                    if (valor == "true") elemento.querySelector("#selectbox").setAttribute("disabled", valor);
                    else elemento.querySelector("#selectbox").removeAttribute("disabled");
                }
                else if (elemento.tagName == "INPUT") {
                    if (valor == "true") elemento.setAttribute("disabled", valor);
                    else elemento.removeAttribute("disabled");
                }
                else if (elemento.id == "tabela") {
                    if (valor == "true") {
                        elemento.dataset.bloqueado = 1;
                        elemento.querySelectorAll("tr")[elemento.querySelectorAll("tr").length - 1].classList.add("play-none");
                    }
                    else {
                        elemento.dataset.bloqueado = 0;
                        elemento.querySelectorAll("tr")[elemento.querySelectorAll("tr").length - 1].classList.remove("play-none");
                    }
                }
                else {
                    if (valor == "true") elemento.setAttribute("disabled", valor);
                    else elemento.removeAttribute("disabled");
                }
            }
            else if (propriedade == "disabledColuna") {
                if (elemento.id == "coluna") {
                    var inputs = elemento.querySelectorAll("input");
                    inputs.forEach(function (v, i) {
                        if (valor == "true") v.setAttribute("disabled", valor);
                        else v.removeAttribute("disabled");
                    })
                }
            }
            else if (propriedade == "removeClasse") {
                if (valor != "") {
                    for (var i = 0; i < valor.split(" ").length; i++) {
                        elemento.classList.remove(valor.split(" ")[i]);
                    }
                }
            }
            else if (propriedade == "addClasse") {
                if (valor != "") {
                    for (var i = 0; i < valor.split(" ").length; i++) {
                        elemento.classList.add(valor.split(" ")[i]);
                    }
                }
            }
            else if (propriedade == "toggleClasse") {
                if (valor != "") {
                    elemento.classList.toggle(valor);
                }
            }
            else if (propriedade == "nullCol") {
                var cols = $("[data-nome=" + params[1].split("¦")[0] + "] [data-id=" + params[1].split("¦")[1] + "]");
                for (var i = 0; i < cols.length; i++) {
                    cols[i].textContent = "";
                }
            }
            else if (propriedade == "obrigatorio") {
                if (valor == "true" || valor == "1") {
                    if (elemento.id == "selectbox") elemento.querySelector("#selectbox").setAttribute("required", true);
                    else elemento.setAttribute("required", true);
                }
                else if (valor == "false" || valor == "0") {
                    if (elemento.id == "selectbox") elemento.querySelector("#selectbox").removeAttribute("required");
                    else elemento.removeAttribute("required");
                }
            }
            else if (propriedade == "size") {
                elemento.style.fontSize = valor;
            }
        });

        // Verifica se tem função depois
        g$.vfyFuncaoDepois(idFuncao, isTela);

    }

    // g$.falar = function (params) {
    //     var params = g$.alterSargentos(params),
    //         msg = params[1],
    //         cond = params[2],
    //         idFuncao = params[0].split("¦")[1],
    //         valida = (!cond) ? true : g$.validaCondicao(cond);

    //     if (valida == false) {
    //         console.log("Não executou porque " + cond + " é falso");
    //         return g$.vfyFuncaoDepois(idFuncao);
    //     };
    //     msg = new SpeechSynthesisUtterance(msg);
    //     window.speechSynthesis.speak(msg);
    //     g$.vfyFuncaoDepois(idFuncao);
    // }

    g$.carregaQuery = function (params, isTela, id_elemento, callback) {
        var banco = $rootScope.user.banco, campo, script, elemento_id, elemento = event.target,
            params = g$.alterSargentos(params),
            query = params[1],
            elms = params[2],
            cond = params[3],
            msg = params[4],
            alerta_param = (params[5] && params[5].indexOf("1") > -1) ? true : false,
            idFuncao = params[0].split("¦")[1];

        // if(!("#loadzinTelaCq")[0]){
        //     loadzinTela = angular.element($.template[0]["loadzinTela"])[0];
        //     document.body.append(loadzinTela);
        //     $("#loadzinTela")[0].id = "loadzinTelaCq"
        // }

        var query = g$.trataQuery(query.trim()), tabela = "";

        if (elemento && elemento.tagName) {
            while (!elemento.dataset.id) {
                elemento = elemento.parentElement;
            }
            elemento_id = elemento.dataset.id;
        }
        else if (isTela) {
            if (!id_elemento) {
                elemento_id = "loadTela"
            }
            else elemento_id = id_elemento;
        }
        else elemento_id = id_elemento;

        if (g$.mySql_keys.indexOf(query.tipo) > -1) {
            query.script.tela_id = g$.tela_id;
            query.script.elemento_id = elemento_id;
        }

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            // $("#loadzinTelaCq")[0].outerHTML = "";
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        $http.post(URL + "/jsonQuery/", query).success(function (data) {

            // Trata Excecao
            g$.exceptionRequisicao("CarregaQuery - Tela", data);
            if (elms && elms.indexOf("insertID") > -1) {
                tabela = data.query.substring(data.query.indexOf("INTO") + 5, data.query.indexOf("(")).trim();
            }

            data = data.data;

            if (!data) return; //$("#loadzinTelaCq")[0].outerHTML = "";

            if (data[0]) {
                if (data[0][0]) {
                    if (alerta_param) data[0] = data[data.length - 2][0];
                    else data[0] = data[0][0];
                }
                else data[0] = data[0];
            }

            // Tratamento de mensagem
            // Verifica se deu erro        
            g$.mensagemCarregaQuery(data, msg);

            // Só vai entrar se for insert
            if (data && data.insertId) {
                // Se o elemento tiver memo e o insertID, guarda no memo que esta passando

                if (elms && elms.indexOf("insertID") > -1) {
                    if (JSON.parse(localStorage.user).nao_saas == 0) {
                        queryID = "SELECT id FROM " + tabela + " WHERE _id = " + data.insertId;
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryID.trim()))
                            .then(function (data) {
                                insertId = data.data.data[0].id;

                                if (elms.indexOf("memo") > -1) g$[elms.split("_")[0].trim()] = insertId;
                                else {
                                    campo = $("#view [data-id=" + elms.split("_")[0].trim() + "]")[0];
                                    if (campo) {
                                        if (campo.id == "selectbox") {
                                            g$.getValorComboBanco(campo, insertId);
                                        }
                                        else if (campo.id == "label" || campo.id == "marquee") campo.innerHTML = insertId;
                                        else campo.value = insertId;
                                    }
                                }
                            });
                    } else {
                        if (elms.indexOf("memo") > -1) g$[elms.split("_")[0].trim()] = data.insertId;
                        else {
                            campo = $("#view [data-id=" + elms.split("_")[0].trim() + "]")[0];
                            if (campo) {
                                if (campo.id == "selectbox") {
                                    g$.getValorComboBanco(campo, insertId);
                                }
                                else if (campo.id == "label" || campo.id == "marquee") campo.innerHTML = insertId;
                                else campo.value = insertId;
                            }
                        }
                    }
                }
            }

            // Só vai entrar se trazer alguma coisa na consulta
            if (data[0]) {
                // Se passar os elementos é porque tem um retorno
                if (elms && elms.trim() != "") {
                    elms = elms.split("¦");
                    for (var i = 0; i < elms.length; i++) {
                        // Se o elemento for memo, é para guardar
                        if (elms && elms[i].trim().indexOf("memo") > -1) {
                            g$[elms[i].trim()] = data[0][Object.keys(data[0])[i]];
                        }
                        // Senao mostra o valor no elemento
                        else {
                            campo = $("#view [data-id=" + elms[i].trim() + "]")[0];
                            if (campo) {
                                if (campo.id == "selectbox") {
                                    g$.getValorComboBanco(campo, data[0][Object.keys(data[0])[i]]);
                                }
                                else if (campo.id == "label" || campo.id == "marquee") {
                                    var valor = data[0][Object.keys(data[0])[i]];
                                    if (campo.dataset.formato && campo.dataset.formato != "" && campo.dataset.formato != "null") {
                                        if (campo.dataset.formato == "Money" || campo.dataset.formato == "R$ Money") {
                                            if (data[0][Object.keys(data[0])[i]] || data[0][Object.keys(data[0])[i]] === 0) {
                                                if (data[0][Object.keys(data[0])[i]].toString() != "") campo.innerHTML = g$.setValorFormatado(valor);
                                            }
                                        }
                                        else campo.innerHTML = (valor) ? $(campo).masked(valor) : "";
                                    }
                                    else campo.innerHTML = valor;
                                }
                                else if (campo.dataset.tipo == "checkbox") campo.checked = (data[0][Object.keys(data[0])[i]] == "1");
                                else if (campo.id == "imagem") {
                                    if (data[0][Object.keys(data[0])[i]] && data[0][Object.keys(data[0])[i]].split("http")[1]) {
                                        campo.src = data[0][Object.keys(data[0])[i]];
                                    }
                                    else if (!data[0][Object.keys(data[0])[i]] || data[0][Object.keys(data[0])[i]] == "" || data[0][Object.keys(data[0])[i]] == "null") {
                                        campo.src = "http://54.233.66.37/img/sem-imagem.jpg";
                                    }
                                    else {
                                        campo.src = "http://54.233.66.37/" + user.projeto + "/" + data[0][Object.keys(data[0])[i]];
                                    }
                                }
                                else {
                                    if (campo.dataset.tipo == "date-time" && data[0][Object.keys(data[0])[i]] && (data[0][Object.keys(data[0])[i]] != ""))
                                        campo.value = g$.formataDateTime(data[0][Object.keys(data[0])[i]]);
                                    else if (campo.dataset.tipo == "date" && data[0][Object.keys(data[0])[i]] && (data[0][Object.keys(data[0])[i]] != ""))
                                        campo.value = g$.formataData(data[0][Object.keys(data[0])[i]]);
                                    else {
                                        if (campo.dataset.formato && campo.dataset.formato != "" && campo.dataset.formato != "null") {
                                            if (campo.dataset.formato == "Money" || campo.dataset.formato == "R$ Money") {
                                                if (data[0][Object.keys(data[0])[i]]) {
                                                    if (data[0][Object.keys(data[0])[i]].toString() != "") campo.value = g$.setValorFormatado(data[0][Object.keys(data[0])[i]]);
                                                }
                                            }
                                            else {
                                                if (data[0][Object.keys(data[0])[i]]) {
                                                    campo.value = $(campo).masked(data[0][Object.keys(data[0])[i]]);
                                                }
                                            }
                                        }
                                        else {
                                            if (campo.dataset.filtro_bloco) {
                                                $scope.$parent.$parent["e_" + campo.dataset.id_filtro_bloco] = data[0][Object.keys(data[0])[i]];
                                            }
                                            else campo.value = data[0][Object.keys(data[0])[i]];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // se tiver callback
            if (callback && typeof (callback) == "function") callback(data);
            //$("#loadzinTelaCq")[0].outerHTML = "";
            // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
            g$.vfyFuncaoDepois(idFuncao, isTela);
        });
    }

    // Tratamento de mensagem
    // Verifica se deu erro
    g$.mensagemCarregaQuery = function (data, msg, alerta_param) {
        if (msg && msg.split("¦")[0].trim() == "alert") {
            // se tiver um subparametro na mensagem
            if (msg.split("¦")[1]) g$.alerta("Alerta", msg.split("¦")[1].trim());
            else if (msg.split("¦")[2]) g$.alerta("Erro!", msg.split("¦")[1].trim());
            // se nao executa a mensagem da procedure 
            else g$.alerta("Alerta", data[0][Object.keys(data[0])[0]]);
        }
        else if (msg && msg.split("¦")[0].trim() == "toast") {
            // se tiver um subparametro na mensagem
            if (msg.split("¦")[1]) Materialize.toast(msg.split("¦")[1].trim(), 4000, 'grey darken-3');
            else if (msg.split("¦")[2]) Materialize.toast(msg.split("¦")[1].trim(), 4000, 'grey darken-3');
            // se nao executa a mensagem da procedure 
            else Materialize.toast(data[0][Object.keys(data[0])[0]], 4000, 'grey darken-3');
        }
    }

    g$.buscaCEP = function (params) {
        var params = g$.alterSargentos(params),
            valor = params[1].trim(),
            idFuncao = params[0].split("¦")[1],
            elms = params[2].split("¦");

        $http.get("https://viacep.com.br/ws/" + valor + "/json/unicode/").success(function (data) {
            if (data.erro || data.status == 0) return g$.alerta("Erro!", "CEP não encontrado!");
            if (elms) {
                for (var i = 0; i < elms.length; i++) {
                    if (elms && elms[i].trim().indexOf("memo") > -1) {
                        g$[elms[i].trim()] = data[0][Object.keys(data[0])[i]];
                    }
                    else {
                        if (elms[i] && elms[i].trim() != "") {
                            campo = $("#view [data-id=" + elms[i].trim() + "]")[0];
                            if (campo) {
                                if (campo.id == "selectbox") g$.getValorComboBanco(campo, data[Object.keys(data)[i]]);
                                else campo.value = data[Object.keys(data)[i]];
                            }
                        }
                    }
                }
                g$.vfyFuncaoDepois(idFuncao);
            }
        });
    }

    g$.openFile = function (params) {
        var params = g$.alterSargentos(params),
            arquivo = (params[1].trim().indexOf('/') > -1) ? params[1].trim() : 'https://dys.net.be/' + $rootScope.user.projeto + '/' + params[1].trim(),
            cond = params[2],
            tamanho = (params[3] && params[3].trim() != "") ? params[3].split("¦") : false,
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            return console.log("Não executou porque " + cond + " é falso");
        };
        // if (params[1].indexOf(".pdf") > 0) {
        //     var ref = window.open(params[1], '_system', 'location=yes');
        //     ref.addEventListener('loadstart', function () {
        //         console.log("START");
        //     });
        // }
        // else {
        //     var ref = window.open(params[1], '_blank', 'location=yes');
        //     ref.addEventListener('loadstart', function () {
        //         console.log("START");
        //     });
        // }
        if (tamanho) window.open(arquivo, "", "width=" + tamanho[1], "height=" + tamanho[2]);
        else window.open(arquivo, "_blank");
    }

    g$.convertImgToBase64 = function (params) {
        var params = g$.alterSargentos(params),
            idFuncao = params[0].split("¦")[1],
            url = params[1].trim(),
            memo = params[2].trim(),
            cond = params[3],
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };

        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            g$[memo] = dataURL;
            canvas = null;
            g$.vfyFuncaoDepois(idFuncao);
        };
        img.src = url;
    }

    g$.importaExtrato = function (params) {
        // importExtrato | caminho | arquivo | carteira | cond | inicio | fim | carteiraElm
        var params = g$.alterSargentos(params),
            caminho = params[1].trim(),
            arquivo = params[2].trim(),
            carteira = params[3].trim(),
            cond = params[4],
            dataInicio = params[5],
            dataFim = params[6],
            elmCarteira = params[7],
            idFuncao = params[0].split("¦")[1],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            insertExtrato, queryCarteira;

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };

        if (arquivo.indexOf("½") > -1) {
            arquivo = arquivo.split($rootScope.user.projeto + "½")[1];
        }

        if ((carteira && carteira != "") || arquivo.toLowerCase().indexOf(".ofx") > -1) {
            if (arquivo.toLowerCase().indexOf(".ofx") > -1) {

                $.post("/leOFX/", { arquivo: caminho + "/" + arquivo }).success(function (data) {
                    if (data.OFX) {
                        var transacoes, banco, conta, valor, values = '', listagem = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS, inicio = '9999-12-30', fim = '0000-01-01';
                        // if (listagem.length) {
                        //     listagem.forEach(function (v) {
                        banco = listagem.BANKACCTFROM.BANKID;
                        conta = listagem.BANKACCTFROM.ACCTID;
                        queryCarteira = "SELECT id FROM " + $rootScope.user.banco + ".carteira WHERE banco = '" + banco + "' AND conta = '" + conta + "'";
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryCarteira.trim())).success(function (data) {
                            carteira = (data.data.length && data.data[0].id && data.data[0].id != "") ? data.data[0].id : carteira;
                            if (carteira && carteira != "") {
                                transacoes = listagem.BANKTRANLIST.STMTTRN;
                                if (transacoes.length) {
                                    transacoes.forEach(function (t) {
                                        dia = t.DTPOSTED;
                                        dia = dia.substr(0, 4) + '-' + dia.substr(4, 2) + '-' + dia.substr(6, 2);
                                        if (inicio > dia) inicio = dia;
                                        if (fim < dia) fim = dia;
                                        valor = (t.TRNAMT && t.TRNAMT != "") ? (t.TRNAMT.lastIndexOf(',') == t.TRNAMT.length - 3) ? t.TRNAMT.replace(",", ".") : t.TRNAMT : '';
                                        if (dia != "" && t.MEMO != "" && t.FITID != "" && valor != "")
                                            values = values + "('" + dia + "','" + t.MEMO + "','" + t.FITID + "','" + valor + "','" + carteira + "'),";
                                    });
                                }
                                //     });
                                // }
                                insertExtrato = "INSERT INTO " + $rootScope.user.banco + ".extrato_bancario (data, historico, documento, valor, carteira_id) VALUES " + values.substring(0, values.lastIndexOf(","));
                                insertExtrato = insertExtrato.replace(/''/g, "null").replaceAll("�", "?");
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(insertExtrato.trim())).success(function (data) {
                                    if (!data.err) {
                                        g$.exceptionRequisicao("INSERT - Extrato_Bancario", data);
                                        g$.alerta("Alerta", "Extrato importado com sucesso!");
                                        if (dataInicio && dataFim && dataInicio != "" && dataFim != "")
                                            g$.alteraPropriedade("alteraPropriedade¦ " + idFuncao + "| " + dataInicio + "¦" + dataFim + "¦" + elmCarteira + "| valor | " + inicio + "¦" + fim + "¦" + carteira);
                                        else
                                            g$.vfyFuncaoDepois(idFuncao);
                                    } else {
                                        g$.alerta("Alerta", "Falha ao inserir!");
                                        console.log(data.error);
                                        console.log(data.query);
                                    }
                                });
                                console.log(insertExtrato);
                            }
                            else g$.alerta("Alerta", "Nenhuma Carteira encontrada");
                        });
                    } else g$.alerta("Alerta", "OFX inválido ou não suportado");
                });
            } else {

                $.post("/xlsxtojson/", { nome: arquivo, caminho: caminho }, function (data) {
                    var transacoes = data, values = '', documento, dia, historico, valor, inicio = '9999-12-30', fim = '0000-01-01';

                    transacoes.forEach(function (transacao, i) {
                        console.log("entrou " + i);
                        documento = '';
                        dia = '';
                        historico = '';
                        valor = '';
                        if (i >= 2) {
                            console.log("entrou no if " + i);
                            [Object.keys(transacao)][0].forEach(function (chave, j) {
                                if (chave == "AGENCIA") {
                                    console.log("`AGENCIA " + i);
                                    dia = transacao[Object.keys(transacao)[j]];
                                    if (dia.indexOf("/") > -1) dia = dia.split("/").reverse().join("-");
                                }
                                else if (chave == "CONTA") historico = transacao[Object.keys(transacao)[j]];
                                else if (chave.length == 9) documento = transacao[Object.keys(transacao)[j]];
                                else if (chave == "") {
                                    valor = transacao[Object.keys(transacao)[j]];
                                    // if (valor.indexOf(",") > -1)
                                    valor = valor.replaceAll(",", "");
                                }
                            });
                            if (inicio > dia) inicio = dia;
                            if (fim < dia) fim = dia;
                            if (dia != "" && historico != "" && documento != "" && valor != "")
                                values = values + "('" + dia + "','" + historico + "','" + documento + "','" + valor + "','" + carteira + "'),";
                        }
                    });
                    insertExtrato = "INSERT INTO " + $rootScope.user.banco + ".extrato_bancario (data, historico, documento, valor, carteira_id) VALUES " + values.substring(0, values.lastIndexOf(","));
                    insertExtrato = insertExtrato.replace(/''/g, "null").replaceAll("�", "?");

                    $http.post(URL + "/jsonQuery/", g$.trataQuery(insertExtrato.trim())).success(function (data) {
                        if (!data.err) {
                            // g$.exceptionRequisicao("INSERT - Extrato_Bancario", data);
                            g$.alerta("Alerta", "Extrato importado com sucesso!");
                            if (dataInicio && dataFim && dataInicio != "" && dataFim != "")
                                g$.alteraPropriedade("alteraPropriedade¦ " + idFuncao + "| " + dataInicio + "¦" + dataFim + "| valor | " + inicio + "¦" + fim);
                            else
                                g$.vfyFuncaoDepois(idFuncao);
                        } else {
                            g$.alerta("Alerta", "Falha ao inserir!");
                            console.log(data.error);
                            console.log(data.query);
                        }
                    });
                });
            }
        }
        else g$.alerta("Alerta", "Nenhuma Carteira selecionada");
    }

    g$.pegaTextoArquivo = function (params) {
        var params = g$.alterSargentos(params),
            arquivo = params[1],
            elm = params[2],
            cond = params[3],
            idFuncao = params[0].split("¦")[1],
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };

        // "DYS_TEMPLATE/router.js"

        $http.post(URL + "/leArquivo/", { arquivo: arquivo }).success(function (data) {
            var conteudo = data;
            // Se passar os elementos é porque tem um retorno
            if (elm && elm.trim() != "") {
                // Se o elemento for memo, é para guardar
                if (elm && elm.trim().indexOf("memo") > -1) {
                    g$[elm.trim()] = conteudo;
                }
                // Senao mostra o valor no elemento
                else {
                    campo = $("#view [data-id=" + elms[i].trim() + "]")[0];
                    if (campo) {
                        if (campo.id == "label") {
                            campo.innerHTML = conteudo;
                        }
                        else campo.value = conteudo;
                    }

                }
            }
        });
    }

    g$.geraArquivo = function (params) {
        // geraArquivo | caminho | nome | conteudo | baixar/abrir | condicao 
        var params = g$.alterSargentos(params),
            caminho = params[1].trim(),
            nomes = params[2].trim(),
            conteudos = params[3].trim(),
            acao = (params[4]) ? params[4].trim() : "",
            cond = (params[5]) ? params[5].trim() : "",
            idFuncao = params[0].split("¦")[1],
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };

        nomes = nomes.split("¦");
        conteudos = conteudos.split("¦");

        if (nomes.length == conteudos.length) {
            for (var i = 0; i < nomes.length; i++) {
                nome = null;
                nome = (nomes[i].trim().indexOf(".") == -1) ? nomes[i].trim() + ".txt" : nomes[i].trim();
                obj = { arquivo: conteudos[i], caminho: caminho, nome: nome };

                console.log(obj.caminho + "/" + obj.nome);
                console.log(obj.arquivo);
                console.log('--------------------------------------------------------');
                $http.post(URL + "/geraArquivo/", obj).success(function (data) {
                    console.log(data);
                    if (acao && acao == "baixar")
                        g$.download('download ¦ ' + idFuncao + ' | ' + obj.caminho + "/" + obj.nome);
                    else if (acao && acao == "abrir")
                        g$.openFile('openFile ¦ ' + idFuncao + ' | ' + obj.caminho + "/" + obj.nome);

                    // if (data.status == 'ok') {
                    //     if (acao && acao == "baixar")
                    //         g$.download('download ¦ ' + idFuncao + ' | ' + data.caminho);
                    //     else if (acao && acao == "abrir")
                    //         g$.openFile('openFile ¦ ' + idFuncao + ' | ' + data.caminho);
                    // }else console.log("Erro: ", data.caminho);
                });
            }
        }
        // (params[2].trim().indexOf(".") == -1) ? params[2].trim() + ".txt" : params[2].trim(),
    }

    g$.geraBarcode = function (params) {
        var params = g$.alterSargentos(params),
            queryProduto = "SELECT * FROM " + $rootScope.user.banco + ".produto where id = " + params[1],
            etiquetaID = params[2].trim(),
            destino = params[3].trim(),
            quantidade = parseInt(params[4].trim());
        semvalid = params[5].trim();
        origem = params[6].trim();

        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryProduto.trim())).success(function (data) {

            // Trata Excecao
            if (g$.exceptionRequisicao("Gerar BarCode - QueryProduto", data)) return;

            data = data.data;

            var vlr = "R$:" + data[0].valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), tmp
            $("[data-id='" + destino + "']")[0].innerHTML = "";
            // var validades = (semvalid == 1)?'Indeterminado'
            var validades = 'Indeterminado';
            var nacionals = (origem == 1) ? 'Nacional' : 'Importado';
            for (var i = 0; i < quantidade; i++) {
                var newid = 'barcode' + i;
                if (!$("#mainBar")[0]) {
                    tmp = '<div id="mainBar" style="width:100%;"><div class="divBar" style="display:inline-block;border:solid;text-align:center;width:25%">' +
                        '<b class= "txt" style="font: 20px monospace;color:black;"><p style="margin:0px;">' + data[0].produto + '</p><p style="margin:0px;">' + vlr + '</p><p style="margin:0px;">Cod:' + data[0].sku + '</p><p style="margin:0px;">Validade:' + validades + '</p><p style="margin:0px;">Origem:' + nacionals + '</p></b><svg class="barcode" id="' + newid + '">' +
                        '</svg></div></div>'
                    $("[data-id='" + destino + "']")[0].innerHTML = tmp;
                }
                else {
                    tmp = '<div class="divBar" style="display:inline-block;border:solid;text-align:center;width:25%"><b class="txt" style="font: 20px monospace;color:black;"><p style="margin:0px;">' + data[0].produto + '</p><p style="margin:0px;">' + vlr + '</p><p style="margin:0px;">Cod:' + data[0].sku + '</p><p style="margin:0px;">Validade:' + validades + '</p><p style="margin:0px;">Origem:' + nacionals + '</p></b><svg class="barcode" id="' + newid + '"></svg></div>'
                    $("#mainBar")[0].innerHTML = tmp + $("#mainBar")[0].innerHTML;
                }
                g$.estiloBarCode(data[0], "#" + newid, etiquetaID);
            }
        });
    }

    g$.estiloBarCode = function (obj, id, etiquetaID) {
        var query = "SELECT * FROM " + $rootScope.user.banco + ".etiqueta_config WHERE id = " + etiquetaID;
        obj.cod_alt = (!obj.cod_alt || obj.cod_alt > 0) ? obj.cod_alt : 50;
        obj.cod_larg = (!obj.cod_larg || obj.cod_larg > 0) ? obj.cod_larg : 2;
        JsBarcode(id, obj.ean, {
            width: obj.cod_larg,
            height: obj.cod_alt
        });

        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("estiloBarCode - Tela", data)) return;;

            obj = data.data[0];
            $('.divBar').css('margin', obj.mg + "px");
            $('.divBar').css('margin-top', obj.mgtp + "px");
            $('.divBar').css('margin-bottom', obj.mgbt + "px");
            $('.divBar').css('margin-left', obj.mglf + "px");
            $('.divBar').css('margin-right', obj.mgrt + "px");
            $('.divBar').css('padding', obj.pd + "px");
            $('.divBar').css('padding-top', obj.pdtp + "px");
            $('.divBar').css('padding-bottom', obj.pdbt + "px");
            $('.divBar').css('padding-left', obj.pdlf + "px");
            $('.divBar').css('padding-right', obj.pdrt + "px");
            $('.divBar').css('border-width', obj.largura_borda + "px");
            $('.divBar').css('border-radius', obj.borda_radius + "px");
            $('.divBar').css('height', obj.altura_etiqueta + "px");
            $('.divBar').css('width', obj.largura_etiqueta + "px");
            $('.txt').css('font-size', obj.font + "px");
        });
    }

    g$.imprime = function (params) {
        var elemento = params.split("|")[1].trim(),
            conteudo,
            elms = (params.split("|")[2] && params.split("|")[2].trim() != "") ? params.split("|")[2].split("¦") : null,
            cond = params.split("|")[3];

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        if (elms && elms != "") {
            for (var i = 0; i < elms.length; i++) {
                $("#view [data-id='" + elms[i].trim() + "']").addClass("play-none");
            }
        }

        if (elemento.indexOf("modal") > -1) conteudo = $("#" + elemento.split("modal_")[1].trim())[0].innerHTML;
        else conteudo = $("#view [data-id='" + elemento + "']")[0].innerHTML;

        tela_impressao = window.open('about:blank');
        tela_impressao.document.write(conteudo);
        tela_impressao.window.print();

        if (elms && elms != "") {
            for (var i = 0; i < elms.length; i++) {
                $("#view [data-id='" + elms[i].trim() + "']").removeClass("play-none");
            }
        }
    }

    g$.onClick = function (params, isTela) {
        var params = g$.alterSargentos(params),
            elm = $("#view [data-id=" + params[1].trim() + "]")[0],
            cond = params[2],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = params[0].split("¦")[1];

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        if (elm) {
            if (elm.id == "tab") {
                elm.click();
                elm.children[0].click();
                // $('ul.tabs').tabs('select_tab', elm.children[0].href.split("#")[1]);
            }
            else if (elm.id == "link") {
                elm.click();
            }
            else if (elm.id == "selectbox") {
                elm.querySelector("input").click();
            }
            else {
                elementoClick(elm.dataset.id);
            }
        }

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.leColunas = function (params) {
        var params = params.split("|"),
            j = [].slice.call($('[data-id="' + params[1].trim() + '"]')),
            n = 0,
            destino = $("[data-id=" + params[2].trim() + "]")[0];

        j.forEach(function (v, i) {
            if (v.textContent > 0) n += parseInt(v.textContent);
        })
        destino.value = (params[3].trim() == "soma") ? n : (params[3].trim() == "count") ? j.length - 1 : (n / (j.length - 1)).toFixed(2);
    }

    g$.contas = function (params) {
        var params = g$.alterSargentos(params),
            elm = (params[1].indexOf("memo") > -1) ? params[1].trim() : $("[data-id=" + params[1].trim() + "]")[0],
            l = params[2].split("¦"),
            result = 0,
            cond = params[4],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = (params[0].split("¦")[1]) ? params[0].split("¦")[1].trim() : undefined;

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };

        if (params[3].trim() == "divisao") result = parseFloat(l[0]) / parseFloat(l[1]);
        else if (params[3].trim() == "multiplicacao") result = parseFloat(l[0]) * parseFloat(l[1]);
        else {
            l.forEach(function (v, i) {
                if (v.trim() && v.trim() != "-") {
                    result = (params[3].trim() == "soma") ? result + parseFloat(v) : (params[3].trim() == "subtracao") ? parseFloat(v) - result : (params[3].trim() == "divisao") ? (result / v).toFixed(2) : (result * v).toFixed(2);
                }
            });
        }

        result = result.toString().replace(".", ",")
        if (params[1] && params[1].trim().indexOf("memo") > -1) g$[elm.trim()] = result;
        else if (elm.tagName == "INPUT") elm.value = result;
        else if (elm.tagName == "LABEL") elm.innerHTML = result;

        g$.vfyFuncaoDepois(idFuncao);
    }

    // Função Adicionar tecla de Atalho na tela
    g$.teclaDeAtalho = function (params) {
        var params = g$.alterSargentos(params),
            elemento_id = params[1].trim(),
            atalho = params[2].trim();

        g$.addAtalhoTela(elemento_id, atalho);
    }

    g$.addAtalhoTela = function (elemento_id, atalho) {
        if ((atalho == "ctrl + l") && (event.ctrlKey && event.keyCode == 76)) {
            elementoClick(elemento_id);
            event.preventDefault();
            event.stopPropagation();
        }
        else if ((atalho == "ctrl + s") && (event.ctrlKey && event.keyCode == 83)) {
            elementoClick(elemento_id);
            event.preventDefault();
            event.stopPropagation();
        }
        else if ((atalho == "ENTER") && (event.keyCode == 13)) {
            elementoClick(elemento_id);
        }
        else if ((atalho == "f1") && (event.keyCode == 112)) {
            elementoClick(elemento_id);
            event.preventDefault();
            event.stopPropagation();
        }
        else if ((atalho == "f2") && (event.keyCode == 113)) {
            elementoClick(elemento_id);
            event.preventDefault();
            event.stopPropagation();
        }
        else if ((atalho == "f9") && event.keyCode == 120) {
            elementoClick(elemento_id);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function elementoClick(elemento_id) {
        var query = "SELECT e.nome, ef.*, e.menu_id FROM elemento_funcao ef, elemento e WHERE e.id = ef.elemento_id and ef.elemento_id =  "
            + elemento_id + " and isnull(ef.depois) ORDER BY ef.ordem;",
            elm = $("[data-id='" + elemento_id + "'")[0];
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Elementos Click", data)) return;;

            data.data.forEach(function (v) {
                var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                    params = v.funcao;
                if (funcao.trim() == "adicionarProduto") g$[funcao.trim()](params, elm);
                else g$[funcao.trim()](params);
            });
        })
    }

    g$.naoGravar = function (params, isTela) {
        var params = g$.alterSargentos(params),
            msg = params[1],
            cond = params[2],
            idFuncao = params[0].split("¦")[1];

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida) {
            g$.alerta("Alerta", msg);
            console.log("Não executou porque" + cond + " é falso");
            return true;
        };
    }

    g$.validaCondicao = function (condicao) {
        if (condicao.indexOf(" OU ") > -1) {
            var condicao = condicao.split(" OU ");
            for (var i = 0; i < condicao.length; i++) {
                if (condicao[i].indexOf("><") > -1) { var resultado = condicao[i].split("><"); if (resultado[0].trim().indexOf(resultado[1].trim()) > -1) { return condicao = true } }
                else if (condicao[i].indexOf("=") > -1) { var resultado = condicao[i].split("="); if (resultado[0].trim() == resultado[1].trim()) { return condicao = true } }
                else if (condicao[i].indexOf("<>") > -1) { var resultado = condicao[i].split("<>"); if (resultado[0].trim() != resultado[1].trim()) { return condicao = true } }
                else if (condicao[i].indexOf(">") > -1) { var resultado = condicao[i].split(">"); if (parseFloat(resultado[0].trim()) > parseFloat(resultado[1].trim())) { return condicao = true } }
                else if (condicao[i].indexOf("<") > -1) { var resultado = condicao[i].split("<"); if (parseFloat(resultado[0].trim()) < parseFloat(resultado[1].trim())) { return condicao = true } }
                else if (condicao[i].indexOf(">=") > -1) { var resultado = condicao[i].split(">="); if (parseFloat(resultado[0].trim()) >= parseFloat(resultado[1].trim())) { return condicao = true } }
                else if (condicao[i].indexOf("<=") > -1) { var resultado = condicao[i].split("<="); if (parseFloat(resultado[0].trim()) <= parseFloat(resultado[1].trim())) { return condicao = true } }
            }
            return condicao = false;
        } else {
            var condicao = condicao.split("¦");
            for (var i = 0; i < condicao.length; i++) {
                if (condicao[i].indexOf("><") > -1) { var resultado = condicao[i].split("><"); if (resultado[0].trim().indexOf(resultado[1].trim()) == -1) { return condicao = false } }
                else if (condicao[i].indexOf("=") > -1) { var resultado = condicao[i].split("="); if (resultado[0].trim() != resultado[1].trim()) { return condicao = false } }
                else if (condicao[i].indexOf("<>") > -1) { var resultado = condicao[i].split("<>"); if (resultado[0].trim() == resultado[1].trim()) { return condicao = false } }
                else if (condicao[i].indexOf(">") > -1) { var resultado = condicao[i].split(">"); if (parseFloat(resultado[0].trim()) <= parseFloat(resultado[1].trim())) { return condicao = false } }
                else if (condicao[i].indexOf("<") > -1) { var resultado = condicao[i].split("<"); if (parseFloat(resultado[0].trim()) >= parseFloat(resultado[1].trim())) { return condicao = false } }
                else if (condicao[i].indexOf(">=") > -1) { var resultado = condicao[i].split(">="); if (parseFloat(resultado[0].trim()) < parseFloat(resultado[1].trim())) { return condicao = false } }
                else if (condicao[i].indexOf("<=") > -1) { var resultado = condicao[i].split("<="); if (parseFloat(resultado[0].trim()) > parseFloat(resultado[1].trim())) { return condicao = false } }
            }
            return condicao = true;
        }
    }

    g$.limparElementos = function (params, isTela) {
        var params = g$.alterSargentos(params),
            elms = params[1].split("¦"), elm,
            idFuncao = params[0].split("¦")[1],
            cond = params[2];

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        for (var i = 0; i < elms.length; i++) {
            elm = $("[data-id=" + elms[i].trim() + "]")[0];
            if (elm) {
                if (elm.id == "selectbox") {
                    elm.querySelector("#selectbox").value = "";
                    elm.querySelector("#selectbox").dataset.value = "";
                }
                else if (elm.dataset.tipo == "checkbox") elm.checked = false;
                else if (elm.id == "input") elm.value = "";
            }
        }

        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.openModal = function (params, isTela, elm) {
        var params = g$.alterSargentos(params),
            idFuncao = (params[0].split("¦")[1]) ? params[0].split("¦")[1].trim() : undefined,
            nome = params[1].trim(),
            id = params[2].trim(),
            tela = params[3].trim(),
            cond = (params[4] && params[4].trim() != "") ? params[4].trim() : "",
            msg = (params[5] && params[5].trim() != "") ? params[5].trim() : undefined,
            tamanho = (params[6] && params[6].trim() != "") ? params[6].trim() : undefined;

        valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            if (msg) g$.alerta("Erro", msg);
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        }

        // Guarda o elemento que clicou, para quando fechar colocar o foco
        if ((elm && elm.tagName) && event.tagName) {
            if (!elm) elm = event.target;
            while (!elm.dataset.id) { elm = elm.parentElement; }
            g$.arr_focus_elemento.push(elm.dataset.id);
        }

        // #todo
        if (g$.user.sysCli) {
            template = angular.element($.templateModals[0][tela])[0];
            template = $compile(template)($scope)[0];
            $("#view")[0].appendChild(template);
            $http.get("/").success(function () {
                $http.get("/").success(function () {
                    $http.get("/").success(function () {
                        g$.atualizaFuncoes(tela);
                    })
                })
            })
        }
        else g$.criaTela(nome, tela, id, true, null, tamanho);

        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.openModalPerfil = function () {
        $("#modal-perfil").modal("open");
        g$.arrayTelas.push("ModalPerfil");
        $scope.limparDadosPerfil();
    }

    g$.graficoDoughnut = function (params, isTela) {
        var params = params, legend, elm, legend,
            idFuncao = params.split("|")[0].split("¦")[1];

        params = g$.alterSargentos(params)
        elm = $("#view [data-id='" + params[1].trim() + "']")[0];
        legend = (params[5] && params[5].trim() == "true") ? true : false;

        if (elm) {
            if (elm.dataset.grafico_ativo == "true") {
                $("#view [data-id='" + elm.dataset.pai + "']")[0].innerHTML = elm.parentElement.dataset.template;
                if (legend) {
                    legend = angular.element("<div id='legend-" + elm.dataset.id + "' class='chart-legend'></div>")[0];
                    // $("#view [data-id='" + elm.dataset.pai + "']")[0].append(legend);
                    elm = $("#view [data-id='" + elm.dataset.pai + "']")[0].children[0];
                }
            }
            else elm.parentElement.dataset.template = elm.outerHTML;
        }

        // elm.id += elm.dataset.id;

        elm.dataset.grafico_ativo = true;

        var porcentagem = [], cor = [], labels = [], count, data = [];

        count = params[2].split("¦").length;

        for (var i = 0; i < count; i++) {
            data[i] = {
                value: parseInt(params[2].split("¦")[i]), color: $.graficoColors[params[3].split("¦")[i].trim()],
                label: params[4].split("¦")[i].trim() + ": " + parseInt(params[2].split("¦")[i])
            };
        }

        var options = {
            segmentShowStroke: false,
            animateRotate: true,
            animateScale: false,
            percentageInnerCutout: 50,
            tooltipTemplate: "<%= value %>%"
        }

        var ctx = $("#view #" + elm.id)[0].getContext("2d");
        var myChart = new Chart(ctx).Doughnut(data, options);
        if (legend) {
            $('#legend-' + elm.dataset.id)[0].innerHTML = myChart.generateLegend();
        }

        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.graficoTorre = function (params, isTela, elm_depois, elemento) {
        var params = params, legend, elm, cond,
            idFuncao = params.split("|")[0].split("¦")[1];

        params = g$.alterSargentos(params);
        cond = params[5];

        valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        }

        elm = (elemento) ? elemento : $("#view [data-id='" + params[1].trim() + "']")[0];

        elm.id += elm.dataset.id;

        elm.dataset.grafico_ativo = true;

        var porcentagem = [], cor = [], labels = [], count, data = [];

        count = params[2].split("¦").length;

        for (var i = 0; i < count; i++) {
            // cor[i] = $.graficoColors[params[3].split("¦")[i].trim()];
            labels[i] = params[4].split("¦")[i].trim();
            porcentagem[i] = parseInt(params[2].split("¦")[i]);
        }

        var areaChartData = {
            labels: labels,
            datasets: [
                {
                    label: "Digital Goods",
                    fillColor: "rgba(60,141,188,0.9)",
                    strokeColor: "rgba(60,141,188,0.8)",
                    pointColor: "#3b8bba",
                    pointStrokeColor: "rgba(60,141,188,1)",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(60,141,188,1)",
                    data: porcentagem,
                }
            ]
        };

        var barChartCanvas = elm.getContext("2d");
        var barChart = new Chart(barChartCanvas);
        var barChartData = areaChartData;
        barChartData.datasets[0].fillColor = "#00a65a";
        barChartData.datasets[0].strokeColor = "#00a65a";
        barChartData.datasets[0].pointColor = "#00a65a";
        var barChartOptions = {};

        barChartOptions.datasetFill = false;
        barChart.Bar(barChartData, barChartOptions);

        elm.style.width = (elm.dataset.largura && elm.dataset.largura != "") ? elm.dataset.largura + "px" : "200px";
        elm.style.height = (elm.dataset.tamanho && elm.dataset.tamanho != "") ? elm.dataset.tamanho + "px" : "200px";

        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.printArea = function (params, isTela) {
        var params = g$.alterSargentos(params),
            idFuncao = params[0].split("¦")[1],
            elemento = params[1].trim(),
            conteudo,
            elms = (params[2] && params[2].trim() != "") ? params[2].split("¦") : null,
            cond = params[3];

        valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        if (elms && elms != "") {
            for (var i = 0; i < elms.length; i++) {
                $("#view [data-id='" + elms[i].trim() + "']").addClass("play-none");
            }
        }

        if (elemento.indexOf("modal") > -1) conteudo = $("#" + elemento.split("modal_")[1].trim());
        else conteudo = $("#view [data-id='" + elemento + "']");

        // troca os inputs por label 
        var lenInputControl = conteudo[0].querySelectorAll("input.form-control").length
        for (var i = 0; i < lenInputControl; i++) {
            var campo = conteudo[0].querySelectorAll("input")[0];
            if (campo.id != "selectbox") {
                if (campo.type == "date") {
                    var valor = campo.value.split("-").reverse().join("/");
                    campo.outerHTML = "<label class='label-false-print' style='display: block' data-valor='" + campo.value + "' data-template-print='" + campo.outerHTML + "'>  " + valor + " </label>";
                }
                else campo.outerHTML = "<label class='label-false-print' style='display: block' data-template-print='" + campo.outerHTML + "'>  " + campo.value + " </label>";
            }
        }

        var mode = 'iframe'; //popup
        var close = mode == "popup";
        var options = { mode: mode, popClose: close, extraCss: "../lib/materialize/css/materialize.css" };
        conteudo.printArea(options);

        if (elms && elms != "") {
            for (var i = 0; i < elms.length; i++) {
                $("#view [data-id='" + elms[i].trim() + "']").removeClass("play-none");
            }
        }

        // destroca os labels por inputs
        var lenLabelFalsePrint = conteudo[0].querySelectorAll(".label-false-print").length;
        for (var i = 0; i < lenLabelFalsePrint; i++) {
            var campo = conteudo[0].querySelectorAll(".label-false-print")[0];
            var id_input = angular.element(campo.dataset.templatePrint)[0].dataset.id;
            campo.outerHTML = campo.dataset.templatePrint;
            if ($("[data-id='" + id_input + "'")[0].dataset.tipo == "date") {
                $("[data-id='" + id_input + "'")[0].value = campo.dataset.valor;
            }
            else $("[data-id='" + id_input + "'")[0].value = campo.innerHTML.trim();
        }
    }

    g$.uploadFile = function () {
        var formData = new FormData();
        var arquivo = event.target.files[0];
        formData.append("file", arquivo);
        formData.append("banco", $rootScope.user.projeto);
        var xhr = new XMLHttpRequest();
        var id = event.target.dataset.id;

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) g$.vfyFuncaoDepois(id, false, "elemento_id");
        }

        xhr.open("POST", "/uploadArquivo/");
        xhr.send(formData);
    }

    g$.ganttProject = function (params, isTela) {
        var template = '<div id="workSpace" style="padding:0px; overflow-y:auto; overflow-x:hidden;border:1px solid #e5e5e5;position:relative;margin:0 5px"></div>';
        var params = g$.alterSargentos(params),
            query = params[1].trim(),
            ge,
            notcolunas = params[2].trim(),
            elm = $("[data-id='" + params[3].trim() + "']")[0],
            cond = params[4],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = params[0].split("¦")[1];

        if (valida == false) {
            // console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        elm.innerHTML = template;

        elm.querySelector("#workSpace").innerHTML = "";

        // Limpa o localStorage
        if (localStorage.TWPGanttCollTasks) delete localStorage.TWPGanttCollTasks;
        if (localStorage.TWPGanttSplitPos) delete localStorage.TWPGanttSplitPos;

        ge = new GanttMaster();
        ge.set100OnClose = true;

        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Query MS-Project", data)) return;

            var ret = atualizaObjProject(data.data);

            var ret = {
                "tasks": ret, "selectedRow": (g$.projectindex && g$.projectindex != "") ? g$.projectindex : 0
            }

            ret = zeraPai(ret);
            ret.tasks = colocaFilhos(ret);
            ret = atualizaSucessor(ret);
            g$.updateDateProject(ret);

            ge.init($("#workSpace"));

            ge.loadProject(ret);

            $http.get("/").success(function () {
                if ($(".col-ativo_tarefa")[0].dataset.id == "47767") {
                    $("#addLinhaNovaProject")[0].style.display = "";
                }
                else $("#addLinhaNovaProject")[0].style.display = "none";

                var pais = ret.tasks.filter(function (v) { return v.hasChild });
                pais.forEach(function (v) {
                    if (!$(".gdfTable tbody [taskid='" + v.id + "']")[0].classList.contains("isParent"))
                        $(".gdfTable tbody [taskid='" + v.id + "']")[0].classList.add("isParent");
                    g$.projectindex = "";
                });
            })
        });
    }

    g$.deleteTarefaProject = function () {
        var tarefa_id = event.target.parentElement.parentElement.querySelector("#tarefa_id input").value;
        var nome_tarefa = event.target.parentElement.parentElement.querySelector("#tarefa input").value;
        var query = "delete from node.tarefa where id = '" + tarefa_id + "'";
        alertjs.show({
            type: 'confirm',
            title: 'Confirme',
            text: "Tem certeza que deseja remover essa tarefa?",
            from: 'left', //slide from left		
            complete: function (val) {
                if (val) {
                    g$.memo20 = "";
                    g$.NotificationTarefa(" | " + tarefa_id + " | O Usuário " + g$.user.nome + " deletou a tarefa " + nome_tarefa);
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        $("[data-id='47773']")[0].click();
                    });
                }
            }
        });
    }

    g$.showEditarTarefaProject = function () {
        var linha = event.target.parentElement.parentElement;
        var data_ini = linha.querySelector("#data_ini input").value.split("/");
        var dia, mes, ano;
        var colVisaoGeral = $(".col-ativo_tarefa")[0].dataset.id == "47767";
        dia = (data_ini[1].trim().length == "1") ? 0 + data_ini[1].trim() : data_ini[1].trim();
        mes = (data_ini[0].trim().length == "1") ? 0 + data_ini[0].trim() : data_ini[0].trim();
        ano = (data_ini[2].trim().length == "1") ? 0 + data_ini[2].trim() : data_ini[2].trim();
        g$.memoidproject = linha.querySelector("#tarefa_id input").value;

        $http.post(URL + "/jsonQuery/", g$.trataQuery("select * from node.tarefa where id = " + g$.memoidproject)).success(function (data) {
            $("[data-id='47789']")[0].click();
            $("[data-id='47806'] input")[0].value = linha.querySelector("#recurso input").value;
            $("[data-id='47806'] input")[0].dataset.value = data.data[0].usuario_id;
            $("[data-id='47820']")[0].value = $("[data-id='47820']")[0].value = ano + "-" + mes + "-" + dia;
            $("[data-id='48823']")[0].value = data.data[0].duracao_em_horas_p;
            $("[data-id='48826']")[0].value = data.data[0].horas_por_dia;
            $("[data-id='47808']")[0].value = data.data[0].tarefa;
            $("[data-id='47810']")[0].value = data.data[0].descricao;
            $("[data-id='47821']")[0].value = data.data[0].progresso;
            $("[data-id='48820']")[0].checked = (linha.querySelector("#progresso input").value.trim() == "100");
            $("[data-id='48894']")[0].value = data.data[0].duracao_em_dias_p;
            $("[data-id='48896']")[0].value = data.data[0].antecessor;
            $("[data-id='48898']")[0].value = data.data[0].pai;
            $("[data-id='48900']")[0].value = data.data[0].criticidade;
            $("[data-id='48902']")[0].value = data.data[0].duracao_em_dias_p;
            $("[data-id='47817']")[0].classList.remove("play-none");
            $("[data-id='48819']")[0].classList.remove("play-none");

            if (colVisaoGeral) {
                $("[data-id='48886']")[0].classList.remove("play-none");
                $("[data-id='48887']")[0].classList.remove("play-none");
                $("[data-id='48888']")[0].classList.remove("play-none");
                $("[data-id='48889']")[0].classList.remove("play-none");
                $("[data-id='48890']")[0].classList.remove("play-none");
                $("[data-id='48907']")[0].classList.remove("play-none");
            }
            else $("[data-id='48827']")[0].classList.remove("play-none");
            $("[data-id='47811']")[0].classList.add("play-none");

            g$.memo10 = data.data[0].progresso; // 47821
            g$.memo11 = (data.data[0].finalizada == 1) ? 1 : 0; // 48820
            g$.memo12 = g$.formataData(data.data[0].inicio_p); // 47820
            g$.memo13 = data.data[0].duracao_em_horas_p; // 48823
            g$.memo14 = data.data[0].horas_por_dia; // 48826
            g$.memo15 = data.data[0].usuario_id; // 47806
            g$.memo16 = data.data[0].tarefa; //47808 
            g$.memo17 = data.data[0].descricao; // 47810
            g$.memo20 = ""; // criar

            if (g$.memo10 == 100) $("[data-id='48820']")[0].disabled = $("[data-id='47821']")[0].disabled = true;
            else $("[data-id='48820']")[0].disabled = $("[data-id='47821']")[0].disabled = false;
        });
    }

    g$.showNotificationTarefaProject = function () {
        var linha = event.target.parentElement.parentElement;
        g$.memoidproject = linha.querySelector("#tarefa_id input").value;
        $("[data-id='50018']")[0].click();
        $("[data-id='50021']")[0].classList.add("play-none");
        $("[data-id='50036']")[0].classList.remove("play-none");
        g$.memo20 = ""; // criar
    }

    function atualizaObjProject(data) {
        data.forEach(function (v) {
            var arrDepends = [], antecessor;
            v.start = (v.inicio_p) ? getDateTime(v.inicio_p) : "";
            v.end = (v.fim_p) ? getDateTime(v.fim_p) : "";
            v.duration = (v.duracao_em_dias_p) ? v.duracao_em_dias_p : "";
            v.status = "STATUS_ACTIVE";
            v.hasChild = v.filhos > 0;
            // v.updateDate = (v.start == "" || v.end == "") ? true : false;
            v.depends = (v.depends && v.depends != "0") ? v.depends : "";
            v.pai = (v.pai == 0) ? "" : v.pai;
        });
        return data;
    }

    g$.updateDateProject = function (data) {
        var query;
        // data.tasks = data.tasks.filter(function (v) { return v.updateDate == true });
        data.tasks.forEach(function (v) {
            query = "UPDATE node.tarefa SET inicio_p = '" + g$.formataData(v.start) + "', fim_p = '" + g$.formataData(v.end) + "' where id = " + v.id;
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                if (g$.exceptionRequisicao("Atualiza Data Project", data)) return;
            });
        });
    }

    g$.novaLinhaProject = function () {
        if (!$("#linhanovaProject")[0]) {
            var rowProject = '<tr id="linhanovaProject"><td class="gdfCell noClip" style="text-align: center"><div class="taskStatus cvcColorSquare"></div></td><td id="tarefa_id" class="gdfCell" style="display:none;">' +
                '<input class="form-control" type="text"></td><td id="projeto_id" class="gdfCell">' +
                '<teste data-id="projeto_project" id="selectbox" data-nome="Projeto" data-pai="48179" data-combo_campo="projeto" data-combo-query="select * from node.projeto" data-combo-grava-campo="id"data-combo-filtro="null" data-selectbox_combo_campo="projeto" style="font-size: 13px; font-family: Roboto;"></teste></td><td id="recurso" class="gdfCell">' +
                '<teste data-id="usuario_project" id="selectbox" data-nome="Selecione um Usuário" data-pai="47801" data-menu_id="965" data-combo_tabela="node.usuario" data-combo_campo="nome" data-input_ativo="1" data-ordem="13" data-obrigatorio="0" data-combo-query="" data-combo-grava-campo="id"data-combo-filtro="" data-selectbox_combo_tabela="node.usuario" style="font-size: 13px; font-family: Roboto;"></teste></td><td id="tarefa" class="gdfCell">' +
                '<input class="form-control" type="text"></td><td id="descricao" class="gdfCell indentCell"><div class="exp-controller" style="text-align: center"></div>' +
                '<input class="form-control" type="text"></td><td id="recurso_id" class="gdfCell" style="display:none;">' +
                '<input class="form-control" type="text"></td><td id="progresso" class="gdfCell">' +
                '<input class="form-control" type="text"></td><td id="data_ini" class="gdfCell">' +
                '<input type="date" class="form-control"></td><td id="data_fim" class="gdfCell">' +
                '<input type="date" class="form-control"></td><td id="dias" class="gdfCell">' +
                '<input class="form-control" type="text"></td><td id="horas" class="gdfCell">' +
                '<input class="form-control" type="text"></td><td id="horas_dia" class="gdfCell">' +
                '<input class="form-control" type="text"></td><td id="antecessor" class="gdfCell">' +
                '<input class="form-control" type="text"></td><td id="pai" class="gdfCell">' +
                '<input class="form-control" type="text"></td><td id="criticidade" class="gdfCell">' +
                '<input class="form-control" type="text"></td><td id="tem_filhos" class="gdfCell">' +
                '<input class="form-control" type="text"></td><td id="acoes" class="gdfCell" style="text-align: center">' +
                '<i onclick="g$.saveRowProject()" class="fa fa-check" style="cursor: pointer;color: #3F51B5;position: relative;top: 1px;left:-4px;"> </i> </td></tr>';
            rowProject = $compile(angular.element(rowProject)[0])($scope)[0];
            if ($(".gdfTable")[1].tBodies[0]) $(".gdfTable")[1].tBodies[0].insertBefore(rowProject, $(".gdfTable")[1].tBodies[0].rows[0]);
            else {
                $(".gdfTable")[1].appendChild(document.createElement("tbody"));
                $(".gdfTable")[1].tBodies[0].appendChild(rowProject);
            }
        }
    }

    g$.saveRowProject = function () {
        var linha = event.target.parentElement.parentElement;
        var tarefa = linha.querySelector("#tarefa input").value,
            descricao = linha.querySelector("#descricao input").value,
            usuario_id = linha.querySelector("#recurso input").dataset.value,
            progresso = linha.querySelector("#progresso input").value,
            inicio_p = linha.querySelector("#data_ini input").value,
            fim_p = linha.querySelector("#data_fim input").value,
            duracao_em_dias_p = linha.querySelector("#dias input").value,
            duracao_em_horas_p = linha.querySelector("#horas input").value,
            horas_por_dia = linha.querySelector("#horas_dia input").value,
            antecessor = linha.querySelector("#antecessor input").value,
            pai = linha.querySelector("#pai input").value,
            projeto_id = linha.querySelector("#projeto_id input").dataset.value,
            criticidade = linha.querySelector("#criticidade input").value,
            filhos = linha.querySelector("#tem_filhos input").value;
        if (tarefa == "") return g$.alerta("ERRO", "Tarefa não pode ser vazio");
        if (usuario_id == "") return g$.alerta("ERRO", "Recurso não pode ser vazio");
        if ((antecessor == "" && pai == "") && inicio_p == "") return g$.alerta("ERRO", "Data Inicio não pode ser vazio");
        if (duracao_em_horas_p == "") return g$.alerta("ERRO", "Duração em horas planejada não pode ser vazio");
        if (horas_por_dia == "") return g$.alerta("ERRO", "Horas por Dia não pode ser vazio");

        if (antecessor != "") {
            if (!linha.parentElement.rows[antecessor - 1] || linha.parentElement.rows[antecessor - 1].getAttribute("taskid") == "") {
                return g$.alerta("ERRO", "Não encontrou o antecessor");
            }
            antecessor = linha.parentElement.rows[antecessor - 1].getAttribute("taskid");
        }

        pai = (!pai || pai == "") ? 0 : pai;
        filhos = (!filhos || filhos == "") ? 0 : filhos;
        projeto_id = (!projeto_id) ? "" : projeto_id;
        usuario_id = (!usuario_id) ? "" : usuario_id;
        var query = "INSERT INTO node.tarefa (tarefa, descricao, usuario_id, progresso, inicio_p, fim_p, duracao_em_dias_p, duracao_em_horas_p, horas_por_dia, antecessor, pai, " +
            "projeto_id, criticidade, filhos) VALUES ('" + tarefa + "', '" + descricao + "', '" + usuario_id + "', '" + progresso + "', '" + inicio_p + "', '" + fim_p + "', '" +
            duracao_em_dias_p + "', '" + duracao_em_horas_p + "', '" + horas_por_dia + "', '" + antecessor + "', '" + pai + "', '" + projeto_id + "', '" + criticidade + "', '" +
            filhos + "');";
        query = query.replace(/''/g, "null");
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (g$.exceptionRequisicao("Insert Data Project", data)) return;
            $("[data-id='47767']")[0].click();
        });
    }

    // Calcula data tirando o final de semana
    function calculaData(ini, fim) {
        var oneDay = 24 * 60 * 60 * 1000;
        var data_ini = new Date(ini);
        var i = qtd_fds = 0;
        // procura quantos finais de semana tem nesse intervalo
        while (Math.round(Math.abs((data_ini.getTime() - fim) / (oneDay))) != 0) {
            data_ini.setDate(data_ini.getDate() + 1);
            if (isHoliday(data_ini)) qtd_fds++;
            i++;
        }
        return Math.round(Math.abs((ini - fim) / (oneDay))) - qtd_fds;
    }

    function getDateTime(data) {
        return new Date(data).getTime();
    }

    function colocaFilhos(ret, pai, retO, level) {
        if (!retO) retO = [];
        if (pai == "" || !pai) {
            for (var i = 0; i < ret.tasks.length; i++) {
                if (ret.tasks[i].pai == "") {
                    ret.tasks[i].level = 0;

                    // se tiver antecessor pega index correspondente
                    if (ret.tasks[i].depends != "") {
                        antecessores = ret.tasks[i].depends.split(",");
                        antecessoresO = [];
                        // for de antecessores
                        for (var j = 0; j < antecessores.length; j++) {
                            for (var k = 0; k < retO.length; k++) {
                                // buscando antecessor e pegando seu index
                                if (antecessores[j] == retO[k].id) {
                                    antecessoresO.push(k + 1);
                                    break;
                                } else if (k == retO.length - 1) {
                                    console.log("antecessor não encontrado");
                                }
                            }
                        }
                        ret.tasks[i].depends = antecessoresO.join(",");
                    }
                    retO.push(ret.tasks[i]);
                    retO = colocaFilhos(ret, ret.tasks[i].id, retO, ret.tasks[i].level + 1);
                }
            }
        } else {
            for (var i = 0; i < ret.tasks.length; i++) {
                if (ret.tasks[i].pai == pai) {
                    ret.tasks[i].level = level;

                    // se tiver antecessor pega index correspondente
                    if (ret.tasks[i].depends != "") {
                        antecessores = ret.tasks[i].depends.split(",");
                        antecessoresO = [];
                        // for de antecessores
                        for (var j = 0; j < antecessores.length; j++) {
                            for (var k = 0; k < retO.length; k++) {
                                // buscando antecessor e pegando seu index
                                if (antecessores[j] == retO[k].id) {
                                    antecessoresO.push(k + 1);
                                    break;
                                } else if (k == retO.length - 1) {
                                    console.log("antecessor" + antecessores[j] + " não encontrado");
                                }
                            }
                        }
                        ret.tasks[i].depends = antecessoresO.join(",");
                    }
                    retO.push(ret.tasks[i]);
                    retO = colocaFilhos(ret, ret.tasks[i].id, retO, ret.tasks[i].level + 1);
                }
            }
        }
        return retO;
    }

    function atualizaSucessor(ret, antecessor) {
        var antecessores, count = 0;
        // paga tds q nao tem antecessores e nao tem filhos
        if (!antecessor) {
            for (var i = 0; i < ret.tasks.length; i++) {
                if (ret.tasks[i].depends == "" && !ret.tasks[i].hasChild) {
                    count = 1;
                    // calcula fim com base na duração
                    ret.tasks[i].end = computeEndByDuration(computeStart(ret.tasks[i].start), ret.tasks[i].duration);
                    console.log('#' + ret.tasks[i].id + '- ' + ret.tasks[i].name);
                    ret = atualizaPai(ret, ret.tasks[i]);
                    // chama novamente funcao passando o sucessor
                    ret = atualizaSucessor(ret, i + 1);
                }
            }
        }
        // pega tds que tem antecessores igual ao antecessor passado por parametro
        else {
            for (var i = 0; i < ret.tasks.length; i++) {
                antecessores = "," + ret.tasks[i].depends + ",";
                if (antecessores.indexOf("," + antecessor + ",") > -1 && !ret.tasks[i].hasChild) {
                    count = 1;
                    // caso tenha antecessor inicio = maior fim entre os antecessores
                    ret.tasks[i].start = pegaInicio(ret, ret.tasks[i].depends);
                    // calcula fim com base na duração
                    ret.tasks[i].end = computeEndByDuration(computeStart(ret.tasks[i].start), ret.tasks[i].duration);
                    console.log('#' + ret.tasks[i].id + '- ' + ret.tasks[i].name);
                    ret = atualizaPai(ret, ret.tasks[i]);
                    // chama novamente funcao passando o sucessor
                    ret = atualizaSucessor(ret, i + 1);
                }
            }
        }
        return ret;
    }

    function pegaInicio(ret, depends) {
        var antecessores = ',' + depends + ',',
            fim = 0;
        for (var i = 0; i < ret.tasks.length; i++) {
            if (antecessores.indexOf("," + (i + 1) + ",") > -1 && ret.tasks[i].end > fim) fim = computeEndByDuration(ret.tasks[i].end, 1);
        }
        return fim;
    }

    function zeraPai(ret) {
        for (var i = 0; i < ret.tasks.length; i++) {
            if (ret.tasks[i].hasChild) {
                ret.tasks[i].start = "";
                ret.tasks[i].level = 0;
                ret.tasks[i].end = "";
                ret.tasks[i].duration = "";
            }
        }
        console.log('zerou pai');
        return ret;
    }

    function atualizaPai(ret, filho) {
        if (filho.pai != "") {
            for (var i = 0; i < ret.tasks.length; i++) {
                if (ret.tasks[i].id == filho.pai) {
                    if (ret.tasks[i].start == "" || ret.tasks[i].start > filho.start) {
                        ret.tasks[i].start = filho.start;
                    }
                    if (ret.tasks[i].end == "" || ret.tasks[i].end < filho.end) {
                        ret.tasks[i].end = filho.end;
                    }
                    console.log('atualizou pai: ' + filho.pai + ", filho: " + filho.id + ' inicio:' + ret.tasks[i].start + ' fim:' + ret.tasks[i].start);

                    ret.tasks[i].duration = calculaData(ret.tasks[i].start, ret.tasks[i].end);

                    return atualizaPai(ret, ret.tasks[i]);

                }
            }
        } else return ret
    }

    function fixdata(data) {
        var o = "", l = 0, w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }

    g$.importExcel = function () {
        var elm = event.target,
            params = g$.alterSargentos(elm.parentElement.parentElement.dataset.nome),
            id_destino = params[1].trim(),
            campos = params[3].trim(),
            arquivo = elm.files[0],
            data = event.target,
            destino = $("[data-id='" + id_destino + "']")[0],
            tabela = '<table id="tbl_import_excel" class="table striped dataTable no-footer bordered"> <tbody> </tbody> </tabela>';


        destino.innerHTML += '<div id="rowcabecalho" class="row"> <div class="col s8"> <input type="checkbox" class="new_check" id="importfirstrow" /> <label class="new_check" for="importfirstrow" style="position: relative; top: 6px;"> Inserir a primeira linha também? </label> </div>' +
            '<div class="col s4" style=> <a class="waves-effect waves-light btn" style="background: #4CAF50;" onclick="g$.salvarDadosExcel()"> Importar Planilha </a> </div> </div>'
        destino.innerHTML += tabela;

        var tabela = document.querySelector("#tbl_import_excel tbody");
        var tr, rowCampos;
        var tdCampos = "";

        g$.nome_tabela_excel = params[2].trim();
        g$.colunas_invisivel_excel = params[4];
        $scope.importExcelCols = campos.split("¦");

        if (!$("#loadzinExcel")[0]) {
            loadzinTela = angular.element($.template[0]["loadzinTela"])[0];
            document.body.append(loadzinTela);
            $("#loadzinTela")[0].id = "loadzinExcel";
        }

        // Upload do Excel
        var formData = new FormData();
        var arquivo = event.target.files[0];
        formData.append("file", arquivo);
        formData.append("banco", $rootScope.user.projeto);
        var xhr = new XMLHttpRequest();
        var id = event.target.dataset.id;

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                $.post("/xlsxtojson/", { nome: elm.files[0].name }, function (data) {

                    if ($("#loadzinExcel")[0]) $("#loadzinExcel")[0].outerHTML = "";

                    var tamanhoCol = Object.keys(data[0]).length;
                    // guarda o objeto em memoria
                    g$.jsonImportExcel = data;

                    // monta linhas e cabecalho
                    for (var i = 0; i < tamanhoCol; i++) {
                        tdCampos += '<td id="cabecalho-combo"> <select class="form-control"> ' +
                            '<option value=""> Selecione uma Coluna </option>' +
                            '<option ng-repeat="importExcelCol in importExcelCols" value="{{importExcelCol}}"> {{importExcelCol}} </option> ' +
                            '</select> </td>';
                    }
                    tabela.innerHTML += "<tr id='rowCampos'>" + tdCampos + "</tr>";

                    rowCampos = $compile($("#rowCampos")[0])($scope)[0];

                    $http.get(URL + "/").success(function () {
                        tabela.innerHTML = rowCampos.outerHTML;
                        // -1 pra montar o cabecalho e comecar as linhas do zero
                        for (var i = -1; i < 50; i++) {
                            var v = data[i];
                            var tr = "<tr id=row" + i + "> ";
                            var td = "";
                            for (var j = 0; j < Object.keys(data[0]).length; j++) {
                                if (i == -1) td += "<td class='cabecalho'> " + Object.keys(data[0])[j] + " </td>";
                                else td += "<td> " + data[i][Object.keys(data[i])[j]] + " </td>";
                            }
                            tr += td + "</tr>";
                            tabela.innerHTML += tr;
                        };
                    });
                });
            }
        }

        xhr.open("POST", "/uploadArquivo/");
        xhr.send(formData);

    }

    g$.salvarDadosExcel = function () {
        var insert, inserts = [];
        var importfirstrow = $("#importfirstrow")[0].checked;
        var data = {};

        data.coluna_inserts = [];

        for (var i = 0; i < $("#tbl_import_excel #rowCampos td select").length; i++) {
            data.coluna_inserts.push($("#tbl_import_excel #rowCampos select")[i].value);
        }

        data.nao_saas = JSON.parse(localStorage.user).nao_saas;
        data.projeto_id = JSON.parse(localStorage.user).projeto_id;
        data.importfirstrow = importfirstrow;
        data.results = g$.jsonImportExcel;
        data.colunas_invisivel = g$.colunas_invisivel_excel;
        data.tabela = $rootScope.user.banco + "." + g$.nome_tabela_excel;
        data.projeto = $rootScope.user.projeto;

        $http.post(URL + "/importPlanilha/", data).success(function (data) {
            console.log(data);
            if (data == 'ok') g$.alerta('Alerta', 'Importação finalizada!')
            else {
                document.body.innerHTML += '<a id="import_erro" href="' + data.caminho + '" download hidden> </a>';
                $("#import_erro")[0].click();
                document.body.removeChild($("#import_erro")[0]);
            }
        });
        // g$.importPlanilha(data);

    }

    g$.importPlanilha = function (data) {
        var post = data, insert;

        if (post.importfirstrow) {
            var obj = {};
            for (var i = 0; i < Object.keys(post.results[0]).length; i++) {
                obj[Object.keys(post.results[0])[i]] = Object.keys(post.results[0])[i];
            }
            insert = g$.montaInsertExcel(post, obj);
            // connection.query(insert);
            console.log(insert);
        }

        var erros = [];
        for (var i = 0; i < post.results.length; i++) {
            insert = g$.montaInsertExcel(post, post.results[i]);
            // connection.query(insert);
            erros.push(post.results[i]);
        }

        var header = [];
        if (Object.keys(post.results[0]).length) {
            Object.keys(post.results[0]).forEach(function (titulo) {
                header.push(titulo);
            });
        }


        return "ok";
        // connection.release();
    }
    g$.montaInsertExcel = function (data, obj) {
        var values = "", colunas = "", colunas_invisivel;

        if (data.nao_saas == 0) {
            values = data.projeto_id + ", ";
            colunas = "id_projeto, ";
        }

        for (var i = 0; i < data.coluna_inserts.length; i++) {
            if (data.coluna_inserts[i] != "") {
                values += "'" + obj[Object.keys(obj)[i]].replace(/'/, '\\\'') + "'" + ",";
                colunas += data.coluna_inserts[i] + ",";
            }
        }
        if (data.colunas_invisivel && data.colunas_invisivel.trim() != "") {
            colunas_invisivel = data.colunas_invisivel.trim();
            for (var i = 0; i < colunas_invisivel.split("¦").length; i++) {
                values += "'" + colunas_invisivel.split("¦")[i].split("=")[1].trim() + "'" + ",";
                colunas += colunas_invisivel.split("¦")[i].split("=")[0].trim() + ",";
            }
        }
        insert = "INSERT INTO " + data.tabela + "(" + colunas.substring(0, colunas.length - 1) + ") VALUES " + "(" + values.substring(0, values.length - 1) + ")";
        return insert.replace(/''/g, "NULL");
    }

    // #parei
    g$.geraRastreio = function (params) {
        var params = g$.alterSargentos(params),
            id = params[1],
            campo = params[2],
            emb = params[3],
            cod = params[4],
            peso = params[5].trim();

        if (gerando == 1) return g$.alerta("Alerta", "Rastreio será Gerado!");
        else {
            gerando = 1;
        }
        if ($("#view [data-id=" + campo + "]")[0].value) {
            return g$.alerta("Alerta", "Rastreio já Gerado!");
        }
        var query = "select * from " + $rootScope.user.banco + ".pedido where id= " + id.trim()
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var query = "select * from " + $rootScope.user.banco + ".embalagens emb left join " + $rootScope.user.banco + ".pacote pct on pct.id = emb.id where emb.id=" + emb
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                data = data.data;
                var query = "SELECT p.id,p.integracao_pedido,p.rastreamento,p.dest_xNome,p.dest_xLgr,p.dest_nro, " +
                    "p.dest_xCpl,p.dest_xBairro,p.dest_CEP,p.dest_xMun,p.dest_UF,e.imagemLogo, " +
                    "e.razao,e.endereco,e.numero,e.complemento,e.bairro,e.cep,e.uf,e.cidade,e.apelidoCorreios, " +
                    "p.transp_servico_de_postagem,p.transp_Nome,em.altura,em.comprimento,em.largura, " +
                    "em.descricao as emb_descricao,pac.pacote,pac.pacote_numero,e.id as idEmpresa " +
                    "FROM " + $rootScope.user.banco + ".pedido p " +
                    "LEFT JOIN " + $rootScope.user.banco + ".empresa e ON p.empresa_id = e.id " +
                    "LEFT JOIN " + $rootScope.user.banco + ".embalagens em ON p.embalagem_id = em.id " +
                    "LEFT JOIN " + $rootScope.user.banco + ".pacote pac ON em.pacote_id = pac.id " +
                    "WHERE p.id = " + id;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    // var data = data.data
                    if (!data.data[0].dest_xNome) return g$.alerta("Erro!", "Nome do Destinatário não informado!");
                    if (!data.data[0].dest_xLgr) return g$.alerta("Erro!", "Endereço de Destino não informado!");
                    if (!data.data[0].dest_nro) return g$.alerta("Erro!", "Número de destino não informado!");
                    if (!data.data[0].dest_xBairro) return g$.alerta("Erro!", "Bairro de Destino não informado!");
                    if (!data.data[0].dest_CEP) return g$.alerta("Erro!", "CEP de Destino não informado!");
                    if (!data.data[0].dest_xMun) return g$.alerta("Erro!", "Município de Destino não informado!");
                    if (!data.data[0].dest_UF) return g$.alerta("Erro!", "UF de Destino não informado!");
                    if (!data.data[0].imagemLogo) return g$.alerta("Erro!", "Logo de Etiqueta não informado!");
                    if (!data.data[0].razao) return g$.alerta("Erro!", "Razão não informado!");
                    if (!data.data[0].endereco) return g$.alerta("Erro!", "Endereço do Remetente não informado!");
                    if (!data.data[0].numero) return g$.alerta("Erro!", "Número do Remetente não informado!");
                    // if (!data.data[0].complemento) return g$.alerta("Erro!", "Complemento do Remetente não informado!");
                    if (!data.data[0].bairro) return g$.alerta("Erro!", "Bairro do Remetente não informado!");
                    if (!data.data[0].cep) return g$.alerta("Erro!", "CEP do Remetente não informado!");
                    if (!data.data[0].uf) return g$.alerta("Erro!", "UF do Remetente não informado!");
                    if (!data.data[0].cidade) return g$.alerta("Erro!", "Cidade do Remetente não informado!");
                    if (!data.data[0].apelidoCorreios) return g$.alerta("Erro!", "Apelido da Etiqueta não informado!");
                    if (!data.data[0].transp_servico_de_postagem) return g$.alerta("Erro!", "Serviço de Postagem não informado!");
                    if (!data.data[0].transp_Nome) return g$.alerta("Erro!", "Nome do Serviçode Postagem não informado!");
                    if (!data.data[0].altura) return g$.alerta("Erro!", "Altura não informada!");
                    if (!data.data[0].comprimento) return g$.alerta("Erro!", "Comprimento não informado!");
                    if (!data.data[0].largura) return g$.alerta("Erro!", "Largura não informado!");
                    if (!data.data[0].emb_descricao) return g$.alerta("Erro!", "Descrição da Embalagem não informada!");
                    if (!data.data[0].pacote) return g$.alerta("Erro!", "Pacote não informado!");
                    if (!data.data[0].pacote_numero) return g$.alerta("Erro!", "Número do Pacote não informado!");
                    // var urls = "https://www.csrdevsolution.com.br/sigep/gera_etiqueta.php?idPedido=" + id.trim() + "&banco=" + $rootScope.user.banco + "&peso=" + peso + "&idEmpresa=" + data.data[0].idEmpresa + "&projeto=" + JSON.parse(localStorage.user).projeto_id + "&cliente=BELEZAPINK";
                    var urls = "https://www.csrdevsolution.com.br/sigep/gera_etiqueta.php?idPedido=" + id.trim() + "&banco=" + $rootScope.user.banco + "&idEmpresa=" + data.data[0].idEmpresa + "&projeto=" + JSON.parse(localStorage.user).projeto_id + "&cliente=BELEZAPINK";
                    $http.get(urls).success(function (data) {
                        if (data) {
                            gerando = 0;
                            $("[data-id=" + campo + "]")[0].value = data.replace(/"/g, "");
                            $("[data-id=16860]")[0].innerHTML = "<iframe width='100%' height='100%' src=https://dys.net.br/BELEZAPINK/" + data.replace(/"/g, "") + "></iframe>"
                            // tela_impressao = window.open('about:blank');
                            // tela_impressao.window.location.href = "http://dysweb.dys.com.br/" + $rootScope.user.banco + "/" + data.replace(/"/g, "") + ".pdf"
                        }
                    })
                })
            })
        })
    }

    g$.sendEmail = function (params, isTela) {
        var anexo = params.split("|")[5], campo, vlanexo,
            params = g$.alterSargentos(params),
            idFuncao = params[0].split("¦")[1],
            emailDe = params[1].split("¦")[0],
            nomeDe = (params[1].split("¦")[1] && params[1].split("¦")[1].trim() != "") ? params[1].split("¦")[1] : null,
            emailPara = params[2].split("¦")[0],
            nomePara = (params[2].split("¦")[1] && params[2].split("¦")[1].trim() != "") ? params[2].split("¦")[1] : null,
            quantEmails = params[2].split(",").length,
            titulo = params[3],
            corpo = params[4],
            cond = params[6],
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) { console.log("Não executou porque " + cond + " é falso"); return; };

        for (var i = 0; i < quantEmails; i++) {
            var anexos = "", obj;

            if (anexo.trim().length) {
                for (var j = 0; j < anexo.split("¦").length; j++) {
                    campo = $("[data-id='" + anexo.split("¦")[j].split("»")[1] + "']")[0];
                    if (campo.children[1].files.length) {
                        anexos += $rootScope.user.banco + "/" + campo.children[1].files[0].name + ((j + 1) ? "," : "");
                    }
                }
                if (anexos) anexos = anexos.slice(0, anexos.length - 1);
            }
            obj = {
                "emailDe": emailDe.trim(),
                "nomeDe": nomeDe,
                "emailPara": emailPara.split(",")[i].trim(),
                "nomePara": nomePara,
                "titulo": titulo,
                "corpo": corpo,
                "anexo": anexos
            }

            $http.post(URL + "/sendEmail/", obj).success(function (data) {
                if (data == "OK") g$.alerta("Alerta", "Enviado com Sucesso");
            });
        }
        g$.vfyFuncaoDepois(idFuncao, isTela);
    }

    g$.sendMailPesquisa = function (params) {
        var params = g$.alterSargentos(params),
            elementos = params[1].split(","),
            pesquisa = params[2];
        elementos.forEach(function (v, i) {
            var query = "select * from " + $rootScope.user.banco + ".auto_usuarios where aus_codigo=" + v;
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                // Trata Excecao
                if (g$.exceptionRequisicao("SendEmailPesquisa", data)) return;

                data = data.data;

                $http.get("/sendMailPesquisa/" + data[0].aus_email + "/" + pesquisa.trim() + "/" + data[0].aus_codigo).then(function (data) {
                    g$.alerta("Alerta", 'Pesquisa Enviada!', 4000, 'green darken-1');
                });
            });
        });
    }

    g$.vfyFuncaoDepois = function (idFuncao, isTela, name) {
        // So vai fazer a requisação se tem algum evento depois se passar o ID da funcao
        var name = (!name) ? "ef.depois" : name,
            elm = event.target;
        if (idFuncao && idFuncao != "") {
            if (isTela)
                queryFuncoesDepois = "SELECT * FROM node.tela_funcao ef WHERE " + name + " = '" + idFuncao.trim() + "' ORDER BY ef.ordem;";
            else
                queryFuncoesDepois = "SELECT * FROM node.elemento_funcao ef WHERE " + name + " = '" + idFuncao.trim() + "' ORDER BY ef.ordem;";
            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryFuncoesDepois.trim())).success(function (data) {
                // Trata Excecao
                if (g$.exceptionRequisicao("VfyDepois", data)) return;

                if (data.data[0]) {
                    var funcao = data.data[0].funcao.split("|")[0].split("¦")[0].trim(),
                        params = data.data[0].funcao,
                        isTela = (data.data[0].evento == "load" || (data.data[0].evento == "close")) ? true : false;
                    if (funcao == "memo" || funcao == "openTelApp" || funcao == "openModal") g$[funcao.trim()](params, isTela, elm);
                    else g$[funcao.trim()](params, isTela, data.data[0].elemento_id);
                }
            });
        } else {
            if ($("#loadzinTelam")[0]) {
                $("#loadzinTelam")[0].outerHTML = "";
            }
        }
    }

    g$.download = function (params) {
        var verif = "https://54.233.66.37/" + $rootScope.user.projeto + "/",
            idFuncao = params.split("|")[0].split("¦")[1];
        // Se ele for um array, TABELA
        if (params.split("|")[1] && params.split("|")[1].indexOf("array") > -1) {
            var params = g$.alterSargentos(params);
            for (var i = 0; i < params[1].split(",").length; i++) {
                if (verif == params[1].split(",")[i]) {
                    g$.alerta("Erro!", "Arquivo Indisponível", 4000, 'green darken-1');
                    g$.vfyFuncaoDepois(idFuncao);
                } else {
                    var link = document.createElement("a");
                    link.download = params[1].split(",")[i];
                    link.href = params[1].split(",")[i];
                    link.click();
                    g$.vfyFuncaoDepois(idFuncao);
                }
            }
        }
        // se for um so, TELA
        else {
            var params = g$.alterSargentos(params),
                elemento = document.createElement("a"),
                link = params[1].split("/");
            for (var i = 0; i < link.length; i++) {
                link[i] = link[i].trim();
            }
            if (verif == link.join("/")) {
                g$.alerta("Erro!", "Arquivo Indisponível!", 4000, 'green darken-1');
                g$.vfyFuncaoDepois(idFuncao);
            } else {
                elemento.download = link[1];
                elemento.href = (link.join("/").indexOf("https") == -1) ? "https://dys.net.br/" + link.join("/") : link.join("/");
                elemento.click();
                g$.vfyFuncaoDepois(idFuncao);
            }
        }
    }

    g$.sizePasta = function (params) {
        $http.get("/trazDisco/" + $rootScope.user.banco).success(function (response) {
            var pst = parseFloat(response.pasta / 1024);
            $("[data-id=" + params.split("|")[1] + "]")[0].textContent = response.bc + " MB";
            $("[data-id=" + params.split("|")[2] + "]")[0].textContent = pst.toFixed(2) + " MB";
        });
    }

    g$.geraPLP = function (params) {
        var params = g$.alterSargentos(params);
        empresa = params[1].trim();
        var urls = "https://www.csrdevsolution.com.br/sigep/gerar_plp_lote.php?banco=" + $rootScope.user.banco + "&idEmpresa=" + empresa + "&projeto=" + JSON.parse(localStorage.user).projeto_id + "&cliente=BELEZAPINK";
        $http.get(urls).success(function (data) {
            if (data) {
                var query = "update " + $rootScope.user.banco + ".pedido set plp = " + data.message + ",statusplp = 0 where statusplp = 1 and coalesce(rastreamento,'') <> '' AND rastreamento rlike '([A-Z]){2}([0-9]){9}([A-Z]){2}'";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    tela_impressao = window.open('about:blank');
                    tela_impressao.window.location.href = "http://dys.net.br/temp/plp/plp.html#plp=" + data.message + "&banco=" + $rootScope.user.banco + "&empresa=" + empresa.trim();
                })
            }
        })
    }

    g$.statusCorreio = function (params) {
        var params = g$.alterSargentos(params),
            urls = "http://138.197.32.22/correios/status_cliente.php?numeroContratoCorreios=" + params[1].trim() +
                "&cartaoPostagem=" + params[2].trim() + "&usuarioCorreios=" + params[3].trim() + "&senhaCorreios=" + params[4].trim() +
                "&banco=" + $rootScope.user.banco + "&idEmpresa=" + params[5].trim();
        $http.get(urls).success(function (data) {
            if (data.status == "error") {
                g$.alerta("Erro!", data.message, 4000, 'red darken-1');
            } else {
                g$.alerta("Sucesso!", data.message, 4000, 'green darken-1');
            }
        })
    }

    g$.initGoogleMaps = function (params) {
        var params = g$.alterSargentos(params),
            elemento = $("[data-id='" + params[1].trim() + "']")[0],
            address = params[2],
            texto = params[3],
            options;

        directionsService = new google.maps.DirectionsService();
        info = new google.maps.InfoWindow({ maxWidth: 200 });

        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();

                marker = new google.maps.Marker({
                    title: 'DYS',
                    icon: '../img/marker.png',
                    fullscreenControl: false,
                    position: new google.maps.LatLng(lat, lng)
                });

                options = {
                    zoom: 15,
                    center: marker.position,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map(elemento, options);

                marker.setMap(map);

                info.setContent(texto);
                info.open(map, marker);

                google.maps.event.addListener(marker, 'click', function () {
                    info.setContent(texto);
                    info.open(map, marker);
                });
            } else {
                g$.alerta("Erro!", "Não foi possivel obter localização: " + status);
            }
        });
    }

    g$.initRotaMaps = function (params) {
        var params = g$.alterSargentos(params),
            endereco = params[1];

        info.close();
        marker.setMap(null);

        var directionsDisplay = new google.maps.DirectionsRenderer();

        var request = {
            origin: endereco,
            destination: marker.position,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function (data, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(data);
                directionsDisplay.setMap(map);
            }
        });

        return false;
    }

    g$.confirm = function (params, isTela) {
        var params = g$.alterSargentos(params),
            msg = params[1],
            cond = params[2],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = (params[0].split("¦")[1]) ? params[0].split("¦")[1].trim() : undefined,
            primeiroParametro = (params[0].split("¦")[2]) ? params[0].split("¦")[2].trim() : undefined,
            segundoParametro = (params[0].split("¦")[3]) ? params[0].split("¦")[3].trim() : undefined;

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, null);
        };

        alertjs.show({
            type: 'confirm',
            title: 'Confirme',
            text: msg,
            from: 'left', //slide from left		
            complete: function (val) {
                if (val) {
                    g$.vfyFuncaoDepois(primeiroParametro, isTela, "id");
                } else {
                    g$.vfyFuncaoDepois(segundoParametro, isTela, "id");
                }
            }
        });
    }

    g$.openTelApp = function (params, isTela, elm) {
        var params = g$.alterSargentos(params),
            elm = (elm && elm.tagName) ? elm : event.target,
            valor = params[1],
            cond = params[2],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = (params[0].split("¦")[1]) ? params[0].split("¦")[1].trim() : undefined;

        while (elm.id != "botao") {
            elm = elm.parentElement;
        }

        elm.setAttribute("href", "tel: " + valor);
        elm.click();

        return g$.vfyFuncaoDepois(idFuncao, null);
    }

    g$.openGoogleMapsApp = function (params) {
        var params = g$.alterSargentos(params),
            address = params[1];

        directionsService = new google.maps.DirectionsService();
        info = new google.maps.InfoWindow({ maxWidth: 200 });

        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                var url = 'http://www.google.com/maps/place/' + lat + ',' + lng;
                var inAppBrowser = window.open(url, '_blank', 'location=yes');
            }
        });
    }

    g$.sendEmailApp = function (params) {
        var params = g$.alterSargentos(params);
        window.open('mailto:"' + params[1] + '"', '_system');
    }

    g$.popCloseLogo = function () {
        if ($rootScope.user.customiza == "1") {
            g$.limpaTelaAcoes();
            g$.limpaConsultas();
        }

        var tabelas = $("#view #tabela"),
            prop;
        for (var i = 0; i < tabelas.length; i++) {
            prop = tabelas[i].dataset.nome + "ID";
            delete g$[prop];
        }

        if ($("#view .popup")) {
            for (var i = 0; i < $("#view .popup").length; i++) {
                $("#view")[0].removeChild($("#view .popup")[i]);
            }
        }

        if ($("#view .tela-modal")) {
            for (var i = 0; i < $("#view .tela-modal").length; i++) {
                $("#view")[0].removeChild($("#view .tela-modal")[i]);
            }
        }

        $("#container-menu")[0].style.display = "block";

        if (!$("#menutelas")[0].classList.contains("menu-ativo")) {
            document.body.classList.remove("sidebar-collapse");
            controlWidthView(this, $('#menutelas')[0]);
        }

    }

    g$.popClose = function () {
        if ($rootScope.user.customiza == "1") {
            g$.limpaTelaAcoes();
            g$.limpaConsultas();
        }

        var tabelas = $("#view #tabela"),
            prop;

        for (var i = 0; i < tabelas.length; i++) {
            prop = tabelas[i].dataset.nome + "ID";
            delete g$[prop];
        }

        g$.arrayTelas = g$.arrayTelas.filter(v => v.toString() != $("#view .popup")[0].dataset.tela);

        if ($("#view .popup")[0]) $("#view")[0].removeChild($("#view .popup")[0]);

        $("#view")[0].classList.remove("fullscreen");
        $("#container-menu")[0].style.display = "block";

        if (!$("#menutelas")[0].classList.contains("menu-ativo")) {
            document.body.classList.remove("sidebar-collapse");
            controlWidthView(this, $('#menutelas')[0]);
        }

    }

    g$.closeModal = function (params) {
        var id, idFuncao, query, elm = event.target;

        if (params == "modal-perfil") g$.arrayTelas = g$.arrayTelas.filter(v => v.toString() != "ModalPerfil");
        if ($rootScope.user.customiza == "1") {
            g$.limpaTelaAcoes();
            g$.limpaConsultas();
        }
        if (params) {
            if (params.indexOf("|") > 0) {
                var params = g$.alterSargentos(params),
                    idFuncao = params[0].split("¦")[1],
                    id = params[1].trim(),
                    cond = params[2];

                if (g$.user.sysCli) {
                    while (!elm.dataset.menu_id) {
                        elm = elm.parentElement;
                    }
                    id = $("[data-tela='" + elm.dataset.menu_id + "']")[0].parentElement.parentElement.id;
                }

                g$.arrayTelas = g$.arrayTelas.filter(v => v.toString() != $("#view #" + id)[0].children[0].dataset.tela);

                valida = (!cond) ? true : g$.validaCondicao(cond);
                if (valida == false) {
                    console.log("Não executou porque" + cond + " é falso");
                    return g$.vfyFuncaoDepois(idFuncao);
                };

                g$.vfyFuncaoDepois(idFuncao);
            }
            else return $('#' + params).modal("close");
            $("#view")[0].removeChild($('#' + id)[0]);

        }
        else {
            $("#" + event.target.id).modal("close")
        }
    }

    g$.closeModalView = function (id) {
        var id_tela, query;
        if (g$.user.sysCli) {
            id_tela = id.replace(/\D+/g, '');
            query = "SELECT * FROM tela_funcao ef WHERE evento='close' and tela_id='" + id_tela + "' and isnull(ef.depois) ORDER BY ordem";
        }
        else
            query = "SELECT * FROM tela_funcao ef WHERE evento='close' and tela_id='" + $("#view #" + id + " .popup")[0].id + "' and isnull(ef.depois) ORDER BY ordem";

        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            // Trata Excecao
            if (g$.exceptionRequisicao("Close Modal", data)) return;

            data.data.forEach(function (v) {
                var funcao = v.funcao.split("|")[0].split("¦")[0].trim(),
                    params = v.funcao;
                g$[funcao.trim()](params, true);
            });
        })

        if ($rootScope.user.customiza == "1") {
            g$.limpaTelaAcoes();
            g$.limpaConsultas();
        }

        if (g$.user.sysCli) {
            g$.arrayTelas = g$.arrayTelas.filter(v => v.toString() != $("#view #" + id.replace(id_tela, ""))[0].children[0].dataset.tela);
            $("#view #" + id.replace(id_tela, ""))[0].parentElement.removeChild($("#view #" + id.replace(id_tela, ""))[0]);
        }
        else {
            g$.arrayTelas = g$.arrayTelas.filter(v => v.toString() != $("#view #" + id)[0].children[0].dataset.tela);
            $("#view")[0].removeChild($("#view #" + id)[0]);
            var elm = $("[data-id='" + g$.arr_focus_elemento[g$.arr_focus_elemento.length - 1].trim() + "']")[0];
            $("[data-tela='" + elm.dataset.menu_id + "'] .card-content")[0].focus();
        }
    }

    g$.lerXML = function (params) {
        var params = g$.alterSargentos(params),
            idFuncao = params[0].split("¦")[1],
            arquivo = (params[1] && params[1].trim() != "") ? params[1].trim() : params[1],
            memo = (params[2] && params[2].trim() != "") ? params[2].trim() : params[2],
            cond = params[3],
            ajax = new XMLHttpRequest();

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };

        arquivo = arquivo.replace(/\½/g, "/");
        arquivo = arquivo.substring(arquivo.indexOf("br") + 3, arquivo.length);
        arquivo = arquivo;

        $http.post(URL + "/leArquivo/", { arquivo: arquivo }).success(function (data) {
            g$[memo] = data;
            g$[memo] = g$[memo].replace(/\|/g, "").replaceAll("'", "");

            g$.vfyFuncaoDepois(idFuncao);
        });


        // ajax.open("GET", arquivo, true);
        // ajax.send();

        // ajax.onreadystatechange = function () {
        //     if (ajax.readyState == 4) {
        //         var xml = ajax.dataXML;

        //         g$[memo] = xml.documentElement.outerHTML;
        //         g$[memo] = g$[memo].replace(/\|/g, "");

        //         g$.vfyFuncaoDepois(idFuncao);
        //     }
        // }
    }

    g$.rateiaEstoque = function (params) {
        var params = g$.alterSargentos(params),
            produto = params[1],
            lote = params[2],
            nSerie = params[3],
            check = params[4],
            estoque = params[5],
            qtd = parseInt(params[6]),
            modo = params[7]
        if (check == 1) {
            var queryIns = "INSERT INTO " + $rootScope.user.banco + ".itens_estoque (produto_id,lote,nSerie,estoque_id) values (" + produto + ",'" + lote + "','" + nSerie + "'," + estoque + ");"
            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryIns.trim()))
        }
        qtd = (check == 1) ? 1 : qtd
        var query = "select saida from " + $rootScope.user.banco + ".natureza where id =" + modo;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var soma = (data.data[0].saida == 1) ? parseInt(qtd * -1) : qtd,
                queryVer = "SELECT id from " + $rootScope.user.banco + ".empresa_produto_estoque where produto_id = " + produto + " and empresa_estoque_id = " + estoque
            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryVer.trim())).success(function (data) {
                if (data.data.length == 0) {
                    var queryEst = "INSERT INTO " + $rootScope.user.banco + ".estoque_controle (estoque_id,produto_id,quantidade) values (" + estoque + "," + produto + "," + qtd + ");"
                }
                else {
                    var queryEst = "UPDATE " + $rootScope.user.banco + ".estoque_controle SET quantidade = quantidade + " + soma
                }
                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryEst.trim())).success(function (data) {
                    g$.alerta("Alerta!", "Salvo com Sucesso!");
                })
            })
        })
    }

    g$.descontoPorQuantidade = function (params) {
        var params = g$.alterSargentos(params),
            pedido = params[1];
        var query = "select desconto_quantidade from " + $rootScope.user.banco + ".empresa emp left join " + $rootScope.user.banco + ".pedido p on p.empresa_id = emp.id where p.id = " + pedido;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (data.data[0].desconto_quantidade == 1) {
                var query = "SELECT * from " + $rootScope.user.banco + ".pedido_produto where pedido_id = " + pedido;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    if (data.data.length != 0) {
                        var produtos = data.data,
                            ultimo = data.data.length
                        produtos.forEach(function (v, i) {
                            var query = "SELECT desconto_a_vista,desconto_a_prazo,de,ate,aPartir from " + $rootScope.user.banco + ".desconto_por_quantidade where produto_id = " + v.produto_id;
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                if (data.data.length != 0) {
                                    data.data.forEach(function (k, l) {
                                        if (v.quantidade >= k.aPartir || (v.quantidade >= k.de && v.quantidade <= k.ate)) {
                                            var queryForma = "select fp.a_vista,fp.aplica_desconto from " + $rootScope.user.banco + ".forma_de_pagamento fp left join " + $rootScope.user.banco + ".financeiro fi on fi.forma_de_pagamento_id = fp.id where fi.pedido_id = " + pedido;
                                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryForma.trim())).success(function (data) {
                                                if (forma.data.data[0]) {
                                                    if (forma.data.data[0].aplica_desconto == 1) {
                                                        if (forma.data.data.length > 1) {
                                                            var queryDesconto = "UPDATE " + $rootScope.user.banco + ".pedido_produto SET desconto = " + parseFloat((v.total / 100) * k.desconto_a_prazo) + " where id =" + v.id
                                                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryDesconto.trim()));
                                                        }
                                                        else {
                                                            if (forma.data.data[0].a_vista == 1) {
                                                                var queryDesconto = "UPDATE " + $rootScope.user.banco + ".pedido_produto SET desconto = " + parseFloat((v.total / 100) * k.desconto_a_vista) + " where id =" + v.id
                                                                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryDesconto.trim()));
                                                            }
                                                            else {
                                                                var queryDesconto = "UPDATE " + $rootScope.user.banco + ".pedido_produto SET desconto = " + parseFloat((v.total / 100) * k.desconto_a_prazo) + " where id =" + v.id
                                                                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryDesconto.trim()));
                                                            }
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                            if (i + 1 == ultimo) {
                                g$.verificaDesconto("VerificaDesconto | " + pedido)
                            }
                        })
                    }
                })
            }
        })
    }
    g$.verificaDesconto = function (params) {
        var params = g$.alterSargentos(params),
            pedido = params[1],
            query = "select SUM(porcentagem) as soma from " + $rootScope.user.banco + ".rentabilidade"
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var rent = parseInt(data.data[0].soma);
            var query = "select p.custo,p.id,pp.desconto,pp.valor,pp.quantidade from " + $rootScope.user.banco + ".pedido_produto pp left join " + $rootScope.user.banco + ".produto p on p.id = pp.produto_id where pp.pedido_id = " + pedido
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                data.data.forEach(function (v, i) {
                    var custoRent = parseFloat(v.custo) + ((parseFloat(v.custo) / 100) * rent);
                    newPreco = parseFloat(v.valor) - (parseFloat(v.desconto) / parseInt(v.quantidade));
                    if (newPreco < custoRent) {
                        var percent = 1 - (custoRent / v.valor),
                            valorMax = v.valor * percent;
                        var query = "UPDATE " + $rootScope.user.banco + ".pedido_produto set desconto = 0 where pedido_id = " + pedido + " and produto_id = " + v.id
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                            g$.atualizarTabela("atualizarTabela ¦ 402 | 1825");
                            g$.alerta("Alerta!", "Valor do Produto está abaixo da Rentabilidade Mínima!<br>O Desconto Máximo permitido é de " + (percent * 100).toFixed(2) + "% ou R$ " + valorMax.toFixed(2));
                        });
                    }
                })
            })
        })
    }

    g$.openModalTable = function (params) {
        var tabela = event.target.parentElement.parentElement.querySelector("table"),
            query = "select tbl_modal from node.elemento where id = " + tabela.dataset.id;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var modal = $("[data-id= " + data.data[0].tbl_modal + "]")[0];
            if (modal.id == "coluna" && tabela.id == "tabela") {
                if (!modal.querySelector("#fecharModal")) {
                    modal.firstElementChild.innerHTML = '<i id="fecharModal" class="fa fa-chevron-left" style="float:left;cursor:pointer;" onclick="g$.closeModalTable();"></i>';
                }
                modal.style.display = "block";
                modal.style.position = "absolute";
                if (modal.classList.contains("l4")) {
                    modal.style.left = "67%";
                }
                else if (modal.classList.contains("l2")) {
                    modal.style.left = "84.5%"
                }
                modal.style.zIndex = "2";
                modal.style.background = "white";
                modal.style.top = "0px";
                modal.style.height = "100%";
            }

        })
    }
    g$.closeModalTable = function (params) {
        event.target.parentElement.parentElement.style.display = "none";
    }

    g$.criarTabela = function (params) {
        var params = g$.alterSargentos(params),
            tabela = params[1].trim(),
            crm = params[2],
            alias = params[3],
            queryTabela = "CREATE TABLE NetoK." + tabela + " (`id` INT NOT NULL AUTO_INCREMENT,PRIMARY KEY (`id`))";
        var queryAlias = "select alias from node.tabela where alias = '" + alias.trim() + "'";
        $("[data-id=22247]")[0].innerHTML = '<div id="logTabela" style="text-align:center;"></div>'
        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryAlias.trim())).success(function (data) {
            if (!data.data.length) {
                if (crm == 1) {
                    var query = "select u.banco from node.projeto p left join node.usuario u on u.projeto_id = p.id where erp = 1 group by u.banco";
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        var k = data.data,
                            ultimo = data.data.length - 1;
                        k.forEach(function (v, i) {
                            var query = queryTabela.replace("NetoK", v.banco);
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                if (!data.error) {
                                    $("#logTabela")[0].innerHTML += '<p style="color:green;">' + v.banco + ' Criado com Sucesso!</p>'
                                }
                                else {
                                    $("#logTabela")[0].innerHTML += '<p style="color:red;">Erro ao Criar a Tabela no ' + v.banco + '!</p><p>' + data.error + '</p>'
                                }
                            })
                            if (i == ultimo) {
                                var query = "insert into node.tabela (tabela,alias) VALUES ('" + tabela + "','" + alias + "')"
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                    if (data.data.insertId) {
                                        $("#logTabela")[0].innerHTML += '<p style="color:green;">Criado com Sucesso na Node!</p>'
                                    } else {
                                        $("#logTabela")[0].innerHTML += '<p style="color:red;">Erro ao criar na Node!</p>'
                                    }
                                })
                            }
                        })
                    })
                } else {
                    var query = queryTabela.replace("NetoK", $rootScope.user.banco);
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        if (!data.error) {
                            var query = "insert into node.tabela (tabela,alias) VALUES ('" + tabela + "','" + alias + "')"
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                if (data.data.insertId) {
                                    $("#logTabela")[0].innerHTML += '<p style="color:green;">Tabela no ' + $rootScope.user.banco + ' Criada com Sucesso!</p>'
                                    var query = "insert into node.campo (campo,tabela_id) VALUES ('id'," + data.data.insertId + ")";
                                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                        if (data.data.insertId) {
                                            $("#logTabela")[0].innerHTML += '<p style="color:green;">Campo ID Criada com Sucesso no Node!</p>'
                                        }
                                        else {
                                            $("#logTabela")[0].innerHTML += '<p style="color:green;">Erro ao criar coluna ID no Node!</p>'
                                        }
                                    })
                                }
                                else {
                                    $("#logTabela")[0].innerHTML += '<p style="color:red;">Erro ao criar na Node!</p>';
                                }
                            })
                        }
                        else {
                            $("#logTabela")[0].innerHTML += '<p style="color:red;">' + data.error + '</p>'
                        }
                    })
                }
            }
            else {
                g$.alerta("Erro", "Alias já está cadastrado!");
            }
        })
    }

    g$.criarUpdateColuna = function (params) {
        var params = g$.alterSargentos(params),
            coluna = params[1].trim(),
            tabela = params[2].trim(),
            newColuna = (coluna) ? coluna : params[3].trim(),
            tipo = params[4].trim(),
            nn = (params[5] == 1) ? "NOT NULL" : "",
            uq = params[6].trim(),
            un = params[7].trim(), changeAdd,
            dafault = (params[8].trim()) ? "DEFAULT '" + params[8].trim() + "'" : "NULL",
            ERP = params[9],
            IDTabela = params[10],
            IDColuna = params[11];
        if (un == 1) {
            if (tipo.indexOf("INT") > -1) {
                un = "UNSIGNED";
            }
            else if (tipo.indexOf("DOUBLE") > -1) {
                un = "UNSIGNED";
            }
            else if (tipo.indexOf("TINYINT") > -1) {
                un = "UNSIGNED";
            }
        } else {
            un = ""
        }
        if (coluna) {
            changeAdd = "CHANGE COLUMN `" + newColuna + "` `" + params[3].trim() + "` "
        } else {
            changeAdd = "ADD COLUMN `" + newColuna + "` "
        }
        var queryColuna = "ALTER TABLE `NetoK`.`" + tabela + "` " + changeAdd + tipo + " " + un +
            " " + nn + " " + dafault + " ";
        if (uq == 1) {
            var unique = ",ADD UNIQUE INDEX `" + newColuna + "_UNIQUE` (`" + newColuna + "` ASC);"
            queryColuna += unique
        }
        if (ERP == 1) {
            var query = "select u.banco from node.projeto p left join node.usuario u on u.projeto_id = p.id where erp = 1 group by u.banco";
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                var k = data.data,
                    ultimo = data.data.length - 1;
                k.forEach(function (v, i) {
                    var query = queryColuna.replace("NetoK", v.banco);
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        if (!data.error) {
                            if (coluna) {
                                $("[data-id=22320]")[0].innerHTML += '<p style="color:green;">' + v.banco + ' Alterado com Sucesso!</p>'
                            }
                            else {
                                $("[data-id=22320]")[0].innerHTML += '<p style="color:green;">' + v.banco + ' Criado com Sucesso!</p>'
                            }
                        }
                        else {
                            $("[data-id=22320]")[0].innerHTML += '<p style="color:red;">Erro ao Criar a Coluna no ' + v.banco + '!</p><p>' + data.error + '</p>'
                        }
                    })
                    if (i == ultimo) {
                        if (coluna) {
                            var query = "UPDATE node.campo SET campo = '" + newColuna + "',tabela_id=" + IDTabela + ",UN=" + (un == "") ? 0 : 1 + ",NN=" + (nn == "") ? 0 : 1 + ",UQ=" + (uq == "") ? 0 : 1 + ",tipo='" + tipo + "',DF='" + dafault + "' where id = " + IDColuna;
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                if (!data.error) {
                                    $("[data-id=22320]")[0].innerHTML += '<p style="color:green;">Coluna Alterada a Tabela Node</p>'
                                }
                                else {
                                    $("[data-id=22320]")[0].innerHTML += '<p style="color:red;">Erro Ao Alterar na tabela Node</p><p>' + data.error + '</p>'
                                }
                            })
                        } else {
                            var query = "INSERT INTO node.campo (campo,tabela_id,UN,NN,UQ,tipo,DF) values ('" + newColuna + "','" + IDTabela + "','" + un + "','" + nn + "','" + uq + "','" + tipo + "'," + dafault + ")";
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                if (!data.error) {
                                    $("[data-id=22320]")[0].innerHTML += '<p style="color:green;">Criado com Sucesso na Node!</p>'
                                } else {
                                    $("[data-id=22320]")[0].innerHTML += '<p style="color:red;">Erro Ao criar na tabela Node</p><p>' + data.error + '</p>'
                                }
                            })
                        }
                    }
                })
            })
        }
        else {
            var query = queryColuna.replace("NetoK", $rootScope.user.banco);
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                if (!data.error) {
                    if (coluna) {
                        $("[data-id=22320]")[0].innerHTML += '<p style="color:green;">Coluna Alterada no Banco' + $rootScope.user.banco + '</p>'
                        var query = "UPDATE node.campo SET campo = '" + newColuna + "',tabela_id=" + IDTabela + ",UN=" + un + ",NN=" + nn + ",UQ=" + uq + ",tipo='" + tipo + "',DF='" + dafault + "' where id = " + IDColuna;
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                            if (!data.error) {
                                $("[data-id=22320]")[0].innerHTML += '<p style="color:green;">Coluna Alterada a Tabela Node</p>'
                            }
                            else {
                                $("[data-id=22320]")[0].innerHTML += '<p style="color:red;">Erro Ao Alterar na tabela Node</p><p>' + data.error + '</p>'
                            }
                        })
                    } else {
                        $("[data-id=22320]")[0].innerHTML += '<p style="color:green;">Coluna Criada no Banco' + $rootScope.user.banco + '</p>'
                        var query = "INSERT INTO node.campo (campo,tabela_id,UN,NN,UQ,tipo,DF) values ('" + newColuna + "'," + IDTabela + "," + un + "," + nn + "," + uq + ",'" + tipo + "'," + dafault + ")";
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                            if (!data.error) {
                                $("[data-id=22320]")[0].innerHTML += '<p style="color:green;">Coluna Adicionada a Tabela Node</p>'
                            }
                            else {
                                $("[data-id=22320]")[0].innerHTML += '<p style="color:red;">Erro Ao criar na tabela Node</p><p>' + data.error + '</p>'
                            }
                        })
                    }
                }
                else {
                    $("[data-id=22320]")[0].innerHTML += '<p style="color:red;">' + data.error + '</p>'
                }
            })
        }
    }

    $(document).keypress(function (e) {
        if (e.which == 13) {
            if ($("#btn_ok")[0]) {
                $("#btn_ok")[0].click();
                //event.stopPropagation();
                //event.preventDefault();
            }
            else if ($("#modal-comboDYS")[0].style.display == "block") {
                $("#container-combo")[0].children[0].click();
                event.stopPropagation();
                event.preventDefault();
            }
        }
    })

    g$.verificarNserie = function (params, isTela) {
        var selecionados = g$.tblProdnSerie_array.length,
            adicionados = $("[data-id=22856]")[0].querySelector("tbody").children.length - 1,
            idFuncao = params.split("¦")[1],
            query = "select SUM(quantidade) as qtd,produto_id from " + $rootScope.user.banco + ".pedido_produto pp left join " + $rootScope.user.banco + ".produto pt on pt.id = pp.produto_id where pedido_id = " + $("[data-id=22865]")[0].children[0].dataset.value + " and pt.controle_nSerie_lote = 1";
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (data.data[0].qtd == (selecionados + adicionados)) {
                return g$.vfyFuncaoDepois(idFuncao, isTela);
            } else {
                g$.alerta("Erro", "Quantidade do Pedido Diferente da quantidade adicionada!");
            }
        })
    }

    g$.pagar = function (params, isTela) {
        var params = g$.alterSargentos(params), obj, tempInterval, status_venda,
            formadepagamento = params[1],
            qtdParcelas = params[2],
            vlrtotal = params[3],
            elm = $("[data-id='" + params[4].trim() + "']")[0],
            nome = params[5].split("¦")[0].trim(),
            id = params[5].split("¦")[1].trim(),
            tela = params[5].split("¦")[2].trim(),
            cond = params[6],
            idFuncao = params[0].split("¦")[1];

        elm.innerHTML = "Conectando a Máquina...";

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        var data = {
            "formaPagamentoId": g$.formpagpaygo[formadepagamento.trim()],
            "terminalId": 344,
            "referencia": null,
            "aguardarTefIniciarTransacao": true,
            "parcelamentoAdmin": null,
            "quantidadeParcelas": qtdParcelas,
            "adquirente": "",
            "valorTotalVendido": vlrtotal
        }

        $http.post(URLPAYGOL + "/Venda/Vender/?key=" + KEYPAYGOL, data).success(function (data) {
            status_venda = data.intencaoVenda.intencaoVendaStatus.nome.toUpperCase();
            if (status_venda == "EXPIRADO") {
                elm.innerHTML = "";
                g$.alerta("Alerta", "ERRO ao conectar a maquina, tente novamente!!");
            }
            else if (status_venda == "EM PAGAMENTO") {
                elm.innerHTML = "Aguardando o Pagamento...";
                obj = { intencaoVendaId: data.intencaoVenda.id };
                tempInterval = setInterval(function () {
                    $http.post(URLPAYGOL + "/IntencaoVenda/GetByFiltros?key=" + KEYPAYGOL, obj).success(function (data) {
                        status_venda = data.intencoesVendas[0].intencaoVendaStatus.nome.toUpperCase();
                        if (status_venda == "CREDITADO") {
                            elm.innerHTML = "Imprimindo Compravante...";
                            clearInterval(tempInterval);
                            $http.post(URLPAYGOL + "/PagamentoExterno/GetByFiltros/?key=" + KEYPAYGOL, obj).success(function (data) {
                                elm.innerHTML = "";
                                g$.memocomprovante = data.pagamentosExternos[0].comprovanteAdquirente;
                                g$.criaTela(nome, tela, id, true, null, null);
                            });
                        }
                        else if (status_venda == "PAGAMENTO RECUSADO") {
                            elm.innerHTML = "";
                            g$.alerta("Alerta", "Pagamento Cancelado!!");
                            clearInterval(tempInterval);
                        }
                    });
                }, 3000);
            }
        });
    }

    g$.trazTipoPagamento = function (params) {
        var params = g$.alterSargentos(params),
            cond = params[1];
        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            // $("#loadzinTelaCq")[0].outerHTML = "";
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };
        $("[data-id=23656]")[0].innerHTML = '<div><div><p style="color:black;"><b>Formas de Envio: </b></p></div><div id="formaEnvio"></div></div>';
        var empresa = $("[data-id=45004]")[0].value,
            pedido = g$.memo1,
            prazo = $("[data-id=45006]")[0].value,
            preco = $("[data-id=45005]")[0].value;
        var query = 'select entrCep from ' + $rootScope.user.banco + '.cliente_fornecedor where node_usuario_id = ' + $rootScope.user.id;
        $http.get("/get/" + query).then(function (response) {
            if (!response.data.err) {
                if (response.data.data[0].entrCep) {
                    $http.get("http://54.233.79.112/calcularcep.php?empresa=" + $rootScope.user.banco + "&idEmpresa=" + empresa + "&pedido=" + pedido + "&projeto=" + JSON.parse(localStorage.user).projeto_id).then(function (data) {
                        data.data.Servicos.cServico.forEach(function (v, i) {
                            var servico
                            if (v.Codigo == 4014) {
                                servico = "Sedex";
                            } else if (v.Codigo == 4510) {
                                servico = "PAC";
                            }
                            var templateForma = "<div><input type='radio' name='forma' value='" + (parseFloat(v.Valor) + (parseFloat(v.Valor) / 100 * preco)) + "'><label style='padding-left:5px;color:black;' class='radioLabel'>" + servico + "  " + (parseInt(v.PrazoEntrega) + parseInt(prazo)) + " dias úteis <b>R$:" + (parseFloat(v.Valor) + (parseFloat(v.Valor) / 100 * preco)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + "</b></label></div>";
                            $("#formaEnvio")[0].innerHTML += templateForma;
                        })
                    })
                } else {
                    $("#formaEnvio")[0].innerHTML = '<label style="color:red;">Para calcular o frete é necessário informar o CEP, clicando em "Meu Perfil"</label>';
                }
            }
        })
    }

    g$.selecionaFrete = function (e) {
        if (event.target.tagName != 'DIV') {
            var valor
            if (event.target.tagName == 'LABEL') {
                valor = event.target.parentElement.firstElementChild.value;
                event.target.parentElement.firstElementChild.click();
            } else if (event.target.tagName == 'B') {
                valor = event.target.parentElement.parentElement.firstElementChild.value;
                event.target.parentElement.parentElement.firstElementChild.click();
            } else if (event.target.tagName == 'INPUT') {
                valor = event.target.value;
            }
            $("[data-id=23570]")[0].textContent = 'R$ ' + ((parseFloat($("[data-id=23568]")[0].textContent.replace(',', '.').replace('R$', '')) - parseFloat($("[data-id=23567]")[0].textContent.replace(',', '.').replace('R$', ''))) + parseFloat(valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            $("[data-id=23569]")[0].textContent = 'R$ ' + parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        }
    }

    g$.iniciarConsultas = function (params, isTela) {
        // iniciarConsultas | idConsulta       
        var params = g$.alterSargentos(params),
            consultaId = params[1],
            query = "SELECT c.id, c.inicio, c.horas, pd.hora_inicio, pd.hora_fim, TIMEDIFF(pd.hora_fim, pd.hora_inicio) horas_trabalhadas " +
                "FROM node.consulta c, node.projeto_desenvolvedor pd " +
                "WHERE c.id = " + consultaId + "pd.projeto_id = " + $rootScope.user.projeto_id;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var inicio = new Date(data.data[0].inicio),
                horas = 0,
                horas_trabalhadas = data.data[0].horas_trabalhadas,
                query = "UPDATE consulta SET ",
                queryfim = "'termino = termino'",
                ultimo = data.data.length - 1;

            data.forEach(function (v, i) {
                var id = v.id,
                    dias_trabalhados;

                horas += v.horas;

                dias_trabalhados = horas / horas_trabalhadas;
                dias_trabalhados.split(".")[0];

                var fim = new Date(inicio),
                    finsDeSemana = 0;
                fim.setDate(inicio.getDate() + dias_trabalhados);
                finsDeSemana = contaFinsDeSemana(inicio, fim);
                fim.setDate(fim.getDate() + finsDeSemana);
                // fim = somar dias_trabalhados com inicio

                query += "IF(id = " + id + ",\"inicio = \'" + inicio + "\', termino = \'" + fim + "'\",";
                queryfim += ")"
                inicio = fim;
                if (ultima == i) {
                    query = query + queryfim;
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim()))
                }
            });
        });
    }
    g$.contaFinsDeSemana = function (inicio, fim) {
        var d1 = new Date(inicio),
            d2 = new Date(fim),
            finsDeSemana = 0;

        while (d1 < d2) {
            var dia = d1.getDay();
            if (dia == 6 || dia == 0) {
                finsDeSemana += 1;
                d1.setDate(d1.getDate() + 1);
            }
        }
        return finsDeSemana;
    }

    g$.atualizaStatusPedidoERP = function (params, isTela) {
        // atualizaStatusPedidoERP | IdPedido | IdNovoStatus | condição
        var params = g$.alterSargentos(params),
            idPedido = params[1].trim(),
            idStatus = params[2].trim(),
            cond = params[3],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = params[0].split("¦")[1];

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
        };

        // puxa dados necessários para validação e tipo de movimentações que o status fará
        var query = "SELECT p.status_id status_anterior, p.natureza_da_operacao_id natureza_operacao_id, n.natureza_id natureza_id, nt.saida saida, p.empresa_id empresa_id, COUNT(ee.id) qntEstoques, COUNT(pp.id) qntProdutos, " +
            "COALESCE(st.reserva,0) reserva, COALESCE(st.baixa_estoque,0) baixa_estoque, COALESCE(st.rastreamento,0) rastreamento, COALESCE(st.enviado,0) enviado, COALESCE(st.separado,0) separado, COALESCE(st.enviaEmail,0) enviaEmail, COALESCE(st.estorna_estoque,0) estorna_estoque, COALESCE(st.gera_receber,0) gera_receber, " +
            "COALESCE(st.gera_receber_pago,0) gera_receber_pago, COALESCE(st.nao_editar_pedido,0) nao_editar_pedido, COALESCE(st.emitir_nota_automatico,0) emitir_nota_automatico, COALESCE(st.pronto_para_emissao_nf,0) pronto_para_emissao_nf, COALESCE(st.estorna_receber_nao_pago,0) estorna_receber_nao_pago, COALESCE(st.atualiza_status_integracao,0) atualiza_status_integracao, " +
            "COALESCE(st.confirmado,0) confirmado, COALESCE(st.pago,0) pago, COALESCE(st.concluido,0) concluido, COALESCE(st.retira_reserva,0) retira_reserva, COALESCE(st.estorna_reserva,0) estorna_reserva, COALESCE(st.dasabilita_emissao_nf,0) dasabilita_emissao_nf, COALESCE(st.gera_comissao,0) gera_comissao, COALESCE(st.estorna_comissao,0) estorna_comissao, COALESCE(st.gera_previsao_receber,0) gera_previsao_receber, COALESCE(st.cancelado,0) cancelado " +
            "FROM " + $rootScope.user.banco + ".status st, " + $rootScope.user.banco + ".pedido p " +
            "LEFT JOIN " + $rootScope.user.banco + ".natureza_da_operacao n ON n.id = p.natureza_da_operacao_id " +
            "LEFT JOIN " + $rootScope.user.banco + ".natureza nt ON nt.id = n.natureza_id " +
            "LEFT JOIN " + $rootScope.user.banco + ".empresa_estoque ee ON ee.empresa_id = p.empresa_id " +
            "LEFT JOIN " + $rootScope.user.banco + ".pedido_produto pp ON pp.pedido_id = p.id " +
            "WHERE p.id = " + idPedido + " AND st.id = " + idStatus;
        // console.log(query);

        $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
            if (g$.exceptionRequisicao("TROCA_STATUS", data.data)) return;
            var statusAnterior = data.data.data[0].status_anterior,
                idNaturezaOperacao = data.data.data[0].natureza_operacao_id,
                idNatureza = data.data.data[0].natureza_id,
                saida = data.data.data[0].saida,
                idEmpresa = data.data.data[0].empresa_id,
                qntEstoques = data.data.data[0].qntEstoques,
                qntProdutos = data.data.data[0].qntProdutos,
                // validacao estorno estoque e estorno reserva
                // sumario_estoque_nao_estornado = data.data.data[0].sumario_estoque_nao_estornado,
                // sumario_reserva_nao_estornado = data.data.data[0].sumario_reserva_nao_estornado,
                // dados do novo status
                rastreamento = data.data.data[0].rastreamento,
                enviado = data.data.data[0].enviado,
                separado = data.data.data[0].separado,
                enviaEmail = data.data.data[0].enviaEmail,
                nao_editar_pedido = data.data.data[0].nao_editar_pedido,
                emitir_nota_automatico = data.data.data[0].emitir_nota_automatico,
                pronto_para_emissao_nf = data.data.data[0].pronto_para_emissao_nf,
                atualiza_status_integracao = data.data.data[0].atualiza_status_integracao,
                confirmado = data.data.data[0].confirmado,
                pago = data.data.data[0].pago,
                concluido = data.data.data[0].concluido,
                dasabilita_emissao_nf = data.data.data[0].dasabilita_emissao_nf,
                reserva = data.data.data[0].reserva,
                retira_reserva = data.data.data[0].retira_reserva,
                estorna_reserva = data.data.data[0].estorna_reserva,
                baixa_estoque = data.data.data[0].baixa_estoque,
                estorna_estoque = data.data.data[0].estorna_estoque,
                estorna_receber_nao_pago = data.data.data[0].estorna_receber_nao_pago,
                gera_previsao_receber = data.data.data[0].gera_previsao_receber,
                gera_receber = data.data.data[0].gera_receber,
                gera_receber_pago = data.data.data[0].gera_receber_pago,
                cancelado = data.data.data[0].cancelado;

            if (statusAnterior != idStatus) {
                var msg, msgFim;
                if (baixa_estoque) msg = "Falha ao tentar baixar estoque!";
                else if (reserva) msg = "Falha ao tentar reservar!";
                else if (estorna_estoque) msg = "Falha ao tentar estornar estoque!";
                else if (retira_reserva || estorna_reserva) msg = "Falha ao tentar estornar reserva!";
                else if (gera_previsao_receber) msg = "Falha ao tentar gerar previsao receber!";
                else if (gera_receber) msg = "Falha ao tentar gerar receber!";
                else if (gera_receber_pago) msg = "Falha ao tentar gerar receber pago!";

                if (baixa_estoque && estorna_estoque) g$.alerta("Erro!", "Tentativa de baixar e estornar o estoque, favor rever a configuração do status!");
                else if (reserva && (retira_reserva || estorna_reserva)) g$.alerta("Erro!", "Tentativa de reservar e retirar reserva do estoque, favor rever a configuração do status!");
                else if (!idEmpresa && (baixa_estoque || reserva || estorna_estoque || retira_reserva || estorna_reserva || gera_previsao_receber || gera_receber || gera_receber_pago)) g$.alerta("Erro!", msg + " Motivo: Nenhuma empresa vinculada ao pedido!");
                else if (!qntEstoques && (baixa_estoque || reserva)) g$.alerta("Erro!", msg + " Motivo: Nenhum estoque vinculado a empresa do pedido!");
                // else if (!idNaturezaOperacao && (baixa_estoque || reserva)) g$.alerta("Erro!", msg + " Motivo: Nenhuma 'Natureza da Operação' vinculada ao pedido!");
                // else if (!idNatureza && (baixa_estoque || reserva)) g$.alerta("Erro!", msg + " Motivo: Nenhuma Natureza vinculada a 'Natureza da Operação' do pedido!");
                else if (!qntProdutos && (baixa_estoque || reserva)) g$.alerta("Erro!", msg + " Motivo: O pedido não possui nenhum produto!");
                // else if (!sumario_estoque_nao_estornado && estorna_estoque) g$.alerta("Erro!", "Falha ao tentar estornar estoque! Motivo: Não foi encontrado nenhum estoque não estornado para o pedido!");
                // else if (!sumario_reserva_nao_estornado && (retira_reserva || estorna_reserva)) g$.alerta("Erro!", "Falha ao tentar estornar reserva do estoque! Motivo: Não foi encontrado nenhuma reserva não estornada para o pedido!");
                // else if (sumario_estoque_nao_estornado && baixa_estoque) g$.alerta("Erro!", "Falha ao tentar baixar estoque! Motivo: Já foi encontrado uma baixa não estornada para este pedido!");
                // else if (sumario_reserva_nao_estornado && reserva) g$.alerta("Erro!", "Falha ao tentar reservar estoque! Motivo: Já foi encontrado uma reserva não estornada para este pedido!");
                else {
                    var msg = "Status alterado! Ações realizadas: ", fim = 0, totalAcoes = 22;
                    if (!msgFim) msgFim = "Nenhuma.";
                    // if (baixa_estoque || reserva) {
                    // if (reserva) {
                    //     (msgFim != "Nenhuma.") ? msgFim += ", Reserva de estoque" : msgFim = "Reserva de estoque";
                    // }
                    // if (baixa_estoque) {
                    //     (msgFim != "Nenhuma.") ? msgFim += ", Baixa de estoque" : msgFim = "Baixa de estoque";
                    // }
                    // // verifica se tem produtos sem estoque suficiente
                    // var fim2 = 0, total2 = 2;
                    // query = "SELECT IF (pp.quantidade > SUM(ep.quantidade),pr.produto,NULL) emFalta, pp.quantidade " +
                    //     "FROM " + $rootScope.user.banco + ".pedido p " +
                    //     "LEFT JOIN " + $rootScope.user.banco + ".pedido_produto pp ON p.id = pp.pedido_id " +
                    //     "LEFT JOIN " + $rootScope.user.banco + ".produto pr ON pr.id = pp.produto_id " +
                    //     "LEFT JOIN " + $rootScope.user.banco + ".empresa_estoque ee ON ee.empresa_id = p.empresa_id " +
                    //     "LEFT JOIN " + $rootScope.user.banco + ".empresa_produto_estoque ep ON ee.estoque_id = ep.estoque_id AND pp.produto_id = ep.produto_id " +
                    //     "WHERE p.id = " + idPedido + " GROUP BY pp.id ";
                    // $http.get(URL + "/get/" + query).then(function (data) {
                    //     if (g$.exceptionRequisicao("SemEstoque", data.data)) return;
                    //     var produtosEmFalta,
                    //         ultimo = data.data.data.length - 1;
                    //     data.data.data.forEach(function (v, i) {

                    //         if (v.emFalta) produtosEmFalta += v.emFalta + ", ";
                    //         if (i == ultimo) {
                    //             if (produtosEmFalta) {
                    //                 // lista produtos em falta e finaliza ação
                    //                 return g$.alerta("Erro!", msg + " Motivo: O(s) produto(s) " + produtosEmFalta + " não tem estoque suficiente para a ação.");
                    //             }

                    //             // g$.statusReserva(idEmpresa,idNatureza,idPedido);                                    

                    //             queryInsereSumario = "INSERT INTO " + $rootScope.user.banco + ".sumario (produto_id, quantidade_reserva, quantidade, estoque_id, natureza_id, pedido_id, custo, reservado, pedido_produto_id) VALUES ";

                    //             var query = "SELECT id, produto_id, quantidade FROM " + $rootScope.user.banco + ".pedido_produto WHERE pedido_id = " + idPedido;
                    //             $http.get(URL + "/get/" + query).then(function (data) {
                    //                 if (g$.exceptionRequisicao("PedidosProdutos", data.data)) return;
                    //                 var ultimo = data.data.data.length - 1;
                    //                 data.data.data.forEach(function (v, k) {
                    //                     var faltandoTotal = v.quantidade,
                    //                         faltandoTotalReserva = v.quantidade,
                    //                         idProduto = v.produto_id,
                    //                         idPedidoProduto = v.id;

                    //                     if (!reserva) faltandoTotalReserva = 0;
                    //                     if (!baixa_estoque) faltandoTotal = 0;

                    //                     var faltandoEstoque = faltandoTotal,
                    //                         faltandoEstoqueReserva = faltandoTotalReserva;

                    //                     // carrega quantidade por estoque
                    //                     var query = "SELECT ep.estoque_id, ep.quantidade quantidadeEstoque FROM " + $rootScope.user.banco + ".empresa_produto_estoque ep " +
                    //                         "LEFT JOIN " + $rootScope.user.banco + ".empresa_estoque ee ON ee.estoque_id = ep.estoque_id " +
                    //                         "WHERE ee.empresa_id = " + idEmpresa + " AND ep.produto_id = " + idProduto + " AND ep.quantidade >0 ORDER BY ee.prioridade";
                    //                     $http.get(URL + "/get/" + query).then(function (data) {
                    //                         if (g$.exceptionRequisicao("QntEstoque", data.data)) return;
                    //                         //var i = 0;
                    //                         var ultimoEstoque = data.data.data.length - 1;
                    //                         data.data.data.forEach(function (v, l) {
                    //                             if (faltandoTotal > 0 || faltandoTotalReserva > 0) {
                    //                                 //while (faltandoTotal > 0) {
                    //                                 // se faltandoTotal > qntEstoque; faltandoT -= qntEstoque _ faltandoEstoque = qntEstoque; faltandoE = faltandoT _ faltandoT = 0
                    //                                 var quantidadeEstoque = v.quantidadeEstoque,
                    //                                     quantidadeEstoqueReserva = v.quantidadeEstoque,
                    //                                     idEstoque = v.estoque_id;
                    //                                 if (!reserva) quantidadeEstoqueReserva = 0;
                    //                                 if (!baixa_estoque) quantidadeEstoque = 0;

                    //                                 if (faltandoTotal > quantidadeEstoque || faltandoTotalReserva > quantidadeEstoqueReserva) {
                    //                                     if (faltandoTotal > 0) {
                    //                                         faltandoEstoque = quantidadeEstoque;
                    //                                         faltandoTotal -= quantidadeEstoque;
                    //                                     }
                    //                                     if (faltandoTotalReserva > 0) {
                    //                                         faltandoEstoqueReserva = quantidadeEstoqueReserva;
                    //                                         faltandoTotalReserva -= quantidadeEstoqueReserva;
                    //                                     }
                    //                                 } else {
                    //                                     if (faltandoTotal > 0) faltandoEstoque = faltandoTotal;
                    //                                     if (faltandoTotalReserva > 0) faltandoEstoqueReserva = faltandoTotalReserva;
                    //                                     faltandoTotal = 0;
                    //                                     faltandoTotalReserva = 0;
                    //                                 }

                    //                                 if (faltandoTotalReserva == 0 && faltandoTotal == 0) ultimoEstoque = l;

                    //                                 // se for reserva
                    //                                 if (reserva) {
                    //                                     // console.log("Entrou reserva estoque");

                    //                                     queryInsereSumario += "(" + idProduto + ", " + faltandoEstoqueReserva + ", NULL, " + idEstoque + ", " + idNatureza + ", " + idPedido + ", NULL , 1, " + idPedidoProduto + "),"
                    //                                     if (ultimo == k && faltandoTotalReserva == 0) {
                    //                                         fim2 += 1;
                    //                                         if (fim2 == total2) {
                    //                                             // prepara inserçao: tira ultima virgula 
                    //                                             var query = queryInsereSumario.substr(0, (queryInsereSumario.length - 1));
                    //                                             //console.log(query);
                    //                                             $http.get(URL + "/get/" + query).then(function (data) {
                    //                                                 if (g$.exceptionRequisicao("Insert sumario", data.data)) return;
                    //                                                 // atualiza custo pedido_produto
                    //                                                 var query = "UPDATE " + $rootScope.user.banco + ".pedido_produto pp," +
                    //                                                     "(SELECT pedido_produto_id,SUM(COALESCE(s.quantidade, 0) * COALESCE(s.custo, 0)) soma " +
                    //                                                     "FROM " + $rootScope.user.banco + ".sumario s WHERE COALESCE(s.reservado, 0) = 0 AND COALESCE(s.estornado, 0) = 0 AND COALESCE(s.estorno, 0) = 0 " +
                    //                                                     "GROUP BY 1) s " +
                    //                                                     "SET pp.preco_de_custo = soma / pp.quantidade WHERE s.pedido_produto_id = pp.id " +
                    //                                                     "AND pp.pedido_id =" + idPedido;
                    //                                                 // console.log(query);
                    //                                                 $http.get(URL + "/get/" + query).then(function (data) {
                    //                                                     if (g$.exceptionRequisicao("Update custo", data.data)) return;
                    //                                                     fim += 2;

                    //                                                     if (fim == totalAcoes) {
                    //                                                         var query = "UPDATE " + $rootScope.user.banco + ".pedido SET status_id = " + idStatus + " WHERE id = " + idPedido;
                    //                                                         // console.log(query);
                    //                                                         $http.get(URL + "/get/" + query).then(function (data) {
                    //                                                             if (g$.exceptionRequisicao("Update status", data.data)) return;
                    //                                                             g$.alerta("Alerta!", msg + msgFim);
                    //                                                             return g$.vfyFuncaoDepois(idFuncao, isTela);
                    //                                                         });
                    //                                                     }
                    //                                                 });
                    //                                             });
                    //                                         }
                    //                                     }
                    //                                 }
                    //                                 else fim2 += 1;
                    //                                 // se for baixa
                    //                                 if (baixa_estoque) {
                    //                                     // console.log("Entrou baixa estoque");
                    //                                     // pega quantidade por estoque_custo
                    //                                     var query = "SELECT id,quantidade_disponivel, custo," + faltandoEstoque + " faltandoEstoque FROM " + $rootScope.user.banco + ".estoque_custo_produto " +
                    //                                         "WHERE estoque_id = " + idEstoque + " AND produto_id = " + idProduto + " AND quantidade_disponivel > 0 " +
                    //                                         "ORDER BY id";
                    //                                     $http.get(URL + "/get/" + query).then(function (data) {
                    //                                         if (g$.exceptionRequisicao("CustoEstoque", data.data)) return;
                    //                                         // var j = 0;
                    //                                         // while (faltandoEstoque > 0) {
                    //                                         var ultimoCusto = data.data.data.length - 1;
                    //                                         data.data.data.forEach(function (v, j) {
                    //                                             var faltandoEstoqueT;
                    //                                             (j == 0) ? faltandoEstoqueT = v.faltandoEstoque : faltandoEstoqueT = faltandoEstoque;
                    //                                             if (faltandoEstoqueT > 0) {
                    //                                                 var quantidadeDisponivel = v.quantidade_disponivel,
                    //                                                     idEstoqueCusto = v.id,
                    //                                                     custo = v.custo,
                    //                                                     aInserir;
                    //                                                 // se for o primeiro pega valor inicial, se nao pega valor reduzido

                    //                                                 if (faltandoEstoqueT > quantidadeDisponivel) {
                    //                                                     aInserir = quantidadeDisponivel
                    //                                                     faltandoEstoqueT -= quantidadeDisponivel;
                    //                                                 } else {
                    //                                                     aInserir = faltandoEstoqueT;
                    //                                                     faltandoEstoqueT = 0;
                    //                                                 }
                    //                                                 faltandoEstoque = faltandoEstoqueT;
                    //                                                 if (faltandoEstoque == 0) ultimoCusto = j;

                    //                                                 // prepara insersão no sumario
                    //                                                 queryInsereSumario += "(" + idProduto + ", NULL, " + aInserir + ", " + idEstoque + ", " + idNatureza + ", " + idPedido + ", " + custo + ", 0, " + idPedidoProduto + "),"
                    //                                                 // j++;

                    //                                                 if (ultimo == k && faltandoTotal == 0 && faltandoEstoqueT == 0 && ultimoCusto == j && ultimoEstoque == l) {
                    //                                                     fim2 += 1;

                    //                                                     if (fim2 == total2) {
                    //                                                         // prepara inserçao: tira ultima virgula 
                    //                                                         var query = queryInsereSumario.substr(0, (queryInsereSumario.length - 1));
                    //                                                         // console.log("Insert de reserva e/ou baixa do sumario: \n " + query);
                    //                                                         $http.get(URL + "/get/" + query).then(function (data) {
                    //                                                             if (g$.exceptionRequisicao("Insert sumario", data.data)) return;
                    //                                                             // atualiza custo pedido_produto
                    //                                                             var query = "UPDATE " + $rootScope.user.banco + ".pedido_produto pp," +
                    //                                                                 "(SELECT pedido_produto_id,SUM(COALESCE(s.quantidade, 0) * COALESCE(s.custo, 0)) soma " +
                    //                                                                 "FROM " + $rootScope.user.banco + ".sumario s WHERE COALESCE(s.reservado, 0) = 0 AND COALESCE(s.estornado, 0) = 0 AND COALESCE(s.estorno, 0) = 0 " +
                    //                                                                 "GROUP BY 1) s " +
                    //                                                                 "SET pp.preco_de_custo = soma ½ pp.quantidade WHERE s.pedido_produto_id = pp.id " +
                    //                                                                 "AND pp.pedido_id =" + idPedido;
                    //                                                             // console.log("Update do pedido produto setando media de custo \n " + query);
                    //                                                             var obj = { query: query.trim() };
                    //                                                             $http.post(URL + "/jsonQuery/", obj).then(function (data) {
                    //                                                                 if (g$.exceptionRequisicao("Update custo", data.data)) return;
                    //                                                                 //  $http.get(URL+"/get/" + query).then(function (data) {
                    //                                                                 fim += 2;
                    //                                                                 if (fim == totalAcoes) {
                    //                                                                     var query = "UPDATE " + $rootScope.user.banco + ".pedido SET status_id = " + idStatus + " WHERE id = " + idPedido;
                    //                                                                     // console.log("Update do status do pedido \n " + query);
                    //                                                                     $http.get(URL + "/get/" + query).then(function (data) {
                    //                                                                         if (g$.exceptionRequisicao("Update status", data.data)) return;
                    //                                                                         g$.alerta("Alerta!", msg + msgFim);
                    //                                                                         return g$.vfyFuncaoDepois(idFuncao, isTela);
                    //                                                                     });
                    //                                                                 }
                    //                                                             });
                    //                                                         });
                    //                                                     }
                    //                                                 }
                    //                                             }
                    //                                         });
                    //                                     });
                    //                                 }
                    //                                 else fim2 += 1;

                    //                                 //i++;
                    //                             }
                    //                         });
                    //                     });
                    //                 });
                    //             });
                    //         }
                    //     });
                    // });

                    // }

                    // Alterações Neto
                    if (reserva) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Reserva de estoque" : msgFim = "Reserva de estoque";
                        var query = 'UPDATE ' + $rootScope.user.banco + '.pedido_produto set reserva = 1, cancelado = 0 where pedido_id = ' + idPedido;
                        $http.post(URL + "//jsonQuery/", g$.trataQuery(query)).then(function (data) {
                            if (g$.exceptionRequisicao("Colocar Produtos na Reserva", data.data)) return;
                            fim += 2;
                            g$.msgFimStatus(idStatus, idPedido, msg, msgFim, fim);
                        });
                    }
                    // Fim Alterações Neto
                    else fim += 2;

                    if (estorna_estoque) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Estorno de estoque" : msgFim = "Estorno de estoque";

                        // // g$.statusEstornaEstoque(idPedido);

                        // var query = "INSERT INTO " + $rootScope.user.banco + ".sumario (produto_id, quantidade, empresa_id, estoque_id, natureza_id, pedido_id, custo, pedido_produto_id, estorno) " +
                        //     "SELECT produto_id, quantidade, empresa_id, estoque_id, natureza_id, pedido_id, custo, pedido_produto_id, 1 " +
                        //     "FROM " + $rootScope.user.banco + ".sumario WHERE pedido_id = " + idPedido + " AND COALESCE(estornado,0) = 0 AND COALESCE(reservado,0) = 0 AND COALESCE(estorno,0) <> 1";
                        // // console.log("Insert do estorno de estoque \n " + query);
                        // $http.get(URL + "/get/" + query).then(function (data) {
                        //     if (g$.exceptionRequisicao("Insert estorno", data.data)) return;
                        //     // atualiza custo(0) do pedido_produto
                        //     var query = "UPDATE " + $rootScope.user.banco + ".pedido_produto pp, " + $rootScope.user.banco + ".sumario s SET pp.preco_de_custo = 0, s.estornado=1 WHERE s.pedido_id = " + idPedido + " AND COALESCE(s.estorno,0) =0 AND COALESCE(s.reservado,0) = 0 AND pp.pedido_id = " + idPedido;
                        //     // console.log("Update do preço_de_custo do pedido_produto e seta 1 em estornado nos sumarios desse pedido \n " + query);
                        //     $http.get(URL + "/get/" + query).then(function (data) {
                        //         if (g$.exceptionRequisicao("Update estorno", data.data)) return;
                        //         fim += 1;
                        //         if (fim == totalAcoes) {
                        //             var query = "UPDATE " + $rootScope.user.banco + ".pedido SET status_id = " + idStatus + " WHERE id = " + idPedido;
                        //             // console.log("Update do status do pedido \n " + query);
                        //             $http.get(URL + "/get/" + query).then(function (data) {
                        //                 if (g$.exceptionRequisicao("Update status", data.data)) return;
                        //                 g$.alerta("Alerta!", msg + msgFim);
                        //                 return g$.vfyFuncaoDepois(idFuncao, isTela);
                        //             });
                        //         }
                        //     });
                        // });
                        var query = 'UPDATE ' + $rootScope.user.banco + '.pedido_produto set cancelado = 0 where pedido_id = ' + idPedido;
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
                            if (g$.exceptionRequisicao("Cancelar Pedido", data.data)) return;
                            fim += 1;
                            g$.msgFimStatus(idStatus, idPedido, msg, msgFim, fim);
                        });
                    }
                    else fim += 1;

                    // if (retira_reserva || estorna_reserva) {
                    //     (msgFim != "Nenhuma.") ? msgFim += ", Estorno de Reserva" : msgFim = "Estorno de Reserva";
                    //     var query = "INSERT INTO " + $rootScope.user.banco + ".sumario (produto_id, quantidade_reserva, empresa_id, estoque_id, natureza_id, pedido_id, custo, pedido_produto_id, estorno) " +
                    //         "SELECT produto_id, quantidade_reserva, empresa_id, estoque_id, natureza_id, pedido_id, custo, pedido_produto_id, 1 " +
                    //         "FROM " + $rootScope.user.banco + ".sumario WHERE pedido_id = " + idPedido + " AND COALESCE(estornado,0) = 0 AND COALESCE(reservado,0) = 1 AND COALESCE(estorno,0) <> 1";
                    //     // console.log("Insert do estorno de reserva \n " + query);
                    //     $http.get(URL + "/get/" + query).then(function (data) {
                    //         if (g$.exceptionRequisicao("Insert estorno reserva", data.data)) return;
                    //         var query = "UPDATE " + $rootScope.user.banco + ".sumario s SET s.estornado=1 WHERE s.pedido_id = " + idPedido + " AND COALESCE(s.estorno,0) =0 AND COALESCE(s.reservado,0) = 1";
                    //         // console.log("Update para setar 1 em estornado nos sumarios de reserva desse pedido \n " + query);
                    //         $http.get(URL + "/get/" + query).then(function (data) {
                    //             if (g$.exceptionRequisicao("Update estorno reserva", data.data)) return;
                    //             fim += 2;
                    //             if (fim == totalAcoes) {
                    //                 var query = "UPDATE " + $rootScope.user.banco + ".pedido SET status_id = " + idStatus + " WHERE id = " + idPedido;
                    //                 // console.log("Update do status do pedido \n " + query);
                    //                 $http.get(URL + "/get/" + query).then(function (data) {
                    //                     if (g$.exceptionRequisicao("Update status", data.data)) return;
                    //                     g$.alerta("Alerta!", msg + msgFim);
                    //                     return g$.vfyFuncaoDepois(idFuncao, isTela);
                    //                 });
                    //             }
                    //         });
                    //     });
                    // }

                    //Alterações Neto
                    if (estorna_reserva) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Estorno de Reserva" : msgFim = "Estorno de Reserva";

                        var query = 'UPDATE ' + $rootScope.user.banco + '.pedido_produto set reserva = 0, cancelado = 0 where pedido_id = ' + idPedido;
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
                            if (g$.exceptionRequisicao("Estornar Reserva", data.data)) return;
                            fim += 2;
                            g$.msgFimStatus(idStatus, idPedido, msg, msgFim, fim);
                        });
                    }
                    // Fim Alterações Neto
                    else fim += 2;

                    if (cancelado) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Pedido Cancelado" : msgFim = "Pedido Cancelado";
                        var query = 'UPDATE ' + $rootScope.user.banco + '.pedido_produto set estoque = 0 where pedido_id = ' + idPedido;
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
                            if (g$.exceptionRequisicao("Cancelar Pedido", data.data)) return;
                            fim += 1;
                            g$.msgFimStatus(idStatus, idPedido, msg, msgFim, fim);
                        });
                    } else {
                        fim += 1;
                    }

                    if (gera_receber) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Gerar Receber" : msgFim = "Gerar Receber";
                        fim += 1;
                    }
                    else fim += 1;

                    if (gera_receber_pago) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Gerar Receber Pago" : msgFim = "Gerar Receber Pago";
                        fim += 1;
                    }
                    else fim += 1;

                    if (gera_previsao_receber) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Gerar Previsão Receber" : msgFim = "Gerar Previsão Receber";
                        fim += 1;
                    }
                    else fim += 1;

                    if (rastreamento) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Gera Rastreamento" : msgFim = "Gera Rastreamento";
                        fim += 1;
                    }
                    else fim += 1;

                    if (enviado) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Enviado" : msgFim = "Enviado";
                        fim += 1;
                    }
                    else fim += 1;

                    if (separado) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Separado" : msgFim = "Separado";
                        fim += 1;
                    }
                    else fim += 1;

                    if (nao_editar_pedido) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Bloqueio da edição do pedido" : msgFim = "Bloqueio da edição do pedido";
                        fim += 1;
                    }
                    else fim += 1;

                    if (emitir_nota_automatico) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Emitir Nota" : msgFim = "Emitir Nota";
                        fim += 1;
                    }
                    else fim += 1;

                    if (pronto_para_emissao_nf) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Pronto para Emitir Nota" : msgFim = "Pronto para Emitir Nota";
                        fim += 1;
                    }
                    else fim += 1;

                    if (dasabilita_emissao_nf) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Emissão de Nota Desabilitada" : msgFim = "Emissão de Nota Desabilitada";
                        fim += 1;
                    }
                    else fim += 1;

                    if (atualiza_status_integracao) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Atualizar Status Integração" : msgFim = "Atualizar Status Integração";
                        fim += 1;
                    }
                    else fim += 1;

                    if (confirmado) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Pedido Confirmado" : msgFim = "Pedido Confirmado";
                        fim += 1;
                    }
                    else fim += 1;

                    if (pago) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Pedido Pago" : msgFim = "Pedido Pago";
                        fim += 1;
                    }
                    else fim += 1;

                    if (concluido) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Pedido Concluído" : msgFim = "Pedido Concluído";
                        fim += 1;
                    }
                    else fim += 1;

                    if (enviaEmail) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Enviar Email" : msgFim = "Enviar Email";
                        fim += 1;
                    }
                    else fim += 1;

                    if (estorna_receber_nao_pago) {
                        (msgFim != "Nenhuma.") ? msgFim += ", Estornar Receber Não Pago" : msgFim = "Estornar Receber Não Pago";
                        fim += 1;
                    }
                    else fim += 1;


                    g$.msgFimStatus(idStatus, idPedido, msg, msgFim, fim);
                    // var query = "UPDATE " + $rootScope.user.banco + ".pedido SET status_id = " + idStatus + " WHERE id = " + idPedido;
                    // // console.log("Update do status do pedido \n " + query);
                    // $http.get(URL + "/get/" + query).then(function (data) {
                    //     if (g$.exceptionRequisicao("Update status", data.data)) return;
                    //     g$.alerta("Alerta!", msg + msgFim);
                    //     return g$.vfyFuncaoDepois(idFuncao, isTela);
                    // });

                }
            }
        });

    }

    g$.msgFimStatus = function (idStatus, idPedido, msg, msgFim, fimCount) {
        // if (fimCount == 22) {
        var query = "UPDATE " + $rootScope.user.banco + ".pedido SET status_id = " + idStatus + " WHERE id = " + idPedido;
        // console.log("Update do status do pedido \n " + query);
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
            if (g$.exceptionRequisicao("Update status", data.data)) return;
            g$.alerta("Alerta!", msg + msgFim);
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        });
        // }
    }

    g$.pegaAcoesStatus = function (params, isTela) {
        // pegaAcoesStatus | idStatus | elementoDestino | condicao
        var params = g$.alterSargentos(params),
            idStatus = params[1].trim(),
            elemento = params[2].trim(),
            cond = params[3],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = params[0].split("¦")[1];

        if (valida == false) {
            // console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        // puxa dados necessários para validação e tipo de movimentações que o status fará
        var query = "SELECT COALESCE(st.reserva,0) reserva, COALESCE(st.baixa_estoque,0) baixa_estoque, COALESCE(st.rastreamento,0) rastreamento, COALESCE(st.enviado,0) enviado, COALESCE(st.separado,0) separado, COALESCE(st.enviaEmail,0) enviaEmail, COALESCE(st.estorna_estoque,0) estorna_estoque, COALESCE(st.gera_receber,0) gera_receber, " +
            "COALESCE(st.gera_receber_pago,0) gera_receber_pago, COALESCE(st.nao_editar_pedido,0) nao_editar_pedido, COALESCE(st.emitir_nota_automatico,0) emitir_nota_automatico, COALESCE(st.pronto_para_emissao_nf,0) pronto_para_emissao_nf, COALESCE(st.estorna_receber_nao_pago,0) estorna_receber_nao_pago, COALESCE(st.atualiza_status_integracao,0) atualiza_status_integracao, " +
            "COALESCE(st.confirmado,0) confirmado, COALESCE(st.pago,0) pago, COALESCE(st.concluido,0) concluido, COALESCE(st.retira_reserva,0) retira_reserva, COALESCE(st.estorna_reserva,0) estorna_reserva, COALESCE(st.dasabilita_emissao_nf,0) dasabilita_emissao_nf, COALESCE(st.gera_comissao,0) gera_comissao, COALESCE(st.estorna_comissao,0) estorna_comissao, COALESCE(st.gera_previsao_receber,0) gera_previsao_receber " +
            "FROM " + $rootScope.user.banco + ".status st WHERE id = " + idStatus;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var rastreamento = data.data[0].rastreamento,
                enviado = data.data[0].enviado,
                separado = data.data[0].separado,
                enviaEmail = data.data[0].enviaEmail,
                nao_editar_pedido = data.data[0].nao_editar_pedido,
                emitir_nota_automatico = data.data[0].emitir_nota_automatico,
                pronto_para_emissao_nf = data.data[0].pronto_para_emissao_nf,
                atualiza_status_integracao = data.data[0].atualiza_status_integracao,
                confirmado = data.data[0].confirmado,
                pago = data.data[0].pago,
                concluido = data.data[0].concluido,
                dasabilita_emissao_nf = data.data[0].dasabilita_emissao_nf,
                reserva = data.data[0].reserva,
                retira_reserva = data.data[0].retira_reserva,
                estorna_reserva = data.data[0].estorna_reserva,
                baixa_estoque = data.data[0].baixa_estoque,
                estorna_estoque = data.data[0].estorna_estoque,
                estorna_receber_nao_pago = data.data[0].estorna_receber_nao_pago,
                gera_previsao_receber = data.data[0].gera_previsao_receber,
                gera_receber = data.data[0].gera_receber,
                gera_receber_pago = data.data[0].gera_receber_pago,
                texto = "Nenhuma.";

            if (gera_receber) (texto != "Nenhuma.") ? texto += ", </br>Gerar Receber" : texto = "Gerar Receber";
            if (gera_receber_pago) (texto != "Nenhuma.") ? texto += ",</br> Gerar Receber Pago" : texto = "Gerar Receber Pago";
            if (gera_previsao_receber) (texto != "Nenhuma.") ? texto += ",</br> Gerar Previsão Receber" : texto = "Gerar Previsão Receber";
            if (rastreamento) (texto != "Nenhuma.") ? texto += ",</br> Gera Rastreamento" : texto = "Gera Rastreamento";
            if (enviado) (texto != "Nenhuma.") ? texto += ",</br> Enviado" : texto = "Enviado";
            if (separado) (texto != "Nenhuma.") ? texto += ",</br> Separado" : texto = "Separado";
            if (nao_editar_pedido) (texto != "Nenhuma.") ? texto += ",</br> Bloqueio da edição do pedido" : texto = "Bloqueio da edição do pedido";
            if (emitir_nota_automatico) (texto != "Nenhuma.") ? texto += ",</br> Emitir Nota" : texto = "Emitir Nota";
            if (pronto_para_emissao_nf) (texto != "Nenhuma.") ? texto += ",</br> Pronto para Emitir Nota" : texto = "Pronto para Emitir Nota";
            if (dasabilita_emissao_nf) (texto != "Nenhuma.") ? texto += ",</br> Emissão de Nota Desabilitada" : texto = "Emissão de Nota Desabilitada";
            if (atualiza_status_integracao) (texto != "Nenhuma.") ? texto += ",</br> Atualizar Status Integração" : texto = "Atualizar Status Integração";
            if (confirmado) (texto != "Nenhuma.") ? texto += ",</br> Pedido Confirmado" : texto = "Pedido Confirmado";
            if (pago) (texto != "Nenhuma.") ? texto += ",</br> Pedido Pago" : texto = "Pedido Pago";
            if (concluido) (texto != "Nenhuma.") ? texto += ",</br> Pedido Concluído" : texto = "Pedido Concluído";
            if (estorna_estoque) (texto != "Nenhuma.") ? texto += ",</br> Estornar Estoque" : texto = "Estornar Estoque";
            if (retira_reserva || estorna_reserva) (texto != "Nenhuma.") ? texto += ",</br> Estornar Reserva" : texto = "Estornar Reserva";
            if (baixa_estoque) (texto != "Nenhuma.") ? texto += ",</br> Baixar Estoque" : texto = "Baixar Estoque";
            if (reserva) (texto != "Nenhuma.") ? texto += ",</br> Reservar" : texto = "Reservar";
            if (enviaEmail) (texto != "Nenhuma.") ? texto += ",</br> Enviar Email" : texto = "Enviar Email";
            if (estorna_receber_nao_pago) (texto != "Nenhuma.") ? texto += ",</br> Estornar Receber Não Pago" : texto = "Estornar Receber Não Pago";

            if (reserva && !baixa_estoque) g$.alerta("ATENÇÃO!", "Este status reserva mas não baixa estoque!");
            if (!reserva && baixa_estoque) g$.alerta("ATENÇÃO!", "Este status baixa estoque mas não reserva!");
            if (!estorna_estoque && (estorna_reserva || retira_reserva)) g$.alerta("ATENÇÃO!", "Este status estorna reserva mas não estorna o estoque!");
            if (estorna_estoque && !(estorna_reserva || retira_reserva)) g$.alerta("ATENÇÃO!", "Este status estorna o estoque mas não estorna a reserva!");
            if (estorna_estoque && baixa_estoque) g$.alerta("ATENÇÃO!", "Este status estorna e baixa estoque!");
            if (reserva && (estorna_reserva || retira_reserva)) g$.alerta("ATENÇÃO!", "Este status gera e estorna reserva!");

            campo = $("#view [data-id=" + elemento.trim() + "]")[0];
            if (campo) {
                if (campo.id == "label") {
                    if (campo.dataset.formato && campo.dataset.formato != "" && campo.dataset.formato != "null") {
                        campo.innerHTML = $(campo).masked(texto);
                    }
                    else campo.innerHTML = texto;
                }
            }

        });
    }

    g$.atualizaPedidoDevolucao = function (params, isTela) {
        // atualizaPedidoDevolucao | idPedidoDevolucao
        var params = g$.alterSargentos(params),
            idFuncao = params[0].split("¦")[1];
        idPedidoDevolucao = params[1].trim(),
            query = "SELECT pedido_original_id, produto_id FROM " + $rootScope.user.banco + ".pedido_devolucao WHERE NOT ISNULL(quantidade) AND NOT ISNULL(estoque_id) AND id = " + idPedidoDevolucao;
        // console.log(query);
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var idPedidoOriginal = data.data[0].pedido_original_id,
                idProduto = data.data[0].produto_id;
            if (idPedidoOriginal) {

                var query = "SELECT (SELECT SUM(quantidade) FROM " + $rootScope.user.banco + ".pedido_produto WHERE produto_id = " + idProduto + " AND pedido_id = " + idPedidoOriginal + ")- SUM(pd.quantidade) quantidadeDisponivel " +
                    "FROM " + $rootScope.user.banco + ".pedido_devolucao pd " +
                    "WHERE pd.produto_id = " + idProduto + " AND pd.pedido_original_id = " + idPedidoOriginal;
                // console.log(query);
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    var quantidadeDisponivel = data.data[0].quantidadeDisponivel,
                        query = "UPDATE " + $rootScope.user.banco + ".pedido_devolucao " +
                            "SET quantidade_disponivel = " + quantidadeDisponivel +
                            " WHERE produto_id = " + idProduto + " AND pedido_original_id = " + idPedidoOriginal;
                    // console.log(query);
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        var query = "INSERT INTO " + $rootScope.user.banco + ".pedido_devolucao (pedido_original_id, produto_id, quantidade_disponivel) " +
                            "VALUES (" + idPedidoOriginal + "," + idProduto + "," + quantidadeDisponivel + ")";
                        if (quantidadeDisponivel > 0) {
                            // console.log(query);
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                return g$.vfyFuncaoDepois(idFuncao, isTela);
                            });
                        } else {
                            g$.alerta("Alerta", "Quantidade máxima atingida, não gera nova linha");
                            return g$.vfyFuncaoDepois(idFuncao, isTela);
                        }
                    });
                });

            };
        });
    };

    g$.iniciaDevolucao = function (params, isTela) {
        // iniciaDevolucao | idPedido | condicao
        var params = g$.alterSargentos(params),
            cond = params[2],
            valida = (!cond) ? true : g$.validaCondicao(cond),
            idFuncao = params[0].split("¦")[1];
        idPedido = params[1].trim();
        if (valida == false) {
            // console.log("Não executou porque " + cond + " é falso");
            g$.alerta("Alerta", "Pedido Selecionado não possui baixa de estoque registrada!");
            // return g$.vfyFuncaoDepois(idFuncao, isTela);
        };
        query = "SELECT IF(NOT ISNULL(pedido_gerado_id),COUNT(id),0) linhasGeradas, IF(ISNULL(pedido_gerado_id),COUNT(id),0) linhasPreparadas FROM " + $rootScope.user.banco + ".pedido_devolucao WHERE pedido_original_id = " + idPedido;
        // console.log(query);
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var linhasGeradas = data.data[0].linhasGeradas,
                linhasPreparadas = data.data[0].linhasPreparadas;
            // pedido de devolucao ja foi feito
            if (linhasGeradas > 0) g$.alerta("Erro!", "Já foi gerado um pedido de devoluçao para este pedido!");
            // pedido de devolucao ja foi iniciado nao cria novas linhas
            else if (linhasPreparadas > 0) return g$.vfyFuncaoDepois(idFuncao, isTela);
            // iniciar pedido de devolucao
            else {
                var query = "INSERT INTO " + $rootScope.user.banco + ".pedido_devolucao (pedido_original_id, produto_id, quantidade_disponivel) " +
                    "SELECT pedido_id,produto_id,quantidade FROM " + $rootScope.user.banco + ".pedido_produto WHERE pedido_id = " + idPedido;
                // console.log(query);
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    return g$.vfyFuncaoDepois(idFuncao, isTela);
                });
            }

        });
    }

    g$.novoPedidoDevoluacao = function (params, isTela) {
        // novoPedidoDevoluacao | idPedido | idNaturezaOperacao | condicao
        var params = g$.alterSargentos(params),
            idPedido = params[1].trim(),
            idNaturezaOperacao = params[2].trim(),
            cond = params[3],
            ide_finNFe = 4,
            valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            // g$.alerta("Alerta", "Pedido Selecionado não possui baixa de estoque registrada!");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        };

        // verifica se pedido_devolucao tem registros com quantidade e estoque not null
        var query = "SELECT pedido_original_id, produto_id, quantidade, estoque_id FROM " + $rootScope.user.banco + ".pedido_devolucao WHERE pedido_original_id = " + idPedido +
            " AND NOT ISNULL(quantidade) AND NOT ISNULL(estoque_id)";
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var pedidoProdutos = data.data;
            if (pedidoProdutos && pedidoProdutos[0]) {
                // inserePedidoDevolucao
                var query = "INSERT INTO " + $rootScope.user.banco + ".pedido (natureza_da_operacao_id,ide_finNFe, ide_NFref, cliente_fornecedor_id,empresa_id, vendedor_id) " +
                    "SELECT " + idNaturezaOperacao + " natureza_da_operacao_id, " + ide_finNFe + " ide_finNFe, chaveNFe, cliente_fornecedor_id, empresa_id, vendedor_id FROM " + $rootScope.user.banco + ".pedido WHERE id = " + idPedido;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {

                    // inserePedidosProdutosDevolucao
                    var idPedidoGerado = data.data.insertId,
                        query = "INSERT INTO " + $rootScope.user.banco + ".pedido_produto (pedido_id, produto_id, quantidade, estoque_id) " +
                            "SELECT pedido_original_id, produto_id, quantidade, estoque_id FROM " + $rootScope.user.banco + ".pedido_devolucao WHERE pedido_original_id = " + idPedido +
                            " AND NOT ISNULL(quantidade) AND NOT ISNULL(estoque_id)";
                    if (idPedidoGerado) {
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                            // deleta pedido_devolucao sem quantidasde e estoque
                            var query = "DELETE FROM " + $rootScope.user.banco + ".pedido_devolucao WHERE pedido_original_id = " + idPedido +
                                " AND (ISNULL(quantidade) OR ISNULL(estoque_id))";
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {

                                // atualiza pedido_devolucao setando id do pedido gerado
                                var query = "UPDATE " + $rootScope.user.banco + ".pedido_devolucao SET pedido_gerado_id = " + idPedidoGerado + " WHERE pedido_original_id = " + idPedido;
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                    g$.alerta("Alerta", "Pedido de devolução gerado com sucesso!");
                                    return g$.vfyFuncaoDepois(idFuncao, isTela);
                                });
                            });
                        });
                    }
                });
            }
        });
    }

    g$.converteQuerySaas = function () {
        $http.post(URL + "/leArquivo/", { arquivo: "DYS_TEMPLATE/trg.sql" }).success(function (data) {
            g$.extraiQuerys(data);
        });
    }

    g$.extraiQuerys = function (text) {
        var json = { texto: text }, querySaas = [], t, tables = [];
        $http.post(URL + "/extraiQuery/", json).success(function (data) {
            if (data.tables[0]) {
                data.tables[0].forEach(function (table, i) {
                    t = table.substring(table.indexOf('TABLE ') + 6, table.length);
                    t = (t.indexOf("'") == 0) ? t.split(".")[1].split(" ")[0] : t.split(" ")[0];
                    tables.push(t);
                });
            }
            g$.tables = tables;

            data.query[0].forEach(function (query, i) {
                console.log(query);
                querySaas.push({
                    query: query,
                    querySaas: g$.montaQuery(g$.trataQuery(query, true))
                });
                console.log(querySaas[i].querySaas);
                text = text.replace(querySaas[i].query, querySaas[i].querySaas)
            });
            // console.log(querySaas);
            // console.log(text);
        });
    }

    g$.verEscala = function (params) {
        params = params.split("|");
        var dataInicio = $("[data-id=" + params[1] + "]")[0].value,
            dataFim = $("[data-id=" + params[2] + "]")[0].value;
        if (dataFim && dataInicio) {
            var query = "select id,login_chupa_cabra,senha_chupa_cabra from asago.cliente_fornecedor where node_usuario_id = " + $rootScope.user.id;
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                if (data.data[0].login_chupa_cabra && data.data[0].senha_chupa_cabra) {
                    dataInicio = dataInicio.split("-");
                    dataFim = dataFim.split("-");
                    var mesInicio = extraiMes(dataInicio[1])
                    var mesFim = extraiMes(dataFim[1])
                    dataInicio = dataInicio[2] + "-" + mesInicio + "-" + dataInicio[0].slice(2);
                    dataFim = dataFim[2] + "-" + mesFim + "-" + dataFim[0].slice(2);
                    var corpo = { "userName": data.data[0].login_chupa_cabra, "password": data.data[0].senha_chupa_cabra, "dt-inicial": dataInicio, "dt-final": dataFim }
                    $.post("https://doyoursystem.com.br/chupa-cabra/", corpo).then(function (data) {
                        data = JSON.parse(data);
                        if (data.status == 0) {
                            return g$.alerta("Erro", "Login ou Senha Incorretos!");
                        } else if (data.status == 200) {
                            g$.openLink("https://" + data.url);
                        }
                    })
                } else {
                    return g$.alerta("Erro", "Login ou Senha não foram informados!");
                }
            })
        } else {
            return g$.alerta("Erro", "Data de início ou Fim não informados!");
        }
    }

    function extraiMes(mes) {
        if (mes == 1) return "Jan"
        else if (mes == 2) return "Feb"
        else if (mes == 3) return "Mar"
        else if (mes == 4) return "Apr"
        else if (mes == 5) return "May"
        else if (mes == 6) return "Jun"
        else if (mes == 7) return "Jul"
        else if (mes == 8) return "Aug"
        else if (mes == 9) return "Sep"
        else if (mes == 10) return "Oct"
        else if (mes == 11) return "Nov"
        else if (mes == 12) return "Dec"
    }

    g$.integraProdutosXML = function (params) {
        var params = g$.alterSargentos(params),
            estoque = params[1].trim(),
            fornecedor = params[2].trim();
        if (!g$.tblPNF_array) return g$.alerta("Erro", "Produtos não Informados!");
        if (!estoque) return g$.alerta("Erro", "Estoque não informado!");
        if (!fornecedor) return g$.alerta("Erro", "Estoque não informado!");
        if (g$.tblPNF_array.length > 0) {
            loadzinTela = angular.element($.template[0]["loadzinTela"])[0];
            document.body.append(loadzinTela);
            $("#loadzinTela")[0].id = "loadzinTelaXML";
            var ProdutosIntegrar = g$.tblPNF_array,
                ultimo = ProdutosIntegrar.length
            ProdutosIntegrar.forEach(function (v, i) {
                if (v.e_11636 == "PRODUTO DESCONHECIDO") {
                    var idPP = v.e_11632,
                        descForne = v.e_11634,
                        queryCall = "CALL node.cria_produto_fornecedor('" + $rootScope.user.banco + "', '" + idPP + "', '" + descForne + "')",
                        queryInsert = "INSERT INTO " + $rootScope.user.banco + ".sumario (produto_id,estoque_id,quantidade,natureza_id,usuario_id, custo, fornecedor_id, entrada) " +
                            "SELECT produto_id, " + estoque + ", quantidade, 0,  " + $rootScope.user.id + ", (total+COALESCE(ipi_vipi,0)) ½ (quantidade *COALESCE(multiplo,1)), " + fornecedor + ", 1 " +
                            "FROM " + $rootScope.user.banco + ".pedido_produto pp WHERE pp.id = " + idPP;
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryCall.trim())).success(function (data) {
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryInsert.trim())).success(function (data) {
                            var queryUpdate = "update " + $rootScope.user.banco + ".pedido_produto set estoque_ok = 1 where id = " + idPP;
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryUpdate.trim())).success(function (data) {
                                if (ultimo == i + 1) {
                                    g$.atualizarTabela("atualizarTabela | 11631");
                                    g$.alerta("Sucesso", "Sucesso!");
                                    $("#loadzinTelaXML")[0].outerHTML = "";
                                }
                            })
                        })
                    })
                } else {
                    if (v.e_11632) {
                        var query = "select estoque_ok from " + $rootScope.user.banco + ".pedido_produto where id = " + v.e_11632;
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                            if (data.data[0].estoque_ok == "0") {
                                var idPP = v.e_11632,
                                    descForne = v.e_11634,
                                    queryInsert = "INSERT INTO " + $rootScope.user.banco + ".sumario (produto_id,estoque_id,quantidade,natureza_id,usuario_id, custo, fornecedor_id, entrada) " +
                                        "SELECT produto_id, " + estoque + ", quantidade, 0,  " + $rootScope.user.id + ", (total+COALESCE(ipi_vipi,0)) ½ (quantidade *COALESCE(multiplo,1)), " + fornecedor + ", 1 " +
                                        "FROM " + $rootScope.user.banco + ".pedido_produto pp WHERE pp.id = " + idPP;
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryInsert.trim())).success(function (data) {
                                    var queryUpdate = "update " + $rootScope.user.banco + ".pedido_produto set estoque_ok = 1 where id = " + idPP;
                                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryUpdate.trim())).success(function (data) {
                                        if (ultimo == i + 1) {
                                            g$.atualizarTabela("atualizarTabela | 11631");
                                            g$.alerta("Sucesso", "Sucesso!");
                                            $("#loadzinTelaXML")[0].outerHTML = "";
                                        }
                                    })
                                })
                            }
                        })
                    }
                }
            })
        }
    }

    g$.criaAtributos = function (params) {
        var destino = $("[data-id=40203]")[0]
        var produtoID = $("[data-id=2689]")[0].value
        var query = "SELECT * FROM " + $rootScope.user.banco + ".atributo"
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var atributos = data.data;
            var ultimo = atributos.length
            atributos.forEach(function (v, i) {
                var template = angular.element($.template[0]["input"])[0];
                if (v.formato == "date") {
                    template.type = "date";
                    template.className = "form-control";
                    template.id = v.id;
                    template.dataset.carg = 0;
                    destino.innerHTML += '<div style="margin-top:8px;"><label>' + v.nome + '</label>' + template.outerHTML + '</div>'
                } else if (v.formato == "check") {
                    template = angular.element($.template[0]["checkMaterialize"])[0];
                    destino.appendChild(template);
                    template.querySelector("input").id = v.id;
                    template.querySelector("input").dataset.carg = 0;
                    template.querySelector("label").setAttribute("for", v.id);
                    template.querySelector("label").innerHTML = v.nome;
                    template.querySelector("label").style.marginTop = "10px";
                } else if (v.formato == "valor") {
                    template.className = "form-control";
                    template.id = v.id;
                    template.dataset.carg = 0;
                    destino.innerHTML += '<div style="margin-top:8px;"><label>' + v.nome + '</label>' + template.outerHTML + '</div>'
                } else if (v.formato == "option") {

                }
                if (ultimo == i + 1) {
                    var query = "select * from " + $rootScope.user.banco + ".produto_atributo pa " +
                        "left join " + $rootScope.user.banco + ".atributo at on at.id = pa.atributo_id " +
                        "where produto_id = " + produtoID;
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        if (data.data.length > 0) {
                            var atr = data.data
                            atr.forEach(function (v, i) {
                                if (v.formato == "check") {
                                    $("[data-id=40203] #" + v.atributo_id)[0].dataset.carg = 1
                                    $("[data-id=40203] #" + v.atributo_id)[0].checked = (v.valor == "false") ? false : true
                                } else {
                                    $("[data-id=40203] #" + v.atributo_id)[0].dataset.carg = 1
                                    $("[data-id=40203] #" + v.atributo_id)[0].value = v.valor
                                }
                            })
                        }
                    })
                }
            })
        })
    }

    g$.adicionarProduto = function (params, elm) {
        // adicionarProduto | pedido | tabela
        var params = g$.alterSargentos(params),
            //cond = params[2],
            pedido = params[1].trim(),
            tabela = params[2].trim(),
            elm = (elm) ? elm : event.target;

        if (!elm.tagName) {
            //Alternar Campos
            if (elm.data.indexOf('40747') != -1) {
                $("[data-id=40750]")[0].focus();
            } else if (elm.data.indexOf('40753') != -1) {
                var prod = $("[data-id=40747]")[0].firstChild.dataset.value,
                    quantidade = $("[data-id=40750]")[0].value,
                    produto = $("[data-id=40747]")[0].firstChild.value,
                    amb = $("[data-id=40753]")[0].firstChild.dataset.value,
                    ambiente = $("[data-id=40753]")[0].firstChild.value
                if ($("[data-id=40773]")[0].textContent != "label") {
                    $("[data-id=40773]")[0].textContent += ",(" + pedido + "," + prod + ",'" + quantidade + "'," + amb + ")"
                } else {
                    $("[data-id=40773]")[0].textContent = "(" + pedido + "," + prod + ",'" + quantidade + "'," + amb + ")"
                }
                $("[data-id=40780]")[0].innerHTML += "<p>" + produto + "</p>"
                $("[data-id=40781]")[0].innerHTML += "<p>" + quantidade + "</p>"
                $("[data-id=40782]")[0].innerHTML += "<p>" + ambiente + "</p>";
                $("[data-id=40747]")[0].firstChild.click();
            }
        } else {
            if (elm.tagName == "A" || elm.tagName == "SPAN" || (event.keyCode && event.keyCode == 120)) {
                var query = "INSERT INTO " + $rootScope.user.banco + ".pedido_produto (pedido_id,produto_id,quantidade,ambiente_id) VALUES " + $("[data-id=40773]")[0].textContent;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    if (!data.err) {
                        g$.atualizarTabela("atualizarTabela | " + tabela);
                        g$.closeModal("closeModal | insrRap");
                        if (tabela == '1825') g$.carregaQuery('carregaQuery | SELECT totalProduto, subtotal, desconto, frete, seguro, totalGeral FROM »user.banco».pedido where id = »1694» | 9375 ¦ 9686 ¦ 9367 ¦ 9369 ¦ 9371 ¦ 17336');
                    }
                })
            } else if (elm.tagName == "INPUT" || elm.dataset.id == 43242) {
                if (event.keyCode == 13 || event.target.dataset.id == 43242) {
                    if ($("[data-id=40764]")[0].checked) {
                        $("[data-id=40753]")[0].firstChild.click();
                    } else {
                        var prod = $("[data-id=40747]")[0].firstChild.dataset.value,
                            quantidade = $("[data-id=40750]")[0].value,
                            produto = $("[data-id=40747]")[0].firstChild.value
                        if ($("[data-id=40773]")[0].textContent != "label") {
                            $("[data-id=40773]")[0].textContent += ",(" + pedido + "," + prod + ",'" + quantidade + "',NULL)";
                        } else {
                            $("[data-id=40773]")[0].textContent = "(" + pedido + "," + prod + ",'" + quantidade + "',NULL)";
                        }
                        $("[data-id=40780]")[0].innerHTML += "<p>" + produto + "</p>"
                        $("[data-id=40781]")[0].innerHTML += "<p>" + quantidade + "</p>"
                        $("[data-id=40782]")[0].innerHTML += "<p>Sem Ambiente</p>";
                        $("[data-id=40747]")[0].firstChild.click();
                    }
                }
            }
        }
    }

    g$.salvarAtributos = function (params) {
        var destino = $("[data-id=40203]")[0]
        var produtoID = $("[data-id=2689]")[0].value
        var query = "SELECT * FROM " + $rootScope.user.banco + ".atributo"
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (data.data.length > 0) {
                var atr = data.data
                var ultimo = data.data.length
                atr.forEach(function (v, i) {
                    if ($("[data-id=40203] #" + v.id)[0]) {
                        if ($("[data-id=40203] #" + v.id)[0].dataset.carg == 1) {
                            if (v.formato == "check") {
                                var valor = $("[data-id=40203] #" + v.id)[0].checked;
                            } else {
                                var valor = $("[data-id=40203] #" + v.id)[0].value;
                            }
                            var query = "update " + $rootScope.user.banco + ".produto_atributo set valor = '" + valor + "' where atributo_id = " + v.id + " and produto_id = " + produtoID;
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                if (ultimo == i + 1) {
                                    g$.closeModal("closeModal | atributoProduto");
                                }
                            })
                        } else {
                            if (v.formato == "check") {
                                var valor = $("[data-id=40203] #" + v.id)[0].checked;
                            } else {
                                var valor = $("[data-id=40203] #" + v.id)[0].value;
                            }
                            if (valor && valor != "") {
                                var query = "insert into " + $rootScope.user.banco + ".produto_atributo (produto_id,atributo_id,valor) " +
                                    "VALUES (" + produtoID + "," + v.id + ",'" + valor + "')";
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                    if (ultimo == i + 1) {
                                        g$.closeModal("closeModal | atributoProduto");

                                    }
                                })
                            }
                            else {
                                if (ultimo == i + 1) {
                                    g$.closeModal("closeModal | atributoProduto");
                                }
                            }
                        }
                    }
                    else {
                        if (ultimo == i + 1) {
                            g$.closeModal("closeModal | atributoProduto");
                        }
                    }
                })
            }
        })
    }

    g$.verificaNF = function (data) {
        var params = alterSargentos(params),
            id = params[1];
        var query = "SELECT * FROM " + $rootScope.user.banco + ".pedido_produto pp LEFT JOIN " + $rootScope.user.banco + ".pedido pd ON pp.pedido_id = pd.id LEFT JOIN " + $rootScope.user.banco + ".empresa em ON em.id = pd.empresa_id where pd.id =  " + id;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var result = data[0];
            result.forEach(function (v, i) {
                if (v.ncm.length != 8) {
                    console.log("Erro");
                }
            })
        })
    }

    g$.socket = function (params) {
        // socket | tipo

        var params = g$.alterSargentos(params),
            tipo = params[1],
            texto = params[2],
            cond = params[3],
            idFuncao = params[0].split("¦")[1],
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };

        g$._socket.emit(tipo.trim(), texto);
        g$.vfyFuncaoDepois(idFuncao);
    }

    if (g$.user.projeto == "SAUDE") {
        g$._socket.on('senha', function (data) {
            // Se o telao estiver aberto
            if ($(".popup[data-tela='1054']")[0]) {
                console.log('Recebi chamado');
                g$.carregaQuery("carregaQuery | SELECT descricao_chamada,senha, local, ordem, CONCAT('Senha ', senha, ' em ', descricao_chamada,'.. Senha ', senha, ' em ', descricao_chamada) as descricao FROM »user.banco».fila_chamada f LEFT JOIN »user.banco».local l ON l.id = f.local_id WHERE local_id in (0»memo40») AND COALESCE(quantidade_chamado,0)>0 ORDER BY ordem DESC LIMIT 1 | 53453 ¦ 53451 ¦ 53705 ¦ memo41 ¦ memo42", null, null, function (data) {
                    if (data[0] && g$.memo43 != data[0].ordem) {
                        g$.memo43 = data[0].ordem;
                        g$.falar('falar | ' + g$.memo42 + '¦¦1.2');
                        g$.atualizarBloco("atualizarBloco | 53470");
                    }
                })
                g$.carregaQuery('carregaQuery ¦ 841 | SELECT servico_guiche, unidade_id FROM »user.banco».cliente_fornecedor WHERE node_usuario_id = »user.id»| memo21 ¦ memo22', true)
            }
        });
        g$._socket.on('atendimento', function (data) {
            // Se o telao estiver aberto
            if ($(".popup[data-tela='230']")[0] && $("[data-id='5664'] a")[0].classList.contains("active")) {
                g$.carregaQuery("carregaQuery | SELECT group_concat(ATEO.id) atendimentos FROM »user.banco».atendimento ATEO LEFT JOIN »user.banco».agenda AGDA ON AGDA.id = ATEO.agenda_id LEFT JOIN »user.banco».cliente_fornecedor MEDI ON MEDI.id = ATEO.medico_id OR (ISNULL(ATEO.medico_id) AND AGDA.sala_id = MEDI.sala_id) WHERE ((IF('67'='»user.projeto_id»',AGDA.status_id between 9 and 12,AGDA.status_id=3) OR (IF('67'='»user.projeto_id»',AGDA.status_id = 13,AGDA.status_id=4) AND AGDA.data = CURDATE())) OR COALESCE(ATEO.aguardar_retorno,0) = 1) and MEDI.node_usuario_id = '»user.id»' ORDER BY AGDA.status_id, AGDA.hora_inicio", null, null, function (data) {
                    if (data[0] && g$.memoAtendimentos != data[0].atendimentos) {
                        g$.memoAtendimentos = data[0].atendimentos;
                        g$.atualizarTabela("atualizarTabela | 6304");
                    }
                })
            }
        });
        g$._socket.on('pos-atendimento', function (data) {
            // Se o telao estiver aberto
            if ($(".popup[data-tela='1059']")[0] && $("[data-id='2835'] a")[0].classList.contains("active")) {
                g$.carregaQuery("carregaQuery | SELECT GROUP_CONCAT(CLTF.id) atendimentos FROM »user.banco».fila_chamada FICH LEFT JOIN »user.banco».cliente_fornecedor CLTF on CLTF.id = FICH.paciente_id LEFT JOIN »user.banco».encaminhamento ENCO on ENCO.paciente_id = CLTF.id LEFT JOIN »user.banco».especialidade ESPE on ESPE.id = ENCO.especialidade_id WHERE COALESCE(FICH.encaminhado,0)=0 and FICH.local_id = 4 AND IF('»memo62»' <> '',CLTF.id='»memo62»',1=1) GROUP BY FICH.id", null, null, function (data) {
                    if (data[0] && g$.memoAtendimentos != data[0].atendimentos) {
                        g$.memoAtendimentos = data[0].atendimentos;
                        // g$.atualizarTabela("atualizarTabela | 53812");
                    }
                })
            }
        });
        g$._socket.on('pre-atendimento', function (data) {
            // Se o telao estiver aberto
            if ($(".popup[data-tela='229']")[0]) {
                g$.carregaQuery("carregaQuery | SELECT GROUP_CONCAT(AGDA.id) atendimentos FROM »user.banco».sala s, »user.banco».cliente_fornecedor CLI, »user.banco».agenda AGDA LEFT JOIN »user.banco».status STAT on STAT.id = AGDA.status_id LEFT JOIN »user.banco».especialidade ESPE on ESPE.id = AGDA.especialidade_id LEFT JOIN »user.banco».unidade_saude UNDE on UNDE.id = AGDA.unidade_id LEFT JOIN »user.banco».servico SERO on SERO.id = AGDA.servico_id LEFT JOIN »user.banco».cliente_fornecedor CLTF on CLTF.id = AGDA.cliente_fornecedor_id WHERE NOT ISNULL(AGDA.guiche_id) AND ISNULL(atendimento_id) AND IF('67'='»user.projeto_id»',(AGDA.status_id = 7 OR AGDA.status_id = 8), AGDA.status_id < 3) AND s.id = CLI.sala_id AND UNDE.id = s.unidade_id AND CLI.node_usuario_id = '»user.id»'", null, null, function (data) {
                    if (data[0] && g$.memoAtendimentos != data[0].atendimentos) {
                        g$.memoAtendimentos = data[0].atendimentos;
                        g$.atualizarTabela("atualizarTabela | 6222");
                    }
                })
            }
        });

    }

    g$.falar = function (params) {
        var params = g$.alterSargentos(params),
            texto = params[1].split("¦")[0].trim(),
            voz = (params[1].split("¦")[1] && params[1].split("¦")[1].trim() != "") ? params[1].split("¦")[1].trim() : "",
            velocidade = (params[1].split("¦")[2] && params[1].split("¦")[2].trim() != "") ? params[1].split("¦")[2].trim() : 1,
            idioma = (params[1].split("¦")[3] && params[1].split("¦")[3].trim() != "") ? params[1].split("¦")[3].trim() : 'pt-BR',
            cond = params[2],
            idFuncao = params[0].split("¦")[1],
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };

        var msg = new SpeechSynthesisUtterance();
        var voices = speechSynthesis.getVoices();
        msg.voice = voices[voz];
        msg.rate = velocidade; //0.1 to 2
        msg.text = texto;   //texto
        msg.lang = idioma;

        // msg = new SpeechSynthesisUtterance(msg);
        window.speechSynthesis.speak(msg);
        g$.vfyFuncaoDepois(idFuncao);
    }

    g$.iframe = function (params) {
        var params = g$.alterSargentos(params),
            url = params[1];
        $("[data-id=42799]")[0].innerHTML = "<iframe src=" + url + "></iframe>"
    }

    g$.etiquetasNF = function (params) {
        var query = 'select produto_id, sum(quantidade) from ' + $rootScope.user.banco + '.pedido_produto where pedido_id = ' + $("[data-id=11593]")[0].value;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (!data.err) {
                var prods = data.data;
                // prods.forEach(function(v,i){})
            }
        })
    }

    g$.geraPDFNFSe = function (params) {
        var params = g$.alterSargentos(params),
            nome = params[1].trim(),
            banco = params[2].trim(),
            id = params[3].trim(),
            cond = (params[4]) ? params[4].trim() : "",
            idFuncao = params[0].split("¦")[1],
            valida = (!cond) ? true : g$.validaCondicao(cond);

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };

        var objTela = {
            arquivo: '<html><head> <style type="text/css"> .divisor,hr{ border-color:#000000; border-style:solid; border-width:1px; border-bottom:0px; border-top:0px; } h1, h2, h3, h4, h5 {margin: 0px !importante; padding: 0px !important} .divcorte{ border-color:#000000; border-style:solid; border-width:1px; width:100%; border-collapse: collapse; } .a{ text-align: center; } td, tr {padding: 0px !importante; margin: 0px !important;} h3{font-size: 12px !important;} h4{font-size: 11px !important;} html,body{ font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif; } .rodape {font-size: 4px; } .titulo{ font-size: 8px; } .valor{ font-size: 8px; font-weight: bold; } </style> <title></title> </head> <body> <div style="width:90%;margin: 0px auto;border: 3px;"> <div class="divisor"> <table class="a" border="1px" align="center" style="width:100%;height: 60px;border-collapse: collapse; "> <tbody><tr> <th rowspan="3" style="border:none;"><img src="http://labprodam.prefeitura.sp.gov.br/Organograma/imagens/BrasaoSaoPaulo.png" style="width:50px;height: 50px;"><br><label class="rodape">{{rps.dataYMD}}u{{empresa.cnpj}}</label></th> <th colspan="3" align="center" style="border:none; margin: 0px auto"><h3 style="margin: 0px auto">PREFEITURA DO MUNICIPIO DE SÃO PAULO</h3> </th> <th border="1px" style="width: 22%;"><label class="titulo">Número de Nota </label><br><b> <label class="valor">{{rps.nf}}</label></b></th> </tr> <tr> <td colspan="3" align="center" style="border:none;"><b><h4 style="margin: 0px auto">SECRETARIA MUNICIPAL DE FINANÇAS</h4> </b> </td> <td><label class="titulo"> Data e Hora de Emissão </label><br><b><label class="valor">{{rps.data_hora}}</label></b></td> </tr> <tr> <td colspan="3" align="center" style="border:none;"><b><h4 style="margin: 0px auto">NOTA FISCAL ELETRÔNICA DE SERVIÇOS. NFS-e</h4> </b><label class="titulo">RPS Nº{{rps.numeroRps}} &nbsp;Série{{rps.Serie}}, &nbsp;emitido em &nbsp;{{rps.data}}</label></td> <td><label class="titulo">Código de Verificação</label><br><b><label class="valor">{{rps.verificacao}}</label></b></td> </tr> </tbody></table> <table class="a" border="0x" align="center" style="width:100%;border-collapse: collapse; "> <tbody><tr> <th colspan="2"><h4 style="margin: 0px auto">PRESTADOR DE SERVIÇOS</h4> </th> </tr> <tr> <td align="left"><label class="titulo">CPF/CNPJ:</label><label class="valor">{{empresa.cnpj}}</label></td> <td><label class="titulo">Inscrição Municipal: </label><label class="valor">{{empresa.inscricao_municipal}}</label></td> </tr> <tr> <td colspan="2" align="left"><label class="titulo">Razão Social: </label><label class="valor">{{empresa.razao}}</label></td> </tr> <tr> <td colspan="2" align="left"><label class="titulo">Endereço:</label> <label class="valor">{{empresa.endereco}} - {{empresa.bairro}} - {{empresa.numero}} - CEP: {{empresa.cep}}</label></td> </tr> <tr> <td align="left"><label class="titulo">Municipio:</label><b><label class="valor">{{empresa.cidade}}</label></b></td> <td align="left"><label class="titulo">UF:</label><b><label class="valor">{{empresa.uf}}</label></b></td> </tr> </tbody></table> <div class="divcorte"></div> <table border="0px" align="center" style="width:100%;border-collapse: collapse; "> <tbody><tr> <th colspan="3"> <h4 style="margin: 0px auto"> TOMADOR DE SERVIÇOS</h4></th> </tr> <tr> <td colspan="3"><label class="titulo">Nome/Razão Social:</label><label class="valor">{{rps.RazaoSocialTomador}}</label></td> </tr> <tr> <td colspan="2"><label class="titulo">CPF/CNPJ:</label><label class="valor"> {{rps.CnpjTomador}}</label></td> <td><label class="titulo">Inscrição Municipal:</label><label class="valor"> ----</label></td> </tr> <tr> <td colspan="3"><label class="titulo">Endereço:</label><label class="valor">{{rps.EnderecoTomador}} - {{rps.BairroTomador}} - {{rps.NumeroTomador}} - {{rps.ComplementoTomador}} - CEP: {{rps.CepTomador}}</label></td> </tr> <tr> <td><label class="titulo">Municipio:</label><label class="valor">{{rps.cidadeTomador}}</label></td> <td><label class="titulo">UF:</label><label class="valor">{{rps.UFTomador}}</label></td> <td><label class="titulo">Email:</label><label class="valor">{{rps.EmailTomador}}</label></td> </tr> </tbody></table> <div class="divcorte"></div> <table border="0px" align="center" style="width:100%;border-collapse: collapse; "> <tbody><tr> <th colspan="2"><h4 style="margin: 0px auto">INTERMEDIÁRIO DE SERVIÇOS</h4></th> </tr> <tr> <td><label class="titulo">CPF/CNPJ:</label><label class="valor">{{rps.CnpjItermediarioServico}}</label></td> <td><label class="titulo">Nome/Razão Social:</label><label class="valor">{{rps.RazaoSocialItermediarioServico}}</label></td> </tr> </tbody></table> <div class="divcorte"></div> <table border="0px" align="center" style="width:100%;border-collapse: collapse; "> <tbody><tr> <th><h4 style="margin: 0px auto">DISCRIMINAÇÃO DOS SERVIÇOS</h4></th> </tr> <tr> <td style="vertical-align: text-top;height:250px;"><label class="titulo">{{rps.Discriminacao}}</label> </td> </tr> </tbody></table> <table border="1x" align="center" style="width:100%;height:20px;border-collapse: collapse; "> <tbody><tr> <th colspan="5"> <h4 style="margin: 0px auto">VALOR TOTAL DA NOTA = R$ {{rps.ValorLiquidoNfse}}</h4> </th> </tr> <tr style="text-align: center;"> <td><label class="titulo">INSS (R$)</label><br><label class="valor">{{rps.ValorInss}}</label></td> <td><label class="titulo">IRRF(R$)</label><br><label class="valor">{{rps.ValorIR}}</label></td> <td><label class="titulo">CSLL(R$)</label><br><label class="valor">{{rps.ValorCsll}}</label></td> <td><label class="titulo">COFINS(R$)</label><br><label class="valor">{{rps.ValorCofins}}</label></td> <td><label class="titulo">PIS/PASEP(R$)</label><br><label class="valor">{{rps.ValorPis}}</label></td> </tr> <tr> <td colspan="5" align="left"><label class="titulo">Código do Serviço</label><br>{{rps.idServico}}<br><br></td> </tr> <tr style="text-align: center;"> <td><label class="titulo">Valor Total das Deduções(R$)</label><br><label class="valor">{{rps.ValorDeducoes}}</label></td> <td><label class="titulo">Base de Cálculo(R$)</label><br><label class="valor">{{rps.BaseCalculo}}</label></td> <td><label class="titulo">Alíquota(%)</label><br><label class="valor">{{rps.Aliquota}}%</label></td> <td><label class="titulo">Valor do ISS(R$)</label><br><label class="valor">{{rps.ValorIss}}</label></td> <td><label class="titulo">Crédito(R$)</label><br><b><label class="valor">0,00</label></b></td> </tr> <tr> <td colspan="2"> <center><label class="titulo">Municipio da Prestação do Serviço</label><br><label class="valor">{{rps.CodigoMunicipio}}</label></center></td> <td> <center><label class="titulo">Número inscrição da Obra</label><br>-</center> </td> <td colspan="2"> <center><label class="titulo">Valor aproximado dos Tributos/Fonte</label><br>-</center> </td> </tr> </tbody></table> <table border="0x" class="a" align="center" style="width:100%;border-collapse: collapse; "> <tbody><tr> <th><h4 style="margin: 0px auto">OUTRAS INFORMAÇÕES</h4></th> </tr> <tr> <td align="left" style="vertical-align: text-top;height:50px"><label class="titulo"> (1) Esta NFS-e foi emitida com respaldo na Lei nº 14097/2005, (2) Esta NFS-e substitui o RPS Nº {{rps.numeroRps}} Série 00002, emitido em {{rps.data}}, (3) Data de vencimento do ISS desta NFS-e: {{rps.validade}}</label></td> </tr> </tbody></table> <div class="divcorte"></div> </div> </div> </body></html>',
            caminho: g$.user.projeto + "/",
            nome: nome
        };
        var query = "select date_format(DataEmissao, '%d/%m/%Y %H:%i:%s') data_hora,date_format(DataEmissao, '%d/%m/%Y') data, r.* FROM " + banco + ".nfse_rps r where id = " + id + " LIMIT 1";
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query)).success(function (data) {
            if (g$.exceptionRequisicao("Query Template", data)) return;
            if (data.data.length > 0) {
                $scope.rps = data.data[0];
                objTela.arquivo = objTela.arquivo.replace("{{rps.RazaoSocialTomador}}", ($scope.rps.RazaoSocialTomador) ? $scope.rps.RazaoSocialTomador : " ---- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.ValorIss}}", ($scope.rps.ValorIss) ? $scope.rps.ValorIss : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.CnpjTomador}}", ($scope.rps.CnpjTomador) ? $scope.rps.CnpjTomador : " ---- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.EnderecoTomador}}", ($scope.rps.EnderecoTomador) ? $scope.rps.EnderecoTomador : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.BairroTomador}}", ($scope.rps.BairroTomador) ? $scope.rps.BairroTomador : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.NumeroTomador}}", ($scope.rps.NumeroTomador) ? $scope.rps.NumeroTomador : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.ComplementoTomador}}", ($scope.rps.ComplementoTomador) ? $scope.rps.ComplementoTomador : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.CepTomador}}", ($scope.rps.CepTomador) ? $scope.rps.CepTomador : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.cidadeTomador}}", ($scope.rps.cidadeTomador) ? $scope.rps.cidadeTomador : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.UFTomador}}", ($scope.rps.UFTomador) ? $scope.rps.UFTomador : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.EmailTomador}}", ($scope.rps.EmailTomador) ? $scope.rps.EmailTomador : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.CnpjItermediarioServico}}", ($scope.rps.CnpjItermediarioServico) ? $scope.rps.CnpjItermediarioServico : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.RazaoSocialItermediarioServico}}", ($scope.rps.RazaoSocialItermediarioServico) ? $scope.rps.RazaoSocialItermediarioServico : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.Discriminacao}}", ($scope.rps.Discriminacao) ? $scope.rps.Discriminacao : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.ValorInss}}", ($scope.rps.ValorInss) ? $scope.rps.ValorInss : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.ValorIR}}", ($scope.rps.ValorIR) ? $scope.rps.ValorIR : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.ValorCsll}}", ($scope.rps.ValorCsll) ? $scope.rps.ValorCsll : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.ValorCofins}}", ($scope.rps.ValorCofins) ? $scope.rps.ValorCofins : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.ValorPis}}", ($scope.rps.ValorPis) ? $scope.rps.ValorPis : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.idServico}}", ($scope.rps.idServico) ? $scope.rps.idServico : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.ValorDeducoes}}", ($scope.rps.ValorDeducoes) ? $scope.rps.ValorDeducoes : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.BaseCalculo}}", ($scope.rps.BaseCalculo) ? $scope.rps.BaseCalculo : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.Aliquota}}", ($scope.rps.Aliquota) ? $scope.rps.Aliquota : "5,00");
                objTela.arquivo = objTela.arquivo.replace("{{rps.ValorLiquidoNfse}}", ($scope.rps.ValorLiquidoNfse) ? $scope.rps.ValorLiquidoNfse : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.ValorServicos}}", ($scope.rps.ValorServicos) ? $scope.rps.ValorServicos : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.CodigoMunicipio}}", ($scope.rps.CodigoMunicipio) ? $scope.rps.CodigoMunicipio : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.nf}}", ($scope.rps.nf) ? $scope.rps.nf : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.data_hora}}", ($scope.rps.data_hora) ? $scope.rps.data_hora : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.numeroRps}}", ($scope.rps.numeroRps) ? $scope.rps.numeroRps : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.Serie}}", ($scope.rps.Serie) ? $scope.rps.Serie : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.data}}", ($scope.rps.data) ? $scope.rps.data : " -- ");
                objTela.arquivo = objTela.arquivo.replace("{{rps.outrasInformacoes}}", ($scope.rps.outrasInformacoes) ? $scope.rps.outrasInformacoes : " ");

                objTela.arquivo = objTela.arquivo.replace("{{rps.verificacao}}", ($scope.rps.verificacao) ? $scope.rps.verificacao : " -- ");
                var query7 = "select * from " + banco + ".empresa where id =  " + $scope.rps.empresa_id + " LIMIT 1";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query7)).success(function (data) {
                    if (g$.exceptionRequisicao("Query Template", data)) return;
                    if (data.data.length > 0) {
                        $scope.empresa = data.data[0];
                        objTela.arquivo = objTela.arquivo.replace("{{empresa.cnpj}}", ($scope.empresa.cnpj) ? $scope.empresa.cnpj : " -- ");
                        objTela.arquivo = objTela.arquivo.replace("{{empresa.inscricao_municipal}}", ($scope.empresa.inscricao_municipal) ? $scope.empresa.inscricao_municipal : " -- ");
                        objTela.arquivo = objTela.arquivo.replace("{{empresa.razao}}", ($scope.empresa.razao) ? $scope.empresa.razao : " -- ");
                        objTela.arquivo = objTela.arquivo.replace("{{empresa.endereco}}", ($scope.empresa.endereco) ? $scope.empresa.endereco : " -- ");
                        objTela.arquivo = objTela.arquivo.replace("{{empresa.bairro}}", ($scope.empresa.bairro) ? $scope.empresa.bairro : " -- ");
                        objTela.arquivo = objTela.arquivo.replace("{{empresa.numero}}", ($scope.empresa.numero) ? $scope.empresa.numero : " -- ");
                        objTela.arquivo = objTela.arquivo.replace("{{empresa.cep}}", ($scope.empresa.cep) ? $scope.empresa.cep : " -- ");
                        objTela.arquivo = objTela.arquivo.replace("{{empresa.cidade}}", ($scope.empresa.cidade) ? $scope.empresa.cidade : " -- ");
                        objTela.arquivo = objTela.arquivo.replace("{{empresa.uf}}", ($scope.empresa.uf) ? $scope.empresa.uf : " -- ");
                    }
                    $http.post(URL + "/geraArquivoPDF/", objTela).success(function (data) {
                        if (data == "OK") {
                            // envia por email
                            // ...
                            return g$.vfyFuncaoDepois(idFuncao);
                        }
                    });
                });
            }
        });
    }


    g$.roboPDF = function (params) {
        var query = "SELECT id, date_format(DataEmissao, '%Y%m%d') emissao, numeroRps, link, verificacao FROM " + $rootScope.user.banco + ".nfse_rps WHERE id = 1 limit 1";
        // COALESCE(verificacao,'') <> '' AND COALESCE(link_pdf,'') = '' LIMIT 1",
        tempo = 3000;
        contInterval = 0;

        tempInterval = setInterval(function () {
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                // Trata Excecao
                if (g$.exceptionRequisicao("LoadzinTabela - Tela", data.data)) return;;
                if (data.data.length) {
                    id = data.data[0].id;
                    emissao = data.data[0].emissao;
                    numero = data.data[0].numeroRps;
                    link = data.data[0].link;
                    verificacao = data.data[0].verificacao;

                    g$.geraPDFNFSe("geraPDFNFSe | " + $rootScope.user.projeto + "_" + emissao + "_" + numero + " | " + $rootScope.user.banco + " | " + id);
                    queryUpdate = "UPDATE " + $rootScope.user.banco + ".nfse_rps SET link_pdf = '" + $rootScope.user.projeto + "_" + emissao + "_" + numero + ".pdf', robo_pdf = 0 WHERE id = " + id;
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryUpdate.trim())).success(function (data) {

                    });
                }
            });
            contInterval += tempo;

        }, tempo);
    }



    g$.geraBoleto = function (params) {

        var params = g$.alterSargentos(params),
            obj = (params[1].trim().indexOf("02RETORNO01COBRANCA") == 0) ? retorno_CNAB_400(params[1].trim()) : retorno_CNAB_240(params[1].trim());

        // TODOS OS DADOS POSSIVEIS

        // var boleto = {
        //     barcodeData: '23797726700000009997506091900000120800542910',
        //     digitableLine: '23797.50603 91900.000125 08005.429108 7 72670000000999',
        //     paymentPlace:
        //     'Pagável preferencialmente na rede Bradesco ou Bradesco Expresso.',
        //     beneficiary: 'UNICRED FLORIANÓPOLIS - CNPJ: 074.064.502/0001-12',
        //     beneficiaryAddress:
        //     'Rua Tenete Silveira, 315 - Centro - Florianópolis - SC  - CEP 88010-301',
        //     instructions:
        //     'Após o vencimento cobrar multa de 2,00% , mais juros ao mes de 1,00%.',
        //     agency: '7506',
        //     agencyDigit: '0',
        //     account: '54291',
        //     accountDigit: '1',
        //     expirationDay: new Date(2017, 7, 30), // 30/08/2017
        //     documentDate: new Date(2017, 7, 18), // 18/08/2017
        //     processingDate: new Date(2017, 7, 18), // 18/08/2017
        //     card: '09',
        //     documentNumber: '42493',
        //     formatedOurNumber: '09/19000001208-0',
        //     formatedValue: 'R$ 9,90',
        //     documentType: 'DS',
        //     accept: 'N',
        //     currencyType: 'Real (R$)',
        //     amount: ' ',
        //     valueOf: ' ',
        //     descountValue: ' ',
        //     otherDiscounts: ' ',
        //     feeValue: ' ',
        //     outherFees: ' ',
        //     chargeValue: ' ',
        //     payer: {
        //         name: 'Anita Albuquerque',
        //         registerNumber: '221.412.772-05',
        //         street: 'Rua Maria Gertrudes Coelho',
        //         number: '827',
        //         complement: ' ',
        //         district: 'Estrada Nova',
        //         city: 'Divinópolis',
        //         state: 'MG',
        //         postalCode: '35500-700'
        //     },
        //     guarantor: {
        //         name: 'ACME Telecomunicações Ltda',
        //         registerNumber: '074.064.502/0001-12',
        //         street: 'Servidão',
        //         number: '439',
        //         district: 'Estrada Nova',
        //         complement: ' ',
        //         city: 'Jaraguá do Sul',
        //         state: 'SC',
        //         postalCode: '89254-375'
        //     }
        // }
        // progress boleto
        $("[data-id=52675]")[0].innerHTML = '<div><p><i class="fa fa-square" id="iconePB" style="margin: 0px 7px 0px 0px; color: rgb(26, 75, 214)"></i>Gerando Boletos <span id="concluidoPB">0</span><span id="totalPB"></span><span id="porcentualPB" style="float: right;">0%</span></p>' +
            '<div class="progress"><div id="progressBarPB" class="determinate" style="width:0%;"></div></div><p id="concluiPB" style="text-align:center;color:green;display:none;">Concluído!</p></div>';
        $("#totalPB")[0].textContent = "/" + obj.length;
        var porcent = 100 / obj.length;

        // for (var i = 0; i < obj.length; i++) {
        fazBoleto(obj, porcent);
        // };

    }

    function fazBoleto(obj, porcent, objErr) {
        if (obj.length > 0) {
            v = obj[0];
            // atualiza financeiro
            if (v.movimento == '02') {
                var finId, queryDados = "SELECT f.id,n.nf nf,COALESCE(valorOriginal,'0') valor,'bradesco' banco, COALESCE(nosso_numero,'') nosso_numero, COALESCE(documento,'') documento, COALESCE(e.razao,'') cedente, DATE_FORMAT(vencimento, '%Y%m%d') vencimento, " +
                    "COALESCE(e.cnpj,'') cnpj, COALESCE(cart.agencia,'') agencia, COALESCE(codigo_cnab,'') codigo_cnab, COALESCE(mensagem1,'') mensagem1, removeacentos(CONCAT(COALESCE(e.endereco,''),' ',COALESCE(e.numero,''),' ',COALESCE(e.complemento,''))) endereco, " +
                    "COALESCE(e.mensagem2,'') mensagem2,COALESCE(cart.conta,'') conta,COALESCE(c.razao,'') payer, COALESCE(c.cpf, c.rg,'') registro,  " +
                    "removeacentos(COALESCE(c.entrendereco,'')) rua, removeacentos(COALESCE(c.entrnumero,'')) numero, removeacentos(COALESCE(c.entrcomplemento,'')) complemento, removeacentos(COALESCE(c.entrbairro,'')) bairro, removeacentos(COALESCE(c.entrcidade,'')) cidade, " +
                    "removeacentos(COALESCE(c.entrUf,'')) uf, removeacentos(COALESCE(c.entrCep,'')) cep " +
                    "FROM " + $rootScope.user.banco + ".nfse_rps n " +
                    "LEFT JOIN " + $rootScope.user.banco + ".financeiro f ON n.numeroRps = f.nr_rps " +
                    "LEFT JOIN " + $rootScope.user.banco + ".empresa e on e.id = f.empresa_id " +
                    "LEFT JOIN " + $rootScope.user.banco + ".cliente_fornecedor c ON c.id = f.cliente_fornecedor_id  " +
                    "LEFT JOIN " + $rootScope.user.banco + ".carteira cart on cart.id = f.carteira_id " +
                    "WHERE n.nf = " + v.nf;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryDados.trim())).success(function (data) {
                    finId = data.data[0].id;
                    boleto = {
                        banco: data.data[0].banco,
                        valor: (data.data[0].valor * 100).toFixed(0),
                        nosso_numero: v.nosso_num,
                        nosso_numCompleto: v.nosso_numCompleto,
                        numero_documento: data.data[0].nf,
                        cedente: data.data[0].cedente.substring(0, 30),
                        vencimento: data.data[0].vencimento, // YYYYMMDD
                        cedente_cnpj: "62331228000111",
                        // data.data[0].cnpj,
                        agencia: "2372",
                        // (data.data[0].agencia.split('-')[0]) ? data.data[0].agencia.split('-')[0].substring(0, 4) : '',
                        digitoAgencia: "",
                        // (data.data[0].agencia.split('-')[1]) ? data.data[0].agencia.split('-')[1] : 'X',
                        codigo_cedente: "2805",
                        // data.data[0].codigo_cnab,
                        carteira: "09",
                        localPagamento: data.data[0].mensagem1,
                        endBeneficiario: data.data[0].endereco + "     - DEUTSCHE BANK",
                        instructions: data.data[0].mensagem2,
                        conta: "0002805",
                        // (data.data[0].conta.split('-')[0]) ? data.data[0].conta.split('-')[0].substring(0, 7) : '',
                        contaDigito: "3",
                        // (data.data[0].conta.split('-')[1]) ? data.data[0].conta.split('-')[1] : 'X',
                        payer: {
                            nome: data.data[0].payer,
                            RG: data.data[0].registro,
                            rua: data.data[0].rua,
                            numero: data.data[0].numero,
                            complemento: data.data[0].complemento,
                            bairro: data.data[0].bairro,
                            cidade: data.data[0].cidade,
                            uf: data.data[0].uf,
                            cep: data.data[0].cep,
                        },
                        caminho: $rootScope.user.projeto + "/" + data.data[0].nf + ".pdf"
                    }

                    $.post("/geraBoleto/", boleto).success(function (data) {
                        if (data == 'file saved') {
                            g$.download('download | ' + boleto.caminho);
                            var query = "UPDATE saas.financeiro F " +
                                "SET F.nosso_numero = " + v.nosso_num + ", boleto_pdf = '" + boleto.caminho.split('/')[1] + "'" +
                                " WHERE F.id = " + finId;
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                if (!data.err) {
                                    console.log(data.query);
                                    $("#porcentualPB")[0].textContent = parseFloat(parseFloat($("#porcentualPB")[0].textContent.replace("%", "")) + parseFloat(porcent)).toFixed(2) + '%';
                                    $("#progressBarPB")[0].style.width = parseFloat($("#progressBarPB")[0].style.width.replace("%", "")) + parseFloat(porcent) + '%'
                                    $("#concluidoPB")[0].textContent = parseInt($("#concluidoPB")[0].textContent) + 1;
                                    obj.splice(0, 1);
                                    fazBoleto(obj, porcent, objErr);
                                }
                                else {
                                    objErr.push(obj[0]);
                                    obj.splice(0, 1);
                                    fazBoleto(obj, porcent, objErr);
                                    console.log(data.error)
                                    debugger
                                }
                            });
                        } else {
                            objErr.push(obj[0]);
                            obj.splice(0, 1);
                            fazBoleto(obj, porcent, objErr);
                        }
                    });

                });
            }
        }
        else {
            $("#porcentualPB")[0].textContent = "100%";
            $("#iconePB")[0].classList.remove("fa-square");
            $("#iconePB")[0].classList.add("fa-check-square");
        }
    }

    function retorno_CNAB_240(str) {

        var registros; // registros = [TAMANHO DO PROGRESSBAR]
        var r; // r = [REGISTRO ATUAL]
        var i; // i = [POSICAO DO PROGRESSBAR]
        var obj = [];
        registros = str.split('\n');

        for (i = 0; i < registros.length; ++i) {
            r = registros[i];
            if (r.substring(13, 14) == 'T') {
                obj.push({
                    // REGISTRO DETALHE T (RETORNO)
                    id: r.substring(105, 130), //SEU NUMERO = financeiro.id com zeros a esquerda
                    documento: r.substring(63, 73),
                    convenio: r.substring(23, 33),
                    movimento: r.substring(15, 17),/*
                                                02 Entrada Confirmada 
                                                03 Entrada Rejeitada 
                                                06 Liquidação 
                                                09 Baixa 
                                                12 Confirmação Recebimento Instrução de Abatimento
                                                13 Confirmação Recebimento Instrução de Cancelamento Abatimento 
                                                14 Confirmação Recebimento Instrução Alteração de Vencimento
                                                27 Confirmação do Pedido de Alteração de Outros Dados 
                                                17 Liquidação após baixa ou Título Não Registrado 
                                                26 Instrução Rejeitada 
                                                30 Alteração de Outros Dados Rejeitados
                                            */
                    // data_ocorr: r.substring(137, 145), //Data da ocorrência no formato DDMMAAAA
                    nosso_num: r.substring(85, 97).trim() //Nosso Número Banco Corresp.
                });
            }
        }
        return obj;
    }

    function retorno_CNAB_400(str) {

        var registros; // registros = [TAMANHO DO PROGRESSBAR]
        var r; // r = [REGISTRO ATUAL]
        var i; // i = [POSICAO DO PROGRESSBAR]
        var queryFinID; // i = [POSICAO DO PROGRESSBAR]
        var obj = [];
        registros = str.split('\n');

        for (i = 0; i < registros.length; ++i) {
            r = registros[i];
            if (r.substring(0, 1) == '1') {
                // queryFinID = "SELECT '" + i + "' indice ,f.id, n.nf FROM saas.nfse_rps n LEFT JOIN saas.financeiro f ON n.numeroRps = f.nr_rps WHERE n.nf ='" + r.substring(116, 126).trim() + "' LIMIT 1;";
                // $http.post(URL + "/jsonQuery/", g$.trataQuery(queryFinID.trim())).success(function (data) {
                // if (!data.err) {
                // if (data.data.length > 0) {
                obj.push({
                    // REGISTRO DETALHE T (RETORNO)
                    // id: data.data[0].id, //SEU NUMERO = financeiro.id com zeros a esquerda
                    nf: r.substring(116, 126).trim(),
                    // documento: r.substring(63, 73),
                    // convenio: r.substring(23, 33),
                    movimento: "02",/*
                    //                             02 Entrada Confirmada 
                    //                             03 Entrada Rejeitada 
                    //                             06 Liquidação 
                    //                             09 Baixa 
                    //                             12 Confirmação Recebimento Instrução de Abatimento
                    //                             13 Confirmação Recebimento Instrução de Cancelamento Abatimento 
                    //                             14 Confirmação Recebimento Instrução Alteração de Vencimento
                    //                             27 Confirmação do Pedido de Alteração de Outros Dados 
                    //                             17 Liquidação após baixa ou Título Não Registrado 
                    //                             26 Instrução Rejeitada 
                    //                             30 Alteração de Outros Dados Rejeitados
                    //                         */
                    // // data_ocorr: r.substring(137, 145), //Data da ocorrência no formato DDMMAAAA
                    nosso_num: r.substring(85, 96).trim(),//Nosso Número Banco Corresp.
                    nosso_numCompleto: r.substring(85, 97).trim()//Nosso Número Banco Corresp.
                });

            }
        }
        return obj;
    }

    g$.RPS_INSERT_financeiro = function (params) {
        // RPS_INSERT_financeiro | rps_id  | carteira_id
        var params = g$.alterSargentos(params),
            rps_id = params[1].trim(),
            carteira_id = params[2].trim(),
            cond = (params[3]) ? params[3].trim() : "",
            idFuncao = params[0].split("¦")[1],
            valida = (!cond) ? true : g$.validaCondicao(cond), registro, plano_de_contas_saida_id, empresa_id, registros,
            Indicador_de_CPF_CNPJ, cpf, cnpj, im, ie, razao, endereco, nr, complemento, bairro, cidade, uf, cep, email, nr_rps, serie_rps, ItemListaServico, valor_dos_servicos, cliente_id;

        if (valida == false) {
            console.log("Não executou porque " + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao);
        };



        var query = "SELECT r.registro,e.plano_de_contas_saida_id, e.carteira_id, e.id FROM " + $rootScope.user.banco + ".rps r, " + $rootScope.user.banco + ".empresa e  WHERE r.id = " + rps_id + " LIMIT 1";
        console.log(query);
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            registro = data.data[0].registro;
            plano_de_contas_saida_id = data.data[0].plano_de_contas_saida_id;
            empresa_id = data.data[0].id;
            carteira_id = (carteira_id && carteira_id != "") ? carteira_id : data.data[0].carteira_id;
            registros = registro.split('\n');
            // progress financeiro
            $("[data-id=52675]")[0].innerHTML = '<div><p><i class="fa fa-square" id="iconePF" style="margin: 0px 7px 0px 0px; color: rgb(26, 75, 214)"></i>Analisando arquivo e gerado Financeiro <span id="concluidoPF">0</span><span id="totalPF"></span><span id="porcentualPF" style="float: right;">0%</span></p>' +
                '<div class="progress"><div id="progressBarPF" class="determinate" style="width:0%;"></div></div><p id="concluiPF" style="text-align:center;color:green;display:none;">Concluído!</p></div>' +
                // progress Cnab
                '<div style="text-color:#9e9e9e"><p><i class="fa fa-square" id="iconePC" style="margin: 0px 7px 0px 0px;color: rgb(26, 75, 214)"></i>Gerando aquivo CNAB <span id="concluidoPC">0</span><span id="totalPC"></span><span id="porcentualPC" style="float: right;">0%</span></p>' +
                '<div class="progress"><div id="progressBarPC" class="determinate" style="width:0%;"></div></div><p id="concluiPC" style="text-align:center;color:green;display:none;">Concluído!</p></div>' +
                // progress NFSe
                '<div><p><i class="fa fa-square" id="iconePN" style="margin: 0px 7px 0px 0px;color: rgb(26, 75, 214)"></i>Gerando PDF das NFSes <span id="concluidoPN">0</span><span id="totalPN"></span><span id="porcentualPN" style="float: right;">0%</span></p>' +
                '<div class="progress"><div id="progressBarPN" class="determinate" style="width:0%;"></div></div><p id="concluiPN" style="text-align:center;color:green;display:none;">Concluído!</p></div>';
            $("#totalPF")[0].textContent = "/" + registros.length;
            $("#totalPC")[0].textContent = "/-";
            $("#totalPN")[0].textContent = "/-";
            var porcent = 100 / registros.length

            fazRPS(registros, plano_de_contas_saida_id, empresa_id, carteira_id, rps_id, porcent, idFuncao);

            console.log("terminou");


        });


    }

    function fazRPS(obj, plano_de_contas_saida_id, empresa_id, carteira_id, rps_id, porcent, idFuncao) {
        if (obj.length > 0) {
            if (obj[0].indexOf("2RPS") == 0) {
                Indicador_de_CPF_CNPJ = obj[0].substring(72, 73);
                if (Indicador_de_CPF_CNPJ && Indicador_de_CPF_CNPJ == "1") {
                    cpf = obj[0].substring(73, 87).trim();
                    cnpj = null;
                } else if (Indicador_de_CPF_CNPJ && Indicador_de_CPF_CNPJ == "2") {
                    cnpj = obj[0].substring(73, 87).trim();
                    cpf = null;
                }
                im = (obj[0].substring(87, 95) == '00000000') ? null : obj[0].substring(87, 95);
                ie = (obj[0].substring(95, 107) == '000000000000') ? null : obj[0].substring(95, 107);

                razao = obj[0].substring(107, 182).trim();
                endereco = obj[0].substring(182, 185).trim() + ' ' + obj[0].substring(185, 235).trim();
                nr = obj[0].substring(235, 245).trim();
                complemento = obj[0].substring(245, 275).trim();
                bairro = obj[0].substring(275, 305).trim();
                cidade = obj[0].substring(305, 355).trim();
                uf = obj[0].substring(355, 357).trim();
                cep = obj[0].substring(357, 365).trim();
                email = obj[0].substring(365, 440).trim();
                nr_rps = obj[0].substring(11, 23).trim();
                serie_rps = obj[0].substring(6, 11).trim();
                ItemListaServico = obj[0].substring(62, 67).trim();
                valor_dos_servicos = obj[0].substring(32, 47).trim();
                valor_dos_servicos = valor_dos_servicos.substring(0, valor_dos_servicos.length - 2) + "." + valor_dos_servicos.substring(valor_dos_servicos.length - 2, valor_dos_servicos.length);

                // cliente_id = achaCliente(razao, email, cpf, cnpj, ie, im, razao, cpf, cnpj, endereco, bairro, cidade, uf, nr, complemento, cep, email, razao, cpf, cnpj, ie, endereco, bairro, cidade, uf, nr, complemento, cep, email, plano_de_contas_saida_id);
                achaCliente(razao, email, cpf, cnpj, ie, im, razao, cpf, cnpj, endereco, bairro, cidade, uf, nr, complemento, cep, email, razao, cpf, cnpj, ie, endereco, bairro, cidade, uf, nr, complemento, cep, email, plano_de_contas_saida_id, function (resposta) {
                    console.log(resposta);
                    var queryInsertRPS = ("INSERT INTO " + $rootScope.user.banco + ".nfse_rps (numeroRps, serie, cliente_id, empresa_id,  DataEmissao, ItemListaServico, ValorServicos, rps_id, cpftomador,cnpjtomador, RazaoSocialTomador, EnderecoTomador, NumeroTomador, ComplementoTomador, BairroTomador, cidadeTomador, UFTomador, CepTomador, etapa) VALUES ('" + nr_rps + "','" + serie_rps + "','" + resposta + "','" + empresa_id + "',CURDATE(),'" + ItemListaServico + "','" + valor_dos_servicos + "','" + rps_id + "','" + cpf + "','" + cnpj + "',\"" + razao + "\",'" + endereco + "','" + nr + "','" + complemento + "','" + bairro + "','" + cidade + "','" + uf + "','" + cep + "', 'finalizado')").replaceAll("'null'", "null").replaceAll("''", "null");
                    console.log(queryInsertRPS);
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryInsertRPS.trim().replaceAll("'null'", "null"))).then(function (data) {
                        if (!data.err) {
                            var queryInsertFin = ("INSERT INTO " + $rootScope.user.banco + ".financeiro (documento,cliente_fornecedor_id,emissao,vencimento,valorOriginal, acrescimo,despesa,valor,forma_de_pagamento_id,carteira_id,empresa_id, plano_de_contas_id,usuario_id,rps_id,nr_rps ) VALUES ('RPS" + nr_rps + "','" + resposta + "',CURDATE(),DATE_ADD(CURDATE(),INTERVAL 14 DAY),'" + valor_dos_servicos + "','" + 0 + "','" + 0 + "','" + valor_dos_servicos + "','" + 1 + "','" + carteira_id + "','" + empresa_id + "','" + plano_de_contas_saida_id + "','" + 2 + "','" + rps_id + "','" + nr_rps + "')").replaceAll("'null'", "null").replaceAll("''", "null");
                            console.log(queryInsertFin);
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryInsertFin.trim().replaceAll("'null'", "null"))).then(function (data) {
                                if (!data.err) {
                                    obj.splice(0, 1);
                                    console.log("Faltam " + obj.length);
                                    $("#porcentualPF")[0].textContent = parseFloat(parseFloat($("#porcentualPF")[0].textContent.replace("%", "")) + parseFloat(porcent)).toFixed(2) + '%';
                                    $("#progressBarPF")[0].style.width = parseFloat($("#progressBarPF")[0].style.width.replace("%", "")) + parseFloat(porcent) + '%'
                                    $("#concluidoPF")[0].textContent = parseInt($("#concluidoPF")[0].textContent) + 1;
                                    fazRPS(obj, plano_de_contas_saida_id, empresa_id, carteira_id, rps_id, porcent, idFuncao);
                                } else {
                                    console.log(data.error)
                                    debugger
                                }
                            });
                        } else {
                            console.log(data.error)
                            debugger
                        }
                    });
                });

                // insertRPS.push(("INSERT INTO " + $rootScope.user.banco + ".nfse_rps (numeroRps, serie, cliente_id, empresa_id,  DataEmissao, ItemListaServico, ValorServicos, rps_id, cpftomador,cnpjtomador, RazaoSocialTomador, EnderecoTomador, NumeroTomador, ComplementoTomador, BairroTomador, cidadeTomador, UFTomador, CepTomador) VALUES ('" + nr_rps + "','" + serie_rps + "','" + cliente_id + "','" + empresa_id + "',CURDATE(),'" + ItemListaServico + "','" + valor_dos_servicos + "','" + rps_id + "','" + cpf + "','" + cnpj + "','" + razao + "','" + endereco + "','" + nr + "','" + complemento + "','" + bairro + "','" + cidade + "','" + uf + "','" + cep + "')").replaceAll("'null'", "null").replaceAll("''", "null"));
                // insertFin.push(("INSERT INTO " + $rootScope.user.banco + ".financeiro (documento,cliente_fornecedor_id,emissao,vencimento,valorOriginal, acrescimo,despesa,valor,forma_de_pagamento_id,carteira_id,empresa_id, plano_de_contas_id,usuario_id,rps_id,nr_rps ) VALUES ('RPS" + nr_rps + "','" + cliente_id + "',CURDATE(),DATE_ADD(CURDATE(),INTERVAL 14 DAY),'" + valor_dos_servicos + "','" + 0 + "','" + 0 + "','" + valor_dos_servicos + "','" + 1 + "','" + carteira_id + "','" + empresa_id + "','" + plano_de_contas_saida_id + "','" + 2 + "','" + rps_id + "','" + nr_rps + "')").replaceAll("'null'", "null").replaceAll("''", "null"));
            } else {
                obj.splice(0, 1);
                console.log("Faltam " + obj.length);
                $("#porcentualPF")[0].textContent = parseFloat(parseFloat($("#porcentualPF")[0].textContent.replace("%", "")) + parseFloat(porcent)).toFixed(2) + '%';
                $("#progressBarPF")[0].style.width = parseFloat($("#progressBarPF")[0].style.width.replace("%", "")) + parseFloat(porcent) + '%'
                $("#concluidoPF")[0].textContent = parseInt($("#concluidoPF")[0].textContent) + 1;
                fazRPS(obj, plano_de_contas_saida_id, empresa_id, carteira_id, rps_id, porcent, idFuncao);
            }
        } else {
            console.log('Vou chamar a Procedure');
            // $("[data-id=52675]")[0].innerHTML = '<div><p>Preparando para Gerar CNAB</div>';
            $("#porcentualPF")[0].textContent = '100%';
            $("#iconePF")[0].classList.remove("fa-square");
            $("#iconePF")[0].classList.add("fa-check-square");
            RPSProcedure(rps_id, idFuncao);
            consulta_NFSE_RPS(rps_id);
        }
    }

    function achaCliente(razao, email, cpf, cnpj, ie, im, razao, cpf, cnpj, endereco, bairro, cidade, uf, nr, complemento, cep, email, razao, cpf, cnpj, ie, endereco, bairro, cidade, uf, nr, complemento, cep, email, plano_de_contas_saida_id, callback) {
        var insertCliente, queryCliente = "SELECT id FROM " + $rootScope.user.banco + '.cliente_fornecedor WHERE razao LIKE "' + razao + '"';
        console.log(queryCliente);
        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryCliente.trim())).then(function (data) {
            if (data.data.data) {
                if (data.data.data.length > 0) {
                    // return data.data[0].id;
                    console.log("Existe");
                    callback(data.data.data[0].id);
                    // callback('OK');
                }
                else {
                    console.log(data.query);
                    insertCliente = "INSERT IGNORE INTO " + $rootScope.user.banco + ".cliente_fornecedor (cliente,fantasia,razao,email,cpf,cnpj,inscricaoEstadual, inscricaoMunicipal,dataCadastro, cbrNome,cbrCpf,cbrCnpj,cbrEndereco,cbrBairro,cbrCidade,cbrUf,cbrNumero,cbrComplemento,cbrCep,cbrEmail, entrNome,entrCpf,entrCnpj,entrInscrEstadual,entrEndereco,entrBairro,entrCidade,entrUf,entrNumero, entrComplemento,entrCep,entrEmail,plano_de_contas_pk, created_at) VALUES (1,\"" + razao + "\",\"" + razao + "\",'" + email + "','" + cpf + "','" + cnpj + "','" + ie + "','" + im + "',CURDATE(),\"" + razao + "\",'" + cpf + "','" + cnpj + "','" + endereco + "','" + bairro + "','" + cidade + "','" + uf + "','" + nr + "','" + complemento + "','" + cep + "','" + email + "',\"" + razao + "\",'" + cpf + "','" + cnpj + "','" + ie + "','" + endereco + "','" + bairro + "','" + cidade + "','" + uf + "','" + nr + "','" + complemento + "','" + cep + "','" + email + "','" + plano_de_contas_saida_id + "',CURDATE())";
                    console.log(insertCliente);
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(insertCliente.trim().replaceAll("'null'", "null"))).success(function (data) {
                        // return data.data.insertId;
                        console.log("nao Existe");
                        if (JSON.parse(localStorage.user).nao_saas == 0) {
                            queryID = "SELECT id FROM " + $rootScope.user.banco + ".cliente_fornecedor WHERE _id = " + data.data.insertId;
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryID.trim()))
                                .then(function (data) {
                                    ko = data.data.data[0].id
                                    callback(ko);

                                });
                        } else callback(data.data.insertId);
                        // callback("ok");
                    });
                }
            }
        }, function (erro) {
            console.log(erro)
        });
    }

    function consulta_NFSE_RPS(idRPS) {
        var tempo = 1000, total, concluido, contInterval = 0,
            query = "SELECT COUNT(*) total, SUM(IF(COALESCE(etapa,'')='emitindo',0,1)) concluido  FROM " +
                $rootScope.user.banco + ".nfse_rps WHERE rps_id = " + idRPS;

        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (!data.err) {
                console.log(data.query);
                $("#totalPN")[0].textContent = "/" + data.data[0].total;
                var porcentPN = 100 / data.data[0].total;
                $("#porcentualPN")[0].textContent = parseFloat(porcentPN * data.data[0].concluido).toFixed(2) + '%';
                $("#progressBarPN")[0].style.width = parseFloat(porcentPN * data.data[0].concluido) + '%'
                $("#concluidoPN")[0].textContent = data.data[0].concluido;

                tempInterval = setInterval(function () {
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        // console.log('-------ooooooo---------' + data.query + '----------oooooooo------');
                        total = data.data[0].total;
                        concluido = data.data[0].concluido;
                        $("#porcentualPN")[0].textContent = parseFloat(porcentPN * data.data[0].concluido).toFixed(2) + '%';
                        $("#progressBarPN")[0].style.width = parseFloat(porcentPN * concluido) + '%'
                        $("#concluidoPN")[0].textContent = concluido;
                        if (total == concluido) {
                            clearInterval(tempInterval);
                            $("#porcentualPN")[0].textContent = '100%';
                            $("#iconePN")[0].classList.remove("fa-square");
                            $("#iconePF")[0].classList.add("fa-check-square");;
                        }
                    });
                    contInterval += tempo;
                    if (contInterval >= 120000) {
                        clearInterval(tempInterval);
                    }
                }, tempo);
            } else {
                console.log(data.error)
                debugger
            }
        });
    }

    function RPSProcedure(idRPS, idFuncao) {
        // g$.alerta("Alerta", "Gerando CNAB");
        var query, ids, conteudo, sequencial, sequencia_hoje, jurosDia, arquivo, conta, razao, juros, convenio, cnab = {}, registros = {}, empresa = {}, hoje = new Date();
        hoje = hoje.format("yyyyMMdd");
        // PEGA IDS DO FINANCEIRO GERADOS POR ESTE RPS
        query = "SELECT GROUP_CONCAT(f.id) ids, COALESCE(c.carteira_cnab,'') convenio, COALESCE(c.jurosDia,'') juros, COALESCE(c.conta,'') conta FROM " + $rootScope.user.banco + ".financeiro f LEFT JOIN " + $rootScope.user.banco + ".carteira c ON c.id = f.carteira_id WHERE f.rps_id = " + idRPS;
        console.log(query);
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            // console.log(data);
            // proc = "CALL " + $rootScope.user.banco + ".CNAB_deutscheBank('" + data.data[0].ids + "', " + idRPS + ")";
            // $http.post(URL + "/jsonQuery/", g$.trataQuery(proc.trim())).success(function (data) {
            //     console.log(data);
            //     g$.alerta("Alerta","Finalizado!");
            //     console.log("Finalizado!")
            // });
            if (!data.err) {
                ids = data.data[0].ids;
                convenio = data.data[0].convenio;
                juros = data.data[0].juros;
                conta = data.data[0].conta;
                debugger;
                $("#totalPC")[0].textContent = "/" + (ids.split(",").length + 7);
                var porcentPC = 100 / (ids.split(",").length + 7)
                $("#porcentualPC")[0].textContent = parseFloat(parseFloat($("#porcentualPC")[0].textContent.replace("%", "")) + parseFloat(porcentPC)).toFixed(2) + '%';
                $("#progressBarPC")[0].style.width = parseFloat($("#progressBarPC")[0].style.width.replace("%", "")) + parseFloat(porcentPC) + '%'
                $("#concluidoPC")[0].textContent = parseInt($("#concluidoPC")[0].textContent) + 1;

                // PEGA QUANTIDADE DE CNABs GERADOS
                query = "SELECT COUNT(id) sequencial, coalesce(sum(if (data = CURDATE(), 1,0)),0) sequencia_hoje FROM " + $rootScope.user.banco + ".cnab WHERE banco = 487";
                console.log(query);
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    if (!data.err) {
                        sequencial = data.data[0].sequencial;
                        sequencia_hoje = data.data[0].sequencia_hoje
                        console.log(sequencial);
                        $("#porcentualPC")[0].textContent = parseFloat(parseFloat($("#porcentualPC")[0].textContent.replace("%", "")) + parseFloat(porcentPC)).toFixed(2) + '%';
                        $("#progressBarPC")[0].style.width = parseFloat($("#progressBarPC")[0].style.width.replace("%", "")) + parseFloat(porcentPC) + '%'
                        $("#concluidoPC")[0].textContent = parseInt($("#concluidoPC")[0].textContent) + 1;

                        query = "SELECT COALESCE(cnpj,'') cnpj, COALESCE(razao,'') razao, COALESCE(mensagem1,'') mensagem1, COALESCE(mensagem2,'') mensagem2, COALESCE(mora,'') mora, '" + convenio + "' convenio, '" + juros + "' juros,'" + sequencial + "' sequencial,'" + conta + "' conta  FROM " + $rootScope.user.banco + ".empresa LIMIT 1";
                        console.log(query);
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                            if (!data.err) {
                                empresa = data.data[0];
                                console.log(sequencial);
                                $("#porcentualPC")[0].textContent = parseFloat(parseFloat($("#porcentualPC")[0].textContent.replace("%", "")) + parseFloat(porcentPC)).toFixed(2) + '%';
                                $("#progressBarPC")[0].style.width = parseFloat($("#progressBarPC")[0].style.width.replace("%", "")) + parseFloat(porcentPC) + '%'
                                $("#concluidoPC")[0].textContent = parseInt($("#concluidoPC")[0].textContent) + 1;
                                query = "SELECT f.id id, COALESCE(f.documento,'') documento, COALESCE(f.vencimento,'') vencimento,COALESCE(f.valor,0) valor ,COALESCE(IF(ISNULL(cpf),cnpj,cpf),'') cnpj, IF(ISNULL(cpf),2,1) tipo_insc, removeacentos(razao) nome,removeacentos(COALESCE(entrbairro,'')) bairro, removeacentos(CONCAT(COALESCE(entrendereco,''),' ',COALESCE(entrnumero,''),' ',COALESCE(entrcomplemento,''))) endereco, removeacentos(COALESCE(entrcidade,'')) cidade, removeacentos(COALESCE(entruf,'')) uf,replace(COALESCE(entrCep),'-','') cep FROM " + $rootScope.user.banco + ".financeiro f LEFT JOIN " + $rootScope.user.banco + ".cliente_fornecedor c ON f.cliente_fornecedor_id = c.id WHERE f.id in (" + ids + ")";
                                console.log(query);
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                    if (!data.err) {
                                        registros = data.data;
                                        cnab = { empresa, registros };
                                        console.log(sequencial);
                                        $("#porcentualPC")[0].textContent = parseFloat(parseFloat($("#porcentualPC")[0].textContent.replace("%", "")) + parseFloat(porcentPC)).toFixed(2) + '%';
                                        $("#progressBarPC")[0].style.width = parseFloat($("#progressBarPC")[0].style.width.replace("%", "")) + parseFloat(porcentPC) + '%'
                                        $("#concluidoPC")[0].textContent = parseInt($("#concluidoPC")[0].textContent) + 1;

                                        conteudo = remessa_CNAB_240(cnab, porcentPC);
                                        console.log(conteudo);
                                        arquivo = '000' + leftPad(conta, 10) + "_CN" + hoje + leftPad(sequencia_hoje, 3) + ".rem";
                                        query = "INSERT INTO " + $rootScope.user.banco + ".cnab(arquivo, cnab, banco, data, rps_id) VALUES ('" + arquivo + "','" + conteudo + "', 487, CURDATE(),'" + idRPS + "');";
                                        console.log(query);
                                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                            if (!data.err) {
                                                $("#porcentualPC")[0].textContent = '100%';
                                                $("#progressBarPC")[0].style.width = parseFloat($("#progressBarPC")[0].style.width.replace("%", "")) + parseFloat(porcentPC) + '%'
                                                $("#concluidoPC")[0].textContent = parseInt($("#concluidoPC")[0].textContent) + 1;
                                                $("#iconePC")[0].classList.remove("fa-square");
                                                $("#iconePC")[0].classList.add("fa-check-square");;
                                                query = "UPDATE " + $rootScope.user.banco + ".rps SET arquivo_cnab = '" + arquivo + "' WHERE id ='" + idRPS + "' ;";
                                                console.log(query);
                                                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                                    if (!data.err) {
                                                        g$.geraArquivo("geraArquivo ¦" + idFuncao + " | " + $rootScope.user.projeto + " | " + arquivo + " | " + conteudo + " | baixar");

                                                    } else {
                                                        console.log(data.error)
                                                        debugger
                                                    }
                                                });
                                            } else {
                                                console.log(data.error)
                                                debugger
                                            }
                                        });

                                    } else {
                                        console.log(data.error)
                                        debugger
                                    }
                                });
                            } else {
                                console.log(data.error)
                                debugger
                            }
                        });
                    } else {
                        console.log(data.error)
                        debugger
                    }
                });
            } else {
                console.log(data.error)
                debugger
            }

        });
    }

    function leftPad(str, len, pad) {
        str = str.toString().substring(0, len)
        var length = len - str.toString().length + 1;
        return Array(length).join(pad || '0') + str;
        // leftPad(1, 4); = 0001
    };

    // function rightPad(str, len, pad) {
    //     var length = len - str.toString().length + 1;
    //     return str + Array(length).join(pad || ' ');
    // };

    function rightPad(str, len, pad) {
        str = str.toString().substring(0, len);
        var length = len - str.toString().length + 1;
        return str + Array(length).join(pad || ' ');
    };

    function remessa_CNAB_240(obj, porcentPC) {

        var data_hora = new Date(),
            espaco = "                                                                                                                                                                                                                                                                              ",
            e_cnpj = obj.empresa.cnpj.toString().substring(0, 14),
            e_convenio = obj.empresa.convenio.toString().substring(0, 10),
            e_razao = obj.empresa.razao.toString().substring(0, 30),
            e_mensagem1 = obj.empresa.mensagem1.toString().substring(0, 40),
            e_mensagem2 = obj.empresa.mensagem2.toString().substring(0, 40),
            e_mora = obj.empresa.mora.substring(0, 1),
            v_hoje = data_hora.format("ddMMyyyy"),
            v_agora = data_hora.format("hhmmss"),
            v_sequencial = obj.empresa.sequencial.toString().substring(0, 6),
            v_nosso_num = '',
            v_seu_num = '',

            v_vencimento = '', // formatar DDMMAAAA
            v_valor = '',
            v_juros = obj.empresa.juros.toString().substring(0, 15),

            v_total = 0,
            cnab, cnabR;

        // HEADER
        cnab = '487'; // Código do banco 
        cnab = cnab + '0000';  // Lote Serviço
        cnab = cnab + '0';// Tipo de Registro
        cnab = rightPad(cnab, 17) + '2';//Deverá ser preenchido com “1” para CPF ou com ‘2” para CGC/CNPJ
        cnab = cnab + e_cnpj;
        cnab = rightPad(cnab, 52) + '00001';//Código da Agência na Câmara de Compensação valor esperado no manual é '00001'
        cnab = cnab + '0';
        cnab = rightPad(cnab, 58) + e_convenio;//Número do convênio cliente
        cnab = rightPad(cnab, 73) + e_razao;//Nome Empresa
        cnab = rightPad(cnab, 102) + 'DEUTSCHE BANK'; // NOME DO BANCO
        cnab = rightPad(cnab, 142) + '1';//O campo será preenchido com o número “1” para Remessa e “2” para Retorno
        cnab = rightPad(cnab, 142) + v_hoje; // DATA DE GERAcaO DDMMAA   mudar para DDMMAAAA
        cnab = rightPad(cnab, 151) + v_agora//Hora de geração do arquivo no formato HHMMSS
        cnab = rightPad(cnab, 157) + v_sequencial; // NuMERO SEQUENCIAL do arquivo
        cnab = rightPad(cnab, 163) + '082';//Valores sugeridos “082” ou “050”, porém, a informação não é validada pelo Deutsche Bank
        cnab = rightPad(cnab, 166) + '00000';//O campo deverá ser preenchido com a densidade de gravação do arquivo, “01600” ou “06250” Informação não mandatória na remessa, porém, estará disponível no retorno.

        // HEADER DE LOTE
        cnabH = '487'; // Código do banco 
        cnabH = cnabH + '0001';  // Lote Serviço
        cnabH = cnabH + '1';// Tipo de Registro
        cnabH = cnabH + 'R';// Tipo de Operacao Deverá ser preenchido com “R” se Arquivo Remessa ou com “T” se Arquivo Retorno.
        cnabH = cnabH + '01';// Tipo Serviço O campo deverá ser preenchido com o número “01”
        cnabH = rightPad(cnabH, 13) + '042';// Versão Layout
        cnabH = rightPad(cnabH, 17) + '2';//Deverá ser preenchido com “1” para CPF ou com ‘2” para CGC/CNPJ
        cnabH = cnabH + e_cnpj;
        cnabH = rightPad(cnabH, 52) + '00001';//Código da Agência na Câmara de Compensação valor esperado no manual é '00001'
        cnabH = rightPad(cnabH, 59) + e_convenio;//Número do convênio cliente
        cnabH = rightPad(cnabH, 73) + e_razao;//Nome Empresa
        cnabH = rightPad(cnabH, 103) + e_mensagem1;//sera impressa no boleto 40 caracteres
        cnabH = rightPad(cnabH, 143) + e_mensagem2;//sera impressa no boleto 40 caracteres
        cnabH = rightPad(cnabH, 157) + v_sequencial; // NuMERO SEQUENCIAL do arquivo
        cnabH = rightPad(cnabH, 142) + v_hoje; // DATA DE GERAcaO DDMMAA   mudar para DDMMAAAA
        cnab = cnab + '\n' + cnabH;  // quebra de linha
        //  $("#porcentualPC")[0].textContent = parseFloat(parseFloat($("#porcentualPC")[0].textContent.replace("%", "")) + parseFloat(porcentPC)).toFixed(2) + '%';
        // $("#progressBarPC")[0].style.width = parseFloat($("#progressBarPC")[0].style.width.replace("%", "")) + parseFloat(porcentPC) + '%'
        // $("#concluidoPC")[0].textContent = parseInt($("#concluidoPC")[0].textContent) + 1;
        // DETALHE 
        obj.registros.forEach(function (reg, i) {

            c_tipo_insc = reg.tipo_insc.toString().substring(0, 1);
            c_cnpj = reg.cnpj.toString().substring(0, 15);
            v_valor = reg.valor.toString().replaceAll(".", "");
            v_vencimento = reg.vencimento.split("-").reverse().join("");
            c_nome = reg.nome.toString().substring(0, 40);// Nome do Pagador
            c_endereco = reg.endereco.toString().substring(0, 40);
            c_bairro = reg.bairro.toString().substring(0, 15);
            c_cep = reg.cep.toString().substring(0, 8);
            c_cidade = reg.cidade.toString().substring(0, 15);
            c_uf = reg.uf.toString().substring(0, 2);
            f_id = reg.id;
            f_documento = reg.documento;
            // DETALHE P            
            cnabP = '487'; // Código do banco 
            cnabP = cnabP + '0001';  // Lote Serviço
            cnabP = cnabP + '3';// Tipo de Registro
            cnabP = cnabP + leftPad(i, 5);// Número de identificação da sequência dos registros no lote
            cnabP = cnabP + 'P';// Código Segmento Registro, O campo deverá ser preenchido com a letra “P”
            cnabP = cnabP + ' ';
            cnabP = cnabP + '01'; /*  Código Movimento Remessa :
                                01 Entrada de Títulos
                                02 Pedido de Baixa 04 Concessão de Abatimento
                                05 Cancelamento do Abatimento 06 Alteração de Vencimento
                                09 Protestar 10 Sustar Protesto e Baixar Título
                                11 Sustar Protesto e Manter em Carteira 23 Alterar Dados do Sacado
                                31 Alteração de Outros Dados
                            */
            cnabP = rightPad(cnabP, 17) + '00001';//Código da Agência na Câmara de Compensação valor esperado no manual é '00001'
            cnabP = rightPad(cnabP, 23) + e_convenio;//Número do convênio cliente
            cnabP = rightPad(cnabP, 37) + v_nosso_num;// Nosso Número do Deutsche
            cnabP = rightPad(cnabP, 57) + '1';/* Código Carteira :
                                                        1 Cobrança Simples
                                                        2 Desconto 
                                                        3 Cessão de Crédito
                                                      */
            cnabP = rightPad(cnabP, 67) + leftPad(f_documento, 10);
            cnabP = rightPad(cnabP, 77) + v_vencimento;// vencimeno
            cnabP = rightPad(cnabP, 85) + leftPad(v_valor, 15);// valor
            cnabP = rightPad(cnabP, 106) + '02';/* Espécie do Título :
                                                        01 Cheque
                                                        02 Duplicata Mercantil 
                                                        04 Duplicata de Serviço
                                                        12 Nota Promissória 
                                                        17 Recibo
                                                        20 Apólice de Seguro 
                                                        99 Outros
                                                      */
            cnabP = rightPad(cnabP, 108) + 'N';// A = Aceite N = Não Aceite                                                      
            cnabP = rightPad(cnabP, 116) + v_hoje; // DATA DE Emissão
            cnabP = rightPad(cnabP, 117) + e_mora; // Código Mora 1 = Valor Diário 2 = Taxa Mensal 3 = Isento.
            cnabP = rightPad(cnabP, 126) + v_juros; // juros
            cnabP = rightPad(cnabP, 141) + '0';/* Código Desconto :
                                                        1 Valor fixo até a data informada
                                                        2 Percentual até a data informada 
                                                        3 Valor por antecipação
                                                      */
            cnabP = rightPad(cnabP, 142) + leftPad('0', 8); // Data do desconto no formato DDMMAAAA  
            cnabP = rightPad(cnabP, 150) + leftPad('0', 15); // Valor ou Porcentagem a ser descontada
            cnabP = rightPad(cnabP, 180) + leftPad('0', 15); // Valor do Abatimento
            cnabP = rightPad(cnabP, 196) + leftPad(f_id, 25);
            cnabP = rightPad(cnabP, 220) + '3'; // Cobrança Bradesco: O campo deverá ser preenchido com “1” para PROTESTAR e “3” para NÃO PROTESTAR. Cobrança Deutsche Bank: O campo deverá ser preenchido com ZEROS
            cnabP = rightPad(cnabP, 222) + leftPad('0', 2); // Cobrança Bradesco: Enviar o prazo para protesto automático após o vencimento do título. O prazo não poderá ser inferior a 5 dias corridos; Cobrança Deutsche Bank: O campo deverá ser preenchido com ZEROS
            cnabP = rightPad(cnabP, 227) + '09';// Deverá ser usado o número “09” para REAL
            cnabP = cnabP + leftPad('0', 10);
            cnabP = rightPad(cnabP, 240);

            // DETALHE Q
            cnabQ = '487'; // Código do banco 
            cnabQ = cnabQ + '0001';  // Lote Serviço
            cnabQ = cnabQ + '3';// Tipo de Registro
            cnabQ = cnabQ + leftPad(i, 5);// Número de identificação da sequência dos registros no lote
            cnabQ = cnabQ + 'Q';// Código Segmento Registro, O campo deverá ser preenchido com a letra “P”
            cnabQ = cnabQ + ' ';
            cnabQ = cnabQ + '01'; /*  Código Movimento Remessa :
                                01 Entrada de Títulos
                                02 Pedido de Baixa 04 Concessão de Abatimento
                                05 Cancelamento do Abatimento 06 Alteração de Vencimento
                                09 Protestar 10 Sustar Protesto e Baixar Título
                                11 Sustar Protesto e Manter em Carteira 23 Alterar Dados do Sacado
                                31 Alteração de Outros Dados
                            */
            cnabQ = rightPad(cnabQ, 17) + c_tipo_insc;//Deverá ser preenchido com “1” para CPF ou com ‘2” para CGC/CNPJ
            cnabQ = cnabQ + c_cnpj;
            cnabQ = rightPad(cnabQ, 33) + c_nome;// Nome do Pagador
            cnabQ = rightPad(cnabQ, 73) + c_endereco;//endereco do Pagador
            cnabQ = rightPad(cnabQ, 113) + c_bairro;//bairro do Pagador
            cnabQ = rightPad(cnabQ, 128) + c_cep;//cep do Pagador
            cnabQ = rightPad(cnabQ, 136) + c_cidade;//cidade do Pagador
            cnabQ = rightPad(cnabQ, 151) + c_uf;//uf do Pagador
            cnabQ = rightPad(cnabQ, 153) + '0';//Tipo Inscrição Sacador
            cnabQ = cnabQ + leftPad('0', 15);//Número Inscrição Sacador Avalista O campo deverá ser preenchido com ZEROS
            cnabQ = cnabQ + '000';
            cnabQ = rightPad(cnabQ, 212) + leftPad('0', 12);//Nosso Número no Correspondente Cobrança Bradesco: Informar o Nosso Número caso a cobrança a ser utilizada seja a “Direta”. Ver Nota Explicativa 8. Cobrança Deutsche Bank: O campo deverá ser preenchido com ZEROS
            cnabQ = rightPad(cnabQ, 240);
            v_total = v_total + v_valor;

            cnab = cnab + '\n' + cnabP + '\n' + cnabQ;  // quebra de linha + registro

            //$("#porcentualPC")[0].textContent = parseFloat(parseFloat($("#porcentualPC")[0].textContent.replace("%", "")) + parseFloat(porcentPC)).toFixed(2) + '%';
            // $("#progressBarPC")[0].style.width = parseFloat($("#progressBarPC")[0].style.width.replace("%", "")) + parseFloat(porcentPC) + '%'
            //$("#concluidoPC")[0].textContent = parseInt($("#concluidoPC")[0].textContent) + 1;

        });
        // Trailer Lote
        cnabL = '487'; // Código do banco 
        cnabL = cnabL + '0000';  // Lote Serviço
        cnabL = cnabL + '5';// Tipo de Registro
        cnabL = leftPad(cnabL, 17) + leftPad(obj.registros.length * 2 + 2, 6);// Quantidade Registros
        cnabL = cnabL + leftPad(obj.registros.length, 6);// Quantidade Títulos cobr simples
        cnabL = cnabL + leftPad(v_total, 17);// valor Títulos cobr simples
        cnabL = cnabL + leftPad('0', 6);// Quantidade Títulos cobr Vinculada
        cnabL = cnabL + leftPad('0', 17);// valor Títulos cobr Vinculada
        cnabL = cnabL + leftPad('0', 6);// Quantidade Títulos cobr Caucionada
        cnabL = cnabL + leftPad('0', 17);// valor Títulos cobr Caucionada
        cnabL = cnabL + leftPad('0', 6);// Quantidade Títulos cobr Descontada
        cnabL = cnabL + leftPad('0', 17);// valor Títulos cobr Descontada
        cnabL = rightPad(cnabL, 240);

        // Trailer de Arquivo
        cnabA = '487'; // Código do banco 
        cnabA = cnabA + '9999';  // Lote Serviço
        cnabA = cnabA + '9';// Tipo de Registro
        cnabA = rightPad(cnabA, 17);
        cnabA = cnabA + leftPad('1', 6);// Quantidade de lotes
        cnabA = cnabA + leftPad(obj.registros.length * 2 + 4, 6);// Quantidade de registros
        cnabA = cnabA + leftPad('0', 6);
        cnabA = rightPad(cnabA, 240);
        cnab = cnab + '\n' + cnabL + '\n' + cnabA;
        // $("#porcentualPC")[0].textContent = parseFloat(parseFloat($("#porcentualPC")[0].textContent.replace("%", "")) + parseFloat(porcentPC)).toFixed(2) + '%';
        //$("#progressBarPC")[0].style.width = parseFloat($("#progressBarPC")[0].style.width.replace("%", "")) + parseFloat(porcentPC) + '%'
        //$("#concluidoPC")[0].textContent = parseInt($("#concluidoPC")[0].textContent) + 1;

        return cnab;
    };


    function geraBoleto() {

        var boleto = {
            barcodeData: '23797726700000009997506091900000120800542910',
            digitableLine: '23797.50603 91900.000125 08005.429108 7 72670000000999',
            paymentPlace:
                'Pagável preferencialmente na rede Bradesco ou Bradesco Expresso.',
            beneficiary: 'UNICRED FLORIANÓPOLIS - CNPJ: 074.064.502/0001-12',
            beneficiaryAddress:
                'Rua Tenete Silveira, 315 - Centro - Florianópolis - SC  - CEP 88010-301',
            instructions:
                'Após o vencimento cobrar multa de 2,00% , mais juros ao mes de 1,00%.',
            agency: '7506',
            agencyDigit: '0',
            account: '54291',
            accountDigit: '1',
            expirationDay: new Date(2017, 7, 30), // 30/08/2017
            documentDate: new Date(2017, 7, 18), // 18/08/2017
            processingDate: new Date(2017, 7, 18), // 18/08/2017
            card: '09',
            documentNumber: '42493',
            formatedOurNumber: '09/19000001208-0',
            formatedValue: 'R$ 9,90',
            documentType: 'DS',
            accept: 'N',
            currencyType: 'Real (R$)',
            amount: ' ',
            valueOf: ' ',
            descountValue: ' ',
            otherDiscounts: ' ',
            feeValue: ' ',
            outherFees: ' ',
            chargeValue: ' ',
            payer: {
                name: 'Anita Albuquerque',
                registerNumber: '221.412.772-05',
                street: 'Rua Maria Gertrudes Coelho',
                number: '827',
                complement: ' ',
                district: 'Estrada Nova',
                city: 'Divinópolis',
                state: 'MG',
                postalCode: '35500-700'
            },
            guarantor: {
                name: 'ACME Telecomunicações Ltda',
                registerNumber: '074.064.502/0001-12',
                street: 'Servidão',
                number: '439',
                district: 'Estrada Nova',
                complement: ' ',
                city: 'Jaraguá do Sul',
                state: 'SC',
                postalCode: '89254-375'
            }
        }
    }

    g$.testaRPS = function (params) {

        query = "SELECT GROUP_CONCAT(f.id) ids, COALESCE(c.carteira_cnab,'') convenio, COALESCE(c.jurosDia,'') juros, COALESCE(c.conta,'') conta FROM " + "saas" + ".financeiro f LEFT JOIN saas.carteira c ON c.id = f.carteira_id WHERE f.rps_id = 1 AND f.emissao = '2018-02-14'";
        console.log(query);
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            // console.log(data);
            // proc = "CALL " + $rootScope.user.banco + ".CNAB_deutscheBank('" + data.data[0].ids + "', " + idRPS + ")";
            // $http.post(URL + "/jsonQuery/", g$.trataQuery(proc.trim())).success(function (data) {
            //     console.log(data);
            //     g$.alerta("Alerta","Finalizado!");
            //     console.log("Finalizado!")
            // });
            if (!data.err) {
                ids = data.data[0].ids;
                convenio = data.data[0].convenio;
                juros = data.data[0].juros;
                conta = data.data[0].conta;
                query = "SELECT COUNT(id) sequencial, coalesce(sum(if (data = CURDATE(), 1,0)),0) sequencia_hoje FROM " + $rootScope.user.banco + ".cnab WHERE banco = 487";
                console.log(query);
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    if (!data.err) {
                        sequencial = data.data[0].sequencial;
                        sequencia_hoje = data.data[0].sequencia_hoje
                        console.log(sequencial);

                        query = "SELECT COALESCE(cnpj,'') cnpj, COALESCE(razao,'') razao, COALESCE(mensagem1,'') mensagem1, COALESCE(mensagem2,'') mensagem2, COALESCE(mora,'') mora, '" + convenio + "' convenio, '" + juros + "' juros,'" + sequencial + "' sequencial,'" + conta + "' conta  FROM " + $rootScope.user.banco + ".empresa LIMIT 1";
                        console.log(query);
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                            if (!data.err) {
                                empresa = data.data[0];
                                console.log(sequencial);

                                query = "SELECT f.id id, COALESCE(f.documento,'') documento, COALESCE(f.vencimento,'') vencimento,COALESCE(f.valor,0) valor ,COALESCE(IF(ISNULL(cpf),cnpj,cpf),'') cnpj, IF(ISNULL(cpf),2,1) tipo_insc, removeacentos(razao) nome,removeacentos(COALESCE(entrbairro,'')) bairro, removeacentos(CONCAT(COALESCE(entrendereco,''),' ',COALESCE(entrnumero,''),' ',COALESCE(entrcomplemento,''))) endereco, removeacentos(COALESCE(entrcidade,'')) cidade, removeacentos(COALESCE(entruf,'')) uf,replace(COALESCE(entrCep),'-','') cep FROM " + $rootScope.user.banco + ".financeiro f LEFT JOIN " + $rootScope.user.banco + ".cliente_fornecedor c ON f.cliente_fornecedor_id = c.id WHERE f.id in (" + ids + ")";
                                console.log(query);
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                    if (!data.err) {
                                        registros = data.data;
                                        cnab = { empresa, registros };
                                        console.log(sequencial);
                                        conteudo = remessa_CNAB_240(cnab);
                                        console.log(conteudo);

                                        arquivo = '000' + leftPad(conta, 10) + "_CN20180301" + leftPad(sequencia_hoje, 3) + ".rem";
                                        g$.geraArquivo("geraArquivo | HRS | " + arquivo + " | " + conteudo + " | baixar");


                                    }
                                });
                            }
                        });
                    }

                });
            }

        });
    }

    g$.imprimeSenhaSaude = function (params, isTela) {
        var params = g$.alterSargentos(params), 
            senha_id = params[1].trim(),
            cond = params[2],
            idFuncao = params[0].split("¦")[1];

        valida = (!cond) ? true : g$.validaCondicao(cond);
        if (valida == false) {
            console.log("Não executou porque" + cond + " é falso");
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        }; 

        $http.post("http://localhost:8001/imprimeSenha/" + senha_id).success(function (data) {
            console.log(data);
            return g$.vfyFuncaoDepois(idFuncao, isTela);
        });

    }

});