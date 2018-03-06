app.controller("comboDYS", function ($scope, $http, $rootScope) {

    _initCombo = function (id, json, titulo, coluna, value, comboTela) {
        $scope.id = id;
        $scope.comboTitulo = titulo;
        $scope.idCombo = "";
        $scope.coluna = coluna;
        $scope.value = value;
        $scope.linhas = json;
        $scope.comboTela = comboTela;
        $scope.showSearch = (json.length <= 6);
        // Abrir o modal so depois que atualizou as linhas
        // $http.get("/").success(function () {
        g$.openModalCust('modal-comboDYS');
        g$.arrayTelas.push("ModalCombo");
        $("#modal-comboDYS")[0].classList.add("play-block");
        // cordova.plugins.Keyboard.close();
        $("#search-combo")[0].focus();
        // });
    }

    g$.selecionarLinhaCombo = function (limpaCombo) {
        var linha;
        if (limpaCombo) linha = { dataset: { value: "", inner: "" } };
        else {
            if (event.target.tagName == "LABEL") linha = event.target;
            else linha = event.target.querySelector("label");
        }

        linha = { value: linha.dataset.value, inner: linha.dataset.inner };

        if ($scope.comboTela) g$.selecionarComboTela(linha, $scope.id);
        else g$.selecionarComboTabela(linha, $scope.id);
        g$.closeModalCust('modal-comboDYS');
        $("#modal-comboDYS")[0].classList.remove("play-block");
    }

    g$.limparCombo = function () {
        g$.selecionarComboTela(true)
        g$.closeModalCust('modal-comboDYS');
        $("#modal-comboDYS")[0].classList.remove("play-block");
    }

});