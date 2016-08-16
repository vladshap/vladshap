$(document).ready(function () {

    $('img').waitForImages().done(function() {
        $('body').removeClass('loading');
        setTimeout(function() {
            $('body').addClass('loaded');
        }, 500);

        $('.gallery').slick({
            autoplay: true,
            speed: 1000,
            autoplaySpeed: 5000,
            keyboardNav: true,
            fade: true,
            infinite: true,
            arrows: false,
            dots: false,
            cssEase: 'linear'
        });

        var viewportHeight = 0;
        function setFrameHeight() {
            viewportHeight = $(window).height() - 200;
            $('.site-header').css('height', viewportHeight);
            //console.log("viewport height: " + viewportHeight);
        }

        setFrameHeight();

        // ScrollMagic controller
        var controller = new ScrollMagic.Controller();

        // Intro Scene Tween
        var introTween = new TimelineMax().add([
            TweenMax.to(".logo-mark", 1, {scale:.85, y: "30%", opacity:0}),
            TweenMax.to(".gallery", 1, {y: "20%"}),
            TweenMax.to(".scroll-indicator", 1, {y: "-100%", scale: .5})

        ]);

        //Intro Scene
        new ScrollMagic.Scene({
            triggerElement: ".site-header",
            duration: "100%",
            triggerHook: 0
        })
            .setTween(introTween)
            .addTo(controller)
            //.addIndicators()
            .on("enter", function () {
                $(".site-header").removeClass('pinned');
            })
            .on("leave", function () {
                $(".site-header").addClass('pinned');
            });

        ///////////////////////
        // SVG Map Scene //
        ///////////////////////

        var $svgPath = $(".canvas path");

        // Get path lengths for a given SVG
        function getPathLength($el) {
            $el.each(function (i) {
                var lineLength = $el[i].getTotalLength();
                $(this).css("stroke-dasharray", lineLength);
                $(this).css("stroke-dashoffset", lineLength);
            });
        }
        getPathLength($svgPath);

        if ( $($svgPath).length > 0 ) {
            var mapTween = new TimelineMax().add(TweenMax.to($svgPath, 1, {strokeDashoffset: 0}));

            new ScrollMagic.Scene({
                triggerElement: "#contact",
                triggerHook:.75
            })
                .setTween(mapTween)
                .addTo(controller)
                //.addIndicators()
                .on("enter", function () {
                    $('.canvas').addClass('finished');
                })
                .on("leave", function () {
                    $('.canvas').removeClass('finished');
                });
        }

        // Bind click handler to menu items
        // so we can get a fancy smooth scroll animation
        $('a').on("click", function (e) {
            var href = $(this).attr("href"),
                offsetTop = href === "#" ? 0 : $(href).offset().top + 1;
            $('html, body').stop().animate({
                scrollTop: offsetTop
            }, 500);
            e.preventDefault();
        });
    });
});

