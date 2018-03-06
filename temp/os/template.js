app.controller("template", function ($scope, $http, $rootScope) {

	var obj=g$.urlObj(location.href);
    
    // Funcao para carregar a query
    var query="SELECT * FROM artcool.empresa where id=1";
    g$.queryTemplate(query, function (data) {
        $scope.empresa = data[0]

    });
	
	 var query2="SELECT * FROM artcool.ordem_servico where id="+obj.id;
    g$.queryTemplate(query2, function (data) {
        $scope.os = data[0];

    });

    
});

