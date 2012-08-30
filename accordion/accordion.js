KISSY.add("accordion", function(S){
    var D = S.DOM, E = S.Event;
    function Accordion(config){
        this.container = D.get(config.container);
        this.holder = D.query(config.holder, this.container);
        this.box = D.query(config.box, this.container);
        this.easing = config.easing || "easeIn";
        this.et = config.eventType || "mouseover";
        this.index = config.index || 1;
        this.mw = config.moveWidth;
        this.dur = config.duration || 0.3;
        this.init();
    }

    Accordion.prototype = {
        bindData: function(){
            var _this = this;
            S.each(_this.box, function(node){
                node.index = S.indexOf(node, _this.box);
                node.start = parseInt(D.css(node, "left"));
                node.end = node.start + _this.mw;
            });
        },
        expand: function(i){
            var _this = this;
            S.each(_this.box, function(node){
                if(node.index > i){
                    new S.Anim(node, {"left": node.end}, _this.dur, _this.easing, function(){}).run();
                }else{
                    new S.Anim(node, {"left": node.start}, _this.dur, _this.easing, function(){}).run();
                }
            });
        },
        bindEvent: function(){
            var _this = this;
            var c = _this.index;
            E.on(_this.holder, _this.et, function(){
                c = S.indexOf(this, _this.holder);
                _this.expand(c);
                return false;
            });
        },
        init: function(){
            var _this = this;
            _this.index -= 1;
            _this.bindData();
            _this.expand(_this.index);
            _this.bindEvent();
        }
    }

    KISSY.Accordion = Accordion;
});