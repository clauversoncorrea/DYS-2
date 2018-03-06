const artyom = new Artyom();
artyom.initialize({
    lang: "pt-PT", // GreatBritain english
    continuous: true, // Listen forever
    soundex: true,// Use the soundex algorithm to increase accuracy
    debug: true, // Show messages in the console
    listen: true // Start to listen commands !
}).then(() => {
    console.log("Artyom has been succesfully initialized");
}).catch((err) => {
    console.error("Artyom couldn't be initialized: ", err);
});

var myGroup = [
    {
        description:"Menu",
        smart:true, // a Smart command allow you to use wildcard in order to retrieve words that the user should say
        // Ways to trigger the command with the voice
        indexes:["Abrir menu *","I don't know who is *","Is * a good person"],
        // Do something when the commands is triggered
        action:function(i,wildcard){
            var database = ["Pedido","Pessoa","Produto","Entrada de Nota Fiscal","Correio"];

            //If the command "is xxx a good person" is triggered do, else
            if(i == 0){
                if(database.indexOf(wildcard.trim())){
                    // alert("Abriu o Menu " + wildcard)
                    window.open('http://dysweb.dys.com.br/customizador/inicial.html?modal=71|Pessoa');
                    artyom.say("Vou Abrir o Menu" + wildcard);
                }
            }else{
                if(database.indexOf(wildcard.trim())){
                    artyom.say("Of course i know who is "+ wildcard + ". A really good person");
                }else{
                    artyom.say("My database is not big enough, I don't know who is " + wildcard);
                }
            }
        }
    },
    {
        indexes:["dsdasdsadasdsadsado","Adsadsadasdsasoa"],
        action:function(i){ // var i returns the index of the recognized command in the previous array
            if(i == 0){
                debugger
                artyom.say("Vou Abrir o Menu de Pedido");

            }else if(i == 1){
                debugger
                artyom.say("Vou Abrir o Menu de Pessoa");
            }
        }
    }
];

artyom.addCommands(myGroup);

artyom.say("Bom dia DYS",{
    onStart:function(){
        console.log("The text is being readed");
    },
    onEnd:function(){
        console.log("Well, that was all. Try with a longer text !");
    }
});