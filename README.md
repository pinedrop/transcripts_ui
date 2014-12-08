# Transcripts UI

## Introduction

Transcripts UI provides a themeable interface for interacting with
timecoded transcripts in Drupal. 

## Installation

Enable the transcript_ui module.

## Configuration

Configure the module at admin/config/user-interface/transcripts.
Select 'Default' or 'Bootstrap' markup, and define a list of tier
identifiers and tier names.

## Creating a UI

* To create a UI, pass your module's name along with a unique transcript identifier
and some options to transcripts_ui_ui().
* To render a UI, pass it to transcripts_ui_render().

## UI Components

Transcripts UI renders an HTML element for each of its components.
Each component element has a data-transcripts-id attribute set to
the trid. Each component also has a data-transcripts-role attribute
set to one of the following roles:

* transcript
* hit-panel
* transcript-controls
* video-controls

Your module is responsible for providing markup including an
HTML 5 audio or video tag contained within an element that has the
attribute:

* data-transcripts-id=TRID
* data-transcripts-role=video

where TRID is a transcript id shared by other UI components. Without 
making this linkage, transcripts will not be synced with your media.

Your module is also responsible for retrieving transcripts for the
UI; this is done by implementing hook_transcripts_ui_transcript().

## See also 

transcripts_apachesolr is one module that makes use of transcripts_ui.
