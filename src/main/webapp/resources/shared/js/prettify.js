window.PR_SHOULD_USE_CONTINUATION = !0;
var prettyPrintOne, prettyPrint;
(function () {
    function A(e) {
        function a(e) {
            var t = e.charCodeAt(0);
            if (t !== 92)return t;
            var n = e.charAt(1);
            return t = u[n], t ? t : "0" <= n && n <= "7" ? parseInt(e.substring(1), 8) : n === "u" || n === "x" ? parseInt(e.substring(2), 16) : e.charCodeAt(1)
        }

        function f(e) {
            if (e < 32)return (e < 16 ? "\\x0" : "\\x") + e.toString(16);
            var t = String.fromCharCode(e);
            return t === "\\" || t === "-" || t === "]" || t === "^" ? "\\" + t : t
        }

        function l(e) {
            var t = e.substring(1, e.length - 1).match(new RegExp("\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]", "g")), n = [], r = t[0] === "^", i = ["["];
            r && i.push("^");
            for (var s = r ? 1 : 0, o = t.length; s < o; ++s) {
                var u = t[s];
                if (/\\[bdsw]/i.test(u))i.push(u); else {
                    var l = a(u), c;
                    s + 2 < o && "-" === t[s + 1] ? (c = a(t[s + 2]), s += 2) : c = l, n.push([l, c]), c < 65 || l > 122 || (c < 65 || l > 90 || n.push([Math.max(65, l) | 32, Math.min(c, 90) | 32]), c < 97 || l > 122 || n.push([Math.max(97, l) & -33, Math.min(c, 122) & -33]))
                }
            }
            n.sort(function (e, t) {
                return e[0] - t[0] || t[1] - e[1]
            });
            var h = [], p = [];
            for (var s = 0; s < n.length; ++s) {
                var d = n[s];
                d[0] <= p[1] + 1 ? p[1] = Math.max(p[1], d[1]) : h.push(p = d)
            }
            for (var s = 0; s < h.length; ++s) {
                var d = h[s];
                i.push(f(d[0])), d[1] > d[0] && (d[1] + 1 > d[0] && i.push("-"), i.push(f(d[1])))
            }
            return i.push("]"), i.join("")
        }

        function c(e) {
            var r = e.source.match(new RegExp("(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)", "g")), i = r.length, s = [];
            for (var o = 0, u = 0; o < i; ++o) {
                var a = r[o];
                if (a === "(")++u; else if ("\\" === a.charAt(0)) {
                    var c = +a.substring(1);
                    c && (c <= u ? s[c] = -1 : r[o] = f(c))
                }
            }
            for (var o = 1; o < s.length; ++o)-1 === s[o] && (s[o] = ++t);
            for (var o = 0, u = 0; o < i; ++o) {
                var a = r[o];
                if (a === "(")++u, s[u] || (r[o] = "(?:"); else if ("\\" === a.charAt(0)) {
                    var c = +a.substring(1);
                    c && c <= u && (r[o] = "\\" + s[c])
                }
            }
            for (var o = 0; o < i; ++o)"^" === r[o] && "^" !== r[o + 1] && (r[o] = "");
            if (e.ignoreCase && n)for (var o = 0; o < i; ++o) {
                var a = r[o], h = a.charAt(0);
                a.length >= 2 && h === "[" ? r[o] = l(a) : h !== "\\" && (r[o] = a.replace(/[a-zA-Z]/g, function (e) {
                    var t = e.charCodeAt(0);
                    return "[" + String.fromCharCode(t & -33, t | 32) + "]"
                }))
            }
            return r.join("")
        }

        var t = 0, n = !1, r = !1;
        for (var i = 0, s = e.length; i < s; ++i) {
            var o = e[i];
            if (o.ignoreCase)r = !0; else if (/[a-z]/i.test(o.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ""))) {
                n = !0, r = !1;
                break
            }
        }
        var u = {b: 8, t: 9, n: 10, v: 11, f: 12, r: 13}, h = [];
        for (var i = 0, s = e.length; i < s; ++i) {
            var o = e[i];
            if (o.global || o.multiline)throw new Error("" + o);
            h.push("(?:" + c(o) + ")")
        }
        return new RegExp(h.join("|"), r ? "gi" : "g")
    }

    function O(e, t) {
        function u(e) {
            switch (e.nodeType) {
                case 1:
                    if (n.test(e.className))return;
                    for (var a = e.firstChild; a; a = a.nextSibling)u(a);
                    var f = e.nodeName.toLowerCase();
                    if ("br" === f || "li" === f)r[o] = "\n", s[o << 1] = i++, s[o++ << 1 | 1] = e;
                    break;
                case 3:
                case 4:
                    var l = e.nodeValue;
                    l.length && (t ? l = l.replace(/\r\n?/g, "\n") : l = l.replace(/[ \t\r\n]+/g, " "), r[o] = l, s[o << 1] = i, i += l.length, s[o++ << 1 | 1] = e)
            }
        }

        var n = /(?:^|\s)nocode(?:\s|$)/, r = [], i = 0, s = [], o = 0;
        return u(e), {sourceCode: r.join("").replace(/\n$/, ""), spans: s}
    }

    function M(e, t, n, r) {
        if (!t)return;
        var i = {sourceCode: t, basePos: e};
        n(i), r.push.apply(r, i.decorations)
    }

    function D(e) {
        var t = undefined;
        for (var n = e.firstChild; n; n = n.nextSibling) {
            var r = n.nodeType;
            t = r === 1 ? t ? e : n : r === 3 ? _.test(n.nodeValue) ? e : t : t
        }
        return t === e ? undefined : t
    }

    function P(e, t) {
        var n = {}, r;
        (function () {
            var i = e.concat(t), s = [], o = {};
            for (var u = 0, a = i.length; u < a; ++u) {
                var f = i[u], l = f[3];
                if (l)for (var c = l.length; --c >= 0;)n[l.charAt(c)] = f;
                var h = f[1], p = "" + h;
                o.hasOwnProperty(p) || (s.push(h), o[p] = null)
            }
            s.push(/[\0-\uffff]/), r = A(s)
        })();
        var i = t.length, s = function (e) {
            var o = e.sourceCode, u = e.basePos, a = [u, E], f = 0, l = o.match(r) || [], c = {};
            for (var h = 0, p = l.length; h < p; ++h) {
                var d = l[h], v = c[d], m = void 0, g;
                if (typeof v == "string")g = !1; else {
                    var y = n[d.charAt(0)];
                    if (y)m = d.match(y[1]), v = y[0]; else {
                        for (var b = 0; b < i; ++b) {
                            y = t[b], m = d.match(y[1]);
                            if (m) {
                                v = y[0];
                                break
                            }
                        }
                        m || (v = E)
                    }
                    g = v.length >= 5 && "lang-" === v.substring(0, 5), g && (!m || typeof m[1] != "string") && (g = !1, v = T), g || (c[d] = v)
                }
                var w = f;
                f += d.length;
                if (!g)a.push(u + w, v); else {
                    var S = m[1], x = d.indexOf(S), N = x + S.length;
                    m[2] && (N = d.length - m[2].length, x = N - S.length);
                    var C = v.substring(5);
                    M(u + w, d.substring(0, x), s, a), M(u + w + x, S, R(C, S), a), M(u + w + N, d.substring(N), s, a)
                }
            }
            e.decorations = a
        };
        return s
    }

    function H(e) {
        var t = [], n = [];
        e.tripleQuotedStrings ? t.push([v, /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/, null, "'\""]) : e.multiLineStrings ? t.push([v, /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/, null, "'\"`"]) : t.push([v, /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/, null, "\"'"]), e.verbatimStrings && n.push([v, /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]);
        var r = e.hashComments;
        r && (e.cStyleComments ? (r > 1 ? t.push([g, /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, null, "#"]) : t.push([g, /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\r\n]*)/, null, "#"]), n.push([v, /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/, null])) : t.push([g, /^#[^\r\n]*/, null, "#"])), e.cStyleComments && (n.push([g, /^\/\/[^\r\n]*/, null]), n.push([g, /^\/\*[\s\S]*?(?:\*\/|$)/, null]));
        if (e.regexLiterals) {
            var i = "/(?=[^/*])(?:[^/\\x5B\\x5C]|\\x5C[\\s\\S]|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+/";
            n.push(["lang-regex", new RegExp("^" + L + "(" + i + ")")])
        }
        var s = e.types;
        s && n.push([y, s]);
        var o = ("" + e.keywords).replace(/^ | $/g, "");
        return o.length && n.push([m, new RegExp("^(?:" + o.replace(/[\s,]+/g, "|") + ")\\b"), null]), t.push([E, /^\s+/, null, " \r\n	\u00a0"]), n.push([b, /^@[a-z_$][a-z_$@0-9]*/i, null], [y, /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null], [E, /^[a-z_$][a-z_$@0-9]*/i, null], [b, new RegExp("^(?:0x[a-f0-9]+|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)(?:e[+\\-]?\\d+)?)[a-z]*", "i"), null, "0123456789"], [E, /^\\[\s\S]?/, null], [w, /^.[^\s\w\.$@\'\"\`\/\#\\]*/, null]), P(t, n)
    }

    function j(e, t, n) {
        function a(e) {
            switch (e.nodeType) {
                case 1:
                    if (r.test(e.className))break;
                    if ("br" === e.nodeName)f(e), e.parentNode && e.parentNode.removeChild(e); else for (var t = e.firstChild; t; t = t.nextSibling)a(t);
                    break;
                case 3:
                case 4:
                    if (n) {
                        var o = e.nodeValue, u = o.match(i);
                        if (u) {
                            var l = o.substring(0, u.index);
                            e.nodeValue = l;
                            var c = o.substring(u.index + u[0].length);
                            if (c) {
                                var h = e.parentNode;
                                h.insertBefore(s.createTextNode(c), e.nextSibling)
                            }
                            f(e), l || e.parentNode.removeChild(e)
                        }
                    }
            }
        }

        function f(e) {
            function t(e, n) {
                var r = n ? e.cloneNode(!1) : e, i = e.parentNode;
                if (i) {
                    var s = t(i, 1), o = e.nextSibling;
                    s.appendChild(r);
                    for (var u = o; u; u = o)o = u.nextSibling, s.appendChild(u)
                }
                return r
            }

            while (!e.nextSibling) {
                e = e.parentNode;
                if (!e)return
            }
            var n = t(e.nextSibling, 0);
            for (var r; (r = n.parentNode) && r.nodeType === 1;)n = r;
            u.push(n)
        }

        var r = /(?:^|\s)nocode(?:\s|$)/, i = /\r\n?|\n/, s = e.ownerDocument, o = s.createElement("li");
        while (e.firstChild)o.appendChild(e.firstChild);
        var u = [o];
        for (var l = 0; l < u.length; ++l)a(u[l]);
        t === (t | 0) && u[0].setAttribute("value", t);
        var c = s.createElement("ol");
        c.className = "linenums";
        var h = Math.max(0, t - 1 | 0) || 0;
        for (var l = 0, p = u.length; l < p; ++l)o = u[l], o.className = "L" + (l + h) % 10, o.firstChild || o.appendChild(s.createTextNode("\u00a0")), c.appendChild(o);
        e.appendChild(c)
    }

    function F(e) {
        var t = /\bMSIE\s(\d+)/.exec(navigator.userAgent);
        t = t && +t[1] <= 8;
        var n = /\n/g, r = e.sourceCode, i = r.length, s = 0, o = e.spans, u = o.length, a = 0, f = e.decorations, l = f.length, c = 0;
        f[l] = i;
        var h, p;
        for (p = h = 0; p < l;)f[p] !== f[p + 2] ? (f[h++] = f[p++], f[h++] = f[p++]) : p += 2;
        l = h;
        for (p = h = 0; p < l;) {
            var d = f[p], v = f[p + 1], m = p + 2;
            while (m + 2 <= l && f[m + 1] === v)m += 2;
            f[h++] = d, f[h++] = v, p = m
        }
        l = f.length = h;
        var g = e.sourceNode, y;
        g && (y = g.style.display, g.style.display = "none");
        try {
            var b = null;
            while (a < u) {
                var w = o[a], E = o[a + 2] || i, S = f[c + 2] || i, m = Math.min(E, S), x = o[a + 1], T;
                if (x.nodeType !== 1 && (T = r.substring(s, m))) {
                    t && (T = T.replace(n, "\r")), x.nodeValue = T;
                    var N = x.ownerDocument, C = N.createElement("span");
                    C.className = f[c + 1];
                    var k = x.parentNode;
                    k.replaceChild(C, x), C.appendChild(x), s < E && (o[a + 1] = x = N.createTextNode(r.substring(m, E)), k.insertBefore(x, C.nextSibling))
                }
                s = m, s >= E && (a += 2), s >= S && (c += 2)
            }
        } finally {
            g && (g.style.display = y)
        }
    }

    function q(t, n) {
        for (var r = n.length; --r >= 0;) {
            var i = n[r];
            I.hasOwnProperty(i) ? e.console && console.warn("cannot override language handler %s", i) : I[i] = t
        }
    }

    function R(e, t) {
        if (!e || !I.hasOwnProperty(e))e = /^\s*</.test(t) ? "default-markup" : "default-code";
        return I[e]
    }

    function U(t) {
        var n = t.langExtension;
        try {
            var r = O(t.sourceNode, t.pre), i = r.sourceCode;
            t.sourceCode = i, t.spans = r.spans, t.basePos = 0, R(n, i)(t), F(t)
        } catch (s) {
            e.console && console.log(s && s.stack ? s.stack : s)
        }
    }

    function z(e, t, n) {
        var r = document.createElement("pre");
        r.innerHTML = e, n && j(r, n, !0);
        var i = {langExtension: t, numberLines: n, sourceNode: r, pre: 1};
        return U(i), r.innerHTML
    }

    function W(t) {
        function n(e) {
            return document.getElementsByTagName(e)
        }

        function g() {
            var n = e.PR_SHOULD_USE_CONTINUATION ? a.now() + 250 : Infinity;
            for (; f < i.length && a.now() < n; f++) {
                var r = i[f], s = r.className;
                if (h.test(s) && !p.test(s)) {
                    var o = !1;
                    for (var u = r.parentNode; u; u = u.parentNode) {
                        var y = u.tagName;
                        if (m.test(y) && u.className && h.test(u.className)) {
                            o = !0;
                            break
                        }
                    }
                    if (!o) {
                        r.className += " prettyprinted";
                        var b = s.match(c), w;
                        !b && (w = D(r)) && v.test(w.tagName) && (b = w.className.match(c)), b && (b = b[1]);
                        var E;
                        if (d.test(r.tagName))E = 1; else {
                            var S = r.currentStyle, x = S ? S.whiteSpace : document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(r, null).getPropertyValue("white-space") : 0;
                            E = x && "pre" === x.substring(0, 3)
                        }
                        var T = r.className.match(/\blinenums\b(?::(\d+))?/);
                        T = T ? T[1] && T[1].length ? +T[1] : !0 : !1, T && j(r, T, E), l = {
                            langExtension: b,
                            sourceNode: r,
                            numberLines: T,
                            pre: E
                        }, U(l)
                    }
                }
            }
            f < i.length ? setTimeout(g, 250) : t && t()
        }

        var r = [n("pre"), n("code"), n("xmp")], i = [];
        for (var s = 0; s < r.length; ++s)for (var o = 0, u = r[s].length; o < u; ++o)i.push(r[s][o]);
        r = null;
        var a = Date;
        a.now || (a = {
            now: function () {
                return +(new Date)
            }
        });
        var f = 0, l, c = /\blang(?:uage)?-([\w.]+)(?!\S)/, h = /\bprettyprint\b/, p = /\bprettyprinted\b/, d = /pre|xmp/i, v = /^code$/i, m = /^(?:pre|code|xmp)$/i;
        g()
    }

    var e = window, t = ["break,continue,do,else,for,if,return,while"], n = [t, "auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"], r = [n, "catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"], i = [r, "alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"], s = [r, "abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient"], o = [s, "as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,let,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var,virtual,where"], u = "all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes", a = [r, "debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"], f = "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END", l = [t, "and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"], c = [t, "alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"], h = [t, "case,done,elif,esac,eval,fi,function,in,local,set,then,until"], p = [i, o, a, f + l, c, h], d = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/, v = "str", m = "kwd", g = "com", y = "typ", b = "lit", w = "pun", E = "pln", S = "tag", x = "dec", T = "src", N = "atn", C = "atv", k = "nocode", L = "(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*", _ = /\S/, B = H({
        keywords: p,
        hashComments: !0,
        cStyleComments: !0,
        multiLineStrings: !0,
        regexLiterals: !0
    }), I = {};
    q(B, ["default-code"]), q(P([], [[E, /^[^<?]+/], [x, /^<!\w[^>]*(?:>|$)/], [g, /^<\!--[\s\S]*?(?:-\->|$)/], ["lang-", /^<\?([\s\S]+?)(?:\?>|$)/], ["lang-", /^<%([\s\S]+?)(?:%>|$)/], [w, /^(?:<[%?]|[%?]>)/], ["lang-", /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i], ["lang-js", /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i], ["lang-css", /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i], ["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]]), ["default-markup", "htm", "html", "mxml", "xhtml", "xml", "xsl"]), q(P([[E, /^[\s]+/, null, " 	\r\n"], [C, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, "\"'"]], [[S, /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i], [N, /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i], ["lang-uq.val", /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/], [w, /^[=<>\/]+/], ["lang-js", /^on\w+\s*=\s*\"([^\"]+)\"/i], ["lang-js", /^on\w+\s*=\s*\'([^\']+)\'/i], ["lang-js", /^on\w+\s*=\s*([^\"\'>\s]+)/i], ["lang-css", /^style\s*=\s*\"([^\"]+)\"/i], ["lang-css", /^style\s*=\s*\'([^\']+)\'/i], ["lang-css", /^style\s*=\s*([^\"\'>\s]+)/i]]), ["in.tag"]), q(P([], [[C, /^[\s\S]+/]]), ["uq.val"]), q(H({
        keywords: i,
        hashComments: !0,
        cStyleComments: !0,
        types: d
    }), ["c", "cc", "cpp", "cxx", "cyc", "m"]), q(H({keywords: "null,true,false"}), ["json"]), q(H({
        keywords: o,
        hashComments: !0,
        cStyleComments: !0,
        verbatimStrings: !0,
        types: d
    }), ["cs"]), q(H({keywords: s, cStyleComments: !0}), ["java"]), q(H({
        keywords: h,
        hashComments: !0,
        multiLineStrings: !0
    }), ["bsh", "csh", "sh"]), q(H({
        keywords: l,
        hashComments: !0,
        multiLineStrings: !0,
        tripleQuotedStrings: !0
    }), ["cv", "py"]), q(H({
        keywords: f,
        hashComments: !0,
        multiLineStrings: !0,
        regexLiterals: !0
    }), ["perl", "pl", "pm"]), q(H({
        keywords: c,
        hashComments: !0,
        multiLineStrings: !0,
        regexLiterals: !0
    }), ["rb"]), q(H({keywords: a, cStyleComments: !0, regexLiterals: !0}), ["js"]), q(H({
        keywords: u,
        hashComments: 3,
        cStyleComments: !0,
        multilineStrings: !0,
        tripleQuotedStrings: !0,
        regexLiterals: !0
    }), ["coffee"]), q(P([], [[v, /^[\s\S]+/]]), ["regex"]);
    var X = e.PR = {
        createSimpleLexer: P,
        registerLangHandler: q,
        sourceDecorator: H,
        PR_ATTRIB_NAME: N,
        PR_ATTRIB_VALUE: C,
        PR_COMMENT: g,
        PR_DECLARATION: x,
        PR_KEYWORD: m,
        PR_LITERAL: b,
        PR_NOCODE: k,
        PR_PLAIN: E,
        PR_PUNCTUATION: w,
        PR_SOURCE: T,
        PR_STRING: v,
        PR_TAG: S,
        PR_TYPE: y,
        prettyPrintOne: e.prettyPrintOne = z,
        prettyPrint: e.prettyPrint = W
    };
    typeof define == "function" && define.amd && define("google-code-prettify", [], function () {
        return X
    })
})()
