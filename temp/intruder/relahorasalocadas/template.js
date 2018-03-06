app.controller("template", function ($scope, $http, $rootScope) {

	var obj=g$.urlObj(location.href);
    
    // Funcao para carregar a query
    var query="SELECT ROUND(SUM(time_to_sec(RESA.tempo_total)/3600),2) AS horas_trabalhadas,SUM(PESL.qtd_horas) AS horas_projeto,CLTF.fantasia AS usuario,PROS.projeto AS projeto,Min(PESL.data_inicio) AS data_inicio,MAX(PESL.data_fim) AS data_fim FROM intruder.pessoal PESL LEFT JOIN intruder.cliente_fornecedor CLTF ON CLTF.id = PESL.colaborador_id LEFT JOIN intruder.atividades ATIS ON ATIS.id = PESL.atividade_id LEFT JOIN intruder.projetos PROS ON PROS.id = PESL.projeto_id LEFT JOIN intruder.resposta RESA ON RESA.id_usuario=CLTF.node_usuario_id WHERE PESL.empresa_id=(SELECT id_empresa from intruder.cliente_fornecedor where node_usuario_id='"+obj.id+"') AND RESA.salvo <> 'Sistema' AND 1=1 GROUP BY PESL.projeto_id,PESL.colaborador_id LIMIT 150";
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

