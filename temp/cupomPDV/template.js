app.controller("template", function ($scope, $http, $rootScope) {

    var obj = g$.urlObj(location.href);

    // Funcao para carregar a query
    var query = "SELECT VISA.id,VISA.indicacao,VISA.outros_fixacao,VISA.local,VISA.observacao,VISA.outro_tipo,CFGA.fantasia as solicitante,CLTF.fantasia as cliente ,CLTF.residencial AS telefone,CFGA.residencial as telefone2,CONCAT(CLTF.entrEndereco,' - Nº ',CLTF.entrNumero,' - ',CLTF.entrBairro,' - ',CLTF.entrCidade,' - ',CLTF.entrUf) as endereco,CLTF.email,VISA.data,VISA.horario,VISA.instalacao,VISA.infra,VISA.acoplamento,VISA.outro_tipo,VISA.local,VISA.tipo,VISA.trajeto,VISA.suporte,VISA.coxim,VISA.outros_fixacao,VISA.tensao,VISA.mono,VISA.estacionamento,VISA.trifasico,VISA.comercial,VISA.noite,VISA.domingo,VISA.dreno,VISA.andaimes,VISA.servico,VISA.cortes,VISA.furos,VISA.acesso,VISA.eletrica,VISA.acabamentos,VISA.planta_hidraulica FROM " + obj.banco.trim() + ".visita_tecnica VISA LEFT JOIN " + obj.banco.trim() + ".cliente_fornecedor CLTF ON CLTF.id = VISA.cliente_id LEFT JOIN " + obj.banco.trim() + ".cliente_fornecedor CFGA ON CFGA.id = VISA.solicitante_id LEFT JOIN " + obj.banco.trim() + ".tipo_status TIUS ON TIUS.id = VISA.tipo_status WHERE VISA.id=" + obj.id;
    g$.queryTemplate(query, function (data) {
        $scope.visita = data[0];

    });
    var query2 = "SELECT AMBS.id,AMBS.area,AMBS.infra,AMBS.modelo,AMBS.btu,AMBS.observacao,AMBS.nome,AMBS.descricao FROM " + obj.banco.trim() + ".ambientes AMBS WHERE AMBS.visita_id =" + obj.id
    g$.queryTemplate(query2, function (data) {
        $scope.ambientes = data;
    });

});

