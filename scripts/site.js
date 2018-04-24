$(document).ready(function () {

    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll > 10) {
            $(".site-header").addClass("sticky");
        } else {
            $(".site-header").removeClass("sticky");
        }
    });

    $('body').removeClass('loading');

    $('body').waitForImages().done(function() {
        $(this).addClass('imgs-loaded');
    });



    $('#baseline').on("click", function() {
        $(".frame--styleguide").toggleClass('baseline');
    });

    $('.nav-toggle').on('click', function(e) {
        $('.site-nav').toggleClass('visible');
    });

    // Animating svg map on scroll
    // var $svgPath = $(".canvas path");
    //
    // // Get path lengths for a given SVG
    // function getPathLength($el) {
    //     $el.each(function (i) {
    //         var lineLength = $el[i].getTotalLength();
    //         $(this).css("stroke-dasharray", lineLength);
    //         $(this).css("stroke-dashoffset", lineLength);
    //     });
    // }
    // getPathLength($svgPath);
    //
    // if ( $($svgPath).length > 0 ) {
    //     var mapTween = new TimelineMax().add(TweenMax.to($svgPath, 1, {strokeDashoffset: 0}));
    //
    //     new ScrollMagic.Scene({
    //         triggerElement: "#contact",
    //         triggerHook: .25
    //     })
    //         .setTween(mapTween)
    //         .addTo(controller)
    //         .on("enter", function () {
    //             $('.canvas').addClass('finished');
    //         })
    //         .on("leave", function () {
    //             $('.canvas').removeClass('finished');
    //         });
    // }



    // Instagram feed
    // var imageCount = 1;
    // var feed = new Instafeed({
    //     get: 'user',
    //     userId: '12280671',
    //     resolution: 'standard_resolution',
    //     limit: '10',
    //     template:
    //     '<figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject" class="insta-{{model.customClassName}}">' +
    //         '<a href="{{image}}" itemprop="contentUrl" data-size="{{width}}x{{height}}">' +
    //             '<img src="{{image}}" id="{{id}}" alt="{{caption}}" itemprop="thumbnail" width="{{width}}" height="{{height}}"/>' +
    //         '</a>' +
    //         '<figcaption itemprop="caption description">{{caption}}</figcaption>' +
    //     '</figure>',
    //     accessToken: '12280671.1677ed0.b4f90dc8d77b4430bf876a02ca04baaf',
    //     after: function() {
    //         // animateProjects();
    //     },
    //     filter: function(image) {
    //         image.customClassName = imageCount;
    //         imageCount++;
    //         return true;
    //     }
    // });

    var gallery = '.gallery';

    if ( $(gallery).length > 0 ) {
        $(gallery).justifiedGallery({
            rowHeight : 300,
            margins : 10,
            selector: '.photo',
            lastRow: 'nojustify',
            captions: false
        });

        var slideSelector = 'a',
            options     = {
                shareEl: false,
                fullscreenEl: false
            },
            events = {
                close: function () {
                    // console.log('closed');
                }
            };

        // window.onload = getExif;

        $(gallery).justifiedGallery().on('jg.complete', function (e) {
            $(gallery).photoSwipe(slideSelector, options, events);

            var allPhotos = $('.photo');

            for (var i = 1; i <= allPhotos.length; i++) {
                var img = document.getElementById("img-" + i);
                console.log(img);
                EXIF.getData(img, function() {
                    var make = EXIF.getTag(this, "Make");
                    var model = EXIF.getTag(this, "Model");


                    console.log("make: " + make);
                    console.log("model: " + model);
                });


            }
        });

    } else {
            // console.log('no gallery');

    }

    function checkForm($el) {
        $($el).keyup(function () {

            var empty = false;
            $('.contact-form > .input[required]').each(function () {
                if ($(this).val() == '') {
                    empty = true;
                }
            });

            if (empty) {
                $('#send-message').attr('disabled', 'disabled').text('Finish Your Message');
            } else {
                $('#send-message').removeAttr('disabled').text('Send Message');
            }
        });
    }
    checkForm('.contact-form .input');




    function debounce(a,b,c){var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}}

    var TiltAnimation = function() {
    
    var
        hero,
        mouseX,
        mouseY;

    var _init = function() {
        mouseX    = 0;
        mouseY    = 0;
        slider    = document.getElementById('about--image');
        
        _addEventHandlers();    
    }
    
    var _addEventHandlers = function() {
        window.addEventListener('mousemove', _getMousePos, false);
        // if (window.DeviceMotionEvent != undefined) {
        // window.addEventListener('devicemotion', _accelerometerUpdate, false);
        // }
    }
    
    // var _accelerometerUpdate = function(e) {
    //     // http://stackoverflow.com/questions/4474508/access-accelerometer-via-javascript-in-android
    //     var aX = event.accelerationIncludingGravity.x*1;
    //     var aY = event.accelerationIncludingGravity.y*1;
    //     var aZ = event.accelerationIncludingGravity.z*1;
    //     //The following two lines are just to calculate a
    //     // tilt. Not really needed. 
    //     var xPosition = Math.atan2(aY, aZ) * 20;
    //     var yPosition = Math.atan2(aX, aZ) * 20;
        
    //     xPosition = Math.round(xPosition * 1000) / 1000;
    //     yPosition = Math.round(yPosition * 1000) / 1000;
        
    //     _animate(yPosition, xPosition);
        
    // }
    
    var _getMousePos = function(e) {
        e = e || window.event;
        
        mouseX = e.pageX;
        mouseY = e.pageY;
        
        var xPos = (mouseX / window.innerWidth) - 0.5;
        var yPos = (mouseY / window.innerHeight) - 0.5;
        var rotationYValue = 5 * xPos;
        var rotationXValue = 5 * yPos;
        
        _animate(rotationYValue,rotationXValue);
    }

    if (slider) {
        var _animate = function(rotationYValue, rotationXValue) {
            TweenLite.to(slider, .25, { rotationY:rotationYValue, rotationX:rotationXValue, ease:Power1.easeOut, transformPerspective:900, transformOrigin:"center" });
        }
    }
    
    return {
        init: _init
    }
    }();

    TiltAnimation.init();
});