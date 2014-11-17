<?php

function theme_transcripts_transcript_controls($vars) {
	$out = "<table>";
	$out .= "<tr>";
	$out .= "<td>" .drupal_render($vars['element']['mode_selector']). "</td>";
	$out .= "<td>" .drupal_render($vars['element']['tier_selector']). "</td>";
	$out .= "</tr>";
	$out .= "</table>";
	return $out;
}
function theme_transcripts_video_controls($vars) {
	$markup = variable_get('transcripts_markup', 'default');
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
function theme_transcripts_video_tag($vars) {
	$out = "<div class='transcripts-video-tag' data-trid='{$vars['trid']}'>";
	if (!$vars['video_tag']) { //use video_url
		$tag = $vars['tag_type'];
		
		$out .= "<div class='transcripts'>";
		$out .= "<div class='transcripts-html5-media'>";
		$out .= "<$tag controls>";
		foreach ($vars['video_url'] as $vurl) {
			$out .= "<source src='$vurl' />";
			//$out .= "<source type='video/$src->type' src='$src->src' width='$src->width' height='$src->height' />";  
		}
		$out .= "</$tag>";
		$out .= "</div>";
		$out .= "</div>";
	}
	else {
		$out .= $vars['video_tag'];
	}
	$out .= "</div>";
	return $out;
}
function theme_transcripts_play_transcript($vars) {
        $markup = variable_get('transcripts_markup', 'default');
        if ($markup == 'bootstrap') {
                $out = "<button type='button' class='btn btn-default play-transcript without-transcript'>";
                $out .= t('Toggle transcript');
                $out .= "</button>";
	}
	else {
		$out = "<button class='play-transcript without-transcript'>";
		$out .= t('Toggle transcript');
		$out .= "</button>";
	}
	return $out;
}
function theme_transcripts_previous_tcu($vars) {
        $markup = variable_get('transcripts_markup', 'default');
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
function theme_transcripts_same_tcu($vars) {
        $markup = variable_get('transcripts_markup', 'default');
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
function theme_transcripts_next_tcu($vars) {
        $markup = variable_get('transcripts_markup', 'default');
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
function theme_transcripts_hit_summary($vars) {
	$out = "<div class='transcripts-hit-controls'>";
	$out .= "<a href='#' class='transcripts-clear-hits'><span class='ui-icon ui-icon-closethick'>Clear hits</span></a>";
        $out .= "</div>";
        $out .= "<div class='transcripts-hit-info'>Found " .$vars['num_found']. " sentences</div>";
	return $out;
}
function theme_transcripts_tcu_info($vars) {
	$out = $vars['show_speakers'] ? "<div class='info'>" : "<div class='info' style='display: none'>";
	$out .= "<div class='speakername'>{$vars['speaker_name']}</div>";
	$out .= "<div class='playwrapper'>";
	$out .= "<div class='infocontrols'><button></button></div>";
	$out .= "<div class='timecodes'>";
	$out .= "<div class='t1'>{$vars['start_time']}</div><div class='clearfix'></div>";
	$out .= "<div class='t2'>{$vars['end_time']}</div><div class='clearfix'></div>";
	$out .= "</div>"; //timecodes
	$out .= "</div>"; //playwrapper
	$out .= "</div>"; //info
	return $out;
}

function theme_transcripts_tcu_tier($vars) {
	$vars['classes'][] = 'tier';
	$vars['classes'][] = 'active';
	$classes = implode(' ', $vars['classes']);
	$out = "<div data-tier='{$vars['tier_name']}' class='$classes'>{$vars['tier_text']}</div>";
	return $out;
}
