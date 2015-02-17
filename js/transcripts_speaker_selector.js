(function ($) {
    Drupal.behaviors.speakerSelector = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript-controls]', context)
                .addBack('[data-transcripts-role=transcript-controls]')
                .once('speaker-selector')
                .each(function () {
                    var trid = $(this).attr('data-transcripts-id');
                    var $speakerSelector = $('.speaker-selector', this);
                });
        }
    };
})(jQuery);
