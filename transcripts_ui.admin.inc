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
	$default_tiers = array(
		'ts_content_epo' => 'Esperanto',
		'ts_content_qya' => 'Quenya',
		'ts_content_sjn' => 'Sindarin',
	);
        $form['transcripts_ui_tier_settings']['transcripts_ui_tiers'] = array(
                '#title' => t('Tiers'),
                '#type' => 'textarea',
                '#rows' => 10,
                '#default_value' => list_allowed_values_string(variable_get('transcripts_ui_tiers', $default_tiers)),
                '#description' => t('Enter a list of tiers, one per line, each in the form TIER_ID|TIER_NAME.'),
                '#required' => TRUE,
        );
/*
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
*/
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

	$form = system_settings_form($form);
	array_unshift($form['#submit'], 'transcripts_ui_admin_submit');
	return $form;
}

function transcripts_ui_admin_submit($form, &$form_state) {
	$tiers = list_extract_allowed_values($form_state['values']['transcripts_ui_tiers'], 'list_text', FALSE);
	$form_state['values']['transcripts_ui_tiers'] = $tiers;
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
