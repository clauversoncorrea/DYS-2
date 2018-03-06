app.controller("template", function ($scope, $http, $rootScope) {

	var obj=g$.urlObj(location.href);
    
    // Funcao para carregar a query
    var query="SELECT (FINO.horas_mes - SUM(PESL.qtd_horas)) AS tempo_disponivel,PROS.projeto,COALESCE(SUM(PESL.qtd_horas), 0) AS tempo_contratado,CLTF.fantasia AS usuario,FINO.horas_mes AS tempo_trabalhado  FROM intruder.pessoal PESL LEFT JOIN intruder.cliente_fornecedor CLTF ON CLTF.id=PESL.colaborador_id LEFT JOIN intruder.projetos PROS ON PROS.id=PESL.projeto_id LEFT JOIN intruder.financeiro FINO ON FINO.colaborador_id=PESL.colaborador_id WHERE 1=1 AND PESL.empresa_id=(SELECT id_empresa from intruder.cliente_fornecedor where node_usuario_id='"+obj.id+"') GROUP BY PESL.colaborador_id";
     g$.queryTemplate(query, function (data) {
        $scope.relatorio_tempo_disponivel = data;

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

