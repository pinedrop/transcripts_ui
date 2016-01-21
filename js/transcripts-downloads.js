(function ($) {
    Drupal.behaviors.transcriptExport = {
        attach: function (context, settings) {
            var pad = function(num) {
                return ("00"+num).substr(num.toString().length);
            };

            var formatSeconds = function(seconds, millisep) {
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

            var getSpeakers = function($tcu, hideSame) {
                if (hideSame) {
                    return $('.new-speaker .speaker-display', $tcu)
                        .filter(':visible')
                        .map(function () {
                            return $(this).text();
                        }).get();
                }
                else {
                    return $('.speaker-display', $tcu)
                        .filter(function() {
                            return $(this).css('display') == 'block';
                        })
                        .map(function() {
                            return $(this).text();
                        }).get();
                }
            };

            var getTiers = function($tcu) {
                return $('.tier', $tcu)
                    .filter(':visible')
                    .map(function() {
                        return $(this).text();
                    }).get();
            };

            $('#srt').once().click(function() {
                var id = 1;
                var ul = new Array();
                $('.transcripts-ui-tcu').each(function() {
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
                saveAs(blob, "transcript.srt"); //FIXME base filename on trid
            });

            $('#inq').once().click(function() {
                var id = 1;
                var ul = new Array();
                $('.transcripts-ui-tcu').each(function() {
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
                saveAs(blob, "transcript.txt"); //FIXME base filename on trid
            });
        }
    };
})(jQuery);