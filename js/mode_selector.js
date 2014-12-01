(function($) {
        Drupal.behaviors.playerControls = {
                attach: function(context, settings) {
                        $('.mode-selector', context).once('transcripts').each(function() {
                                var trid = $(this).attr('data-trid');
                                var $player = $('#' + trid);

				var $modeSelect = $('.mode-select', this);
                                $modeSelect.val($player.attr('data-defaultmode'))
                                        .data('oldMode', $modeSelect.val())
                                        .change(
                                                function()
                                                        {
                                                                var oldMode = $(this).data('oldMode');
                                                                var goodbye = Drupal.settings['goodbye'][oldMode];
                                                                if (goodbye != '') {
                                                                        var fn = window[goodbye];
                                                                        if(typeof fn === 'function') {
                                                                                fn($player);
                                                                        }
                                                                }
                                                                var newMode = $(this).val();
                                                                var hello = Drupal.settings['hello'][newMode];
                                                                if (hello != '') {
                                                                        var fn = window[hello];
                                                                        if(typeof fn === 'function') {
                                                                                fn($player);
                                                                        }
                                                                }
                                                                $(this).data('oldMode', newMode);
                                                                $(this).blur();
                                                        }
                                        );
			});
		}
	}
})(jQuery);
