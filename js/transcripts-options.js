(function ($) {
    Drupal.behaviors.transcriptOptions = {
        attach: function (context, settings) {
            $('[data-transcripts-role=transcript-controls]', context)
                .addBack('[data-transcripts-role=transcript-controls]')
                .once('options')
                .each(function () {
                    var trid = $(this).attr('data-transcripts-id');
                    var $transcript = $('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']');

                    var $transcriptOptions = $('select.transcript-options', this);
                    $transcriptOptions.find('optgroup[data-type=languages] option').attr('selected', true);
                    $transcriptOptions.find('optgroup[data-type=speakers] option').attr('selected', true);
                    $transcriptOptions.find('optgroup[data-type=views] option').attr('selected', false);
                    $transcriptOptions.change(function (e) {
                            //language selection
                            $transcript.find('.tier').hide();
                            $('optgroup[data-type=languages] option:selected', this).each(function () {
                                $transcript.find('*[data-tier=' + $(this).val() + ']').show();
                            });

                            //speaker name selection
                            $transcript.find('.speaker-display').hide();
                            $('optgroup[data-type=speakers] option:selected', this).each(function () {
                                $transcript.find('*[data-speaker-display=' + $(this).val() + ']').show();
                            });
                            $transcript.toggleClass('no-speaker-names', $('optgroup[data-type=speakers] option:selected', this).length == 0);

                            //transcript view selection
                            $('optgroup[data-type=views] option', this).each(function() {
                                $transcript.toggleClass($(this).val(), $(this).prop('selected'));
                            });

                            e.preventDefault();
                        }
                    );

                    //hide buttons for tiers that have no data
                    $('optgroup[data-type=languages] option', $transcriptOptions).each(function () {
                        if ($transcript.find('*[data-tier=' + $(this).val() + ']').size() == 0) {
                            $(this).remove();
                        }
                    });

                    //hide buttons for speaker name formats that have no data
                    $('optgroup[data-type=speakers] option', $transcriptOptions).each(function () {
                        if ($transcript.find('*[data-speaker-display=' + $(this).val() + ']').size() == 0) {
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