var banco = window.location.href.split("=")[2].split("&")[0],
    plp = window.location.href.split("=")[1].split("&")[0],
    empresa = window.location.href.split("=")[3].split("&")[0];

var query = "select razao, email, telefone, numeroContratoCorreios from "+ banco +".empresa where id= "+ empresa
$.post(URL + "/jsonQuery/", g$.trataQuery(query.trim())).success(function (data) {
    $("#contrato")[0].textContent = data.data[0].numeroContratoCorreios
    $("#razao")[0].textContent = data.data[0].razao
    $("#email")[0].textContent = data.data[0].email
    $("#tel")[0].textContent = data.data[0].telefone
    var query2 = "select pd.id,pl.nplp, pd.transp_servico_de_postagem, tp.id_correio, tp.descricao from saas.pedido pd "+
                "left join saas.plp pl on pl.id = pd.plp "+
                "left join node.transp_servico_de_postagem tp on tp.transp_servico_de_postagem = pd.transp_servico_de_postagem "+
                "where pd.plp = " + plp;
    $.post(URL + "/jsonQuery/", g$.trataQuery(query2.trim())).success(function (data) {
        var size = data.data.length
        JsBarcode("#barcode", data.data[0].nplp, {
        width:2,
        height:50,
        displayValue: false
        });
        $("#plps")[0].textContent = data.data[0].nplp;
        data.data.forEach(function(v,i){
            if(!$("#"+ v.id_correio)[0]){
                var tmp = '<div class="col s3 pd" id="'+ v.id_correio +'"><label>'+ v.id_correio +'</label></div><div class="col s3"><label id="contador'+ v.id_correio +'"></label></div><div class="col s3"><label>'+ v.descricao +'</label></div>';
                $("#qtd")[0].innerHTML += tmp;
                $("#contador"+ v.id_correio)[0].textContent = 1;
            }
            else{
                $("#contador"+ v.id_correio)[0].textContent = parseInt($("#contador"+ v.id_correio)[0].textContent) + 1
            }
            if(size == i + 1){
                $("#etqplp2")[0].innerHTML = $("#etqplp")[0].innerHTML
            }
        })
    })
})