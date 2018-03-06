app.controller("template", function ($scope, $http, $rootScope) {

	var obj=g$.urlObj(location.href);
 
    
    // Funcao para carregar a query
    var query="SELECT CLTF.fantasia AS usuario,PROS.projeto AS projeto, COALESCE( ROUND((TIME_TO_SEC(RESA.tempo_total)/60),2),0) AS tempo_trabalhado, COALESCE(SUM(PESL.qtd_horas),0) AS tempo_contratado,ROUND(SUM(PESL.qtd_horas) - (ROUND(SUM(RESA.tempo_total)/60,2)),2) AS saldo_disponivel FROM intruder.pessoal PESL LEFT JOIN intruder.cliente_fornecedor CLTF ON CLTF.id=PESL.colaborador_id LEFT JOIN intruder.resposta RESA ON RESA.id_usuario =CLTF.node_usuario_id LEFT JOIN intruder.projetos PROS ON PROS.id=PESL.projeto_id WHERE RESA.salvo <>'Sistema' AND 1=1 AND PESL.empresa_id=(SELECT id_empresa from intruder.cliente_fornecedor where node_usuario_id='"+obj.id+"') GROUP BY PESL.colaborador_id";
    g$.queryTemplate(query, function (data) {
        $scope.relatorio_horas_contratadas = data;

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
