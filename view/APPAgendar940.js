app.controller('APPAgendar940', function ($scope){ g$.configTela('APP Agendar');g$.alteraPropriedade("alteraPropriedade | 47975¦47976 | display | none| '»user.projeto_id»' = '3'", true);$("[data-id=47978]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos | 44114 ¦ 44116 ¦ 44121 ¦ 47980 ¦ 44112", false), false);$("[data-id=47980]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos | 44114 ¦ 44116 ¦ 44121¦ 44112", false), false);$("[data-id=47978]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 47976 | display | none | '»47978»' = '0'", false), false);$("[data-id=47978]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 47976 | display | block| '»47978»' <> '0'", false), false);$("[data-id=47978]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo15 |  WHERE  | '»47978»' = '0'", false), false);$("[data-id=47980]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo15 | LEFT JOIN »user.banco».plano_especialidade pe ON pe.especialidade_id = a.especialidade_id WHERE pe.plano_id = '»47980»' and | '»47978»' <> '0'", false), false);$("[data-id=44102]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos | 44114 ¦ 44116 ¦  44121 ¦ 44112", false), false);$("[data-id=44107]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 44110 | disabled | true | '»44107»' = '1'", false), false);$("[data-id=44107]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 44110 | disabled | false | '»44107»' = '0'", false), false);$("[data-id=44110]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 44107 | disabled | true | '»44110»' = '1'", false), false);$("[data-id=44110]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 44107 | disabled | false | '»44110»' = '0'", false), false);$("[data-id=44112]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 44114| foco |", false), false);$("[data-id=44102]")[0].addEventListener("change", g$.carregaQuery.bind(null, "carregaQuery ¦12720| SELECT CONCAT(COALESCE(GROUP_CONCAT(especialidade_id),0),',84') FROM »user.banco».encaminhamento WHERE paciente_id =' »44102»' | memo22 | '»user.projeto_id»' = '3'", false), false);$("[data-id=44112]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos | 44114 ¦ 44116 ¦  44121", false), false);$("[data-id=44114]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos ¦11444 | 44116 ¦ 44121", false), false);$("[data-id=44116]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos | 6176 ¦ 6176", false), false);$("[data-id=44125]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 11456 | SELECT nome, CONCAT(endereco,', ', COALESCE(numero,'')) FROM »user.banco».unidade_saude WHERE id = '»44116»' | memo3 ¦ memo2 | '»44116»' <> ''", false), false);$("[data-id=44125]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Nenhuma Unidade Selecionada | '»44116»' = ''", false), false);$("[data-id=44124]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | NENHUM PACIENTE INFORMADO | '»44102»' = ''", false), false);$("[data-id=44124]")[0].addEventListener("click", g$.memo.bind(null, "memo ¦ 11463 | memo10 | 0", false), false);$("[data-id=44112]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 44116 | disabled | true | '»44112»'= '4'", false), false);$("[data-id=44112]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo5 | SELECT distinct CONCAT(e.especialidade, '-',COALESCE(c.razao,'')) especialidade, CONCAT(e.id,'-',COALESCE(c.id,0)) id from »user.banco».agenda_dow a LEFT JOIN »user.banco».especialidade e ON e.id = a.especialidade_id LEFT JOIN »user.banco».cliente_fornecedor c ON c.id = a.medico_id and c.medico=1 »memo15» e.ativo = 1 and e.servico_id = 1| '»44112»'= '1'", false), false);$("[data-id=44112]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo5 | SELECT distinct CONCAT(e.especialidade, '-',COALESCE(c.razao,'')) especialidade, CONCAT(e.id,'-',COALESCE(c.id,0)) id FROM »user.banco».atendimento at, »user.banco».agenda a LEFT JOIN »user.banco».especialidade e ON e.id = a.especialidade_id LEFT JOIN »user.banco».cliente_fornecedor c ON c.id = a.medico_id and c.medico=1 »memo15» a.id = at.agenda_id AND COALESCE(aguardar_retorno,0) = 1 AND a.cliente_fornecedor_id = '»44102»' | '»44112»'= '4'", false), false);$("[data-id=44112]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo5 | SELECT distinct e.especialidade especialidade, e.id id from »user.banco».agenda_dow a LEFT JOIN »user.banco».especialidade e ON e.id = a.especialidade_id LEFT JOIN »user.banco».cliente_fornecedor c ON c.id = a.medico_id and c.medico=1 »memo15» e.ativo = 1 and e.servico_id = 2 | '»44112»'= '2'", false), false);});