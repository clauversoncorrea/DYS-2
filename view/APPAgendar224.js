app.controller('APPAgendar224', function ($scope){ g$.configTela('APP Agendar');g$.alteraPropriedade("alteraPropriedade | 8088 | foco |", true);$("[data-id=8088]")[0].addEventListener("change", g$.carregaQuery.bind(null, "carregaQuery ¦ 7437 | SELECT COUNT(at.id), IF (COUNT(at.id) > 0,group_concat(a.especialidade_id), 0) FROM »user.banco».atendimento at, »user.banco».agenda a WHERE a.id = at.agenda_id AND COALESCE(aguardar_retorno,0) = 1 AND a.cliente_fornecedor_id = '»8088»'| memo20 ¦ memo21", false), false);$("[data-id=25583]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 5897 | disabled | true | '»25582»' = '1'", false), false);$("[data-id=25583]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 5897 | disabled | false | '»25582»' = '0'", false), false);$("[data-id=25583]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 5897 | disabled | false | '»memo20»' = '0'", false), false);$("[data-id=25582]")[0].addEventListener("click", g$.limparElementos.bind(null, "limparElementos | 5895 ¦ 5897 ¦ 6176 ", false), false);$("[data-id=9196]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 9195 | disabled | true | '»9196»' = '1'", false), false);$("[data-id=9196]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 9195 | disabled | false | '»9196»' = '0'", false), false);$("[data-id=9195]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 9196 | disabled | true | '»9195»' = '1'", false), false);$("[data-id=9195]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade | 9196 | disabled | false | '»9195»' = '0'", false), false);$("[data-id=8088]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos | 5887 ¦ 5895 ¦ 5897 ¦ 6176 ¦ 6176", false), false);$("[data-id=8749]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Nenhuma Unidade Selecionada | '»5897»' = ''", false), false);$("[data-id=5887]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 5895| foco | ", false), false);$("[data-id=5895]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 5897 | foco | ", false), false);$("[data-id=5891]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade | 6176 | foco |", false), false);$("[data-id=6094]")[0].addEventListener("blur", g$.alteraPropriedade.bind(null, "alteraPropriedade | 6176 | foco |", false), false);$("[data-id=5887]")[0].addEventListener("change", g$.limparElementos.bind(null, "	 limparElementos | 5895 ¦ 5897 ¦ 6176 ¦ 6176", false), false);$("[data-id=5895]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos ¦ 1206  | 5897 ¦ 6176 ¦ 6176", false), false);$("[data-id=5897]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos | 6176 ¦ 6176", false), false);$("[data-id=6094]")[0].addEventListener("blur", g$.limparElementos.bind(null, " limparElementos | 6176", false), false);$("[data-id=8088]")[0].addEventListener("change", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 1209 | 5887 | foco |", false), false);$("[data-id=8749]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 1212 | SELECT nome, CONCAT(endereco,', ', COALESCE(numero,'')) FROM »user.banco».unidade_saude WHERE id = '»5897»' | memo3 ¦ memo2 | '»5897»' <> ''", false), false);$("[data-id=5904]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | NENHUM PACIENTE INFORMADO | '»8088»' = ''", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6805| 24257 | display| block | '»24908»' <> '' ¦ '»24909»' <> ''", false), false);$("[data-id=6176]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo1 | »6176»", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.onClick.bind(null, "onClick| 24910 | '»24908»' <> '' ¦ '»24909»' <> '' ¦ '»24332»' <> ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6805| 24911 | valor | 0 | '»24908»' = ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6805| 24911 | valor | 0 | '»24909»' <> ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6805| 24257 | display| block | '»24908»' <> '' ¦ '»24909»' <> ''", false), false);$("[data-id=5904]")[0].addEventListener("click", g$.memo.bind(null, "memo ¦ 9955 | memo10 | 0", false), false);$("[data-id=25582]")[0].addEventListener("click", g$.onClick.bind(null, "onClick| 25583", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade¦ 6806 | 24257 | display| none| '»24908»' = ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade¦ 6806 | 24257 | display| none| '»24908»' = ''", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6807| 24257 | display| none| '»24909»' = ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6807| 24257 | display| none| '»24909»' = ''", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.leTela.bind(null, "leTela ¦ 6808 | 24257 | 1529 | | '»24908»' <> '' ¦ '»24909»' <> ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.leTela.bind(null, "leTela ¦ 6808 | 24257 | 1529 | | '»24908»' <> '' ¦ '»24909»' <> ''", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela ¦ 6811 | 24416 | | | '»24908»' <> '' ¦ '»24909»' <> ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela ¦ 6811 | 24416 | | | '»24908»' <> '' ¦ '»24909»' <> ''", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.atualizarBloco.bind(null, "atualizarBloco ¦ 6815 | 24306 | | | '»24908»' <> '' ¦ '»24909»' <> ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.atualizarBloco.bind(null, "atualizarBloco ¦ 6815 | 24306 | | | '»24908»' <> '' ¦ '»24909»' <> ''", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.atualizarBloco.bind(null, "atualizarBloco ¦ 6822 | 24878 | | | '»24908»' <> '' ¦ '»24909»' <> ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.atualizarBloco.bind(null, "atualizarBloco ¦ 6822 | 24878 | | | '»24908»' <> '' ¦ '»24909»' <> ''", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6834 | 24348 | display | block| '»24339»' = '1'", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6834 | 24348 | display | block| '»24339»' = '1'", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6835 | 24348 | display | none | '»24339»' = '0'", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6919 | 25029 | valor | 1 | '»24908»' <> '' ¦ '»24909»' <> '' ¦ '»24332»' = ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6835 | 24348 | display | none | '»24339»' = '0'", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦ 6919 | 25029 | valor | 1 | '»24908»' <> '' ¦ '»24909»' <> '' ¦ '»24332»' = ''", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.onClick.bind(null, "onClick ¦ 6912 | 25045", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.onClick.bind(null, "onClick ¦ 6912 | 25045", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.confirm.bind(null, "confirm ¦ ¦ 6810 | Deseja Inativar o Assunto/Subdivisão? | '»24908»' <> '' ¦ '»24909»' <> '' ¦ '»24332»' <> ''", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.confirm.bind(null, "confirm ¦ ¦ 6810 | Deseja Inativar o Assunto/Subdivisão? | '»24908»' <> '' ¦ '»24909»' <> '' ¦ '»24332»' <> ''", false), false);$("[data-id=25580]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Inativação de Mapeamento | INATIVAR | 807", false), false);$("[data-id=25581]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Inativação de Mapeamento | INATIVAR | 807", false), false);});