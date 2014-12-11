# Transcripts UI

## Introduction

Transcripts UI provides a themeable interface for interacting with
timecoded transcripts in Drupal. Transcripts UI assumes a very simple
data model for transcripts, suitable for many uses. A transcript is
divided into a number of Time Code Units (TCUs). Each TCU has an
optional speaker, a start time, and an end time. In addition, each
TCU has any number of "tiers". Tiers can be anything, but by
convention they are things like:

* a transcription of what the speaker said
* a translation of what the speaker said
* a morpheme-by-morpheme gloss of what the speaker said

The acronym "TCU" was inspired by its use within the
[TalkBank](http://talkbank.org/) system.

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
set to one of the following roles.

* transcript: the element in which the transcript appears.
* hit-panel: the element in which hits are shown, if a term search
has occurred.
* transcript-controls: controls that alter the appearance of the
transcript, such as tier controls and display mode controls.
* video-controls: controls for AV playback, including buttons for
previous line, same line, next line, and so on.

Your module is responsible for providing markup including an
HTML 5 audio or video tag contained within an element that has the
attribute:

* data-transcripts-id=TRID
* data-transcripts-role=video

where TRID is a transcript id shared by other UI components. Without 
making this linkage, transcripts will not be synced with your media.

Your module is also responsible for retrieving transcripts for the
UI; this is done by implementing hook_transcripts_ui_transcript().

Your module is then free to position and style the rendered components.

## Related Modules 

transcripts_apachesolr is one module that makes use of transcripts_ui.

## License

[GPL, version 2](http://www.gnu.org/licenses/old-licenses/gpl-2.0.html)

## Acknowledgement

Pinedrop's work on Transcripts UI has been sponsored by:

* The [Digital Scholarship Unit (DSU)](https://www.utsc.utoronto.ca/digitalscholarship/)
at the UTSC Library.
* [SHANTI](http://shanti.virginia.edu/) at the University of Virginia.


