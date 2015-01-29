/**
 * Created by edwardjgarrett on 1/29/15.
 */
(function ($) {
    Drupal.behaviors.transcriptsSearch = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript-controls]', context).once('transcripts-search').each(function () {
                var trid = $(this).attr('data-transcripts-id');
                var $scroller = ScrollingTranscript.getUI($('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']'));

                var $search = $('.transcripts-ui-search-form', this);
                $('.searchreset', $search).click(function () {
                    $scroller.clearHits();
                });

                // Overwrite beforeSubmit
                Drupal.ajax['searchbutton-transcript-' + trid].options.beforeSubmit = function (form_values, element, options) {
                    $scroller.clearHits();
                }
            });
        }
    };
})(jQuery);

