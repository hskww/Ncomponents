window.Ncomponents = window.Ncomponents || {},
    function() {
        var n = {};
        n.text = {
            bindEvents: function(n) {
                console.log("commponents callback")
            }
        }, $.extend(window.Ncomponents, n)
    }();