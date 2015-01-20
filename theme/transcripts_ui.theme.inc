<?php

function theme_transcripts_ui_transcript_controls($vars)
{
    $out = drupal_render($vars['element']['content']);
    return $out;
}

function theme_transcripts_ui_transcript_options($vars)
{
    $out = "<label>";
    $out .= t('Languages');
    $out .= "<select multiple class='tier-selector' data-header='Tiers to display' title='Choose tiers to display'>";
    foreach ($vars['element']['data_tiers'] as $key => $val) {
        $out .= "<option value='{$key}'>{$val}</option>";
    }
    $out .= "</select>";
    $out .= "</label>";

    return $out;
}

function theme_transcripts_ui_transcript_navigation($vars)
{
    $out = "<div class='btn-group' role='group'>";
    $out .= "<button type='button' class='btn btn-default play-transcript'>" . t('Toggle') . "</button>";
    $out .= "<button type='button' class='btn btn-default previous' title='Previous line'><span class='glyphicon glyphicon-arrow-left'></span> " . t('Prev') . "</button>";
    $out .= "<button type='button' class='btn btn-default sameagain' title='Same line'><span class='glyphicon glyphicon-repeat'></span>" . t('Same') . "</button>";
    $out .= "<button type='button' class='btn btn-default next' title='Next line'><span class='glyphicon glyphicon-arrow-right'></span>" . t('Next') . "</button>";
    $out .= "</div>";
    return $out;
}

function theme_transcripts_ui_transcript_search($vars)
{
    $out = drupal_render($vars['element']['search_form']);
    return $out;
}

function theme_transcripts_ui_hit_summary($vars)
{
    $out = "<div class='transcripts-ui-hit-controls'>";
    $out .= "<a href='#' class='transcripts-ui-clear-hits'><span class='ui-icon ui-icon-closethick'>Clear hits</span></a>";
    $out .= "</div>";
    $out .= "<div class='transcripts-ui-hit-info'>Found " . $vars['num_found'] . " sentences</div>";
    return $out;
}

function theme_transcripts_ui_speaker_name($vars)
{
    $out = "<div class='speaker-name {$vars['speaker_turn']}'>{$vars['speaker_name']}</div>";
    return $out;
}

function theme_transcripts_ui_tcu_tier($vars)
{
    $vars['classes'][] = 'tier';
    $vars['classes'][] = 'active';
    $classes = implode(' ', $vars['classes']);
    $out = "<div data-tier='{$vars['tier_name']}' class='$classes'>{$vars['tier_text']}</div>";
    return $out;
}

function theme_transcripts_ui_goto_tcu($vars)
{
    $mins = floor($vars['element']['#time'] / 60);
    $secs = $vars['element']['#time'] % 60;
    $time = sprintf("%d:%02d", $mins, $secs);
    $out = "<a href='" . $vars['element']['#linkurl'] . "' class='btn btn-default'>";
    $out .= "<span class='glyphicon glyphicon-play'></span> ";
    $out .= $time;
    if (isset($vars['element']['#text'])) {
        $out .= " " . $vars['element']['#text'];
    }
    $out .= "</a>";
    return $out;
}
