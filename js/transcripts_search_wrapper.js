/**
 * Created by edwardjgarrett on 11/12/15.
 */
(function ($) {
    Drupal.behaviors.transcriptSearchWrapper = {
        attach: function (context, settings) {
            $('.transcript-search-wrapper > span', context)
                .once('toggle')
                .click(function() {
                    $(this).parent().slideToggle();
                });
        }
    };
})(jQuery);