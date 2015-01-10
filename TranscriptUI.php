<?php

class TranscriptUI {
	var $module; //calling module
        var $trid; //transcript id
        var $shorttrid; //short id
        var $options; //display options
        var $tiers; //data tiers
	var $tcuCount = 0; //number of result documents
        var $render; //array of rendered components

        //constructor
        function __construct($module, $trid, $options) {
                $this->shorttrid = $trid;
                $this->trid = 'trid-'.$trid;
		$this->options = $options;
		$this->tiers = transcripts_ui_tiers();
		$this->module = $module;

		if (in_array($module, module_implements('transcripts_ui_transcript'))) {
			list($tcus, $highlights) = module_invoke($module, 'transcripts_ui_transcript', $this);
			$this->createUI($tcus, $highlights);	
		}
        }

        //query
        function createUI($timecodeunits, $highlights) {
		$this->tcuCount = count($timecodeunits);
                if ($this->tcuCount > 0) {
			$tiers = $this->tiers;
			$trid = $this->trid;
			$options = $this->options;

		        $highlight = $highlights !== NULL ? TRUE : FALSE;
		        $hits = array();
		        //$show_speakers = variable_get('transcripts_ui_speaker_names', TRUE);

		        $tcus = array();

		        foreach ($timecodeunits as $sentence) {
    		        	$sid = $sentence->tcuid;
        	        	$speaker = isset($sentence->speaker) ? $sentence->speaker : '';
                		$begin = isset($sentence->start) ? $sentence->start : 0;
                		$end = isset($sentence->end) ? $sentence->end : 0;

                		$tier_list = array();

                		$is_hit = FALSE;
                		foreach (array_keys($tiers) as $tier) {
                        		if (isset($sentence->$tier)) {
                                		if ($highlight) {
                                        		$id = $sentence->id;
                                        		if (isset($highlights->$id->$tier)) {
                                                		$is_hit = TRUE;
                                                		$replace = $highlights->$id->$tier;
                                                		$tier_list[] = array(
                                                        		'#theme' => 'transcripts_ui_tcu_tier',
                                                   			'#tier_name' => $tier,
                                                        		'#tier_text' => $replace[0],
                                                        		'#classes' => array($tier, 'hit', 'np'),
                                                		);
                                        		}
                                        	else {
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

                		if ($is_hit) {
                        		$hits[] = array(
                                		'#prefix' => "<li class='list-group-item transcripts-ui-hit-wrapper' data-refid='{$sid}'>",
                                		'link' => array(
                                        		'#prefix' => "<div class='transcripts-ui-hit-controls'>",
                                        		'content' => array(
                                                		'#theme' => 'transcripts_ui_goto_tcu',
                                                		'#linkurl' => '#tcu/' . $sentence->tcuid,
                                                		'#time' => $sentence->start,
                                        		),
                                        		'#suffix' => "</div>",
                                 		),
                                 		'tcu_tiers' => array(
                                        		'#prefix' => "<div class='tiers speaker-tiers transcripts-ui-hit-ref'>",
                                        		'tier_list' => $tier_list,
                                        		'#suffix' => "</div>",
                                 		),
                                 		'#suffix' => "</li>",
                        		);
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
			}

                		if (isset($options['hits_only']) && $options['hits_only']) {
                       			$hit_list = array(
                                		'#prefix' => "<ul id='transcripts-ui-hit-list-{$trid}' class='list-group transcripts-ui-hit-list'>",
                                		'hits' => $hits,
                                		'#suffix' => "</ul>",
                        		);
                		}
                		else {
                			//if (count($hits) > 0) {
                        			$hit_list = array(
                                			'#prefix' => "<div class='panel panel-default' data-transcripts-role='hit-panel' data-transcripts-id='{$trid}'>",
                                			/*'header' => array(
                                        			'#prefix' => "<div class='panel-heading transcripts-ui-hit-header'>",
                                        			//'#markup' => theme('transcripts_hit_summary', array('num_found' => count($hits))),
                                        			'#markup' => t('Search results'),
                                        			'#suffix' => "</div>",
                                			),*/
                                			'body' => array(
                                        			'#prefix' => "<div class='panel-body'>",
                                        			'search' => drupal_get_form('transcripts_ui_search_form', $this),
                                        			'#suffix' => "</div>",
                                			),
                                			'list' => array(
                                        			'#prefix' => "<ul id='transcripts-ui-hit-list-{$trid}' class='list-group transcripts-ui-hit-list'>",
                                        			'hits' => $hits,
                                        			'#suffix' => "</ul>",
                                			),
                                			'#suffix' => "</div>",
                                			'#attached' => array(
                                        			'css' => array(
                                                			drupal_get_path('module', 'transcripts_ui') .'/css/transcripts_hits.css',
                                        			),
                                        			'js' => array(drupal_get_path('module', 'transcripts_ui') .'/js/transcripts_hits.js'),
                                			),
                        			);
                			}
                			/*} else {
                        			$hit_list = array();
                			}*/
        			};
        			$transcript = array(
                			'#prefix' => "<div class='scroller' data-transcripts-role='transcript' data-transcripts-id='{$this->trid}'>",
                			'contents' => array(
                        			'#prefix' => "<ul class='list-group'>",
                        			'tcu_list' => $tcus,
                        			'#suffix' => "</ul>",
                			),
                			'#suffix' => "</div>",
                			'#attached' => array(
                        			'css' => array(drupal_get_path('module', 'transcripts_ui') .'/css/transcripts_ui.css'),
                        			'js' => array(
                                                        drupal_get_path('module', 'transcripts_ui') .'/js/jquery.scrollTo.min.js',
                                			drupal_get_path('module', 'transcripts_ui') .'/js/transcripts_ui.js',
                        			),
                			),
       	 			);
				$this->render['transcript'] = $transcript;
				$this->render['hits'] = $hit_list;
        }
}
