//D
var getDoc = function(dom) {
    return 9 == dom.nodeType ? dom : dom.ownerDocument || dom.document;
};

//ic 
var getStyle = function(dom, name) {
    var doc,
        styles,
        style = '';

    doc = getDoc(dom);
    if (doc.defaultView 
            && doc.defaultView.getComputedStyle 
            && (styles = doc.defaultView.getComputedStyle(dom, null))
        ) {
        style = styles[name] || styles.getPropertyValue(name) || ""; 
    }
    return style 
            || (dom.currentStyle ? dom.currentStyle[name] : null) 
            || dom.style && dom.style[name];

};

//B
var Box = function(x, y) {
    this.x = void 0 !== x ? x: 0;
    this.y = void 0 !== y ? y: 0

};
Box.prototype.floor = function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
};
Box.prototype.round = function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
};

var hb = isFirefox;

var lc = function(dom) {
    var position, //b
        doc = getDoc(dom), //c
        pos = getStyle(dom, "position"), //d
        //火狐专用获取dom位置
        e = isFirefox 
            && doc.getBoxObjectFor 
            && !dom.getBoundingClientRect 
            && "absolute" == pos 
            && (position = doc.getBoxObjectFor(dom)) 
            && (0 > position.screenX || 0 > position.screenY), //e
        f = new Box(0, 0), //f
        g; //g

    b = doc ? getDoc(doc) : document;

    (g = !isIE) || (g = C && 9 <= isIE) || (g = "CSS1Compat" == yb(b).u.compatMode);
    g = g ? b.documentElement: b.body;
    if (a == g) {
        return f;
    }
    if (a.getBoundingClientRect) {
        b = jc(a);
        a = Bb(yb(c));
        f.x = b.left + a.x;
        f.y = b.top + a.y;
    } else if (c.getBoxObjectFor && !e) {
        b = c.getBoxObjectFor(a);
        a = c.getBoxObjectFor(g);
        f.x = b.screenX - a.screenX;
        f.y = b.screenY - a.screenY;
    } else {
        e = a;
        do {
            f.x += e.offsetLeft;
            f.y += e.offsetTop;
            e != a && (f.x += e.clientLeft || 0, f.y += e.clientTop || 0);
            if (ib && "fixed" == ic(e, "position")) {
                f.x += c.body.scrollLeft;
                f.y += c.body.scrollTop;
                break

            }
            e = e.offsetParent

        } while (e && e != a);
        if (gb || ib && "absolute" == d) {
            f.y -= c.body.offsetTop;
        }
        for (e = a; (e = kc(e)) && e != c.body && e != g;) {
            f.x -= e.scrollLeft;
            gb && "TR" == e.tagName || (f.y -= e.scrollTop)
        }
    }
    return f

};