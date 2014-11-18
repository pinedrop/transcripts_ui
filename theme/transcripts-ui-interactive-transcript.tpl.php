<div>
	<div id='<?php print $trid; ?>' class='transcript-player'>
		<?php print render($transcript_controls); ?>
		<table>
			<tr>
				<td class='video-wrapper'>
					<?php print $video_tag; ?>
					<?php print render($video_controls); ?>
				</td>
				<td class='transcript-wrapper'>
					<ul class='nav nav-tabs' role='tablist'>
						<li class='active'><a href='#transcript-<?php print $trid; ?>' role='tab' data-toggle='tab'>Transcript</a></li>
						<li><a href='#hits-<?php print $trid; ?>' role='tab' data-toggle='tab'>Search</a></li>
					</ul>
					<div class='transcript-content tab-content'>
						<div class='tab-pane active' id='transcript-<?php print $trid; ?>'>
							<?php print render($transcript); ?>
						</div>
						<div class='tab-pane' id='hits-<?php print $trid; ?>'>
							<?php print render($hits); ?>
						</div>
					</div>
				</td>
			</tr>
		</table>
	</div>
</div>
