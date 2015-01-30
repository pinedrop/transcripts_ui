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
        var hitCount = $('#transcript-results-count-' + trid).attr('data-results-count');
        var hitIndex = 1;
        var scrollHit = function(i) {
            var $tcu = $('li[data-tcuid]:has(.hit):eq(' + (i-1) + ')');
            $scroller.endAll();
            $scroller.setOne($tcu);
            $scroller.container.scrollTo($tcu);
            $('#transcript-results-count-' + trid).html(i + ' of ' + hitCount);
        };

        $('input:radio[name=transcript-search-options]', this).click(function() {
            if ($(this).attr('data-value') == 0) {
                $('li[data-tcuid]', $transcript).show();
                if (hitCount > 0) {
                    scrollHit(hitIndex);
                }
            }
            else {
                $('li[data-tcuid]:not(:has(.hit))').hide();
                if (hitCount > 0) {
                    scrollHit(hitIndex);
                }
            }
        });
        $('input:radio[name=transcript-search-options]', this).first().click();
;
        if (hitCount > 0) {
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

            scrollHit(hitIndex);
        }

        var $form = $(this);
        $('#transcript-reset-button-' + trid).click(function () {
            $form.removeClass('has-searched');
            $scroller.clearHits();
        });

        // Overwrite beforeSubmit
        Drupal.ajax['transcript-search-button-' + trid].options.beforeSubmit = function (form_values, element, options) {
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

