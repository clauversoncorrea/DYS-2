app.controller('Pesquisas1072', function ($scope){ g$.configTela('Pesquisas');g$.memo("memo | memo1 | 1=1", true);g$.memo("memo | memo20 | 1=1", true);g$.memo("memo | memo5 | pg1", true);g$.atualizarTabela("atualizarTabela | 54132", true);$("[data-id=54139]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 54129", false), false);$("[data-id=54150]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo1 | pg1 = '»54150»'|'»54150»'<>''", false), false);$("[data-id=54150]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo1 | 1=1|'»54150»'=''", false), false);$("[data-id=54194]")[0].addEventListener("click", g$.limparDadosView.bind(null, "limparDadosView | 54129", false), false);$("[data-id=54195]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo1 | 1=1", false), false);$("[data-id=54218]")[0].addEventListener("click", g$.showHide.bind(null, "showHide | 54217", false), false);$("[data-id=54250]")[0].addEventListener("change", g$.onClick.bind(null, "onClick | 54251", false), false);$("[data-id=54251]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade |54154¦54156 |disabled| true| '»54250»'<>''", false), false);$("[data-id=54251]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade |54154¦54156 |disabled| false| '»54250»'=''", false), false);$("[data-id=54251]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade |54250|disabled| true| '»54154»'<>''", false), false);$("[data-id=54251]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade |54250|disabled| true| '»54156»'<>''", false), false);$("[data-id=54251]")[0].addEventListener("click", g$.alteraPropriedade.bind(null, "alteraPropriedade |54250|disabled| false| '»54156»'=''¦'»54154»'=''", false), false);$("[data-id=54154]")[0].addEventListener("blur", g$.onClick.bind(null, "onClick | 54251", false), false);$("[data-id=54156]")[0].addEventListener("blur", g$.onClick.bind(null, "onClick | 54251", false), false);$("[data-id=54250]")[0].addEventListener("change", g$.memo.bind(null, "memo | memo1 | MONTH(data)= »54250»", false), false);$("[data-id=54127]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 54221", false), false);$("[data-id=54259]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo20 |comentario rlike '»54230»'|'»54230»'<>''", false), false);$("[data-id=54259]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo20 |1=1|'»54230»'=''", false), false);$("[data-id=54262]")[0].addEventListener("click", g$.mensagem.bind(null, "mensagem | Ao pesquisar pelo Mês, será considerado o ano atual na busca", false), false);$("[data-id=54194]")[0].addEventListener("click", g$.onClick.bind(null, "onClick | 54195", false), false);$("[data-id=54195]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo1 | »memo1» AND pg1 = '»54150»' | '»54150»'<>''", false), false);$("[data-id=54195]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo1 | »memo1» AND data BETWEEN '»54154»' AND '»54156»' | '»54154»' <> '' ¦ '»54156»' <> ''", false), false);$("[data-id=54195]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo1 | »memo1» AND data > '»54154»' | '»54154»' <> '' ¦ '»54156»' = ''", false), false);$("[data-id=54195]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo1 | »memo1» AND data < '»54156»' | '»54154»' = '' ¦ '»54156»' <> ''", false), false);$("[data-id=54195]")[0].addEventListener("click", g$.memo.bind(null, "memo | memo1 | »memo1» AND month(data) = '»54250»' | '»54250»' <> ''", false), false);$("[data-id=54195]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 54132", false), false);$("[data-id=54194]")[0].addEventListener("click", g$.onClick.bind(null, "onClick | 54251", false), false);$("[data-id=54259]")[0].addEventListener("click", g$.atualizarTabela.bind(null, "atualizarTabela | 54221", false), false);});