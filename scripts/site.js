$(document).ready(function () {

    // $('img').waitForImages().done(function() {
        $('body').removeClass('loading');
        setTimeout(function() {
            $('body').addClass('loaded');
        }, 0);

        var viewportHeight = 0;
        function setFrameHeight() {
            viewportHeight = $(window).height() - 200;
            // $('.site-header').css('height', viewportHeight);
            // console.log("viewport height: " + viewportHeight);
        }
        // setFrameHeight();

        // ScrollMagic controller
        var controller = new ScrollMagic.Controller();

        // Intro Scene Tween
        var introTween = new TimelineMax().add([
            TweenMax.to(".site-logo", 1, {scale:.9, y: "20%", opacity:0}),
            TweenMax.to(".scroll-indicator", 1, {y: "-90%", scale: .5, opacity: 0})

        ]);

        // Intro Scene
        new ScrollMagic.Scene({
            triggerElement: ".site-header",
            duration: "100%",
            triggerHook: 0
        })
            .setTween(introTween)
            .addTo(controller);

            //.addIndicators()
            // .on("enter", function () {
            //     $(".site-header").removeClass('pinned');
            // })
            // .on("leave", function () {
            //     $(".site-header").addClass('pinned');
            // });

        new ScrollMagic.Scene({
            triggerElement: "#about",
            duration: "0",
            triggerHook: .5
        })
            .addTo(controller)
            .on("enter", function () {
                $("#about").addClass('active');
            });
        new ScrollMagic.Scene({
            triggerElement: "#projects",
            duration: "0",
            triggerHook: .5
        })
            .addTo(controller)
            .on("enter", function () {
                $("#projects").addClass('active');
            });
        new ScrollMagic.Scene({
            triggerElement: "#photography",
            duration: "0",
            triggerHook: .5
        })
            .addTo(controller)
            .on("enter", function () {
                $("#photography").addClass('active');
            });
        new ScrollMagic.Scene({
            triggerElement: "#contact",
            duration: "0",
            triggerHook: .5
        })
            .addTo(controller)
            .on("enter", function () {
                $("#contact").addClass('active');
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


        var loadButton = document.getElementById('load-more');
        // Instagram
        var feed = new Instafeed({
            get: 'user',
            userId: '12280671',
            resolution: 'standard_resolution',
            limit: '9',
            template:
            '<figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">' +
                '<a href="{{image}}" itemprop="contentUrl"  data-size="{{width}}x{{height}}">' +
                    '<img src="{{image}}" id="{{id}}" alt="{{caption}}" itemprop="thumbnail" width="{{width}}" height="{{height}}"/>' +
                '</a>' +
            '   <figcaption itemprop="caption description">{{caption}}</figcaption>' +
            '</figure>',
            accessToken: '12280671.1677ed0.b4f90dc8d77b4430bf876a02ca04baaf',
            after: function() {
                // disable button if no more results to load
                if (!this.hasNext()) {
                    loadButton.setAttribute('disabled', 'disabled');
                }
            }
        });

        // bind the load more button
        loadButton.addEventListener('click', function() {
            feed.next();
        });
        feed.run();

        var initPhotoSwipeFromDOM = function(gallerySelector) {

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

            // parse picture index and gallery index from URL (#&pid=1&gid=2)
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

                    // define gallery index (for URL)
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
                    zoomEl: false,
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

            // loop through all gallery elements and bind events
            var galleryElements = document.querySelectorAll( gallerySelector );

            for(var i = 0, l = galleryElements.length; i < l; i++) {
                galleryElements[i].setAttribute('data-pswp-uid', i+1);
                galleryElements[i].onclick = onThumbnailsClick;
            }

            // Parse URL and open gallery if it contains #&pid=3&gid=1
            var hashData = photoswipeParseHash();
            if(hashData.pid && hashData.gid) {
                openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
            }
        };

        // execute above function
        initPhotoSwipeFromDOM('.instafeed');


    // });
});

