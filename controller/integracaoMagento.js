app.controller("integracaoMagento", function ($scope, $http, $rootScope) {
    g$.baixaMagento = function (params) {
        var paramsFuncao = params
        var loja, increment, bc, empresa;
        $scope.integraPed = function (e) {
            var query = "Select * FROM node.magento WHERE ativo=1 AND banco='" + $rootScope.user.banco + "'"
            $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                if(data.data.length > 0){
                    $scope.preparaEmpresa(data);
                }else{
                     g$.atualizaStatusPedidoERP(paramsFuncao);
                }
            })
        }
        $scope.integraPed();

        $scope.preparaObj = function (obj) {
            if (obj != "") {
                $scope.trazInfo(obj[0].increment_id, obj);
            } else {
                empresa.splice(0, 1);
                $scope.preparaEmpresa(empresa);
            }
        }
        $scope.trazInfo = function (increment, obj) {
            $http.get("/getInfoPedidosMagento/" + increment).success(function (data) {
                var order = data, pedStatus;
                order.items[0].product_options = "";
                if (order.shipping_address.street) {
                    order.shipping_address.street = order.shipping_address.street.replace(/\n/g, "|");
                }
                order = JSON.stringify(data);
                order = order.replace(/null,/g, '"",');
                order = order.replace(/\n/g, "|");
                order = order.replace(/�/g, "");
                order = order.replace(/`/g, "");
                order = order.replace(/'/g, "");
                order = order.replace(/‑/g, "-");
                order = JSON.parse(order);
                var ped = order.increment_id
                if (order.status_history.length > 50) {
                    order.status_history = '';
                }
                pedStatus = order.status
                $http.post("/integraPedido/" + bc + "/", order).success(function (data) {
                    var query = "SELECT id FROM "+$rootScope.user.banco+".pedido WHERE integracao_pedido = "+ped;
                    $http.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
                        var k = data;
                        if (!data.data.err) {
                            g$.atualizaStatusPedidoERP("atualizaStatusPedidoERP | "+ data.data[0].id + " | " + pedStatus);
                        } else {
                            
                        }
                        obj.splice(0, 1);
                        $scope.preparaObj(obj);
                    });
                });
            })
        }
        $scope.preparaEmpresa = function (empr) {
            empresa = empr
            if (empresa.data != "") {
                $scope.integraLoja(empresa.data[0]);
            } else {
                g$.atualizaStatusPedidoERP(paramsFuncao);
            }
        }
        $scope.integraLoja = function (emp) {
            loja = emp.integracao;
            bc = emp.banco;
            var json = { host: emp.url.trim(), login: emp.user.trim(), pass: emp.pass.trim(), port: emp.porta.trim() }
            json = JSON.stringify(json);
            $http.get("/configMagento/" + json).success(function (data) {
                if (data == "OK") {
                    emp.order_updated_at = emp.order_updated_at.replace("T", " ");
                    $http.get("/getPedidosMagento/" + emp.order_updated_at.split(".")[0]).success(function (data) {
                        if (data != "") {
                            $scope.preparaObj(data);
                        } else {
                            empresa.splice(0, 1);
                            $scope.preparaEmpresa(empresa);
                        }
                    })
                }
                else {
                    empresa.splice(0, 1);
                    $scope.preparaEmpresa(empresa);
                }
            })
        }
    }
});