(function ($) {
    Drupal.behaviors.transcriptOptions = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript-controls]', context)
                .addBack('[data-transcripts-role=transcript-controls]')
                .once('options')
                .each(function () {
                    var trid = $(this).attr('data-transcripts-id');

                    var $transcriptOptions = $('select.transcript-options', this);
                    $transcriptOptions.find('optgroup[data-type=languages] option').attr('selected', true);
                    $transcriptOptions.find('optgroup[data-type=speakers] option').attr('selected', true)
                    $transcriptOptions.change(function (e) {
                            //language selection
                            $('*[data-transcripts-id=' + trid + ']').find('.tier').hide();
                            $('optgroup[data-type=languages] option:selected', this).each(function () {
                                $('*[data-transcripts-id=' + trid + ']').find('*[data-tier=' + $(this).val() + ']').show();
                            });

                            //speaker name selection
                            $('*[data-transcripts-id=' + trid + ']').find('.speaker-display').hide();
                            $('optgroup[data-type=speakers] option:selected', this).each(function () {
                                $('*[data-transcripts-id=' + trid + ']').find('*[data-speaker-display=' + $(this).val() + ']').show();
                            });
                            e.preventDefault();
                        }
                    );

                    //hide buttons for tiers that have no data
                    $('optgroup[data-type=languages] option', $transcriptOptions).each(function () {
                        if ($('*[data-transcripts-id=' + trid + ']').find('*[data-tier=' + $(this).val() + ']').size() == 0) {
                            $(this).remove();
                        }
                    });

                    //hide buttons for speaker name formats that have no data
                    $('optgroup[data-type=speakers] option', $transcriptOptions).each(function () {
                        if ($('*[data-transcripts-id=' + trid + ']').find('*[data-speaker-display=' + $(this).val() + ']').size() == 0) {
                            $(this).remove();
                        }
                    });

                    $transcriptOptions.selectpicker({
                        dropupAuto: false
                    }); // initiates jq-bootstrap-select
                    $('button.selectpicker span:first-child', this).replaceWith('<span class="glyphicon glyphicon-globe"></span>');
                });
        }
    };
})(jQuery);
