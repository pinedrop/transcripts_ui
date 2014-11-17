(function($) {
	Drupal.behaviors.transcripts = {
		attach: function(context, settings) {
			$('#transcripts-profile-edit-form:not(.processed)', context).each(
				function() {
					//hide edit-default-modes radio buttons
					$('.form-item-default-mode').hide();
					
					//give control to inserted links
					$('#edit-modes .form-item').each(
						function() {
							var $def = $('#' + $(this).find('input').attr('id').replace('edit-modes', 'edit-default-mode'));
							$('<span class="default-mode-selector"><a href="#" class="set-default">set default</a></span>')
								.appendTo($(this))
								.find('.set-default')
								.click(
									function() {
										$('.set-default').html('set default');
										$(this).html('DEFAULT');
										$def.attr('checked', true);
										return false;
									}
								);
								
							//mark as default if default mode
							if ($def.is(':checked')) {
								$(this).find('.set-default').html('DEFAULT');	
							}
						}
					);
						
					//if mode is not selected, hide the default mode selector
					$('#edit-modes input:not(:checked)').parent('.form-item').find('.default-mode-selector').hide();
					$('#edit-modes input').change(
						function() {
							$(this).parent('.form-item').find('.default-mode-selector').toggle($(this).is(':checked'));
						}
					);
				}
			)
			.addClass('processed');
		}
	}
})(jQuery);
