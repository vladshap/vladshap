$(document).ready(function () {

    // $('body').removeClass('loading');
    // setTimeout(function() {
    //     $('body').addClass('loaded');
    // }, 0);

    // Set the header height to the size of the viewport
    // var viewportHeight = 0;
    // function setHeaderHeight() {
    //     viewportHeight = $(window).height();
    //     $('.home-header').css('height', viewportHeight);
    //     //console.log("viewport height: " + viewportHeight);
    // }
    //
    // if ($('.home-header').length > 0) {
    //     // setHeaderHeight();
    // }


    // Similar to a debounce function, just making sure resize events don't get triggered for every pixel, and delays it by 250ms.
    var resizeTimer;
    $(window).on('resize', function(e) {

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // setHeaderHeight();
        }, 250);
    });

    // Some classes that I'll use to activate frames
    var activeFrame = 'frame--active',
        frames = ['#about', '#projects', '#photography', '#contact'],
        projects = ['.project__hightimes', '.project__northern-fork', '.project__flor', '.project__osx', '.project__work',
            '.insta-1', '.insta-2', '.insta-3', '.insta-4', '.insta-5', '.insta-6', '.insta-7', '.insta-8', '.insta-9'];

    // ScrollMagic controller
    var controller = new ScrollMagic.Controller();

    // Logo animation on scroll
    // var logo = new TimelineMax().add([
    //     TweenMax.to(".logo-text", 1, { y: "-150%", opacity: .5 }),
    //     TweenMax.to(".logo-mark", 1, { y: "10%", opacity: 0 }),
    //     TweenMax.to(".bg", 1, { opacity: .5 }),
    //     TweenMax.to(".scroll-indicator", 1, { opacity: 0 })
    // ]);



    // if ($('.home-header').length > 0) {
    //     new ScrollMagic.Scene({
    //         triggerElement: ".home-header",
    //         duration: "66.66%",
    //         triggerHook: 0
    //     })
    //         .setTween(logo)
    //         .addTo(controller);
    // }

    // Background pin

    // if($('#about').length > 0) {
    //     var bg = new ScrollMagic.Scene({
    //         triggerElement: "#about",
    //         triggerHook: .25
    //     })
    //     .setClassToggle('.home-header', 'header--stuck')
    //     .setPin('.bg')
    //     .addTo(controller);
    // }


    // var docheight = $(document).height();
    // var winheight = $(window).height();


    // function activateFrames () {
    //     // Activate frames as they scroll into view
    //     $.each(frames, function (i, el) {
    //         // console.log(frames[i]);
    //
    //         // if (frames[i].length > 0) {
    //             new ScrollMagic.Scene({
    //                 triggerElement: frames[i],
    //                 duration: "0",
    //                 triggerHook: .6
    //             })
    //                 .addTo(controller)
    //                 // .addIndicators()
    //                 .on("enter", function () {
    //                     $(frames[i]).addClass(activeFrame);
    //                     // $( 'a[href*="'+frames[i]+'"]' ).addClass('active');
    //                 })
    //                 .on("leave", function () {
    //                     $(frames[i]).removeClass(activeFrame);
    //                     // $( 'a[href*="'+frames[i]+'"]' ).removeClass('active');
    //                 });
    //             // var percentOffset = ( $(frames[i]).offset().top / (docheight - winheight) ) * 100;
    //             // $('.scroll-menu').append('<li style="top: '+ percentOffset.toFixed(2) +'%"><a href="' + frames[i] + '">'+ frames[i].replace('#', '') +'</a></li>');
    //         // }
    //     });
    // }
    // activateFrames();

    // function animateProjects () {
    //     // Animate projects as they scroll into view
    //     $.each(projects, function (i, el) {
    //         // console.log(projects[i]);
    //         new ScrollMagic.Scene({
    //             triggerElement: projects[i],
    //             duration: "0",
    //             triggerHook: .6
    //         })
    //             .addTo(controller)
    //             .on("enter", function () {
    //                 $(projects[i]).addClass('show');
    //             })
    //             .on("leave", function () {
    //                 $(projects[i]).removeClass('show');
    //             });
    //     });
    // }


    // Animating svg map on scroll
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
            triggerHook: .25
        })
            .setTween(mapTween)
            .addTo(controller)
            .on("enter", function () {
                $('.canvas').addClass('finished');
            })
            .on("leave", function () {
                $('.canvas').removeClass('finished');
            });
    }

    // Bind click handler to menu items so we can get a fancy smooth scroll animation
    $('a').on("click", function (e) {
        var href = $(this).attr("href"),
            offsetTop = href === "#" ? 0 : $(href).offset().top + 1;
        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 500);
        e.preventDefault();
    });

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

    // Load more instagrams
    // var loadButton = document.getElementById('load-more');
    // // // bind the load more button
    // loadButton.addEventListener('click', function() {
    //     feed.next();
    // });


    // if ($('#instafeed').length > 0) {
    //     feed.run();
    // }

    // Photoswipe photos
    var photoswipeGallery = function(gallerySelector) {

        // parse slide data (url, title, size ...) from DOM elements
        // (children of gallerySelector)
        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item;

            for(var i = 0; i < numNodes; i++) {

                figureEl = thumbElements[i]; // <figure> element

                // include only element nodes
                if(figureEl.nodeType !== 1) {
                    continue;
                }

                linkEl = figureEl.children[0]; // <a> element

                size = linkEl.getAttribute('data-size').split('x');

                // create slide object
                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };

                if(figureEl.children.length > 1) {
                    // <figcaption> content
                    item.title = figureEl.children[1].innerHTML;
                }

                if(linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute('src');
                }

                item.el = figureEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }

            return items;
        };

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && ( fn(el) ? el : closest(el.parentNode, fn) );
        };

        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            // find root element of slide
            var clickedListItem = closest(eTarget, function(el) {
                return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
            });

            if(!clickedListItem) {
                return;
            }

            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            var clickedGallery = clickedListItem.parentNode,
                childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;

            for (var i = 0; i < numChildNodes; i++) {
                if(childNodes[i].nodeType !== 1) {
                    continue;
                }

                if(childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }

            if(index >= 0) {
                // open PhotoSwipe if valid index found
                openPhotoSwipe( index, clickedGallery );
            }
            return false;
        };

        // parse picture index and photos index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
                params = {};

            if(hash.length < 5) {
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if(pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }

            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

            items = parseThumbnailElements(galleryElement);

            // define options (if needed)
            options = {

                // define photos index (for URL)
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                getThumbBoundsFn: function(index) {
                    // See Options -> getThumbBoundsFn section of documentation for more info
                    var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect();

                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                },
                // Gallery options
                maxSpreadZoom: 1,
                getDoubleTapZoom: function (isMouseClick, item) {
                    return item.initialZoomLevel;
                },
                // UI options
                zoomEl: true,
                fullscreenEl: false,
                shareEl: true,

                shareButtons: [
                    {id:'instagram', label:'Follow on Instagram', url:'https://www.instagram.com/vladshap/'},
                    {id:'twitter', label:'Tweet It', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
                    {id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'}
                ]

            };

            // PhotoSwipe opened from URL
            if(fromURL) {
                if(options.galleryPIDs) {
                    // parse real index when custom PIDs are used
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }

            // exit if index not found
            if( isNaN(options.index) ) {
                return;
            }

            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        // loop through all photos elements and bind events
        var galleryElements = document.querySelectorAll( gallerySelector );

        for(var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i+1);
            galleryElements[i].onclick = onThumbnailsClick;
        }

        // Parse URL and open photos if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if(hashData.pid && hashData.gid) {
            openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
        }
    };
    //
    // if ($('#instafeed').length > 0) {
    //     photoswipeGallery('.instafeed');
    // }


    $(".gallery").justifiedGallery({
        rowHeight : 300,
        margins : 5,
        selector: '.photo',
        lastRow: 'center'
    });


    $('.gallery').justifiedGallery().on('jg.complete', function (e) {
        photoswipeGallery('.gallery');
    });


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


    // var siteUrl = 'http://'+(document.location.hostname||document.location.host);
    //
    // $(document).delegate('a[href^="/"], a[href^="'+siteUrl+'"]', 'click', function(e) {
    //     e.preventDefault();
    //     History.pushState({}, '', this.pathname);
    //
    //     $('.site-nav a').removeClass();
    //     $(this).addClass('active');
    // });
    //
    // // Catch all History stateChange events
    // History.Adapter.bind(window, 'statechange', function(){
    //     var State = History.getState();
    //
    //     // Load the new state's URL via an Ajax Call
    //     $.get(State.url, function(data){
    //         // Replace the "<title>" tag's content
    //         document.title = data.match(/<title>(.*?)<\/title>/)[1];
    //
    //         // Replace the content of the main container (.content)
    //         // If you're using another div, you should change the selector
    //         $('.content').html($(data).find('.content'));
    //
    //
    //         // If you're using Google analytics, make sure the pageview is registered!
    //         ga('send', 'pageview', {
    //             'page': State.url,
    //             'title': document.title
    //         });
    //     });
    // });

});