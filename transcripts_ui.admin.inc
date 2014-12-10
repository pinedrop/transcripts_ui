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
