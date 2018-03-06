$.templateCustomizador = [
	{
		popup: "<div ng-controller='funcoes' class='popup card no-margin-tb no-padding'>" +
		"<div class='card-header' onclick='g$.requeryAcoesTela()'>" +
		" <div class='card-title'>  </div>" +
		" <div class='card-icone'> " +
								// " <i class='fa fa-question-circle' onclick='g$.popHelp()'>  </i>" +
								" <i class='fa fa-close' onclick='g$.popClose()'>  </i>" +
		" </div>" +
		" </div>" +
		" <div class='card-content no-borderelms' tabindex='0' ng-controller='customizador' ondrop='dragDrop(this)' ondragover='dragOver(this)'>" +
		" </div>" +
		" </div> ",
		linha: "<div id='linha' tabindex='0' class='row' onclick='displayDadosProp()'  ondrop='dragDrop(this)' ondragover='dragOver(this)'> </div>",
		coluna: "<div id='coluna' class='col s4 l4 m4' onclick='displayDadosProp()' > </div>",
		input: "<input id='input' class='form-control' onclick='displayDadosProp()' >",
		textarea: "<textarea id='textarea' class='form-control' rows='4' onclick='displayDadosProp()'  > </textarea",
		label: "<label id='label' onclick='displayDadosProp()' > Label </label>",
		marquee: "<marquee id='marquee' onclick='displayDadosProp()'> marquee marquee marquee </marquee>",
		video: "<video id='video' width='400' controls onclick='displayDadosProp()'> <source src='' type='video/youtube'> </video>",
		icone: "<i id='icone' class='fa fa-share-square-o' > </i>",
		botao: "<a id='botao' onclick='displayDadosProp()' class='waves-effect waves-light btn' >" +
		"<span id='botao' onclick='displayDadosProp()' > button </span>" +
		"</a>",
		selectbox: "<teste id='selectbox' data-tela='true' onclick='displayDadosProp()'> </teste>",
		tabela: "<table id='tabela' onclick='displayDadosProp()' class='table-move striped'> <thead> " +
		"<tr> <th id='thSelecionar' style='max-width: 25px; width: 25px'> </th> </tr> </thead> <tbody> <tr> <td id='tdSelecionar' style='width: 25px; max-width: 25px;'> <input id='selecionarLinha' type='checkbox'> </td> </tr> </tbody> </table>",
		th: "<th id='th'> Texto </th>",
		td: "<td id='td' onclick='displayDadosProp()' tabindex='0'> <span class='tblTdFalse'> Texto </span> </td>",
		tdDel: "<td style='width: 35px; max-width: 35px;' id='deleteRow' onclick='deletarLinha()'> <i class='fa fa-trash'></i> </td>",
		ltb: "<div id='coluna'  data-id='ltb' class='col s4 l4 m4' >" + "<label id='label' > Label </label>" +
		"<input id='input' class='form-control' > </div>",
		tabs: "<ul id='tabs' onclick='displayDadosProp()' class='tabs' > </ul>",
		tab: "<li id='tab' onclick='displayDadosProp()' class='tab'><a id='tab'>Texto</a></li>",
		link: "<a id='link' onclick='displayDadosProp()' class='cursor-pointer'> Link </a>",
		imagem: "<img id='imagem' src='default.png' style='width: 100px; height: 100px;' onclick='displayDadosProp()'/> ",
		grafico: "<canvas id='grafico' width='200' height='200' style='width: 100%; height: 100%;' onclick='displayDadosProp()'></canvas>",
		graficoTorre: "<canvas id='graficoTorre' height='235' width='509' style='width: 509px; height: 235px;' onclick='displayDadosProp()'></canvas>",
		checkMaterialize: "<span><input type='checkbox' class='new_check' id='filled-in-box' onclick='displayDadosProp()'/>" +
		"<label for='filled-in-box' class='new_check' onclick='displayDadosProp()'>Filled in</label></span>"
	}
];

$.template = [
	{
		popup: "<div ng-controller='funcoes' class='popup card col s12 no-margin-tb no-padding fill-height'><div class='card-header'>" +
		"<div class='card-title'> </div> <div class='card-icone'> " + 
		// "<i class='fa fa-question-circle' onclick='g$.popHelp()'>  </i>" +
		" <i class='fa fa-close' onclick='g$.popClose()'>  </i>" +
		" </div> </div> <div class='card-content no-borderelms' tabindex='0'> </div> </div> ",
		linha: "<div id='linha' tabindex='0' class='row'> </div>",
		coluna: "<div id='coluna' class='col s4 l4 m4'> </div>",
		input: "<input id='input' class='form-control'>",
		textarea: "<textarea id='textarea' class='form-control' rows='4' > </textarea",
		label: "<label id='label'> Label </label>",
		marquee: "<marquee id='marquee'> marquee </marquee>",
		video: "<video id='video' width='400' controls> <source src='' type='video/youtube'> </video>",
		icone: "<i id='icone' class='fa fa-share-square-o' > </i>",
		botao: "<a id='botao' class='waves-effect waves-light btn' > <span id='botao' > button </span> </a>",
		selectbox: "<teste id='selectbox' data-tela='true'> </teste>",
		tabela: "<table id='tabela' class='table-move striped'> <thead> " +
		"<tr> <th id='thSelecionar' style='max-width: 25px; width: 25px'></th> </tr> </thead> <tbody> <tr> <td id='tdSelecionar' style='width: 25px; max-width: 25px;'> <input id='selecionarLinha' type='checkbox'> </td> </tr> </tbody> </table>",
		th: "<th id='th'> Texto </th>",
		td: "<td id='td' tabindex='0'> <span class='tblTdFalse'> Texto </span> </td>",
		tdDel: "<td style='width: 35px; max-width: 35px;' id='deleteRow' onclick='deletarLinha()'> <i class='fa fa-trash'></i> </td>",
		ltb: "<div id='coluna'  data-id='ltb' class='col s4 l4 m4' > <label id='label' > Label </label> <input id='input' class='form-control' > </div>",
		tabs: "<ul id='tabs' class='tabs' > </ul>",
		tab: "<li id='tab' class='tab'><a id='tab'>Texto</a></li>",
		corpoTab: "<div class='tab-content col s12' tabindex='0'> </div>",
		loadzin: "<div class='preloader-wrapper small active'> <div class='spinner-layer spinner-blue-only'> <div class='circle-clipper left'> <div class='circle'></div>" +
		"</div><div class='gap-patch'> <div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div>",
		link: "<a id='link' class='cursor-pointer'> Link </a>",
		imagem: "<img id='imagem' src='default.png' style='width: 100px; height: 100px;'/> ",
		grafico: "<canvas id='grafico' width='200' height='200' style='width: 100%; height: 100%;'></canvas>",
		graficoTorre: "<canvas id='graficoTorre' height='235' width='509' style='width: 509px; height: 235px;'></canvas>",
		menu_bloco: "<div class='col l3 m4 s6'> <div id='menu-bloco' class='animated bounceInUp'> <div> <i id='icone_menu'> </i> " +
		"<div id='texto_menu'></div> </div> </div>",
		checkMaterialize: "<span><input type='checkbox' class='new_check' id='filled-in-box' />" +
		"<label for='filled-in-box' class='new_check'>Filled in</label></span>",
		loadzinTela: "<div id='loadzinTela' class='load-gradient'><div class='load-carregando'><p>Carregando</p><div class='preloader-wrapper small active loadzin-query'> <div class='spinner-layer spinner-blue-only'> <div class='circle-clipper left'> <div class='circle'></div>" +
		"</div><div class='gap-patch'> <div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div></div></div>"
	}
];


$.combo = [
	{
		tag: "<select class='form-control'>" +
		"<option value=''> </option>" +
		"<option value='linha'> linha </option>" +
		"<option value='coluna'> coluna </option>" +
		"<option value='input'> textbox </option>" +
		"<option value='label'> label </option>" +
		"<option value='textarea'> textarea </option>" +
		"<option value='icone'> icone </option>" +
		"<option value='botao'> botao </option>" +
		"<option value='link'> Link </option>" +				
		"<option value='selectbox'> selectbox </option>" +
		"<option value='tabela'> tabela </option>" +
		"<option value='td'> td </option>" +
		"<option value='tabs'> tabs </option>" +
		"<option value='tab'> tab </option>" +
		"<option value='marquee'> marquee </option>" +
		"<option value='video'> video </option>" +
		"</select>",
		tipo: "<select class='form-control'>" +
		"<option value=''> </option>" +
		"<option value='text'> Caixa de Texto </option>" +
		"<option value='tel'> Tel </option>" +
		"<option value='number'> Number </option>" +
		"<option value='email'> Email </option>" +
		"<option value='date'> Data </option>" +
		"<option value='file'> File </option>" +
		"<option value='color'> Color </option>" +
		"<option value='checkbox'> Checkbox </option>" +
		"<option value='password'> Senha </option>" +
		"<option value='date-time'> Data e Hora </option>" +
		"</select>",
		formato: "<select class='form-control'>" +
		"<option value=''> </option>" +
		"<optgroup label='Formatos para Tabela'>" +
		"<option value='DD_MM_YYYY'> DD/MM/YYYY </option>" +
		"<option value='DD-MM-YYYY'> DD-MM-YYYY </option>" +
		"<option value='YYYY_MM_DD'> YYYY/MM/DD </option>" +
		"<option value='DD_MM_YYYY h:mm:ss'> DD/MM/YYYY h:mm:ss </option>" +
		"<option value='h:mm'> h:mm </option>" +
		"</optgroup>" +
		"<optgroup label='Formatos para os Campos'>" +
		"<option value='Time'> Time </option>" +
		"<option value='Date Time'> Date Time </option>" +
		"<option value='Date'> Date </option>" +
		"<option value='Cep'> Cep </option>" +
		"<option value='Telefone'> Telefone </option>" +
		"<option value='Telefone DDD'> Telefone DDD </option>" +
		"<option value='Celular'> Celular </option>" +
		"<option value='Celular DDD'> Celular DDD </option>" +
		"<option value='CPF'> CPF </option>" +
		"<option value='CNS'> CNS </option>" +
		"<option value='CNPJ'> CNPJ </option>" +
		"<option value='RG'> RG </option>" +
		"<option value='Money'> Money </option>" +
		"<option value='R$ Money'> R$ Money </option>" +
		"<option value='Inscricao Estadual'> Inscricao Estadual </option>" +
		"<option value='Peso'> Peso </option>" +
		"<option value='Altura'> Altura </option>" +
		"<option value='Temperatura'> Temperatura </option>" +
		"<option value='PA'> PA </option>" +
		"<option value='FC'> FC-Frequência Cardíaca </option>" +
		"<option value='Glicemia'> Glicemia Capilar </option>" +
		"</optgroup>" +
		"</select>",
		display: "<select class='form-control'>" +
		"<option value=''> </option>" +
		"<option value='none'> None </option>" +
		"<option value='block'> Block </option>" +
		"<option value='inline-block'> Inline-Block </option>" +
		"</select>",
		familia: "<select class='form-control'>" +
		"<option value=''> </option>" +
		"<option value='roboto'> Roboto </option>" +
		"<option value='helvetica'> Helvetica </option>" +
		"<option value='monospace'> Monospace </option>" +
		"<option value='sans-serif'> Sans-Serif </option>" +
		"<option value='arial'> Arial </option>" +
		"</select>",
		borda_tipo: "<select class='form-control'>" +
		"<option value=''> </option>" +
		"<option value='dotted'> Dotted </option>" +
		"<option value='groove'> Groove </option>" +
		"<option value='solid'> Solid </option>" +
		"<option value='ridge'> Ridge </option>" +
		"</select>"
	}
];

$.graficoColors = {
	"teal darken-4": "#004d40",
	"cyan darken-4": "#006064",
	"teal darken-3": "#00695c",
	"teal darken-2": "#00796b",
	"cyan darken-3": "#00838f",
	"teal darken-1": "#00897b",
	"light-blue accent-4": "#0091ea",
	"teal": "#009688",
	"cyan darken-2": "#0097a7",
	"cyan darken-1": "#00acc1",
	"light-blue accent-3": "#00b0ff",
	"cyan accent-4": "#00b8d4",
	"cyan": "#00bcd4",
	"teal accent-4": "#00bfa5",
	"green accent-4": "#00c853",
	"cyan accent-3": "#00e5ff",
	"green accent-3": "#00e676",
	"light-blue darken-4": "#01579b",
	"light-blue darken-3": "#0277bd",
	"light-blue darken-2": "#0288d1",
	"light-blue darken-1": "#039be5",
	"light-blue": "#03a9f4",
	"blue darken-4": "#0d47a1",
	"blue darken-3": "#1565c0",
	"cyan accent-2": "#18ffff",
	"blue darken-2": "#1976d2",
	"indigo darken-4": "#1a237e",
	"green darken-4": "#1b5e20",
	"teal accent-3": "#1de9b6",
	"blue darken-1": "#1e88e5",
	"grey darken-4": "#212121",
	"blue": "#2196f3",
	"blue-grey darken-4": "#263238",
	"teal lighten-1": "#26a69a",
	"cyan lighten-1": "#26c6da",
	"indigo darken-3": "#283593",
	"blue accent-4": "#2962ff",
	"blue accent-3": "#2979ff",
	"light-blue lighten-1": "#29b6f6",
	"green darken-3": "#2e7d32",
	"indigo darken-2": "#303f9f",
	"indigo accent-4": "#304ffe",
	"deep-purple darken-4": "#311b92",
	"light-green darken-4": "#33691e",
	"blue-grey darken-3": "#37474f",
	"green darken-2": "#388e3c",
	"indigo darken-1": "#3949ab",
	"indigo accent-3": "#3d5afe",
	"brown darken-4": "#3e2723",
	"indigo": "#3f51b5",
	"light-blue accent-2": "#40c4ff",
	"grey darken-3": "#424242",
	"blue lighten-1": "#42a5f5",
	"green darken-1": "#43a047",
	"blue accent-2": "#448aff",
	"deep-purple darken-3": "#4527a0",
	"blue-grey darken-2": "#455a64",
	"purple darken-4": "#4a148c",
	"green": "#4caf50",
	"teal lighten-2": "#4db6ac",
	"cyan lighten-2": "#4dd0e1",
	"brown darken-3": "#4e342e",
	"light-blue lighten-2": "#4fc3f7",
	"deep-purple darken-2": "#512da8",
	"indigo accent-2": "#536dfe",
	"blue-grey darken-1": "#546e7a",
	"light-green darken-3": "#558b2f",
	"indigo lighten-1": "#5c6bc0",
	"brown darken-2": "#5d4037",
	"deep-purple darken-1": "#5e35b1",
	"blue-grey": "#607d8b",
	"grey darken-2": "#616161",
	"deep-purple accent-4": "#6200ea",
	"blue lighten-2": "#64b5f6",
	"light-green accent-4": "#64dd17",
	"teal accent-2": "#64ffda",
	"deep-purple accent-3": "#651fff",
	"green lighten-1": "#66bb6a",
	"deep-purple": "#673ab7",
	"light-green darken-2": "#689f38",
	"green accent-2": "#69f0ae",
	"purple darken-3": "#6a1b9a",
	"brown darken-1": "#6d4c41",
	"grey darken-1": "#757575",
	"light-green accent-3": "#76ff03",
	"blue-grey lighten-1": "#78909c",
	"brown": "#795548",
	"indigo lighten-2": "#7986cb",
	"purple darken-2": "#7b1fa2",
	"deep-purple accent-2": "#7c4dff",
	"light-green darken-1": "#7cb342",
	"deep-purple lighten-1": "#7e57c2",
	"teal lighten-3": "#80cbc4",
	"light-blue accent-1": "#80d8ff",
	"cyan lighten-3": "#80deea",
	"green lighten-2": "#81c784",
	"light-blue lighten-3": "#81d4fa",
	"lime darken-4": "#827717",
	"blue accent-1": "#82b1ff",
	"cyan accent-1": "#84ffff",
	"pink darken-4": "#880e4f",
	"light-green": "#8bc34a",
	"indigo accent-1": "#8c9eff",
	"brown lighten-1": "#8d6e63",
	"purple darken-1": "#8e24aa",
	"blue-grey lighten-2": "#90a4ae",
	"blue lighten-3": "#90caf9",
	"deep-purple lighten-2": "#9575cd",
	"purple": "#9c27b0",
	"light-green lighten-1": "#9ccc65",
	"lime darken-3": "#9e9d24",
	"grey": "#9e9e9e",
	"indigo lighten-3": "#9fa8da",
	"brown lighten-2": "#a1887f",
	"green lighten-3": "#a5d6a7",
	"teal accent-1": "#a7ffeb",
	"purple accent-4": "#aa00ff",
	"purple lighten-1": "#ab47bc",
	"pink darken-3": "#ad1457",
	"light-green lighten-2": "#aed581",
	"lime accent-4": "#aeea00",
	"lime darken-2": "#afb42b",
	"blue-grey lighten-3": "#b0bec5",
	"teal lighten-4": "#b2dfdb",
	"cyan lighten-4": "#b2ebf2",
	"light-green accent-2": "#b2ff59",
	"deep-purple accent-1": "#b388ff",
	"deep-purple lighten-3": "#b39ddb",
	"light-blue lighten-4": "#b3e5fc",
	"red darken-4": "#b71c1c",
	"green accent-1": "#b9f6ca",
	"purple lighten-2": "#ba68c8",
	"blue lighten-4": "#bbdefb",
	"brown lighten-3": "#bcaaa4",
	"grey lighten-1": "#bdbdbd",
	"deep-orange darken-4": "#bf360c",
	"lime darken-1": "#c0ca33",
	"pink darken-2": "#c2185b",
	"pink accent-4": "#c51162",
	"indigo lighten-4": "#c5cae9",
	"light-green lighten-3": "#c5e1a5",
	"red darken-3": "#c62828",
	"lime accent-3": "#c6ff00",
	"green lighten-4": "#c8e6c9",
	"light-green accent-1": "#ccff90",
	"lime": "#cddc39",
	"purple lighten-3": "#ce93d8",
	"blue-grey lighten-4": "#cfd8dc",
	"deep-purple lighten-4": "#d1c4e9",
	"red darken-2": "#d32f2f",
	"lime lighten-1": "#d4e157",
	"red accent-4": "#d50000",
	"purple accent-3": "#d500f9",
	"brown lighten-4": "#d7ccc8",
	"pink darken-1": "#d81b60",
	"deep-orange darken-3": "#d84315",
	"lime lighten-2": "#dce775",
	"light-green lighten-4": "#dcedc8",
	"deep-orange accent-4": "#dd2c00",
	"purple accent-2": "#e040fb",
	"grey lighten-2": "#e0e0e0",
	"teal lighten-5": "#e0f2f1",
	"cyan lighten-5": "#e0f7fa",
	"purple lighten-4": "#e1bee7",
	"light-blue lighten-5": "#e1f5fe",
	"blue lighten-5": "#e3f2fd",
	"red darken-1": "#e53935",
	"red lighten-2": "#e57373",
	"deep-orange darken-2": "#e64a19",
	"orange darken-4": "#e65100",
	"lime lighten-3": "#e6ee9c",
	"indigo lighten-5": "#e8eaf6",
	"green lighten-5": "#e8f5e9",
	"pink": "#e91e63",
	"purple accent-1": "#ea80fc",
	"pink lighten-1": "#ec407a",
	"blue-grey lighten-5": "#eceff1",
	"deep-purple lighten-5": "#ede7f6",
	"grey lighten-3": "#eeeeee",
	"lime accent-2": "#eeff41",
	"red lighten-1": "#ef5350",
	"orange darken-3": "#ef6c00",
	"red lighten-3": "#ef9a9a",
	"brown lighten-5": "#efebe9",
	"pink lighten-2": "#f06292",
	"lime lighten-4": "#f0f4c3",
	"light-green lighten-5": "#f1f8e9",
	"purple lighten-5": "#f3e5f5",
	"red": "#f44336",
	"deep-orange darken-1": "#f4511e",
	"pink lighten-3": "#f48fb1",
	"lime accent-1": "#f4ff81",
	"pink accent-3": "#f50057",
	"orange darken-2": "#f57c00",
	"yellow darken-4": "#f57f17",
	"grey lighten-4": "#f5f5f5",
	"pink lighten-4": "#f8bbd0",
	"yellow darken-3": "#f9a825",
	"lime lighten-5": "#f9fbe7",
	"grey lighten-5": "#fafafa",
	"orange darken-1": "#fb8c00",
	"yellow darken-2": "#fbc02d",
	"deep-orange lighten-5": "#fbe9e7",
	"pink lighten-5": "#fce4ec",
	"yellow darken-1": "#fdd835",
	"red accent-3": "#ff1744",
	"deep-orange accent-3": "#ff3d00",
	"pink accent-2": "#ff4081",
	"red accent-2": "#ff5252",
	"deep-orange": "#ff5722",
	"orange accent-4": "#ff6d00",
	"deep-orange accent-2": "#ff6e40",
	"amber darken-4": "#ff6f00",
	"deep-orange lighten-1": "#ff7043",
	"pink accent-1": "#ff80ab",
	"deep-orange lighten-2": "#ff8a65",
	"red accent-1": "#ff8a80",
	"amber darken-3": "#ff8f00",
	"orange accent-3": "#ff9100",
	"orange": "#ff9800",
	"deep-orange accent-1": "#ff9e80",
	"amber darken-2": "#ffa000",
	"orange lighten-1": "#ffa726",
	"amber accent-4": "#ffab00",
	"orange accent-2": "#ffab40",
	"deep-orange lighten-3": "#ffab91",
	"amber darken-1": "#ffb300",
	"orange lighten-2": "#ffb74d",
	"amber": "#ffc107",
	"amber accent-3": "#ffc400",
	"amber lighten-1": "#ffca28",
	"orange lighten-3": "#ffcc80",
	"deep-orange lighten-4": "#ffccbc",
	"red lighten-4": "#ffcdd2",
	"orange accent-1": "#ffd180",
	"amber lighten-2": "#ffd54f",
	"yellow accent-4": "#ffd600",
	"amber accent-2": "#ffd740",
	"amber lighten-3": "#ffe082",
	"orange lighten-4": "#ffe0b2",
	"amber accent-1": "#ffe57f",
	"yellow accent-3": "#ffea00",
	"yellow": "#ffeb3b",
	"red lighten-5": "#ffebee",
	"amber lighten-4": "#ffecb3",
	"yellow lighten-1": "#ffee58",
	"yellow lighten-2": "#fff176",
	"orange lighten-5": "#fff3e0",
	"yellow lighten-3": "#fff59d",
	"amber lighten-5": "#fff8e1",
	"yellow lighten-4": "#fff9c4",
	"yellow lighten-5": "#fffde7",
	"yellow accent-2": "#ffff00",
	"yellow accent-1": "#ffff8d"
};