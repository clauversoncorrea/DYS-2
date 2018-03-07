app2.controller("autenticacao", function ($scope, $http, $rootScope) {

    $("#email")[0].addEventListener("keydown", inputKeyDown, false);
    $("#senha")[0].addEventListener("keydown", inputKeyDown, false);

    function inputKeyDown() {
        if (event.keyCode == 13) {
            if (location.href.indexOf("SAUDE") > -1) $scope.autenticacaoSAUDE();
            else $scope.autenticacaoDYS();
        }
    }

    // SAUDE
    if (location.href.indexOf("SAUDE") > -1) {
        $("#senhaSaude")[0].addEventListener("keydown", inputKeyDownSAUDE, false);
        $("#confirmarSenha")[0].addEventListener("keydown", inputKeyDownSAUDE, false);
    }

    function inputKeyDownSAUDE() {
        if (event.keyCode == 13) $scope.cadastrarSenhaSAUDE();
    }


    // Se o usuario não fez logout, já inicia sozinho
    // if (localStorage.user && JSON.parse(localStorage.user) && JSON.parse(localStorage.user).logado) {
    //     if (JSON.parse(localStorage.user).customiza) location.href = location.href + "customizador/inicial.html";
    //     else location.href = location.href + "inicial.html";
    // }

    $scope.autenticacaoDYS = function () {
        var email = $("#email")[0],
            senha = $("#senha")[0],
            dir,
            query = "SELECT u.*, UPPER(p.projeto) projeto, COALESCE(p.nao_saas,0) nao_saas  FROM usuario u, projeto p WHERE u.projeto_id = p.id AND u.email = '" + email.value + "' AND u.senha = '" + senha.value + "'";
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (data.data.length) {
                $scope.user = data.data[0];
                if ($scope.user.bloqueado == 1) return Materialize.toast("Usuário Bloqueado, entrar em contato!", 4000, 'red darken-1');
                dir = ($scope.user.customiza == 1) ? "../customizador/" : "../";
                $scope.user = data.data[0];
                $http.post(URL + "/leArquivo/", { arquivo: $scope.user.projeto.toUpperCase() + "/inicial.html" }).success(function (data) {
                    // if (data != "" && $scope.user.customiza == 0) {
                    //     // Sistema do cliente
                    //     $scope.user.sysCli = true;
                    //     window.location = $scope.user.projeto.toUpperCase() + "/inicial.html?";
                    // }
                    // else 
                    window.location = dir + "inicial.html?";
                    $scope.user.logado = { id: $scope.user.id, projeto: $scope.user.projeto, projeto_id: $scope.user.projeto_id, banco: $scope.user.banco, nao_saas: $scope.user.nao_saas };
                    localStorage.user = JSON.stringify($scope.user);
                });
            }
            else {
                if ($("#toast-container")[0] && $("#toast-container")[0].children.length) return;
                else return Materialize.toast("Usuário ou Senha incorreto(s)!", 4000, 'red darken-1');
            }
        }).error(function (err, data) {
            console.log(err);
            console.log(data);
        });
    }

    $scope.autenticacaoSAUDE = function () {
        var email = $("#email")[0],
            senha = $("#senha")[0],
            dir,
            query = "SELECT * FROM saude.cliente_fornecedor cf LEFT JOIN saude.cns c ON c.node_usuario_id = cf.node_usuario_id WHERE (c.cns = '" + email.value + "' OR cf.cpf = '" + email.value + "');",
            query_existy = "SELECT c.cns, coalesce(cf.valido, 0) valido, UPPER(p.projeto) projeto, COALESCE(p.nao_saas, 0) nao_saas, u .* FROM node.usuario u LEFT JOIN node.projeto p ON p.id = u.projeto_id LEFT JOIN  saude.cliente_fornecedor cf ON cf.node_usuario_id = u.id LEFT JOIN saude.cns c ON c.node_usuario_id = u.id WHERE (c.cns = '" + email.value + "' OR cf.cpf = '" + email.value + "') AND COALESCE(u.senha,'" + senha.value + "') = '" + senha.value + "'";

        if (email.value.trim() == "") {
            if ($("#toast-container")[0] && $("#toast-container")[0].children.length) return;
            return Materialize.toast("Campo CNS ou CPF obrigatório", 4000, 'red darken-1');
        }

        // Verifica se tem o CNS ou CPF
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (data.data.length) {
                // Se existir alguem com cns ou cpf, verifica se os credidenciais estao certos
                $http.post(URL + "/jsonQuery/", g$.trataQuery(query_existy.trim())).success(function (data) {
                    if (data.data.length) {
                        $scope.user = data.data[0];
                        if ($scope.user.senha && $scope.user.senha != "") {
                            if ($scope.user.valido == 0) return Materialize.toast("Compareça a unidade para validar o seu cadastro!", 4000, 'red darken-1');
                            dir = ($scope.user.customiza == 1) ? "../customizador/" : "../";
                            $scope.user = data.data[0];
                            $http.post(URL + "/leArquivo/", { arquivo: $scope.user.projeto.toUpperCase() + "/inicial.html" }).success(function (data) {
                                if (data != "" && $scope.user.customiza == 0) {
                                    // Sistema do cliente
                                    $scope.user.sysCli = true;
                                    window.location = $scope.user.projeto.toUpperCase()  + "/inicial.html?";
                                }
                                else window.location = dir + "inicial.html?";
                                $scope.user.logado = { id: $scope.user.id, projeto: $scope.user.projeto, projeto_id: $scope.user.projeto_id, banco: $scope.user.banco, nao_saas: $scope.user.nao_saas };
                                localStorage.user = JSON.stringify($scope.user);
                            });
                        }
                        else {
                            $("#cadastrarSenha")[0].classList.remove("play-none");
                            $("#view")[0].classList.add("play-none");
                            $("#senhaSaude")[0].focus();
                            if ($("#toast-container")[0] && $("#toast-container")[0].children.length) return;
                            return Materialize.toast("Esse usuário não tem senha, cadastrar uma senha!!", 5000, 'red darken-1');
                        }
                    }
                    else {
                        if ($("#toast-container")[0] && $("#toast-container")[0].children.length) return;
                        else return Materialize.toast("Usuário ou Senha incorreto(s)!", 4000, 'red darken-1');
                    }
                });
            }
            else {
                $("#cadastrarPaciente")[0].classList.remove("play-none");
                $("#view")[0].classList.add("play-none");
                $("#cadastrarPaciente #cns")[0].focus();
            }
        }).error(function (err, data) {
            console.log(err);
            console.log(data);
        });
    }

    $scope.autenticacaoDYSIP = function () {
        var email = $("#email")[0],
            senha = $("#senha")[0],
            dir,
            query = "SELECT * FROM usuario WHERE email = '" + email.value + "' AND senha = '" + senha.value + "'",
            queryFornecedor;
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (data.data.length) {
                $scope.user = data.data[0];
                if ($scope.user.bloqueado == 1) return Materialize.toast("Usuário Bloqueado, entrar em contato!", 4000, 'red darken-1');
                dir = ($scope.user.customiza == 1) ? "../customizador/" : "../";
                queryFornecedor = "SELECT USUA.id, USUA.nome, USUA.ip, USUA.logado, USUA.id_one, USUA.email, USUA.banco, USUA.foto, USUA.id_face, USUA.senha, USUA.projeto_id, USUA.customiza, PERF.intervalo, PERF.modal," +
                    "USUA.id_one, USUA.espanhol, USUA.bloqueado FROM " + $scope.user.banco + ".cliente_fornecedor CLTF LEFT JOIN " + $scope.user.banco + ".perfil PERF ON PERF.id = CLTF.perfil_id " +
                    "LEFT JOIN node.usuario USUA ON USUA.id = CLTF.node_usuario_id WHERE CLTF.node_usuario_id = USUA.id and CLTF.node_usuario_id = '" + $scope.user.id + "'";
                // Pega o IP da maquina
                $.ajax({
                    url: "http://jsonip.com/",
                    dataType: "jsonp",
                    jsonpCallback: function () { var fnc = 'cb' + $.now(); this.url += fnc; return fnc; },
                    jsonp: false,
                    success: function (data) {
                        if ($scope.user.logado && data.ip != $scope.user.ip && $scope.user.customiza == 0) return Materialize.toast("Esse usuário está logado em outra máquina!", 4000, 'red darken-1');
                        else {
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(queryFornecedor.trim())).success(function (data) {
                                if (data.data.length) {
                                    // Se já estiver logado 
                                    window.location = dir + "inicial.html?";
                                    localStorage.user = JSON.stringify($scope.user);
                                }
                                else {
                                    if ($("#toast-container")[0] && $("#toast-container")[0].children.length) return;
                                    else return Materialize.toast("Usuário ou Senha incorreto(s)!", 4000, 'red darken-1');
                                }
                            });
                        }
                    }
                });
            }
            else {
                if ($("#toast-container")[0] && $("#toast-container")[0].children.length) return;
                else return Materialize.toast("Usuário ou Senha incorreto(s)!", 4000, 'red darken-1');
            }
        });
    }

    $scope.cadastrarSenhaSAUDE = function () {
        var cns = $("#email")[0],
            senha = $("#senhaSaude")[0],
            confirmarSenha = $("#confirmarSenha")[0],
            query = "select cf.node_usuario_id from saude.cliente_fornecedor cf LEFT JOIN saude.cns c ON cf.id = c.cliente_fornecedor_id where c.cns = '" + cns.value + "' OR cf.cpf = '" + cns.value + "';",
            queryUpdate = "update node.usuario SET senha = '" + senha.value + "' WHERE id = ",
            query_existy = "SELECT c.cns, coalesce(cf.valido, 0) valido, UPPER(p.projeto) projeto, COALESCE(p.nao_saas, 0) nao_saas, u .* FROM node.usuario u LEFT JOIN node.projeto p ON p.id = u.projeto_id LEFT JOIN  saude.cliente_fornecedor cf ON cf.node_usuario_id = u.id LEFT JOIN saude.cns c ON c.node_usuario_id = u.id WHERE (c.cns = '" + cns.value + "' OR cf.cpf = '" + cns.value + "') AND COALESCE(u.senha,'" + senha.value + "') = '" + senha.value + "'";

        if (senha.value.trim() == confirmarSenha.value.trim()) {
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                $http.post(URL + "/jsonQuery/", g$.trataQuery(queryUpdate.trim() + data.data[0].node_usuario_id)).success(function (data) {
                    Materialize.toast("Senha alterada com sucesso!", 4000, 'green darken-1');
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query_existy.trim())).success(function (data) {
                        $scope.user = data.data[0];
                        if ($scope.user.valido == 0) {
                            $("#cadastrarSenha")[0].classList.add("play-none");
                            $("#view")[0].classList.remove("play-none");
                            $("#email")[0].value = "";
                            $("#email")[0].value = "";
                            $("#email")[0].focus();
                            return Materialize.toast("Compareça a unidade para validar o seu cadastro!", 4000, 'red darken-1');
                        }
                        dir = ($scope.user.customiza == 1) ? "../customizador/" : "../";
                        $scope.user = data.data[0];
                        $http.post(URL + "/leArquivo/", { arquivo: $scope.user.projeto.toUpperCase() + "/inicial.html" }).success(function (data) {
                            if (data != "" && $scope.user.customiza == 0) {
                                // Sistema do cliente
                                $scope.user.sysCli = true;
                                window.location = $scope.user.projeto.toUpperCase()  + "/inicial.html?";
                            }
                            else window.location = dir + "inicial.html?";
                            $scope.user.logado = { id: $scope.user.id, projeto: $scope.user.projeto, projeto_id: $scope.user.projeto_id, banco: $scope.user.banco, nao_saas: $scope.user.nao_saas };
                            localStorage.user = JSON.stringify($scope.user);
                        });
                    });
                });
            });
        }
        else return Materialize.toast("As senhas não são idênticas!", 4000, 'red darken-1');
    }

    $scope.cadastrarPaciente = function () {
        var node_usuario, cliente_fornecedor,
            query = 'INSERT INTO saude.cliente_fornecedor (carterinha,razao,perfil_id,node_usuario_id,usuario,cliente,email,cbrCep,cbrEndereco,cbrBairro,cbrCidade,cbrUf) values ("' + getVal("cns")
                + '","' + getVal("nome") + '","99","val_node_usuario_id","1","1","' + getVal("login") + '","' + getVal("cep") + '","' + getVal("endereco")
                + '","' + getVal("bairro") + '","' + getVal("cidade") + '","' + getVal("estado") + '")',
            query_node_usuario = "CALL node._old_insere_altera_usuario('" + getVal("nome") + "', '" + getVal("login") + "', '" + getVal("senha") + "', 'saude', '')",
            query_cliente_fornecedor = "SELECT id FROM saude.cliente_fornecedor WHERE node_usuario_id = ",
            query_cns = "INSERT INTO saude.cns (cns, cliente_fornecedor_id, node_usuario_id) VALUES ('" + getVal("cns") + "', 'val_cliente_fornecedor_id', 'val_usuario_id')";

        if ($("#cadastrarPaciente #cns")[0].value != "" && $("#cadastrarPaciente #senha")[0].value != "" && $("#cadastrarPaciente #nome")[0].value != "" && $("#cadastrarPaciente #login")[0].value != "" && $("#cadastrarPaciente #cep")[0].value != "") {
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query_node_usuario.trim())).success(function (data) {
                if (data.data[0][0].REPETIDO) return Materialize.toast("Já existe esse usuário!!", 4000, 'red darken-1');
                else {
                    node_usuario = data.data[0][0]["LAST_INSERT_ID()"];
                    query = query.replace("val_node_usuario_id", node_usuario);
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        $http.post(URL + "/jsonQuery/", g$.trataQuery(query_cliente_fornecedor.trim() + node_usuario)).success(function (data) {
                            cliente_fornecedor = data.data[0].id;
                            query_cns = query_cns.replace("val_usuario_id", node_usuario);
                            query_cns = query_cns.replace("val_cliente_fornecedor_id", cliente_fornecedor);
                            $http.post(URL + "/jsonQuery/", g$.trataQuery(query_cns.trim())).success(function (data) {
                                Materialize.toast("Cadastrado com Sucesso!", 4000, 'green darken-1');
                                Materialize.toast("Compareça a unidade para validar o seu cadastro!", 4000, 'red darken-1');
                                $("#cadastrarPaciente")[0].classList.add("play-none");
                                $("#view")[0].classList.remove("play-none");
                                $("#email")[0].focus();
                            });
                        });
                    });
                }
            });
        }
        else return Materialize.toast("Há campos obrigatórios!!", 4000, 'red darken-1');
    }

    function getVal(name) {
        return $("#cadastrarPaciente #" + name)[0].value;
    }

    $scope.autenticacaoFace = function () {
        var email = $("#email")[0];

        var query = "SELECT * FROM usuario WHERE email = '" + email.value + "'";
        $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
            if (data.data.length) {
                Materialize.toast("Autenticação realizada com sucesso!", 4000, 'green darken-1');
                window.location = "/auth/facebook";
            }
            else Materialize.toast("Não existe esse usuário em nosso banco de dados!", 4000, 'red darken-1');
        });
    }

    $scope.cadastrar = function () {
        var email = $("#email")[0];

        var camposUsuario = $("input[data-tabela='usuario']"),
            camposCliente_Fornecedor = $("input[data-tabela!='usuario']"),
            objUsuario = {}, objCliente = {};
        for (var i = 0; i < camposUsuario.length; i++) {
            objUsuario[camposUsuario[i].dataset.coluna] = (camposUsuario[i].value.trim() == "") ? null : camposUsuario[i].value;
        }
        for (var i = 0; i < camposCliente_Fornecedor.length; i++) {
            objCliente[camposCliente_Fornecedor[i].dataset.coluna] = (camposCliente_Fornecedor[i].value.trim() == "") ? null : camposCliente_Fornecedor[i].value;
        }
        objUsuario.banco = camposUsuario[0].dataset.banco;
        objUsuario.projeto_id = camposUsuario[0].dataset.projeto;
        objCliente.razao = objUsuario.nome;
        objCliente.email = objUsuario.email;
        objCliente.adm = "1";
        $http.post(URL + '/post/node.usuario/', objUsuario).success(function (data) {
            data = data.data;
            objCliente.node_usuario_id = data.insertId;
            $http.post(URL + '/post/' + camposCliente_Fornecedor[0].dataset.banco + '.' + camposCliente_Fornecedor[0].dataset.tabela + '/', objCliente).success(function (data) {
                data = data.data;
                if (!data.err) {
                    Materialize.toast("Cadastrado com Sucesso.", 5000, 'green darken-1');
                    var query = "SELECT * FROM usuario WHERE email = '" + email.value + "' AND senha = '" + senha.value + "'";
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        if (data.data.length) {
                            window.location = "../inicial.html?auth=DYS&nome=" + data.data[0].nome + "&banco=" + data.data[0].banco + "&foto=" + data.data[0].foto + "&email=" + data.data[0].email;
                        }
                    });
                }
            });
        });
    }

});