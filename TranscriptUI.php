<?php

class TranscriptUI {
        var $trid; //transcript id
        var $shorttrid; //short id
        var $profile; //display profile
        var $options; //display options
        var $tiers; //data tiers
        var $modes; //display modes
        var $default_mode; //default mode

	var $num_docs = 0; //number of result documents
        var $hello; //hello function

	//render array
        var $ui;

        //constructor
        function __construct($trid, $profile_id = '') {
                $this->shorttrid = $trid;
                $this->trid = 'trid-'.$trid;
                if (!$profile_id) {
                        $profile_id = variable_get('transcripts_default_profile', '');
                }
                $this->set_profile($profile_id);
        }

        //setters
        function set_profile($profile_id) {
                $this->profile = transcripts_profile_load($profile_id);
                $this->set_tiers(transcripts_all_tiers());
                $this->set_modes(transcripts_all_modes());
        }
        function set_tiers($tiers) {
                $this->tiers = array_intersect_key($this->profile['tiers'], array_flip($tiers));
        }
        function set_modes($modes) {
                $this->modes = array_intersect_key($modes, array_filter($this->profile['modes']));
                reset($this->modes);
                $this->default_mode = array_key_exists($this->profile['default_mode'], $this->modes) ? $this->profile['default_mode'] : key($this->modes);
                $hellofunctions = array();
                $goodbyefunctions = array();
                foreach ($this->modes as $mode => $display) {
                        $infoFunction = $mode . "_transcripts_info";
                        $infoResult = $infoFunction();
                        $hellofunctions[$mode] = $infoResult['hello'];
                        $goodbyefunctions[$mode] = $infoResult['goodbye'];
                }
                drupal_add_js(array('hello' => $hellofunctions, 'goodbye' => $goodbyefunctions), 'setting');
        }

        //query
        function do_query($options) {
		// how will options get through when function is not called as part of page request?
		$defaults = array(
			'term' => isset($_GET['term']) ? '"'.$_GET['term'].'"' : '',
			'justhits' => isset($_GET['justhits']) ? true : false,
		);
		$options = array_merge($defaults, $options);
                
		$response = transcripts_controller_get($this->shorttrid, $this->tiers, $options);
		$numDocs = count($response->response->docs);
                if ($numDocs > 0) {
                        $info = $this->default_mode . "_transcripts_info";
                        $vals = $info();
                        $hello = $vals['hello'];
                        module_invoke_all('transcripts_controller_prepare_player', $this->trid);
                        list($transcript, $hits) = transcripts_controller_transcript($response, $this->tiers, $this->trid, $options);
                        $this->transcript = $transcript;
                        $this->hits = $hits;

			$this->ui = array(
				'video_controls' => array(
					'#prefix' => "<div class='video-controls' data-trid='{$this->trid}'>",
					'#theme' => 'transcripts_video_controls',
					'#play' => theme('transcripts_play_transcript'),
					'#prev' => theme('transcripts_previous_tcu'),
					'#same' => theme('transcripts_same_tcu'),
					'#next' => theme('transcripts_next_tcu'),
					'#suffix' => "</div>",
					'#attached' => array(
						'js' => array(drupal_get_path('module', 'transcripts_controller') .'/js/video_controls.js'),
					),
				),
				'transcript_controls' => array(
                                	'#prefix' => "<div class='transcript-controls' data-trid='{$this->trid}'>",
      					'#theme' => 'transcripts_transcript_controls',
                                	'mode_selector' => drupal_get_form('transcripts_controller_mode_selector', $this->trid, $this->modes),
					'tier_selector' => drupal_get_form('transcripts_controller_tier_selector', $this->trid, $this->tiers),
					'#suffix' => "</div>",
				),
				'transcript' => $transcript,
				'hits' => $hits,
			);
                }
		$this->num_docs = $numDocs;
        }

        //getters
}
