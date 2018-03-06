'use strict';

$.fn.importHistory = function(options){
    if(options === undefined){
        options = {};
    }

    // Get history id
    var historyId = options.historyId;

    // Default settings
    var defaultEvent = function(){};

    var dafaults = {
        'class': 'import_history',
        'message_class': 'progress-message',
        'wrapper_class': 'progress',
        'success_class': 'progress-bar progress-bar-success progress-bar-striped',
        'info_class': 'well progress-information',
        'error_class': 'progress-bar progress-bar-danger progress-bar-striped',
        'total_class': 'total',
        'endpoint': '/painel/api/v1/importacao/{historyId}/',
        'interval': 5000,
        'onReceived': defaultEvent,
        'onProcessing': defaultEvent,
        'onFail': defaultEvent,
        'onPartial': defaultEvent,
        'onSuccess': defaultEvent,
        'messages': {
            'received': 'Iniciando. Aguarde',
            'processing': 'Executando',
            'partial': 'Alguns problemas foram encontrados',
            'fail': 'Ocorreu um erro durante a importação',
            'success': 'Finalizado com sucesso!',
            'error_list': 'Erros encontrados:',
            'situation': 'Situação: ',
            'total_quantity': 'Total de registros: ',
            'info_title': 'Informações sobre a importação.',
        }
    };

    // apply defaults on options
    options = this.options = $.extend(dafaults, options);

    // Information about integration
    this.data = {
        total_quantity: 0,
        success_quantity: 0
    };
    this.running = true;

    // Return an progress bar element
    var getProgressBar = function(){
        var $successbar = $('<div></div>')
            .addClass(options.success_class);

        var $errorbar = $('<div></div>')
            .addClass(options.error_class);

        var $wrapper = $('<div></div>')
            .addClass(options.wrapper_class)
            .append($successbar)
            .append($errorbar);

        $wrapper.success = $successbar;
        $wrapper.error = $errorbar;

        return $wrapper;
    };

    // get html of message
    var getMessage = function(){
        var $wrapper = $('<div></div>')
            .addClass(options.message_class)

        return $wrapper;
    };

    // get html of message
    var getTotal = function(){
        var $wrapper = $('<div></div>')
            .addClass(options.total_class)

        return $wrapper;
    };

    // Receive success and return this.options['onSuccess']
    var getEvent = function(status){
        var event = status.charAt(0).toUpperCase() + status.slice(1);
        event = 'on' + event;

        return options[event];
    };

    // get html of info
    var getInfo = function(){
        var $wrapper = $('<div></div>')
            .addClass(options.info_class);

        return $wrapper;
    };

    // Change the message
    this.changeMessage = function(){
        this.message.html(
            '<strong>' + this.options.messages.situation +
            '</strong>' + this.options.messages[this.data.status]
        );
    };

    // Show total entries
    this.changeTotal = function(){
        if(this.data.total_quantity) {
            this.total.html(
                this.options.messages.total_quantity +
                '<strong>' + this.countProcessed() + '</strong>' +
                ' de <strong>' + this.data.total_quantity + '</strong>'
            );
            this.total.slideDown();
        } else {
            this.total.hide();
        }
    };

    // Call event based on the status
    this.callEvent = function(){
        var event = getEvent(this.data.status);
        if(event === undefined){
            event = defaultEvent;
        }
        event.apply(this);
    };

    // Show log
    this.showLog = function(){
        this.info.title = $('<h5></h5>');
        this.info.title.html(options.messages.info_title);

        // Clean information
        this.info.html('');
        if(options.messages.info_title){
            this.info.append(this.info.title);
        }
        this.info.list = $('<ul></ul>');
        this.info.append(this.info.list);

        if(this.data.log){
            this.info.show();
            var lines = this.data.log.split('\n');

            for(var i=0; i < lines.length; i++){
                if(lines[i]){
                    this.info.list.append('<li>' + lines[i] + '</li>');
                }
            }
        }else{
            this.info.hide();
        }
    };

    // Execute user tiggers
    this.trigger = function(data){
        this.data = data;
        this.changeMessage();
        this.changeTotal();
        this.updateProgress();
        this.callEvent();
        this.showLog();

        var status = this.data.status;
        if(status !== 'processing' && status !== 'received'){
            this.done();
        }
    };

    // Get endpoint url
    this.getUrl = function(){
        return this.options.endpoint.replace('{historyId}', historyId);
    };

    // Check status
    this.checkStatus = function(){
        var trigger = this.trigger;
        var _this = this;
        $.get(this.getUrl(), function(data){
            trigger.apply(_this, [data]);
        });
    };

    // Count processed
    this.countProcessed = function(){
        return this.data.success_quantity +
               this.data.error_quantity;
    };

    // Update progress bar
    this.updateOneProgress = function(progress, qtd){
        var processed = 0;

        if(qtd){
            processed = qtd / this.data.total_quantity;
            processed = processed * 100;
        }
        if(this.data.status == 'processing') {
            progress.addClass('active');
        } else {
            progress.removeClass('active');
        }

        progress.width(processed += '%');
        progress.html('<span>' + qtd + '</span>');

        if(!qtd || qtd == 0) {
            progress.hide();
        } else {
            progress.css('display', 'inline-block');
        }
    };

    // Update all progress bar
    this.updateProgress = function(){
        this.updateOneProgress(
            this.progressBar.success,
            this.data.success_quantity
        );
        this.updateOneProgress(
            this.progressBar.error,
            this.data.error_quantity
        );
    };

    // Runing on done
    this.done = function(){
        this.running = false;
    };

    this.start = function(){
        this.checkStatus();
        var _this = this;

        if(this.running){
            setTimeout(function(){ _this.start(); }, this.options.interval);
        }
    };

    // Add HTML nas pá
    this.progressBar = getProgressBar();
    this.message = getMessage();
    this.total = getTotal();
    this.info = getInfo();
    this.info.hide();

    $(this).append(this.message);
    $(this).append(this.progressBar);
    $(this).append(this.total);
    $(this).append(this.info);

    $(this).addClass(options.class);

    this.start();
};
