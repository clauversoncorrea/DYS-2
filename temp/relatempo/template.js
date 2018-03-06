app.controller("template", function ($scope, $http, $rootScope) {

	var obj=g$.urlObj(location.href);
    
    // Funcao para carregar a query
    var query="call intruder.relatorio_tempo_total('1,2,3','','','1147')";
    g$.queryTemplate(query, function (data) {
        $scope.relatorio_tempo_total = data;

    });
	
	
});

