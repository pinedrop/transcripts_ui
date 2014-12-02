(function($) {
        Drupal.behaviors.transcriptsHits = {
                attach: function(context, settings) {
                        $('[data-transcripts-role=hit-panel]', context).once('transcripts').each(function() {
                                var trid = $(this).attr('data-transcripts-id');

                                $('*[data-transcripts-id=' + trid + ']').find('.transcripts-play-hit').click(function() {
                                        playOne(trid, $('#' + $(this).parents('.transcripts-hit-wrapper').attr('data-refid')));
                                });
                                $('*[data-transcripts-id=' + trid + ']').find('.transcripts-clear-hits').click(function() {
                                        $('*[data-transcripts-id=' + trid + ']').find('.transcripts-hit-panel').remove();
                                        $('*[data-transcripts-id=' + trid + ']').find('.transcripts-hit').removeClass('transcripts-hit');
                                        return false;
                                });
                        });
                }
        }
})(jQuery);
