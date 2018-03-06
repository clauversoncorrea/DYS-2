app.controller("template", function ($scope, $http, $rootScope) {

	var obj=g$.urlObj(location.href);
    
    // Funcao para carregar a query
    var query="SELECT PESL.qtd_horas AS tempo_contratado, COALESCE( ROUND((TIME_TO_SEC(RESA.tempo_total)/60),0),0) AS tempo_trabalhado,CLTF.fantasia AS usuario,PROS.projeto AS projeto,ROUND(100 * (ROUND(SUM(RESA.tempo_total)/60,2)/SUM(PESL.qtd_horas)),2) AS desempenho,ROUND(SUM(PESL.qtd_horas) - (ROUND(SUM(RESA.tempo_total)/60,2)),2) AS estimativa FROM intruder.pessoal PESL LEFT JOIN intruder.cliente_fornecedor CLTF ON CLTF.id=PESL.colaborador_id LEFT JOIN intruder.resposta RESA ON RESA.pessoal_id=PESL.id LEFT JOIN intruder.projetos PROS ON PROS.id=PESL.projeto_id LEFT JOIN intruder.atividades ATIS ON ATIS.id = PESL.atividade_id WHERE CLTF.id_empresa=(SELECT id_empresa from intruder.cliente_fornecedor where node_usuario_id='"+obj.id+"') GROUP BY ATIS.id,PROS.id";
    g$.queryTemplate(query, function (data) {
        $scope.relatorio_desempenho = data;

    });
	
	 var query2="SELECT DATE(NOW()) as data,TIME(NOW()) AS hora";
    g$.queryTemplate(query2, function (data) {
        $scope.topo = data[0];

    });

    var query3="SELECT * from intruder.cliente_fornecedor where id_empresa =(SELECT id_empresa from intruder.cliente_fornecedor where node_usuario_id="+obj.id+")";
    g$.queryTemplate(query3, function (data) {
        $scope.empresa = data[0];

    });
});

