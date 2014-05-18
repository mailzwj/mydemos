(function(window, $, undefined){
    function Pager(cfg) {
        this.config = {};
        this.config.cont = $(cfg.container);
        this.config.showMore = (!!cfg.showMore);
        this.config.dataAddr = cfg.dataAddr || './';
        this.config.perPage = cfg.perPage || 15;
        this.config.pageTo = cfg.pageTo || 1;
        this.config.params = cfg.params || {};
		this.config.prevText = cfg.prevText || "&lt;";
		this.config.nextText = cfg.nextText || "&gt;";
        this.config.pageChange = cfg.pageChange || function(){};

        var currentPage = this.config.pageTo;
        this.setPage = function(p) {
            currentPage = p;
        }

        this.getPage = function() {
            return currentPage;
        }

        this.init();
    }

    Pager.prototype = {
        init: function() {
            this._initFirstPage();
            this._bindEvent();
        },
        _initFirstPage: function() {
            var _this = this,
                initUrl = _this.config.dataAddr,
                params = _this._parseParam(1);
            
            initUrl += params;
            _this._getDataFromUrl(initUrl);
        },
        _parseParam: function(index) {
            var _this = this,
                sQuery = (_this.config.dataAddr.indexOf("?") !== -1 ? "&" : "?"),
                userParam = '';

            sQuery += "perPage=" + _this.config.perPage + "&";
            sQuery += "pageTo=" + index;

            for (var i in _this.config.params) {
                userParam += "&" + i + "=" + _this.config.params[i];
            }
            sQuery += userParam;
            return sQuery;
        },
        _getDataFromUrl: function(url) {
            var _this = this;
            $.ajax({
                url: url + "&callback=?",
                dataType: "jsonp",
                success: function(data) {
                    var pageObj = {};
                    if (data && data.status === "success") {
                        _this.config.pageChange(data);
                        pageObj.total = +data.total || 0;
                        pageObj.num = +data.perPage || _this.config.perPage;
                        pageObj.currentPage = _this.getPage();
                        _this._reBuildPagerBar(pageObj);
                    }
                }
            });
        },
        _reBuildPagerBar: function(obj) {
            var _this = this,
                pCount = Math.ceil(obj.total / obj.num),
                prev, next, pArr = [];

            if (obj.currentPage === 1) {
                prev = '<span class="page page-prev disabled">&lt;</span>';
            } else {
                prev = '<a href="' + (_this.config.dataAddr + _this._parseParam(obj.currentPage - 1)) + '" class="page page-prev" data-page="' + (obj.currentPage - 1) + '">' + _this.config.prevText + '</a>';
            }

            if (obj.currentPage === pCount) {
                next = '<span class="page page-next disabled">&gt;</span>';
            } else {
                next = '<a href="' + (_this.config.dataAddr + _this._parseParam(obj.currentPage + 1)) + '" class="page page-next" data-page="' + (obj.currentPage + 1) + '">' + _this.config.nextText + '</a>';
            }

            pArr.push(prev);
            if (pCount <= 5) {
                for (var p = 1; p <= pCount; p++) {
                    var page;
                    if (p === obj.currentPage) {
                        page = '<span class="page cur">' + p + '</span>';
                    } else {
                        page = '<a href="' + (_this.config.dataAddr + _this._parseParam(p)) + '" class="page">' + p + '</a>';
                    }
                    pArr.push(page);
                }
            } else {
                if (obj.currentPage <= 3) {
                    for (var p = 1; p <= 3 + 1; p++) {
                        var page;
                        if (p === obj.currentPage) {
                            page = '<span class="page cur">' + p + '</span>';
                        } else {
                            page = '<a href="' + (_this.config.dataAddr + _this._parseParam(p)) + '" class="page" data-page="' + p + '">' + p + '</a>';
                        }
                        pArr.push(page);
                    }
                    pArr.push('<span class="page page-more">...</span>');
                    pArr.push('<a href="' + (_this.config.dataAddr + _this._parseParam(pCount)) + '" class="page" data-page="' + pCount + '">' + pCount + '</a>');
                } else if (obj.currentPage > pCount - 3) {
                    pArr.push('<a href="' + (_this.config.dataAddr + _this._parseParam(1)) + '" class="page" data-page="' + 1 + '">' + 1 + '</a>');
                    pArr.push('<span class="page page-more">...</span>');
                    for (var p = pCount - 3; p <= pCount; p++) {
                        var page;
                        if (p === obj.currentPage) {
                            page = '<span class="page cur">' + p + '</span>';
                        } else {
                            page = '<a href="' + (_this.config.dataAddr + _this._parseParam(p)) + '" class="page" data-page="' + p + '">' + p + '</a>';
                        }
                        pArr.push(page);
                    }
                } else {
                    pArr.push('<a href="' + (_this.config.dataAddr + _this._parseParam(1)) + '" class="page" data-page="' + 1 + '">' + 1 + '</a>');
                    pArr.push('<span class="page page-more">...</span>');
                    pArr.push('<a href="' + (_this.config.dataAddr + _this._parseParam(obj.currentPage - 1)) + '" class="page" data-page="' + (obj.currentPage - 1) + '">' + (obj.currentPage - 1) + '</a>');
                    pArr.push('<span class="page cur">' + obj.currentPage + '</span>');
                    pArr.push('<a href="' + (_this.config.dataAddr + _this._parseParam(obj.currentPage + 1)) + '" class="page" data-page="' + (obj.currentPage + 1) + '">' + (obj.currentPage + 1) + '</a>');
                    pArr.push('<span class="page page-more">...</span>');
                    pArr.push('<a href="' + (_this.config.dataAddr + _this._parseParam(pCount)) + '" class="page" data-page="' + pCount + '">' + pCount + '</a>');
                }
            }
            pArr.push(next);
            _this.config.cont.html(pArr.join(""));
        },
        _bindEvent: function() {
            var _this = this;
            _this.config.cont.on("click", "a.page", function(e){
                var ct = $(e.currentTarget);
                _this.goTo(+ct.attr("data-page"));
                return false;
            });
        },
        goTo: function(index) {
            var _this = this,
                url = _this.config.dataAddr + _this._parseParam(index);

            $.ajax({
                url: url + "&callback=?",
                dataType: "jsonp",
                success: function(data) {
                    var pageObj = {};
                    if (data && data.status === "success") {
                        _this.setPage(index);
                        _this.config.pageChange(data);
                        pageObj.total = +data.total || 0;
                        pageObj.num = +data.perPage || _this.config.perPage;
                        pageObj.currentPage = _this.getPage();
                        _this._reBuildPagerBar(pageObj);
                    }
                }
            });
            return false;
        }
    };

    window.Pager = window.Pager || Pager;
})(window, jQuery);
