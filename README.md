TRANSCRIPTS_UI provides a themeable interface for interacting with
timecoded transcripts in Drupal.

To acquire a UI, call transcripts_ui_ui() with the name of your
module, a unique transcript identifier (trid), and some transcript
options.

To acquire a rendered UI, pass the UI to transcripts_ui_render().

Transcripts UI renders an HTML element for each of its components.
Each component element has a data-transcripts-id attribute set to
the trid. Each component also has a data-transcripts-role attribute
set to one of the following roles:

  transcript
  hit-panel
  transcript-conrols
  video-controls

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

transcripts_apachesolr is a module that makes use of transcript_ui.
