(function($) {
	Drupal.behaviors.videoControls = {
		attach: function(context, settings) {
			$('[data-transcripts-role=video-controls]', context).once('transcripts').each(function() {
				var trid = $(this).attr('data-transcripts-id');
				
				var $controls = $(this);
				if ($controls.is(':empty')) {
					$controls.css({'height':'0px'});
				}
				$controls.find('.previous').click(function() {
					previous(trid);
				});
				$controls.find('.sameagain').click(function() {
					sameAgain(trid);
				});
				$controls.find('.next').click(function() {
					next(trid);
				});

				$controls.find('.play-transcript').click(function() {
					$(this).toggleClass('without-transcript');
					$('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']').toggle();
				});		
			});
		}
	}
})(jQuery);
