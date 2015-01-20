<?php

class TranscriptUI
{
    var $module; //calling module
    var $trid; //transcript id
    var $shorttrid; //short id
    var $options; //display options
    var $tiers; //data tiers
    var $tcuCount = 0; //number of result documents
    var $render; //array of rendered components

    //constructor
    function __construct($module, $trid, $options)
    {
        $this->shorttrid = $trid;
        $this->trid = 'trid-' . $trid;
        $this->options = $options;
        $this->tiers = transcripts_ui_tiers();
        $this->module = $module;

        if (in_array($module, module_implements('transcripts_ui_transcript'))) {
            list($tcus, $highlights) = module_invoke($module, 'transcripts_ui_transcript', $this);
            $this->createUI($tcus, $highlights);
        }
    }

    //query
    function createUI($timecodeunits, $highlights)
    {
        $this->tcuCount = count($timecodeunits);
        if ($this->tcuCount > 0) {
            $tiers = $this->tiers;
            $trid = $this->trid;
            $options = $this->options;

            $highlight = $highlights !== NULL ? TRUE : FALSE;
            $hitCount = 0;

            $lastSpeaker = "";
            $tcus = array();

            foreach ($timecodeunits as $sentence) {
                $sid = $sentence->tcuid;
                $speaker = isset($sentence->speaker) ? $sentence->speaker : '';
                $begin = isset($sentence->start) ? $sentence->start : 0;
                $end = isset($sentence->end) ? $sentence->end : 0;

                $tier_list = array();

                foreach (array_keys($tiers) as $tier) {
                    if (isset($sentence->$tier)) {
                        if ($highlight) {
                            $id = $sentence->id;
                            if (isset($highlights->$id->$tier)) {
                                $hitCount++;
                                $replace = $highlights->$id->$tier;
                                $tier_list[] = array(
                                    '#theme' => 'transcripts_ui_tcu_tier',
                                    '#tier_name' => $tier,
                                    '#tier_text' => $replace[0],
                                    '#classes' => array($tier, 'hit', 'np'),
                                );
                            } else {
                                $tier_list[] = array(
                                    '#theme' => 'transcripts_ui_tcu_tier',
                                    '#tier_name' => $tier,
                                    '#tier_text' => $sentence->$tier,
                                );
                            }
                        } else {
                            $tier_list[] = array(
                                '#theme' => 'transcripts_ui_tcu_tier',
                                '#tier_name' => $tier,
                                '#tier_text' => $sentence->$tier,
                                '#classes' => array('np'),
                            );
                        }
                    }
                }

                $tcus[] = array(
                    //div had class clearfix
                    '#prefix' => "<li id='{$sid}' class='clearfix list-group-item transcripts-ui-tcu' data-participant='{$speaker}' data-begin='{$begin}' data-end='{$end}'>",
                    'tcu_info' => array(
                        '#prefix' => "<div class='clearfix tcu-info'>",
                        'link' => array(
                            '#prefix' => "<div class='play-button'>",
                            '#theme' => 'transcripts_ui_goto_tcu',
                            '#linkurl' => '#tcu/' . $sentence->tcuid,
                            '#time' => $sentence->start,
                            '#suffix' => "</div>",
                        ),
                        'speaker_name' => array(
                            '#theme' => 'transcripts_ui_speaker_name',
                            '#sid' => $sid,
                            '#speaker_name' => $speaker,
                            '#speaker_turn' => $speaker == $lastSpeaker ? 'same-speaker' : 'new-speaker',
                        ),
                        '#suffix' => "</div>",
                    ),
                    'tcu_tiers' => array(
                        '#prefix' => "<div class='tiers speaker-tiers'>",
                        'tier_list' => $tier_list,
                        '#suffix' => "</div>",
                    ),
                    '#suffix' => "</li>",
                );

                $lastSpeaker = $speaker;
            }

            if ($options['term']) {
                $search_nav = array(
                    '#prefix' => "<div class='alert alert-info' role='alert'>",
                    '#markup' => "Found {$hitCount} instances of <strong>{$options['term']}</strong>.",
                    '#suffix' => "</div>",
                );
            } else {
                $search_nav = array();
            }

            $js = array(
                'ui' => drupal_get_path('module', 'transcripts_ui') . '/js/transcripts_ui.js',
                'scroller' => drupal_get_path('module', 'transcripts_ui') . '/js/transcripts_scroller.js',
            );
            drupal_alter('transcripts_ui_js', $js);

            $transcript = array(
                '#prefix' => "<div id='transcripts-ui-transcript-{$this->trid}' class='scroller' data-transcripts-role='transcript' data-transcripts-id='{$this->trid}'>",
                'search_nav' => $search_nav,
                'contents' => array(
                    '#prefix' => "<ul class='list-group'>",
                    'tcu_list' => $tcus,
                    '#suffix' => "</ul>",
                ),
                '#suffix' => "</div>",
                '#attached' => array(
                    'css' => array(drupal_get_path('module', 'transcripts_ui') . '/css/transcripts_ui.css'),
                    'js' => array(
                        drupal_get_path('module', 'transcripts_ui') . '/js/jquery.scrollTo.min.js',
                        $js['ui'],
                        $js['scroller'],
                    ),
                ),
            );
            $this->render['transcript'] = $transcript;
        }
    }
}
