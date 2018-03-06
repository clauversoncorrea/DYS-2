app.controller("template", function ($scope, $http, $rootScope) {

    var obj = g$.urlObj(location.href);

    // Funcao para carregar a query
    var query = "select date_format(DataEmissao, '%d/%m/%Y %H:%i:%s') data_hora,date_format(DataEmissao, '%d/%m/%Y') data, r.* FROM " + obj.banco.trim() + ".nfse_rps r where id =" + obj.id + " LIMIT 1";
    g$.queryTemplate(query, function (data) {
        if (data.length > 0) {
            $scope.rps = data[0];
            var query7 = "select * from " + obj.banco.trim() + ".empresa where id =  " + $scope.rps.empresa_id + " LIMIT 1";
            g$.queryTemplate(query7, function (data) {
                if (data.length > 0) {
                    $scope.empresa = data[0];
                }
            });
        }

    });

});

// var obj = { banco: window.location.href.split("=")[1].split("&")[0], id: window.location.href.split("=")[2].split("&")[0] }
// // Funcao para carregar a query
// var query = "select date_format(DataEmissao, '%d/%m/%Y %H:%i:%s') data_hora,date_format(DataEmissao, '%d/%m/%Y') data, r.* FROM " + obj.banco.trim() + ".nfse_rps r where id =" + obj.id + " LIMIT 1";
// $.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
//     if (data.data.length > 0) {
//         $scope.rps = data.data[0];
//         var query2 = "select * from " + obj.banco.trim() + ".empresa where id =  " + $scope.rps.empresa_id + " LIMIT 1";
//         $.post(URL + "/jsonQuery/", g$.trataQuery(query2)).then(function (data) {
//             if (data.data.length > 0) {
//                 $scope.empresa = data.data[0];
//             }
//         });
//     }

// });
