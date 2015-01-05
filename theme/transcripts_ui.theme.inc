<?php

function theme_transcripts_ui_transcript_controls($vars) {
	$out = "<table>";
	$out .= "<tr>";
	$out .= "<td>" .drupal_render($vars['element']['viewer_selector']). "</td>";
	$out .= "<td>" .drupal_render($vars['element']['tier_selector']). "</td>";
	$out .= "</tr>";
	$out .= "</table>";
	return $out;
}
function theme_transcripts_ui_video_controls($vars) {
	$markup = variable_get('transcripts_ui_markup', 'default');
	if ($markup == 'bootstrap') {
                $out = "<div class='btn-toolbar'>";
		$out .= "<div class='btn-group'>";
		$out .= $vars['element']['#play'];
		$out .= "</div>";
                $out .= "<div class='btn-group'>";
		$out .= $vars['element']['#prev'];
		$out .= $vars['element']['#same'];
		$out .= $vars['element']['#next'];
                $out .= "</div>";
		$out .= "</div>";
	}
	else {
        	$out = "<ul>";
        	$out .= "<li>" .$vars['element']['#play']. "</li>";
        	$out .= "<li>" .$vars['element']['#prev']. "</li>";
        	$out .= "<li>" .$vars['element']['#same']. "</li>";
        	$out .= "<li>" .$vars['element']['#next']. "</li>";
		$out .= "</ul>";
	}
        return $out;
}
function theme_transcripts_ui_play_transcript($vars) {
        $markup = variable_get('transcripts_ui_markup', 'default');
        if ($markup == 'bootstrap') {
                $out = "<button type='button' class='btn btn-default play-transcript'>";
                $out .= t('Toggle transcript');
                $out .= "</button>";
	}
	else {
		$out = "<button class='play-transcript'>";
		$out .= t('Toggle transcript');
		$out .= "</button>";
	}
	return $out;
}
function theme_transcripts_ui_previous_tcu($vars) {
        $markup = variable_get('transcripts_ui_markup', 'default');
        if ($markup == 'bootstrap') {
		$out = "<button type='button' class='btn btn-default previous' title='" . t('Play previous line') . "'>";
		$out .= "<span class='glyphicon glyphicon-arrow-left'><span> ";
		$out .= t('Previous');
		$out .= "</button>";
	}
	else {
		$out = "<button class='previous' title='" . t('Play previous line') . "'>" . t('Previous') . "</button>";
	}
	return $out;
}
function theme_transcripts_ui_same_tcu($vars) {
        $markup = variable_get('transcripts_ui_markup', 'default');
        if ($markup == 'bootstrap') {
		$out = "<button type='button' class='btn btn-default sameagain' title='" . t('Play same line') . "'>";
                $out .= "<span class='glyphicon glyphicon-repeat'><span> ";
                $out .= t('Same'); 
                $out .= "</button>";
	}
	else {
		$out = "<button class='sameagain' title='" . t('Play same line') . "'>" . t('Same') . "</button>";
	}
	return $out;
}
function theme_transcripts_ui_next_tcu($vars) {
        $markup = variable_get('transcripts_ui_markup', 'default');
        if ($markup == 'bootstrap') {
		$out = "<button type='button' class='btn btn-default next' title='" . t('Play next line') . "'>";
                $out .= "<span class='glyphicon glyphicon-arrow-right'><span> ";
                $out .= t('Next');
                $out .= "</button>";
	}
	else {
		$out = "<button class='next' title='" . t('Play next line') . "'>" . t('Next') . "</button>";
	}
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

        $markup = variable_get('transcripts_ui_markup', 'default');
        if ($markup == 'bootstrap') {
                $out = "<a href='" . $vars['element']['#linkurl'] . "' class='btn btn-default btn-sm'>";
                $out .= "<span class='glyphicon glyphicon-play'></span> ";
                $out .= $time;
                $out .= "</a>";
        }
        else {
                $out = "<a href='" . $vars['element']['#linkurl'] . "'>";
                $out .= "<span class='ui-icon ui-icon-play ui-state-default'>Play</span>";
                $out .= "</a>";
        }
        return $out;
}

