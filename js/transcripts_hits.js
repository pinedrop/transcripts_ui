(function($) {
        Drupal.behaviors.transcriptsHits = {
                attach: function(context, settings) {
                        $('.transcripts-hit-panel', context).once('transcripts').each(function() {
                                var trid = $(this).attr('data-trid');
                                var tridfix = '#' + trid + '-';
                                var $player = $('#' + trid);

                                $player.find('.transcripts-play-hit').click(function() {
                                        playOne(trid, $('#' + $(this).parents('.transcripts-hit-wrapper').attr('data-refid')));
                                });
                                $player.find('.transcripts-clear-hits').click(function() {
                                        $player.find('.transcripts-hit-panel').remove();
                                        $player.find('.transcripts-hit').removeClass('transcripts-hit');
                                        return false;
                                });
                        });
                }
        }
})(jQuery);
