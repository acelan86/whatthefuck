sinaads.stream = function (config) {
        this.mainSrc = config.main.src || '';
        this.mainLink = config.main.link || '';
        this.miniSrc = config.mini.src || '';
        this.miniLink = config.mini.link || '';

        this.main = document.createElement('div');
        this.main.style.cssText = 'position:absolute;width'
        document.body.insertBefore(this.main, document.body.firstChild)
    }

    sinaads.stream.prototype = {
        createMain : function () {

        }
        render : function () {

        }
    }


    var data = window.sinaads_ad_data,
        config = {
            main : {
                src : data.content.src[0],
                link : data.content.link[0]]
            },
            left : {
                src : data.content.src[1]],
                link : data.content.link[1] || data.content.link[0]
            },
            right : {
                src : data.content.src[2] || data.content.src[1],
                src : data.content.link[2] || data.content.link[1] || data.content.link[0]
            }
        };

    if (window.top === window.self) {
        stream(config, window, window.document);
    } else {
        try {
            stream(config, window.top, window.top.document);
        } catch (e) {
            alert(e.message);
        }
    }

    function stream(config, window, document) {
        var docBody = core.browser.isStrict ? document.documentElement : document.body;
        //sinaads.core.cookie.get(name);
        var _as_getcv = core.cookie.get;
        //sinaads.core.cookie.set(key, value, options)
        var _as_setcv = function (key, value, expires, path, domain, secure) {
            core.cookie.set(key, value, {
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

        function setStyle(dom, styles) {
            dom.style.cssText += ';' + styles;
        }
        function getScrollTop() {
            return docBody.scrollTop;
        }
        //_as_getbsl
        function getScrollLeft() {
            return docBody.scrollLeft;
        }
        function extend(A, F, E) {
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
        }

        function StreamContainer(config) {
            this.config = config;
            this.id = config.id || SINAADS_AD_TYPE + 'Container';
            this.width = config.width || 100;
            this.height = config.height || 100;
            this.vAlign = config.vAlign || "top";
            this.hAlign = config.hAlign || "left";
            this.vPadding = config.vPadding || 0;
            this.hPadding = config.hPadding || 0;
            this.zIndex = config.zIndex || 10002;
            this.minTop = config.minTop || 0;
            this.followScroll = config.followScroll || true;
            this.firstScreen = config.firstScreen || true;
            this.spanId = config.spanId || SINAADS_AD_TYPE + 'Span';
            this.name = config.selfName || 'c';
            this.handle = null;
            this.left = this.top = 0;
            this.flag = -1;
            this.first = true;
            this._l = -1;
            this.position = this.followScroll && core.browser.isSupportFixed ? 'fixed' : 'absolute';


            docBody.appendChild(createDom('span', {id : this.spanId}, ''));

            if ('function' === typeof this.onAfterInit) {
                this.onAfterInit.call(this);
            }
        }

        StreamContainer.prototype.getTop = function () {
            switch (this.vAlign) {
                case "center":
                    var top = Math.round((docBody.clientHeight - this.height) / 2 + this.vPadding),
                        _top = docBody.clientHeight - this.height;
                    return top < 0 ? 0 : Math.min(top, _top);
                case "top":
                    if (this.vPadding < 1) {
                        return Math.round(docBody.clientHeight * this.vPadding);
                    }
                    return this.vPadding;
                case "bottom":
                    var bottom = Math.max(docBody.scrollHeight - this.height, docBody.clientHeight),
                        _bottom = docBody.clientHeight - this.height - this.vPadding;
                    return Math.min(bottom, _bottom);
                default:
                    return 0;    
            }
        };

        StreamContainer.prototype.getLeft = function() {
            switch (this.hAlign) {
                case "center":
                    var left = Math.round((width - this.width) / 2 + this.hPadding);
                        _left = docBody.clientWidth - this.width;
                    return left < 0 ? 0 : Math.min(left, _left);
                case "left":
                    if (this.hPadding < 1) {
                        return Math.round(docBody.clientWidth * this.hPadding);
                    }
                    return this.hPadding;
                case "right":
                    var right = Math.max(docBody.scrollWidth - this.width, docBody.clientWidth),
                        _right = docBody.clientWidth - this.width - this.hPadding;
                    return Math.min(right, _right);
                default:
                    return 0;
            }
        };

        StreamContainer.prototype.getScrollTop = function() {
            return !this.followScroll && this.firstScreen ? 0 : getScrollTop;
        };

        StreamContainer.prototype.setPosition = function (doloop) {
                var _v_one = false,
                    _h_one = false,
                    style = this.handle.style,
                    top,
                    scrollTop,
                    scrollLeft;

                style.top = "auto";
                style.left = "auto";
                style.right = "auto";
                style.bottom = "auto";

                if (this.position == 'fixed') {
                    if (this.vAlign == 'top' && this.vPadding >= 0) {
                        if (this.minTop > 0) {
                            var scrollTop = getScrollTop(),
                            top = scrollTop + this.vPadding;
                            style.top = (top < this.minTop ? this.minTop - scrollTop : this.vPadding) + "px";
                        } else {
                            style.top = this.vPadding + "px";
                            _v_one = true;
                        }
                    } else if (this.vAlign == 'bottom' && this.vPadding >= 0) {
                        if (this.minTop > 0) {
                            top = this.getTop(),
                            scrollTop = getScrollTop();
                            style.top = ((top + scrollTop) < this.minTop ? this.minTop - scrollTop : top) + "px";
                        } else {
                            style.bottom = this.vPadding + "px";
                            _v_one = true;
                        }
                    } else {
                        top = this.getTop(),
                        scrollTop = getScrollTop();
                        style.top = ((scrollTop + top) < this.minTop ? this.minTop - scrollTop : top) + "px";
                    }

                    if ((this.hAlign == 'left' || this.hA == 'right') && (this.hPadding >= 1 || this.hPadding == 0)) {
                        style[this.hAlign] = this.hPadding + 'px';
                        _h_one = true;
                    } else {
                        style.left = this.getLeft() + "px";
                    }
                } else {
                    if ((this.vAlign == 'top' || this.vAlign == 'bottom') && (this.vPadding >= 1 || this.vPadding == 0) && (!this.followScroll)) {
                        if (this.firstScreen) {
                            style[this.vAlign] = this.vPadding + 'px';
                        } else {
                            style.top = (getScrollTop() + this.getTop()) + "px";
                        }
                        _v_one = true;
                    } else {
                        top = getScrollTop() + this.getTop();
                        style.top = (top < this.minTop ? this.minTop: top) + "px";
                    }
                    if ((this.hAlign == "left" || this.hAlign == "right") && (this.hPadding >= 1 || this.hPadding == 0) && (!this.followScroll)) {
                        style[this.hAlign] = this.hPadding + "px";
                        _h_one = true;
                    } else {
                        style.left = (getScrollLeft() + this.getLeft()) + "px";
                    }
                }
                if (doloop && ((!_h_one) || (!_v_one))) {
                    var obj = this,
                        timer = null;
                    if (this.position == "fixed") {
                        timer = window.setInterval(function () {
                            if (obj.flag <= 0) return;
                            if (obj.handle !== -1) {
                                if (!_h_one) {
                                    style.left = obj.getLeft() + "px";
                                }
                                if (!_v_one) {
                                    top = obj.getTop();
                                    scrollTop = getScrollTop();
                                    style.top = ((scrollTop + top) < obj.minTop ? obj.minTop - scrollTop : top) + "px";
                                }
                            } else {
                                window.clearInterval(timer);
                            }
                        }, 100);
                    } else {
                        timer = window.setInterval(function () {
                            if (obj.flag <= 0) {
                                return;
                            }
                            if (obj.handle != -1) {
                                var scrollLeft = 0,
                                    scrollTop = 0;
                                if (obj.followScroll) {
                                    scrollLeft = getScrollLeft();
                                    scrollTop = getScrollTop();
                                }
                                if (!_h_one) {
                                    style.left = (scrollLeft + obj.getLeft()) + "px";
                                }
                                if (!_v_one) {
                                    top = scrollTop + obj.getTop();
                                    style.top = (top < obj.minTop ? obj.minTop : top) + "px";
                                }
                            } else {
                                window.clearInterval(timer);
                            }
                        }, 100);
                    }
                }
            };
            StreamContainer.prototype.create = function (content) {
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
                        "style='position:" + this.position + ";",
                        "z-index:" + this.zIndex + ";",
                        "top:-" + this.height + "px;",
                        "left:-" + this.width + "px;",
                        "width:1px;height:1px;",
                        "overflow:hidden;",
                    "'>",
                        content,
                        'function' === typeof this.getHTML ? this.getHTML() : '',
                    '</div>'
                ];

                document.getElementById(this.spanId).innerHTML = html.join('');

                this.flag = 0;
                this.handle = document.getElementById(this.id);

                if ('function' === typeof this.onAfterCreate) {
                    if (this.onAfterCreate.call(this) === false) {
                        this.destroy();
                        return false
                    }
                }
                return this.handle;
            };


            StreamContainer.prototype.show = function() {
                var timer;

                if (!this.first) {
                    this.showsmp();
                    this.first = false;
                    return;
                }
                if ('function' === typeof this.onBeforeShow) {
                    if (this.onBeforeShow.call(this) === false) {
                        return false;
                    }
                }

                if (this.flag > 0) {
                    return;
                }

                var THIS = this,
                    style = this.handle.style;

                function _show() {
                    THIS.setPosition();
                    style.width = THIS.width + "px";
                    style.height = THIS.height + "px";
                    style.display = "block";
                    THIS.flag = 1;
                    if ('function' === typeof THIS.onAfterShow) {
                        if (THIS.onAfterShow.call(THIS) === false) {
                            return false;
                        }
                    }
                    THIS.setPosition(true);
                }

                if (this.flag >= 0) {
                    _show();
                } else {
                    timer = window.setInterval(function() {
                        if (!THIS.flag < 0) {
                            return;
                        }
                        window.clearInterval(timer);
                        _show();
                    }, 500);
                }
            };

            StreamContainer.prototype.showsmp = function() {
                var style = this.handle.style;
                if ('function' === typeof this.onBeforeShow) {
                    if (this.onBeforeShow.call(this) === false) {
                        return false;
                    }
                }
                if (this.flag > 0) {
                    return;
                }
                style.width = this.width + "px";
                style.height = this.height + "px";
                style.left = this._l + "px";

                if (!this.firstScreen) {
                    this.setPosition();
                }
                this.flag = 1;
                if ('function' === typeof this.onAfterShow) {
                    this.onAfterShow.call(this);
                }
            };

            StreamContainer.prototype.hide = function() {
                if ('function' === typeof this.onBeforeHide) {
                    if (this.onBeforeHide.call(this) === false) {
                        return false;
                    }
                }
                if (this.flag == 1) {
                    this.handle.style.width = "1px";
                    this.handle.style.height = "1px";
                    this._l = this.handle.style.left;
                    this.handle.style.left = "-" + this.width + "px";
                    this.flag = 0;
                    if ('function' === typeof this.onAfterHide) {
                        this.onAfterHide.call(this);
                    }
                }
            };

            StreamContainer.prototype.destroy = function() {
                var style = this.handle.style;
                if ('function' === typeof this.onBeforeDestroy) {
                    if (this.onBeforeDestroy.call(this) === false) {
                        return false;
                    }
                }
                if (this.flag >= 0) {
                    this.handle.parentNode.removeChild(this.handle);
                    this.handle = -1;
                    this.flag = -1;
                    if ('function' === typeof this.onAfterDestroy) {
                        this.onAfterDestroy.call(this);
                    }
                }
            };
        

        function StreamMini(config) {
            this.initShow = config.initShow || true;
            this.alwaysShow = config.alwaysShow || false;
            this.autoClsSeconds = config.autoClsSeconds || -1;
            this.autoClsfc = config.autoclsfc || null; 
            if (config.btns) {
                this.btnWidth = config.btnWidth || 0;
                this.btnHeight = config.btnHeight || 0;
                this.btnAlign = config.btnAlign || "right";
                var btn = this.bth;
                if (btn <= 0 && config.btns.length > 0) {
                    for (var i = 0; i < config.btns.length; i++) {
                        if (config.btns[i].height > btn) {
                            btn = config.btns[i].height;
                        }
                    }
                }
            }
            StreamContainerBtn.superclass.constructor.call(this, config);
            
            if (btn > 0) {
                this.height += btn;
            }
            this.isInited = true;
            this.clshd = null;
        }

        extend(StreamMini, StreamMain, {
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

        function StreamFlash(config) {
            this.config = config;
            this.id = config.id || SINAADS_AD_TYPE + 'Flash';
            this.name = config.selfName || "f";
            this.width = config.width || 100;
            this.height = config.height || 100;
            this.src = config.src || "";
            this.link = config.link || "";
            this.fscmd = config.fscmdfc || false;
            this.expandDirect = config.expandDirect || "left"; //展开方向
            this.params = config.params || {};
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


        StreamFlash.prototype.getHTML = function () {
            var html = core.swf.createHTML({
                width : this.width,
                height : this.height,
                id : this.id,
                wmode : 'transparent',
                quality : 'high',
                allowScriptAccess : 'always',
                swLiveConnect : false,
                movie : this.src,
                flashVars : 'function' === typeof this.getParams ? this.getParams() : ''
            });

                // if (core.browser.ie) {
                //     html = [
                //         "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' ", 
                //             "style='z-index:1; display:block;",
                //             this.exdir == "right" ? "position:absolute;right:0px;float:right;" : '',
                //             "width:" + this.w + "px;",
                //             "height:" + this.h + "px' ",
                //             "id='" + this.id + "' ",
                //             "name='" + this.id + "' ",
                //             "codebase='http://active.macromedia.com/flash2/cabs/swflash.cab#version=4,0,0,0'",
                //         ">",
                //             "<param name='wmode' value='transparent'>",
                //             "<param name='quality' value='high'>",
                //             "<param name='allowScriptAccess' value='always'>",
                //             "<param name='swLiveConnect' value=false>",
                //             "<param name='movie' value='" + this.src + "'>",
                //             typeof this.getparas == "function" ? "<param name='FlashVars' value='" + this.getparas() + "'>" : '',
                //         "</object>"
                //     ].join('');
                // } else {
                //     html = [
                //         "<embed style='display:block;' type='application/x-shockwave-flash' ",
                //             "pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash' ",
                //             "src='" + this.src + "' ",
                //             "id='" + this.id + "' ",
                //             "name='" + this.id + "' ",
                //             "allowScriptAccess='always' ",
                //             "quality='high' ",
                //             "width='" + this.w + "' height='" + this.h + "' ",
                //             "swLiveConnect='false' ",
                //             "wmode='transparent' ",
                //             typeof this.getparas == "function" ?  "FlashVars='" + this.getparas() + "'>" : "",
                //         "</embed>"
                //     ].join('');
                // }

            ('function' === typeof this.onAfterGetCode) && this.onAfterGetCode.call(this);
            return html;
        };
        StreamFlash.prototype.getMovie = function () {
            return core.swf.getMovie(this.id, window);
        };
        StreamFlash.prototype.isLoaded = function() {
            if (this.loaded) {
                return true;
            }

            var movie = this.getMovie();
            if ((!movie) || 'undefined' === typeof movie.PercentLoaded) {
                return false;
            }
            if (parseInt(movie.PercentLoaded()) >== 100) {
                this.loaded = true;
                return true;
            }
        };
        StreamFlash.prototype.show = function () {
            var count = 100,
                THIS = this,
                movie = this.getMovie(),
                timer;
            timer = window.setInterval(function () {
                if (THIS.isLoaded() || count-- < 0) {
                    window.clearInterval(timer);
                    ('function' === typeof THIS.onAfterShow) && THIS.onAfterShow.call(THIS, movie)
                }
            }, 100);
        };
        StreamFlash.prototype.getParams = function () {
            var pars = [];
            if (this.link) {
                pars.push("clickurl=" + escape(this.link));
            }
            for (var key in this.params) {
                pars.push(key + "=" + escape(this.params[key]));
            }
            return pars.join('&');
        };
        StreamFlash.prototype.stop = function() {
            try {
                this.getMovie().StopPlay();
            } catch(e) {}
        };
        StreamFlash.prototype.play = function() {
            try {
                this.getMovie().Play();
            } catch(e) {

            }
        };
        StreamFlash.prototype.replay = function() {
            var movie = this.getMovie();
            try {
                movie.GotoFrame(0);
                movie.Play();
            } catch(e) {

            }
        };





        window[SINAADS_AD_TYPE] = {
            status : core.cookie.get(SINAADS_AD_TYPE) <= 2 ? 1 : 0,
            main : new StreamMain({
                width: 1000,
                height: 450,
                hAlign: "center",
                vAlign: "top",
                vPadding: 45,
                hPadding: 0,
                followScroll: 1,
                firstScreen: 0,
                flash: new StreamFlash({
                    width: 1000,
                    height: 450,
                    srcUrl: "http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fc1715.swf",
                    target: "_blank",
                    clsbtn: 0,
                    clickUrl: "http://sambaclk.adsame.com/c?z=samba&la=0&si=13&ci=1667&c=2749&or=2684&l=2980&bg=2894&b=2946&u=http://e.cn.miaozhen.com/r.gif?k=1006833&p=3yeYY0&ro=sm&vo=39d37f0ef&vr=2&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&o=http%3A%2F%2Fwww.yihaodian.com%3Ftracker_u%3D1014248562",
                    selfName: "window[sinaads_adsome_key].f1",
                    fscmdfc: window[SINAADS_AD_TYPE].exec
                }),
                selfName: "window[sinaads_adsome_key].main",
                autoClsSeconds: 10,
                autoclsfc: "window[sinaads_adsome_key].fc(\"closeBig\")",
                btnWidth: 77,
                btnHeight: 31,
                btns: [{
                    url: "http://rm.sina.com.cn/bj_chuanyang/yhd20130701/close.jpg",
                    fc: "window[sinaads_adsome_key].fc(\"closeBig\")"
                }],
                iniShow: window[SINAADS_AD_TYPE].status
            }),
            mini : new StreamMini({
                width: 25,
                height: 220,
                hAlign: "right",
                vAlign: "bottom",
                hPadding: 0,
                vPadding: 0,
                followScroll: 1,
                firstScreen: 0,
                alwaysShow: 0,
                flash : new StreamFlash({
                    width: 25,
                    height: 220,
                    srcUrl: "http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fb1.swf",
                    target: "_blank",
                    repfc: "window[sinaads_adsome_key].exec(\"replay\")",
                    clsfc: "window[sinaads_adsome_key].ecec(\"close\")",
                    clickUrl: "http://sambaclk.adsame.com/c?z=samba&la=0&si=13&ci=1667&c=2749&or=2684&l=2980&bg=2894&b=2946&u=http://e.cn.miaozhen.com/r.gif?k=1006833&p=3yeYY0&ro=sm&vo=39d37f0ef&vr=2&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&o=http%3A%2F%2Fwww.yihaodian.com%3Ftracker_u%3D1014248562",
                    selfName: "window[sinaads_adsome_key].f2",
                    fscmdfc: window[sinaads_adsome_key].exec
                }),
                selfName: "window[sinaads_adsome_key].b2",
                iniShow: !widnow[SINAADS_AD_TYPE].status
            }),
            exec : function (cmd, args) {
                switch (cmd) {
                    case 'replay' : 
                        window[SINAADS_AD_TYPE].main.show();
                        window[SINAADS_AD_TYPE].mini.hide();
                        window[SINAADS_AD_TYPE].status = 1;
                        break;
                    case 'closeMain' : 
                        window[SINAADS_AD_TYPE].main.hide();
                        window[SINAADS_AD_TYPE].status = 0;
                        break;
                    case 'close' : 
                        window[SINAADS_AD_TYPE].main.destroy();
                        window[SINAADS_AD_TYPE].mini.destroy();
                        window[SINAADS_AD_TYPE].status = 0;
                        break;
                    default :
                        break;
                }
            },
            init : function () {
                if (window[SINAADS_AD_TYPE].inited) {
                    return;
                }

                window[SINAADS_AD_TYPE].inited = true;
                window[SINAADS_AD_TYPE].main.show();
                window[SINAADS_AD_TYPE].mini.show();


                //跟踪代码，现在还在用么？
                // var trackcode = "";
                // var ifmcode = "";
                // trackcode = "<img style=\'width:0px;height:0px;display:none\' src=\'http://samba.adsame.com/s?z=samba&c=2749&l=2980\' />";
                // if (sinaads.core.browser.ie) {
                //     ifmcode = "<iframe frameborder=\'no\' border=\'0\' src=\'about:blank\' style=\'position:absolute; visibility:inherit; top:0px; left:0px; width:100%; height:100%; z-index:-1; filter=progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);\'></iframe>";
                // }

                window[sinaads_adsome_key].b1.create(
                    window[sinaads_adsome_key].f1.getHTML() + trackcode + ifmcode
                );
                window[sinaads_adsome_key].b1.show();

                window[sinaads_adsome_key].b2.create(
                    window[sinaads_adsome_key].f2.getHTML() + ifmcode
                );
                window[sinaads_adsome_key].b2.show();
            }
        };
        /* 初始化 */
        window[SINAADS_AD_TYPE].init();

        window[SINAADS_AD_TYPE].main.onAfterHide = function() {
            window[SINAADS_AD_TYPE].mini.show();
        }
    }