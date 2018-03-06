app.controller("template", function ($scope, $http, $rootScope) {

	var obj=g$.urlObj(location.href);
    
    // Funcao para carregar a query
    var query="select * from "+obj.banco.trim()+".pedido where id="+ obj.id;
    g$.queryTemplate(query, function (data) {
        $scope.nota = data[0];

    });
	var query2="select * from "+obj.banco.trim()+".empresa where id=(SELECT empresa_id FROM "+obj.banco.trim()+".pedido where id="+ obj.id +")";
    g$.queryTemplate(query2, function (data) {
        $scope.empresa = data[0];

    });
    var query3="SELECT * FROM "+obj.banco.trim()+".pedido WHERE id="+ obj.id;
    g$.queryTemplate(query3, function (data) {
        $scope.cliente = data[0];

    });
     var query5="SELECT quantidade as qtd ,preco_unitario FROM "+obj.banco.trim()+".pedido_servico WHERE pedido_id="+ obj.id;
    g$.queryTemplate(query5, function (data) {
        $scope.servico = data[0];

    });
    var query4="SELECT  FORMAT(nfs_valor_inss,2,'de_DE') AS ValorInss, DECO.descricao_servico as descservico,FORMAT(PEDI.totalGeral,2,'de_DE') AS ValorTotal,FORMAT(PEDI.nfs_base_de_calculo,2,'de_DE') AS BaseCalculo FROM "+obj.banco.trim()+".pedido PEDI LEFT JOIN "+obj.banco.trim()+".descricao_servico DECO ON DECO.id = PEDI.descrServ WHERE PEDI.id="+ obj.id;
    g$.queryTemplate(query4, function (data) {
        $scope.descricao = data[0];

    });

    var query6 = "SELECT COALESCE(P.nfs_rps,0) as nfs FROM "+obj.banco.trim()+".pedido P WHERE P.id ="+obj.id+"  ORDER BY 1 DESC LIMIT 1";
        g$.queryTemplate(query6, function (data) {
        $scope.nfs = data[0];

    });

var query7 = "SELECT  COALESCE(NNFS.ultimo_rps,0) FROM     "+obj.banco.trim()+".pedido P   LEFT JOIN "+obj.banco.trim()+".empresa E ON E.id = P.empresa_id LEFT JOIN  "+obj.banco.trim()+".numeracao_nfs NNFS ON NNFS.id = E.numeracao_nfs_id WHERE  P.id = "+obj.id+" ORDER BY 1 DESC LIMIT 1";
        g$.queryTemplate(query7, function (data) {
        $scope.ultimo_rps = data[0];

    });
});
