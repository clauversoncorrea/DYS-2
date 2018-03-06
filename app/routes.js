module.exports = function (app, passport) {

	// Ao clicar no botao facebook, faz autenticacao
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

	// Retorno
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			failureRedirect: '/'
		}),
		function (req, res) {
			res.redirect("http://localhost:8080/inicial.html?auth=FACE&nome=" + req.user.nome + "&banco=" + req.user.banco + "&foto=" + req.user.photo + "&email=" + req.user.email);
		});
};