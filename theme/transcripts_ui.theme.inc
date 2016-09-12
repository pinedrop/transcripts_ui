<?php

function theme_transcripts_ui_transcript_controls($vars) {
    $out  = "<div class='btn-group btn-group-justified btn-group-transcript' role='group'>";
    $out .= drupal_render($vars['element']['content']['transcript_options']);
    $out .= drupal_render($vars['element']['content']['transcript_navigation']);
    $out .= "</div>";
    $out .= drupal_render($vars['element']['content']['transcript_search_wrapper']);
    return $out;
}

function theme_transcripts_ui_transcript_options($vars)
{
    $out  = "<select style='display:none;' multiple class='transcript-options' data-header='Transcript options'>";

    foreach ($vars['element']['groups'] as $type => $group) {
        $label = $group['label'];

        $out .= "<optgroup label='{$label}' data-type='{$type}'>";
        foreach ($group['options'] as $val => $text) {
            $out .= "<option value='" .$val. "'";
            if (isset($group['class'])) {
                $out .= " class='" .implode(' ', $group['class']). "'";
            }
            if (isset($group['icon'])) {
                $out .= " data-icon='" .$group['icon']. "'";
            }
            $out .= ">" .$text. "</option>";
        }
        $out .= "</optgroup>";
    }

    $out .= "</select>";
    return $out;
}

function theme_transcripts_ui_transcript_navigation($vars) {
    $out  = "<button type='button' class='btn btn-default btn-icon playpause' title='Play/Pause' data-play-icon='glyphicon-play' data-pause-icon='glyphicon-pause'><span class='glyphicon glyphicon-play'></span></button>";
    $out .= "<button type='button' class='btn btn-default btn-icon previous' title='Previous line'><span class='glyphicon glyphicon-arrow-left'></span></button>";
    $out .= "<button type='button' class='btn btn-default btn-icon sameagain' title='Same line'><span class='glyphicon glyphicon-repeat'></span></button>";
    $out .= "<button type='button' class='btn btn-default btn-icon next' title='Next line'><span class='glyphicon glyphicon-arrow-right'></span></button>";
    $out .= "<button type='button' class='btn btn-default btn-icon searchtrans' title='Search Transcript'><span class='glyphicon glyphicon-search'></span></button>";
    return $out;
}

function theme_transcripts_ui_transcript_search_wrapper($vars)
{
    $out = "<span class='glyphicon glyphicon-remove-circle'></span>";
    $out .= drupal_render($vars['element']['content']);
    return $out;
}

function theme_transcripts_ui_transcript_search($vars)
{
    $out = drupal_render($vars['element']['search_form']);
    return $out;
}

function theme_transcripts_ui_speaker_name($vars)
{
    $vars['classes'][] = 'speaker-display';
    $classes = implode(' ', $vars['classes']);
    $out  = "<div class='speaker-name {$vars['speaker_turn']}'>";
    if (is_array($vars['speaker_name'])) {
        foreach ($vars['speaker_name'] as $speaker_display => $speaker_name) {
            $key = check_plain($speaker_display);
            $val = check_plain($speaker_name);
            $out .= "<span data-speaker-display='$key' class='$classes'>$val</span> ";
        }
    }
    $out .= "</div>";
    return $out;
}

function theme_transcripts_ui_tcu_tier($vars)
{;
    $vars['classes'][] = 'tier';
    $classes = implode(' ', $vars['classes']);
    $tier_name = check_plain($vars['tier_name']);
    $tier_text = filter_xss($vars['tier_text'], array('mark')); // let through <mark> for highlighting hits
    $out = "<div data-tier='{$tier_name}' class='$classes'>{$tier_text}</div>";
    return $out;
}

function theme_transcripts_ui_play_tcu($vars)
{
    $mins = floor($vars['element']['#time'] / 60);
    $secs = $vars['element']['#time'] % 60;
    $time = sprintf("%d:%02d", $mins, $secs);
    $classes = 'btn btn-default btn-sm btn-icon play-tcu';
    $classes .= $vars['element']['#timecoded'] ? ' timed' : ' untimed';
    $out = "<button type='button' class='" .$classes ."' title='Play line'><span class='glyphicon glyphicon-play'></span> ";
    $out .= $time;
    if (isset($vars['element']['#text'])) {
        $out .= " " . $vars['element']['#text'];
    }
    $out .= "</button>";
    return $out;
}
