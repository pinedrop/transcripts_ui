var one = [];
var stillStopped = [];
var playMode = [];
var playSentence = [];
var playIndex = [];
var starts = [];
var ends = [];
var startPointer = [];
var lastNow = [];
var playListeners = [];
var sweetSpot = [];
var resetSweet = [];


(function($) {
		Drupal.behaviors.transcriptUI = {
			attach: function(context, settings) {
				$('[data-transcripts-role=transcript]', context).once('transcripts').each(function() {
					var trid = $(this).attr('data-transcripts-id');
					var $transcript = $('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']');
	
					sweetSpot[trid] = 0;
					resetSweet[trid] = true;
					playSentence[trid] = 0; //timeout for playing single sentence
					playIndex[trid] = 0;
					startPointer[trid] = 0;
					lastNow[trid] = 0;
					playListeners[trid] = [];
					
					recomputeSentenceStack($transcript);
					
					$('*[data-begin]', $('*[data-transcripts-id=' + trid + ']')).each(function() {
						var $s = $(this);
						$('.infocontrols button', this).button({
							icons: {
								primary: 'ui-icon-play'
							},
							text: false
						}).click(function() {
	               					window.location.hash = 'tcu/' + $s.attr('id');
						});
					});
					
					enableClickAndPlay($transcript);
					setPlayMode(trid, 'playstop');
					attachListeners(trid);
				
					window.addEventListener("hashchange", function() {
						playOne(trid, $(window.location.hash.replace('tcu/', '')));
						resetSweet[trid] = true;
					}, false);
				});
			}
		}
})(jQuery);

function recomputeSentenceStack($transcript) {
	var trid = $transcript.attr('data-transcripts-id');
	starts[trid] = $transcript.find('*[data-begin]').not('.deleted').map(function(element, index) {
		var o = {};
		o.$item = jQuery(this);
		o.begin = jQuery(this).attr('data-begin');
		o.end = jQuery(this).attr('data-end');
		return o;                    
	}).toArray().sort(function(a,b) {
		return a.begin - b.begin;
	});
	for (var i=0; i<starts[trid].length; i++) {
		starts[trid][i].$item.attr('data-starts-index', i);
	}
	ends[trid] = $transcript.find('*[data-end]').not('.deleted').map(function(element, index) {
		var o = {};
		o.$item = jQuery(this);
		o.begin = jQuery(this).attr('data-begin');
		o.end = jQuery(this).attr('data-end');
		return o; 
	}).toArray().sort(function(a,b) {
		return a.end - b.end;
	});
}

function enableClickAndPlay($transcript) {
	$transcript.delegate('*[data-begin]', 'mouseover', function() {
  		jQuery(this).css('cursor', 'pointer');
	});
	$transcript.delegate('*[data-begin]', 'click', function() {
	        window.location.hash = 'tcu/' + jQuery(this).attr('id');
  	});
}

function disableClickAndPlay($transcript) {
	$transcript.undelegate('*[data-begin]');
}

function attachListeners(trid) {
	if (jQuery('[data-transcripts-role=video][data-transcripts-id=' + trid + ']').size() > 0) {
		var vid = jQuery('[data-transcripts-role=video][data-transcripts-id=' + trid + ']').find('video,audio')[0];
		vid.setAttribute('data-transcripts-id', trid);
		vid.addEventListener('play', playPause, false);
		vid.addEventListener('pause', playPause, false);
		vid.addEventListener('timeupdate', timeUpdated, false);
		vid.addEventListener('loadedmetadata', function() {
			var jump = jQuery.param.fragment();
			if (jump != '') {
				playOne(trid, jQuery('#' + jump.replace('tcu/', '')));
			}
		});
	}
}

// HTML 5 event listeners

function timeUpdated(e) {
	var vid = e.target;
  var now = vid.currentTime;
  var trid = vid.getAttribute('data-transcripts-id');

  //if playmode=playstop, then don't keep scrolling when you stop
  if (!vid.paused && one[trid] != null && now > one[trid].attr('data-end')) {
  	vid.pause();
  	now = vid.currentTime;
  	lastNow[trid] = now;
  }

  //clean highlights and scroll
  if (!vid.paused || Math.abs(lastNow[trid] - now) > .2) {
  //if (lastNow[trid] != now) {
		jQuery('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']').find('.playing').each(function() {
			if (now < jQuery(this).attr('data-begin') || now > jQuery(this).attr('data-end')) {
				endPlay(trid, jQuery(this));
			}
		});
		if (now < lastNow[trid]) {
			startPointer[trid] = 0; //go back to start
			playIndex[trid] = 0;
		}
		while (now > starts[trid][startPointer[trid]]['begin']) {
			if (now < starts[trid][startPointer[trid]]['end']) {
				playIndex[trid] = startPointer[trid];
				startPlay(trid, starts[trid][startPointer[trid]].$item);
			}
			startPointer[trid]++;
		}
		lastNow[trid] = now;
  }
}

function playPause(e) {
	var vid = e.target;
	if (!vid.paused) { //if playing
		var now = vid.currentTime;
		var trid = vid.getAttribute('data-transcripts-id');
		if (one[trid] != null && (now < parseFloat(one[trid].attr('data-begin'))-.1 || now > parseFloat(one[trid].attr('data-end'))+.1)) {
			one[trid] = null;
		}
	}
}

// mode control
function setPlayMode(trid, mode) {
	playMode[trid] = mode;
	one[trid] = null; //especially when switching to playthru
}

function getPlayMode(trid) {
	return playMode[trid];
}

// play methods

function playOne(trid, $item) {
	var reset = typeof resetSweet[trid] !== 'undefined' ? resetSweet[trid] : true;
	var vid = jQuery('[data-transcripts-role=video][data-transcripts-id=' + trid + ']').find('video,audio')[0];
      if ($item.attr('data-end') - $item.attr('data-begin') > 0) {
        if (playMode[trid] == 'playstop') {
            one[trid] = $item;
        }
        if (jQuery('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']').size() == 1) {
            endAll(trid);
            if (reset) {
                sweetSpot[trid] = $item.position().top;
            }
            
        }
        playIndex[trid] = parseInt($item.attr('data-starts-index'));
        vid.currentTime = $item.attr('data-begin');
        if (vid.paused) vid.play();
      }
}

function addPlayListener(trid, func) {
	if (jQuery.inArray(func, playListeners[trid]) == -1) {
		playListeners[trid].push(func);
	}
}

function removePlayListener(trid, func) {
	playListeners[trid].splice(jQuery.inArray(func, playListeners[trid]), 1);
}

function startPlay(trid, $id) {
  $id.addClass('playing'); //sentence
  jQuery('[data-transcripts-role=hit-panel][data-transcripts-id=' + trid + ']').find('*[data-refid=' + $id.attr('id') + ']').addClass('playing'); //hit result
  for (var i=0; i<playListeners[trid].length; i++) {
  	var func = playListeners[trid][i];
  	func(trid, $id, 'startPlay');
  }
  var $scroller = jQuery('.transcript-content');
  //var $scroller = jQuery('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']');
  if ($scroller.size() == 1) {
  	var idTop = $id.position().top;

  	//sentence out of view above
  	if (idTop < 0 && sweetSpot[trid] < 0) {
  		sweetSpot[trid] = 0;
  		$scroller.scrollTo($id);
  	}
  	
  	//sentence above scroll sweet spot
  	else if (idTop < 0 || idTop < sweetSpot[trid]) {
  		$scroller.scrollTo('-=' + (sweetSpot[trid]-idTop), {axis: 'y'});
  	}
  	//sentence below scroll sweet spot
  	else {
  		$scroller.scrollTo('+=' + (idTop-sweetSpot[trid]), {axis: 'y'});

  		//sentence out of view below
  		if ($id.position().top > $scroller.height()-$id.height()) {
  			$scroller.scrollTo($id);
  		}
  	}
  }
}

function endPlay(trid, $id) {
  $id.removeClass('playing'); //sentence
  jQuery('[data-transcripts-role=hit-panel][data-transcripts-id=' + trid + ']').find('*[data-refid=' + $id.attr('id') + ']').removeClass('playing'); //hit result
  
  //change sweet spot if user scrolls transcript while playing
  if (jQuery('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']').size() == 1) {
  	sweetSpot[trid] = $id.position().top;
  }
  
  for (var i=0; i<playListeners[trid].length; i++) {
  	var func = playListeners[trid][i];
  	func(trid, $id, 'endPlay');
  }
}

function endAll(trid) {
	jQuery('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']').find('.playing').each(function() {
		endPlay(trid, jQuery(this));
	});
}

function previous(trid) {
  var n = playIndex[trid] > 0 ? playIndex[trid]-1 : 0;
  resetSweet[trid] = false; //will be set back to true after line is played
  window.location.hash = 'tcu/' + jQuery(starts[trid][n].$item).attr('id');
}
        
function sameAgain(trid) {
  /* can't set window.location.hash because it won't change */
  playOne(trid, jQuery(starts[trid][playIndex[trid]].$item));
}

function next(trid) {
  var n = playIndex[trid] == starts[trid].length-1 ? playIndex[trid] : playIndex[trid]+1;
  resetSweet[trid] = false; //will be set back to true after line is played
  window.location.hash = 'tcu/' + jQuery(starts[trid][n].$item).attr('id');
}
