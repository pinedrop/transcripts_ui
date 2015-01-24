(function ($) {

    Drupal.behaviors.scrollingTranscript = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript]', context)
                .once('scrolling-transcript')
                .each(function () {
                    ScrollingTranscript
                        .getUI($(this), $(this))
                        .setVideo($('[data-transcripts-role=video][data-transcripts-id=' + $(this).attr('data-transcripts-id') + ']').find('video,audio')[0]);
                });
        }
    }

})(jQuery);
