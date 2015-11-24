/**
 * Created by edwardjgarrett on 11/12/15.
 */
(function ($) {
    Drupal.behaviors.transcriptSearchWrapper = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript-controls]', context)
                .addBack('[data-transcripts-role=transcript-controls]')
                .once('search-wrapper')
                .each(function () {
                    var controls = this;
                    $('.searchtrans, .transcript-search-wrapper > span', controls).click(function () {
                        $('.transcript-search-wrapper', controls).slideToggle();
                    });
                });
        }
    };
})(jQuery);