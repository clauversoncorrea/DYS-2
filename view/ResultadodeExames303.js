app.controller('ResultadodeExames303', function ($scope){ g$.configTela('Resultado de Exames');g$.memo("memo | memo1 | ", true);g$.atualizarBloco("atualizarBloco | 11651", true);$("[data-id=8095]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 40414 | display | none | '»8095»' <> ''", false), false);$("[data-id=8095]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 40414 | display | block | '»8095»' = ''", false), false);$("[data-id=8095]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 40410 | display | none | '»8095»' = ''", false), false);$("[data-id=8095]")[0].addEventListener("change", g$.memo.bind(null, "memo ¦ 1998 | memo1 | »8095»", false), false);$("[data-id=8095]")[0].addEventListener("change", g$.carregaQuery.bind(null, "carregaQuery ¦ 9385 | SELECT COUNT(*) FROM »user.banco».atendimento ATEO LEFT JOIN »user.banco».agenda AGDA ON AGDA.id = ATEO.agenda_id WHERE AGDA.cliente_fornecedor_id =  '»8095»' AND NOT ISNULL(ATEO.resultado_exame) | memo10", false), false);});