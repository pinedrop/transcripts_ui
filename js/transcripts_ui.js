(function ($) {

    Drupal.behaviors.scrollingTranscript = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript]', context)
                .addBack('[data-transcripts-role=transcript]')
                .once('scrolling-transcript')
                .each(function () {
                    var trid = $(this).attr('data-transcripts-id');
                    Drupal.settings.scrollingTranscript[trid] = ScrollingTranscript.getUI($(this)).setVideo($('[data-transcripts-role=video][data-transcripts-id=' + trid + ']').find('video,audio')[0]);
                });
        }
    }

})(jQuery);
