app.controller("template", function($scope, $http, $rootScope) {

    var url = location.href.replace(/%27/g, "");
    var obj = g$.urlObj(url);
    /*
        //QRCODE
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            width: 100,
            height: 100
        });
    
        makeCode();
    */
    // Funcao para carregar a query
    
    var queryxlm = "SELECT p.XML, COALESCE(f.troco,0) troco " +
                    "FROM " + obj.banco.trim() + ".pedido p "  +
                    "LEFT JOIN " + obj.banco.trim() + ".financeiro f ON (f.pedido_id = p.id AND NOT ISNULL(f.troco)) " +
                    "WHERE p.id=" + obj.id + " LIMIT 1";
    g$.queryTemplate(queryxlm, function(data) {
        $scope.documento = data;
        var docxml = data[0].XML;
        $scope.xml = {};
        // PRODUTOS
        $scope.xml.produto = [];
        var k = docxml.split('<prod>');
        k.splice(0,1);
        for (var i = 0; i < k.length; i++) {
            $scope.xml.produto[i] = {
                counter: i+1,
                cProd: k[i].split('<cProd>')[1].split('</cProd>')[0],
                xProd : k[i].split('<xProd>')[1].split('</xProd>')[0],
                uCom: k[i].split('<uCom>')[1].split('</uCom>')[0],
                qCom: k[i].split('<qCom>')[1].split('</qCom>')[0],
                vUnCom: parseFloat(k[i].split('<vUnCom>')[1].split('</vUnCom>')[0]).toFixed(2).replace('.',','),
                vProd: parseFloat(k[i].split('<vUnCom>')[1].split('</vUnCom>')[0]).toFixed(2).replace('.',',')
            }
        }
        // EMITENTE        
        $scope.xml.xNome = docxml.split('<emit>')[1].split('</emit>')[0].split('<xNome>')[1].split('</xNome>')[0];
        $scope.xml.CNPJ = docxml.split('<emit>')[1].split('</emit>')[0].split('<CNPJ>')[1].split('</CNPJ>')[0];
        $scope.xml.IE = (docxml.split('<emit>')[1].split('</emit>')[0].indexOf('<IE>') != -1)?"IE:" + docxml.split('<emit>')[1].split('</emit>')[0].split('<IE>')[1].split('</IE>')[0]:'';
        $scope.xml.IM = (docxml.split('<emit>')[1].split('</emit>')[0].indexOf("<IM>") != -1)?"IM:" + docxml.split('<emit>')[1].split('</emit>')[0].split('<IM>')[1].split('</IM>')[0]:'';
        
        $scope.xml.xLgr = (docxml.split('<emit>')[1].split('</emit>')[0].split('<enderEmit>')[1].split('</enderEmit>')[0].indexOf('<xLgr>')!= -1)?docxml.split('<emit>')[1].split('</emit>')[0].split('<enderEmit>')[1].split('</enderEmit>')[0].split('<xLgr>')[1].split('</xLgr>')[0]:'';
        $scope.xml.nro = docxml.split('<emit>')[1].split('</emit>')[0].split('<enderEmit>')[1].split('</enderEmit>')[0].split('<nro>')[1].split('</nro>')[0];
        $scope.xml.xBairro = docxml.split('<emit>')[1].split('</emit>')[0].split('<enderEmit>')[1].split('</enderEmit>')[0].split('<xBairro>')[1].split('</xBairro>')[0];
        $scope.xml.xMun = docxml.split('<emit>')[1].split('</emit>')[0].split('<enderEmit>')[1].split('</enderEmit>')[0].split('<xMun>')[1].split('</xMun>')[0];
        $scope.xml.UF = docxml.split('<emit>')[1].split('</emit>')[0].split('<enderEmit>')[1].split('</enderEmit>')[0].split('<UF>')[1].split('</UF>')[0];
        $scope.xml.CEP = docxml.split('<emit>')[1].split('</emit>')[0].split('<enderEmit>')[1].split('</enderEmit>')[0].split('<CEP>')[1].split('</CEP>')[0];
        $scope.xml.fone = docxml.split('<emit>')[1].split('</emit>')[0].split('<enderEmit>')[1].split('</enderEmit>')[0].split('<fone>')[1].split('</fone>')[0];
        $scope.xml.linkConsulta = docxml.split('CDATA[')[1].split('/QRCode')[0];
        // DESTINATARIO
        if(docxml.indexOf('<dest>') != -1){
            $scope.xml.dest_CNPJ = (docxml.split('<dest>')[1].split('</dest>')[0].indexOf('<CNPJ>') != -1)?docxml.split('<dest>')[1].split('</dest>')[0].split('<CNPJ>')[1].split('</CNPJ>')[0]:'';
            $scope.xml.dest_CPF = (docxml.split('<dest>')[1].split('</dest>')[0].indexOf('<CPF>') !=-1)?docxml.split('<dest>')[1].split('</dest>')[0].split('<CPF>')[1].split('</CPF>')[0]:'';
        }
        // TOTAL
        $scope.xml.total_vProd = docxml.split('<total>')[1].split('</total>')[0].split('<vProd>')[1].split('</vProd>')[0];
        $scope.xml.total_vDesc = (docxml.split('<total>')[1].split('</total>')[0].indexOf('<vDesc>') != -1)?docxml.split('<total>')[1].split('</total>')[0].split('<vDesc>')[1].split('</vDesc>')[0]:'';
        $scope.xml.total_vNF = docxml.split('<total>')[1].split('</total>')[0].split('<vNF>')[1].split('</vNF>')[0];
        // PAGAMENTOS        
        var troco = parseFloat(data[0].troco).toFixed(2);
        $scope.xml.troco = troco;
        var totalPago = 0
        $scope.xml.pagamento = [];
        if(docxml.indexOf('<pag>') != -1){
            var k = docxml.split('<pag>');
            k.splice(0,1);
            for (var i = 0; i < k.length; i++) {
                totalPago = (parseFloat(totalPago) + parseFloat(k[i].split('<vPag>')[1].split('</vPag>')[0])).toFixed(2);
                var tipoPag = k[i].split('<tPag>')[1].split('</tPag>')[0];
                if(tipoPag=='01'){
                    tipoPag = 'DINHEIRO';                    
                }else if(tipoPag=='02'){
                    tipoPag = 'CHEQUE';
                }else if(tipoPag=='03'){
                    tipoPag = 'CRÉDITO';
                }else if(tipoPag=='04'){
                    tipoPag = 'DÉBITO';
                }else{
                    tipoPag = 'OUTROS';
                } 
                $scope.xml.pagamento[i] = {                
                    tPag: tipoPag,
                    vPag : k[i].split('<vPag>')[1].split('</vPag>')[0]
                }
            }
        }
        $scope.xml.valorPago = totalPago;

        // NF
        $scope.xml.nProt = docxml.split('<nProt>')[1].split('</nProt>')[0];
        $scope.xml.serie = docxml.split('<serie>')[1].split('</serie>')[0];
        $scope.xml.nNF = docxml.split('<nNF>')[1].split('</nNF>')[0];
        $scope.xml.chNFe = docxml.split('<chNFe>')[1].split('</chNFe>')[0];
        $scope.xml.qrcode = docxml.split('<qrCode>')[1].split('</qrCode>')[0];
        $scope.xml.qrcode = $scope.xml.qrcode.substring($scope.xml.qrcode.indexOf("CDATA[") + 6, $scope.xml.qrcode.length - 5);
        $scope.xml.dhRecbto = docxml.split('<dhRecbto>')[1].split('</dhRecbto>')[0];
        document.getElementById('logoEmpresa').src = 'http://dys.net.br/' + obj.projeto.trim() + '/logogrande.png';


        JsBarcode("#barcode", $scope.xml.chNFe, {
            width: 0.65,
            height: 50,
            background: 'transparent',
            displayValue: false
        });

        var qrcode = new QRCode(document.getElementById("qrcode"), {
            width: 120,
            height: 120
        });

        qrcode.makeCode($scope.xml.qrcode);
    });




});
