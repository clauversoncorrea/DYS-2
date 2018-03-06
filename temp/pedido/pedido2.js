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
if (OS == 0) {
    $("#OS")[0].style.display = "none";
} else {
    $("#condEnt")[0].style.display = 'none';
    $("#dep")[0].style.display = 'none';
}
if (caixaAlta == 0) {
    $('.caixaAlta').css("text-transform", "none");
    altaCaixa = "";
}

var subGeral;
$("#nPedido")[0].textContent = id;
var query = "select ped.id, CONCAT(i.integracao,' : ',ped.integracao_pedido) integracao, ped.empresa_id, ped.descrServ, ped.descAdicional, emp.id as empresaID, emp.imagemLogo as Logo, emp.razao, emp.endereco, emp.numero, emp.complemento, emp.bairro, emp.cidade, emp.uf , emp.telefone, emp.email, emp.cnpj, emp.site, ped.obs_que_nao_sai_na_nota, IF(ped.tipo_movimentacao = 'compra',ped.totalGeralCompra, ped.totalGeral) totalGeral " +
    "from " + banco + ".pedido ped " +
    "left join " + banco + ".empresa emp on emp.id = ped.empresa_id " +
    "LEFT JOIN " + banco + ".integracao i ON i.id = ped.integracao_id " +
    "WHERE ped.id = " + id + " LIMIT 1"
$.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
    console.log(data.query);
    $("#logo")[0].src = "https://dys.net.br/" + JSON.parse(localStorage.user).projeto + "/" + data.data[0].Logo;
    $("#nomeEmpresa")[0].textContent = data.data[0].razao;
    $("#telEmpresa")[0].textContent = data.data[0].telefone;
    var complemento = (data.data[0].complemento) ? " - " + data.data[0].complemento : "";
    $("#endEmpresa")[0].textContent = data.data[0].endereco + " " + data.data[0].numero + complemento + ", " + data.data[0].bairro + " - " + data.data[0].cidade + ", " + data.data[0].uf;
    // $("#cnpjEmpresa")[0].textContent = data.data[0].cnpj
    $("#emailEmpresa")[0].textContent = data.data[0].email;
    // $("#siteEmpresa")[0].textContent = data.data[0].site
    $("#descS")[0].textContent = data.data[0].descrServ;
    $("#adicional")[0].textContent = data.data[0].descAdicional;
    $("#integracao")[0].textContent = data.data[0].integracao;
    $("#totalGeral")[0].textContent = (data.data[0].totalGeral).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    if (data.data[0].obs_que_nao_sai_na_nota) {
        $("#observacao")[0].innerHTML = data.data[0].obs_que_nao_sai_na_nota;
    }
    else {
        $("#tiraObs")[0].style.display = "none";
    }
    // document.getElementById("siteEmpresa").addEventListener("click", function () {
    //     window.open($("#siteEmpresa")[0].textContent, "_blank");
    // });
})

var query = "SELECT pd.data, COALESCE(pd.dest_xNome,cli.razao) dest_xNome, COALESCE(pd.dest_fone, cli.residencial, cli.residencial2) dest_fone, " +
    "COALESCE(pd.dest_cell, cli.celular, cli.celular2) dest_cell, COALESCE(dest_cpf,cli.cpf) dest_cpf, COALESCE(dest_cnpj,cli.cnpj) dest_cnpj, " +
    "COALESCE(dest_xCpl,cli.entrComplemento) dest_xCpl, COALESCE(pd.dest_xLgr,cli.entrEndereco) dest_xLgr, " +
    "COALESCE(pd.dest_CEP,cli.entrCep) dest_CEP, COALESCE(pd.dest_nro,cli.entrNumero) dest_nro, COALESCE(pd.dest_xMun,cli.entrCidade) dest_xMun, " +
    "COALESCE(pd.dest_UF,cli.entrUf) dest_UF, soli.razao as nomeSolic, soli.email as emailSolic, soli.celular as celularSolic, " +
    "vend.fantasia as nomeVend, vend.email as emailVend, vend.residencial as telVend, " +
    "IF (pd.tipo_movimentacao = 'compra',COALESCE(pp.preco_de_custo,pt.custo),pp.valor) valor, pp.produto, pp.sku, pp.quantidade, pp.unidade, " +
    "pp.desconto, pp.desconto_percentual, IF (pd.tipo_movimentacao = 'compra',COALESCE(COALESCE(pp.preco_de_custo,pt.custo) * pp.quantidade,0),pp.total) total, " +
    "pd.prazoEntrega, pd.seguro, IF (pd.tipo_movimentacao = 'compra',pd.freteCompra,pd.frete) frete, pd.orçamento, pt.imagem" +
    "from " + banco + ".pedido_produto pp " +
    "left join " + banco + ".pedido pd on pd.id = pp.pedido_id " +
    "left join " + banco + ".produto pt on pp.produto_id = pt.id " +
    "left join " + banco + ".cliente_fornecedor cli on cli.id = pd.cliente_fornecedor_id " +
    "left join " + banco + ".cliente_fornecedor soli on pd.solicitante_id = soli.id " +
    "left join " + banco + ".cliente_fornecedor vend on pd.vendedor_id = vend.id " +
    "where isnull(pp.ambiente_id) and pd.id = " + id;
$.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
    console.log(data.query);
    if (data.data.length > 0) {
        var produto = data.data, footTotal = 0, footDesconto = 0, sub = 0;
        produto.forEach(function (v, i) {
            if (v.produto) {
                var desconto = (v.desconto == null) ? 0.00 : v.desconto,
                    desconto_percentual = (v.desconto_percentual == null) ? "0,00" : (v.desconto_percentual).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                    total = (v.valor * v.quantidade) - v.desconto,
                    img;
                if (semFoto == 0) {
                    if (v.imagem) {
                        if (v.imagem.indexOf("http") == -1) {
                            img = '<td><img src="https://dys.net.br/' + JSON.parse(localStorage.user).projeto + '/' + v.imagem + '"></td>';
                        } else {
                            img = '<td><img src=' + v.imagem + '></td>';
                        }
                    } else {
                        img = '<td><img src="https://dys.net.br/img/sem-imagem.jpg"></td>';
                    }
                } else {
                    $("#imgTH")[0].style.display = "none";
                    img = '';
                }
                sub = (v.valor * v.quantidade) + sub;
                subGeral = (v.valor * v.quantidade) + subGeral;
                footTotal = footTotal + total;
                footDesconto = footDesconto + parseFloat(desconto);
                var sku
                if (semsku == 0) {
                    sku = (v.sku) ? '<td class="center ' + altaCaixa + '">' + v.sku + '</td>' : '<td class="center ' + altaCaixa + '"></td>';
                } else {
                    sku = "";
                    $("#skuTH")[0].style.display = 'none';
                }
                if (romaneio == 0) {
                    var row = '<tr><td class="center">' + parseInt(i + 1) + '</td>' + img + sku +
                        '<td class="' + altaCaixa + '" style="text-align:left">' + v.produto + '</td><td class="center">' + (v.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td><td class="center">' + v.unidade + '</td>' +
                        '<td class="right">R$ ' + (v.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td><td class="right">R$ ' + ((v.valor * v.quantidade)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td><td class="right">R$ ' + (desconto).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td>' +
                        '<td class="right">' + desconto_percentual + '</td><td class="right">R$ ' + (parseFloat(total)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td></tr>';
                } else {
                    $("#total_pedido")[0].style.display = "none";
                    $("#recibo_pag")[0].style.display = "none";
                    $("#condEnt")[0].style.display = "none";
                    $("#dep")[0].style.display = "none";
                    $("#pedido_romaneio")[0].innerHTML = '<th class="center" width="5">Item</th><th class="center" width="7">Sku</th><th width="400">Equipamentos e Serviços</th>' +
                        '<th class="center" width="5">Qt</th><th class="center" width="5">Unid</th><th>Observação</th>';
                    var row = '<tr><td class="center">' + parseInt(i + 1) + '</td>' + sku +
                        '<td style="text-align:left;">' + v.produto + '</td><td class="center">' + (v.quantidade.toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td><td class="center">' + v.unidade + '</td><td></td>' +
                        '</tr>';
                }
                $("#Produtos")[0].innerHTML += row;
            } else {
                $("#tabelaSemAmbiente")[0].style.display = "none";
            }
        })
        if (produto[0].orçamento == 1) {
            $("#ped")[0].textContent = "Orçamento: ";
            $("#totalPed_Orc")[0].textContent = "Orçamento: ";
        }


        $("#data")[0].textContent = produto[0].data.split("-")[2].slice(0, 2) + "/" + produto[0].data.split("-")[1] + "/" + produto[0].data.split("-")[0];
        $("#nomeCliente")[0].textContent = produto[0].dest_xNome;
        $("#telCliente")[0].textContent = produto[0].dest_fone;
        $("#cellCliente")[0].textContent = produto[0].dest_cell;
        var Logradouro = (produto[0].dest_xLgr) ? produto[0].dest_xLgr : '';
        var nro = (produto[0].dest_nro) ? produto[0].dest_nro + ' - ' : '';
        var cpls = (produto[0].dest_xCpl) ? produto[0].dest_xCpl + ' - ' : '';
        var mun = (produto[0].dest_xMun) ? produto[0].dest_xMun + ',' : '';
        var ufs = (produto[0].dest_UF) ? produto[0].dest_UF : '';
        $("#endCliente")[0].textContent = Logradouro + " " + nro + cpls + mun + ufs;
        $("#cepCliente")[0].textContent = produto[0].dest_CEP;
        var cpf = (produto[0].dest_cpf) ? produto[0].dest_cpf : '';
        var cnpj = (produto[0].dest_cnpj) ? produto[0].dest_cnpj : '';
        if (!cpf && cnpj) {
            $("#cpfCliente")[0].textContent = "CNPJ: " + cnpj.slice(0, 2) + '.' + cnpj.slice(2, 5) + '.' + cnpj.slice(5, 8) + '/' + cnpj.slice(8, 12) + '-' + cnpj.slice(12, 14);
        }
        if (!cnpj && cpf) {
            $("#cpfCliente")[0].textContent = "CPF: " + cpf.slice(0, 3) + "." + cpf.slice(3, 6) + "." + cpf.slice(6, 9) + "-" + cpf.slice(9, 11);
        }
        if (produto[0].nomeSolic == null) {
            $("#campoSolic")[0].style.display = "none";
        }
        $("#solicNome")[0].textContent = (produto[0].nomeSolic == null) ? "" : "Solicitado Por: " + produto[0].nomeSolic;
        $("#solicEmail")[0].textContent = (produto[0].emailSolic == null) ? "" : "Email: " + produto[0].emailSolic;
        $("#solicCel")[0].textContent = (produto[0].celularSolic == null) ? "" : "Cel: " + produto[0].celularSolic;
        var query2 = "select formadepagamento, vencimento,valor, desconto, COALESCE(custo_cartao,0) as custo_cartao from " + banco + ".financeiro fn left join " + banco + ".forma_de_pagamento fp on fp.id = fn.forma_de_pagamento_id where fn.pedido_id = " + id;
        $.post(URL + "/jsonQuery/", g$.trataQuery(query2)).then(function (data) {
            console.log(data.query);
            data = data.data;
            if (data.length) {
                data.forEach(function (v, i) {
                    var venc = (!v.vencimento) ? "" : v.vencimento.split("-")[2].slice(0, 2) + "/" + v.vencimento.split("-")[1] + "/" + v.vencimento.split("-")[0];
                    var desc = (!v.desconto) ? "" : '- Desconto = R$ ' + (v.desconto).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                    var tmp = '<p>' + v.formadepagamento + ' - ' + venc + desc + ' - Valor = R$ ' + (v.valor - v.custo_cartao).toLocaleString('pt-BR', { minimumFractionDigits: 2 }); +'</p><br>';
                    $("#recibo")[0].innerHTML += tmp;
                })
            } else {
                $("#recibo_pag")[0].style.display = 'none';
            }
        })
        $("#prazo")[0].textContent = produto[0].prazoEntrega;
        $("#tipoFrete")[0].textContent = (produto[0].fretePorConta == 0) ? "emitente" : "destinatário";
        $("#nomeDep")[0].textContent = produto[0].nomeVend;
        $("#emailDep")[0].textContent = produto[0].emailVend;
        $("#foneDep")[0].textContent = produto[0].telVend;
        var fretes = (produto[0].frete == null) ? 0 : produto[0].frete;
        var seguros = (produto[0].seguro > 0) ? '<tr class="foot"><td colspan="9"><b>Valor do Seguro:</b></td><td colspan="2"><b>R$ ' + (produto[0].seguro).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' : "";
        var footer = '<tr><td style="border:none;" colspan="10"></td></tr><tr><td style="border:none;" colspan="10"></td></tr><tr id="footer" class="foot"><td colspan="9"><b>Subtotal:</b></td><td colspan="2"><b>R$ ' + (sub).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' +
            '<tr class="foot"><td colspan="9"><b>Valor do Desconto:</b></td><td colspan="2"><b>R$ ' + (footDesconto).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' +
            '<tr class="foot"><td colspan="9"><b>Valor do Frete:</b></td><td colspan="2"><b>R$ ' + (fretes).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' +
            seguros +
            '<tr class="foot"><td colspan="9"><b>Total dos Produtos:</b></td><td colspan="2"><b>R$ ' + ((sub - footDesconto + fretes + produto[0].seguro)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>';
        if (romaneio == 0) {
            $("#Produtos")[0].innerHTML += footer;
        }
        var query = "Select template from " + banco + ".termos_condicoes where id=" + tmp;
        $.post(URL + "/jsonQuery/", g$.trataQuery(query)).then(function (data) {
            console.log(data.query);
            if (tmp) {
                if (data.data.length) {
                    template = data.data[0].template.replace(/<t>/g, "<h2>").replace(/<\/t>/g, "<\/h2>").replace(/\\n/g, "");
                    $("#termo")[0].querySelectorAll("div")[1].innerHTML = template;
                    $("#termo")[0].style.display = "block";
                }
            }
        });
    } else {
        $("#tabelaSemAmbiente")[0].style.display = "none";
    }
});
var queryServico = "select s.pedido_id,p.produto,s.quantidade,s.preco_unitario,s.totalGeral,s.desconto from " + banco + ".pedido_servico s left join " + banco + ".produto p on p.id = s.produto_id where pedido_id = " + id;
$.post(URL + "/jsonQuery/", g$.trataQuery(queryServico)).then(function (data) {
    console.log(data.query);
    if (data.data.length > 0) {
        var servico = data.data,
            ultimo = data.data.length - 1, totalServ = 0, subServ = 0, descontoServ = 0;
        servico.forEach(function (k, l) {
            var desconto = (k.desconto == null) ? 0.00 : k.desconto;
            totalServ = parseFloat(k.totalGeral) + parseFloat(totalServ);
            descontoServ = parseFloat(desconto) + parseFloat(descontoServ);
            subServ = parseFloat(k.quantidade * k.preco_unitario) + parseFloat(subServ);
            var tabelaServicos = "<tr><td class='center'>" + (l + 1) + "</td><td class='center'>" + k.produto + "</td><td class='center'>" + k.quantidade + "</td><td class='right'>R$ " + (k.preco_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + "</td><td class='right'>R$ " + (desconto).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + "</td><td class='right'>R$ " + (k.totalGeral).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + "</td></tr>";
            $("#Servicos")[0].innerHTML += tabelaServicos;
            if (l == ultimo) {
                $("#Servicos")[0].innerHTML += "<tr class='foot'><td colspan='5'><b>SubTotal:</b></td><td><b>R$ " + (subServ).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + "</b></td></tr>";
                $("#Servicos")[0].innerHTML += "<tr class='foot'><td colspan='5'><b>Desconto:</b></td><td><b>R$ " + (descontoServ).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + "</b></td></tr>";
                $("#Servicos")[0].innerHTML += "<tr class='foot'><td colspan='5'><b>Total Geral:</b></td><td><b>R$ " + (totalServ).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + "</b></td></tr>";
            }
        });
    }
    else {
        $("#serv")[0].style.display = "none";
    }
});
var queryAmbientes = "select pd.data, pd.orçamento, pd.dest_xNome, COALESCE(pd.dest_fone, cli.residencial, cli.residencial2) dest_fone,COALESCE(pd.dest_cell, cli.celular, cli.celular2) dest_cell, pd.dest_cpf, dest_xCpl, pd.dest_xLgr, pd.dest_CEP,pd.dest_nro,pd.dest_xMun,pd.dest_UF, soli.fantasia as nomeSolic, " +
    "soli.email as emailSolic,soli.celular as celularSolic, vend.fantasia as nomeVend,vend.email as emailVend, " +
    "vend.residencial as telVend, IF (pd.tipo_movimentacao = 'compra',COALESCE(pp.preco_de_custo,pt.custo),pp.valor) valor, pp.produto, pp.sku, pp.quantidade, pp.unidade, pp.desconto, " +
    "pp.desconto_percentual, IF (pd.tipo_movimentacao = 'compra',COALESCE(COALESCE(pp.preco_de_custo,pt.custo) * pp.quantidade,0),pp.total) total, pd.prazoEntrega, pd.seguro, IF (pd.tipo_movimentacao = 'compra',pd.freteCompra,pd.frete) frete, pd.orçamento,amb.nome as Ambiente, pt.imagem,amb.id as ambienteID " +
    "from " + banco + ".pedido pd " +
    "left join " + banco + ".pedido_produto pp on pd.id = pp.pedido_id " +
    "left join " + banco + ".produto_imagem pi on pp.produto_id = pi.produto_id " +
    "left join " + banco + ".cliente_fornecedor cli on cli.id = pd.cliente_fornecedor_id " +
    "left join " + banco + ".cliente_fornecedor soli on pd.solicitante_id = soli.id " +
    "left join " + banco + ".cliente_fornecedor vend on pd.vendedor_id = vend.id " +
    "left join " + banco + ".ambientes amb on amb.id = pp.ambiente_id " +
    "left join " + banco + ".produto pt on pt.id = pp.produto_id " +
    "where not isnull(pp.ambiente_id) and pd.id = " + id + " order by amb.nome";
$.post(URL + "/jsonQuery/", g$.trataQuery(queryAmbientes)).then(function (data) {
    console.log(data.query);
    var produto = data.data, footTotal = 0, footDesconto = 0, sub = 0, ultimo = produto.length - 1;
    if (produto.length) {
        if (produto[0].orçamento == 1) {
            $("#ped")[0].textContent = "Orçamento: ";
            $("#totalPed_Orc")[0].textContent = "Orçamento: ";
        }
        $("#data")[0].textContent = produto[0].data.split("-")[2].slice(0, 2) + "/" + produto[0].data.split("-")[1] + "/" + produto[0].data.split("-")[0];
        $("#nomeCliente")[0].textContent = produto[0].dest_xNome;
        $("#telCliente")[0].textContent = produto[0].dest_fone;
        $("#cellCliente")[0].textContent = produto[0].dest_cell;
        var Logradouro = (produto[0].dest_xLgr) ? produto[0].dest_xLgr : '';
        var nro = (produto[0].dest_nro) ? produto[0].dest_nro + ' - ' : '';
        var cpls = (produto[0].dest_xCpl) ? produto[0].dest_xCpl + ' - ' : '';
        var mun = (produto[0].dest_xMun) ? produto[0].dest_xMun + ',' : '';
        var ufs = (produto[0].dest_UF) ? produto[0].dest_UF : '';
        $("#endCliente")[0].textContent = Logradouro + " " + nro + cpls + mun + ufs;
        $("#cepCliente")[0].textContent = produto[0].dest_CEP;
        var cpf = (produto[0].dest_cpf) ? produto[0].dest_cpf : '';
        var cnpj = (produto[0].dest_cnpj) ? produto[0].dest_cnpj : '';
        if (!cpf && cnpj) {
            $("#cpfCliente")[0].textContent = "CNPJ: " + cnpj.slice(0, 2) + '.' + cnpj.slice(2, 4) + '.' + cnpj.slice(4, 6) + '/' + cnpj.slice(6, 10) + '-' + cnpj.slice(10, 12);
        }
        if (!cnpj && cpf) {
            $("#cpfCliente")[0].textContent = "CPF: " + cpf.slice(0, 3) + "." + cpf.slice(3, 6) + "." + cpf.slice(6, 9) + "-" + cpf.slice(9, 11);
        }
        if (produto[0].nomeSolic == null) {
            $("#campoSolic")[0].style.display = "none";
        }
        $("#solicNome")[0].textContent = (produto[0].nomeSolic == null) ? "" : "Solicitado Por: " + produto[0].nomeSolic;
        $("#solicEmail")[0].textContent = (produto[0].emailSolic == null) ? "" : "Email: " + produto[0].emailSolic;
        $("#solicCel")[0].textContent = (produto[0].celularSolic == null) ? "" : "Cel: " + produto[0].celularSolic;
        var query2 = "select formadepagamento, vencimento,valor, desconto from " + banco + ".financeiro fn left join " + banco + ".forma_de_pagamento fp on fp.id = fn.forma_de_pagamento_id where fn.pedido_id = " + id;
        $.post(URL + "/jsonQuery/", g$.trataQuery(query2)).then(function (data) {
            data = data.data;
            data.forEach(function (v, i) {
                var venc = (!v.vencimento) ? "" : " - " + v.vencimento.split("-")[2].slice(0, 2) + "/" + v.vencimento.split("-")[1] + "/" + v.vencimento.split("-")[0];
                var desc = (!v.desconto) ? "" : '- Desconto = R$ ' + (v.desconto).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                var tmp = '<p>' + v.formadepagamento + venc + desc + ' - Valor = R$ ' + (v.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }); +'</p><br>';
                $("#recibo")[0].innerHTML += tmp;
            })
        })
        $("#prazo")[0].textContent = produto[0].prazoEntrega;
        $("#tipoFrete")[0].textContent = (produto[0].fretePorConta == 0) ? "emitente" : "destinatário";
        $("#nomeDep")[0].textContent = produto[0].nomeVend;
        $("#emailDep")[0].textContent = produto[0].emailVend;
        $("#foneDep")[0].textContent = produto[0].telVend;
        produto.forEach(function (v, i) {
            var desconto = (v.desconto == null) ? 0.00 : v.desconto,
                desconto_percentual = (v.desconto_percentual == null) ? "0,00" : (v.desconto_percentual).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                total = (v.valor * v.quantidade) - v.desconto, img, imgHeader = "<th class='center' width='14%'>Imagem</th>";
            if (semFoto == 0) {
                if (v.imagem) {
                    if (v.imagem.indexOf("http") == -1) {
                        img = '<td><img src="https://dys.net.br/' + JSON.parse(localStorage.user).projeto + '/' + v.imagem + '"></td>';
                    } else {
                        img = '<td><img src=' + v.imagem + '></td>';
                    }
                } else {
                    img = '<td><img src="https://dys.net.br/img/sem-imagem.jpg"></td>';
                }
            } else {
                imgHeader = "";
                img = '';
            }
            var sku, skuHeader
            if (semsku == 0) {
                skuHeader = "<th class='center' width='17'>Sku</th>"
                sku = (v.sku) ? '<td class="center ' + altaCaixa + '">' + v.sku + '</td>' : '<td class="center ' + altaCaixa + '"></td>';
            } else {
                skuHeader = '';
                sku = "";
                $("#skuTH")[0].style.display = 'none';
            }
            subGeral = (v.valor * v.quantidade) + subGeral;
            sub = (v.valor * v.quantidade) + sub;
            footTotal = footTotal + total;
            footDesconto = footDesconto + parseFloat(desconto);
            var row = '<tr><td class="center">' + parseInt(i + 1) + '</td>' + img + sku +
                '<td class="center">' + v.produto.toUpperCase() + '</td><td class="center">' + (v.quantidade.toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td><td class="center">' + v.unidade + '</td>' +
                '<td class="right">R$ ' + (v.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td><td class="right">R$ ' + ((v.valor * v.quantidade)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td><td class="right">R$ ' + (desconto).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td>' +
                '<td class="right">' + desconto_percentual + '</td><td class="right">R$ ' + (parseFloat(total)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</td></tr>';
            var ambienteTratado = v.ambienteID + "amb";
            if (!$("#" + ambienteTratado)[0]) {
                var tempTabela = "<div class='bottom center' id='" + ambienteTratado + "'><p><b>" + v.Ambiente + "</b></p><table width='750'><thead><tr>" +
                    "<th class='center' width='15'>Item</th>" +
                    imgHeader + skuHeader +
                    // "<th class='center' width='17'>Sku</th>" +
                    "<th class='center' width='1200'>Equipamentos e Serviços</th>" +
                    "<th class='center' width='15'>Qt</th>" +
                    "<th class='center' width='15'>Unid</th>" +
                    "<th class='center' width='150'>Unit</th>" +
                    "<th class='center' width='150'>Subtotal</th>" +
                    "<th class='center' width='150'>Desc</th>" +
                    "<th class='center' width='140'>%</th>" +
                    "<th class='center' width='150'>Total</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody id='body" + ambienteTratado + "'>" +
                    "</tbody>" +
                    "</table>" +
                    "</div>";
                $("#tabelas")[0].innerHTML += tempTabela;
            }
            $("#body" + ambienteTratado)[0].innerHTML += row;
            if (!$("#foot" + ambienteTratado)[0]) {
                var footer = '<tr id="foot' + ambienteTratado + '" class="foot"><td colspan="9"><b>Total ' + v.Ambiente + ':</b></td><td class="bold" colspan="2" id="valorFoot' + ambienteTratado.replace(",", ".") + '"><b>0</b></td></tr>';
                $("#body" + ambienteTratado)[0].innerHTML += footer;
                $("#valorFoot" + ambienteTratado)[0].textContent = "R$" + (parseFloat($("#valorFoot" + ambienteTratado)[0].textContent.replace(",", ".")) + (parseFloat(v.valor * v.quantidade))).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            } else {
                var anterior = parseFloat($("#valorFoot" + ambienteTratado)[0].textContent.replace("R$", "").replace(".", "").replace(",", "."));
                $("#foot" + ambienteTratado)[0].outerHTML = "";
                var footer = '<tr id="foot' + ambienteTratado + '" class="foot"><td colspan="9"><b>Total ' + v.Ambiente + ':</b></td><td class="bold" colspan="2" id="valorFoot' + ambienteTratado + '"><b>' + parseFloat(total) + '</b></td></tr>';
                $("#body" + ambienteTratado)[0].innerHTML += footer;
                $("#valorFoot" + ambienteTratado)[0].textContent = "R$" + ((anterior + parseFloat(v.valor * v.quantidade))).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            }
            if (ultimo == i) {
                var fretes = (v.frete == null) ? 0 : v.frete;
                var footeGeral = '<tr><td style="border:none;" colspan="10"></td></tr><tr><td style="border:none;" colspan="10"></td></tr><tr id="footer" class="foot"><td colspan="9"><b>Subtotal:</b></td><td colspan="2"><b>R$ ' + (sub).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' +
                    '<tr class="foot"><td colspan="9"><b>Valor do Desconto:</b></td><td colspan="2"><b>R$ ' + (footDesconto).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' +
                    '<tr class="foot"><td colspan="9"><b>Valor do Frete:</b></td><td colspan="2"><b>R$ ' + (fretes).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' +
                    '<tr class="foot"><td colspan="9"><b>Valor do Seguro:</b></td><td colspan="2"><b>R$ ' + (produto[0].seguro).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>' +
                    '<tr class="foot"><td colspan="9"><b>Total dos Serviços:</b></td><td colspan="2"><b>R$ ' + ((sub - footDesconto + fretes + produto[0].seguro)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</b></td></tr>';
                var k = $("#tabelas")[0].children.length - 1;
                $("#tabelas")[0].children[k].querySelector("tbody").innerHTML += footeGeral;
            }
        })
    }
});


