app.controller('CompraMedicamento550', function ($scope){ g$.configTela('Compra Medicamento');g$.carregaQuery("carregaQuery ¦ 606 | SELECT unidade_id memo, unidade_id campo FROM »user.banco».cliente_fornecedor WHERE node_usuario_id=»user.id» | memo2 ¦ 15884", true);g$.carregaQuery("carregaQuery | SELECT '>0' as testea, '>0' as testeb, '1=1' as testec |memo7 ¦ memo8 ¦ memo9", true);$("[data-id=15431]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 15432", false), false);$("[data-id=15775]")[0].addEventListener("click", g$.salvarTela.bind(null, "salvarTela ¦ 3384 | 15432", false), false);$("[data-id=15777]")[0].addEventListener("aogravar", g$.gravanaTabela.bind(null, "gravanaTabela | unidade_id | compra_medicamento | »memo2»", false), false);$("[data-id=15967]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 15963 | '»15965»' <> '' ¦ '»15970»' <> '' ¦ '»15974»' <> ''", false), false);$("[data-id=15965]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo7 | = '»15965»'", false), false);$("[data-id=15427]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 24916", false), false);$("[data-id=15970]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo8 | = '»15970»'", false), false);$("[data-id=15974]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo9 | CONCAT(COALESCE(ESTE.vencimento,' - '),'/',COALESCE(ESTE.lote,' - ')) = '»15974»'", false), false);$("[data-id=15427]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 16380", false), false);$("[data-id=16427]")[0].addEventListener("click", g$.limparDadosView.bind(null, "limparDadosView ¦ 3523 | 15959", false), false);$("[data-id=15967]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Unidade, Medicamento e Vencimento-Lote são obrigatórios | '»15965»' = '' ¦ '»15970»' = '' ¦ '»15974»' = ''", false), false);$("[data-id=15967]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Unidade e Medicamento são obrigatórios | '»15965»' = '' ¦ '»15970»' = '' ¦ '»15974»' <> ''", false), false);$("[data-id=15967]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Unidade é obrigatório | '»15965»' = '' ¦ '»15970»' <> '' ¦ '»15974»' <> ''", false), false);$("[data-id=15967]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Unidade e Vencimento-Lote são obrigatórios | '»15965»' = '' ¦ '»15970»' <> '' ¦ '»15974»' = ''", false), false);$("[data-id=24079]")[0].addEventListener("change", g$.carregaQuery.bind(null, "carregaQuery | SELECT IF('»24079»' = '' OR '»15977»' = '', »15982»,IF ('»24079»' = 6, »15982» - »15977», IF('»24079»' = 5, »15982» + »15977»,'ERRO'))) | 15984", false), false);$("[data-id=15967]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Vencimento-Lote é obrigatório | '»15965»' <> '' ¦ '»15970»' <> '' ¦ '»15974»' = ''", false), false);$("[data-id=15967]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Medicamento e Vencimento-Lote são obrigatórios | '»15965»' <> '' ¦ '»15970»' = '' ¦ '»15974»' = ''", false), false);$("[data-id=15967]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Medicamento é obrigatório | 15965»' <> '' ¦ '»15970»' = '' ¦ '»15974»' <> ''", false), false);$("[data-id=15977]")[0].addEventListener("keyup", g$.carregaQuery.bind(null, "carregaQuery | SELECT IF('»24079»' = '' OR '»15977»' = '', »15982»,IF ('»24079»' = 6, »15982» - »15977», IF('»24079»' = 5, »15982» + »15977»,'ERRO'))) | 15984", false), false);$("[data-id=15985]")[0].addEventListener("click", g$.carregaQuery.bind(null, "carregaQuery ¦ 3535 | CALL »user.banco».corrige_estoque('»16428»', '»24079»','»15977»','»user.id»' ) | | | toast", false), false);$("[data-id=15427]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 17373", false), false);$("[data-id=15965]")[0].addEventListener("change", g$.atualizarTabela.bind(null, "atualizarTabela | 24916", false), false);$("[data-id=15970]")[0].addEventListener("change", g$.atualizarTabela.bind(null, "atualizarTabela | 24916", false), false);$("[data-id=15965]")[0].addEventListener("change", g$.atualizarTabela.bind(null, "atualizarTabela | 16380", false), false);$("[data-id=15970]")[0].addEventListener("change", g$.atualizarTabela.bind(null, "atualizarTabela | 16380", false), false);$("[data-id=15974]")[0].addEventListener("change", g$.carregaQuery.bind(null, "carregaQuery | SELECT id, quantidade FROM »user.banco».estoque ESTE WHERE farmacia_id »memo7» AND remedio_id »memo8» AND »memo9» | 16428 ¦ 15982 | '»15965»' <> '' ¦ '»15970»' <> ''", false), false);$("[data-id=15965]")[0].addEventListener("change", g$.atualizarTabela.bind(null, "atualizarTabela | 17373", false), false);$("[data-id=15970]")[0].addEventListener("change", g$.atualizarTabela.bind(null, "atualizarTabela | 17373", false), false);$("[data-id=15974]")[0].addEventListener("change", g$.atualizarTabela.bind(null, "atualizarTabela | 24916", false), false);$("[data-id=15974]")[0].addEventListener("change", g$.atualizarTabela.bind(null, "atualizarTabela | 17373", false), false);$("[data-id=15974]")[0].addEventListener("change", g$.atualizarTabela.bind(null, "atualizarTabela | 16380", false), false);});