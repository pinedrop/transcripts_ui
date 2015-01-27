(function ($) {
    Drupal.behaviors.tierSelector = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript-controls]', context).once('tier-selector').each(function () {
                var trid = $(this).attr('data-transcripts-id');

                var $tierSelector = $('.tier-selector', this);
                $tierSelector.find('option').attr('selected', true);
                $tierSelector.change(function (e) {
                        $('*[data-transcripts-id=' + trid + ']').find('.tier').removeClass('active');
                        $('option:selected', this).each(function () {
                            $('*[data-transcripts-id=' + trid + ']').find('*[data-tier=' + $(this).val() + ']').addClass('active');
                        });
                        e.preventDefault();
                    }
                );

                //hide buttons for tiers that have no data
                $('option', $tierSelector).each(function () {
                    if ($('*[data-transcripts-id=' + trid + ']').find('*[data-tier=' + $(this).val() + ']').size() == 0) {
                        $(this).remove();
                    }
                });
            });
        }
    };
})(jQuery);
