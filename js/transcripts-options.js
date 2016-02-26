(function ($) {
    Drupal.behaviors.transcriptOptions = {
        attach: function (context, settings) {
            var pad = function (num) {
                return ("00" + num).substr(num.toString().length);
            };

            var formatSeconds = function (seconds, millisep) {
                if (seconds == 0) {
                    return "00:00:00,000";
                }
                else {
                    decimal = (seconds % 1).toFixed(3).substring(2);
                    seconds = Math.floor(seconds);
                    s = seconds % 60;
                    m = Math.floor(seconds / 60);
                    h = Math.floor(seconds / 3600);
                    return pad(h) + ":" + pad(m) + ":" + pad(s) + millisep + decimal;
                }
            };

            var getSpeakers = function ($tcu, hideSame) {
                if (hideSame) {
                    return $('.new-speaker .speaker-display', $tcu)
                        .filter(':visible')
                        .map(function () {
                            return $(this).text();
                        }).get();
                }
                else {
                    return $('.speaker-display', $tcu)
                        .filter(function () {
                            return $(this).css('display') == 'block';
                        })
                        .map(function () {
                            return $(this).text();
                        }).get();
                }
            };

            var getTiers = function ($tcu) {
                return $('.tier', $tcu)
                    .filter(':visible')
                    .map(function () {
                        return $(this).text();
                    }).get();
            };

            $('[data-transcripts-role=transcript-controls]', context)
                .addBack('[data-transcripts-role=transcript-controls]')
                .once('options')
                .each(function () {
                    var trid = $(this).attr('data-transcripts-id');
                    var $transcript = $('[data-transcripts-role=transcript][data-transcripts-id=' + trid + ']');

                    var $transcriptOptions = $('select.transcript-options', this);
                    var $languages = $transcriptOptions.find('optgroup[data-type=languages] option');
                    var $hidden = $languages.filter(function() {
                        return Drupal.settings.transcripts_ui.hidden_tiers.indexOf($(this).attr('value')) != -1;
                    }).each(
                        function() {
                            var $language = $(this);
                            $language.attr('selected', false);
                            $transcript.find('*[data-tier=' + $language.val() + ']').hide();
                        }
                    );
                    $languages.not($hidden).attr('selected', true);
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
                        $('optgroup[data-type=views] option', this).each(function () {
                            $transcript.toggleClass($(this).val(), $(this).prop('selected'));
                        });

                        $('optgroup[data-type=downloads] option', this).each(function () {
                            if ($(this).is(':selected')) {
                                $(this).prop('selected', false);
                                $transcriptOptions.selectpicker('refresh');

                                switch ($(this).val()) {
                                    case 'srt':
                                        var id = 1;
                                        var ul = new Array();
                                        $('.transcripts-ui-tcu').each(function () {
                                            var $tcu = $(this);
                                            var li = id
                                                + '\n'
                                                + formatSeconds($tcu.attr('data-begin'), ',')
                                                + ' --> '
                                                + formatSeconds($tcu.attr('data-end'), ',')
                                                + '\n';
                                            var speakers = getSpeakers($tcu, true);
                                            if (speakers.length > 0) {
                                                li += '>> ' + speakers.join('/') + ': ';
                                            }
                                            li += getTiers($tcu).join(' ') + '\n';
                                            ul.push(li);
                                            id++;
                                        });
                                        var text = ul.join('\n');
                                        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
                                        saveAs(blob, "transcript" + trid.substring(trid.indexOf('-')) + ".srt");
                                        break;
                                    case 'inq':
                                        var id = 1;
                                        var ul = new Array();
                                        $('.transcripts-ui-tcu').each(function () {
                                            var $tcu = $(this);
                                            var li = '[' + formatSeconds($tcu.attr('data-begin'), '.') + ']';
                                            var speakers = getSpeakers($tcu, false);
                                            if (speakers.length > 0) {
                                                li += ' ' + speakers.join('/') + ':';
                                            }
                                            li += '\n' + getTiers($tcu).join('\n') + '\n';
                                            li += '[' + formatSeconds($tcu.attr('data-end'), '.') + ']\n';
                                            ul.push(li);
                                            id++;
                                        });
                                        var text = ul.join('\n');
                                        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
                                        saveAs(blob, "transcript" + trid.substring(trid.indexOf('-')) + ".txt");
                                        break;
                                }
                            }
                        });

                        e.preventDefault();
                    });

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