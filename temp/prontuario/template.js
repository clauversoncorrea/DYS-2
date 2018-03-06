app.controller("template", function ($scope, $http, $rootScope) {

    var obj = g$.urlObj(location.href);

    // Funcao para carregar a query
    var query = "SELECT sexo.sexo sexo, p.razao nome, p.residencial telefone, DATE_FORMAT(p.nascimento, '%d/%m/%Y') nascimento, p.cpf cpf, p.rg rg, p.nome_mae nome_mae, p.nome_pai nome_pai,p.email email,CONCAT(COALESCE(p.cbrEndereco,''),', ',COALESCE(p.cbrNumero,'')) endereco, p.cbrBairro bairro, p.cbrCep cep,p.cbrCidade cidade, p.cbrUf, p.profissao profissao, o.nome fonte, e.especialidade especialidade, DATE_FORMAT(a.data, '%d/%m/%Y') data " +
        "FROM " + obj.banco + ".agenda a LEFT JOIN " + obj.banco + ".cliente_fornecedor p ON p.id = a.cliente_fornecedor_id LEFT JOIN " + obj.banco + ".sexo sexo ON sexo.id = p.sexo_id LEFT JOIN " + obj.banco + ".especialidade e ON e.id = a.especialidade_id LEFT JOIN " + obj.banco + ".plano pl ON pl.id = a.plano_id LEFT JOIN " + obj.banco + ".origem_convenio o ON o.id = pl.origem_id WHERE a.id = " + obj.agenda_id;
    g$.queryTemplate(query, function (data) {
        $scope.agenda = data[0];
 
     });

});

