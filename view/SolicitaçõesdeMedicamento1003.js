app.controller('SolicitaçõesdeMedicamento1003', function ($scope){ g$.configTela('Solicitações de Medicamento');g$.alteraPropriedade("alteraPropriedade | 50755 | valor | 1", true);g$.carregaQuery("carregaQuery ¦2020| select COALESCE(GROUP_CONCAT(u.id),0), c.unidade_id FROM »user.banco».cliente_fornecedor c LEFT JOIN »user.banco».unidade_saude u ON c.unidade_id = u.unidade_central WHERE node_usuario_id = »user.id» | memo11 ¦ memo10", true);$("[data-id=50872]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo20 | »51312»", false), false);$("[data-id=50832]")[0].addEventListener("keyup", g$.alteraPropriedade.bind(null, "alteraPropriedade ¦13667| 50689 | valor | 1 | »50689» < 1", false), false);$("[data-id=50813]")[0].addEventListener("click", g$.limparDadosView.bind(null, "limparDadosView | 50813", false), false);$("[data-id=50871]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo23 | 1 | '»50829»' <> '' |", false), false);$("[data-id=50871]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo23 | 0 | '»50829»' = '' |", false), false);$("[data-id=50750]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 50757", false), false);$("[data-id=50853]")[0].addEventListener("change", g$.limparElementos.bind(null, "limparElementos | 50738", false), false);$("[data-id=50858]")[0].addEventListener("keyup", g$.alteraPropriedade.bind(null, "alteraPropriedade | 50732 | valor | »50729» | »50729» < »50732» ¦ »50732» > 0 ¦ '»50732»' <> ''", false), false);$("[data-id=50858]")[0].addEventListener("keyup", g$.alteraPropriedade.bind(null, "alteraPropriedade | 50732 | valor | 0 | »50732» < 0 OU »50729» < 0", false), false);$("[data-id=50873]")[0].addEventListener("click", g$.printArea.bind(null, "printArea | 50813 | 50872 ¦50869", false), false);$("[data-id=52081]")[0].addEventListener("click", g$.onClick.bind(null, "onClick | 50750", false), false);$("[data-id=50864]")[0].addEventListener("change", g$.carregaQuery.bind(null, "carregaQuery ¦13718| SELECT count(*) FROM »user.banco».solicitacao_medicamento WHERE estoque_id_a_devolver = '»50738»' | memo31 | '»50738»' <> ''", false), false);$("[data-id=50872]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo21 | »50829»", false), false);$("[data-id=50755]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 50757", false), false);$("[data-id=50756]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 50757", false), false);$("[data-id=50872]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Nova Compra | COMPRA | 1004 | '»memo21»'<> '' | Medicamento não encontrado", false), false);$("[data-id=50871]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Prepara Transferência | ENTREGA |1029", false), false);});