app.controller("template", function ($scope, $http, $rootScope) {

	var obj=g$.urlObj(location.href);
    
    // Funcao para carregar a query
	var query="SELECT PROJ.gerente,PROJ.cliente,PROJ.responsavel,PROJ.desenvolvedor FROM "+obj.banco.trim()+".projeto PROJ WHERE PROJ.id ="+ obj.id
	g$.queryTemplate(query, function (data) {
       $scope.projeto = data[0];
    });

    var query2="SELECT * "+
                "FROM ( SELECT 2 nivel,CONCAT(LPAD(m.pai,4,0),'.',m.id,'.', c.id) id, m.id pai, c.consulta menu, c.termino_realizado "+
                "FROM "+obj.banco.trim()+".consulta c "+ 
                "LEFT JOIN "+obj.banco.trim()+".menu m ON c.tela_id = m.id "+
                "WHERE WEEK(CURDATE()) = WEEK(c.termino_realizado) "+
                "UNION SELECT 1 nivel,CONCAT(LPAD(m.pai,4,0),'.',m.id) id, pai, m.menu, NULL "+
                "FROM node.consulta c "+
                "LEFT JOIN "+obj.banco.trim()+".menu m ON c.tela_id = m.id "+
                "WHERE WEEK(CURDATE()) = WEEK(c.termino_realizado) "+
                "GROUP BY m.id "+
                "UNION SELECT 0 nivel, LPAD(m.pai,4,0) id,null pai, p.menu, NULL "+
                "FROM "+obj.banco.trim()+".consulta c ,"+obj.banco.trim()+".menu m ,"+obj.banco.trim()+".menu p "+
                "WHERE WEEK(CURDATE()) = WEEK(c.termino_realizado) "+
                "AND c.tela_id = m.id "+
                "AND p.id = m.pai "+
                "GROUP BY m.pai "+
                ")a ORDER BY id"
    g$.queryTemplate(query2, function (data) {
       $scope.ativ_execs = data;
        var query3="SELECT * "+
                    "FROM ( SELECT 2 nivel,CONCAT(LPAD(m.pai,4,0),'.',m.id,'.', c.id) id, m.id pai, c.consulta menu, c.termino "+
                    "FROM "+obj.banco.trim()+".consulta c "+ 
                    "LEFT JOIN "+obj.banco.trim()+".menu m ON c.tela_id = m.id "+
                    "WHERE WEEK(CURDATE())+1 = WEEK(c.termino) "+
                    "UNION SELECT 1 nivel,CONCAT(LPAD(m.pai,4,0),'.',m.id) id, pai, m.menu, NULL "+
                    "FROM node.consulta c "+
                    "LEFT JOIN "+obj.banco.trim()+".menu m ON c.tela_id = m.id "+
                    "WHERE WEEK(CURDATE())+1 = WEEK(c.termino) "+
                    "GROUP BY m.id "+
                    "UNION SELECT 0 nivel, LPAD(m.pai,4,0) id,null pai, p.menu, NULL "+
                    "FROM "+obj.banco.trim()+".consulta c ,"+obj.banco.trim()+".menu m ,"+obj.banco.trim()+".menu p "+
                    "WHERE WEEK(CURDATE())+1 = WEEK(c.termino) "+
                    "AND c.tela_id = m.id "+
                    "AND p.id = m.pai "+
                    "GROUP BY m.pai "+
                    ")a ORDER BY id"
        g$.queryTemplate(query3, function (data) {
        $scope.ativ_pps = data;
        // $scope.results = {ativ_execs:$scope.ativ_execs,ativ_pp:$scope.ativ_pp}
        });
    });


});

