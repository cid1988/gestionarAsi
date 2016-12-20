/*
 * jScroller 0.4 - Autoscroller PlugIn for jQuery
 *
 * Copyright (c) 2007 Markus Bordihn (http://markusbordihn.de)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2009-06-18 20:00:00 +0100 (Sat, 18 Jul 2009) $
 * $Rev: 0.4 $
 */
$jScroller = {
    info: {
        Name: "ByRei jScroller Plugin for jQuery",
        Version: 0.4,
        Author: "Markus Bordihn (http://markusbordihn.de)",
        Description: "Next Generation Autoscroller"
    },
    config: {
        obj: [],
        refresh: 120,
        regExp: {
            px: /([0-9,.\-]+)px/
        }
    },
    cache: {
        timer: 0,
        init: 0
    },
    add: function(a, b, c, d, e) {
        if ($(a).length && $(b).length && c && d >= 1) {
            $(a).css({
                overflow: 'hidden'
            });
            $(b).css({
                position: 'absolute',
                left: 0,
                top: 0
            });
            if (e) {
                $(b).hover(function() {
                    $jScroller.pause($(b), true)
                }, function() {
                    $jScroller.pause($(b), false)
                })
            }
            $jScroller.config.obj.push({
                parent: $(a),
                child: $(b),
                direction: c,
                speed: d,
                pause: false
            })
        }
    },
    pause: function(a, b) {
        if (a && typeof b !== 'undefined') {
            for (var i in $jScroller.config.obj) {
                if ($jScroller.config.obj[i].child.attr("id") === a.attr("id")) {
                    $jScroller.config.obj[i].pause = b
                }
            }
        }
    },
    start: function() {
        if ($jScroller.cache.timer === 0 && $jScroller.config.refresh > 0) {
            $jScroller.cache.timer = window.setInterval($jScroller.scroll, $jScroller.config.refresh)
        }
        if (!$jScroller.cache.init) {
            $(window).blur($jScroller.stop);
            $(window).focus($jScroller.start);
            $(window).resize($jScroller.start);
            $(window).scroll($jScroller.start);
            $(document).mousemove($jScroller.start);
           
            $jScroller.cache.init = 1
        }
    },
    stop: function() {
        if ($jScroller.cache.timer) {
            window.clearInterval($jScroller.cache.timer);
            $jScroller.cache.timer = 0
        }
    },
    get: {
        px: function(a) {
            var b = '';
            if (a) {
                if (a.match($jScroller.config.regExp.px)) {
                    if (typeof a.match($jScroller.config.regExp.px)[1] !== 'undefined') {
                        b = a.match($jScroller.config.regExp.px)[1]
                    }
                }
            }
            return b
        }
    },
    scroll: function() {
        for (var i in $jScroller.config.obj) {
            if ($jScroller.config.obj.hasOwnProperty(i)) {
                var a = $jScroller.config.obj[i],
                    left = Number(($jScroller.get.px(a.child.css('left')) || 0)),
                    top = Number(($jScroller.get.px(a.child.css('top')) || 0)),
                    min_height = a.parent.height(),
                    min_width = a.parent.width(),
                    height = a.child.height(),
                    width = a.child.width();
                if (!a.pause) {
                    switch (a.direction) {
                        case 'up':
                            if (top <= -1 * height) {
                                top = min_height
                            }
                            a.child.css('top', top - a.speed + 'px');
                            break;
                        case 'right':
                            if (left >= min_width) {
                                left = -1 * width
                            }
                            a.child.css('left', left + a.speed + 'px');
                            break;
                        case 'left':
                            if (left <= -1 * width) {
                                left = min_width
                            }
                            a.child.css('left', left - a.speed + 'px');
                            break;
                        case 'down':
                            if (top >= min_height) {
                                top = -1 * height
                            }
                            a.child.css('top', top + a.speed + 'px');
                            break
                    }
                }
            }
        }
    }
};