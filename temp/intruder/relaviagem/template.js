app.controller("template", function ($scope, $http, $rootScope) {

	
   var obj=g$.urlObj(location.href);
    var memo1 = window.location.href.split("&")[2].split("=")[1];
    
    
    // Funcao para carregar a query
    var query="SELECT REEO.nome_viajante AS viajante,REEO.pessoa_visitada,REEO.objetivo,REEO.data_viagem AS data_fim,REEO.periodo_viagem AS data_inicio,ROUND(REEO.valor_total,2) AS valor_total"
    + ",ROUND(REEO.valor,2) AS valor,REEO.destino AS destino,REEO.importancia_restituida AS importancia_restituida,REEO.importancia_concluida AS "+
    "importancia_concluida,PROS.projeto AS projeto,REEO.viagem AS viagem,REEO.reembolso AS reembolso FROM intruder.reembolso REEO "+
    "LEFT JOIN intruder.projetos PROS ON REEO.projeto_id = PROS.id "+
    "LEFT JOIN intruder.cliente_fornecedor CLTF ON PROS.id = CLTF.id WHERE REEO.id="+obj.id;
    g$.queryTemplate(query, function (data) {
        $scope.rela_viagem = data[0];

    });
	
	 var query2="SELECT DATE(NOW()) as data,TIME(NOW()) AS hora";
    g$.queryTemplate(query2, function (data) {
        $scope.topo = data[0];

    });

    var query3="SELECT * from intruder.cliente_fornecedor where empresa =(SELECT empresa from intruder.cliente_fornecedor where node_usuario_id="+memo1+")";
    g$.queryTemplate(query3, function (data) {
        $scope.empresa = data[0];

    });
 var query4 = "SELECT TIDE.tipo_despesa AS tipo_despesa,DESA.despesa AS despesa,MOES.nome AS moeda,ROUND(DESO.valor,2) AS valor,ROUND(DESO.taxa_cambio,2) AS taxa_cambio,"+
  "ROUND(DESO.total,2) AS total,DESO.data AS data FROM intruder.despesa_reembolso DESO LEFT JOIN intruder.tipo_despesas TIDE ON TIDE.id = DESO.tipo_despesa_id "+
  "LEFT JOIN intruder.despesa DESA ON DESA.id = DESO.despesa_id LEFT JOIN intruder.moedas MOES ON MOES.id = DESO.moeda_id WHERE DESO.reembolso_id = "+obj.id+ " ORDER BY TIDE.tipo_despesa";
     g$.queryTemplate(query4, function (data) {
        $scope.despesa = data;

    });

    
});

