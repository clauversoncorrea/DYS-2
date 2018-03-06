String.prototype.toNumber = function() {return parseFloat(this.replace(",", "."), 10);};
function $i(id /* string */, elm /* element */) {return (elm||document.body).querySelector("#"+id);};

var g$={ox: 0, oy: 0,
    isNewItemMenuTela: false,
    get kc_BKSP() {return 8;},
    get kc_DEL() {return 46;},
    get kc_DOWN() {return 40;},
    get kc_ENTER() {return 13;},
    get kc_ESC() {return 27;},
    get kc_LEFT() {return 37;},
    get kc_NOCHR() {return 0;},
    get kc_RIGHT() {return 39;},
    get kc_SHIFT() {return 16;},
    get kc_TAB() {return 9;},
    get kc_UP() {return 38;},
    get kc_ALT() {return 18;},
    get kc_F5() {return 116;},
	
    get isChrome() {return /Chrome/i.test(navigator.userAgent);},
    get isFF() {return /Firefox/.test(navigator.userAgent);},
    get isMSIE() {return /.NET/i.test(navigator.userAgent);},
    get today() {return (new Date().toLocaleString()).slice(0,10);},
    get naoDigito() {return /\D/g;},
	sites:"",
};

/**
 *  Cria um HTMLElement com a tag e a(s) classe(s) dada
 *  @param string sendo a primeira string o nome da tag e as
 *                demais (opcional) o(s) nome(s) da(s) classe(s)
 *  @return objeto HTMLElement.
 */
g$.newElement = function(){
	var el=document.createElement(arguments[0]);
    for(var i=1;i<arguments.length;i++){
        el.classList.add(arguments[i]);}
	return el;
};
g$.extend=function(oa,ob){
    for(var prop in ob){
        oa[prop]=ob[prop];
    }
    return oa;
};
/**
 * Verifica se tem algum campo invalido nesse formulario
 */
g$.hasError = function(container) {
	return container.querySelector(":invalid");
};
g$.inverteData=function(data){
    return data.slice(-4) + data.slice(2, 6) + data.slice(0, 2);};
/**
 * Formata um valor tanto com o parâmetro sendo texto ou number, primero parametro valor, segundo parametro casas decimais
 */
g$.format = function(vlr, cd) {	return (typeof(vlr) == "string")?
								vlr.toNumber().toFixed(cd).replace('.',','):vlr.toFixed(cd).replace('.',','); };
g$.setLastElmFocus = function(){
    document.activeElement.contentDocument.querySelector("input,select,button,textarea");
};