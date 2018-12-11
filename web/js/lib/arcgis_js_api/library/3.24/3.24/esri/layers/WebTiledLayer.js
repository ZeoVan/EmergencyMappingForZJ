define("esri/layers/WebTiledLayer", "dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/url dojo/sniff dojo/string ../config ../kernel ../request ../urlUtils ../SpatialReference ../geometry/Extent ./TiledMapServiceLayer ./TileInfo".split(" "), function (f, h, k, u, p, q, v, w, x, l, m, r, y, z) {
    function A(c, a) {
        var b = [],
            d, e;
        if (c && a && (a.customLayerParameters || a.customParameters)) {
            d = h.clone(a.customParameters || {});
            h.mixin(d, a.customLayerParameters || {});
            e = l.urlToObject(c);
            for (var g in e.query) d.hasOwnProperty(g) || b.push(g + "\x3d" + e.query[g]);
            c = e.path + (b.length ? "?" + b.join("\x26") : "")
        }
        return c
    }
    f = f(y, {
        declaredClass: "esri.layers.WebTiledLayer",
        constructor: function (c, a) {
            debugger
            a || (a = {});
            this.urlTemplate = c = A(c, a.wmtsInfo);
            var b = new r(-2.0037508342787E7, -2.003750834278E7, 2.003750834278E7, 2.0037508342787E7, new m({
                    wkid: 102100
                })),
                d = new r(-2.0037508342787E7, -2.003750834278E7, 2.003750834278E7, 2.0037508342787E7, new m({
                    wkid: 102100
                }));
            this.initialExtent = a.initialExtent || b;
            this.fullExtent = a.fullExtent || d;
            this.tileInfo = a.tileInfo ? a.tileInfo : new z({
                dpi: 96,
                rows: 256,
                cols: 256,
                origin: {
                    x: -2.0037508342787E7,
                    y: 2.0037508342787E7
                },
                spatialReference: {
                    wkid: 102100
                },
                lods: [{
                    level: 0,
                    resolution: 156543.033928,
                    scale: 5.91657527591555E8
                },
                    {
                        level: 1,
                        resolution: 78271.5169639999,
                        scale: 2.95828763795777E8
                    },
                    {
                        level: 2,
                        resolution: 39135.7584820001,
                        scale: 1.47914381897889E8
                    },
                    {
                        level: 3,
                        resolution: 19567.8792409999,
                        scale: 7.3957190948944E7
                    },
                    {
                        level: 4,
                        resolution: 9783.93962049996,
                        scale: 3.6978595474472E7
                    },
                    {
                        level: 5,
                        resolution: 4891.96981024998,
                        scale: 1.8489297737236E7
                    },
                    {
                        level: 6,
                        resolution: 2445.98490512499,
                        scale: 9244648.868618
                    },
                    {
                        level: 7,
                        resolution: 1222.99245256249,
                        scale: 4622324.434309
                    },
                    {
                        level: 8,
                        resolution: 611.49622628138,
                        scale: 2311162.217155
                    },
                    {
                        level: 9,
                        resolution: 305.748113140558,
                        scale: 1155581.108577
                    },
                    {
                        level: 10,
                        resolution: 152.874056570411,
                        scale: 577790.554289
                    },
                    {
                        level: 11,
                        resolution: 76.4370282850732,
                        scale: 288895.277144
                    },
                    {
                        level: 12,
                        resolution: 38.2185141425366,
                        scale: 144447.638572
                    },
                    {
                        level: 13,
                        resolution: 19.1092570712683,
                        scale: 72223.819286
                    },
                    {
                        level: 14,
                        resolution: 9.55462853563415,
                        scale: 36111.909643
                    },
                    {
                        level: 15,
                        resolution: 4.77731426794937,
                        scale: 18055.954822
                    },
                    {
                        level: 16,
                        resolution: 2.38865713397468,
                        scale: 9027.977411
                    },
                    {
                        level: 17,
                        resolution: 1.19432856685505,
                        scale: 4513.988705
                    },
                    {
                        level: 18,
                        resolution: .597164283559817,
                        scale: 2256.994353
                    },
                    {
                        level: 19,
                        resolution: .298582141647617,
                        scale: 1128.497176
                    },
                    {
                        level: 20,
                        resolution: .14929107082380833,
                        scale: 564.248588
                    },
                    {
                        level: 21,
                        resolution: .07464553541190416,
                        scale: 282.124294
                    },
                    {
                        level: 22,
                        resolution: .03732276770595208,
                        scale: 141.062147
                    },
                    {
                        level: 23,
                        resolution: .01866138385297604,
                        scale: 70.5310735
                    }]
            });
            this.spatialReference = new m(this.tileInfo.spatialReference.toJson());
            this.copyright = a.copyright || "";
            var e = new u(c),
                b = e.scheme + "://" + e.authority + "/";
            this.urlPath = c.substring(b.length);
            this.tileServers = a.tileServers || []; - 1 === e.authority.indexOf("{subDomain}") && this.tileServers.push(b);
            if (a.subDomains && 0 < a.subDomains.length && 1 < e.authority.split(".").length) {
                this.subDomains = a.subDomains;
                var g;
                k.forEach(a.subDomains, function (a) {
                    -1 < e.authority.indexOf("${subDomain}") ? g = e.scheme + "://" + q.substitute(e.authority, {
                            subDomain: a
                        }) + "/" : -1 < e.authority.indexOf("{subDomain}") && (g = e.scheme + "://" + e.authority.replace(/\{subDomain\}/gi, a) + "/");
                    this.tileServers.push(g)
                }, this)
            }
            this.tileServers = k.map(this.tileServers, function (a) {
                "/" !== a.charAt(a.length - 1) && (a += "/");
                return a
            });
            this._levelToLevelValue = [];
            var f = 0;
            k.forEach(this.tileInfo.lods, function (a, b) {
                this._levelToLevelValue[a.level] = a.levelValue || a.level;
                0 === b && (f = this._levelToLevelValue[a.level])
            }, this);
            this._wmtsInfo = a.wmtsInfo;
            var n = h.hitch(this, function () {
                this.loaded = !0;
                this.onLoad(this)
            });
            if (p("chrome")) {
                var b = this.getTileUrl(f, 0, 0),
                    d = v.defaults.io,
                    t = "with-credentials" === d.useCors ? l.canUseXhr(b, !0) : -1;
                (d = -1 < t ? d.corsEnabledServers[t] : null) && d.withCredentials ? x({
                    url: b,
                    handleAs: "arraybuffer"
                }).addBoth(function () {
                    n()
                }) : n()
            } else n()
        },
        getTileUrl: function (c, a, b) {
            c = this._levelToLevelValue[c];
            var d = this.tileServers[a % this.tileServers.length] + q.substitute(this.urlPath, {
                        level: c,
                        col: b,
                        row: a
                    }),
                d = d.replace(/\{level\}/gi, c).replace(/\{row\}/gi, a).replace(/\{col\}/gi, b),
                d = this._appendCustomLayerParameters(d),
                d = this.addTimestampToURL(d);
            return l.addProxy(d)
        },
        _appendCustomLayerParameters: function (c) {
            var a, b;
            if (this._wmtsInfo && (this._wmtsInfo.customLayerParameters || this._wmtsInfo.customParameters)) for (a in b = h.clone(this._wmtsInfo.customParameters || {}), h.mixin(b, this._wmtsInfo.customLayerParameters || {}), b) c += (-1 === c.indexOf("?") ? "?" : "\x26") + a + "\x3d" + encodeURIComponent(b[a]);
            return c
        }
    });
    p("extend-esri") && h.setObject("layers.WebTiledLayer", f, w);
    return f
});