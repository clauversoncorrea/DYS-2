app.controller("integracaoFacebook", function ($scope, $http, $rootScope) {


    g$.integraAlbumFB = function (params) {
        g$.alerta("Sucesso!", "Os Álbuns estão sendo Sincronizados!");
        var query = "SELECT fb_token, fb_pageID FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3"
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            data = data.data
            $http.get("/integraAlbumFB/" + data.data[0].fb_pageID + "/" + data.data[0].fb_token).then(function (data) {
                data = JSON.parse(data.data);
                var ultimo = data.data.length
                data.data.forEach(function (v, i) {
                    var query = "insert ignore into " + $rootScope.user.banco + ".fb_albuns (album,album_id) values ('" + v.name + "'," + v.id + ");";
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        if(ultimo == i + 1){
                            g$.atualizarTabela("atualizarTabela | 13181");
                            g$.alerta("Sucesso!", "Álbuns Sincronizados com Sucesso!");
                        }
                    });
                })
            })
        })
    }
    g$.criarAlbumFB = function (params) {
        var params = g$.alterSargentos(params),
            nome = params[1],
            desc = params[2],
            query = "SELECT fb_token, fb_pageID FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3";
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            data = data.data
            $http.get("/newAlbumFB/" + data.data[0].fb_pageID + "/" + data.data[0].fb_token + "/" + nome + "/" + desc).then(function (data) {
                data = JSON.parse(data.data);
                var query = "INSERT INTO " + $rootScope.user.banco + ".fb_albuns (album,album_id) values ('" + nome + "'," + data.id + ");";
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    g$.atualizarTabela("atualizarTabela | 13181");
                    g$.closeModal("closeModal | novoalbumfb");
                });
            })
        })
    }
    
    g$.subirFotoFB = function (params) {
        var params = g$.alterSargentos(params),
            nome = params[1],
            desc = params[2],
            alb = params[3],
            urls = params[4],
            query = "SELECT fb_token, fb_pageID FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3";
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            data = data.data
            $http.get("/newAlbumFB/" + data.data[0].fb_token + "/" + data.data[0].fb_pageID + "/" + alb + "/" + urls + "/" + desc).then(function (data) {
                data = JSON.parse(data.data);
                var query = "INSERT INTO " + $rootScope.user.banco + ".fb_albuns (album,album_id) values ('" + nome + "'," + data.id + ");";
            })
        })
    }
    g$.integraFotosFB = function (params) {
        var query = "SELECT fb_token FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3", count = 0;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            data = data.data
            token = data.data[0].fb_token;
            var query = "SELECT album_id FROM " + $rootScope.user.banco + ".fb_albuns";
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                data = data.data
                var ultimo = data.length
                data.forEach(function (v, i) {
                    var alb = v.album_id
                    $http.get("/integraFotosFB/" + v.album_id + "/" + token).then(function (data) {
                        data = JSON.parse(data.data);
                        data.data.forEach(function (v, i) {
                            if (v.id) {
                                var query = "INSERT IGNORE INTO " + $rootScope.user.banco + ".fb_imagens (descricao,album_id,imagem_id) values ('Foto " + v.id + "'," + alb + "," + v.id + ");";
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                    if (data.data.insertId > 0) {
                                        count = count + 1
                                    }
                                })
                            }
                        })
                    })
                    if(ultimo == i + 1){
                        g$.alerta("Alerta!", "Fotos Sincronizadas com Sucesso!");
                    }
                })
            })
        })
    }
    g$.selecionarProdutosFB = function (params) {
        var params = g$.alterSargentos(params),
            template = params[1].trim()
        var produtos = g$.tblProdutosFB_array
        $("[data-id=19539]")[0].innerHTML = '<div><p>Progresso <span id="concluidoFB">0</span><span id="totalFB"></span></p>' +
            '<div class="progress"><div id="progressBarFB" class="determinate" style="width:0%;"></div></div><p id="concluiFB" style="text-align:center;color:green;display:none;">Concluído!</p></div>'
        $("#totalFB")[0].textContent = "/" + produtos.length;
        var porcent = 100 / produtos.length
        g$.prepararFotoFB(produtos, template, porcent);
    }
    g$.prepararFotoFB = function (produtos, template, porcent) {
        if (produtos[0]) {
            g$.gerarTemplateFB(produtos[0], template, produtos, porcent);
        } else {
            $("#progressBarFB")[0].style.width = "100%";
            $("#concluiFB")[0].style.display = "block";
        }
    }
    g$.gerarTemplateFB = function (produto, template, prodArray, porcent) {
        var prodID = produto.e_19478,
            query = "SELECT * FROM " + $rootScope.user.banco + ".produto where id = " + prodID
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var prod = data.data[0],
                fotoX = parseInt($("[data-id=13569]")[0].value),
                fotoY = parseInt($("[data-id=13571]")[0].value),
                textoX = parseInt($("[data-id=13553]")[0].value),
                textoY = parseInt($("[data-id=13555]")[0].value),
                loteX = parseInt($("[data-id=13559]")[0].value),
                loteY = parseInt($("[data-id=13561]")[0].value),
                fotoAltura = parseInt($("[data-id=13847]")[0].value),
                fotoLargura = parseInt($("[data-id=13844]")[0].value),
                textoValue = prod.produto,
                canvas = document.createElement("canvas"),
                descricaoFacebook = prod.descricao_facebook
            canvas.width = 600;
            canvas.height = 740;
            var context = canvas.getContext("2d"),
                img_in1 = document.createElement("img"),
                img_in2 = document.createElement("img"),
                img_out = $("#cnvs")[0];
            img_in1.addEventListener("load", function () {
                context.drawImage(img_in1, 0, 0, 600, 740);
                img_in2.src = 'http://dysweb.dys.com.br/' + $rootScope.user.banco + '/' + prod.imagem.trim()
            });
            img_in2.addEventListener("load", function () {
                context.drawImage(img_in2, fotoX, fotoY, fotoLargura, fotoAltura);
                function arrumaTexto(texto) {
                    var k = texto.split(" "), linha = "", count = 0, contador = 0;
                    k.forEach(function (v, i) {
                        if (count < 7) {
                            count++
                            linha = linha + " " + v
                            if (i == k.length - 1) {
                                context.fillText(linha, textoX, textoY + (contador * 20));
                            }
                        } else {
                            count = 0;
                            context.fillText(linha, textoX, textoY + (contador * 20));
                            contador++
                            linha = v;
                            if (i == k.length - 1) {
                                context.fillText(linha, textoX, textoY + (contador * 20));
                            }
                        }
                    })
                }
                context.font = "20px Arial";
                context.fillStyle = "#035a63";
                arrumaTexto(textoValue);
                context.font = "italic 15px Times-New-Roman";
                context.fillText("Lote", 40 + loteX, loteY);
                context.font = "italic 30px Times-New-Roman";
                context.fillText(prod.id, 40 + loteX, loteY + 30);
                context.font = "italic 15px Times-New-Roman";
                context.fillText("Estoque", 200 + loteX, loteY);
                context.font = "italic 30px Times-New-Roman";
                context.fillText("20", 200 + loteX, loteY + 30);
                if (1 < 0) {
                    context.fillStyle = "#01bcb4";
                    context.fillText("De", 350 + loteX, loteY);
                    context.fillText(prod.id, 350 + loteX, loteY + 30);
                }
                context.fillStyle = "#e8807d    ";
                context.font = "italic 15px Times-New-Roman";
                context.fillText("Por", 450 + loteX, loteY);
                context.font = "italic bold 30px Times-New-Roman";
                context.fillText("R$ " + parseFloat(prod.valor).toFixed(2).replace(".", ","), 450 + loteX, loteY + 30);
                var dataUrl = canvas.toDataURL("image/png");
                $http.post("http://54.233.115.242/base64/", { img: dataUrl }, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                },
                ).then(function (data) {
                    console.log(data)
                    if (data.data.status == 1) {
                        var query = "SELECT fb_token, fb_pageID FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3";
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                            var token = data.data[0].fb_token,
                                pag = data.data[0].fb_pageID
                            $http.get("/postarFotoFB/" + $("[data-id=14908]")[0].querySelector("input").dataset.value + "/http:½½54.233.115.242½base64½" + data.data.replace("/", "½") + "/" + descricaoFacebook + "/" + token).then(function (data) {
                                data = JSON.parse(data.data);
                                var query = "insert into " + $rootScope.user.banco + ".fb_imagens (descricao,album_id,imagem_id,produto_id) values ('" + descricaoFacebook + "'," + $("[data-id=14908]")[0].querySelector("input").dataset.value + "," + data.id + "," + prodID + ")";
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                    $("#progressBarFB")[0].style.width = parseFloat($("#progressBarFB")[0].style.width.replace("%", "")) + parseFloat(porcent) + '%'
                                    $("#concluidoFB")[0].textContent = parseInt($("#concluidoFB")[0].textContent) + 1;
                                    prodArray.splice(0, 1);
                                    g$.prepararFotoFB(prodArray, template, porcent);
                                })
                            })
                        })
                    } else {

                    }
                });
            });
            var query2 = "select nomeArquivo from " + $rootScope.user.banco + ".fb_template where id = " + template;
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query2.trim())).success(function (data) {
                img_in1.src = 'http://dysweb.dys.com.br/' + $rootScope.user.banco + '/' + data.data[0].nomeArquivo;
            });
        });
    }

    g$.integraComentarioFB = function (params) {
        loadzinTela = angular.element($.template[0]["loadzinTela"])[0];
        document.body.append(loadzinTela);
        var query = "SELECT fb_token FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3", count = 0;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            data = data.data
            token = data.data[0].fb_token;
            var query = "SELECT imagem_id FROM " + $rootScope.user.banco + ".fb_imagens";
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                data = data.data
                var ultimo = data.length, fim = 0;
                data.forEach(function (v, i) {
                    var img = v.imagem_id
                    $http.get("/integraComentarioFB/" + v.imagem_id + "/" + token).then(function (data) {
                        data = JSON.parse(data.data);
                        if (data.data) {
                            data.data.forEach(function (v, i) {
                                if (v.id) {
                                    var query = "INSERT IGNORE INTO " + $rootScope.user.banco + ".fb_comentarios (comentario,foto_id,comentario_id,usuario_id,verificado,usuario,created) values ('" + v.message + "'," + img + ",'" + v.id + "'," + v.from.id + ",0,'" + v.from.name + "','" + v.created_time + "');";
                                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                        if (fim == 1) {
                                            var queryData = "update " + $rootScope.user.banco + ".integracao set fb_coments = now() where integracao_tipo_id = 3"
                                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryData.trim())).success(function (data) {
                                                $("#loadzinTela")[0].outerHTML = "";
                                                g$.atualizarBloco("atualizarBloco ¦ 539 | 13765");
                                                g$.carregaQuery("carregaQuery | SELECT DATE_FORMAT(fb_coments,'‰d-‰m-‰Y ‰T') FROM »user.banco».integracao where integracao_tipo_id = 3 | 13756");
                                                g$.carregaQuery("carregaQuery | SELECT count(id) from »user.banco».fb_comentarios | 13758");
                                                g$.alerta("Alerta!", "Comentarios Sincronizados com Sucesso!");
                                            })
                                        }
                                    });
                                }
                            })
                        }
                    })
                    if (ultimo == i + 1) {
                        fim = 1;
                    }
                })
            })
        })
    }
    g$.postarFotoFB = function (params) {
        var params = g$.alterSargentos(params),
            alb = params[1].trim(),
            img = params[2].trim(),
            desc = params[3].trim(),
            prod = params[4].trim(),
            timeLine = params[5],
            query = "SELECT fb_token, fb_pageID FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3";
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var token = data.data[0].fb_token,
                pag = data.data[0].fb_pageID
            if ($("[data-id=" + timeLine + "]")[0].checked == true) {
                if (img) {
                    $http.post("/postarTimeFB/" + pag + "/" + img + "/" + desc + "/" + token).then(function (data) {
                        g$.alerta("Alerta!", "Postagem Efetuada com Sucesso!");
                    })
                }
                else {
                    $http.post("/postarTimeFB/" + pag + "/N/" + desc + "/" + token).then(function (data) {
                        g$.alerta("Alerta!", "Postagem Efetuada com Sucesso!");
                    })
                }
            }
            else {
                $http.get("/postarFotoFB/" + alb + "/" + img + "/" + desc + "/" + token).then(function (data) {
                    data = JSON.parse(data.data);
                    var query = "insert into " + $rootScope.user.banco + ".fb_imagens (descricao,album_id,imagem_id,produto_id) values ('" + desc + "'," + alb + "," + data.id + "," + prod + ")";
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        g$.alerta("Alerta!", "Foto Adicionada com Sucesso!");
                    })
                })
            }
        })
    }

    g$.enviarComentarioCadastro = function (params) {
        g$.alerta("Aguarde!", "O Link será Enviado para o Comentário!");
        var idComent = event.target.parentElement.parentElement.firstElementChild.firstElementChild.textContent,
            query = "SELECT fb_token, comentario_id FROM " + $rootScope.user.banco + ".integracao inte,gui.fb_comentarios co where integracao_tipo_id = 3 and co.id = " + idComent;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var token = data.data[0].fb_token
            comentario = data.data[0].comentario_id;
            $http.post("https://graph.facebook.com/v2.10/" + comentario + "/comments?access_token=" + token + "&message=Para se cadastrar na Outlet, acesse esse link e finalize sua compra! http://dysweb.dys.com.br/sonhoadois").then(function (data) {
                var query = "update " + $rootScope.user.banco + ".fb_comentarios set cliente_fornecedor_enviado = 1 where id = " + idComent;
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                    if (!data.error) {
                        g$.atualizarBloco("atualizarBloco ¦ 5963 | 13765");
                        g$.alerta("Sucesso!", "Link Enviado para o Comentário!");
                    }
                })
            })
        })
    }

    g$.geraPedidoFacebook = function (params) {
        var params = g$.alterSargentos(params),
            idComentario = params[1],
            empresa = params[2],
            produto = params[3],
            quantidade = params[4];
        if (empresa || empresa != "" || empresa != "null") {
            var query = "select * from " + $rootScope.user.banco + ".fb_comentarios where id = " + idComentario;
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                var comentario = data.data[0],
                    query = "select id from node.usuario where id_face ='" + comentario.usuario_id + "'";
                if (comentario.pedido_id != null) {
                    return g$.alerta("Erro!", "Esse comentário já possui um Pedido Cadastrado!");
                } else {
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        if (data.data.length == 0) {
                            var queryInsertNode = "insert into node.usuario (nome,banco,foto,id_face,projeto_id,customiza) values ('" + comentario.usuario + "','" + $rootScope.user.banco + "','https:½½graph.facebook.com½v2.10½" + comentario.usuario_id + "½picture','" + comentario.usuario_id + "'," + $rootScope.user.projeto_id + ",0)";
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryInsertNode.trim())).success(function (data) {
                                if (data.data.insertId) {
                                    var queryInsertCliente = "insert into " + $rootScope.user.banco + ".cliente_fornecedor (cliente,fantasia,razao,facebook_id,node_usuario_id) values (1,'" + comentario.usuario + "','" + comentario.usuario + "','" + comentario.usuario_id + "'," + data.data.insertId + ")";
                                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryInsertCliente.trim())).success(function (data) {
                                        if (data.data.insertId) {
                                            var queryInsertPedido = "INSERT INTO " + $rootScope.user.banco + ".pedido (cliente_fornecedor_id,empresa_id) values (" + data.data.insertId + "," + empresa + ")";
                                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryInsertPedido.trim())).success(function (data) {
                                                if (data.data.insertId) {
                                                    var newPedido = data.data.insertId
                                                    var queryInsertProduto = "INSERT INTO " + $rootScope.user.banco + ".pedido_produto (pedido_id,produto_id,quantidade) values (" + data.data.insertId + "," + produto + "," + quantidade + ")";
                                                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryInsertProduto.trim())).success(function (data) {
                                                        if (data.data.insertId) {
                                                            var query = "update " + $rootScope.user.banco + ".fb_comentarios set pedido_id = " + newPedido + " where id = " + comentario.id;
                                                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                                                g$.atualizarBloco("atualizarBloco ¦ 5963 | 13765");
                                                                g$.alerta("Sucesso!", "Pedido Criado com Sucesso!");
                                                                g$.closeModal("closeModal | comentarioxpedido");
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            var query = "select id from " + $rootScope.user.banco + ".cliente_fornecedor where facebook_id = " + comentario.usuario_id;
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                var queryInsertPedido = "INSERT INTO " + $rootScope.user.banco + ".pedido (cliente_fornecedor_id,empresa_id) values (" + data.data[0].id + "," + empresa + ")";
                                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryInsertPedido.trim())).success(function (data) {
                                    if (data.data.insertId) {
                                        var newPedido = data.data.insertId
                                        var queryInsertProduto = "INSERT INTO " + $rootScope.user.banco + ".pedido_produto (pedido_id,produto_id,quantidade) values (" + data.data.insertId + "," + produto + "," + quantidade + ")";
                                        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryInsertProduto.trim())).success(function (data) {
                                            if (data.data.insertId) {
                                                var query = "update " + $rootScope.user.banco + ".fb_comentarios set pedido_id = " + newPedido + " where id = " + comentario.id;
                                                $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                                                    g$.atualizarBloco("atualizarBloco ¦ 5963 | 13765");
                                                    g$.alerta("Sucesso!", "Pedido Criado com Sucesso!");
                                                    g$.closeModal("closeModal | comentarioxpedido");
                                                })
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    })
                }
            })
        }
    }

    g$.verificaComentário = function (params) {
        var params = g$.alterSargentos(params),
            idComentario = params[1],
            query = "select * from " + $rootScope.user.banco + ".fb_comentarios where id = " + idComentario;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            var coment = data.data[0];
            if (coment.pedido_id) {
                var temp = "<div><div><img src='https://graph.facebook.com/v2.10/" + coment.usuario_id + "/picture'> <label style='color:black;margin-left:20px;'>" + coment.usuario + "</label><label style='color:black;margin-left:20px;'>" + coment.comentario + "</label></div><p style='color:red;'>Esse Comentário já possui um Pedido Número : " + data.data[0].pedido_id + "</p></div>"
                $("[data-id=24104]")[0].innerHTML = temp;
            } else {
                var temp = "<div><img src='https://graph.facebook.com/v2.10/" + coment.usuario_id + "/picture'> <label style='color:black;margin-left:20px;'>" + coment.usuario + "</label><label style='color:black;margin-left:20px;'>" + coment.comentario + "</label></div>"
                $("[data-id=24104]")[0].innerHTML = temp;
            }
        })
    }

    g$.verificaProdutoIntegrações = function(params){
        var query = "select integracao,tipo from "+ $rootScope.user.banco +".integracao inte left join "+ $rootScope.user.banco +".integracao_tipo itp on itp.id = integracao_tipo_id where inte.ativo = 1;"
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if(data.data.length > 0){
                g$.openModal("openModal | Selecione a Integração | selInt | 826");
            }
        })
    }
    g$.showIntegracoes = function(params){
        var query = "select integracao,tipo from "+ $rootScope.user.banco +".integracao inte left join "+ $rootScope.user.banco +".integracao_tipo itp on itp.id = integracao_tipo_id where inte.ativo = 1;"
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if(data.data.length > 0){
                var inte = data.data;
                $("[data-id=25676]")[0].innerHTML = "";
                $("[data-id=25676]")[0].innerHTML = '<div id="colInt"></div>';
                inte.forEach(function(v,i){
                    if(v.tipo == "magento"){
                        $("#colInt")[0].innerHTML += '<div style="display: inline-block;font-size: 15px;text-align: center;margin: 20px;padding: 10px;border-radius: 10px;border: 1px solid black;"><div><img src="http://dysweb.dys.com.br/dys/'+ v.tipo +'.png"></img><p style="margin: 10px 0px;font-weight: bold;">'+ v.integracao +'</p></div><div><input type="checkbox" checked></input></div></div>'
                    }
                    else if(v.tipo == "rakuten"){
                        $("#colInt")[0].innerHTML += '<div style="display: inline-block;font-size: 15px;text-align: center;margin: 20px;padding: 10px;border-radius: 10px;border: 1px solid black;"><div><img style="width:100px;" src="http://dys.net.br/img/'+ v.tipo +'.png"></img><p style="margin: 10px 0px;font-weight: bold;">'+ v.integracao +'</p></div><div><input id="rakuten" data-integracao = "'+ v.tipo +'" type="checkbox" checked></input></div></div>'
                    }
                    else if(v.tipo == "tray"){
                        $("#colInt")[0].innerHTML += '<div style="display: inline-block;font-size: 15px;text-align: center;margin: 20px;padding: 10px;border-radius: 10px;border: 1px solid black;"><div><img src="http://dysweb.dys.com.br/dys/'+ v.tipo +'.png"></img><p style="margin: 10px 0px;font-weight: bold;">'+ v.integracao +'</p></div><div><input type="checkbox" checked></input></div></div>'
                    }
                })
            }
        })
    }

    g$.geraLinkFace = function (params) {
        var query = 'select cf.facebook_id from ' + $rootScope.user.banco + '.cliente_fornecedor cf,' + $rootScope.user.banco + '.pedido pd where cf.id = pd.cliente_fornecedor_id and pd.id = ' + $("[data-id=1694]")[0].value;
        $http.get("/get/" + query).then(function (response) {
            if (!response.data.err) {
                $("[data-id=47987]")[0].value = "http://outletscrapsonhoadois.com.br/?access%3A" + response.data.data[0].facebook_id;
                // $("[data-id=47990]")[0].innerHTML = '<a href=>Acessar Facebook do Cliente!</a>';
                window.open('http://facebook.com/' + response.data.data[0].facebook_id, "_blank");
            }
        })
    }

    g$.enviarPedidosFacebook = function (params) {
        var params = g$.alterSargentos(params),
            pedidos = params[1];
        // pedidos = pedidos.trim().split(',');
        var query = "SELECT fb_token FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3";
        $http.get("/get/" + query).then(function (data) {
            if (!data.data.err) {
                var token = data.data.data[0].fb_token
                    // ultimo = pedidos.length;
                // for (var i = 0; i < pedidos.length; i++) {
                    // if (pedidos[i] != 'undefined') {
                        var query = "SELECT cf.email,cf.razao from " + $rootScope.user.banco + ".pedido pd,"+ $rootScope.user.banco +".cliente_fornecedor cf where cf.id = pd.cliente_fornecedor_id and pd.id = " + pedidos;
                        $http.post("/jsonQuery/", g$.trataQuery(query)).then(function(response){
                            if(!response.data.err){
                                var peds = response.data.data[0];
                                var query = "INSERT INTO node.email (remetente,destinatario,assunto,corpo,enviada,banco,motivo,nomeDest,nomeRem) "+
                                "VALUES ('contato@outletsonhoadois.com.br','"+ peds.email +"','Seu Pedido do Outlet Scrap Sonho a Dois','<div><div style=\"text-align:center;\"><img style=\"width:300px;\"  src=\"http:½½dysweb.dys.com.br½sonhoadois½logoDys.png\"><½img><½div><div style=\"text-align:center;height:100px;line-height:100px;margin-bottom:30px;\"><p style=\"font-size:40px;\"><b>Acesse o seu pedido do Outlet Scrap Sonho a Dois no link abaixo.<½b><½p><½div><div style=\"text-align:center;\"><a style=\"font-size:30px;\" href=\"http:½½outletscrapsonhoadois.com.br\">Clique Aqui!<½a><½div><½div>',0,'"+ $rootScope.user.banco +"','Pedido Facebook','"+ peds.razao +"','"+ $rootScope.user.banco +"')";
                                $http.post("/jsonQuery/", g$.trataQuery(query)).then(function(response){
                                    if(!response.data.err){
                                        var query = 'select comentario_id from ' + $rootScope.user.banco + ".fb_comentarios where pedido_id = " + pedidos;
                                        $http.post("/jsonQuery/", g$.trataQuery(query)).then(function (response) {
                                            if (!response.data.err) {
                                                var coment  = response.data.data[0];
                                                var query = 'UPDATE ' + $rootScope.user.banco + '.pedido set status_id = 2 where id = ' + pedidos;
                                                $http.post("/jsonQuery/", g$.trataQuery(query)).then(function(response){
                                                    if(!response.data.err){
                                                        $http.post("https://graph.facebook.com/v2.10/" + coment.comentario_id + "/comments?access_token=" + token + "&message=Para acessar seu pedido do Outlet, clique no link e finalize sua compra! http://outletscrapsonhoadois.com.br/").then(function (data) {
                                                            g$.alerta("Sucesso!", "Deu Tudo Certo!");
                                                        },function(err){
                                                            g$.alerta("Erro!", "Erro ao Comentar no Face, Levou Ban :(");                                                                                                                
                                                        });
                                                    }else{
                                                        g$.alerta("Erro!", "Deu Erro :( Código do Erro: 5");                                                        
                                                    }
                                                })
                                            }else{
                                                g$.alerta("Erro!", "Deu Erro :( Código do Erro: 4");                                                        
                                            };
                                        });
                                    }else{
                                        g$.alerta("Erro!", "Deu Erro :( Código do Erro: 3");                                                        
                                    }
                                })
                            }else{
                                g$.alerta("Sucesso!", "Deu Erro :( Código do Erro: 2");                                                        
                            }
                        })
                    // };
                // };
            }else{
                g$.alerta("Sucesso!", "Deu Erro :( Código do Erro: 1");                                                        
            };
        });
    }

    g$["salvaIntegração"] = function (params) {
        var tela = g$.memotela;
        if ($("#colInt input[type=checkbox]").length > 0) {
            loadzinTela = angular.element($.template[0]["loadzinTela"])[0];
            document.body.append(loadzinTela);
            $("#loadzinTela")[0].id = "loadzinTelaIntegracao";
            var inputs = $("#colInt input[type=checkbox]");
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].checked) {
                    if (tela == 'produto') {
                        var prodID = $("[data-id=2689]")[0].value;
                        var query = 'SELECT integracao_produto from ' + $rootScope.user.banco + '.produto where id = ' + prodID;
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (response) {
                            if (!response.data.err) {
                                if (response.data.length) {
                                    if (response.data[0].integracao_produto) {
                                        $http.get('https://integracao.dys.net.br/editaProduto' + inputs[i - 1].dataset.integracao + '/' + prodID + '/' + $rootScope.user.banco + '/' + inputs[i - 1].id + "/" + JSON.parse(localStorage.user).projeto_id).then(function (response) {
                                            if (response.data == 'OK') {
                                                $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                                g$.alerta("Sucesso!", "Produto Integrado com Sucesso!");
                                            } else {
                                                $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                                g$.alerta("Erro!", "Houve um Erro ao integrar seu Produto, entre em contato com o Suporte");
                                            }
                                        })
                                    } else {
                                        $http.get('https://integracao.dys.net.br/criaProduto' + inputs[i - 1].dataset.integracao + '/' + prodID + '/' + $rootScope.user.banco + '/' + inputs[i - 1].id + "/" + JSON.parse(localStorage.user).projeto_id).then(function (response) {
                                            if (response.data == 'OK') {
                                                $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                                g$.alerta("Sucesso!", "Produto Integrado com Sucesso!");
                                            } else {
                                                $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                                g$.alerta("Erro!", "Houve um Erro ao integrar seu Produto, entre em contato com o Suporte");
                                            }
                                        })
                                    }
                                } else {
                                    $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                }
                            } else {
                                $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                g$.alerta("Erro!", "ERRO: 2 - Por Favor Entre em contato com o Suporte!");
                            }
                        })
                    }
                    else if (tela == 'categoria') {
                        var catID = g$.memo15;
                        var query = 'SELECT integracao_id from ' + $rootScope.user.banco + '.categoria where id = ' + catID;
                        $http.get("/get/" + query).then(function (response) {
                            if (!response.data.err) {
                                if (response.data.data.length) {
                                    if (response.data.data[0].integracao_id) {
                                        $http.get('http://54.233.79.112:8088/criaCategoria' + inputs[i - 1].dataset.integracao + '/' + catID + '/' + $rootScope.user.banco + '/' + inputs[i - 1].id).then(function (response) {
                                            if (response.data == 'OK') {
                                                $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                                g$.alerta("Sucesso!", "Categoria Integrada com Sucesso!");
                                            } else {
                                                $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                                g$.alerta("Erro!", "Houve um Erro ao integrar sua Categoria, entre em contato com o Suporte");
                                            }
                                        })
                                    } else {
                                        $http.get('http://54.233.79.112:8088/criaCategoria' + inputs[i - 1].dataset.integracao + '/' + catID + '/' + $rootScope.user.banco + '/' + inputs[i - 1].id).then(function (response) {
                                            if (response.data == 'OK') {
                                                $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                                g$.alerta("Sucesso!", "Categoria Integrada com Sucesso!");
                                            } else {
                                                $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                                g$.alerta("Erro!", "Houve um Erro ao integrar sua Categoria, entre em contato com o Suporte");
                                            }
                                        })
                                    }
                                } else {
                                    $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                }
                            } else {
                                $("#loadzinTelaIntegracao")[0].outerHTML = '';
                                g$.alerta("Erro!", "ERRO: 2 - Por Favor Entre em contato com o Suporte!");
                            }
                        })
                    }

                } else {
                    $("#loadzinTelaIntegracao")[0].outerHTML = '';
                }
            }

        }
    }

});
