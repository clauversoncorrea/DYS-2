app.directive("menuSettings", function() {
    return {
        restrict: 'E',
        templateUrl: "../components/DYS_MENU_SETTINGS/template.html",
        controller: function($scope, $http, $compile) {

            $('.tabs').tabs();

            settingsExpand = function() {
                var elm = event.target.parentElement;
                $("body")[0].classList.toggle("expand");
                if ($("body")[0].classList.contains("expand")) {
                    elm.querySelector(".fa").className = "fa fa-expand";

                    // $('#view')[0].className = "card offset-s2 col s10 no-margin-tb no-padding fill-height";
                    // $('#view')[0].parentElement.style.marginRight = "10px";

                    // Tela de Filtros
                    $('#nav-settings #filtros #consulta')[0].className = "col s6";
                    $('#nav-settings #filtros #filtro')[0].className = "col s6";

                    // Tela de Eventos e Funções
                    $('#nav-settings #eventos #evento')[0].className = "col s6";
                    $('#nav-settings #eventos #funcao')[0].className = "col s6";

                    // Tela de Filtros
                    $('#nav-settings #filtros #consulta')[0].className = "col s6";
                    $('#nav-settings #filtros #filtro')[0].className = "col s6";
                }
                else {
                    elm.querySelector(".fa").className = "fa fa-compress";
                    // $('#view')[0].className = "card offset-s2 col s7 no-margin-tb no-padding fill-height";
                    // $('#view')[0].parentElement.style.marginRight = "0px";

                    // Tela de Filtros
                    $('#nav-settings #filtros #consulta')[0].className = "col s12";
                    $('#nav-settings #filtros #filtro')[0].className = "col s12";

                    // Tela de Eventos e Funções
                    $('#nav-settings #eventos #evento')[0].className = "col s12";
                    $('#nav-settings #eventos #funcao')[0].className = "col s12";
                }
            }

            // Adiciona o evento para Salvar com ENTER dentro da DIV propriedades
            // $("#propriedades")[0].addEventListener("keypress", function(e) {
            //     var elm = event.target;
            //     if (e.keyCode == 13) {
            //         if(elm.tagName=="SELECT" && elm.id=="selectbox") $("#propriedades #" + elm.parentElement.dataset.template + " .btn")[0].click();
            //         else $("#propriedades #" + elm.dataset.template + " .btn")[0].click();
            //     }
            // }, false);

        }
    };
});