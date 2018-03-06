module.exports = function (app, sequelize) {
    app.get("/criagatilhos/:banco", function (req, res) {
        var banco = req.params.banco;

        sequelize.authenticate()
            .then(function (err) {
                console.log('Connection sequelize successfully.');
            })
            .catch(function (err) {
                console.log('Unable to connect to the database');
            });

        sequelize.query(
            ' CREATE TRIGGER `' + banco + '`.`BeforeUpdatePedido` ' +
            ' BEFORE UPDATE ON `' + banco + '`.`pedido` ' +
            ' FOR EACH ROW ' +
            ' BEGIN ' +
            ' IF COALESCE(OLD.etapa, \'\') <> COALESCE(NEW.etapa,\'\') ' +
            ' AND COALESCE(NEW.etapa, \'\') <> \'finalizado\' THEN ' +

            ' INSERT IGNORE INTO node.robo(banco, pedido, etapa) ' +
            " VALUES ('" + banco + "',NEW.id,NEW.etapa); " +
            ' END IF; ' +
            ' END;');
    });
}