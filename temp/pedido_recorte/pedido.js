var banco = window.location.href.split("=")[2].split("&")[0],
    id = window.location.href.split("=")[1].split("&")[0],
    tmp = window.location.href.split("=")[3].split("&")[0],
    romaneio = window.location.href.split("=")[4].split("&")[0],
    OS = window.location.href.split("=")[5].split("&")[0],
    semFoto = window.location.href.split("=")[6].split("&")[0],
    caixaAlta = window.location.href.split("=")[7].split("&")[0],
    semsku = window.location.href.split("=")[8];

var altaCaixa = "caixaAlta";
if (!banco || !id) {
    window.location.href = "https://dys.net.br/";
}

if (caixaAlta == 0) {
    $('.caixaAlta').css("text-transform", "none");
    altaCaixa = "";
}

var subGeral;
$("#nPedido")[0].textContent = id;
var query = "select st.status, ped.id id, CONCAT(i.integracao,' : ',ped.integracao_pedido) integracao, ped.empresa_id, ped.descrServ, ped.descAdicional, emp.id as empresaID, emp.imagemLogo as Logo, emp.razao, emp.endereco, emp.numero, emp.complemento, emp.bairro, emp.cidade, emp.uf , emp.cep cep, emp.telefone, emp.email, emp.cnpj, emp.site, ped.obs_que_nao_sai_na_nota, ped.totalGeral, ped.frete, ped.subtotal as subtotal " +
    "from " + banco + ".pedido ped " +
    "left join " + banco + ".empresa emp on emp.id = ped.empresa_id " +
    "left join " + banco + ".status st on st.id = ped.status_id " +
    "LEFT JOIN " + banco + ".integracao i ON i.id = ped.integracao_id " +
    "WHERE ped.id = " + id + " LIMIT 1"
$.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
    $("#logo")[0].src = "https://dys.net.br/" + JSON.parse(localStorage.user).projeto + "/" + data.data[0].Logo;
    $("#logo2")[0].src = "https://dys.net.br/" + JSON.parse(localStorage.user).projeto + "/" + data.data[0].Logo;
    $("#nomeEmpresa")[0].textContent = data.data[0].razao;
    $("#statusPedido")[0].textContent = data.data[0].status;
    // $("#telEmpresa")[0].textContent = data.data[0].telefone;
    var complemento = (data.data[0].complemento) ? " - " + data.data[0].complemento : "";
    $("#endEmpresa")[0].textContent = data.data[0].endereco + " " + data.data[0].numero + complemento + ", " + data.data[0].bairro + " - " + data.data[0].cidade + " / " + data.data[0].uf;
    $("#cepEmpresa")[0].textContent = data.data[0].cep;
    // $("#cnpjEmpresa")[0].textContent = data.data[0].cnpj
    // $("#emailEmpresa")[0].textContent = data.data[0].email;
    // $("#siteEmpresa")[0].textContent = data.data[0].site
    // $("#descS")[0].textContent = data.data[0].descrServ;
    // $("#adicional")[0].textContent = data.data[0].descAdicional;
    $("#totalGeral")[0].textContent = (data.data[0].totalGeral).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    $("#frete")[0].textContent = (data.data[0].frete).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    $("#subtotal")[0].textContent = (data.data[0].subtotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    $("#integracao")[0].textContent = data.data[0].integracao;
    // if (data.data[0].obs_que_nao_sai_na_nota) {
    //     $("#observacao")[0].innerHTML = data.data[0].obs_que_nao_sai_na_nota;
    // }
    // else {
    //     $("#tiraObs")[0].style.display = "none";
    // }
    // document.getElementById("siteEmpresa").addEventListener("click", function () {
    //     window.open($("#siteEmpresa")[0].textContent, "_blank");
    // });
})

var query = "select pt.id prodId, pd.data, pd.dest_xNome, COALESCE(pd.dest_fone, cli.residencial, cli.residencial2) dest_fone,COALESCE(pd.dest_cell, cli.celular, cli.celular2) dest_cell, dest_cpf, dest_cnpj, dest_xCpl, pd.dest_xLgr, pd.dest_CEP,pd.dest_nro,pd.dest_xMun,pd.dest_UF, soli.razao as nomeSolic, " +
    "soli.email as emailSolic,soli.celular as celularSolic, vend.fantasia as nomeVend,vend.email as emailVend, " +
    "vend.residencial as telVend, pp.valor, pp.produto, pp.sku, pp.quantidade, pp.unidade, pp.desconto, " +
    "pp.desconto_percentual, pp.total, pd.prazoEntrega, pd.seguro, pd.frete, pd.orçamento, pt.imagem " +
    "from " + banco + ".pedido_produto pp " +
    "left join " + banco + ".pedido pd on pd.id = pp.pedido_id " +
    "left join " + banco + ".produto pt on pp.produto_id = pt.id " +
    "left join " + banco + ".cliente_fornecedor cli on cli.id = pd.cliente_fornecedor_id " +
    "left join " + banco + ".cliente_fornecedor soli on pd.solicitante_id = soli.id " +
    "left join " + banco + ".cliente_fornecedor vend on pd.vendedor_id = vend.id " +
    "where isnull(pp.ambiente_id) and pd.id = " + id;
$.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
    if (data.data.length > 0) {
        var produto = data.data, footTotal = 0, footDesconto = 0, sub = 0;
        produto.forEach(function (v, i) {
            if (v.produto) {
                var desconto = (v.desconto == null) ? 0.00 : v.desconto,
                    desconto_percentual = (v.desconto_percentual == null) ? "0,00" : (v.desconto_percentual).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                    total = (v.valor * v.quantidade) - v.desconto,
                    img;               
                sub = (v.valor * v.quantidade) + sub;
                subGeral = (v.valor * v.quantidade) + subGeral;
                footTotal = footTotal + total;
                footDesconto = footDesconto + parseFloat(desconto);

                var row = '<tr id="pedido_romaneio"> <td width="5">' + v.prodId + '</td> <td width="200">' + v.produto + '</td> <td width="50">' + (v.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td> <td width="40">' + (v.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td> <td width="80" style="text-align:right">' + (parseFloat(total)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) +'</td></tr>';
                
                $("#Produtos")[0].innerHTML += row;
            
            }
        });
        
        $("#data")[0].textContent = produto[0].data.split("-")[2].slice(0, 2) + "/" + produto[0].data.split("-")[1] + "/" + produto[0].data.split("-")[0];
        $("#nomeCliente")[0].textContent = produto[0].dest_xNome;
        $("#nomeCliente2")[0].textContent = produto[0].dest_xNome;
        $("#nomeCliente3")[0].textContent = produto[0].dest_xNome;
        $("#telCliente")[0].textContent = produto[0].dest_fone;
        $("#cellCliente")[0].textContent = produto[0].dest_cell;
        var Logradouro = (produto[0].dest_xLgr)?produto[0].dest_xLgr:'';
        var nro = (produto[0].dest_nro)?produto[0].dest_nro + ' - ':'';
        var cpls = (produto[0].dest_xCpl)?produto[0].dest_xCpl + ' - ':'';
        var mun = (produto[0].dest_xMun)?produto[0].dest_xMun + ',':'';
        var ufs = (produto[0].dest_UF)?produto[0].dest_UF:'';
        $("#endCliente")[0].textContent = Logradouro + " " + nro + cpls + mun + ufs;
        $("#endCliente2")[0].textContent = Logradouro + " " + nro + cpls + mun + ufs;
        $("#cepCliente")[0].textContent = produto[0].dest_CEP;
        $("#cepCliente2")[0].textContent = produto[0].dest_CEP;
        var cpf = (produto[0].dest_cpf)?produto[0].dest_cpf:'';
        var cnpj = (produto[0].dest_cnpj)?produto[0].dest_cnpj:'';
        if(!cpf && cnpj){
            $("#cpfCliente")[0].textContent = "CNPJ: " + cnpj.slice(0,2) + '.' + cnpj.slice(2,5) + '.' + cnpj.slice(5,8) + '/' + cnpj.slice(8,12) + '-' + cnpj.slice(12,14);        
        }
        if(!cnpj && cpf){
            $("#cpfCliente")[0].textContent = "CPF: "+cpf.slice(0,3) + "." + cpf.slice(3,6) + "." + cpf.slice(6,9) + "-" + cpf.slice(9,11);
        }
        var query2 = "select formadepagamento, vencimento,valor, desconto, COALESCE(custo_cartao,0) as custo_cartao from " + banco + ".financeiro fn left join " + banco + ".forma_de_pagamento fp on fp.id = fn.forma_de_pagamento_id where fn.pedido_id = " + id;
        $.post(URL + "/jsonQuery/", g$.trataQuery(query2)).then(function (data) {
            data = data.data;
            if(data[0]){
               $('#formaDePagamento')[0].textContent = data[0].formadepagamento;
            }
        })
        // $("#prazo")[0].textContent = produto[0].prazoEntrega;
        // $("#tipoFrete")[0].textContent = (produto[0].fretePorConta == 0) ? "emitente" : "destinatário";
        // $("#nomeDep")[0].textContent = produto[0].nomeVend;
        // $("#emailDep")[0].textContent = produto[0].emailVend;
        // $("#foneDep")[0].textContent = produto[0].telVend;
        var fretes = (produto[0].frete == null) ? 0 : produto[0].frete;        
        $("#frete")[0].textContent = fretes;
        var seguros = (produto[0].seguro > 0) ? '<tr class="foot"><td colspan="9"><b>Valor do Seguro:</b></td><td colspan="2"><b>R$ ' + (produto[0].seguro).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' : "";
        var footer = '<tr><td style="border:none;" colspan="10"></td></tr><tr><td style="border:none;" colspan="10"></td></tr><tr id="footer" class="foot"><td colspan="9"><b>Subtotal:</b></td><td colspan="2"><b>R$ ' + (sub).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' +
            '<tr class="foot"><td colspan="9"><b>Valor do Desconto:</b></td><td colspan="2"><b>R$ ' + (footDesconto).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' +
            '<tr class="foot"><td colspan="9"><b>Valor do Frete:</b></td><td colspan="2"><b>R$ ' + (fretes).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' +
            seguros +
            '<tr class="foot"><td colspan="9"><b>Total dos Produtos:</b></td><td colspan="2"><b>R$ ' + ((sub - footDesconto + fretes + produto[0].seguro)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>';
              
    } 
});


