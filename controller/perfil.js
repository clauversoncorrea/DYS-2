app.controller("perfil", function($scope, $http, $rootScope) {



    trocaFotoPerfil = function() {
        var formData = new FormData();
        var arquivo = event.target.files[0];
        formData.append("file", arquivo);
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            $("#logoPerfil")[0].src = "http://dysweb.dys.com.br/" + $rootScope.user.banco + "/" + arquivo.name;
        }
        xhr.open("POST", "http://138.197.32.22/lexus/apiDys?banco=" + $rootScope.user.banco);
        xhr.send(formData);
    }

    $scope.salvarDadosPerfil = function() {
        if ($scope.alterarSenha == 1 || $scope.alterarSenha == "1") {
            var query = "SELECT senha FROM node.usuario WHERE id = " + $rootScope.user.id;
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {

                if (g$.exceptionRequisicao("Verificando Senha Antiga", data)) return;

                if (data.data[0].senha != $("#senhaAntiga")[0].value.trim()) return Materialize.toast("Senha Antiga incorreta", 4000, 'red darken-3');
                else if ($("#novaSenha")[0].value.trim() != $("#confirmarSenha")[0].value.trim()) {
                    return Materialize.toast("Senhas não coincidem", 4000, 'red darken-3');
                }
                else $scope.salvarPerfil();
            });
        }
        else $scope.salvarPerfil();
    }

    $scope.salvarPerfil = function() {
        var query = "SELECT * FROM node.usuario WHERE id = " + $rootScope.user.id,
            queryFornecedor = "SELECT email FROM " + $rootScope.user.banco + ".cliente_fornecedor WHERE email = '" + $("#email")[0].value.trim() + "' AND node_usuario_id <> " + $rootScope.user.id,
            queryUpdateFornecedor = "UPDATE " + $rootScope.user.banco + ".cliente_fornecedor SET email = '" + $("#email")[0].value.trim() + "' WHERE node_usuario_id = " + $rootScope.user.id,
            obj = {
                id: $rootScope.user.id,
                email: $("#email")[0].value.trim(),
                foto: $("#logoPerfil")[0].src
            };

        if ($scope.alterarSenha == 1 || $scope.alterarSenha == "1") obj.senha = $("#novaSenha")[0].value.trim();
        
        $http.post(URL + "/jsonQuery/", g$.trataQuery(queryFornecedor.trim())).success(function (data) {
            if (g$.exceptionRequisicao("Procurando Usuário", data)) return;
            if (data.data.length) return g$.alerta("Error", "Esse login já existe!!");

            $http.put(URL + "/put/node.usuario", obj).success(function(data) {
                if (g$.exceptionRequisicao("Alterando Usuário", data)) return;

                if (data.err) return g$.alerta("Error", "Esse login já existe!!");
                else {
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(queryUpdateFornecedor.trim()))
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        if (g$.exceptionRequisicao("Buscando Dados Usuário", data)) return;
                        $(".user-image")[0].src = $(".logo-user")[0].src = data.data[0].foto;
                        localStorage.user = JSON.stringify(data.data[0]);
                        $("#modal-perfil").modal("close");
                        g$.arrayTelas = g$.arrayTelas.filter(v => v.toString() != "ModalPerfil");
                        Materialize.toast("Salvo com Sucesso!!", 4000, 'green darken-3');
                    });
                }
            });
        });
    }

});