app.controller("template", function ($scope, $http, $rootScope) {

	var obj=g$.urlObj(location.href);
    
    // Funcao para carregar a query
    var query=" SELECT ROUND(COALESCE(SUM(PESL.qtd_horas),0) - COALESCE((TIME_TO_SEC(RESA.tempo_total) / 60),0),0) AS tempo_disponivel, COALESCE(SUM(PESL.qtd_horas),0) AS tempo_contratado,CLTF.fantasia AS usuario, COALESCE( ROUND((TIME_TO_SEC(RESA.tempo_total)/60),0),0) AS tempo_trabalhado,PROS.projeto AS projeto FROM intruder.pessoal PESL LEFT JOIN intruder.cliente_fornecedor CLTF ON CLTF.id=PESL.pessoal_id LEFT JOIN intruder.resposta RESA ON RESA.id_usuario =CLTF.node_usuario_id LEFT JOIN intruder.projetos PROS ON PROS.id=PESL.projeto_id WHERE 1=1 AND PESL.empresa_id=(SELECT id_empresa from intruder.cliente_fornecedor where node_usuario_id='52') GROUP BY 3,5";
    g$.queryTemplate(query, function (data) {
        $scope.relatorio_tempo_disponivel = data;

    });
	
	 var query2="SELECT DATE(NOW()) as data,TIME(NOW()) AS hora";
    g$.queryTemplate(query2, function (data) {
        $scope.topo = data[0];

    });

    var query3="SELECT * from intruder.cliente_fornecedor where empresa =(SELECT empresa from intruder.cliente_fornecedor where node_usuario_id="+obj.id+")";
    g$.queryTemplate(query3, function (data) {
        $scope.empresa = data[0];

    });
});

