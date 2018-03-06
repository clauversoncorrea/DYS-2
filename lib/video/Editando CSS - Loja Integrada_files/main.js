var formatar_decimal = function(valor) {
    /*
     * Transforma um decimal BR em float.
     * >>> formatar_decimal('15,00')
     * 15.00
     * >>> formatar_decimal('1.125,35')
     * 1125.35
     */

    // Retira qualquer ponto de milhar.
    valor = valor.replace('.', '');
    valor = valor.replace(',', '.');
    return parseFloat(valor);
};

var formatar_decimal_br = function(valor) {
    if (valor == 0) {
        return '0,00';
    }

    var valor = valor.toFixed(2);
    var valor_e_decimal = valor.split('.');
    var inteiro = valor_e_decimal[0];
    var decimal = valor_e_decimal[1];

    var vezes = inteiro.length / 3;
    var inicio = inteiro.length % 3;

    var novo_inteiro = [];
    var primeiro_ok = false;
    var contador = 0;

    $.each(inteiro.toString().split(''), function(i) {
        if (inicio === 0 && contador === 0) {
            primeiro_ok = true;
        }
        if (contador == inicio && primeiro_ok === false) {
            novo_inteiro.push('.');
            contador = 0;
            primeiro_ok = true;
        }
        if (contador !== 0 && contador % 3 === 0) {
            novo_inteiro.push('.');
        }
        novo_inteiro.push(inteiro[i]);
        contador++;
    });
    return novo_inteiro.join('') + ',' + decimal;
};

jQuery.loader = function(text, not_scroll) {
    if (!not_scroll) {
        $('html, body').animate({ scrollTop:0 }, 'fast');
    }
    $('#loading').hide();
    if (text) {
        $('#loading .loading-text').html(text);
    }
    $('.modal-backdrop').remove();
    $('body').append('<div class="modal-backdrop in"></div>');
    $('#loading').show();
};

jQuery.removeLoader = function() {
    $('#loading').hide();
    $('.modal-backdrop').remove();
};

$(document).ready(function() {
    $('html.no-js').removeClass('no-js').addClass('with-js');

    $("#collapse-body").on("hidden", function() {
        $(".collapse-button i").toggleClass("icon-chevron-up icon-chevron-down");
    });

    $("#collapse-body").on("shown.bs.modal", function() {
        $(".collapse-button i").toggleClass("icon-chevron-down icon-chevron-up");
    });

    /*
     * Ao clicar no select_all, procura por todos os outros checkboxes na tabela
     * do pai, selecionando ou deselecionando todos eles.
     */
    $('.select_all').click(function(){
        rel = $(this).attr('rel');
        if (!rel) {
            checks = $(this).parents().filter('table').find('input[type=checkbox]').not('[disabled=disabled]');
        } else {
            checks = $(rel).find('input[type=checkbox]').not('[disabled=disabled]');
        }
        if ($(this).attr('checked')) {
            checks.attr('checked', 'checked');
        } else {
            checks.removeAttr('checked');
        }
    });

    // Fix click in the dropdown-fixed.
    $('.dropdown-fixed').click(function(e) {
        e.stopPropagation();
    });


    var preco = function(obj) {
        var float_preco_venda;
        var preco_venda = obj.val();
        if (preco_venda) {
            float_preco_venda = formatar_decimal(preco_venda);
            preco_venda = formatar_decimal_br(float_preco_venda);
        }
        return [float_preco_venda, preco_venda];
    };

    var verificar_precos_produto_filho = function(self, pai) {
        self = $(self);
        var parent = self.parents().filter(pai);

        var input_cheio = $('#id_cheio', parent);
        var input_promocional = $('#id_promocional', parent);

        preco_venda_retorno = preco(input_cheio);
        float_preco_venda = preco_venda_retorno[0];
        preco_venda = preco_venda_retorno[1];

        preco_promocional_retorno = preco(input_promocional);
        float_preco_promocional = preco_promocional_retorno[0];
        preco_promocional = preco_promocional_retorno[1];

        error_msg = '<div class="clear alert alert-danger error-preco" style="margin-top:10px">:mensagem:</div>';
        if (float_preco_promocional >= float_preco_venda) {
            input_cheio.parents('.control-group').addClass('error');
            input_promocional.parents('.control-group').addClass('error');
            if (!$('.error-preco', parent).length) {
                msg = error_msg.replace(":mensagem:", "O preço promocional não pode ser maior ou igual que o preço de venda.");
                $(msg).appendTo(parent.find('.error-preco-wrapper'));
            }
        } else {
            input_cheio.parents('.control-group').removeClass('error');
            input_promocional.parents('.control-group').removeClass('error');
            $('.error-preco', parent).remove();
        }
    };

    var verificar_precos = function() {
        preco_venda_retorno = preco($('.preco-venda input'));
        float_preco_venda = preco_venda_retorno[0];
        preco_venda = preco_venda_retorno[0];

        preco_promocional_retorno = preco($('.preco-promocional input'));
        float_preco_promocional = preco_promocional_retorno[0];
        preco_promocional = preco_promocional_retorno[0];

        if (preco_venda) {
          $('.box-price-show').removeClass('alert alert-error');
          $('.box-price-show .alert-venda-empty').hide();
          if ((preco_venda && preco_promocional) || (!preco_venda && !preco_promocional)) {
              $('.price-full, .price-promotional').show();
              $('.price-full').addClass('strike');
              $('.price-only').hide();
          } else if (preco_venda && !preco_promocional) {
              $('.price-full, .price-promotional').hide();
              $('.price-only').show().find('span').text(preco_venda);
          } else if (!preco_venda && preco_promocional) {
              $('.price-full, .price-promotional').hide();
              $('.price-only').show().find('span').text(preco_promocional);
          }

          error_msg = '<div class="clear alert alert-danger error-preco" style="margin-top:10px">:mensagem:</div>';
          if (float_preco_promocional >= float_preco_venda) {
              $('.preco-promocional.control-group').addClass('error');
              $('.preco-venda.control-group').addClass('error');
              if (!$('.error-preco').length) {
                  msg = error_msg.replace(":mensagem:", "O preço promocional não pode ser maior ou igual que o preço de venda.");
                  $(msg).appendTo('.price-box');
              }
          } else {
              $('.preco-promocional.control-group').removeClass('error');
              $('.preco-venda.control-group').removeClass('error');
              $('.error-preco').remove();
          }
        } else {
            $('.box-price-show > *').hide();
            $('.box-price-show').addClass('alert alert-error');
            $('.box-price-show .alert-venda-empty').show();
        }
    };

    $('.preco-venda input').live('keyup', function() {
        var valor = '';
        if (this.value) {
            valor = formatar_decimal_br(formatar_decimal(this.value));
        }
        $('.price-full span').text(valor);
        verificar_precos();
    }).keyup();

    $('.preco-promocional input').live('keyup', function() {
        var valor = '';
        if (this.value) {
            valor = formatar_decimal_br(formatar_decimal(this.value));
        }
        $('.price-promotional span').text(valor);
        verificar_precos();
    }).keyup();

    $('.produto-atributo-form [name=cheio], ' +
      '.produto-atributo-form [name=promocional]').keyup(function () {
        verificar_precos_produto_filho(this, '.produto-atributo-form');
    });

    $('.produto-form-atributo-criar [name=cheio], ' +
      '.produto-form-atributo-criar [name=promocional]').keyup(function () {
        verificar_precos_produto_filho(this, '.produto-form-atributo-criar');
    });
    $('.scroll-not-propagate').bind('mousewheel', function(e, d) {
        var height = $(this).height();
        var scrollHeight = $(this).get(0).scrollHeight;
        if((this.scrollTop === (scrollHeight - height) && d < 0) || (this.scrollTop === 0 && d > 0)) {
            e.preventDefault();
        }
    });

    $('.menu-section .with-sub a').click(function(event) {
        if($(this).attr('href') == '#') {
            event.preventDefault();
        }
        if (!$(this).parents().hasClass('active')) {
            var active = $('.menu-section .with-sub.active');
            $('.menu-section .with-sub ul').slideUp();
            $('.menu-section .with-sub').not($(this).parent()).not(active).removeClass('active');
            $(this).parent().find('ul').slideDown(function() {
                active.removeClass('active');
            });
            $(this).parent().addClass('active');
        }
    });


    // retirando switchfy por problemas de compatiblidade.
    // $('.fancy-switch').switchify();
    function sortear_imagens() {
        $('.sortable').sortable(
            {
                update: function(event, ui) {
                    images = $('.sortable .image');
                    image_ids = {'imagem_id': []};
                    images.each(function(i, e) {
                        image_ids['imagem_id'].push($(e).data('id'));
                    });
                    var url = $('.sortable').data('url');
                    $.post(url, image_ids);
                },
                cancel: ".empty",
                items: ".image:not(.empty)",
                revert: 250,
                activate: function( event, ui ) {
                    $('.image:not(.empty, .ui-sortable-placeholder)').addClass('drop-area');
                    ui.helper.appendTo('.sortable');
                    $('.image-widget .image').tooltip('destroy');
                },
                beforeStop: function( event, ui ) {
                    $('.image:not(.empty)').removeClass('drop-area');
                    $('.image-widget .image').tooltip('hide');
                },
                tolerance: "pointer",
                cursorAt: { top: 40, left: 40 }
            }
        );
        $('.sortable').disableSelection();
    }

    function destruir_sortear_imagens() {
        $('.sortable').sortable('destroy');
    }
    if ($('.sortable').length) {
        sortear_imagens();
    }

    if ($('.urlify').length) {
        $('.urlify').keyup(function() {
            var slug = URLify($(this).val());
            var update = ($('.urlify').attr('rel') || '').split(',');
            for (var item in update) {
                var obj = $(update[item]);
                if (obj.is('input')) {
                    obj.val(slug);
                } else {
                    obj.text(slug);
                }
            }
        });
    }

    $('.image-widget').on('click', '.imagem-remover', function() {
        var that = $(this);
        var url = that.data('url');
        that.parent().parent().hide();
        $.get(url, function(res) {
            if (res.estado == 'ERRO') {
                alert(res.mensagem);
                that.parent().parent().show();
            } else {
                that.parent().parent().remove();
                completar_imagens_vazias();
            }
        }, 'json');
        return false;
    });

    var completar_imagens_vazias = function () {
        total_imagens = $('.image-widget .image').length;
        total_imagens_vazias = $('.image-widget .image.empty').length;
        if (total_imagens < 4) {
            for (var i = 0; i < 4 - total_imagens; i++) {
                // Adicionando os itens vazios necessários.
                empty = ['<div class="col-xs-4 image">',
                         '<div class="inner empty">',
                               '<i class="icon-custom icon-image icon-big"></i>',
                           '</div>',
                        '</div>'].join('');
                $('.image-widget .row').append(empty);
            }
        }
        return true;
    };
    if ($('.image-widget .image').length) {
        completar_imagens_vazias();
    }

    if ($("#uploadImagemProduto").length && !$.browser.msie) {
        $(document).bind('dragover', function (e) {
            var dropZone = $('#dropzone'),
                timeout = window.dropZoneTimeout;
            if (!timeout) {
                dropZone.addClass('in');
                // só vamos colocar o overlay se a
                // dropzone estiver visisvel
                if ($('#dropzone:visible').length > 0) {
                    $('.black-overlay').stop().fadeIn(600);
                }
            } else {
                clearTimeout(timeout);
            }
            if (e.target === dropZone[0]) {
                dropZone.addClass('hover');
            } else {
                dropZone.removeClass('hover');
            }
            window.dropZoneTimeout = setTimeout(function () {
                window.dropZoneTimeout = null;
                dropZone.removeClass('in hover');
                $('.black-overlay').stop().fadeOut();
            }, 100);
        });
        $("#uploadImagemProduto").fileupload({
            dataType: 'json',
            singleFileUploads: false,
            dropZone: $('#dropzone, #uploadImagemProduto'),
            add: function(e, data) {
                var arquivo_nao_suportado = false;
                var tamanho_maximo = 3 * 1024 * 1024;
                $.each(data.files, function(index, file) {
                    var ext = file.name.split('.');
                    ext = ext[ext.length-1];
                    var arquivos_suportados = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

                    if ($.inArray(ext.toLowerCase(), arquivos_suportados) == -1 || file.size > tamanho_maximo) {
                        // mostrar modal
                        $('#modal-arquivo-invalido').modal('show');
                        arquivo_nao_suportado = true;

                    }
                });
                if (!arquivo_nao_suportado) {
                    data.submit();
                }
            },
            send: function(e, data){
                // Esconde tudo e mostra a barra e o texto.
                // $('#uploadProgressbar').show();

                $('.upload-wrapper').show();
                $("div.image-widget").find(".upload").show();
            },
            done: function (e, data) {
                // var lista_imagens = $('#lista_imagens');
                // $('#uploadProgressbar').hide();
                $('.upload-wrapper').hide();
                // $("div.image-widget").find(".upload").hide();
                $('#uploadProgressbar .bar').css('width','0%');
                var arquivo = data.result.img ;
                // $(".btn-upload").hide();
                // $(".upload-text").hide();
                if(arquivo){
                    $(".form-produto").attr("action", data.result.action_url);
                    // mudando a url do input_url
                    $("#uploadImagemProduto").data('blueimpFileupload').options.url = data.result.input_url;
                    $('.image-widget.sortable').data('url', data.result.sortable_url);
                    $.each(arquivo, function(i, item){
                        $(".empty:last").parent().remove();
                        var img_html = [
                        '<div class="col-xs-4 image" data-id="::ITEMID::" >',
                            '<div class="inner">',
                                '<img src="::IMAGE_URL::" />',
                                '<a href="::REMOVER_URL::" class="imagem-remover" data-url="::REMOVER_URL_JSON::">x</a>',
                            '</div>',
                        '</div>'
                        ].join('');
                        img_html = img_html.replace('::ITEMID::', item.id);
                        img_html = img_html.replace('::IMAGE_URL::', MEDIA_URL + item.caminho);
                        img_html = img_html.replace('::REMOVER_URL::', item.url_remover);
                        img_html = img_html.replace('::REMOVER_URL_JSON::', item.url_remover_json);

                        if($('.empty').length) {
                            $('.empty:first').parent().before(img_html);
                        } else {
                            $('.image-widget .row').append(img_html);
                        }
                    });
                    // destruir_sortear_imagens();
                    // sortear_imagens();
                }

            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#uploadProgressbar .progress-bar').css('width', progress + '%').html(progress + '%');
            },
            fail: function (e, data) {
              console.log(data.errorThrown);
              console.log(data.textStatus);
              console.log(data.jqXHR);
              $('.upload-wrapper').hide();
              alert('Houve um erro ao adicionar a imagem. Tente novamente mais tarde');
            }
        });
    }

    $("div.buttons > a.button-select").click(function(event){
        event.preventDefault();
        $(".theme-choice").find("li.theme").removeClass("active");
        $(".button-select").children("i").addClass("hide");

        $(this).parents("li.theme").addClass("active");
        $(this).parent().children("input").attr("checked", "checked");
        $(this).children("i").removeClass("hide");
    });
    if($.mask) {
        $('#id_cep, .input-cep').mask('99999-999');
        var telefone_selector = '#id_telefone, #id_loja_telefone, #id_telefone_principal, #id_telefone_alternativo, #id_telefone_celular, #id_telefone_comercial, #id_whatsapp';
        if(!$(telefone_selector).val() || $(telefone_selector).val().length > 9) {
            $(telefone_selector).mask('(99) 9999-9999?9');
        }
        $(telefone_selector).live("keyup",function() {
            var tmp = $(this).val();
            tmp = tmp.replace(/[^0-9]/g,'');
            var ddd = tmp.slice(0, 2);
            var servico_regex = new RegExp('0[0-9]00');
            var servico = servico_regex.exec(tmp.slice(0,4));
            var primeiro_numero_ddd = tmp.slice(0, 1);
            var primeiro_numero = tmp[2];
            // console.log('trigger');
            if (tmp.length == 11 && primeiro_numero == '9') {
                $(this).unmask();
                $(this).val(tmp);
                $(this).mask("(99) 99999-999?9");
            } else if (servico && (tmp.length == 11 || tmp.length == 10)) {
                $(this).unmask();
                $(this).val(tmp);
                $(this).mask("9999-999999?9");
            } else if (tmp.length == 10 && (primeiro_numero_ddd == '1' || primeiro_numero_ddd == '2') && primeiro_numero == '9') {
                $(this).unmask();
                $(this).val(tmp);
                $(this).mask("(99) 9999-9999?9");
            } else if (tmp.length == 10) {
                $(this).unmask();
                $(this).val(tmp);
                $(this).mask("(99) 9999-9999?9");
            } else if (($(this).val().indexOf('(__)') >= 0 && tmp.length == 8) || (tmp.length == 8 && tmp[4] == '-')) {
                $(this).unmask();
                $(this).val(tmp);
                $(this).mask("9999-9999?9");
            } else if (tmp.length == 0 && $(this).val() != "(__) ____-_____") {
                $(this).unmask();
                $(this).val(tmp);
                $(this).mask("(99) 9999-9999?9");
            }
        }).keyup();
    }

    $('.datepicker').datepicker().on('changeDate', function(ev){ $(this).datepicker('hide').blur(); });

    $('select[name^=ativ]').addClass('select_ativo');
    $('select[name^=ativ]').find('[value=True]').css({'backgroundColor': 'green'});
    $('select[name^=ativ]').find('[value=False]').css({'backgroundColor': 'red'});
    $('select[name^=ativ]').change(function() {
        if ($(this).val() == "True") {
            $(this).css({'backgroundColor': 'green', 'color': '#FFFFFF'});
        } else {
            $(this).css({'backgroundColor': 'red', 'color': '#FFFFFF'});
        }
    }).change();

    $('[rel~=tooltip]').tooltip();
    $('.btn-loading').click(function(event) {
        if ($(this).data('loading-text')) {
            $.loader($(this).data('loading-text'));
        } else {
            $.loader('Carregando...');
        }
    });

    $('.collapse').on('hide.bs.modal', function () {
        $(this).parent().find('.arrow-open i').addClass('icon-chevron-down');
        $(this).parent().find('.arrow-open i').removeClass('icon-chevron-up');
    });
    $('.collapse').on('show.bs.modal', function () {
        $(this).parent().find('.arrow-open i').removeClass('icon-chevron-down');
        $(this).parent().find('.arrow-open i').addClass('icon-chevron-up');
    });
    $('.collapse').on('shown.bs.modal', function () {
        $('html, body').stop().animate({
          'scrollTop': ($(this).offset().top)-90
        }, 500);
    });
    $(".actions-menu [data-toggle=tooltip]").tooltip({
        container: '.actions-menu'
    });
    $(".visitas [data-toggle=tooltip]").tooltip({
        container: '.visitas .progress-bar'
    });
    $(".ciclo-plano [data-toggle=tooltip]").tooltip({
        container: '.ciclo-plano .progress-empty'
    });
    $("[data-toggle=tooltip]").tooltip({
        container: 'body'
    });

    if($('.alert.alert-success').length && ($('.produto-listar').length || $('.form-produto').length || $('.categoria-listar').length || $('.marca-listar').length || $('.marcas-criar-editar').length || $('.banner-listar').length || $('.painel-loja-css').length || $('.painel-loja-html').length || $('.painel-loja-html-listar').length)) {
      show_aviso_cache()
    };

});

show_modal_error = function(msg) {
    $('#modal-error .error-text').html(msg);
    jQuery.removeLoader();
    $('#modal-error').modal('show');
};

show_modal_success = function(msg) {
    $('#modal-success .success-text').html(msg);
    jQuery.removeLoader();
    $('#modal-success').modal('show');
};

var count_hide_aviso_cache;
function show_aviso_cache() {
  if($('.alert-limpar-cache').length) {
    $('.alert-limpar-cache').slideDown();
    count_hide_aviso_cache = setTimeout(function(){ hide_aviso_cache(); }, 5000);
    $('.alert-limpar-cache').hover(function(){
      clearTimeout(count_hide_aviso_cache);
    }, function(){
      count_hide_aviso_cache = setTimeout(function(){ hide_aviso_cache(); }, 2000);
    });
  };
};
function hide_aviso_cache() {
  clearTimeout(count_hide_aviso_cache);
  $('.alert-limpar-cache').slideUp();
  if($('.alert-limpar-cache').prev().is(':visible')) {
    $('.alert-limpar-cache').prev().slideUp();
  }
};

validar_dominio = function(dominio) {
    regex_dominio = /^([a-z0-9áéíóúâêîôûüàçãõ]([a-z0-9áéíóúâêîôûüàçãõ\-]{0,61}[a-z0-9])?\.)+[a-z-]{2,}$/;
    if(dominio.indexOf('www.') >= 0 || dominio.indexOf('cdn.vtex.com') >= 0) {
        return false
    } else if(dominio.match(regex_dominio)) {
      return true;
    } else {
      return false;
    }
};

validar_cartao_credito = function(val){
    var nondigits = new RegExp(/[^0-9]+/g);
    var number = val.replace(nondigits,'');
    var pos, digit, i, sub_total, sum = 0;
    var strlen = number.length;
    if (strlen < 13) {
        return false;
    }
    for (i=0;i<strlen;i++){
        pos = strlen - i;
        digit = parseInt(number.substring(pos - 1, pos), 10);
        if(i % 2 == 1){
            sub_total = digit * 2;
            if(sub_total > 9){
                sub_total = 1 + (sub_total - 10);
            }
        } else {
            sub_total = digit;
        }
        sum += sub_total;
    }
    if (sum > 0 && sum % 10 === 0) {
        return true;
    }
    return false;
};

/*
 * Plugin para montagem de modal para exibicao de video.
 *
 * $('.btn-video').video({
 *         id: 'wOA33FPrSdw', // Obrigatorio.
 *         title: '',         // Se deixar nao aparece o titulo.
 *         width: 500,        // Opcional. Padrao 560.
 *         height: 300        // Opcional. Padrao 315.
 *     });
 * });
 */
jQuery.fn.video = function(options) {
    this.each(function() {
        $(this).click(function() {
            var settings = $.extend({
                width: 510,
                height: 315,
                id: '',
                title: ''
            }, options );

            if (settings.id === '') {
                return false;
            }

            _constructor(settings);
        });
    });

    // Constroi Modal com iframe de video.
    _constructor = function(settings) {
        var iframe = '<iframe width="' + settings.width + '" height="' + settings.height + '" src="//www.youtube.com/embed/' + settings.id + '" frameborder="0" allowfullscreen></iframe>';

        if(!settings.title) {
            $('#modal-video .modal-header').hide();
            $('#modal-video .modal-footer').show();
        } else {
            $('#modal-video .modal-header h3').html(settings.title);
        }
        $('#modal-video .modal-body').html(iframe);
        $('#modal-video').css({
            width: settings.width + 30 + 'px'
        });
        $('#modal-video').modal('show');
        $('#modal-video').on('hidden.bs.modal', function() {
            _stop();
        });
    }

    _stop = function() {
        var src;
        src = $('#modal-video .modal-body iframe').attr(src);

        $('#modal-video .modal-body iframe').attr('src', '');
        $('#modal-video .modal-body iframe').attr('src', src);
    }
}

/* Load do RSS do blog e suporte no painel */
function formatar_data(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "/" + month + "/" + year;
    return date;
};
function truncar_texto(texto,limite){
    if(texto.length>limite){
        limite--;
        last = texto.substr(limite-1,1);
        while(last!=' ' && limite > 0){
            limite--;
            last = texto.substr(limite-1,1);
        }
        last = texto.substr(limite-2,1);
        if(last == ',' || last == ';'  || last == ':'){
            texto = texto.substr(0,limite-2) + '...';
        } else if(last == '.' || last == '?' || last == '!'){
            texto = texto.substr(0,limite-1);
        } else {
             texto = texto.substr(0,limite-1) + '...';
        }
    }
    return texto;
}
var dataNovo=new Date();
dataNovo.setDate(dataNovo.getDate()-10);
function loaded_blog(result) {
    if (!result.error) {
        for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            var dataPubli = new Date(entry.publishedDate);
            var img = $(entry.content).find('img:first');
            img = $(img[0]).attr('src');
            var div = "<div class='media'><a class='pull-left' href='" + entry.link + "' target='_blank'><img class='media-object' src='" + img + "' /></a><div class='media-body'><a href='" + entry.link + "' target='_blank' title='" + entry.title + "'><h4 class='media-heading'><span class='text'>" + truncar_texto(entry.title, 100) + "</span>";
            if (dataPubli > dataNovo) {
            div += "<span class='label label-success'>Novo</span>";
            }
            div += "<small> - " + formatar_data(dataPubli) + "</small></h4>" + truncar_texto(entry.contentSnippet, 120) + "</a></div></div>";
            $('.changelog-container .box-content').append(div);
        }
    }
}
function loaded_suporte(result) {
    if (!result.error) {
        for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            var dataPubli = new Date(entry.publishedDate);
            // var img = $(entry.content).find('img:first');
            // console.log(img);
            // img = $(img[0]).attr('src');
            var div = "<div class='media'><div class='media-body'><a href='" + entry.link + "' target='_blank' title='" + entry.title + "'><h4 class='media-heading'><span class='text'>" + truncar_texto(entry.title, 100) + "</span>";
            if (dataPubli > dataNovo) {
            div += "<span class='label label-success'>Novo</span>";
            }
            div += "</h4>" + entry.contentSnippet + "</a></div></div>";
            $('.suporte-container .box-content').append(div);
        }
    }
}


/* Track */
$(document).ready(function() {
    if (typeof track == "undefined") {
        alert("track é undefined");  // Será mostrado
    } else {
        var data_json = {
            "track" : track
        }

        $.ajax({
            type: 'POST',
            url: API_URL + "v2/track",
            //url: "http://api-local.awsli.com.br/v2/track",
            data: data_json,
            crossDomain: true
            //dataType: 'jsonp'
        });
    }
});

/* Notificacoes */

$(document).ready(function() {

  // var qtd = $('.notificacao-item.nova').size();
  // $('.notificacoes .contagem').text(qtd);

  $('.tip').tooltip();

  $('#modal-alerta').modal({
    show: false,
    backdrop: 'static'
  });

  $('#confirmarAlerta').click(function() {

    if ($(this).attr('checked')) {
      $('.fechar-alerta').removeClass('hide');
    }
    else {
      $('.fechar-alerta').addClass('hide');
    }

  });

  $('.menu-main-ul li').hover(function(){
   $('.notificacoes').removeClass('open');
   if (!$('.navbar-collapse').hasClass('in')) {
   	$('.store').removeClass('open');
    }
   $('.notificacoes .icon-envelope').addClass('icon-white');
 });

   $('.notificacoes > a').click(function(){
    if(!$('.notificacoes').hasClass('open')) {
	$('.notificacoes .icon-envelope').removeClass('icon-white');
	}
	else {
	 $('.notificacoes .icon-envelope').addClass('icon-white');
	}
   });

   $(document).on('click', function( e ) {
	$('.notificacoes .icon-envelope').addClass('icon-white');
   });

   $('.store > a').click(function() {
        $('.notificacoes .icon-envelope').addClass('icon-white');
   });


    /* Pagina Detalhe de Pedidos */
    if($('.page-pedidos')) {
        $('.page-pedidos .confirm-envio-track').click(function (e) {
            $('.box-envio .action-btn').hide();
            $('.box-envio .action-form').show();
        });
        $('.page-pedidos .edit').click(function (e) {
            $('.box-envio .action-btn, .box-envio .done-div').hide();
            $('.box-envio .action-form, .box-envio .action-div').show();
        });
    };

    $('.toggle-menu .action').click(function() {
        var myDate = new Date();
        myDate.setFullYear(myDate.getFullYear() + 5);
        $('#leftCol').toggleClass('slim');
        $(this).find('i').toggleClass('icon-chevron-right icon-chevron-left');
        if($('#leftCol').hasClass("slim")) {
            document.cookie="slim_menu=1; expires=" + myDate + "; domain=" + window.location.host + "; path=/";
        } else {
            document.cookie="slim_menu=0; expires=" + myDate + "; domain=" + window.location.host + "; path=/";
        }
    });

});

/* Parceiros */

$(document).ready(function() {
    $('.parceiros-menu .tipo-parceiro').click(function () {
    	var tipo = $(this).data('parceiro');
    	if (!$(this).parent().hasClass('active')) {
            $('.parceiros-menu ul li').removeClass('active');
            $(this).parents('li').addClass('active');

            if ($(this).parent().hasClass('todos')) {
                $('.parceiro').removeClass('out');
            } else {
                $('.parceiro').removeClass('out');
            	$('.parceiro').not('.' + tipo).addClass('out');
            }
    	}
    });
});

/* Funções Responsivas */

$(document).ready(function() {

    /* DIV DE LOADING */
    $('#loadingDiv')
            .hide()  // Hide it initially
            .ajaxStart(function() {
                $(this).show();
            })
            .ajaxStop(function() {
                $(this).hide();
            });


	$('table').footable();

	$('.list-check').click(function(){
    		if (this.checked) {
        		$('.fixed-mobile').addClass('active');
		}
		else {
			if ($('.list-check:checked').length == 0) {
		$('.fixed-mobile').removeClass('active');
		}
	}
    });

    $( ".image-widget" ).sortable({
  	start: function( event, ui ) {

		$('<div class="inner"></div>').appendTo('.ui-sortable-placeholder');
		$('.image-widget .image .inner').tooltip('destroy');

		}

	});

    /*$(function() {

    var visita = new Date();
    var tempo = visita.getTime();
    tempo += 3600 * 1000;
    visita.setTime(tempo);

    if( document.cookie.indexOf( "runOnce" ) < 0 ) {

	if ($('body').hasClass('loja-gratuita')) {

	    if (screen.width < 768) {

	        var confirmpro = confirm("Você está acessando a versão web. Para utilizar a versão mobile da sua loja, mude para o plano PRO. Deseja mudar agora?");
		    if (confirmpro == true) {
			window.location.href = "https://app.lojaintegrada.com.br/painel/faturamento/meu_plano";
		    } else {
	        }
	     document.cookie = "runOnce=true; expires=" + visita.toGMTString() + "; path=/";
	    }
	}

	}
    });*/

    $('.toggle-filtro').click(function() {
  	$('#filtroProduto').slideToggle();
    });

	var old = $(window).width();
    $(window).resize(function(){

    if ($(window).width() < 768) {
	if(old != $(window).width()) {
		$('#filtroProduto').appendTo('.produto-listar .box-header');
	}
    } else {
	$('#filtroProduto').appendTo('.filtrar-produtos .box-content');
  	$('#PageLoader').hide();
    }
	old = $(window).width();
    }).resize();
    if ($(window).width() < 768) {
      $('#filtroProduto').appendTo('.produto-listar .box-header');
    }
});

$(window).load(function(){
  $('#PageLoader').fadeOut(1400);
});

function offlineZopim() {
  $.fancybox({
    type: 'inline',
    content: '<div class="text-justify" style="font-weight: 600;">O chat foi um importante aliado no pronto atendimento! Contudo, a maioria dos atendimentos técnicos precisam de uma verificação do time de desenvolvedores, o que leva um pouco mais de tempo na análise, comprometendo a velocidade e experiência no atendimento via chat online.<br /><br />Portanto, a partir de agora, concentraremos nossos atendimentos via Chamado.<br /><br /><div class="text-center"><a href="https://suporte.lojaintegrada.com.br/hc/pt-br/requests/new" target="_blank" class="btn btn-success">Abrir chamado</a></div></div>',
    autoHeight: true,
    minHeight: 10,
    maxWidth: 300,
    minWidth: 280
  });
}

// Transforma  o menu Ajuda em um Modal
function modalAtendimento() {
  var itens = '<div />';
  itens = $(itens).append('<span class="tit">Central de Atendimento:</span>');
  itens = $(itens).append($('.menu-main-ul .sub-menu .menu-container .ajuda-itens').first().clone());
  $.fancybox({
    type: 'inline',
    href: itens,
    wrapCSS: 'modal-ajuda'
  });
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
