(function($) {
        Drupal.behaviors.tierSelector = {
                attach: function(context, settings) {
                        $('.tier-selector', context).once('transcripts').each(function() {
                                var trid = $(this).attr('data-trid');
                                var tridfix = '#' + trid + '-';
                                var $player = $('#' + trid);
				
				var $tierSelector = $(this);
                                $tierSelector.find('option').attr('selected', true);
                                $tierSelector.change(function(e)
                                        {
                                                $player.find('.tier').removeClass('active');
                                                $('option:selected', this).each(function() {
                                                        $player.find('*[data-tier=' + $(this).val() + ']').addClass('active');
                                                });
                                                e.preventDefault();
                                        }
                                );

                                //hide buttons for tiers that have no data
                                $('option', $tierSelector).each(function() {
                                        if ($player.find('*[data-tier=' + $(this).val() + ']').size() == 0) {
						$(this).remove();                                                
                                        }
                                });
			});
		}
	};
})(jQuery);
