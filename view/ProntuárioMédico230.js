app.controller('ProntuárioMédico230', function ($scope){ g$.configTela('Prontuário Médico');g$.carregaQuery("carregaQuery | SELECT e.especialidade FROM »user.banco».cliente_fornecedor c, »user.banco».agenda_dow a LEFT JOIN »user.banco».especialidade e ON a.especialidade_id = e.id WHERE dia_semana = DAYOFWEEK(CURDATE()) AND CURTIME() BETWEEN hora_inicio AND hora_fim AND c.sala_id = a.sala_id and c.node_usuario_id = »user.id» LIMIT 1 | 17662 ", true);g$.atualizarTabela("atualizarTabela | 6304", true);g$.memo("memo | memo20 |", true);g$.leTela("leTela | 5664 | 459 | CLTF.node_usuario_id = »user.id»", true);g$.carregaQuery("carregaQuery | select id from »user.banco».cliente_fornecedor where node_usuario_id = »user.id» | memo29", true);$("[data-id=45225]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo7 | »45228»", false), false);$("[data-id=8030]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 6852", false), false);$("[data-id=8028]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 6852 ¦ 6336 ¦ 6321 ¦ 8043 ¦ 9138 ¦ 10772", false), false);$("[data-id=7089]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Dados de Atendimento | DADOSATENDIMENTO | 600 | '»g$.tblAgendaMedicoID»' <> '' | Nenhum Atendimento Selecionado", false), false);$("[data-id=8039]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 6336 ¦ 6321 ¦ 6852 ¦ 8043 ¦ 9138 ¦ 10772", false), false);$("[data-id=8041]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 8043 ¦ 6336 ¦ 6321 ¦ 6852 ¦ 9138  ¦ 10772", false), false);$("[data-id=8041]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 8053", false), false);$("[data-id=8053]")[0].addEventListener("aogravar", g$.gravanaTabela.bind(null, "gravanaTabela | paciente_id | encaminhamento | »7024»", false), false);$("[data-id=5666]")[0].addEventListener("click", g$.onClick.bind(null, "onClick | 5664 | '»g$.tblAgendaMedicoID»' = ''", false), false);$("[data-id=9508]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 9138 ¦ 8043 ¦ 6336 ¦ 6321 ¦ 6852  ¦ 10772", false), false);$("[data-id=9532]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 1393 | CALL »user.banco».encaminhamento(\"»6341»\") | | \"»6341»\" <> \"\" | alert", false), false);$("[data-id=17680]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo20 | 1=1 | '»memo20»' = ''", false), false);$("[data-id=17684]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo20 | AGDA.especialidade_id = '»17684»' |", false), false);$("[data-id=22459]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo20 | 1=1 |", false), false);$("[data-id=25223]")[0].addEventListener("aogravar", g$.gravanaTabela.bind(null, "gravanaTabela | mapeamento_id | mapeamento_resposta | »24332»", false), false);$("[data-id=25242]")[0].addEventListener("aogravar", g$.gravanaTabela.bind(null, "gravanaTabela | mapeamento_id | mapeamento_resposta | »24332»", false), false);$("[data-id=25239]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 25242", false), false);$("[data-id=6346]")[0].addEventListener("click", g$.gravanaTabela.bind(null, "gravanaTabela | atendimento_id | receituario | »memo1»", false), false);$("[data-id=10770]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 10772 ¦ 6321 ¦ 6852 ¦ 8043 ¦ 9138 ¦ 6336", false), false);$("[data-id=6945]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 689 | call »user.banco».proximo_atendimento('»g$.tblAgendaMedicoID»') | memo14 ¦ memo33 | | alert", false), false);$("[data-id=5666]")[0].addEventListener("click", g$.leTela.bind(null, "leTela ¦ 692 | 5666 | 355 | ATEO.id = '»g$.tblAgendaMedicoID»' | '»g$.tblAgendaMedicoID»' <> ''", false), false);$("[data-id=6856]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 6860", false), false);$("[data-id=22507]")[0].addEventListener("click", g$.openFile.bind(null, "openFile | http://dysweb.dys.com.br/saude/Capturar.PNG", false), false);$("[data-id=9541]")[0].addEventListener("click", g$.openFile.bind(null, "openFile | http://dysweb.dys.com.br/saude/Receita_comum.jpg", false), false);$("[data-id=6857]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 6845", false), false);$("[data-id=6346]")[0].addEventListener("click", g$.gravanaTabela.bind(null, "gravanaTabela | usuario_id | receituario | »7024»", false), false);$("[data-id=6334]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 709 | call »user.banco».finaliza_prontuario('»g$.tblAgendaMedicoID»') | memo5¦memo30 | '»g$.tblAgendaMedicoID»' <> '' | alert", false), false);$("[data-id=5664]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 6304", false), false);$("[data-id=7953]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 7962 | foco", false), false);$("[data-id=7953]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 7955", false), false);$("[data-id=7962]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 7964 | foco |", false), false);$("[data-id=7959]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 1013 | UPDATE »user.banco».cliente_fornecedor SET sala_id = »7964» WHERE node_usuario_id = »user.id» ||| alert ¦ Salvo com sucesso ¦ Falha ao tentar salvar", false), false);$("[data-id=17680]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 17687", false), false);$("[data-id=17684]")[0].addEventListener("change", g$.atualizarTabela.bind(null, "atualizarTabela | 17687", false), false);$("[data-id=22459]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 17687", false), false);$("[data-id=25222]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Novo Atestado | ATESTADO | 819", false), false);$("[data-id=9188]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Triagem | TriagemPaciente | 318 |'»g$.tblAgendaMedicoID»' <> '' | Nenhum Atendimento Selecionado", false), false);$("[data-id=45225]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Estoque | ESTOQUE | 957 | '»memo7»' <> '' | Unidade de Saúde não encontrada", false), false);});