(function ($) {

    Drupal.behaviors.scrollingTranscript = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript]', context)
                .addBack('[data-transcripts-role=transcript]')
                .once('scrolling-transcript')
                .each(function () {
                    var trid = $(this).attr('data-transcripts-id');
                    var scroller = ScrollingTranscript.getUI($(this));
                    scroller.setContainer($(this).parents('.transcript-container'));
                    scroller.setVideo($('[data-transcripts-role=video][data-transcripts-id=' + trid + ']').find('video,audio')[0]);
                    Drupal.settings.scrollingTranscript[trid] = scroller;
                });
        }
    }

})(jQuery);
