# Transcripts UI

## Introduction

Transcripts UI provides a themeable interface for interacting with
timecoded transcripts in Drupal. The module assumes a very simple
data model for transcripts, which may work for you. A transcript is
divided into a number of Time Code Units (TCUs). Each TCU has an
optional speaker, a start time, and an end time. In addition, each
TCU has any number of "tiers". Tiers can be anything, but by
convention they are things like:

* a transcription of what the speaker said
* a translation of what the speaker said
* a morpheme-by-morpheme gloss of what the speaker said

The acronym "TCU" was inspired by its use within the
[TalkBank](http://talkbank.org/) system.

## Installation & Configuration

Enable the transcript_ui module.

Configure it at admin/config/user-interface/transcripts.
Opt for 'Default' markup, or 'Bootstrap' markup. Select the latter
if you are using the [Bootstrap theme](https://www.drupal.org/project/bootstrap)
with the [Bootstrap framework](http://getbootstrap.com/).

You must also define a list of tier identifiers and tier names.

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
following data attributes, where TRID is a transcript id shared by
other UI components. Without making this linkage, your transcript
will not be synced with the media.

* data-transcripts-id=TRID
* data-transcripts-role=video

Your module is also responsible for retrieving transcripts for the
UI; this is done by implementing hook_transcripts_ui_transcript().

Your module is then free to position and style the rendered components.

## Themeing the Output

Components and sub-components can be differently themed by 
(a) overriding the theme functions, or (b) altering the render arrays.
Render arrays can be altered in many ways, including adding or replacing
css and js files. For more on the 
[Scary Render Array](http://cocoate.com/ddbook/scary-render-array), see
[Render Arrays in Drupal](https://www.drupal.org/node/930760). 

## Transcript Search

Implementations of hook_transcripts_ui_transcript() may return highlights
in addition to the full transcript, if a term search has occurred.
A search box appears within the "hit-panel" component. Clicking on the
search button sends an AJAX request to the hook implementation, which
refreshes the hit-panel with new results.

If your implementation doesn't support transcript-internal search, then
do not include the hit-panel in your rendered output.

## Related Modules 

[transcripts_apachesolr](https://github.com/pinedrop/transcripts_apachesolr)
is one module that makes use of transcripts_ui.

## License

[GPL, version 2](http://www.gnu.org/licenses/old-licenses/gpl-2.0.html)

## Acknowledgement

Pinedrop's work on Transcripts UI has been sponsored by:

* The [Digital Scholarship Unit (DSU)](https://www.utsc.utoronto.ca/digitalscholarship/)
at the UTSC Library.
* [SHANTI](http://shanti.virginia.edu/) at the University of Virginia.
