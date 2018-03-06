app.controller("integracaoFacebook", function ($scope, $http, $rootScope) {


    g$.integraAlbumFB = function (params) {
        var query = "SELECT fb_token, fb_pageID FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3"
        $http.get("/get/" + query).then(function (data) {
            data = data.data
            $http.get("/integraAlbumFB/" + data.data[0].fb_pageID + "/" + data.data[0].fb_token).then(function (data) {
                data = JSON.parse(data.data);
                data.data.forEach(function (v, i) {
                    var query = "insert ignore into " + $rootScope.user.banco + ".fb_albuns (album,album_id) values ('" + v.name + "'," + v.id + ");";
                    $http.get("/get/" + query);
                })
            })
        })
    }
    g$.criarAlbumFB = function (params) {
        var params = g$.alterSargentos(params),
            nome = params[1],
            desc = params[2],
            query = "SELECT fb_token, fb_pageID FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3";
        $http.get("/get/" + query).then(function (data) {
            data = data.data
            $http.get("/newAlbumFB/" + data.data[0].fb_pageID + "/" + data.data[0].fb_token + "/" + nome + "/" + desc).then(function (data) {
                data = JSON.parse(data.data);
                var query = "INSERT INTO " + $rootScope.user.banco + ".fb_albuns (album,album_id) values ('" + nome + "'," + data.id + ");";
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
        $http.get("/get/" + query).then(function (data) {
            data = data.data
            $http.get("/newAlbumFB/" + data.data[0].fb_token + "/" + data.data[0].fb_pageID + "/" + alb + "/" + urls + "/" + desc).then(function (data) {
                data = JSON.parse(data.data);
                var query = "INSERT INTO " + $rootScope.user.banco + ".fb_albuns (album,album_id) values ('" + nome + "'," + data.id + ");";
            })
        })
    }
    g$.integraFotosFB = function (params) {
        var query = "SELECT fb_token FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3", count = 0;
        $http.get("/get/" + query).then(function (data) {
            data = data.data
            token = data.data[0].fb_token;
            var query = "SELECT album_id FROM " + $rootScope.user.banco + ".fb_albuns";
            $http.get("/get/" + query).then(function (data) {
                data = data.data.data
                data.forEach(function (v, i) {
                    var alb = v.album_id
                    $http.get("/integraFotosFB/" + v.album_id + "/" + token).then(function (data) {
                        data = JSON.parse(data.data);
                        data.data.forEach(function (v, i) {
                            if (v.id) {
                                var query = "INSERT IGNORE INTO " + $rootScope.user.banco + ".fb_imagens (descricao,album_id,imagem_id) values ('Foto " + v.id + "'," + alb + "," + v.id + ");";
                                $http.get("/get/" + query).then(function (data) {
                                    if (data.data.data.insertId > 0) {
                                        count = count + 1
                                    }
                                })
                            }
                        })
                    })
                })
                g$.alerta("Alerta!","Fotos Sincronizadas com Sucesso!");
            })
        })
    }
    g$.selecionarProdutosFB = function(params){
        var params = g$.alterSargentos(params),
            template = params[1].trim()
        var produtos = g$.tblProdutosFB_array
        g$.prepararFotoFB(produtos,template);
    }
    g$.prepararFotoFB = function(produtos,template){
        if(produtos[0]){
            g$.gerarTemplateFB(produtos[0],template);
        }else{

        }
    }
    g$.gerarTemplateFB = function (produto,template) {
        var prodID = produto.e_19478,
            query = "SELECT * FROM " + $rootScope.user.banco + ".produto where id = " + prodID
        $http.get("/get/" + query).then(function (data) {
            var prod = data.data.data[0],
                fotoX = parseInt($("[data-id=13569]")[0].value),
                fotoY = parseInt($("[data-id=13571]")[0].value),
                textoX = parseInt($("[data-id=13553]")[0].value),
                textoY = parseInt($("[data-id=13555]")[0].value),
                loteX = parseInt($("[data-id=13559]")[0].value),
                loteY = parseInt($("[data-id=13561]")[0].value),
                fotoAltura = parseInt($("[data-id=13847]")[0].value),
                fotoLargura = parseInt($("[data-id=13844]")[0].value),
                textoValue = $("[data-id=13549]")[0].value,
                canvas = document.createElement("canvas");
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
                $http.post("http://54.233.79.112/base64/", {img:dataUrl},{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}},
                ).then(function(response){
                    var k = response;

                });
            });
            var query2 = "select nomeArquivo from " + $rootScope.user.banco + ".fb_template where id = " + template;
            $http.get("/get/" + query2).then(function(data){
                img_in1.src = 'http://dysweb.dys.com.br/'+ $rootScope.user.banco +'/'+ data.data.data[0].nomeArquivo;
            });
        });
    }
    
    g$.integraComentarioFB = function (params) {
        var query = "SELECT fb_token FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3", count = 0;
        $http.get("/get/" + query).then(function (data) {
            data = data.data
            token = data.data[0].fb_token;
            var query = "SELECT imagem_id FROM " + $rootScope.user.banco + ".fb_imagens";
            $http.get("/get/" + query).then(function (data) {
                data = data.data.data
                data.forEach(function (v, i) {
                    var img = v.imagem_id
                    $http.get("/integraComentarioFB/" + v.imagem_id + "/" + token).then(function (data) {
                        data = JSON.parse(data.data);
                        if (data.data) {
                            data.data.forEach(function (v, i) {
                                if (v.id) {
                                    var query = "INSERT IGNORE INTO " + $rootScope.user.banco + ".fb_comentarios (comentario,foto_id,comentario_id,usuario_id,verificado,usuario) values ('" + v.message + "'," + img + ",'" + v.id + "'," + v.from.id + ",0,'" + v.from.name + "');";
                                    $http.get("/get/" + query);
                                }
                            })
                        }
                    })
                })
                g$.alerta("Alerta!","Comentarios Sincronizados com Sucesso!");
            })
        })
    }
    g$.postarFotoFB = function(params){
        var params = g$.alterSargentos(params),
            alb = params[1].trim(),
            img = params[2].trim(),
            desc = params[3].trim(),
            prod = params[4].trim(),
            timeLine = params[5],
            query = "SELECT fb_token, fb_pageID FROM " + $rootScope.user.banco + ".integracao where integracao_tipo_id = 3";
        $http.get("/get/" + query).then(function(data){
            var token = data.data.data[0].fb_token,
                pag = data.data.data[0].fb_pageID
            if($("[data-id="+ timeLine +"]")[0].checked == true){
                if(img){
                    $http.post("/postarTimeFB/" + pag + "/" + img + "/" + desc + "/" + token).then(function(data){
                        g$.alerta("Alerta!","Postagem Efetuada com Sucesso!");
                    })
                }
                else{
                    $http.post("/postarTimeFB/" + pag + "/N/" + desc + "/" + token).then(function(data){
                        g$.alerta("Alerta!","Postagem Efetuada com Sucesso!");                        
                    })
                }
            }
            else{
                $http.get("/postarFotoFB/"+alb + "/" + img + "/" + desc + "/" + token).then(function(data){
                    data = JSON.parse(data.data);
                    var query = "insert into " + $rootScope.user.banco + ".fb_imagens (descricao,album_id,imagem_id,produto_id) values ('"+ desc +"',"+ alb +","+ data.id +","+ prod +")";
                    $http.get("/get/" + query).then(function(data){
                        g$.alerta("Alerta!","Foto Adicionada com Sucesso!");
                    })
                })
            }
        })

    }
});
