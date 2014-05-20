(function(window, $, undefined){
    window.Detail = window.Detail || {};
    function AddrPop(cfg) {
        var TOPLEVELADDR = [
            ["1", "北京"], ["2", "天津"], ["9", "上海"], ["22", "重庆"],
            ["3", "河北"], ["4", "山西"], ["5", "内蒙古"], ["6", "辽宁"], ["7", "吉宁"], ["8", "黑龙江"],
            ["10", "江苏"], ["11", "浙江"], ["12", "安徽"], ["13", "福建"], ["14", "江西"], ["15", "山东"],
            ["16", "河南"], ["17", "湖北"], ["18", "湖南"], ["19", "广东"], ["20", "广西"], ["21", "海南"],
            ["23", "四川"], ["24", "贵州"], ["25", "云南"], ["26", "西藏"], ["27", "陕西"], ["28", "甘肃"],
            ["29", "青海"], ["30", "宁夏"], ["31", "新疆"], ["32", "台湾"], ["33", "香港"], ["34", "澳门"],
            ["35", "海外"]
        ];

        this.getProv = function() {
            return TOPLEVELADDR;
        };

        var config = {};
        config.trigger = $(cfg.trigger);
        config.offset = cfg.offset || {x: 0, y: 5};
        config.popClass = cfg.popClass || "";
        config.closeText = cfg.closeText || "X";
        config.subCity = cfg.subCity || nc_a;
        config.initSelect = cfg.initSelect || 1;
        config.onSelect = cfg.onSelect || function(){};

        this.get = function(name) {
            return config[name];
        };

        this.set = function(name, val) {
            config[name] = val;
        };

        this.init();
    }

    AddrPop.prototype = {
        init: function() {
            this.createPop();
            this.bindEvent();
            this.renderAddress();
        },
        createPop: function() {
            var ap = $('<div class="KD-AddrPop addr-pop">'),
                closer = $('<a href="javascript:void(0);" class="addr-pop-close">' + this.get("closeText") + '</a>'),
                popBody = $('<div class="KD-AddrPopBody addr-pop-body"></div>'),
                tg = this.get("trigger"),
                uofs = this.get("offset"),
                ofs = tg.offset(),
                left = ofs.left + uofs.x,
                top = ofs.top + uofs.y;
            this.set("overlay", ap);
            this.set("popBody", popBody);
            this.set("closer", closer);
            ap.append(closer).append(popBody).addClass(this.get("popClass"));
            ap.css({left: left + "px", top: top + "px"});
            $("body").append(ap);
        },
        renderAddress: function() {
            var addrs = this.getProv(),
                zxCity = $('<ul class="KD-ProvList prov-list prov-list-zxcity clearfix"></ul>'),
                listBox = $('<ul class="KD-ProvList prov-list clearfix"></ul>'),
                zxaddr = addrs.slice(0, 4), addrn = addrs.slice(4),
                outzx = '', outn = '';
            $.each(zxaddr, function(index, addr){
                outzx += '<li class="item">'
                        + '<a class="prov-link" href="javascript:void(0);" data-code="' + addr[0] + '">'
                        + addr[1]
                        + '<span class="item-mark"></span>'
                        + '</a>';
            });
            $.each(addrn, function(index, addr){
                var group = Math.ceil((index + 1) / 6);
                outn += '<li class="item">'
                        + '<a class="prov-link" href="javascript:void(0);" data-code="' + addr[0] + '" data-group="' + group + '">'
                        + addr[1]
                        + '<span class="item-mark"></span>'
                        + '</a>';
                if (index % 6 === 5) {
                    outn += '<li class="KD-SubCity KD-SubCity' + group + ' sub-city"></li>';
                }
            });
            zxCity.html(outzx);
            listBox.html(outn);
            this.get("popBody").append(zxCity).append(listBox);
            this.select(this.get("initSelect"));
        },
        bindEvent: function() {
            var _this = this,
                pb = _this.get("popBody"),
                closer = _this.get("closer"),
                tg = _this.get("trigger");

            tg.on("click", function(e){
                if (_this.get("isShow")) {
                    _this.hide();
                } else {
                    _this.show();
                }
            })

            closer.on("click", function(e){
                _this.hide();
                return false;
            });

            pb.on("click", ".prov-link", function(e){
                var code = $(e.currentTarget).attr("data-code");
                _this.select(code);
            });

            pb.on("click", ".sub-city-link", function(e){
                var ct = $(e.currentTarget),
                    code = ct.attr("data-code"),
                    label = ct.text();
                _this.setSelectVal(code, label);
            });
        },
        setSelectVal: function(code, label) {
            var tg = this.get("trigger");
            tg.html(tg.html().replace(tg.text(), label));
            tg.attr("data-code", code);
            this.hide();
            this.get("onSelect")({code: code, addr_name: label});
        },
        updateSubCity: function(code, cont) {
            var sco = this.get("subCity"),
                sc = sco[code],
                scul = $('<ul class="sub-city-list clearfix"></ul>'),
                outItems = '';
            $.each(sc, function(index, obj){
                outItems += '<li class="sub-item">'
                        + '<a href="javascript:void(0);" class="sub-city-link" data-code="' + obj[0] + '">'
                        + obj[1]
                        + '</a>';
            });
            scul.html(outItems);
            cont.html(scul);

            // 默认选中
            if (this.get("initSelect") !== -1) {
                cont.find(".sub-city-link:eq(0)").trigger("click");
                this.set("initSelect", -1);
            }
        },
        select: function(code) {
            var pb = this.get("popBody"),
                prov = pb.find("a[data-code='" + code + "']"),
                sub = '';
            pb.find(".selected").removeClass("selected");
            pb.find(".KD-SubCity").removeClass('sub-city-show');
            prov.addClass("selected");
            if (prov.attr("data-group") && prov.attr("data-group") < 6) {
                sub = pb.find(".KD-SubCity" + prov.attr("data-group"))
                this.updateSubCity(code, sub);
                sub.addClass("sub-city-show");
            } else {
                this.setSelectVal(code, prov.text());
                prov.find(".item-mark").css("display", "none");
            }
        },
        hide: function() {
            var pl = this.get("overlay");
            pl.css("display", "none");
            this.set("isShow", false);
        },
        show: function() {
            var pl = this.get("overlay");
            pl.css("display", "block");
            this.set("isShow", true);
        }
    };

    window.Detail.AddrPop = AddrPop;
})(window, jQuery);