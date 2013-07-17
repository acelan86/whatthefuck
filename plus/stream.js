var data = {},
    sinaads_adsome_key = "sinaads_adSameObj_" + sinaads_ad_pdps;

if (window.top === window) {
    stream(data, window, window.document);
} else {
    try {
        stream(data, window.top, window.top.document);
    } catch (e) {

    }
}

function stream(data, window, document, undefined) {
    //sinaads.core.cookie.get(name);
    var _as_getcv = sinaads.core.cookie.get;
    //sinaads.core.cookie.set(key, value, options)
    var _as_setcv = function (key, value, expires, path, domain, secure) {
        sinaads.core.cookie.set(key, value, {
            expires : expires,
            path : path,
            domain : domain,
            secure : secure
        });
    };
    var _as_delcv = sinaads.core.cookie.remove;

    function _as_hts(C, B) {
        var A = _as_getcv(C);
        if (!A) {
            _as_setcv(C, "1", B);
            return 0
        } else return 1
    }
    function _as_sts(C) {
        var D = new Date().toDateString(),
        A = _as_getcv(C);
        if (!A) {
            _as_setcv(C, "1," + D, 24 * 3600);
            return 1
        } else {
            var B = A.split(",");
            if (B[1] == D) {
                _as_setcv(C, (++B[0]) + "," + D, 24 * 3600);
                return B[0]
            } else {
                _as_setcv(C, "1," + D, 24 * 3600);
                return 1
            }
        }
    }
    function _as_dts(D, F) {
        var C = new Date(),
        H = "",
        G = String(String(C.getFullYear()) + "-" + Number(C.getMonth() + 1) + "-" + String(C.getDate()));
        if (_as_getcv(D) != null) {
            H = String(_as_getcv(D));
            if (H.indexOf(G) != -1) {
                var B = H.split(G + "-"),
                E = B[1].split("-")[0],
                A = B[1].substr(E.length);
                if (Number(E) == F) return false;
                else {
                    H = B[0] + G + "-" + (Number(E) + 1) + A;
                    _as_setcv(D, H, 24 * 3600 * 2);
                    return true
                }
            } else {
                H += String(G + "-1-");
                _as_setcv(D, H, 24 * 3600 * 2);
                return true
            }
        } else {
            H += String(G + "-1-");
            _as_setcv(D, H, 24 * 3600 * 2);
            return true
        }
    }

    function _as_setstyle(A, B) {
        if (_as_bro.isIe(B)) A.style.cssText = B;
        else A.setAttribute("style", B)
    }
    function getBody() {
        if (sinaads.core.browser.isStrict) {
            return (document.documentElement) ? document.documentElement: document.body;
        } else {
            return document.body;
        }
    }
    //_as_getbst
    function getScrollTop() {
        var top = 0;
        if (self.pageYOffset) {
            var top = self.pageYOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {
            top = document.documentElement.scrollTop;
        } else if (document.body) {
            top = document.body.scrollTop;
        }
        return top;
    }
    //_as_getbsl
    function getScrollLeft() {
        var left = 0;
        if (self.pageXOffset) {
            var left = self.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollLeft) {
            left = document.documentElement.scrollLeft;
        } else if (document.body) {
            left = document.body.scrollLeft;
        }
        return left;
    }
    function _as_extend(A, F, E) {
        if (typeof F == "object") {
            E = F;
            F = A;
            A = function() {
                F.apply(this, arguments)
            }
        }
        var C = function() {},
        D,
        B = F.prototype;
        C.prototype = B;
        D = A.prototype = new C();
        D.constructor = A;
        D.superclass = A.superclass = B;
        if (E) {
            var G = A.prototype;
            for (var H in E) G[H] = E[H]
        }
        A.prototype.override = function(A) {
            for (var B in A) this[B] = A[B]
        };
        return A;
    }
    function createDom(tagName, attrs, content) {
        function create() {
            var dom = document.createElement(tagName);
            for (var attr in attrs) {
                dom.setAttribute(attr, attrs[attr]);
            }
            if (content) {
                if (tagName.toLowerCase() != "script") { 
                    dom.innerHTML = content;
                } else {
                    dom.text = content;
                }
            }
            return dom;
        };
        document.body.insertBefore(create(), document.body.firstChild);
    }

    function AdSomeDiv1(config) {
        this.c = config;
        this.id = config.id || "sinaads_AdSame_DIV" + Math.round(Math.random() * 1000);
        this.w = config.width || 100;
        this.h = config.height || 100;
        this.va = config.vAlign || "top";
        this.ha = config.hAlign || "left";
        this.hp = config.hPadding || 0;
        this.vp = config.vPadding || 0;
        this.zi = config.zIndex || 10002;
        this.mt = config.minTop || 0;
        this.fs = config.followScroll || true;
        this.fscr = config.firstScreen || true;
        this.pid = config.spanId || "sinaads_AdSame_SPAN" + Math.round(Math.random() * 1000);
        this.name = config.selfName || "c";
        this.handle = null;
        this.left = this.top = 0;
        this.flag = -1;
        this.first = true;
        this._l = -1;
        this.at = "absolute";
        if (this.fs && sinaads.core.browser.isStrict && (!sinaads.core.browser.ie)) {
            this.at = "fixed";
        }
        createDom("SPAN", {id: this.pid}, "");

        if (typeof this.onAfterInit == "function") {
            this.onAfterInit.call(this);
        }
    }
        AdSomeDiv1.prototype.getTop = function() {
            switch (this.va) {
                case "center":
                    var height = getBody().clientHeight,
                        top = Math.round((height - this.h) / 2 + this.vp);
                    var _top = top - this.h;
                    return (_top < 0 ? 0 : (top > _top ? _top: top));
                case "top":
                    if (this.vp < 1) {
                        return Math.round(getBody().clientHeight * this.vp);
                    }
                    return this.vp;
                case "bottom":
                    var bottom = getBody().scrollHeight - this.h,
                        height = getBody().clientHeight;
                    if (bottom < height) {
                        bottom = height;
                    }
                    var _bottom = height - this.h - this.vp;
                    return _bottom > bottom ? bottom : _bottom;
                default:
                    return 0;    
            }
        };
        AdSomeDiv1.prototype.getLeft = function() {
            switch (this.ha) {
                case "center":
                    var width = getBody().clientWidth,
                        left = Math.round((width - this.w) / 2 + this.hp);
                    width -= this.w;
                    return (left < 0 ? 0 : (left > width ? width: left));
                case "left":
                    if (this.hp < 1) {
                        return Math.round(getBody().clientWidth * this.hp);
                    }
                    return this.hp;
                case "right":
                    var _right = getBody().scrollWidth - this.w,
                        width = getBody().clientWidth;
                    if (right < width) {
                        _right = width;
                    }
                    var _width = width - this.w - this.hp;
                    return _width > right ? right : _width;
                default:
                    return 0;
            }
        };
        AdSomeDiv1.prototype.getScrollTop = function() {
            if (!this.fs && this.fscr) {
                return 0;
            }
            return getScrollTop();
        };
        AdSomeDiv1.prototype.setpos = function (doloop) {
            var _v_one = false,
            _h_one = false,
            st = this.handle.style;
            st.top = "auto";
            st.left = "auto";
            st.right = "auto";
            st.bottom = "auto";

            if (this.at == "fixed") {
                if (this.va == "top" && this.vp >= 0) {
                    if (this.mt > 0) {
                        var bst = getScrollLeft(),
                        tt = bst + this.vp;
                        st.top = (tt < this.mt ? this.mt - bst: this.vp) + "px"
                    } else {
                        st.top = this.vp + "px";
                        _v_one = true
                    }
                } else if (this.va == "bottom" && this.vp >= 0) {
                    if (this.mt > 0) {
                        tt = this.getTop(),
                        bst = getScrollTop();
                        st.top = ((tt + bst) < this.mt ? this.mt - bst: tt) + "px"
                    } else {
                        st.bottom = this.vp + "px";
                        _v_one = true
                    }
                } else {
                    tt = this.getTop(),
                    bst = getScrollTop();
                    st.top = ((bst + tt) < this.mt ? this.mt - bst: tt) + "px"
                }
                if ((this.ha == "left" || this.ha == "right") && (this.hp >= 1 || this.hp == 0)) {
                    eval("st." + this.ha + "='" + this.hp + "px';");
                    _h_one = true
                } else st.left = this.getLeft() + "px"
            } else {
                if ((this.va == "top" || this.va == "bottom") && (this.vp >= 1 || this.vp == 0) && (!this.fs)) {
                    if (this.fscr) {
                        st[this.va] = this.vp + "px";
                    } else {
                        st.top = (getScrollTop() + this.gett()) + "px";
                    }
                    _v_one = true;
                } else {
                    tt = getScrollTop() + this.getLeft();
                    st.top = (tt < this.mt ? this.mt: tt) + "px";
                }
                if ((this.ha == "left" || this.ha == "right") && (this.hp >= 1 || this.hp == 0) && (!this.fs)) {
                    st[this.ha] = this.hp + "px";
                    _h_one = true;
                } else {
                    st.left = (getScrollLeft() + this.getLeft()) + "px";
                }
            }
            if (doloop && ((!_h_one) || (!_v_one))) {
                var obj = this;
                if (this.at == "fixed") {

                    var timer = window.setInterval(function() {
                        if (obj.flag <= 0) return;
                        if (obj.handle != -1) {
                            if (!_h_one) {
                                st.left = obj.getLeft() + "px";
                            }
                            if (!_v_one) {
                                var top = obj.getTop(),
                                    scrollTop = getScrollTop();
                                st.top = ((scrollTop + top) < obj.mt ? obj.mt - scrollTop: top) + "px";
                            }
                        } else {
                            window.clearInterval(timer);
                        }
                    }, 100);
                } else {
                    timer = window.setInterval(function() {
                        if (obj.flag <= 0) {
                            return;
                        }
                        if (obj.handle != -1) {
                            var scrollLeft = 0,
                                scrollTop = 0;
                            if (obj.fs) {
                                scrollLeft = getScrollLeft();
                                scrollTop = getScrollTop();
                            }
                            if (!_h_one) {
                                st.left = (scrollLeft + obj.getLeft()) + "px";
                            }
                            if (!_v_one) {
                                var _top = scrollTop + obj.getTop();
                                st.top = (_top < obj.mt ? obj.mt: _top) + "px";
                            }
                        } else {
                            window.clearInterval(timer);
                        }
                    }, 100);
                }
            }
        };
        AdSomeDiv1.prototype.create = function(content) {
            if (this.flag >= 0) {
                return;
            }
            this.top = this.getTop();
            this.left = this.getLeft();
            if (typeof this.onBeforeCreate == "function") {
                if (this.onBeforeCreate.call(this) === false) {
                    return false;
                }
            }
            var html = [
                "<div ", 
                    "id='" + this.id + "' ",
                    "name='" + this.id + "' ",
                    "style='position:" + this.at + ";",
                    "z-index:" + this.zi + ";",
                    "top:-" + this.h + "px;",
                    "left:-" + this.w + "px;",
                    "width:1px;height:1px;",
                    "overflow:hidden;",
                "'>"
            ];

            html.push(content);
            if (typeof this.getHTML == "function") {
                html.push(this.getHTML());
            }
            html.push("</div>");

            document.getElementById(this.pid).innerHTML = html.join('');

            this.flag = 0;
            this.handle = document.getElementById(this.id);

            if (typeof this.onAfterCreate == "function") {
                if (this.onAfterCreate.call(this) === false) {
                    this.destroy();
                    return false
                }
            }
            return this.handle;
        };
        AdSomeDiv1.prototype.show = function() {
            var timer;

            if (!this.first) {
                this.showsmp();
                this.first = false;
                return
            }
            if (typeof this.onBeforeShow == "function") {
                if (this.onBeforeShow.call(this) === false) {
                    return false;
                }
            }
            if (this.flag > 0) {
                return;
            }
            var THIS = this,
                _style = this.handle.style;
            function A() {
                THIS.setpos();
                _style.width = THIS.w + "px";
                _style.height = THIS.h + "px";
                _style.display = "block";
                THIS.flag = 1;
                if (typeof THIS.onAfterShow == "function") {
                    if (THIS.onAfterShow.call(THIS) === false) {
                        return false;
                    }
                }
                THIS.setpos(true);
            }

            if (THIS.flag >= 0) {
                A();
            } else {
                timer = window.setInterval(function() {
                    if (!THIS.flag < 0) {
                        return;
                    }
                    window.clearInterval(timer);
                    A();
                }, 500);
            }
        };
        AdSomeDiv1.prototype.showsmp = function() {
            var _style = this.handle.style;
            if (typeof this.onBeforeShow == "function") {
                if (this.onBeforeShow.call(this) === false) {
                    return false;
                }
            }
            if (this.flag > 0) {
                return;
            }
            _style.width = this.w + "px";
            _style.height = this.h + "px";
            _style.left = this._l + "px";
            if (!this.fscr) {
                this.setpos();
            }
            this.flag = 1;
            if (typeof this.onAfterShow == "function") {
                this.onAfterShow.call(this);
            }
        };
        AdSomeDiv1.prototype.hide = function() {
            if (typeof this.onBeforeHide == "function") {
                if (this.onBeforeHide.call(this) === false) {
                    return false;
                }
            }
            if (this.flag == 1) {
                this.handle.style.width = "1px";
                this.handle.style.height = "1px";
                this._l = this.handle.style.left;
                this.handle.style.left = "-" + this.w + "px";
                this.flag = 0;
                if (typeof this.onAfterHide == "function") {
                    this.onAfterHide.call(this);
                }
            }
        };
        AdSomeDiv1.prototype.destroy = function() {
            var A = this.handle.style;
            if (typeof this.onBeforeDestroy == "function") if (this.onBeforeDestroy.call(this) === false) return false;
            if (this.flag >= 0) {
                if (!sinaads.core.browser.isSafari) {
                    this.handle.style.display = "none";
                }
                if (!sinaads.core.browser.isOpera) {
                    this.handle.parentNode.removeChild(this.handle);
                }
                this.handle = -1;
                this.flag = -1;
                if (typeof this.onAfterDestroy == "function") {
                    this.onAfterDestroy.call(this);
                }
            }
        };
    

    function AdSomeDiv(config) {
        this.inishow = config.iniShow || true;
        this.alwaysshow = config.alwaysShow || false;
        this.autocls = config.autoClsSeconds || -1;
        this.autoclsfc = config.autoclsfc || null;
        if (config.btns) {
            this.btw = config.btnWidth || 0;
            this.bth = config.btnHeight || 0;
            this.bta = config.btnAlign || "right";
            var btn = this.bth;
            if (btn <= 0 && config.btns.length > 0) {
                for (var i = 0; i < config.btns.length; i++) {
                    if (config.btns[i].height > btn) {
                        btn = config.btns[i].height;
                    }
                }
            }
        }
        AdSomeDiv.superclass.constructor.call(this, config);
        
        if (btn > 0) {
            this.h += btn;
        }
        this.isini = true;
        this.clshd = null;
    }

    _as_extend(AdSomeDiv, AdSomeDiv1, {
        show: function() {
            if (!this.inishow && this.isini) {
                this.isini = false;
                return;
            }
            if (this.autocls > 0 && this.autoclsfc) {
                var obj = this;
                this.clshd = window.setTimeout(function() {
                    eval(obj.autoclsfc + ";")
                }, this.autocls * 1000);
            }
            AdSomeDiv.superclass.show.call(this);
        },
        getHTML: function() {
            var btn = this.c.btns,
                html = [];
            if (btn) {
                var THIS = this,
                    createHTML = function(E, F, H, C) {
                        var A = THIS.btw ? THIS.btw : H.width,
                            G = THIS.bth ? THIS.bth: H.height;
                        html.push(
                            "<div style='width:" + A + "px;",
                                "height:" + G + "px;",
                                "overflow:hidden;",
                                "cursor:pointer;",
                                C == 1 ? "clear:" + E + ";" : C == 2 ?  "clear:" + F + ";" : "",
                                "float:" + E + ";' ",
                                H.fc ? "onclick='" + H.fc + "' " : "",
                            ">",
                                "<img style='width:" + A + "px;",
                                    "height:" + G + "px;' ",
                                    "src='" + H.url + "' />",
                            "</div>"
                        );
                    };

                switch (this.bta) {
                    case "left":
                        for (var i = 0; len < btn.length; i++) {
                            createHTML("left", "right", btn[i]);
                        }
                        break;
                    case "right":
                        for (i = btn.length - 1; i >= 0; i--) {
                            createHTML("right", "left", btn[i]);
                        }
                        break;
                }
            }
            return html.join('');
        },
        hide: function() {
            window.clearTimeout(this.clshd);
            if (this.alwaysshow) {
                return;
            }
            AdSomeDiv.superclass.hide.call(this);
        }
    });

    function AdSomeDivfl(config) {
        this.fl = config.flash || {};
        AdSomeDivfl.superclass.constructor.call(this, config);
    }

    _as_extend(AdSomeDivfl, AdSomeDiv, {
        setflash: function(flash) {
            this.fl = flash;
            this.flid = flash.id
        },
        show: function() {
            var A = this;
            if (this.first === false) {
                AdSomeDivfl.superclass.show.call(this);
                return
            }
            A.fl.onAfterShow = function() {
                A.fl.onAfterShow = null;
                AdSomeDivfl.superclass.show.call(A)
            };
            A.fl.show()
        },
        onBeforeShow: function() {
            this.fl.replay.call(this.fl)
        },
        onBeforeDestroy: function() {
            var A = document.getElementById(this.fl.id);
            this.fl.stop.call(this.fl);
            if (!_as_bro.isOpera()) A.parentNode.removeChild(A)
        }
    });

    function AdSomeFlash(config) {
        this.c = config;
        this.id = config.id || "_AdSame_Flash" + Math.round(Math.random() * 1000);
        this.name = config.selfName || "f";
        this.w = config.width || 100;
        this.h = config.height || 100;
        this.src = config.srcUrl || "";
        this.clk = config.clickUrl || "";
        this.fscmd = config.fscmdfc || false;
        this.exdir = config.expandDirect || "left";
        this.paras = config.paras || {};
        this.loaded = false;
        // if (this.id && this.fscmd) {
        //     var A = "function " + this.id + "_DoFSCommand(command, args) {";
        //     A += "if(" + this.name + ")" + this.name + ".fscmd(command, args);}";
        //     _as_asp("SCRIPT", {
        //         language: "javascript"
        //     },
        //     A);
        //     if (_as_bro.isIe()) {
        //         A = this.id + "_DoFSCommand(command, args);";
        //         _as_asp("SCRIPT", {
        //             language: "javascript",
        //             htmlFor: this.id,
        //             For: this.id,
        //             event: "FSCommand(command,args)"
        //         },
        //         A)
        //     }
        // }
    }


        AdSomeFlash.prototype.getHTML = function() {
            var html;
            if (sinaads.core.browser.ie) {
                html = [
                    "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' ", 
                        "style='z-index:1; display:block;",
                        this.exdir == "right" ? "position:absolute;right:0px;float:right;" : '',
                        "width:" + this.w + "px;",
                        "height:" + this.h + "px' ",
                        "id='" + this.id + "' ",
                        "name='" + this.id + "' ",
                        "codebase='http://active.macromedia.com/flash2/cabs/swflash.cab#version=4,0,0,0'",
                    ">",
                        "<param name='wmode' value='transparent'>",
                        "<param name='quality' value='high'>",
                        "<param name='allowScriptAccess' value='always'>",
                        "<param name='swLiveConnect' value=false>",
                        "<param name='movie' value='" + this.src + "'>",
                        typeof this.getparas == "function" ? "<param name='FlashVars' value='" + this.getparas() + "'>" : '',
                    "</object>"
                ].join('');
            } else {
                html = [
                    "<embed style='display:block;' type='application/x-shockwave-flash' ",
                        "pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash' ",
                        "src='" + this.src + "' ",
                        "id='" + this.id + "' ",
                        "name='" + this.id + "' ",
                        "allowScriptAccess='always' ",
                        "quality='high' ",
                        "width='" + this.w + "' height='" + this.h + "' ",
                        "swLiveConnect='false' ",
                        "wmode='transparent' ",
                        typeof this.getparas == "function" ?  "FlashVars='" + this.getparas() + "'>" : "",
                    "</embed>"
                ].join('');
            }

            ('function' === typeof this.onAfterGetCode) && this.onAfterGetCode.call(this);

            return html;
        };
    AdSomeFlash.prototype.isloaded = function() {
            if (this.loaded) {
                return true;
            }

            var movie = document.getElementById(this.id);
            if ((!movie) || 'undefined' === typeof movie.PercentLoaded) {
                return false;
            }
            if (parseInt(movie.PercentLoaded()) == 100) {
                this.loaded = true;
                return true;
            }
        };
        AdSomeFlash.prototype.show = function() {
            var count = 100,
                THIS = this,
                movie = document.getElementById(this.id),
                timer;
            timer = window.setInterval(function() {
                if (THIS.isloaded() || count-- < 0) {
                    window.clearInterval(timer);
                    ('function' === typeof THIS.onAfterShow) && THIS.onAfterShow.call(THIS, movie)
                }
            }, 100);
        };
        AdSomeFlash.prototype.getParams = function() {
            var pars = [];
            if (this.clk) {
                pars.push("clickurl=" + escape(this.clk));
            }
            for (var key in this.paras) {
                pars.push(key + "=" + escape(this.paras[key]));
            }
            return pars.join('&');
        };
        AdSomeFlash.prototype.getMovie = function(id) {
            if (sinaads.core.browser.ie) {
                return document.getElementById(id);
            } else {
                var movies = document.getElementsByTagName("embed");
                for (var i = 0; i < movies.length; i++) {
                    if (movies[i].id === id) {
                        return movies[i];
                    }
                }
                return null;
            }
        };
        AdSomeFlash.prototype.stop = function() {
            try {
                this.getMovie(this.id).StopPlay();
            } catch(e) {

            }
        };
        AdSomeFlash.prototype.play = function() {
            try {
                this.getMovie(this.id).Play();
            } catch(e) {

            }
        };
        AdSomeFlash.prototype.replay = function() {
            var movie = this.getMovie(this.id);
            try {
                movie.GotoFrame(0);
                movie.Play();
            } catch(e) {

            }
        };


    window[sinaads_adsome_key] = {};

    var cyis1 = true;
    var cyis2 = false;

    window[sinaads_adsome_key].setis = function(val){
        cyis1 = val;
        cyis2 =! val;
    };
    window[sinaads_adsome_key].setis(_as_sts(sinaads_adsome_key) <= 2);
 
    window[sinaads_adsome_key].status = 0;

    window[sinaads_adsome_key].fc = function(cmd, args) {
        switch (cmd) {
            case "replay":
                window[sinaads_adsome_key].b1.show();
                window[sinaads_adsome_key].b2.hide();
                window[sinaads_adsome_key].status = 1;
                    break;
            case "closeBig":
                window[sinaads_adsome_key].b1.hide();
                window[sinaads_adsome_key].status = 0;
                break;
            case "close":
                window[sinaads_adsome_key].b1.destroy();
                window[sinaads_adsome_key].b2.destroy();
                window[sinaads_adsome_key].status = 0;
                break;
        }
    };

    window[sinaads_adsome_key].f1 = new AdSomeFlash({
        width: 1000,
        height: 450,
        srcUrl: "http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fc1715.swf",
        target: "_blank",
        clsbtn: 0,
        clickUrl: "http://sambaclk.adsame.com/c?z=samba&la=0&si=13&ci=1667&c=2749&or=2684&l=2980&bg=2894&b=2946&u=http://e.cn.miaozhen.com/r.gif?k=1006833&p=3yeYY0&ro=sm&vo=39d37f0ef&vr=2&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&o=http%3A%2F%2Fwww.yihaodian.com%3Ftracker_u%3D1014248562",
        selfName: "window[sinaads_adsome_key].f1",
        fscmdfc: window[sinaads_adsome_key].fc
    });
    window[sinaads_adsome_key].b1 = new AdSomeDivfl({
        width: 1000,
        height: 450,
        hAlign: "center",
        vAlign: "top",
        vPadding: 45,
        hPadding: 0,
        followScroll: 1,
        firstScreen: 0,
        flash: window[sinaads_adsome_key].f1,
        selfName: "window[sinaads_adsome_key].b1",
        autoClsSeconds: 10,
        autoclsfc: "window[sinaads_adsome_key].fc(\"closeBig\")",
        btnWidth: 77,
        btnHeight: 31,
        btns: [{
            url: "http://rm.sina.com.cn/bj_chuanyang/yhd20130701/close.jpg",
            fc: "window[sinaads_adsome_key].fc(\"closeBig\")"
        }],
        iniShow: cyis1
    });


    window[sinaads_adsome_key].b1.onAfterHide = function() {
            window[sinaads_adsome_key].b2.show();
    }

    window[sinaads_adsome_key].f2 = new AdSomeFlash({
        width: 25,
        height: 220,
        srcUrl: "http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fb1.swf",
        target: "_blank",
        repfc: "window[sinaads_adsome_key].fc(\"replay\")",
        clsfc: "window[sinaads_adsome_key].fc(\"close\")",
        clickUrl: "http://sambaclk.adsame.com/c?z=samba&la=0&si=13&ci=1667&c=2749&or=2684&l=2980&bg=2894&b=2946&u=http://e.cn.miaozhen.com/r.gif?k=1006833&p=3yeYY0&ro=sm&vo=39d37f0ef&vr=2&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&o=http%3A%2F%2Fwww.yihaodian.com%3Ftracker_u%3D1014248562",
        selfName: "window[sinaads_adsome_key].f2",
        fscmdfc: window[sinaads_adsome_key].fc
    });

    window[sinaads_adsome_key].b2 = new AdSomeDivfl({
        width: 25,
        height: 220,
        hAlign: "right",
        vAlign: "bottom",
        hPadding: 0,
        vPadding: 0,
        followScroll: 1,
        firstScreen: 0,
        alwaysShow: 0,
        flash: window[sinaads_adsome_key].f2,
        selfName: "window[sinaads_adsome_key].b2",
        iniShow: (cyis2 || 0)
    });


    window[sinaads_adsome_key].run = function() {
        if(window[sinaads_adsome_key].inited) {
            return;
        }
        window[sinaads_adsome_key].inited=true;

        var trackcode = "";
        var ifmcode = "";
        trackcode = "<img style=\'width:0px;height:0px;display:none\' src=\'http://samba.adsame.com/s?z=samba&c=2749&l=2980\' />";
        if (sinaads.core.browser.ie) {
            ifmcode = "<iframe frameborder=\'no\' border=\'0\' src=\'about:blank\' style=\'position:absolute; visibility:inherit; top:0px; left:0px; width:100%; height:100%; z-index:-1; filter=progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);\'></iframe>";
        }

        window[sinaads_adsome_key].b1.create(
            window[sinaads_adsome_key].f1.getHTML() + trackcode + ifmcode
        );
        window[sinaads_adsome_key].b1.show();

        window[sinaads_adsome_key].b2.create(
            window[sinaads_adsome_key].f2.getHTML() + ifmcode
        );
        window[sinaads_adsome_key].b2.show();

        window[sinaads_adsome_key].status = cyis1;


    };
    window[sinaads_adsome_key].run();
}
