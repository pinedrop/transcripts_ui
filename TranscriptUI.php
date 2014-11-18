<?php

class TranscriptUI {
        var $trid; //transcript id
        var $shorttrid; //short id
        var $options; //display options
        var $tiers; //data tiers

	var $num_docs = 0; //number of result documents

	//render array
        var $ui;

        //constructor
        function __construct($trid, $options) {
                $this->shorttrid = $trid;
                $this->trid = 'trid-'.$trid;
		$this->options = $options;
		$this->tiers = transcripts_ui_tiers();
        }

        //query
        function processResponse($response) {
		$numDocs = count($response->response->docs);
                if ($numDocs > 0) {
			$tiers = $this->tiers;
			$trid = $this->trid;
			$options = $this->options;

		        $docs = $response->response->docs;
		        $highlight = isset($response->highlighting) ? TRUE : FALSE;
		        $hits = array();
		        $show_speakers = variable_get('transcripts_ui_speaker_names', TRUE);

		        $tcus = array();

		        foreach ($docs as $sentence) {
    		        	$sid = $sentence->entity_id;
        	        	$speaker = isset($sentence->ss_speaker) ? $sentence->ss_speaker : '';
                		$begin = isset($sentence->fts_start) ? $sentence->fts_start : 0;
                		$end = isset($sentence->fts_end) ? $sentence->fts_end : 0;

                		$tier_list = array();

                		$is_hit = FALSE;
                		foreach (array_keys($tiers) as $tier) {
                        		if (isset($sentence->$tier)) {
                                		if ($highlight) {
                                        		$id = $sentence->id;
                                        		if (isset($response->highlighting->$id->$tier)) {
                                                		$is_hit = TRUE;
                                                		$replace = $response->highlighting->$id->$tier;
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
                        		else if (variable_get('transcripts_ui_empty_tiers', TRUE)) {
                                		$tier_list[] = array(
                                        		'#theme' => 'transcripts_ui_tcu_tier',
                                        		'#tier_name' => $tier,
                                        		'#classes' => array('np'),
                                		);
                        		}
                		}

                		if ($is_hit) {
                        		$hits[] = array(
                                		'#prefix' => "<li class='list-group-item transcripts-ui-hit-wrapper' data-refid='{$sid}'>",
                                		'link' => array(
                                        		'#prefix' => "<div class='transcripts-ui-hit-controls'>",
                                        		'content' => array(
                                                		'#theme' => 'transcripts_ui_goto_tcu',
                                                		'#linkurl' => '#tcu/' . $sentence->entity_id,
                                                		'#time' => $sentence->fts_start,
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
                        		'#prefix' => "<li id='{$sid}' class='list-group-item transcripts-ui-tcu' data-participant='{$speaker}' data-begin='{$begin}' data-end='{$end}'>",
                        		'tcu_info' => array(
                                		'#theme' => 'transcripts_ui_tcu_info',
                                		'#show_speakers' => $show_speakers,
                                		'#sid' => $sid,
                                		'#speaker_name' => $speaker,
                                		'#start_time' => $begin,
                                		'#end_time' => $end,
                        		),
                        		'tcu_tiers' => array(
                                		'#prefix' => "<div class='tiers speaker-tiers'>",
                                		'tier_list' => $tier_list,
                                		'#suffix' => "</div>",
                        		),
                        		'#suffix' => "</li>",
                		);
                		if (isset($options['hits_only']) && $options['hits_only']) {
                       			$hit_list = array(
                                		'#prefix' => "<ul id='transcripts-ui-hit-list-{$trid}' class='list-group transcripts-hit-list'>",
                                		'hits' => $hits,
                                		'#suffix' => "</ul>",
                        		);
                		}
                		else {
                			//$bootstrap = (variable_get('transcripts_markup', 'default') == 'bootstrap') ? TRUE : FALSE;
                			//if (count($hits) > 0) {
                        			$hit_list = array(
                                			'#prefix' => "<div class='panel panel-default transcripts-ui-hit-panel' data-trid='{$trid}'>",
                                			/*'header' => array(
                                        			'#prefix' => "<div class='panel-heading transcripts-ui-hit-header'>",
                                        			//'#markup' => theme('transcripts_hit_summary', array('num_found' => count($hits))),
                                        			'#markup' => t('Search results'),
                                        			'#suffix' => "</div>",
                                			),*/
                                			'body' => array(
                                        			'#prefix' => "<div class='panel-body'>",
                                        			'search' => drupal_get_form('transcripts_ui_search_form', $trid, $options),
                                        			'#suffix' => "</div>",
                                			),
                                			'list' => array(
                                        			'#prefix' => "<ul id='transcripts-ui-hit-list-{$trid}' class='list-group transcripts-hit-list'>",
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
                			//'#prefix' => "<div class='transcript scroller' data-trid='{$trid}'>",
                			//'tcu_list' => $tcus,
                			//'#suffix' => "</div>",
                			'#prefix' => "<div class='transcript scroller'>",
                			'contents' => array(
                        			'#prefix' => "<ul class='list-group'>",
                        			'tcu_list' => $tcus,
                        			'#suffix' => "</ul>",
                			),
                			'#suffix' => "</div>",
                			'#attached' => array(
                        			'css' => array(drupal_get_path('module', 'transcripts_ui') .'/css/transcripts_ui.css'),
                        			'js' => array(
                                			drupal_get_path('module', 'transcripts_ui') .'/js/transcripts_ui.js',
                                			drupal_get_path('module', 'transcripts_ui') .'/js/jquery.scrollTo.js',
                        			),
                			),
       	 			);

                        	$this->transcript = $transcript;
                        	$this->hits = $hits;

				$this->ui = array(
					'video_controls' => array(
						'#prefix' => "<div class='video-controls' data-trid='{$this->trid}'>",
						'#theme' => 'transcripts_ui_video_controls',
						'#play' => theme('transcripts_ui_play_transcript'),
						'#prev' => theme('transcripts_ui_previous_tcu'),
						'#same' => theme('transcripts_ui_same_tcu'),
						'#next' => theme('transcripts_ui_next_tcu'),
						'#suffix' => "</div>",
						'#attached' => array(
							'js' => array(drupal_get_path('module', 'transcripts_ui') .'/js/video_controls.js'),
						),
					),
					'transcript_controls' => array(
                                		'#prefix' => "<div class='transcript-ui-controls' data-trid='{$this->trid}'>",
      						'#theme' => 'transcripts_ui_transcript_controls',
                                		//'mode_selector' => drupal_get_form('transcripts_ui_mode_selector', $this->trid, $this->modes),
						'tier_selector' => drupal_get_form('transcripts_ui_tier_selector', $this->trid, $this->tiers),
						'#suffix' => "</div>",
					),
					'transcript' => $transcript,
					'hits' => $hits,
				);
                	}
			$this->num_docs = $numDocs;
        }
}
