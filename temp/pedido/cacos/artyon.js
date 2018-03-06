var Artyom=function(){function e(){this.ArtyomCommands=[],this.ArtyomVoicesIdentifiers={"de-DE":["Google Deutsch","de-DE","de_DE"],"es-ES":["Google español","es-ES","es_ES","es-MX","es_MX"],"it-IT":["Google italiano","it-IT","it_IT"],"jp-JP":["Google 日本人","ja-JP","ja_JP"],"en-US":["Google US English","en-US","en_US"],"en-GB":["Google UK English Male","Google UK English Female","en-GB","en_GB"],"pt-BR":["Google português do Brasil","pt-PT","pt-BR","pt_PT","pt_BR"],"pt-PT":["Google português do Brasil","pt-PT","pt_PT"],"ru-RU":["Google русский","ru-RU","ru_RU"],"nl-NL":["Google Nederlands","nl-NL","nl_NL"],"fr-FR":["Google français","fr-FR","fr_FR"],"pl-PL":["Google polski","pl-PL","pl_PL"],"id-ID":["Google Bahasa Indonesia","id-ID","id_ID"],"hi-IN":["Google हिन्दी","hi-IN","hi_IN"],"zh-CN":["Google 普通话（中国大陆）","zh-CN","zh_CN"],"zh-HK":["Google 粤語（香港）","zh-HK","zh_HK"],native:["native"]},window.hasOwnProperty("speechSynthesis")?speechSynthesis.getVoices():console.error("Artyom.js can't speak without the Speech Synthesis API."),window.hasOwnProperty("webkitSpeechRecognition")?this.ArtyomWebkitSpeechRecognition=new window.webkitSpeechRecognition:console.error("Artyom.js can't recognize voice without the Speech Recognition API."),this.ArtyomProperties={lang:"en-GB",recognizing:!1,continuous:!1,speed:1,volume:1,listen:!1,mode:"normal",debug:!1,helpers:{redirectRecognizedTextOutput:null,remoteProcessorHandler:null,lastSay:null,fatalityPromiseCallback:null},executionKeyword:null,obeyKeyword:null,speaking:!1,obeying:!0,soundex:!1,name:null},this.ArtyomGarbageCollection=[],this.ArtyomFlags={restartRecognition:!1},this.ArtyomGlobalEvents={ERROR:"ERROR",SPEECH_SYNTHESIS_START:"SPEECH_SYNTHESIS_START",SPEECH_SYNTHESIS_END:"SPEECH_SYNTHESIS_END",TEXT_RECOGNIZED:"TEXT_RECOGNIZED",COMMAND_RECOGNITION_START:"COMMAND_RECOGNITION_START",COMMAND_RECOGNITION_END:"COMMAND_RECOGNITION_END",COMMAND_MATCHED:"COMMAND_MATCHED",NOT_COMMAND_MATCHED:"NOT_COMMAND_MATCHED"},this.Device={isMobile:!1,isChrome:!0},(navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i))&&(this.Device.isMobile=!0),-1==navigator.userAgent.indexOf("Chrome")&&(this.Device.isChrome=!1),this.ArtyomVoice={default:!1,lang:"en-GB",localService:!1,name:"Google UK English Male",voiceURI:"Google UK English Male"}}return e.prototype.addCommands=function(e){var t=this,o=function(e){e.hasOwnProperty("indexes")?t.ArtyomCommands.push(e):console.error("The given command doesn't provide any index to execute.")};if(e instanceof Array)for(var r=0;r<e.length;r++)o(e[r]);else o(e);return!0},e.prototype.clearGarbageCollection=function(){return this.ArtyomGarbageCollection=[]},e.prototype.debug=function(e,t){var o="[v"+this.getVersion()+"] Artyom.js";if(!0===this.ArtyomProperties.debug)switch(t){case"error":console.log("%c"+o+":%c "+e,"background: #C12127; color: black;","color:black;");break;case"warn":console.warn(e);break;case"info":console.log("%c"+o+":%c "+e,"background: #4285F4; color: #FFFFFF","color:black;");break;default:console.log("%c"+o+":%c "+e,"background: #005454; color: #BFF8F8","color:black;")}},e.prototype.detectErrors=function(){var e=this;if("file:"==window.location.protocol){t="Error: running Artyom directly from a file. The APIs require a different communication protocol like HTTP or HTTPS";return console.error(t),{code:"artyom_error_localfile",message:t}}if(!e.Device.isChrome){var t="Error: the Speech Recognition and Speech Synthesis APIs require the Google Chrome Browser to work.";return console.error(t),{code:"artyom_error_browser_unsupported",message:t}}return"https:"!=window.location.protocol&&console.warn("Warning: artyom is being executed using the '"+window.location.protocol+"' protocol. The continuous mode requires a secure protocol (HTTPS)"),!1},e.prototype.emptyCommands=function(){return this.ArtyomCommands=[]},e.prototype.execute=function(e){var t=this;if(e){if(t.ArtyomProperties.name){if(0!=e.indexOf(t.ArtyomProperties.name))return void t.debug('Artyom requires with a name "'+t.ArtyomProperties.name+"\" but the name wasn't spoken.","warn");e=e.substr(t.ArtyomProperties.name.length)}t.debug(">> "+e);for(l=0;l<t.ArtyomCommands.length;l++){for(var o=(u=t.ArtyomCommands[l]).indexes,r=-1,n="",i=0;i<o.length;i++){p=o[i];if(u.smart){if(p instanceof RegExp)p.test(e)&&(t.debug(">> REGEX "+p.toString()+" MATCHED AGAINST "+e+" WITH INDEX "+i+" IN COMMAND ","info"),r=parseInt(i.toString()));else if(-1!=p.indexOf("*")){var s=p.split("*");if(s.length>2){console.warn("Artyom found a smart command with "+(s.length-1)+" wildcards. Artyom only support 1 wildcard for each command. Sorry");continue}var a=s[0],c=s[1];""==c||" "==c?-1==e.indexOf(a)&&-1==e.toLowerCase().indexOf(a.toLowerCase())||(n=(n=e.replace(a,"")).toLowerCase().replace(a.toLowerCase(),""),r=parseInt(i.toString())):-1==e.indexOf(a)&&-1==e.toLowerCase().indexOf(a.toLowerCase())||-1==e.indexOf(c)&&-1==e.toLowerCase().indexOf(c.toLowerCase())||(n=(n=(n=e.replace(a,"").replace(c,"")).toLowerCase().replace(a.toLowerCase(),"").replace(c.toLowerCase(),"")).toLowerCase().replace(c.toLowerCase(),""),r=parseInt(i.toString()))}else console.warn("Founded command marked as SMART but have no wildcard in the indexes, remove the SMART for prevent extensive memory consuming or add the wildcard *");if(r>=0){r=parseInt(i.toString());break}}}if(r>=0)return t.triggerEvent(t.ArtyomGlobalEvents.COMMAND_MATCHED),m={index:r,instruction:u,wildcard:{item:n,full:e}}}for(l=0;l<t.ArtyomCommands.length;l++){for(var o=(u=t.ArtyomCommands[l]).indexes,r=-1,i=0;i<o.length;i++){p=o[i];if(!u.smart){if(e===p){t.debug(">> MATCHED FULL EXACT OPTION "+p+" AGAINST "+e+" WITH INDEX "+i+" IN COMMAND ","info"),r=parseInt(i.toString());break}if(e.toLowerCase()===p.toLowerCase()){t.debug(">> MATCHED OPTION CHANGING ALL TO LOWERCASE "+p+" AGAINST "+e+" WITH INDEX "+i+" IN COMMAND ","info"),r=parseInt(i.toString());break}}}if(r>=0)return t.triggerEvent(t.ArtyomGlobalEvents.COMMAND_MATCHED),m={index:r,instruction:u}}for(l=0;l<t.ArtyomCommands.length;l++){for(var o=(u=t.ArtyomCommands[l]).indexes,r=-1,i=0;i<o.length;i++)if(!u.smart){p=o[i];if(e.indexOf(p)>=0){t.debug(">> MATCHED INDEX EXACT OPTION "+p+" AGAINST "+e+" WITH INDEX "+i+" IN COMMAND ","info"),r=parseInt(i.toString());break}if(e.toLowerCase().indexOf(p.toLowerCase())>=0){t.debug(">> MATCHED INDEX OPTION CHANGING ALL TO LOWERCASE "+p+" AGAINST "+e+" WITH INDEX "+i+" IN COMMAND ","info"),r=parseInt(i.toString());break}}if(r>=0)return t.triggerEvent(t.ArtyomGlobalEvents.COMMAND_MATCHED),m={index:r,instruction:u}}if(t.ArtyomProperties.soundex)for(var l=0;l<t.ArtyomCommands.length;l++)for(var u=t.ArtyomCommands[l],o=u.indexes,r=-1,i=0;i<o.length;i++){var p=o[i];if(!u.smart&&t.soundex(e)==t.soundex(p)){t.debug(">> Matched Soundex command '"+p+"' AGAINST '"+e+"' with index "+i,"info"),r=parseInt(i.toString()),t.triggerEvent(t.ArtyomGlobalEvents.COMMAND_MATCHED);var m={index:r,instruction:u};return m}}t.debug("Event reached : "+t.ArtyomGlobalEvents.NOT_COMMAND_MATCHED),t.triggerEvent(t.ArtyomGlobalEvents.NOT_COMMAND_MATCHED)}else console.warn("Internal error: Execution of empty command")},e.prototype.fatality=function(){var e=this;return new Promise(function(t,o){e.ArtyomProperties.helpers.fatalityPromiseCallback=t;try{e.ArtyomFlags.restartRecognition=!1,e.ArtyomWebkitSpeechRecognition.stop()}catch(e){o(e)}})},e.prototype.getAvailableCommands=function(){return this.ArtyomCommands},e.prototype.getVoices=function(){return window.speechSynthesis.getVoices()},e.prototype.speechSupported=function(){return"speechSynthesis"in window},e.prototype.recognizingSupported=function(){return"webkitSpeechRecognition"in window},e.prototype.shutUp=function(){if("speechSynthesis"in window)do{window.speechSynthesis.cancel()}while(!0===window.speechSynthesis.pending);this.ArtyomProperties.speaking=!1,this.clearGarbageCollection()},e.prototype.getProperties=function(){return this.ArtyomProperties},e.prototype.getLanguage=function(){return this.ArtyomProperties.lang},e.prototype.getVersion=function(){return"1.0.6"},e.prototype.hey=function(e,t){var o,r=this;this.Device.isMobile?(this.ArtyomWebkitSpeechRecognition.continuous=!1,this.ArtyomWebkitSpeechRecognition.interimResults=!1,this.ArtyomWebkitSpeechRecognition.maxAlternatives=1):(this.ArtyomWebkitSpeechRecognition.continuous=!0,this.ArtyomWebkitSpeechRecognition.interimResults=!0),this.ArtyomWebkitSpeechRecognition.lang=this.ArtyomProperties.lang,this.ArtyomWebkitSpeechRecognition.onstart=function(){r.debug("Event reached : "+r.ArtyomGlobalEvents.COMMAND_RECOGNITION_START),r.triggerEvent(r.ArtyomGlobalEvents.COMMAND_RECOGNITION_START),r.ArtyomProperties.recognizing=!0,o=!0,e()},this.ArtyomWebkitSpeechRecognition.onerror=function(e){t(e.error),r.triggerEvent(r.ArtyomGlobalEvents.ERROR,{code:e.error}),"audio-capture"==e.error&&(o=!1),"not-allowed"==e.error&&(o=!1,e.timeStamp-void 0<100?r.triggerEvent(r.ArtyomGlobalEvents.ERROR,{code:"info-blocked",message:"Artyom needs the permision of the microphone, is blocked."}):r.triggerEvent(r.ArtyomGlobalEvents.ERROR,{code:"info-denied",message:"Artyom needs the permision of the microphone, is denied"}))},r.ArtyomWebkitSpeechRecognition.onend=function(){!0===r.ArtyomFlags.restartRecognition?(!0===o?(r.ArtyomWebkitSpeechRecognition.start(),r.debug("Continuous mode enabled, restarting","info")):console.error("Verify the microphone and check for the table of errors in sdkcarlos.github.io/sites/artyom.html to solve your problem. If you want to give your user a message when an error appears add an artyom listener"),r.triggerEvent(r.ArtyomGlobalEvents.COMMAND_RECOGNITION_END,{code:"continuous_mode_enabled",message:"OnEnd event reached with continuous mode"})):r.ArtyomProperties.helpers.fatalityPromiseCallback&&(setTimeout(function(){r.ArtyomProperties.helpers.fatalityPromiseCallback()},500),r.triggerEvent(r.ArtyomGlobalEvents.COMMAND_RECOGNITION_END,{code:"continuous_mode_disabled",message:"OnEnd event reached without continuous mode"})),r.ArtyomProperties.recognizing=!1};var n;if("normal"==r.ArtyomProperties.mode&&(n=function(e){if(r.ArtyomCommands.length){var t=e.results.length;r.triggerEvent(r.ArtyomGlobalEvents.TEXT_RECOGNIZED);for(var o=e.resultIndex;o<t;++o){var n=e.results[o][0].transcript;if(e.results[o].isFinal){var i=r.execute(n.trim());if("function"==typeof r.ArtyomProperties.helpers.redirectRecognizedTextOutput&&r.ArtyomProperties.helpers.redirectRecognizedTextOutput(n,!0),i&&1==r.ArtyomProperties.recognizing){r.debug("<< Executing Matching Recognition in normal mode >>","info"),r.ArtyomWebkitSpeechRecognition.stop(),r.ArtyomProperties.recognizing=!1,i.wildcard?i.instruction.action(i.index,i.wildcard.item,i.wildcard.full):i.instruction.action(i.index);break}}else{if("function"==typeof r.ArtyomProperties.helpers.redirectRecognizedTextOutput&&r.ArtyomProperties.helpers.redirectRecognizedTextOutput(n,!1),"string"==typeof r.ArtyomProperties.executionKeyword&&-1!=n.indexOf(r.ArtyomProperties.executionKeyword)&&(i=r.execute(n.replace(r.ArtyomProperties.executionKeyword,"").trim()))&&1==r.ArtyomProperties.recognizing){r.debug("<< Executing command ordered by ExecutionKeyword >>","info"),r.ArtyomWebkitSpeechRecognition.stop(),r.ArtyomProperties.recognizing=!1,i.wildcard?i.instruction.action(i.index,i.wildcard.item,i.wildcard.full):i.instruction.action(i.index);break}r.debug("Normal mode : "+n)}}}else r.debug("No commands to process in normal mode.")}),"quick"==r.ArtyomProperties.mode&&(n=function(e){if(r.ArtyomCommands.length){var t=e.results.length;r.triggerEvent(r.ArtyomGlobalEvents.TEXT_RECOGNIZED);for(var o=e.resultIndex;o<t;++o){var n=e.results[o][0].transcript;if(e.results[o].isFinal){i=r.execute(n.trim());if("function"==typeof r.ArtyomProperties.helpers.redirectRecognizedTextOutput&&r.ArtyomProperties.helpers.redirectRecognizedTextOutput(n,!1),i&&1==r.ArtyomProperties.recognizing){r.debug("<< Executing Matching Recognition in quick mode >>","info"),r.ArtyomWebkitSpeechRecognition.stop(),r.ArtyomProperties.recognizing=!1,i.wildcard?i.instruction.action(i.index,i.wildcard.item):i.instruction.action(i.index);break}}else{var i=r.execute(n.trim());if("function"==typeof r.ArtyomProperties.helpers.redirectRecognizedTextOutput&&r.ArtyomProperties.helpers.redirectRecognizedTextOutput(n,!0),i&&1==r.ArtyomProperties.recognizing){r.debug("<< Executing Matching Recognition in quick mode >>","info"),r.ArtyomWebkitSpeechRecognition.stop(),r.ArtyomProperties.recognizing=!1,i.wildcard?i.instruction.action(i.index,i.wildcard.item):i.instruction.action(i.index);break}}r.debug("Quick mode : "+n)}}else r.debug("No commands to process.")}),"remote"==r.ArtyomProperties.mode&&(n=function(e){var t=e.results.length;if(r.triggerEvent(r.ArtyomGlobalEvents.TEXT_RECOGNIZED),"function"!=typeof r.ArtyomProperties.helpers.remoteProcessorHandler)return r.debug("The remoteProcessorService is undefined.","warn");for(var o=e.resultIndex;o<t;++o){var n=e.results[o][0].transcript;r.ArtyomProperties.helpers.remoteProcessorHandler({text:n,isFinal:e.results[o].isFinal})}}),r.ArtyomWebkitSpeechRecognition.onresult=function(e){if(r.ArtyomProperties.obeying)n(e);else{if(!r.ArtyomProperties.obeyKeyword)return;for(var t="",o="",i=0;i<e.results.length;++i)e.results[i].isFinal?t+=e.results[i][0].transcript:o+=e.results[i][0].transcript;r.debug("Artyom is not obeying","warn"),(o.indexOf(r.ArtyomProperties.obeyKeyword)>-1||t.indexOf(r.ArtyomProperties.obeyKeyword)>-1)&&(r.ArtyomProperties.obeying=!0)}},r.ArtyomProperties.recognizing)r.ArtyomWebkitSpeechRecognition.stop(),r.debug("Event reached : "+r.ArtyomGlobalEvents.COMMAND_RECOGNITION_END),r.triggerEvent(r.ArtyomGlobalEvents.COMMAND_RECOGNITION_END);else try{r.ArtyomWebkitSpeechRecognition.start()}catch(e){r.triggerEvent(r.ArtyomGlobalEvents.ERROR,{code:"recognition_overlap",message:"A webkitSpeechRecognition instance has been started while there's already running. Is recommendable to restart the Browser"})}},e.prototype.initialize=function(e){var t=this;return"object"!=typeof e?Promise.reject("You must give the configuration for start artyom properly."):(e.hasOwnProperty("lang")&&(t.ArtyomVoice=t.getVoice(e.lang),t.ArtyomProperties.lang=e.lang),e.hasOwnProperty("continuous")&&(e.continuous?(this.ArtyomProperties.continuous=!0,this.ArtyomFlags.restartRecognition=!0):(this.ArtyomProperties.continuous=!1,this.ArtyomFlags.restartRecognition=!1)),e.hasOwnProperty("speed")&&(this.ArtyomProperties.speed=e.speed),e.hasOwnProperty("soundex")&&(this.ArtyomProperties.soundex=e.soundex),e.hasOwnProperty("executionKeyword")&&(this.ArtyomProperties.executionKeyword=e.executionKeyword),e.hasOwnProperty("obeyKeyword")&&(this.ArtyomProperties.obeyKeyword=e.obeyKeyword),e.hasOwnProperty("volume")&&(this.ArtyomProperties.volume=e.volume),e.hasOwnProperty("listen")&&(this.ArtyomProperties.listen=e.listen),e.hasOwnProperty("name")&&(this.ArtyomProperties.name=e.name),e.hasOwnProperty("debug")?this.ArtyomProperties.debug=e.debug:console.warn("The initialization doesn't provide how the debug mode should be handled. Is recommendable to set this value either to true or false."),e.mode&&(this.ArtyomProperties.mode=e.mode),!0===this.ArtyomProperties.listen?new Promise(function(e,o){t.hey(e,o)}):Promise.resolve(!0))},e.prototype.on=function(e,t){var o=this;return{then:function(r){var n={indexes:e,action:r};t&&(n.smart=!0),o.addCommands(n)}}},e.prototype.triggerEvent=function(e,t){var o=new CustomEvent(e,{detail:t});return document.dispatchEvent(o),o},e.prototype.repeatLastSay=function(e){var t=this.ArtyomProperties.helpers.lastSay;if(e)return t;null!=t&&this.say(t.text)},e.prototype.when=function(e,t){return document.addEventListener(e,function(e){t(e.detail)},!1)},e.prototype.remoteProcessorService=function(e){return this.ArtyomProperties.helpers.remoteProcessorHandler=e,!0},e.prototype.voiceAvailable=function(e){return void 0!==this.getVoice(e)},e.prototype.isObeying=function(){return this.ArtyomProperties.obeying},e.prototype.obey=function(){return this.ArtyomProperties.obeying=!0},e.prototype.dontObey=function(){return this.ArtyomProperties.obeying=!1},e.prototype.isSpeaking=function(){return this.ArtyomProperties.speaking},e.prototype.isRecognizing=function(){return this.ArtyomProperties.recognizing},e.prototype.getNativeApi=function(){return this.ArtyomWebkitSpeechRecognition},e.prototype.getGarbageCollection=function(){return this.ArtyomGarbageCollection},e.prototype.getVoice=function(e){var t=this.ArtyomVoicesIdentifiers[e];t||(console.warn("The providen language "+e+" isn't available, using English Great britain as default"),t=this.ArtyomVoicesIdentifiers["en-GB"]);for(var o=void 0,r=speechSynthesis.getVoices(),n=t.length,i=0;i<n&&"break"!==function(e){var n=r.filter(function(o){return o.name==t[e]||o.lang==t[e]})[0];if(n)return o=n,"break"}(i);i++);return o},e.prototype.newDictation=function(e){var t=this;if(!t.recognizingSupported())return console.error("SpeechRecognition is not supported in this browser"),!1;var o=new window.webkitSpeechRecognition;return o.continuous=!0,o.interimResults=!0,o.lang=t.ArtyomProperties.lang,o.onresult=function(t){for(var o="",r="",n=0;n<t.results.length;++n)t.results[n].isFinal?o+=t.results[n][0].transcript:r+=t.results[n][0].transcript;e.onResult&&e.onResult(r,o)},new function(){var t=o,r=!0,n=!1;this.onError=null,this.start=function(){!0===e.continuous&&(n=!0),t.onstart=function(){"function"==typeof e.onStart&&!0===r&&e.onStart()},t.onend=function(){!0===n?(r=!1,t.start()):(r=!0,"function"==typeof e.onEnd&&e.onEnd())},t.start()},this.stop=function(){n=!1,t.stop()},"function"==typeof e.onError&&(t.onerror=e.onError)}},e.prototype.newPrompt=function(e){"object"!=typeof e&&console.error("Expected the prompt configuration.");var t=Object.assign([],this.ArtyomCommands),o=this;this.emptyCommands();var r={description:"Setting the artyom commands only for the prompt. The commands will be restored after the prompt finishes",indexes:e.options,action:function(r,n){o.ArtyomCommands=t;var i=e.onMatch(r,n);"function"==typeof i?i():console.error("onMatch function expects a returning function to be executed")}};e.smart&&(r.smart=!0),this.addCommands(r),void 0!==e.beforePrompt&&e.beforePrompt();var n={onStart:function(){void 0!==e.onStartPrompt&&e.onStartPrompt()},onEnd:function(){void 0!==e.onEndPrompt&&e.onEndPrompt()}};this.say(e.question,n)},e.prototype.sayRandom=function(e){if(e instanceof Array){var t=Math.floor(Math.random()*e.length);return this.say(e[t]),{text:e[t],index:t}}return console.error("Random quotes must be in an array !"),null},e.prototype.setDebug=function(e){return this.ArtyomProperties.debug=!!e},e.prototype.simulateInstruction=function(e){var t=this;if(!e||"string"!=typeof e)return console.warn("Cannot execute a non string command"),!1;var o=t.execute(e);return"object"!=typeof o?(console.warn("No command founded trying with "+e),!1):o.instruction?(o.instruction.smart?(t.debug("Smart command matches with simulation, executing","info"),o.instruction.action(o.index,o.wildcard.item,o.wildcard.full)):(t.debug("Command matches with simulation, executing","info"),o.instruction.action(o.index)),!0):void 0},e.prototype.soundex=function(e){var t=e.toLowerCase().split(""),o=t.shift(),r={a:"",e:"",i:"",o:"",u:"",b:1,f:1,p:1,v:1,c:2,g:2,j:2,k:2,q:2,s:2,x:2,z:2,d:3,t:3,l:4,m:5,n:5,r:6};return(o+t.map(function(e,t,o){return r[e]}).filter(function(e,t,n){return 0===t?e!==r[o]:e!==n[t-1]}).join("")+"000").slice(0,4).toUpperCase()},e.prototype.splitStringByChunks=function(e,t){e=e||"";for(var o=t=t||100,r=0,n=[];e[o];)" "==e[o++]&&(n.push(e.substring(r,o)),r=o,o+=t);return n.push(e.substr(r)),n},e.prototype.redirectRecognizedTextOutput=function(e){return"function"!=typeof e?(console.warn("Expected function to handle the recognized text ..."),!1):(this.ArtyomProperties.helpers.redirectRecognizedTextOutput=e,!0)},e.prototype.restart=function(){var e=this,t=e.ArtyomProperties;return new Promise(function(o,r){e.fatality().then(function(){e.initialize(t).then(o,r)})})},e.prototype.talk=function(e,t,o,r){var n=this,i=new SpeechSynthesisUtterance;i.text=e,i.volume=this.ArtyomProperties.volume,i.rate=this.ArtyomProperties.speed;var s=n.getVoice(n.ArtyomProperties.lang);r&&r.hasOwnProperty("lang")&&(s=n.getVoice(r.lang)),this.Device.isMobile?s&&(i.lang=s.lang):i.voice=s,1==t&&i.addEventListener("start",function(){n.ArtyomProperties.speaking=!0,n.debug("Event reached : "+n.ArtyomGlobalEvents.SPEECH_SYNTHESIS_START),n.triggerEvent(n.ArtyomGlobalEvents.SPEECH_SYNTHESIS_START),r&&"function"==typeof r.onStart&&r.onStart.call(i)}),t>=o&&i.addEventListener("end",function(){n.ArtyomProperties.speaking=!1,n.debug("Event reached : "+n.ArtyomGlobalEvents.SPEECH_SYNTHESIS_END),n.triggerEvent(n.ArtyomGlobalEvents.SPEECH_SYNTHESIS_END),r&&"function"==typeof r.onEnd&&r.onEnd.call(i)}),this.debug(t+" text chunk processed succesfully out of "+o),this.ArtyomGarbageCollection.push(i),window.speechSynthesis.speak(i)},e.prototype.say=function(e,t){var o=this,r=[];if(this.speechSupported()){if("string"!=typeof e)return console.warn("Artyom expects a string to speak "+typeof e+" given");if(!e.length)return console.warn("Cannot speak empty string");e.length>115?e.split(/,|:|\. |;/).forEach(function(e,t){if(e.length>115){var n=o.splitStringByChunks(e,115);r.push.apply(r,n)}else r.push(e)}):r.push(e),(r=r.filter(function(e){return e})).forEach(function(e,n){var i=n+1;e&&o.talk(e,i,r.length,t)}),o.ArtyomProperties.helpers.lastSay={text:e,date:new Date}}},e}();
