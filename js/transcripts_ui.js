(function ($) {

    Drupal.behaviors.scrollingTranscript = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript]', context)
                .once('scrolling-transcript')
                .each(function () {
                    ScrollingTranscript.getUI($(this));
                });
        }
    }

    ScrollingTranscript = (function () {
        var ui = [];

        function createUI($transcript) {

            var transid = $transcript.attr('data-transcripts-id');
            var vid = $('[data-transcripts-role=video][data-transcripts-id=' + transid + ']').find('video,audio')[0];

            var obj = {
                sweetSpot: 0,
                resetSweet: true,
                playSentence: 0,
                playIndex: 0,
                startPointer: 0,
                lastNow: 0,
                one: null,
                trid: transid,

                starts: $('*[data-begin]', $transcript).not('.deleted').map(function (element, index) {
                    var o = {};
                    o.$item = $(this);
                    o.begin = $(this).attr('data-begin');
                    o.end = $(this).attr('data-end');
                    return o;
                }).toArray().sort(function (a, b) {
                    return a.begin - b.begin;
                }),

                ends: $('*[data-end]', $transcript).not('.deleted').map(function (element, index) {
                    var o = {};
                    o.$item = $(this);
                    o.begin = $(this).attr('data-begin');
                    o.end = $(this).attr('data-end');
                    return o;
                }).toArray().sort(function (a, b) {
                    return a.end - b.end;
                }),

                playOne: function ($item) {
                    var reset = typeof this.resetSweet !== 'undefined' ? this.resetSweet : true;
                    if ($item.attr('data-end') - $item.attr('data-begin') > 0) {
                        this.one = $item;
                        this.endAll();
                        if (reset) {
                            this.sweetSpot = $item.position().top;
                        }
                        this.playIndex = parseInt($item.attr('data-starts-index'));
                        vid.currentTime = $item.attr('data-begin');
                        if (vid.paused) vid.play();
                    }
                },

                previous: function () {
                    var n = this.playIndex > 0 ? this.playIndex - 1 : 0;
                    this.resetSweet = false; //will be set back to true after line is played
                    window.location.hash = 'tcu/' + $(this.starts[n].$item).attr('id');
                },

                sameAgain: function () {
                    /* can't set window.location.hash because it won't change */
                    this.playOne($(this.starts[this.playIndex].$item));
                },

                next: function () {
                    var n = this.playIndex == this.starts.length - 1 ? this.playIndex : this.playIndex + 1;
                    this.resetSweet = false; //will be set back to true after line is played
                    window.location.hash = 'tcu/' + $(this.starts[n].$item).attr('id');
                },

                startPlay: function ($id) {
                    $id.addClass('playing'); //sentence
                    $('[data-transcripts-role=hit-panel][data-transcripts-id=' + this.trid + ']').find('*[data-refid=' + $id.attr('id') + ']').addClass('playing'); //hit result
                    //var $scroller = $('body');
                    var $scroller = $transcript; //make OPTION
                    if ($scroller.size() == 1) {
                        var idTop = $id.position().top;

                        //sentence out of view above
                        if (idTop < 0 && this.sweetSpot < 0) {
                            this.sweetSpot = 0;
                            $scroller.scrollTo($id);
                        }

                        //sentence above scroll sweet spot
                        else if (idTop < 0 || idTop < this.sweetSpot) {
                            $scroller.scrollTo('-=' + (this.sweetSpot - idTop), {axis: 'y'});
                        }
                        //sentence below scroll sweet spot
                        else {
                            $scroller.scrollTo('+=' + (idTop - this.sweetSpot), {axis: 'y'});

                            //sentence out of view below
                            if ($id.position().top > $scroller.height() - $id.height()) {
                                $scroller.scrollTo($id);
                            }
                        }
                    }
                },

                endPlay: function ($id) {
                    $id.removeClass('playing'); //sentence
                    $('[data-transcripts-role=hit-panel][data-transcripts-id=' + this.trid + ']').find('*[data-refid=' + $id.attr('id') + ']').removeClass('playing'); //hit result

                    //change sweet spot if user scrolls transcript while playing
                    this.sweetSpot = $id.position().top;
                },

                endAll: function () {
                    var that = this;
                    $('.playing', $transcript).each(function () {
                        that.endPlay($(this));
                    });
                },

            };

            for (var i = 0; i < obj.starts.length; i++) {
                obj.starts[i].$item.attr('data-starts-index', i);
            }

            var playPause = function (e) {
                //var vid = e.target;
                if (!vid.paused) { //if playing
                    var now = vid.currentTime;
                    if (obj.one != null && (now < parseFloat(obj.one.attr('data-begin')) - .1 || now > parseFloat(obj.one.attr('data-end')) + .1)) {
                        obj.one = null;
                    }
                }
            };

            var timeUpdated = function (e) {
                //var vid = e.target;
                var now = vid.currentTime;

                //if playmode=playstop, then don't keep scrolling when you stop
                if (!vid.paused && obj.one != null && now > obj.one.attr('data-end')) {
                    vid.pause();
                    now = vid.currentTime;
                    obj.lastNow = now;
                }

                //clean highlights and scroll
                if (!vid.paused || Math.abs(obj.lastNow - now) > .2) {
                    //if (obj.lastNow != now) {
                    $('.playing', $transcript).each(function () {
                        if (now < $(this).attr('data-begin') || now > $(this).attr('data-end')) {
                            obj.endPlay($(this));
                        }
                    });
                    if (now < obj.lastNow) {
                        obj.startPointer = 0; //go back to start
                        obj.playIndex = 0;
                    }
                    while (now > obj.starts[obj.startPointer]['begin']) {
                        if (now < obj.starts[obj.startPointer]['end']) {
                            obj.playIndex = obj.startPointer;
                            obj.startPlay(obj.starts[obj.startPointer].$item);
                        }
                        obj.startPointer++;
                    }
                    obj.lastNow = now;
                    //}
                }
            };
            vid.setAttribute('data-transcripts-id', obj.trid);
            vid.addEventListener('play', playPause, false);
            vid.addEventListener('pause', playPause, false);
            vid.addEventListener('timeupdate', timeUpdated, false);
            vid.addEventListener('loadedmetadata', function () {
                var jump = $.param.fragment();
                if (jump != '') {
                    obj.playOne($('#' + jump.replace('tcu/', '')));
                }
            });

            window.addEventListener("hashchange", function () {
                obj.playOne($(window.location.hash.replace('tcu/', '')));
                obj.resetSweet = true;
            }, false);

            return obj;

        }

        return {
            getUI: function ($transcript) {
                var trid = $transcript.attr('data-transcripts-id');

                if (!ui[trid]) {
                    ui[trid] = createUI($transcript);
                }
                return ui[trid];
            }
        };
    })();
})(jQuery);
