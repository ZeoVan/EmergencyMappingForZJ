// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/WMTSLayer", "dojo/_base/kernel dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/sniff dojox/xml/parser ../kernel ../lang ../request ../urlUtils ../WKIDUnitConversion ../SpatialReference ../geometry/Point ../geometry/Extent ../geometry/webMercatorUtils ./TiledMapServiceLayer ./TileInfo ./WMTSLayerInfo dojo/query".split(" "), function (h, y, x, k, z, F, G, A, H, I, B, C, D, E, J, K, L, M) {
    y = y([K], {
        declaredClass: "esri.layers.WMTSLayer",
        copyright: null,
        extent: null,
        tileUrl: null,
        spatialReference: null,
        tileInfo: null,
        constructor: function (a, b) {
            debugger
            this.version = "1.0.0";
            this.tileUr = this._url = a;
            this.serviceMode = "RESTful";
            this._parseCapabilities = x.hitch(this, this._parseCapabilities);
            this._getCapabilitiesError = x.hitch(this, this._getCapabilitiesError);
            b || (b = {});
            if (b.serviceMode) if ("KVP" === b.serviceMode || "RESTful" === b.serviceMode) this.serviceMode = b.serviceMode;
            else {
                console.error("WMTS mode could only be 'KVP' or 'RESTful'");
                return
            }
            this.customParameters = b.customParameters;
            this.customLayerParameters = b.customLayerParameters;
            this.layerInfo = new M;
            b.layerInfo && (this.layerInfo = b.layerInfo, this._identifier = b.layerInfo.identifier, this._tileMatrixSetId = b.layerInfo.tileMatrixSet, b.layerInfo.format && (this.format = "image/" + b.layerInfo.format), this._style = b.layerInfo.style, this.title = b.layerInfo.title, this._dimension = b.layerInfo.dimension, this._dimension2 = b.layerInfo.dimension2);
            b.resourceInfo ? (this.version = b.resourceInfo.version, b.resourceInfo.getTileUrl && (this._url = this.tileUrl = b.resourceInfo.getTileUrl), this.copyright = b.resourceInfo.copyright, this.layerInfos = b.resourceInfo.layerInfos, this.customParameters = b.resourceInfo.customParameters || this.customParameters, this.customLayerParameters = b.resourceInfo.customLayerParameters || this.customLayerParameters, this._parseResourceInfo(), this.loaded = !0, this.onLoad(this)) : this._getCapabilities();
            this._formatDictionary = {
                "image/png": ".png",
                "image/png8": ".png",
                "image/png24": ".png",
                "image/png32": ".png",
                "image/jpg": ".jpg",
                "image/jpeg": ".jpeg",
                "image/gif": ".gif",
                "image/bmp": ".bmp",
                "image/tiff": ".tif",
                "image/jpgpng": "",
                "image/jpegpng": "",
                "image/unknown": ""
            }
        },
        setActiveLayer: function (a) {
            this.setVisibleLayer(a)
        },
        setVisibleLayer: function (a) {
            this._setActiveLayer(a);
            this.refresh(!0)
        },
        setCustomParameters: function (a, b) {
            this.customParameters = a;
            this.customLayerParameters = b;
            this.refresh(!0)
        },
        getTileUrl: function (a, b, c) {
            a = this._levelToLevelValue[a];
            a = this.resourceUrls && 0 < this.resourceUrls.length ? this.resourceUrls[b % this.resourceUrls.length].template.replace(/\{Style\}/gi, this._style).replace(/\{TileMatrixSet\}/gi, this._tileMatrixSetId).replace(/\{TileMatrix\}/gi, a).replace(/\{TileRow\}/gi, b).replace(/\{TileCol\}/gi, c).replace(/\{dimensionValue\}/gi, this._dimension).replace(/\{dimensionValue2\}/gi, this._dimension2) : this.UrlTemplate.replace(/\{level\}/gi, a).replace(/\{row\}/gi, b).replace(/\{col\}/gi, c);
            a = this._appendCustomLayerParameters(a);
            a = this.addTimestampToURL(a);
            return I.addProxy(a)
        },
        getTileUrlTemplate: function (a) {
            var b = a.identifier,
                c = a.tileMatrixSet,
                d = a.format,
                e = a.style,
                g = a.dimension,
                f = a.dimension2;
            b ? a = k.filter(this.layers, function (a) {
                return a.identifier === b
            })[0] : (a = this.layers[0], b = this.layers[0].identifier);
            if (a) {
                if (!d) d = a.formats[0];
                else if (!(-1 === d.indexOf("image/") && -1 < k.indexOf(a.formats, d)) && (-1 === d.indexOf("image/") && (d = "image/" + d), -1 === k.indexOf(a.formats, d))) {
                    console.error("The layer doesn't support the format of " + d);
                    this.onError(Error("The layer doesn't support the format of " + d));
                    return
                }
                if (!e) e = a.styles[0];
                else if (-1 === k.indexOf(a.styles, e)) {
                    console.error("The layer doesn't support the style of " + e);
                    this.onError(Error("The layer doesn't support the style of " + e));
                    return
                }
                if (!g && a.dimensions) g = a.dimensions[0];
                else if (-1 === k.indexOf(a.dimensions, g)) {
                    console.error("The layer doesn't support the dimension of " + g);
                    this.onError(Error("The layer doesn't support the dimension of " + g));
                    return
                }
                if (!f && a.dimensions2) f = a.dimensions2[0];
                else if (-1 === k.indexOf(a.dimensions2, f)) {
                    console.error("The layer doesn't support the dimension of " + f);
                    this.onError(Error("The layer doesn't support the dimension of " + f));
                    return
                }
                var h;
                if (c) {
                    if (h = k.filter(a.tileMatrixSetInfos, function (a) {
                            return a.tileMatrixSet === c
                        })[0], !h) {
                        console.error("The tileMatrixSetId " + c + " is not supported by the layer of " + b);
                        this.onError(Error("The tileMatrixSetId " + c + " is not supported by the layer of " + b));
                        return
                    }
                } else(h = k.filter(a.tileMatrixSetInfos, function (a) {
                    return "GoogleMapsCompatible" === a.tileMatrixSet
                })[0]) || (h = a.tileMatrixSetInfos[0]),
                    c = h.tileMatrixSet;
                return this._getTileUrlTemplate(b, c, d, e, g, f)
            }
            console.error("couldn't find the layer " + b);
            this.onError(Error("couldn't find the layer " + b))
        },
        _getTileUrlTemplate: function (a, b, c, d, e, g) {
            var f;
            a || (a = this._identifier);
            b || (b = this._tileMatrixSetId);
            c || (c = this.format);
            d || "" === d || (d = this._style);
            if (this.resourceUrls && 0 < this.resourceUrls.length) return f = this.resourceUrls[0].template,
            f.indexOf(".xxx") === f.length - 4 && (f = f.slice(0, f.length - 4)),
                f = f.replace(/\{Style\}/gi, d),
                f = f.replace(/\{TileMatrixSet\}/gi, b),
                f = f.replace(/\{TileMatrix\}/gi, "{level}"),
                f = f.replace(/\{TileRow\}/gi, "{row}"),
                f = f.replace(/\{TileCol\}/gi, "{col}"),
                f = f.replace(/\{dimensionValue\}/gi, e),
                f = f.replace(/\{dimensionValue2\}/gi, g);
            "KVP" === this.serviceMode ? f = this._url + "SERVICE\x3dWMTS\x26VERSION\x3d" + this.version + "\x26REQUEST\x3dGetTile\x26LAYER\x3d" + a + "\x26STYLE\x3d" + d + "\x26FORMAT\x3d" + c + "\x26TILEMATRIXSET\x3d" + b + "\x26TILEMATRIX\x3d{level}\x26TILEROW\x3d{row}\x26TILECOL\x3d{col}" : "RESTful" === this.serviceMode && (e = "", this._formatDictionary[c.toLowerCase()] && (e = this._formatDictionary[c.toLowerCase()]), f = this._url + a + "/" + d + "/" + b + "/{level}/{row}/{col}" + e);
            return f
        },
        _parseResourceInfo: function () {
            debugger
            var a = this.layerInfos,
                b, c;
            "KVP" === this.serviceMode && (this._url += -1 < this._url.indexOf("?") ? "" : "?");
            for (c = 0; c < a.length; c++) if (!(this._identifier && a[c].identifier !== this._identifier || this.title && a[c].title !== this.title || this._tileMatrixSetId && a[c].tileMatrixSet !== this._tileMatrixSetId || this.format && "image/" + a[c].format !== this.format || this._style && a[c].style !== this._style)) {
                x.mixin(this, {
                    description: a[c].description,
                    tileInfo: a[c].tileInfo,
                    spatialReference: a[c].tileInfo.spatialReference,
                    fullExtent: a[c].fullExtent,
                    initialExtent: a[c].initialExtent,
                    _identifier: a[c].identifier,
                    _tileMatrixSetId: a[c].tileMatrixSet,
                    format: a[c].format,
                    // format: "image/" + a[c].format,
                    _style: a[c].style
                });
                break
            }
            for (c = 0; c < a.length; c++) b = a[c].tileInfo,
            96 !== b.dpi && (k.forEach(b.lods, function (a) {
                a.scale = 96 * a.scale / b.dpi
            }), b.dpi = 96),
                k.forEach(b.lods, function (d) {
                    d.resolution = this._getResolution(b.spatialReference.wkid, 90.71428571428571 * d.scale / 96, a[c].tileMatrixSet)
                }, this);
            this._setActiveLayer();
            this.UrlTemplate = this._getTileUrlTemplate();
            this._levelToLevelValue = [];
            debugger
            k.forEach(this.tileInfo.lods, function (a) {
                this._levelToLevelValue[a.level] = a.levelValue ? a.levelValue : a.level
            }, this)
        },
        _getCapabilities: function () {
            var a;
            "KVP" === this.serviceMode ? a = -1 < this._url.indexOf("?") ? this._url + "\x26request\x3dGetCapabilities\x26service\x3dWMTS\x26version\x3d" + this.version : this._url + "?request\x3dGetCapabilities\x26service\x3dWMTS\x26version\x3d" + this.version : "RESTful" === this.serviceMode && (a = this._url + "/" + this.version + "/WMTSCapabilities.xml");
            a = this._appendCustomParameters(a);
            H({
                url: a,
                handleAs: "text",
                load: this._parseCapabilities,
                error: this._getCapabilitiesError
            })
        },
        _parseCapabilities: function (a) {
            a = a.replace(/ows:/gi, "");
            a = F.parse(a);
            var b = h.query("Contents", a)[0];
            if (b) {
                var c = h.query("OperationsMetadata", a)[0],
                    d = h.query("[name\x3d'GetTile']", c)[0],
                    c = this._url,
                    d = h.query("Get", d),
                    e, g = !1,
                    f, w;
                for (e = 0; e < d.length; e++) {
                    var n = h.query("Constraint", d[e])[0];
                    if (!n || this._getTagWithChildTagValue("AllowedValues", "Value", this.serviceMode, n)) {
                        c = d[e].attributes[0].nodeValue;
                        g = !0;
                        break
                    } else if (!n || this._getTagWithChildTagValue("AllowedValues", "Value", "RESTful", n)) f = d[e].attributes[0].nodeValue;
                    else if (!n || this._getTagWithChildTagValue("AllowedValues", "Value", "KVP", n)) w = d[e].attributes[0].nodeValue
                }
                g || ("KVP" === this.serviceMode && f ? (c = f, this.serviceMode = "RESTful") : "RESTful" === this.serviceMode && w && (c = w, this.serviceMode = "KVP")); - 1 === c.indexOf("/1.0.0/") && "RESTful" === this.serviceMode && (c += "/");
                "KVP" === this.serviceMode && (c += -1 < c.indexOf("?") ? "" : "?");
                this._url = c;
                this.copyright = this._getTagValues("Capabilities\x3eServiceIdentification\x3eAccessConstraints", a)[0];
                f = h.query("Layer", b);
                var m, p = [];
                this.layers = [];
                k.forEach(f, function (a) {
                    m = this._getTagValues("Identifier", a)[0];
                    p.push(m);
                    this.layers.push(this._getWMTSLayerInfo(m, a, b))
                }, this);
                this._setActiveLayer();
                this.loaded = !0;
                this.onLoad(this)
            } else console.error("The WMTS capabilities XML is not valid"),
                this.onError(Error("The WMTS capabilities XML is not valid"))
        },
        _setActiveLayer: function (a) {
            a || (a = {});
            a.identifier && (this._identifier = a.identifier);
            a.tileMatrixSet && (this._tileMatrixSetId = a.tileMatrixSet);
            a.format && (this.format = a.format);
            a.style && (this._style = a.style);
            a.dimension && (this._dimension = a.dimension);
            a.dimension2 && (this._dimension2 = a.dimension2);
            if (this.layers) if (this._identifier ? a = k.filter(this.layers, function (a) {
                    return a.identifier === this._identifier
                }, this)[0] : (a = this.layers[0], this._identifier = this.layers[0].identifier), a) {
                if (this.format) {
                    if (-1 === this.format.indexOf("image/") && (this.format = "image/" + this.format), -1 === k.indexOf(a.formats, this.format)) {
                        console.error("The layer doesn't support the format of " + this.format);
                        this.onError(Error("The layer doesn't support the format of " + this.format));
                        return
                    }
                } else this.format = a.formats[0],
                -1 === this.format.indexOf("image/") && (this.format = "image/" + this.format);
                if (!this._style) this._style = a.styles[0];
                else if (-1 === k.indexOf(a.styles, this._style)) {
                    console.error("The layer doesn't support the style of " + this._style);
                    this.onError(Error("The layer doesn't support the style of " + this._style));
                    return
                }
                if (!this._dimension && a.dimensions) this._dimension = a.dimensions[0];
                else if (-1 === k.indexOf(a.dimensions, this._dimension)) {
                    console.error("The layer doesn't support the dimension of " + this._dimension);
                    this.onError(Error("The layer doesn't support the dimension of " + this._dimension));
                    return
                }
                if (!this._dimension2 && a.dimensions2) this._dimension2 = a.dimensions2[0];
                else if (-1 === k.indexOf(a.dimensions2, this._dimension2)) {
                    console.error("The layer doesn't support the dimension of " + this._dimension2);
                    this.onError(Error("The layer doesn't support the dimension of " + this._dimension2));
                    return
                }
                var b;
                if (this._tileMatrixSetId) {
                    if (b = k.filter(a.tileMatrixSetInfos, function (a) {
                            return a.tileMatrixSet === this._tileMatrixSetId
                        }, this)[0], !b) {
                        console.error("The tileMatrixSetId " + this._tileMatrixSetId + " is not supported by the layer of " + this._identifier);
                        this.onError(Error("The tileMatrixSetId " + this._tileMatrixSetId + " is not supported by the layer of " + this._identifier));
                        return
                    }
                } else(b = k.filter(a.tileMatrixSetInfos, function (a) {
                    return "GoogleMapsCompatible" === a.tileMatrixSet
                })[0]) || (b = a.tileMatrixSetInfos[0]),
                    this._tileMatrixSetId = b.tileMatrixSet;
                this.description = a.description;
                this.title = a.title;
                this.spatialReference = b.tileInfo.spatialReference;
                this.tileInfo = b.tileInfo;
                this._levelToLevelValue = [];
                k.forEach(this.tileInfo.lods, function (a) {
                    this._levelToLevelValue[a.level] = a.levelValue ? a.levelValue : a.level
                }, this);
                102100 === this.spatialReference.wkid || 102113 === this.spatialReference.wkid ? this.fullExtent = this.initialExtent = J.geographicToWebMercator(a.gcsExtent) : 4326 === this.spatialReference.wkid ? this.fullExtent =
                    this.initialExtent = a.gcsExtent : (this.fullExtent = b.fullExtent, this.initialExtent = b.initialExtent);
                this.resourceUrls = a.resourceUrls;
                this.UrlTemplate = this._getTileUrlTemplate();
                this.layerInfo = {
                    identifier: this._identifier,
                    tileMatrixSet: this._tileMatrixSetId,
                    format: this.format,
                    style: this._style,
                    fullExtent: this.fullExtent,
                    initialExtent: this.initialExtent,
                    tileInfo: this.tileInfo,
                    title: this.title,
                    description: this.description
                }
            } else console.error("couldn't find the layer " + this._identifier),
                this.onError(Error("couldn't find the layer " + this._identifier))
        },
        _getWMTSLayerInfo: function (a, b, c) {
            var d = this._getTagValues("Abstract", b)[0],
                e = this._getTagValues("Title", b)[0],
                g = h.query("WGS84BoundingBox", b)[0],
                f = g ? this._getTagValues("LowerCorner", g)[0].split(" ") : ["-180", "-90"],
                w = g ? this._getTagValues("UpperCorner", g)[0].split(" ") : ["180", "90"],
                g = parseFloat(f[0]),
                f = parseFloat(f[1]),
                n = parseFloat(w[0]),
                w = parseFloat(w[1]),
                g = new E(g, f, n, w, new C({
                    wkid: 4326
                })),
                w = this._getTagValues("Identifier", h.query("Style", b)[0]),
                m = this._getTagValues("Identifier", h.query("Dimension", b)[0]),
                p = this._getTagValues("Default", h.query("Dimension", b)[0]) || this._getTagValues("Value", h.query("Dimension", b)[0]),
                u = 1 < h.query("Dimension", b).length ? this._getTagValues("Identifier", h.query("Dimension", b)[1]) : [],
                r = 1 < h.query("Dimension", b).length ? this._getTagValues("Default", h.query("Dimension", b)[1]) || this._getTagValues("Value", h.query("Dimension", b)[1]) : [],
                f = this._getTagValues("Format", b);
            c = this._getLayerMatrixInfos(b, c);
            a = {
                identifier: a,
                tileMatrixSetInfos: c,
                formats: f,
                styles: w,
                title: e,
                description: d,
                gcsExtent: g,
                dimensions: p,
                dimensions2: r
            };
            b = h.query("ResourceURL", b);
            var q = [],
                l;
            k.forEach(b, function (a) {
                l = a.getAttribute("template");
                if (m && p && m[0] && p[0]) if (-1 < l.indexOf("{" + m + "}")) l = l.replace("{" + m + "}", "{dimensionValue}");
                else {
                    var b = l.toLowerCase().indexOf("{" + m[0].toLowerCase() + "}"); - 1 < b && (l = l.substring(0, b) + "{dimensionValue}" + l.substring(b + m[0].length + 2))
                }
                u && r && u[0] && r[0] && (-1 < l.indexOf("{" + u + "}") ? l = l.replace("{" + u + "}", "{dimensionValue2}") : (b = l.toLowerCase().indexOf("{" + u[0].toLowerCase() + "}"), -1 < b && (l = l.substring(0, b) + "{dimensionValue2}" + l.substring(b + u[0].length + 2))));
                q.push({
                    template: l,
                    format: a.getAttribute("format"),
                    resourceType: a.getAttribute("resourceType")
                })
            });
            q && 0 < q.length && (a.resourceUrls = q);
            return a
        },
        _getLayerMatrixInfos: function (a, b) {
            var c, d = [];
            this._allMatrixInfos || (this._allMatrixInfos = []);
            var e = this._getTagValues("TileMatrixSet", a);
            if (e && 0 !== e.length) return k.forEach(e, function (e) {
                var f;
                if (0 < this._allMatrixInfos.length) for (c = 0; c < this._allMatrixInfos.length; c++) if (this._allMatrixInfos[c].tileMatrixSet == e) {
                    f = this._allMatrixInfos[c];
                    break
                }
                f || (f = this._getLayerMatrixInfo(e, a, b), this._allMatrixInfos.push(f));
                d.push(f)
            }, this),
                d
        },
        _getLayerMatrixInfo: function (a, b, c) {
            var d, e, g, f, k = [];
            b = this._getTagWithChildTagValue("TileMatrixSetLink", "TileMatrixSet", a, b);
            var n = this._getTagValues("TileMatrix", b),
                m = this._getTagWithChildTagValue("TileMatrixSet", "Identifier", a, c),
                p = this._getTagValues("SupportedCRS", m)[0];
            d = parseInt(p.split(":").pop(), 10);
            if (900913 == d || 3857 == d) d = 102100;
            if (-1 < p.toLowerCase().indexOf("crs84") || -1 < p.toLowerCase().indexOf("crs:84")) d = 4326,
                f = !0;
            else if (-1 < p.toLowerCase().indexOf("crs83") || -1 < p.toLowerCase().indexOf("crs:83")) d = 4269,
                f = !0;
            else if (-1 < p.toLowerCase().indexOf("crs27") || -1 < p.toLowerCase().indexOf("crs:27")) d = 4267,
                f = !0;
            var u = new C({
                    wkid: d
                }),
                r = h.query("TileMatrix", m)[0];
            c = parseInt(this._getTagValues("TileWidth", r)[0], 10);
            b = parseInt(this._getTagValues("TileHeight", r)[0], 10);
            e = this._getTagValues("TopLeftCorner", r)[0].split(" ");
            var q = e[0],
                l = e[1];
            1 < q.split("E").length && (e = q.split("E"), q = e[0] * Math.pow(10, e[1]));
            1 < l.split("E").length && (e = l.split("E"), l = e[0] * Math.pow(10, e[1]));
            var q = parseFloat(q),
                l = parseFloat(l),
                x = f && 4326 === d && 90 === q && -180 === l;
            for (e = 0; e < this._flippingAxisForWkids.length; e++) if (p.split(":").pop() >= this._flippingAxisForWkids[e][0] && p.split(":").pop() <= this._flippingAxisForWkids[e][1] || 4326 === d && (!f || x)) {
                4326 === d && 90 < q && (q = "90");
                g = new D(l, q, u);
                break
            }
            e === this._flippingAxisForWkids.length && (g = new D(q, l, u));
            if (0 === n.length) for (n = h.query("TileMatrix", m), e = 0; e < n.length; e++) f = this._getLodFromTileMatrix(n[e], d, e, a),
                k.push(f);
            else for (e = 0; e < n.length; e++) f = this._getTagWithChildTagValue("TileMatrix", "Identifier", n[e], m),
                f = this._getLodFromTileMatrix(f, d, e, a),
                k.push(f);
            d = h.query("BoundingBox", m)[0];
            var t, v;
            d && (t = this._getTagValues("LowerCorner", d)[0].split(" "), v = this._getTagValues("UpperCorner", d)[0].split(" "));
            t && 1 < t.length && v && 1 < v.length ? (r = parseFloat(t[0]), d = parseFloat(t[1]), t = parseFloat(v[0]), v = parseFloat(v[1])) : (t = this._getTagValues("MatrixWidth", r)[0], d = this._getTagValues("MatrixHeight", r)[0], r = g.x, v = g.y, t = r + t * b * k[0].resolution, d = v - d * c * k[0].resolution);
            v = t = new E(r, d, t, v, u);
            g = new L({
                dpi: 96,
                spatialReference: u,
                format: this.format,
                rows: c,
                cols: b,
                origin: g,
                lods: k
            });
            return {
                tileMatrixSet: a,
                fullExtent: v,
                initialExtent: t,
                tileInfo: g
            }
        },
        _getCapabilitiesError: function (a) {
            console.error("Failed to get capabilities xml");
            this.onError(a)
        },
        _getLodFromTileMatrix: function (a, b, c, d) {
            var e = this._getTagValues("Identifier", a)[0];
            a = this._getTagValues("ScaleDenominator", a)[0];
            1 < a.split("E").length ? (a = a.split("E"), a = a[0] * Math.pow(10, a[1])) : a = parseFloat(a);
            b = this._getResolution(b, a, d);
            return {
                level: c,
                levelValue: e,
                scale: 1.058267716535433 * a,
                resolution: b
            }
        },
        _getResolution: function (a, b, c) {
            a = A.isDefined(B[a]) ? B.values[B[a]] : "default028mm" === c ? 6370997 * Math.PI / 180 : 6378137 * Math.PI / 180;
            return 7 * b / 25E3 / a
        },
        _getTag: function (a, b) {
            var c = h.query(a, b);
            return c && 0 < c.length ? c[0] : null
        },
        _getTagValues: function (a, b) {
            var c = [],
                d = a.split("\x3e"),
                e, g;
            e = h.query(d[0], b)[0];
            if (1 < d.length) {
                for (g = 1; g < d.length - 1; g++) e = h.query(d[g], e)[0];
                d = h.query(d[d.length - 1], e)
            } else d = h.query(d[0], b);
            d && 0 < d.length && k.forEach(d, function (a) {
                9 > z("ie") ? c.push(a.childNodes.length ? a.childNodes[0].nodeValue : "") : c.push(a.textContent)
            });
            return c
        },
        _getAttributeValues: function (a, b, c) {
            a = h.query(a, c);
            var d = [];
            a && 0 < a.length && k.forEach(a, function (a) {
                d.push(a.getAttribute(b))
            });
            return d
        },
        _getTagWithChildTagValue: function (a, b, c, d) {
            d = d.childNodes;
            var e, g;
            for (g = 0; g < d.length; g++) if (-1 < d[g].nodeName.indexOf(a) && (9 > z("ie") ? A.isDefined(h.query(b, d[g])[0]) && (e = h.query(b, d[g])[0].childNodes[0].nodeValue) : A.isDefined(h.query(b, d[g])[0]) && (e = h.query(b, d[g])[0].textContent), e === c || c.split(":") && e === c.split(":")[1])) return d[g]
        },
        _appendCustomParameters: function (a) {
            var b;
            if (this.customParameters) for (b in this.customParameters) a += (-1 === a.indexOf("?") ? "?" : "\x26") + b + "\x3d" + encodeURIComponent(this.customParameters[b]);
            return a
        },
        _appendCustomLayerParameters: function (a) {
            var b, c;
            if (this.customLayerParameters || this.customParameters) for (b in c = x.clone(this.customParameters || {}), x.mixin(c, this.customLayerParameters || {}), c) a += (-1 === a.indexOf("?") ? "?" : "\x26") + b + "\x3d" + encodeURIComponent(c[b]);
            return a
        },
        _flippingAxisForWkids: [
            [3819, 3819],
            [3821, 3824],
            [3889, 3889],
            [3906, 3906],
            [4001, 4025],
            [4027, 4036],
            [4039, 4047],
            [4052, 4055],
            [4074, 4075],
            [4080, 4081],
            [4120, 4176],
            [4178, 4185],
            [4188, 4216],
            [4218, 4289],
            [4291, 4304],
            [4306, 4319],
            [4322, 4326],
            [4463, 4463],
            [4470, 4470],
            [4475, 4475],
            [4483, 4483],
            [4490, 4490],
            [4555, 4558],
            [4600, 4646],
            [4657, 4765],
            [4801, 4811],
            [4813, 4821],
            [4823, 4824],
            [4901, 4904],
            [5013, 5013],
            [5132, 5132],
            [5228, 5229],
            [5233, 5233],
            [5246, 5246],
            [5252, 5252],
            [5264, 5264],
            [5324, 5340],
            [5354, 5354],
            [5360, 5360],
            [5365, 5365],
            [5370, 5373],
            [5381, 5381],
            [5393, 5393],
            [5451, 5451],
            [5464, 5464],
            [5467, 5467],
            [5489, 5489],
            [5524, 5524],
            [5527, 5527],
            [5546, 5546],
            [2044, 2045],
            [2081, 2083],
            [2085, 2086],
            [2093, 2093],
            [2096, 2098],
            [2105, 2132],
            [2169, 2170],
            [2176, 2180],
            [2193, 2193],
            [2200, 2200],
            [2206, 2212],
            [2319, 2319],
            [2320, 2462],
            [2523, 2549],
            [2551, 2735],
            [2738, 2758],
            [2935, 2941],
            [2953, 2953],
            [3006, 3030],
            [3034, 3035],
            [3038, 3051],
            [3058, 3059],
            [3068, 3068],
            [3114, 3118],
            [3126, 3138],
            [3150, 3151],
            [3300, 3301],
            [3328, 3335],
            [3346, 3346],
            [3350, 3352],
            [3366, 3366],
            [3389, 3390],
            [3416, 3417],
            [3833, 3841],
            [3844, 3850],
            [3854, 3854],
            [3873, 3885],
            [3907, 3910],
            [4026, 4026],
            [4037, 4038],
            [4417, 4417],
            [4434, 4434],
            [4491, 4554],
            [4839, 4839],
            [5048, 5048],
            [5105, 5130],
            [5253, 5259],
            [5269, 5275],
            [5343, 5349],
            [5479, 5482],
            [5518, 5519],
            [5520, 5520],
            [20004, 20032],
            [20064, 20092],
            [21413, 21423],
            [21473, 21483],
            [21896, 21899],
            [22171, 22177],
            [22181, 22187],
            [22191, 22197],
            [25884, 25884],
            [27205, 27232],
            [27391, 27398],
            [27492, 27492],
            [28402, 28432],
            [28462, 28492],
            [30161, 30179],
            [30800, 30800],
            [31251, 31259],
            [31275, 31279],
            [31281, 31290],
            [31466, 31700]
        ]
    });
    z("extend-esri") && x.setObject("layers.WMTSLayer", y, G);
    return y
});