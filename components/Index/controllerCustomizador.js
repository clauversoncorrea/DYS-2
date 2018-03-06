// $(".button-collapse").sideNav({ edge: 'right' });
// $(".icon-menu").sideNav({ edge: 'left' });

menutelas.addEventListener("click", controlWidthView, false);

if ($("#navGears")[0]) {
  $("#navGears")[0].addEventListener("click", controlWidthView, false);
  $("#navGears")[0].addEventListener("click", function (e) {
    $(".nav-settings")[0].classList.toggle("active");
  }, false);
}

function controlWidthView(e, elm) {
  // Encontrar o elemento
  if (elm) elm = elm;
  else {
    elm = event.target
    if (event.target.tagName == "I") elm = elm.parentElement;
  }

  elm.classList.toggle("menu-ativo");

  if (elm.id == "navGears") {
    if (elm.classList.contains("menu-ativo")) {
      if ($('#menutelas')[0].classList.contains("menu-ativo")) {
        $('#view')[0].style.width = "50%";
        if($(".barra-fixa")[0]) $(".barra-fixa")[0].style.width = "49%";
      }
      else {
        $('#view')[0].style.width = "63.2%";
        if($(".barra-fixa")[0]) $(".barra-fixa")[0].style.width = "62%";
      }
    }
    else {
      if ($('#menutelas')[0].classList.contains("menu-ativo")) {
        $('#view')[0].style.width = "83.2%";
        if($(".barra-fixa")[0]) $(".barra-fixa")[0].style.width = "82.1%";
      }
      else {
        $('#view')[0].style.width = "96.2%";
        if($(".barra-fixa")[0]) $(".barra-fixa")[0].style.width = "95%";
      }
    }
  }
  else {
    if (elm.classList.contains("menu-ativo")) {
      if (!$('#navGears')[0]) {
        $('#view')[0].style.width = "83.2%";
        if($(".barra-fixa")[0]) $(".barra-fixa")[0].style.width = "95%";
      }
      else {
        if ($('#navGears')[0].classList.contains("menu-ativo")) {
          $('#view')[0].style.width = "50%";
          if($(".barra-fixa")[0]) $(".barra-fixa")[0].style.width = "49%";
        }
        else {
          $('#view')[0].style.width = "83.2%";
          if($(".barra-fixa")[0]) $(".barra-fixa")[0].style.width = "82.1%";
        }
      }
    }
    else {
      if (!$('#navGears')[0]) {
        $('#view')[0].style.width = "96.2%";
        if($(".barra-fixa")[0]) $(".barra-fixa")[0].style.width = "97%";
      }
      else {
        if ($('#navGears')[0].classList.contains("menu-ativo")) {
          $('#view')[0].style.width = "63.2%";
          if($(".barra-fixa")[0]) $(".barra-fixa")[0].style.width = "62%";
        }
        else {
          $('#view')[0].style.width = "96.2%";
          if($(".barra-fixa")[0]) $(".barra-fixa")[0].style.width = "95%";
        }
      }
    }
  }
  // }
};