# Transcripts UI

## Introduction

Transcript UI provides a themeable interface for interacting with
timecoded transcripts in Drupal. 

## Installation

Enable the transcript_ui module.

## Configuration

Configure the module at admin/config/user-interface/transcripts.
Select 'Default' or 'Bootstrap' markup, and define a list of tier
identifiers and tier names.

## Creating a UI

* transcripts_ui_ui($module, $trid, $options): to create a UI, 
pass your module's name along with a unique transcript identifier
and some options.
* transcripts_ui_render($ui): to acquire a rendered UI.

## UI Components

Transcripts UI renders an HTML element for each of its components.
Each component element has a data-transcripts-id attribute set to
the trid. Each component also has a data-transcripts-role attribute
set to one of the following roles:

* transcript
* hit-panel
* transcript-conrols
* video-controls

Your module is responsible for providing markup including an
HTML 5 audio or video tag contained within an element that has the
attribute:

  data-transcripts-id=*trid*
  data-transcripts-role=video

where *trid* is a transcript id shared by other UI components. 

Without making this linkage, transcripts will not be synced with
your media.

Your module is also responsible for retrieving transcripts for the
UI; this is done by implementing hook_transcripts_ui_transcript.

## See also 

transcripts_apachesolr is a module that makes use of transcript_ui.
