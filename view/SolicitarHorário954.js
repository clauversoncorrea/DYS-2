app.controller('SolicitarHorário954', function ($scope){ g$.configTela('Solicitar Horário');g$.carregaQuery("carregaQuery ¦1812| SELECT id id, '1=1' memo2 FROM »user.banco».cliente_fornecedor WHERE node_usuario_id = »user.id» | memo1¦ memo2", true);$("[data-id=45129]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo2 | NOVO.status_id = '2'", false), false);$("[data-id=45139]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo2 | NOVO.status_id = '3'", false), false);$("[data-id=45149]")[0].addEventListener("click", g$.openModal.bind(null, "openModal | Solicitar Novo| SOLICITARHORARIO | 955", false), false);$("[data-id=45177]")[0].addEventListener("click", g$.atualizarBloco.bind(null, "atualizarBloco ¦11993| 45128", false), false);$("[data-id=45180]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo2 | 1=1", false), false);$("[data-id=45180]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | TODOS | | toast", false), false);$("[data-id=45139]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | RECUSADOS| | toast", false), false);$("[data-id=45147]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | PENDENTES| | toast", false), false);$("[data-id=45129]")[0].addEventListener("click", g$.onClick.bind(null, "onClick | 45177", false), false);$("[data-id=45139]")[0].addEventListener("click", g$.onClick.bind(null, "onClick | 45177", false), false);$("[data-id=45147]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo2 | NOVO.status_id = '1'", false), false);$("[data-id=45180]")[0].addEventListener("click", g$.onClick.bind(null, "onClick | 45177", false), false);$("[data-id=45147]")[0].addEventListener("click", g$.onClick.bind(null, "onClick | 45177", false), false);$("[data-id=45129]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | ACEITOS | | toast", false), false);});