app.controller('Senha968', function ($scope){ g$.configTela('Senha');g$.alteraPropriedade("alteraPropriedade | 47886 | valor | »date_today»", true);g$.carregaQuery("carregaQuery ¦1840 | SELECT IF(NOT ISNULL(senha_atual), 1,0) FROM »user.banco».cliente_fornecedor WHERE node_usuario_id = »user.id» OR responsavel_id = »user.id» ORDER BY senha_atual DESC | memo20", true);$("[data-id=47899]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos | 5887 ¦ 5895 ¦ 5897 ¦ 6176 ¦ 6176", false), false);$("[data-id=47899]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 1209 | 5887 | foco |", false), false);$("[data-id=47899]")[0].addEventListener("change", g$.carregaQuery.bind(null, "carregaQuery ¦ 7437 | SELECT COUNT(at.id), IF (COUNT(at.id) > 0,group_concat(a.especialidade_id), 0) FROM »user.banco».atendimento at, »user.banco».agenda a WHERE a.id = at.agenda_id AND COALESCE(aguardar_retorno,0) = 1 AND a.cliente_fornecedor_id = '»8088»'| memo20 ¦ memo21", false), false);$("[data-id=47893]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦12265| call »user.banco».gerar_senha_app ('0', '»47891»') ||'»47891»' <> ''|alert", false), false);$("[data-id=47893]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Nenhuma Especialidade selecionada |  '»47891»' = ''", false), false);$("[data-id=47894]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦12268| call »user.banco».gerar_senha_app ('1', '»47891»') ||'»47891»' <> ''|alert", false), false);$("[data-id=47894]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Nenhuma Especialidade selecionada | '»47891»' = ''", false), false);$("[data-id=47876]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery | SELECT senha_atual, IF(ISNULL(chamada), 'Esperando...', CONCAT('CHAMADA EM ', chamada)) FROM »user.banco».cliente_fornecedor WHERE node_usuario_id = »user.id» OR responsavel_id = »user.id» ORDER BY senha_atual DESC | 47903 ¦ 47908", false), false);});