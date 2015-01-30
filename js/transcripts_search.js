/**
 * Created by edwardjgarrett on 1/29/15.
 */
(function ($) {

    //http://drupal.stackexchange.com/questions/79521/invoke-custom-js-function-in-ajax-callback
    $.fn.transcriptSearchForm = function() {
        $(this).addClass('transcript-search-processed');

        var trid = $(this).attr('data-transcripts-id');
        var $transcript = $('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']');
        var $scroller = ScrollingTranscript.getUI($transcript);

        $('.searchreset', this).click(function () {
            $scroller.clearHits();
        });

        $('input:radio[name=transcript-search-options]', this).click(function() {
            if ($(this).attr('data-value') == 0) {
                $('li[data-tcuid]', $transcript).show();
            }
            else {
                $('li[data-tcuid]:not(:has(.hit))').hide();
            }
        });
        $('input:radio[name=transcript-search-options]', this).first().click();

        var hitCount = $('#transcript-results-count-' + trid).attr('data-results-count');
        if (hitCount > 0) {;
            var scrollHit = function(i) {
                var $tcu = $('li[data-tcuid]:has(.hit):eq(' + (i-1) + ')');
                $scroller.endAll();
                $scroller.setOne($tcu);
                $scroller.container.scrollTo($tcu);
                $('#transcript-results-count-' + trid).html(i + ' of ' + hitCount);
            };
            var hitIndex = 1;
            scrollHit(hitIndex);

            $('#transcript-nextresult-' + trid).click(function() {
                if (hitIndex < hitCount) {
                    hitIndex++;
                    scrollHit(hitIndex);
                }
            });
            $('#transcript-previousresult-' + trid).click(function() {
                if (hitIndex > 1) {
                    hitIndex--;
                    scrollHit(hitIndex);
                }
            });
        }
        // Overwrite beforeSubmit
        Drupal.ajax['searchbutton-transcript-' + trid].options.beforeSubmit = function (form_values, element, options) {
            $scroller.clearHits();
        };

        return this;
    };

    Drupal.behaviors.transcriptSearch = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript-search]', context).once('transcript-search').each(function () {
                $(this).transcriptSearchForm();
            });
        }
    };
})(jQuery);

