app.controller('EdiçãodePerguntas1061', function ($scope){ g$.configTela('Edição de Perguntas');g$.carregaQuery("carregaQuery | SELECT Id,pergunta,pergunta2,pergunta3,pergunta4,data_edicao FROM saude.pergunta where id=1 | 53736¦53742¦53747¦53749¦53751¦53739", true);$("[data-id=53754]")[0].addEventListener("click", g$.confirm.bind(null, "confirm¦15138¦15137¦ | Deseja mesmo Registrar essas perguntas para a Pesquisa?", false), false);$("[data-id=53758]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 53756", false), false);$("[data-id=53754]")[0].addEventListener("teste", g$.carregaQuery.bind(null, "carregaQuery¦15137 | UPDATE saude.pergunta SET pergunta='»53742»', data_edicao=DATE(NOW()), pergunta2='»53747»', pergunta3='»53749»', pergunta4='»53751»' WHERE id='1'|", false), false);});