(function (n) {
	function t(o) {
		if (e[o]) return e[o].exports;
		var r = e[o] = {
			exports: {},
			id: o,
			loaded: !1
		};
		return n[o].call(r.exports, r, r.exports, t), r.loaded = !0, r.exports
	}
	var e = {};
	return t.m = n, t.c = e, t.p = "https://s3.amazonaws.com/calamar-chat/libs/app/1.0.11/", t(0)
}({
	0: function (n, t, e) {
		n.exports = e(373)
	},
	373: function (n, t, e) {
		var o = e(489),
			y = e(786),
			c = "CalamarChat",
			d = "q",
			a = /bot|googlebot|crawler|spider|robot|crawling/i,
			u = function () {
				return window[c] && window[c].booted
			},
			s = function () {
				return window[c].booted = !0
			},
			f = function () {
				return "attachEvent" in window && !window.addEventListener
			},
			l = function () {
				return navigator && navigator.userAgent && a.test(navigator.userAgent)
			},
			p = function () {
				return !f() && !l()
			},
			w = function () {
				var n = document.createElement("script");
				return n.type = "text/javascript", n.charset = "utf-8", n.src = o, n
			},
			k = function () {
				var n = document.createElement("link");
				n.type = "text/css", n.id="calamar-stylesheet", n.rel = "stylesheet", n.href = y;
				return document.head.appendChild(n), n
			},
			m = function () {
				var n = document.createElement("iframe");
				n.id = "calamar-frame", document.body.appendChild(n), n.contentWindow.document.open("text/html", "replace"), n.contentWindow.document.write("\n<!doctype html>\n<head></head>\n<body>\n</body>\n</html>"), n.contentWindow.document.close();	
				if( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ){n.style.position = 'absolute'; n.style.height = 0,  n.style.width = 0, n.style.bottom = 0,n.style.right = 0} else {n.style.display = 'none'; n.offsetHeight;}
				var t = w();
				return n.contentWindow.document.head.appendChild(t), n
			},
			n = function () {
				var n = document.createElement("div");
				n.id = "calamar-widget", document.body.appendChild(n);
				return n
			},
			v = function () {
				if (!window[c]) {
					var n = function n() {
						for (var t = arguments.length, e = Array(t), o = 0; o < t; o++) e[o] = arguments[o];
						n[d].push(e)
					};
					n[d] = [],
					window[c] = n
				}
			},
			z = function () {
				if(window.calamarSettings) {
					localStorage.setItem('app_id', window.calamarSettings.app_id);
					if(window.calamarSettings.type) localStorage.setItem('type', window.calamarSettings.type);
					window[c].calamarSettings = window.calamarSettings;
				}
			},
			i = function () {
				if(window.calamarSettings && window.calamarSettings.integration && window.calamarSettings.integration === 'jivo') {
					var jivoContainer = window.document.getElementById('jivo-iframe-container');
					var jdivElement = document.getElementsByTagName("jdiv")[0];
					if (jivoContainer && jdivElement) {
							jivoContainer.style.setProperty ("display", "none", "important");
							jdivElement.style.setProperty ("display", "none", "important");
					} else {
						setTimeout(i, 100);
					}
				}
			},
			h = function () {
				delete window[c]
			},
			b = function () {
				i(), v(), m(), n(), k(), s(), z()
			},
			g = function () {
				window[c]("shutdown", !1), h(), v()
			};
		p() && !u() && (b())
	},
	489: function (n, t, e) {
		n.exports = e.p + "js/main.85cfbd70.js.gz"
	},
	786: function (n, t, e) {
		n.exports = e.p + "css/main.436d370e.css"
	}
}));
