<?php

function theme_transcripts_ui_transcript_controls($vars) {	
	$out  = drupal_render($vars['element']['content']);
        $out .= "<div class='btn-group'>";
        $out .= "<button type='button' class='btn btn-default search' title='Search transcript'><span class='glyphicon glyphicon-search'></span> Search</button>";
        $out .= "</div>";
        return $out;
}
function theme_transcripts_ui_transcript_options($vars) {
	$out  = "<div class='transcript-options'>";
	$out .= "<label>";
	$out .= t('Transcript options');
	$out .= "<select multiple class='tier-selector' data-header='Transcript options' title='Choose transcript options'>";
	$out .= "<optgroup label='Transcript tiers'>";
	foreach ($vars['element']['data_tiers'] as $key => $val) {
		$out .= "<option value='{$key}'>{$val}</option>";
	}
	$out .= "</optgroup>";
	$out .= "<optgroup label='Speaker name'>";
	foreach ($vars['element']['speaker_modes'] as $key => $val) {
		$out .= "<option value='s-{$key}'>{$val}</option>";
	}
       	$out .= "</optgroup>";
	$out .= "</select>";
       	$out .= "</label>";
	$out .= "</div>";
	return $out;
}
function theme_transcripts_ui_transcript_navigation($vars) {
	$out  = "<div class='btn-group' role='group'>";
	$out = "<button type='button' class='btn btn-default play-transcript'>" . t('Toggle transcript') . "</button>";
        $out .= "<button type='button' class='btn btn-default previous' title='Previous line'><span class='glyphicon glyphicon-arrow-left'></span> Previous</button>";
        $out .= "<button type='button' class='btn btn-default sameagain' title='Same line'><span class='glyphicon glyphicon-repeat'></span> Same</button>";
        $out .= "<button type='button' class='btn btn-default next' title='Next line'><span class='glyphicon glyphicon-arrow-right'></span> Next</button>";
	$out .= "</div>";
        return $out;
}
function theme_transcripts_ui_hit_summary($vars) {
	$out = "<div class='transcripts-ui-hit-controls'>";
	$out .= "<a href='#' class='transcripts-ui-clear-hits'><span class='ui-icon ui-icon-closethick'>Clear hits</span></a>";
        $out .= "</div>";
        $out .= "<div class='transcripts-ui-hit-info'>Found " .$vars['num_found']. " sentences</div>";
	return $out;
}
function theme_transcripts_ui_speaker_name($vars) {
	$out = "<div class='speaker-name'>{$vars['speaker_name']}</div>";
	return $out;
}
function theme_transcripts_ui_tcu_tier($vars) {
	$vars['classes'][] = 'tier';
	$vars['classes'][] = 'active';
	$classes = implode(' ', $vars['classes']);
	$out = "<div data-tier='{$vars['tier_name']}' class='$classes'>{$vars['tier_text']}</div>";
	return $out;
}
function theme_transcripts_ui_goto_tcu($vars) {
        $mins = floor ($vars['element']['#time'] / 60);
        $secs = $vars['element']['#time'] % 60;
        $time = sprintf ("%d:%02d", $mins, $secs);
	$out = "<a href='" . $vars['element']['#linkurl'] . "' class='btn btn-default'>";
        $out .= "<span class='glyphicon glyphicon-play'></span> ";
        $out .= $time;
        $out .= "</a>";
        return $out;
}
