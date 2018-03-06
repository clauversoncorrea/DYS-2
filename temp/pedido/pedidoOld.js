// var banco = window.location.href.split("=")[2].split("&")[0],
//     id = window.location.href.split("=")[1].split("&")[0],
//     tmp = window.location.href.split("=")[3]
// if(!banco || !id){
//     window.location.href = "http://dysweb.dys.com.br/";
// }
var app = angular.module("myApp",[]);
app.controller("ped", function ($scope, $http, $rootScope, $timeout) {
var pedido = "66981";
$http.get("/getold/" + pedido).then(function(data){
    var k = data;
    // $("#logo")[0].src = "../../magestetica/logogrande.png"
    $("#nomeEmpresa")[0].textContent = data.data[0].razão;
    // $("#telEmpresa")[0].textContent = data.data[0].telefone
    // $("#endEmpresa")[0].textContent = data.data[0].endereco
    // $("#cnpjEmpresa")[0].textContent = data.data[0].cnpj
    // $("#emailEmpresa")[0].textContent = data.data[0].email
    // $("#siteEmpresa")[0].textContent = data.data[0].site
    var produto = data.data, footTotal = 0, footDesconto = 0
    produto.forEach(function(v,i){
        var desconto = (v.desconto == null)?"0,00":v.desconto,
            desconto_percentual = (v.desconto_percentual == null)?"0,00":v.desconto_percentual,
            total = (v.valor * v.quantidade) - v.desconto
        footTotal = footTotal + total
        footDesconto = footDesconto + parseFloat(desconto)
        var row = '<tr><td class="center">'+ parseInt(i + 1) +'</td><td class="center">'+ 'imagem' +'</td><td class="center">'+ v.sku +'</td>' + 
                  '<td class="center">'+ v.produto +'</td><td class="center">'+ v.quantidade +'</td><td class="center">'+ v.unidade +'</td>' +
                  '<td class="right">R$ '+ v.valor +'</td><td class="right">R$ '+ v.total +'</td><td class="right">R$ '+ desconto +'</td>' + 
    '<td class="right">'+ desconto_percentual +'</td><td class="right">R$ '+ parseFloat(total.toFixed(2)) +'</td></tr>'
        $("tbody")[0].innerHTML += row;
    })
    if(produto[0].orçamento == 1){
        $("#ped")[0].textContent = "Orçamento: "
    }
    $("#data")[0].textContent = produto[0].data.split("-")[2].slice(0,2) + "/" + produto[0].data.split("-")[1] + "/" + produto[0].data.split("-")[0];
    $("#nomeCliente")[0].textContent = produto[0].dest_xNome
    $("#telCliente")[0].textContent = produto[0].dest_fone
    $("#endCliente")[0].textContent = produto[0].dest_xLgr
    $("#cepCliente")[0].textContent = produto[0].dest_CEP
    $("#solicNome")[0].textContent = produto[0].nomeSolic
    $("#solicEmail")[0].textContent = produto[0].emailSolic
    $("#solicCel")[0].textContent = produto[0].celularSolic
    $("#nPedido")[0].textContent = id
    $("#recibo")[0].textContent = ""
    $("#prazo")[0].textContent = produto[0].prazoEntrega
    $("#tipoFrete")[0].textContent = (produto[0].fretePorConta == 0)?"emitente":"destinatário";
    $("#nomeDep")[0].textContent = produto[0].nomeVend
    $("#emailDep")[0].textContent = produto[0].emailVend
    $("#foneDep")[0].textContent = produto[0].telVend
    var fretes = (produto[0].frete == null)?0:produto[0].frete
    var footer = '<tr id="footer" class="foot"><td colspan="9"><b>Subtotal:</b></td><td colspan="2"><b>R$ '+ footTotal +'</b></td></tr>' + 
                 '<tr class="foot"><td colspan="9"><b>Valor do Desconto:</b></td><td colspan="2"><b>R$ '+ footDesconto +'</b></td></tr>' +
                 '<tr class="foot"><td colspan="9"><b>Valor do Frete:</b></td><td colspan="2"><b>R$ '+ fretes +'</b></td></tr>' + 
                 '<tr class="foot"><td colspan="9"><b>Valor do Seguro:</b></td><td colspan="2"><b>R$ '+ produto[0].seguro +'</b></td></tr>' + 
                 '<tr class="foot"><td colspan="9"><b>Total Geral:</b></td><td colspan="2"><b>R$ '+ (footTotal - footDesconto + fretes) +'</b></td></tr>'
    $("tbody")[0].innerHTML += footer;
})











// var query = "select ped.id, ped.empresa_id, emp.id as empresaID, emp.imagemLogo as Logo, emp.razao, emp.endereco, emp.telefone, emp.email, emp.cnpj, emp.site " + 
//             "from " + banco + ".pedido ped " +
//             "left join " + banco + ".empresa emp on emp.id = ped.empresa_id "+
//             "WHERE ped.id = "+ id +" LIMIT 1"
// $.get("/getold/" + query).then(function(data){
// })

// var query = "select pd.data, pd.dest_xNome, pd.dest_fone, pd.dest_xLgr, pd.dest_CEP, soli.fantasia as nomeSolic, "+
//             "soli.email as emailSolic,soli.celular as celularSolic, vend.fantasia as nomeVend,vend.email as emailVend, "+
//             "vend.residencial as telVend, pp.valor, pp.produto, pp.sku, pp.quantidade, pp.unidade, pp.desconto, "+
//             "pp.desconto_percentual, pp.total, pd.prazoEntrega, pd.seguro, pd.frete "+
//             "from "+ banco +".pedido pd "+
//             "left join "+ banco +".pedido_produto pp on pd.id = pp.pedido_id "+
//             "left join "+ banco +".produto_imagem pi on pp.produto_id = pi.produto_id "+
//             "left join "+ banco +".cliente_fornecedor soli on pd.solicitante_id = soli.id "+
//             "left join "+ banco +".cliente_fornecedor vend on pd.vendedor_id = vend.id "+
//             "where pd.id = "+ id
// $.get("/getold/" + query).then(function(data){
//     var query = "Select template from " + banco + ".termos_condicoes where id=" + tmp;
    // $.get("/getold/" + query).then(function(data){
    //     if(tmp){
    //         template = data.data[0].template.replace(/<t>/g,"<h2>").replace(/<\/t>/g,"<\/h2>").replace(/\\n/g,"");
    //         $("#termo")[0].querySelectorAll("div")[1].innerHTML = template;
    //         $("#termo")[0].style.display = "block";
    //     }
    // }) 
// })


    
})
