(function($) {
	Drupal.behaviors.transcriptNavigation = {
		attach: function(context, settings) {
			$('[data-transcripts-role=transcript-controls]', context).once('navigation').each(function() {
				var trid = $(this).attr('data-transcripts-id');
				
				var $nav = $(this);
				if ($nav.is(':empty')) {
					$nav.css({'height':'0px'});
				}
				$nav.find('.previous').click(function() {
					previous(trid);
				});
				$nav.find('.sameagain').click(function() {
					sameAgain(trid);
				});
				$nav.find('.next').click(function() {
					next(trid);
				});
				$nav.find('.play-transcript').click(function() {
					$(this).toggleClass('hidden-transcript');
					$('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']').toggle();
				});		
			});
		}
	}
})(jQuery);
