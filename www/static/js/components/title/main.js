window.Ncomponents = window.Ncomponents || {},
    function() {
        var n = {};
        n.title = {
            bindEvents: function(n) {
                $("#" + n).find(".more a").on("click", function() {
                    window.location.href = $(this).attr("url")
                })
            }
        }, $.extend(window.Ncomponents, n)
    }();