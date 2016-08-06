﻿$(document).ready(function () {

    $('img').waitForImages().done(function() {
        // All descendant images have loaded, now slide up.

        $('body').removeClass('loading-images');

        setTimeout(function() {
            $('body').removeClass('loading');

            setTimeout(function() {
                $('body').addClass('loaded');

            }, 1000);
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
            viewportHeight = $(window).height();
            $('.site-header').css('height', viewportHeight);
            //console.log("viewport height: " + viewportHeight);

        }
        setFrameHeight();

        //$(window).on("resize", function() {
        //    setFrameHeight();
        //});

        // ScrollMagic controller
        var controller = new ScrollMagic.Controller({
            globalSceneOptions: {
                triggerHook: 0
            }
        });

        // Intro Scene Tween
        var introTween = new TimelineMax().add([
            TweenMax.to(".logo-mark", 1, {scale:.85, y: "30%", opacity:0}),
            TweenMax.to(".gallery", 1, {y: "20%"})
        ]);

        //Intro Scene
        new ScrollMagic.Scene({
            triggerElement: ".site-header",
            duration: "100%"
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

        //var frames = [".frame__about", ".frame__projects", ".frame__contact", ".frame__travel"],
        //    activeClass = "frame--active",
        //    totalFrames = frames.length;
        //
        //for (var i = 0; i < totalFrames; i++) {
        //    if ($(frames[i]).length > 0) {
        //        new ScrollMagic.Scene({
        //            triggerElement: frames[i],
        //            duration: $(frames[i]).outerHeight()
        //        })
        //            .setClassToggle(frames[i], activeClass)
        //            .addTo(controller);
        //    }
        //}


        ///////////////////////
        // Chicago Map Scene //
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
            var chicagoTween = new TimelineMax().add(TweenMax.to($svgPath, 1, {strokeDashoffset: 0}));

            new ScrollMagic.Scene({
                triggerElement: "#contact",
                duration: 1,
                tweenChanges: true,
                triggerHook: 0,
                offset: 0
            })
                .setTween(chicagoTween)
                .addTo(controller)
                //.addIndicators()
                .on("end", function () {
                    $('.canvas').toggleClass('finished');
                });
        }

        // Bind click handler to menu items
        // so we can get a fancy scroll animation
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

