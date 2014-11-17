<?php

function transcripts_ui_admin() {
	$form = array();

	$form['transcripts_ui_style_settings'] = array(
		'#title' => t('Style settings'),
		'#type' => 'fieldset',
		'#collapsed' => FALSE,
	);
	$form['transcripts_ui_style_settings']['transcripts_ui_markup'] = array(
                '#title' => t('Markup style'),
                '#type' => 'select',
                '#options' => array(
			'default' => t('Default'),
			'bootstrap' => t('Bootstrap'),
		),
                '#default_value' => variable_get('transcripts_ui_markup', 'default'),
		'#description' => t('Select the markup style to use.'),
	);

        $form['transcripts_ui_tier_settings'] = array(
                '#title' => t('Transcript tiers'),
                '#type' => 'fieldset',
                '#collapsed' => FALSE,
        );

        $desc = 'Enter a comma-separated list of Toolbox tier mappings, '
                . 'each in the form TOOLBOX_TIER|TRANSCRIPTS_TIER. '
                . 'You can ignore this field if you are not importing transcripts from Toolbox.';

        $form['transcripts_ui_tier_settings']['transcripts_ui_toolbox_mappings'] = array(
                '#title' => t('Toolbox mappings'),
                '#type' => 'textarea',
                '#rows' => 3,
                '#default_value' => variable_get('transcripts_ui_toolbox_mappings', 'tx|ts_content_quechua, mb|ts_content_morph, ge|ts_content_igt, ft|ts_content_eng'),
                '#description' => t($desc),
                '#required' => TRUE,
        );
        $form['transcripts_ui_tier_settings']['transcripts_ui_empty_tiers'] = array(
                '#title' => t('Include empty tiers'),
                '#type' => 'checkbox',
                '#default_value' => variable_get('transcripts_ui_empty_tiers', TRUE),
                '#description' => t('Do you want empty tiers to be included in the transcript display? Non-included empty tiers cannot be edited.'),
        );
        $form['transcripts_ui_tier_settings']['transcripts_ui_speaker_names'] = array(
        	'#title' => t('Include speaker names'),
	        '#type' => 'checkbox',
	        '#default_value' => variable_get('transcripts_ui_speaker_names', TRUE),
	        '#description' => t('Do you want speaker names to be included in the transcript display? Hidden speaker names cannot be edited.'),
        );

	return system_settings_form($form);
}

function improved_list_allowed_values_string($values, $delim = "\n") {
	$lines = array();
	foreach ($values as $key => $value) {
		$lines[] = "$key|$value";
	}
	return implode($delim, $lines);
}

function improved_list_extract_allowed_values($string) {
	$values = array();

	$list = explode("\n", $string);
	$list = array_map('trim', $list);
	$list = array_filter($list, 'strlen');

	foreach ($list as $position => $text) {
		$value = $key = FALSE;

		// Check for an explicit key.
		$matches = array();
		if (preg_match('/(.*)\|(.*)/', $text, $matches)) {
			$key = $matches[1];
			$value = $matches[2];
			$explicit_keys = TRUE;
		}
		$values[$key] = $value;
	}
	
	return $values;
}
