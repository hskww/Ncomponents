 (function(window, document) {

        "use strict";

        //设置viewport
        var metaEl = document.querySelector('meta[name="viewport"]');
        var dpr = window.devicePixelRatio || 1;
        var scale = 1 / dpr;
        metaEl.setAttribute('content', 'width=device-width,initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

        var mresize = function() {

            var innerWidth = window.innerWidth;

            if (!innerWidth) {
                return false;
            }

            document.documentElement.style.fontSize = (innerWidth * 20 / 320) + 'px';
        };

        mresize();

        window.addEventListener('resize', mresize, false);

        window.addEventListener('load', mresize, false);

    })(window, document);