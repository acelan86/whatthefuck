/*! Copyright 2013 Baidu Inc. All Rights Reserved. */
var ___shortName = "ShortNamespace"; (function() {
	var p = ___shortName;
	var k = window,
	j = 0,
	l = false,
	i = false;
	while ((k != window.top || k != k.parent) && j < 10) {
		l = true;
		try {
			k.parent.location.toString()
		} catch(m) {
			i = true;
			break
		}
		j++;
		k = k.parent
	}
	if (j >= 10) {
		i = true
	}
	if (!i) {
		var o = "";
		try {
			o = top.location.href
		} catch(m) {
			o = ""
		}
		if (o) {
			if (o.indexOf("union.baidu.com") > 0 || o.indexOf("unionqa.baidu.com") > 0 || o.indexOf("musicmini.baidu.com") > 0 || o.indexOf("qianqianmini.baidu.com") > 0) {
				i = true
			}
		}
	}
	var n = function(c, a, b) {
		c.baseName = p;
		c.isInIframe = a;
		c.isCrossDomain = b;
		c.needInitTop = a && !b;
		c.buildInObject = {
			"[object Function]": 1,
			"[object RegExp]": 1,
			"[object Date]": 1,
			"[object Error]": 1,
			"[object Window]": 1
		};
		c.clone = function(f) {
			var d = f,
			h, e;
			if (!f || f instanceof Number || f instanceof String || f instanceof Boolean) {
				return d
			} else {
				if (f instanceof Array) {
					d = [];
					var g = 0;
					for (h = 0, e = f.length; h < e; h++) {
						d[g++] = this.clone(f[h])
					}
				} else {
					if ("object" === typeof f) {
						if (this.buildInObject[Object.prototype.toString.call(f)]) {
							return d
						}
						d = {};
						for (h in f) {
							if (f.hasOwnProperty(h)) {
								d[h] = this.clone(f[h])
							}
						}
					}
				}
			}
			return d
		};
		c.create = function(r, f) {
			var d = Array.prototype.slice.call(arguments, 0);
			d.shift();
			var h = function(q) {
				this.initialize = this.initialize ||
				function() {};
				this.initializeDOM = this.initializeDOM ||
				function() {};
				this.initializeEvent = this.initializeEvent ||
				function() {};
				this.initialize.apply(this, q);
				this.initializeDOM.apply(this, q);
				this.initializeEvent.apply(this, q)
			};
			h.prototype = r;
			var e = new h(d);
			for (var g in r) {
				if (e[g] && typeof e[g] === "object" && e[g].modifier && e[g].modifier.indexOf("dynamic") > -1) {
					e[g] = this.clone(e[g])
				}
			}
			e.instances = null;
			r.instances = r.instances || [];
			r.instances.push(e);
			return e
		};
		c.registerMethod = function(f, v) {
			var e = {};
			var u = {};
			var w, d, x;
			for (d in v) {
				w = v[d];
				if (!d || !w) {
					continue
				}
				if (typeof w === "object" && w.modifier && w.modifier === "dynamic") {
					f[d] = f[d] || {};
					this.registerMethod(f[d], w)
				} else {
					if (typeof w === "function") {
						e[d] = w
					} else {
						u[d] = w
					}
				}
			}
			for (d in e) {
				w = e[d];
				if (d && w) {
					f[d] = w
				}
			}
			if (f && f.instances && f.instances.length && f.instances.length > 0) {
				for (var h = 0,
				g = f.instances.length; h < g; h++) {
					x = f.instances[h];
					this.registerMethod(x, v)
				}
			}
		};
		c.registerObj = function(h, f) {
			var d = Array.prototype.slice.call(arguments, 0);
			d.shift();
			var g = function(r) {
				this.register = this.register ||
				function() {};
				this.register.apply(this, r)
			};
			g.prototype = h;
			g.prototype.instances = null;
			var e = new g(d);
			return e
		};
		c.registerNamespaceByWin = function(h, f) {
			var f = h.win = f || window;
			var v = h.fullName.replace("$baseName", this.baseName);
			var y = v.split(".");
			var e = y.length;
			var x = f;
			var z;
			for (var g = 0; g < e - 1; g++) {
				var w = y[g];
				if (x == f) {
					x[w] = f[w] = f[w] || {};
					z = w;
					h.baseName = z
				} else {
					x[w] = x[w] || {}
				}
				x = x[w]
			}
			var d = x[y[e - 1]] || {};
			if (d.fullName && d.version) {
				this.registerMethod(d, h)
			} else {
				d = this.registerObj(h);
				d.instances = null;
				x[y[e - 1]] = d
			}
		};
		c.registerNamespace = function(d) {
			if (!d || !d.fullName || !d.version) {
				return
			}
			this.registerNamespaceByWin(d, window);
			if (this.needInitTop) {
				this.registerNamespaceByWin(d, window.top)
			}
		};
		c.registerClass = c.registerNamespace;
		c.using = function(r, f) {
			var e;
			if (!f && this.isInIframe && !this.isCrossDomain && top && typeof top === "object" && top.document && "setInterval" in top) {
				f = top
			} else {
				f = f || window
			}
			r = r.replace("$baseName", this.baseName);
			var d = r.split(".");
			e = f[d[0]];
			for (var h = 1,
			g = d.length; h < g; h++) {
				if (e && e[d[h]]) {
					e = e[d[h]]
				} else {
					e = null
				}
			}
			return e
		}
	};
	window[p] = window[p] || {};
	n(window[p], l, i);
	if (l && !i) {
		window.top[p] = window.top[p] || {};
		n(window.top[p], l, i)
	}
})(); (function(c) {
	var d = {
		fullName: "$baseName.Utility",
		version: "1.0.0",
		register: function() {
			this.browser = this.browser || {};
			if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
				this.browser.ie = document.documentMode || +RegExp["\x241"]
			}
			if (/opera\/(\d+\.\d)/i.test(navigator.userAgent)) {
				this.browser.opera = +RegExp["\x241"]
			}
			if (/firefox\/(\d+\.\d)/i.test(navigator.userAgent)) {
				this.browser.firefox = +RegExp["\x241"]
			}
			if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)) {
				this.browser.safari = +(RegExp["\x241"] || RegExp["\x242"])
			}
			if (/chrome\/(\d+\.\d)/i.test(navigator.userAgent)) {
				this.browser.chrome = +RegExp["\x241"]
			}
			try {
				if (/(\d+\.\d)/.test(window.external.max_version)) {
					this.browser.maxthon = +RegExp["\x241"]
				}
			} catch(a) {}
			this.browser.isWebkit = /webkit/i.test(navigator.userAgent);
			this.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);
			this.browser.isStrict = document.compatMode == "CSS1Compat"
		},
		browser: {},
		isWindow: function(a) {
			var f = false;
			try {
				if (a && typeof a === "object" && a.document && "setInterval" in a) {
					f = true
				}
			} catch(b) {
				f = false
			}
			return f
		},
		isInIframe: function(a) {
			a = a || window;
			return a != window.top && a != a.parent
		},
		isInCrossDomainIframe: function(a, i) {
			var j = false;
			a = a || window;
			i = i || window.top;
			var b = 0;
			if (!this.isWindow(i) || !this.isWindow(i.parent)) {
				j = true
			} else {
				while ((a != i) && b < 10) {
					b++;
					if (this.isWindow(a) && this.isWindow(a.parent)) {
						try {
							a.parent.location.toString()
						} catch(h) {
							j = true;
							break
						}
					} else {
						j = true;
						break
					}
					a = a.parent
				}
			}
			if (b >= 10) {
				j = true
			}
			return j
		},
		g: function(a, b) {
			b = b || window;
			if ("string" === typeof a || a instanceof String) {
				return b.document.getElementById(a)
			} else {
				if (a && a.nodeName && (a.nodeType == 1 || a.nodeType == 9)) {
					return a
				}
			}
			return a
		},
		sendRequestViaImage: function(g, a) {
			var h = new Image();
			var b = "cpro_log_" + Math.floor(Math.random() * 2147483648).toString(36);
			a = a || window;
			a[b] = h;
			h.onload = h.onerror = h.onabort = function() {
				h.onload = h.onerror = h.onabort = null;
				a[b] = null;
				h = null
			};
			h.src = g
		},
		proxy: function(h, i, j) {
			var a = h;
			var b = i;
			return function() {
				if (j && j.length) {
					return a.apply(b || {},
					j)
				} else {
					return a.apply(b || {},
					arguments)
				}
			}
		},
		getClientWidth: function(a) {
			try {
				a = a || window;
				if (a.document.compatMode === "BackCompat") {
					return a.document.body.clientWidth
				} else {
					return a.document.documentElement.clientWidth
				}
			} catch(b) {
				return 0
			}
		},
		getClientHeight: function(a) {
			try {
				a = a || window;
				if (a.document.compatMode === "BackCompat") {
					return a.document.body.clientHeight
				} else {
					return a.document.documentElement.clientHeight
				}
			} catch(b) {
				return 0
			}
		},
		escapeToEncode: function(a) {
			var b = a || "";
			if (b) {
				b = b.replace(/%u[\d|\w]{4}/g,
				function(f) {
					return encodeURIComponent(unescape(f))
				})
			}
			return b
		},
		noop: function() {}
	};
	c.registerNamespace(d)
})(window[___shortName]); (function(d) {
	var c = {
		fullName: "$baseName.BusinessLogic",
		version: "1.0.0",
		register: function() {
			this.G = d.using("$baseName", this.win);
			this.U = d.using("$baseName.Utility", this.win)
		},
		randomArray: [],
		clientTree: {},
		displayCounter: 1,
		displayTypeCounter: {},
		adsArray: [],
		adsWrapStore: {},
		winFocused: true,
		cproServiceUrl: "http://cpro.baidu.com/cpro/ui/uijs.php",
		iframeIdPrefix: "cproIframe",
		isAsyn: false,
		currentWindowOnUnloadHandler: null,
		noop: function() {}
	};
	d.registerNamespace(c)
})(window[___shortName]); (function(c) {
	var d = {
		fullName: "$baseName.BusinessLogic.Distribute",
		version: "1.0.0",
		register: function() {
			this.G = c.using("$baseName", this.win);
			this.U = c.using("$baseName.Utility", this.win)
		},
		status: {},
		viewtime: 100,
		viewtimeIE: 100,
		floatLu: {
			percent: 100,
			displayType: "float",
			displayWidth: "120",
			displayHeight: "270"
		},
		floatLuShow: {
			percent: 100,
			displayType: "float",
			displayWidth: "120",
			displayHeight: "270"
		},
		dispatch: function(a, m) {
			if (this.U.isInCrossDomainIframe()) {
				return false
			}
			var n = a;
			if (m) {
				for (var l in m) {
					if (l && m[l]) {
						n += "_" + m[l].toString()
					}
				}
			}
			if (this.status[n + "Dispatched"]) {
				return this.status[n]
			}
			this.status[n] = false;
			this.status[n + "Dispatched"] = true;
			var j = 0;
			if ((typeof this[a]).toLowerCase() === "object") {
				var k = this[a];
				j = k.percent;
				if (k.displayType) {
					if (!m.displayType || k.displayType !== m.displayType) {
						return false
					}
				}
				if (k.displayWidth) {
					if (!m.displayWidth || k.displayWidth !== m.displayWidth) {
						return false
					}
				}
				if (k.displayHeight) {
					if (!m.displayHeight || k.displayHeight !== m.displayHeight) {
						return false
					}
				}
			} else {
				if ((typeof this[a]).toLowerCase() === "number") {
					j = this[a]
				}
			}
			var b = parseInt(Math.random() * 100);
			if (j && b < j) {
				this.status[n] = true
			}
			return this.status[n]
		}
	};
	c.registerClass(d)
})(window[___shortName]); (function(c) {
	var d = {
		fullName: "$baseName.BusinessLogic.Param",
		version: "1.0.0",
		register: function() {
			this.G = c.using("$baseName", this.win);
			this.U = c.using("$baseName.Utility", this.win);
			this.BL = c.using("$baseName.BusinessLogic", this.win)
		},
		initialize: function(a) {
			this.currentWindow = a.currentWindow;
			this.doc = this.win.document;
			this.nav = this.win.navigator;
			this.scr = this.win.screen;
			this.displayType = a.displayType || "inlay";
			this.startTime = (new Date());
			this.BL.pnTypeArray = this.BL.pnTypeArray || [];
			this.BL.pnTypeArray[this.displayType] = this.BL.pnTypeArray[this.displayType] || [];
			this.timeStamp = a.timeStamp || (new Date()).getTime()
		},
		getSlot2UIMapping: function(a) {
			var b = {};
			var f;
			for (f in a) {
				if (f && a[f] && a[f].slotParamName) {
					b[a[f].slotParamName] = f
				}
			}
			return b
		},
		getCust2UIMapping: function(a) {
			var b = {};
			var f;
			for (f in a) {
				if (f && a[f] && a[f].custParamName) {
					b[a[f].custParamName] = f
				}
			}
			return b
		},
		mergeSlot2UI: function(b, h, i) {
			if (!b || !h || !i) {
				return null
			}
			var j, a;
			for (a in h) {
				if (a && h[a] && h.hasOwnProperty(a)) {
					j = i[a];
					if (j) {
						b.set(j, h[a])
					}
				}
			}
			return b
		},
		serialize: function(a) {
			var b = [];
			var g, h;
			for (g in a) {
				if (g && a[g] && (typeof a[g] === "object") && a[g].isUIParam && a[g].isUIParam[a.displayType]) {
					if (g === "pn" && !a.get(g)) {
						continue
					}
					h = a.get(g);
					if (h == null) {
						continue
					}
					if (a.displayType == "ui" && h == "baiduCADS") {
						continue
					}
					if (a[g].encode || a.displayType == "ui") {
						h = encodeURIComponent(h)
					}
					if (a[g].limit) {
						h = h.substr(0, a[g].limit)
					}
					b.push(g + "=" + h)
				}
			}
			return b.join("&")
		},
		snap: function(a) {
			var b = {};
			var g, h;
			for (g in a) {
				if (g && a[g] && (typeof a[g] === "object") && a[g].defaultValue) {
					h = a.get(g);
					if (h == null) {
						continue
					}
					if (a[g].encode || a.displayType == "ui") {
						h = encodeURIComponent(h)
					}
					b[g] = h
				}
			}
			return b
		},
		get: function(a) {
			var f;
			if (!this[a]) {
				return f
			}
			if (this[a].get && this[a].get !== "default") {
				var b = Array.prototype.slice.call(arguments, 0);
				b.shift();
				if (!this[a]._init) {
					this[a]._value = this[a].defaultValue[this.displayType]
				}
				f = this.U.proxy(this[a].get, this, b)()
			} else {
				if (!this[a]._init) {
					f = this[a].defaultValue[this.displayType]
				} else {
					f = this[a]._value
				}
			}
			return f
		},
		set: function(b, a) {
			var h = false;
			if (this[b].set && this[b].set !== "default") {
				var g = Array.prototype.slice.call(arguments, 0);
				g.shift();
				h = this.U.proxy(this[b].set, this, g)()
			} else {
				this[b]._value = a;
				this[b]._init = true;
				h = true
			}
			return h
		},
		k: {
			slotParamName: "k",
			custParamName: "k",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				custInlay: ""
			},
			encode: false,
			isUIParam: {
				inlay: false,
				"float": false,
				ui: true,
				post: false,
				custInlay: false,
				captcha: false
			},
			get: "default",
			set: "default"
		},
		cf: {
			slotParamName: "cf",
			custParamName: "cf",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				custInlay: ""
			},
			encode: false,
			isUIParam: {
				inlay: false,
				"float": false,
				ui: true,
				post: false,
				custInlay: false,
				captcha: false
			},
			get: "default",
			set: "default"
		},
		tp2jk: {
			slotParamName: "tp2jk",
			custParamName: "tp2jk",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				custInlay: ""
			},
			encode: false,
			isUIParam: {
				inlay: false,
				"float": false,
				ui: true,
				post: false,
				custInlay: false,
				captcha: false
			},
			get: "default",
			set: "default"
		},
		rs: {
			slotParamName: "cpro_rs",
			custParamName: "rs",
			modifier: "dynamic",
			defaultValue: {
				inlay: 0,
				"float": 0,
				ui: 0,
				post: 0,
				custInlay: 0,
				captcha: 0
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: false,
				custInlay: false,
				captcha: false
			},
			get: "default",
			set: "default"
		},
		fv: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "0",
				"float": "0",
				ui: "",
				post: "",
				custInlay: "0",
				captcha: "0",
				pad: "0"
			},
			encode: true,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				var j = "ShockwaveFlash.ShockwaveFlash",
				b = this.nav,
				i, a;
				if (this.nav.plugins && b.mimeTypes.length) {
					i = b.plugins["Shockwave Flash"];
					if (i && i.description) {
						return i.description.replace(/[^\d\.]/g, "").split(".")[0]
					}
				} else {
					if (this.U.browser.ie) {
						a = ActiveXObject;
						try {
							i = new a(j + ".7")
						} catch(e) {
							try {
								i = new a(j + ".6");
								i.AllowScriptAccess = "always";
								return 6
							} catch(e) {}
							try {
								i = new a(j)
							} catch(e) {}
						}
						if (i != null) {
							try {
								return i.GetVariable("$version").split(" ")[1].split(",")[0]
							} catch(e) {}
						}
					}
				}
				return 0
			},
			set: "default"
		},
		cn: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				if (!this["n"] || !this["n"].get) {
					return 1
				}
				var f = 0;
				var b = this.get("n");
				var a = this.get("ch") || "0";
				if (b) {
					this.BL.clientTree = this.BL.clientTree || {};
					if (!this.BL.clientTree[b]) {
						f += 1;
						if (a && a !== "0") {
							f += 2
						}
						return f
					}
					if (a && a !== "0" && this.BL.clientTree[b] && (!this.BL.clientTree[b][a])) {
						f += 2
					}
				}
				return f
			},
			set: function() {
				var b = this.get("n");
				var a = this.get("ch") || "0";
				if (b) {
					this.BL.clientTree = this.BL.clientTree || {};
					if (!this.BL.clientTree[b]) {
						this.BL.clientTree[b] = {}
					}
					if (a && a !== "0" && (!this.BL.clientTree[b][a])) {
						this.BL.clientTree[b][a] = true
					}
				}
				return true
			}
		},
		"if": {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "0",
				"float": "0",
				ui: "0",
				post: "0",
				custInlay: "0",
				captcha: "0",
				pad: "0"
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				var k = 0;
				var b = this.currentWindow;
				if (this.U.isInIframe(b)) {
					k += 1
				}
				if (this.U.isInCrossDomainIframe(b, b.top)) {
					k += 2
				}
				if (!this["rsi0"] || !this["rsi0"].get || !this["rsi1"] || !this["rsi1"].get) {
					return k
				}
				var l = this.get("rsi0");
				var i = this.get("rsi1");
				var j = this.U.getClientWidth(this.currentWindow);
				var a = this.U.getClientHeight(this.currentWindow);
				if (j < 40 || a < 10) {
					k += 4
				} else {
					if (j < l || a < i) {
						k += 8
					}
				}
				if ((j >= 2 * l) || (a >= 2 * i)) {
					k += 16
				}
				return k
			},
			set: "default"
		},
		word: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			limit: 700,
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: true,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				var t = this.currentWindow;
				var a, r = 10,
				z = 0;
				var v, q;
				if (window.dpClient && window.dpClientDomain) {
					return "http://" + window.dpClientDomain + "/domain_parking.htm?site=" + encodeURIComponent(window.location.href).substring(0, 700)
				}
				try {
					v = this.get("rsi0") || 0;
					q = this.get("rsi1") || 0
				} catch(s) {
					v = 200,
					q = 60
				}
				a = t.document.location.href;
				if (this.U.isInIframe(t)) {
					var y, w, x;
					for (z = 0; z < r; z++) {
						if (!this.U.isInCrossDomainIframe(t, t.parent)) {
							y = this.U.getClientWidth(t);
							w = this.U.getClientHeight(t);
							x = t.document.location.href;
							t = t.parent;
							if (v > 0 && q > 0 && y > 2 * v && w > 2 * q) {
								a = x;
								break
							}
							if (!this.U.isInIframe(t, t.parent)) {
								a = t.location.href;
								break
							}
						} else {
							a = t.document.referrer || t.document.location.href;
							break
						}
					}
					if (z >= 10) {
						a = t.document.referrer || t.document.location.href
					}
				}
				if (((a.search(/cpro.baidu.com/i) != -1) || (a.search(/\?hide=1/i) != -1)) && a.search(/t=tpclicked/i) != -1) {
					var b = a.indexOf("?");
					var a = a.substring(b + 1);
					var i = a.split("&");
					for (var u = 0; u < i.length; u++) {
						if (i[u].search(/^u=/i) != -1) {
							a = i[u].replace(/^u=/i, "");
							break
						}
					}
				}
				return a
			},
			set: "default"
		},
		refer: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			limit: 700,
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: true,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				var b;
				try {
					b = this.win.opener ? this.win.opener.document.location.href: this.doc.referrer
				} catch(a) {
					b = this.doc.referrer
				}
				return this.U.escapeToEncode(b)
			},
			set: "default"
		},
		ready: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: ""
			},
			encode: true,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true
			},
			get: function() {
				var a = {
					uninitialized: 0,
					loading: 1,
					loaded: 2,
					interactive: 3,
					complete: 4
				};
				try {
					return a[this.doc.readyState]
				} catch(b) {
					return 5
				}
			},
			set: "default"
		},
		jn: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "3",
				"float": "3",
				ui: "3",
				post: "3",
				custInlay: "3",
				captcha: "3",
				pad: "3"
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return 3
			},
			set: "default"
		},
		js: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "c",
				"float": "f",
				ui: "ui",
				post: "post",
				custInlay: "custInlay",
				captcha: "y"
			},
			encode: false,
			isUIParam: {
				inlay: false,
				"float": false,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true
			},
			get: "default",
			set: "default"
		},
		lmt: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return Date.parse(this.doc.lastModified) / 1000
			},
			set: "default"
		},
		csp: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return this.scr.width + "," + this.scr.height
			},
			set: "default"
		},
		csn: {
			slotParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				custInlay: "",
				captcha: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				custInlay: true,
				captcha: true
			},
			get: function() {
				return this.scr.availWidth + "," + this.scr.availHeight
			},
			set: "default"
		},
		ccd: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return this.scr.colorDepth || 0
			},
			set: "default"
		},
		chi: {
			slotParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return this.win.history.length || 0
			},
			set: "default"
		},
		cja: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return this.nav.javaEnabled().toString()
			},
			set: "default"
		},
		cpl: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return this.nav.plugins.length || 0
			},
			set: "default"
		},
		cmi: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return this.nav.mimeTypes.length || 0
			},
			set: "default"
		},
		cce: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return this.nav.cookieEnabled || 0
			},
			set: "default"
		},
		csl: {
			uuserApiName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return encodeURIComponent(this.nav.language || this.nav.browserLanguage || this.nav.systemLanguage).replace(/[^a-zA-Z0-9\-]/g, "")
			},
			set: "default"
		},
		did: {
			uuserApiName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "1",
				"float": "1",
				ui: "1",
				post: "1",
				custInlay: "1",
				captcha: "1",
				pad: "1"
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				this.win.__bdcpro__displayTypeCounter = this.win.__bdcpro__displayTypeCounter || {};
				if (this.get("tn") && this.get("tn").toLowerCase().indexOf("tlink") > -1) {
					return this.win.__bdcpro__displayTypeCounter.lu_total || 1
				} else {
					return this.win.__bdcpro__displayTypeCounter.total || 1
				}
			},
			set: function() {
				if (this.get("tn") && this.get("tn").toLowerCase().indexOf("tlink") > -1) {
					this.win.__bdcpro__displayTypeCounter.lu_total = this.win.__bdcpro__displayTypeCounter.lu_total || 1;
					this.win.__bdcpro__displayTypeCounter.lu_total++
				} else {
					this.win.__bdcpro__displayTypeCounter.total = this.win.__bdcpro__displayTypeCounter.total || 1;
					this.win.__bdcpro__displayTypeCounter.total++
				}
				return true
			}
		},
		rt: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				var a = 0;
				if (this.startTime) {
					a = (new Date()).getTime() - this.startTime.getTime()
				}
				return a
			},
			set: "default"
		},
		dt: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				post: "",
				custInlay: "",
				captcha: "",
				pad: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true,
				pad: true
			},
			get: function() {
				return Math.round((new Date).getTime() / 1000)
			},
			set: "default"
		},
		pn: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "",
				"float": "",
				ui: "",
				custInlay: "",
				captcha: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				custInlay: true,
				captcha: true
			},
			get: function() {
				var p = "";
				var m, b, i, a = [],
				o = [],
				l = [];
				var n = this.BL.pnTypeArray[this.displayType] = this.BL.pnTypeArray[this.displayType] || [];
				if (n && n.length > 0) {
					for (m = 0, b = n.length; m < b; m++) {
						i = n[m];
						if (!i || !i.name || !i.num || !i.at) {
							continue
						}
						a.push(i.name);
						o.push(i.num);
						l.push(i.at)
					}
					p = o.join(":") + "|" + a.join(":") + "|" + l.join(":")
				}
				return p
			},
			set: function(g, a, b) {
				var h = true;
				if (!g || !a || !b) {
					g = this.get("tn");
					if (this.displayType == "ui") {
						a = this.get("hn") * this.get("wn") || 0
					} else {
						a = this.get("adn") || 0
					}
					b = this.get("at") || 103
				}
				if (!g || !a || !b) {
					h = false
				} else {
					if (this.displayType != "ui" && this.BL.pnTypeArray[this.displayType].length == 2) {
						h = false
					} else {
						if (this.displayType == "ui" && this.BL.pnTypeArray[this.displayType].length == 3) {
							h = false
						} else {
							this.BL.pnTypeArray[this.displayType] = this.BL.pnTypeArray[this.displayType] || [];
							this.BL.pnTypeArray[this.displayType].push({
								name: g,
								num: a,
								at: b
							})
						}
					}
				}
				return h
			}
		},
		c01: {
			slotParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "0",
				"float": "0",
				captcha: ""
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				captcha: true
			},
			get: "default",
			set: "default"
		},
		prt: {
			slotParamName: "",
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				inlay: "0",
				"float": "0",
				ui: "0",
				post: "0",
				custInlay: "0",
				captcha: "0"
			},
			encode: false,
			isUIParam: {
				inlay: true,
				"float": true,
				ui: true,
				post: true,
				custInlay: true,
				captcha: true
			},
			get: function() {
				var a = (new Date()).getTime();
				var b = 4 * 60 * 1000;
				if (!this.BL.pageFirstRequestTime) {
					this.BL.pageFirstRequestTime = a
				} else {
					if (a - this.BL.pageFirstRequestTime >= b) {
						this.BL.pageFirstRequestTime = a
					}
				}
				return this.BL.pageFirstRequestTime || ""
			},
			set: "default"
		},
		noop: {
			custParamName: "",
			modifier: "dynamic",
			defaultValue: {
				ui: null,
				post: null
			},
			encode: false,
			isUIParam: {
				ui: false,
				post: false
			},
			get: "default",
			set: "default"
		}
	};
	c.registerClass(d)
})(window[___shortName]); (function() {
	function r(a) {
		var b = g[a];
		g[a] = void 0;
		return b
	}
	function P(a) {
		return (a = RegExp("(^| )" + a + "=([^;]*)(;|$)").exec(i.cookie)) && a[2] ? decodeURIComponent(a[2]) : ""
	}
	function Q(a) {
		a = a || i.domain;
		0 === a.indexOf("www.") && (a = a.substr(4));
		"." === a.charAt(a.length - 1) && (a = a.substring(0, a.length - 1));
		var b = a.match(RegExp("([a-z0-9][a-z0-9\\-]*?\\.(?:com|cn|net|org|gov|info|la|cc|co|jp|us|hk|tv|me|biz|in|be|io|tk|cm|li|ru|ws|hn|fm)(?:\\.(?:cn|jp|tw|ru))?)$", "i"));
		return b ? b[0] : a
	}
	function na() {
		if (s.plugins && s.mimeTypes.length) {
			var a = s.plugins["Shockwave Flash"];
			if (a && a.description) return a.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".") + ".0"
		} else if (g.ActiveXObject && !g.opera) for (a = 10; 2 <= a; a--) try {
			var b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + a);
			if (b) return b.GetVariable("$version").replace(/WIN/g, "").replace(/,/g, ".")
		} catch(c) {}
		return ""
	}
	function R() {
		var a = i.referrer,
		b = a.replace(/^https?:\/\//, ""),
		b = b.split("/")[0],
		b = b.split(":")[0],
		b = Q(b),
		c = Q(),
		d = P("BAIDU_CLB_REFER");
		return d && c === b ? encodeURIComponent(d) : c !== b ? (i.cookie = "BAIDU_CLB_REFER=" + encodeURIComponent(a) + (c ? ";domain=" + encodeURIComponent(c) : ""), encodeURIComponent(a)) : ""
	}
	function S(a) {
		return "number" === typeof a ? Math.floor(a) : /^\d+$/.test(a) ? +a: -1
	}
	function t(a, b, c) {
		a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent("on" + b, c, !1)
	}
	function u(a) {
		var b = {},
		c = "";
		try {
			c = g.top.location.search,
			"string" !== typeof c && (c = g.location.search)
		} catch(d) {
			c = g.location.search
		}
		c = c || "";
		0 === c.indexOf("?") && (c = c.substring(1));
		for (var c = c.split("&"), e = 0; e < c.length; e++) {
			var f = c[e].split("=");
			0 == f[0].indexOf("baidu_clb_") && (b[f[0]] = f[1])
		}
		u = function(a) {
			return b[a]
		};
		return b[a]
	}
	function oa(a) {
		var b = {
			'"': "&quot;",
			">": "&gt;",
			"<": "&lt;",
			"&": "&amp;"
		};
		return a.replace(/[\"<>\&]/g,
		function(a) {
			return b[a]
		})
	}
	function I(a, b) {
		var c, d;
		0 === arguments.length ? (c = T, d = {}) : 1 === arguments.length ? "string" === typeof a ? (c = a, d = {}) : (c = T, d = a) : (c = a, d = b);
		var e = new Image,
		f = "log" + new Date,
		l = ["_=" + +new Date],
		i;
		for (i in d) z.call(d, i) && l.push(encodeURIComponent(i) + "=" + encodeURIComponent(d[i]));
		g[f] = e;
		e.onload = e.onerror = e.onabort = function() {
			e.onload = e.onerror = e.onabort = null;
			try {
				delete g[f]
			} catch(a) {
				g[f] = void 0
			}
		};
		e.src = c + (0 <= c.indexOf("?") ? "&": "?") + l.join("&")
	}
	function A(a, b) {
		var c = b || null,
		d = i.createElement("script");
		d.charset = "utf-8";
		d.async = !0;
		d.src = a;
		if (c) {
			var e = !1;
			d.onload = d.onreadystatechange = function() {
				if (!e && (!this.readyState || "loaded" === this.readyState || "complete" === this.readyState)) e = !0,
				c()
			}
		}
		for (var f = i.getElementsByTagName("script"), l = 10 > f.length ? f.length: 10, g = !1, h = 0; h < l; h++) {
			var j = f[h];
			if (j.parentNode) {
				j.parentNode.insertBefore(d, j);
				g = !0;
				break
			}
		}
		g || (f = i.getElementsByTagName("head")[0] || i.body, f.insertBefore(d, f.firstChild))
	}
	function J(a, b) {
		b = b || window;
		return "string" === typeof a || a instanceof String ? b.document.getElementById(a) : a && a.nodeName && (1 == a.nodeType || 9 == a.nodeType) ? a: null
	}
	function U(a) {
		var b = J(a),
		c = window.document,
		a = V(),
		d = {
			top: 0,
			left: 0
		};
		if (b == (a.ie && !a.isStrict ? c.body: c.documentElement)) return d;
		b.getBoundingClientRect && (b = b.getBoundingClientRect(), d.left = Math.floor(b.left) + Math.max(c.documentElement.scrollLeft, c.body.scrollLeft), d.top = Math.floor(b.top) + Math.max(c.documentElement.scrollTop, c.body.scrollTop), d.left -= c.documentElement.clientLeft, d.top -= c.documentElement.clientTop, b = c.body, c = parseInt(W(b, "borderLeftWidth"), 10), b = parseInt(W(b, "borderTopWidth"), 10), a.ie && !a.isStrict && (d.left -= isNaN(c) ? 2 : c, d.top -= isNaN(b) ? 2 : b));
		return d
	}
	function X(a, b) {
		var b = b || window,
		c = J(a, b);
		if (!c) return ! 1;
		for (var c = U(c), d, e = 0; b != b.parent && 10 > e;) {
			e++;
			if (!Y(b, b.parent) && b.frameElement) d = U(b.frameElement);
			else break;
			c.left += d.left;
			c.top += d.top;
			b = b.parent
		}
		return c
	}
	function Y(a, b) {
		var c = !1,
		a = a || window,
		b = b || window.top,
		d = 0;
		if (!B(b) || !B(b.parent)) c = !0;
		else for (; a != b && 10 > d;) {
			d++;
			if (B(a) && B(a.parent)) try {
				a.BAIDU_DUP_parentLocation = a.parent.location.toString()
			} catch(e) {
				c = !0;
				break
			} else {
				c = !0;
				break
			}
			a.BAIDU_DUP_parentLocation = void 0;
			a = a.parent
		}
		10 <= d && (c = !0);
		return c
	}
	function B(a) {
		var b = !1;
		try {
			a && ("object" === typeof a && a.document && "setInterval" in a) && (b = !0)
		} catch(c) {
			b = !1
		}
		return b
	}
	function V() {
		return {
			ie: /msie (\d+\.\d)/i.test(s.userAgent),
			isStrict: "CSS1Compat" == i.compatMode
		}
	}
	function Z(a, b) {
		var c = [ - 1, -1];
		if (!a || !b) return c;
		var d, e = V();
		try {
			d = e.isStrict ? a.document.documentElement: a.document.body,
			c = [d[b + "Width"], d[b + "Height"]]
		} catch(f) {}
		return c
	}
	function K(a) {
		a = a || window;
		return Z(a, "client")
	}
	function W(a, b) {
		var c = J(a),
		d,
		e = window.document,
		f = "",
		f = -1 < b.indexOf("-") ? b.replace(/[-_][^-_]{1}/g,
		function(a) {
			return a.charAt(1).toUpperCase()
		}) : b.replace(/[A-Z]{1}/g,
		function(a) {
			return "-" + a.charAt(0).toLowerCase()
		});
		e && e.defaultView && e.defaultView.getComputedStyle ? ((c = e.defaultView.getComputedStyle(c, null)) && (d = c.getPropertyValue(b)), "boolean" !== typeof d && !d && (d = c.getPropertyValue(f))) : c.currentStyle && ((c = c.currentStyle) && (d = c[b]), "boolean" !== typeof d && !d && (d = c[f]));
		return d
	}
	function j(a, b) {
		return g[a] ? g[a] : g[a] = b
	}
	function m(a) {
		return "baidu_clb_slot_" + a
	}
	function $(a) {
		if (a) {
			var b = n(a),
			c = i.getElementById(b.target);
			c && (h[a]._filled = !0, g.BAIDU_CLB_adRendered = void 0, 4 !== b.multimediaType && !b.data && !b.novaQuery && !b.holdPlace ? (h[a]._done = !0, k(a, !1)) : 2 === b.multimediaType && !b.novaQuery ? L(b, c) : 3 === b.multimediaType ? aa(b) : 4 === b.multimediaType ? L(b, c) : (c.innerHTML = '<div id="' + m(a) + '">' + q(b) + "</div>", k(a, !0)))
		}
	}
	function L(a, b) {
		var c = a.id,
		d = m(c),
		e = ba(a.data),
		f = ca(a.data);
		b && (b.innerHTML = '<div id="' + d + '"></div>');
		var l = da(c);
		l ? e ? C("BAIDU_CLB_CPROFSLOT", qa, [c, l]) : C(f ? "BAIDU_CLB_CPROMSLOT": "BAIDU_CLB_CPROASYNCSLOT", f ? ra: ea, [{
			id: c,
			data: l._html,
			domid: d
		}]) : (e = C, f = ea, l = {},
		l[c] = h[c], e("BAIDU_CPRO_SETJSONADSLOT", f, [l, d]));
		h[c]._done = !0;
		k(c, !0)
	}
	function fa(a) {
		var b = a.id;
		if (a.novaQuery) a = '<div id="' + m(b) + '">' + q(a) + "</div>",
		i.write(a);
		else {
			var c = ca(a.data),
			d = ba(a.data),
			e = g[d ? "BAIDU_CLB_CPROFSLOT": "BAIDU_CLB_CPROCSLOT"]; ! c && e ? e(b, da(b)) : (d || i.write('<div id="' + m(b) + '"></div>'), L(a, null))
		}
		h[b]._done = !0;
		k(b, !0)
	}
	function aa(a) {
		var b = a.id;
		if (a.data) {
			var c = m(b),
			d = '<div style="display:none" id="' + c + '"></div>';
			if (a = a.target) if (a = i.getElementById(a)) a.innerHTML = d;
			else return;
			else i.write(d);
			C("BAIDU_DAN_showAd", sa, [b, c]);
			h[b]._done = !0;
			k(b, !0)
		} else k(b, !1)
	}
	function ta(a) {
		if (!a.data && !a.holdPlace) h[a.id]._done = !0,
		k(a.id, !1);
		else {
			if (a.multimediaType) {
				var b = "string" === typeof a.data ? a.data: a.data.content;
				if (b) {
					h[a.id]._done = !0;
					i.write(b);
					k(a.id, !0);
					return
				}
			}
			b = '<div id="' + m(a.id) + '">' + q(a) + "</div>";
			i.write(b);
			k(a.id, !0)
		}
	}
	function ga(a) {
		if (a.data) if (i.body) {
			var b = i.createElement("div"),
			c = b.style;
			b.id = m(a.id);
			c.width = a.width + "px";
			c.height = a.height + 17 + "px";
			c.overflow = "hidden";
			c.zIndex = 2147483647;
			a.scroll ? ha() ? (c.position = "fixed", c[a.alignLeft ? "left": "right"] = a.horizontalSpace + "px", c[a.alignTop ? "top": "bottom"] = a.verticalSpace + "px") : (c.position = "absolute", M(a, b), t(g, "scroll",
			function() {
				M(a)
			}), t(g, "resize",
			function() {
				M(a)
			})) : (c.position = "absolute", c[a.alignLeft ? "left": "right"] = a.horizontalSpace + "px", c[a.alignTop ? "top": "bottom"] = a.verticalSpace + "px");
			i.body.insertBefore(b, i.body.firstChild);
			c = q(a);
			c += '<div style="height:15px;border:1px solid #e1e1e1;background:#f0f0f0;margin:0;padding:0;overflow:hidden;"><span style="float:right;clear:right;margin:2px 5px 0 0;width:39px;height:13px;cursor:pointer;background:url(' + ua + ') no-repeat scroll 0 0;" onmouseover="this.style.backgroundPosition=\'0 -20px\';" onmouseout="this.style.backgroundPosition=\'0 0\';" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);"></span></div>';
			b.innerHTML = c;
			k(a.id, !0)
		} else t(g, "load",
		function() {
			ga(a)
		});
		else h[a.id]._done = !0,
		k(a.id, !1)
	}
	function va(a) {
		h[a.id]._done = !0;
		k(a.id, !!a.data);
		if (a.data) {
			var b = ["height=" + a.height, "width=" + a.width, "top=" + (a.alignTop ? a.verticalSpace: v.availHeight - a.verticalSpace - a.height), "left=" + (a.alignLeft ? a.horizontalSpace: v.availWidth - a.horizontalSpace - a.width), "toolbar=no", "menubar=no", "scrollbars=no", "resizble=no", "location=no", "status=no"],
			b = b.join(","),
			c = N(a.data, a);
			0 > c.indexOf("<body>") && (c = "<!DOCTYPE html><body>" + c);
			if (a.openOnLoad || g.addEventListener) {
				var d = g.open(D(), "clb" + +new Date, b),
				e = +new Date + 3E4,
				f = function() {
					try {
						if (d.document) {
							var b = d.document;
							b.open("text/html", "replace");
							b.write(c);
							b.close();
							d.focus();
							0 < a.stayTime && setTimeout(function() {
								d && d.close()
							},
							1E3 * a.stayTime)
						}
					} catch(g) {
						new Date < e ? setTimeout(f, 200) : h[a.id]._done = "PermissionDenied"
					}
				};
				d && setTimeout(f, 0)
			} else g.attachEvent("onunload",
			function() {
				var a = g.event;
				if (0 > a.clientY && !a.ctrlKey || a.altKey) if (a = "about:blank", E() && (a = 'javascript:void(function(){var d=document;d.open();d.domain="' + document.domain + '";d.write("");d.close();}())'), a = g.open(a, "clb" + +new Date, b)) try {
					var d = a.document;
					d.open("text/html", "replace");
					d.write(c);
					d.close();
					a.focus()
				} catch(e) {}
			})
		}
	}
	function n(a) {
		var b = h[a];
		return ! b ? null: {
			id: a,
			slotType: b._stype,
			data: b._html,
			holdPlace: b._fxp,
			multimediaType: b._isMlt,
			width: b._w,
			height: b._h,
			alignLeft: b._left,
			alignTop: b._top,
			horizontalSpace: b._vs,
			verticalSpace: b._hs,
			stayTime: b._st,
			scroll: b._sf,
			openOnLoad: b._bf,
			done: b._done,
			filled: b._filled,
			flagRendered: !1 !== b._fr,
			target: b._target,
			novaQuery: b._qn,
			requestStatus: b._rs
		}
	}
	function da(a) {
		var a = n(a),
		b = {};
		return a.data ? (b._html = a.data, a.requestStatus && (b._html += "|cpro_rs=" + a.requestStatus), b) : !1
	}
	function ca(a) {
		if (!a) return ! 1;
		for (var a = a.split("|"), b = 0, c = a.length; b < c; b++) {
			var d = a[b].split("=");
			if ("cpro_template" === d[0]) return - 1 !== d[1].indexOf("mobile")
		}
		return ! 1
	}
	function ba(a) {
		if (!a) return ! 1;
		for (var a = a.split("|"), b = a.length, c = 0; c < b; c++) {
			var d = a[c].split("=");
			if ("cpro_template" === d[0]) return a = d[1].split("_"),
			!!(a[1] && 0 === a[1].indexOf("xuanfu"))
		}
		return ! 1
	}
	function M(a, b) {
		if (b = b || i.getElementById(m(a.id))) {
			var c = b.style,
			d = wa ? i.body: i.documentElement,
			e = d.clientWidth,
			f = d.clientHeight,
			l = g.pageXOffset || d.scrollLeft,
			d = g.pageYOffset || d.scrollTop;
			c.top = a.alignTop ? d + a.verticalSpace + "px": d + f - a.verticalSpace - a.height - 17 + "px";
			c.left = a.alignLeft ? l + a.horizontalSpace + "px": l + e - a.horizontalSpace - a.width + "px"
		}
	}
	function D() {
		return E() ? p.domainPolicyFileUrl || "/domain-policy.htm": "about:blank"
	}
	function q(a) {
		var b = a.frameId || "baidu_clb_slot_iframe_" + a.id;
		a.novaQuery && (a.frameSrc = xa + "?" + a.novaQuery);
		var c = a.frameSrc || D();
		return '<iframe id="' + b + '" src="' + c + '" ' + (a.frameSrc ? "": "onload=\"BAIDU_CLB_renderFrame('" + a.id + "')\"") + 'width="' + a.width + '" height="' + a.height + '" vspace="0" hspace="0" allowTransparency="true" scrolling="no" marginHeight="0" marginWidth="0"frameborder="0" style="border: 0; vertical-align: bottom; margin: 0; display: block;"></iframe>'
	}
	function k(a, b) {
		n(a).flagRendered && (g.BAIDU_CLB_adRendered = b)
	}
	function ia(a, b) {
		if (a && ya.test(a) && b) {
			for (var b = "[object Array]" == Object.prototype.toString.call(b) ? b: Array.prototype.slice.call(arguments, 1), c = y[a] || [], d = b.length, e = 0; e < d; e++) {
				var f = b[e];
				"string" === typeof f && (f = encodeURIComponent(f), 100 >= f.length && (c[c.length] = f))
			}
			if (c.length) {
				for (var d = y,
				e = {},
				f = [], g = c.length, i = 0; i < g; i++) {
					var h = c[i];
					e[h] || (f[f.length] = h, e[h] = !0)
				}
				d[a] = f
			}
		}
	}
	function za(a) {
		var a = 0 > a ? 0 : a,
		b = [],
		c;
		for (c in y) if (z.call(y, c)) {
			var d = c + "=" + y[c].join(",");
			b[b.length] = d
		}
		b.sort(function(a, b) {
			return a.length - b.length
		});
		c = "";
		for (var d = b.length,
		e = 0; e < d && !(c.length + b[e].length >= a); e++) c += "&" + b[e];
		return c
	}
	function O() {}
	function F(a, b) {
		var c = [];
		if (a instanceof Array) for (var d = 0; d < a.length; d++) c.push("-1x-1");
		else if (c = ["-1x-1"], "string" === typeof h[a]) try {
			var e = h[a],
			f = X(e);
			f && (c = [f.top + "x" + f.left])
		} catch(l) {} else try {
			e = "BAIDU_CLB_SLOT_PS_" + a,
			i.write('<div id="' + e + '"></div>'),
			(f = X(e)) && (c = [f.top + "x" + f.left])
		} catch(j) {}
		c = c.join(",");
		f = ["di=" + (a instanceof Array ? a.join(",") : a), "fn=" + b, "tpl=BAIDU_CLB_SETJSONADSLOT", "asp_refer=" + R(), "asp_url=" + encodeURIComponent(i.URL), "new=9"];
		if ((e = ja()) && a == e.sid) f.push("mid=" + e.mid),
		f.push("sid=" + e.vc);
		for (var d = function() {
			try {
				var a = window[___shortName],
				b = a.using("$baseName.BusinessLogic"),
				c = a.create(b.Param, {
					displayType: "inlay",
					currentWindow: window,
					timeStamp: (new Date).getTime()
				}),
				d = b.Param.snap && b.Param.snap(c);
				p.ups = d;
				return b.Param.serialize(c)
			} catch(e) {
				return ""
			}
		} (), d = function(a) {
			var b = ["fv", parseInt(na(), 10)],
			d = ["word", encodeURIComponent(i.URL)],
			e = ["refer", R()],
			f = ["lmt", Math.round( + new Date(i.lastModified) / 1E3)],
			h = ["csp", v.width + "," + v.height],
			l = ["csn", v.availWidth + "," + v.availHeight],
			j = ["ccd", v.colorDepth],
			k = ["cja", s.javaEnabled().toString()],
			o = ["cce", s.cookieEnabled || 0],
			m = ["csl", encodeURIComponent(s.language || s.browserLanguage).replace(/[^a-zA-Z0-9\-]/g, "")],
			n = ["dt", Math.round( + new Date / 1E3)],
			pa = ["ps", c],
			r = ["pcs", K(g).join("x")],
			p = g,
			p = p || window,
			p = ["pss", Z(p, "scroll").join("x")],
			t = ["pis", K(g).join("x")],
			u = ["cec", (document.characterSet ? document.characterSet: document.charset) || ""],
			w = g,
			x = 0,
			q;
			q = w || window;
			q != window.top && q != q.parent && (x += 1);
			Y(w, w.top) && (x += 2);
			w = K(w);
			if (40 > w[0] || 10 > w[1]) x += 4;
			b = [b, ["cn", 1], ["if", 0], d, e, ["ready", 1], ["jn", 3], f, h, l, j, ["chi", ""], k, ["cpl", ""], ["cmi", ""], o, m, ["did", ""], ["rt", ""], n, ["c01", 0], ["prt", ""], pa, r, p, t, u, ["dis", x]];
			d = [];
			for (e = 0; e < b.length; e++) f = b[e][0],
			h = RegExp(f + "=([^&]*)"),
			h = h.exec(a) && h.exec(a)[1] ? h.exec(a)[1] : b[e][1],
			d[e] = f + "=" + h;
			return d
		} (d), e = {},
		f = f.concat(d), o = ["asp_refer", "asp_url", "word", "refer"], k = RegExp("^(" + o.join("|") + ")=(.*)"), d = 0, m = f.length; d < m; d++) {
			var n = f[d].match(k);
			n && (e[n[1]] = n[2], e[n[1] + "Num"] = d)
		}
		for (; 1 < o.length;) {
			k = o.pop();
			d = 0;
			for (m = o.length; d < m; d++) if (e[k] && e[k] === e[o[d]]) {
				f[e[k + "Num"]] = k + "=" + o[d];
				break
			}
		}
		d = Aa + "?" + f.join("&") + "&baidu_id=" + P("BAIDUID");
		2073 < d.length && (o = e.asp_refer ? "$1asp_refer$2": "$1$2", d = d.replace(/(&refer=).*?(&)/, o), 2073 < d.length && (o = "$1$2", e.asp_url && (o = "asp_url=asp_refer" === f[e.asp_urlNum] ? "$1asp_refer$2": "$1asp_url$2"), d = d.replace(/(&word=).*?(&)/, o)));
		return d + za(2073 - d.length)
	}
	function ka(a) {
		var b = la(a);
		if (h[b]._target) $(b);
		else if (a = n(b)) {
			h[b]._filled = !0;
			g.BAIDU_CLB_adRendered = void 0;
			if (2 === a.multimediaType) b = fa;
			else if (3 === a.multimediaType) b = aa;
			else if (4 === a.multimediaType) b = fa;
			else switch (a.slotType) {
			case 0:
			case 3:
				b = ta;
				break;
			case 1:
				b = ga;
				break;
			default:
				b = va
			}
			b(a)
		}
	}
	function la(a) {
		for (var b in a) if (z.call(a, b)) {
			a = a[b];
			if ("string" === typeof h[b]) {
				var c = h[b];
				h[b] = a;
				h[b]._target = c
			} else "object" !== typeof h[b] && (h[b] = a);
			a = a._html;
			if ("object" === typeof a) if ("slide" === a.type) {
				a = a.materials;
				for (c = 0; c < a.length; c++) {
					var d = a[c];
					d.monitorUrl && I(d.monitorUrl)
				}
			} else a.monitorUrl && I(a.monitorUrl);
			return b
		}
		return ""
	}
	function G(a) {
		if (a) {
			var b = h[a];
			if (! (!0 === b || "string" === typeof b)) if ("object" === typeof b) {
				if (!b._filled) {
					b._filled = !0;
					var c = {};
					c[a] = b;
					ka(c)
				}
			} else h[a] = !0,
			a = F(a, "BAIDU_CLB_SETJSONADSLOT"),
			i.write('<script charset="utf-8" src="' + a + '"><\/script>')
		}
	}
	function ja() {
		var a = u("baidu_clb_preview_sid"),
		b = u("baidu_clb_preview_mid"),
		c = u("baidu_clb_preview_vc"),
		d = +u("baidu_clb_preview_ts");
		return 3E4 >= +new Date - d ? {
			sid: a,
			mid: b,
			vc: c
		}: null
	}
	function ma(a, b, c) {
		b = S(b);
		c = S(c);
		if (0 > b || 0 > c) G(a);
		else {
			g.BAIDU_CLB_adRendered = void 0;
			var d = n(a);
			d ? G(a) : (h[a] = {
				_w: b,
				_h: c,
				_filled: !0,
				_done: !0
			},
			d = n(a), d.frameId = "baidu_clb_slot_proxy_" + a, b = F(a, "BAIDU_CLB_SETJSONADSLOT"), d.frameSrc = Ba + "#" + encodeURIComponent(b), d = q(d), i.write(d), k(a, !0))
		}
	}
	var g = window,
	v = g.screen,
	s = g.navigator,
	i = g.document,
	wa = "CSS1Compat" !== i.compatMode,
	h = j("BAIDU_CLB_SLOTS_MAP", {}),
	z = Object.prototype.hasOwnProperty,
	Aa = "http://cb.baidu.com/ecom",
	sa = "http://cbjs.baidu.com/js/dn.js",
	Ba = "http://cbjs.baidu.com/js/proxy.htm",
	ua = "http://drmcmm.baidu.com/js/img/close.gif",
	T = "http://cbjslog.baidu.com/log",
	ea = "http://cpro.baidustatic.com/cpro/ui/cc.js",
	qa = "http://cpro.baidustatic.com/cpro/ui/cf.js",
	ra = "http://cpro.baidustatic.com/cpro/ui/cm.js",
	xa = "http://cpro.baidu.com/cpro/ui/uijs.php",
	ha = function() {
		var a = i.createElement("div"),
		b = i.createElement("div"),
		c = !1;
		a.style.position = "absolute";
		a.style.top = "200px";
		b.style.position = "fixed";
		b.style.top = "100px";
		a.appendChild(b);
		i.body.insertBefore(a, i.body.firstChild);
		b.getBoundingClientRect && b.getBoundingClientRect().top !== a.getBoundingClientRect().top && (c = !0);
		i.body.removeChild(a);
		ha = function() {
			return c
		};
		return c
	},
	E = function() {
		var a = i.createElement("iframe"),
		b = !1;
		a.src = "about:blank";
		i.body.insertBefore(a, i.body.firstChild);
		try {
			b = !a.contentWindow.document
		} catch(c) {
			b = !0
		}
		i.body.removeChild(a);
		E = function() {
			return b
		};
		return b
	};
	j("BAIDU_CLB_sendLog", I);
	var C = function() {
		var a = j("BAIDU_CLB_taskQueues", {});
		return function(b, c, d) {
			if (g[b]) g[b].apply(g, d);
			else {
				var e = b + "@" + c,
				f = a[e];
				f || (f = a[e] = [], A(c,
				function() {
					for (; f.length;) {
						var c = f.shift();
						g[b].apply(g, c)
					}
					delete a[e]
				}));
				f.push(d)
			}
		}
	} (),
	p = j("BAIDU_CLB_globalConfig", {});
	j("BAIDU_CLB_setConfig",
	function(a, b) {
		p[a] = b
	}); (function(a, b) {
		var c = r(b);
		c && (p[a] = c)
	})("domainPolicyFileUrl", "BAIDU_CLB_domainPolicyFileUrl");
	p.version = "20130904";
	var N = function() {
		function a(a, d, e) {
			if ("string" === typeof a) return a;
			if (!a.type) return "";
			var f = b[a.type];
			return f ? (a = "string" === typeof f ? H(f, a) : f(a, d), e ? a: "<!DOCTYPE html><body>" + a) : ""
		}
		var b = {
			text: function(a) {
				var b = '<span style="word-wrap:break-word;"><a href="{clickUrl:string}" target="{target:string}" style="font-size:{size:number}{unit:string};color:{defaultColor:string};font-weight:{defaultBold:string};font-style:{defaultItalic:string};text-decoration:{defaultUnderline:string};"{events}>{text:string}</a></span>',
				e = /\{events\}/;
				if (1 === a.version) b = b.replace(e, "");
				else if (2 === a.version) for (var b = b.replace(e, " onmouseover=\"this.style.color = '{hoverColor:string}';this.style.fontWeight = '{hoverBold:string}';this.style.fontStyle = '{hoverItalic:string}';this.style.textDecoration = '{hoverUnderline:string}';\" onmouseout=\"this.style.color = '{defaultColor:string}';this.style.fontWeight = '{defaultBold:string}';this.style.fontStyle = '{defaultItalic:string}';this.style.textDecoration = '{defaultUnderline:string}';\""), e = ["default", "hover"], f = 0; f < e.length; f++) {
					var h = e[f],
					g = h + "Color",
					i = h + "Bold",
					j = h + "Italic",
					h = h + "Underline";
					a[g] = "#" + a[g];
					a[i] = a[i] ? "bold": "normal";
					a[j] = a[j] ? "italic": "normal";
					a[h] = a[h] ? "underline": "none"
				}
				return H(b, a)
			},
			image: '<a href="{clickUrl:string}" target="{target:string}"><img src="{src:string}" title="{title:html}" alt="{title:html}" border="0" height="{height:number}" width="{width:number}" /></a>',
			flash: function(a) {
				a.file = a.hasLink ? "cflash": "flash";
				a.imageClickUrl = a.clickUrl;
				a.hasLink || (a.clickUrl = "");
				return H('<script>var BD = BD || {};BD.MC = BD.MC || {};BD.MC.ADFlash = BD.MC.ADFlash || {};BD.MC.ADImg = BD.MC.ADImg || {};BD.MC.ADFlash.w = {width:number};BD.MC.ADFlash.h = {height:number};BD.MC.ADFlash.mu = "{src:string}";BD.MC.ADFlash.cu = "{clickUrl:string}";BD.MC.ADFlash.wm = {wmode:number};BD.MC.ADFlash.ct = "{clickTag:string}";BD.MC.ADImg.w = {imageWidth:number};BD.MC.ADImg.h = {imageHeight:number};BD.MC.ADImg.mu = "{imageSrc:string}";BD.MC.ADImg.cu = "{imageClickUrl:string}";BD.MC.ADImg.tw = "{target:string}";BD.MC.ADImg.flag = {backupImage:number};<\/script><script src ="http://cbjs.baidu.com/js/{file:string}.js"><\/script>', a)
			},
			rich: function(a) {
				return a.content
			},
			slide: function(b, d) {
				for (var e = [], f = b.materials, h = 0; h < f.length; h++) {
					var g = f[h];
					"string" !== typeof g && (g = a(g, d, !0));
					e.push(g)
				}
				b.html = "<div>" + e.join("</div><div>") + "</div>";
				b.width = d.width;
				b.height = d.height;
				return H('<div id="bd_ec_clb_asp" style="width: {width:number}px; height: {height:number}px; overflow: hidden;">{html:string}</div><script>(function(){var d = document;function G(id) { return d.getElementById(id); };var container = G("bd_ec_clb_asp");var pages = container.childNodes;var pl = 0;for (var i = 0; i < container.childNodes.length; i++) {if (container.childNodes[i].nodeType === 1) {pl++;}}var cp = 0;function showPage(pn) { pages[pn].style.display = ""; };function hidePages() {for (var i = 0; i < pl; i++) {pages[i].style.display = "none";}};function roll() {hidePages();showPage(cp);cp == (pages.length - 1) ? cp = 0 : cp++;};var autoRoll;function setRoll() { autoRoll = window.setInterval(function() { roll(); }, {interval:number});};roll();setRoll();container.onmouseover = function() { window.clearInterval(autoRoll); };container.onmouseout = function() {setRoll(); } })();<\/script>', b)
			}
		};
		return a
	} ();
	j("BAIDU_CLB_formatMaterial", N);
	var H = function() {
		var a = /\{(\w+)\:(\w+)\}/g;
		return function(b, c) {
			return b.replace(a,
			function(a, b, f) {
				a = c[b];
				switch (f) {
				case "number":
					a = +a || 0;
					break;
				case "boolean":
					a = !!a;
					break;
				case "html":
					a = oa(a)
				}
				return a
			})
		}
	} ();
	j("BAIDU_CLB_renderFrame",
	function(a) {
		var b = document.getElementById("baidu_clb_slot_iframe_" + a),
		c = n(a);
		if (E() && b.getAttribute("src", 2) !== D()) b.src = D();
		else if (c && !c.done) try {
			h[a]._done = !0;
			var d = N(c.data, c);
			0 > d.indexOf("<body>") && (d = "<!DOCTYPE html><body>" + d);
			var e = b.contentWindow.document;
			e.open("text/html", "replace");
			e.write(d);
			e.close();
			e.body && (e.body.style.backgroundColor = "transparent");
			1 === c.slotType && 0 < c.stayTime && setTimeout(function() {
				var b = document.getElementById(m(a));
				b && b.parentNode.removeChild(b)
			},
			1E3 * c.stayTime)
		} catch(f) {
			h[a]._done = "PermissionDenied"
		}
	});
	j("BAIDU_CLB_prepareMoveSlot",
	function(a) {
		void 0 === a || void 0 === h[a] || (h[a]._done = !1)
	});
	var y = j("BAIDU_CLB_orientations", {}),
	ya = /^[0-9a-zA-Z]+$/;
	j("BAIDU_CLB_addOrientation", ia); (function() {
		var a = r("BAIDU_CLB_ORIENTATIONS");
		if (a) for (var b in a) z.call(a, b) && ia(b, a[b])
	})();
	j("BAIDU_CLB_addSlot", O);
	j("BAIDU_CLB_enableAllSlots", O);
	j("BAIDU_CLB_SETHTMLSLOT", O);
	j("BAIDU_CLB_SETJSONADSLOT", ka);
	j("BAIDU_CLB_ADDAD", la);
	j("BAIDU_CLB_fillSlot", G);
	j("BAIDU_CLB_singleFillSlot", G);
	j("BAIDU_CLB_fillSlotAsync",
	function(a, b) {
		if (a && b && !("string" != typeof b && b.constructor != String)) {
			var c = h[a];
			if (! (!0 === c || "string" === typeof c)) {
				if ("object" === typeof c) return h[a]._target = b,
				$(a);
				h[a] = b;
				A(F(a, "BAIDU_CLB_SETJSONADSLOT"))
			}
		}
	});
	j("BAIDU_CLB_preloadSlots",
	function(a) {
		function b(a) {
			a = F(a, "BAIDU_CLB_ADDAD");
			i.write('<script charset="utf-8" src="' + a + '"><\/script>')
		}
		for (var c = [], d = ja(), e = arguments.length, f = 0; f < e; f++) {
			var g = arguments[f];
			if (! (d && g == d.sid) && (h[g] || (c[c.length] = g, h[g] = !0), 16 <= c.length)) b(c),
			c = []
		}
		c.length && b(c)
	});
	j("BAIDU_CLB_fillSlotWithSize", ma); (function() {
		var a = r("BAIDU_CLB_SLOT_ID"),
		b = r("BAIDU_CLB_SLOT_WIDTH"),
		c = r("BAIDU_CLB_SLOT_HEIGHT");
		ma(a, b, c)
	})(); (function() {
		var a = r("BAIDU_CLB_JSONP_URL");
		a && i.write('<script charset="utf-8" src="' + a + '"><\/script>')
	})(); (function() {
		g.BAIDU_CLB_logOK || (g.BAIDU_CLB_logOK = !0, t(g, "load",
		function() {
			A("http://cbjs.baidu.com/js/log.js")
		}), 0.1 >= Math.random() && t(g, "load",
		function() {
			A("http://cbjs.baidu.com/js/logAdvanced.js",
			function() {
				try {
					var a = window.LogAdvancedNamespace.using("$baseName.BusinessLogic"),
					b;
					for (b in h) a.adsArray && a.adsArray.push({
						id: b,
						domId: m(b),
						uiParamSnap: p.ups,
						win: window,
						js: "cc"
					});
					a.ViewWatch && a.ViewWatch.getInstance()
				} catch(c) {}
			})
		}))
	})()
})();