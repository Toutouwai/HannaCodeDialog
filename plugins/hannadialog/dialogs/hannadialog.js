var $dialog_iframe = null;

function iframeSrc(tag, field_name) {
	return hcd_config.iframe_path + '&tag=' + encodeURIComponent(tag) + '&field_name=' + field_name;
}

CKEDITOR.dialog.add( 'hannadialog', function( editor ) {
	var field_name = editor.element.getAttribute('name');
	return {
		title: hcd_config.dialog_title,
		minWidth: 200,
		minHeight: 200,
		resizable: CKEDITOR.DIALOG_RESIZE_NONE,
		contents : [
			{
				id: 'hanna_iframe_wrap',
				elements : [
					{
						type: 'html',
						html: '<iframe id="hanna_iframe_' + editor.id + '" src="' + iframeSrc(tag, field_name) + '" frameborder="0" style="width:' + hcd_config.dialog_width + 'px; height:' + hcd_config.dialog_height + 'px;"></iframe>'
					}
				]
			}
		],
		onShow: function() {
			var iframe = this.getElement().getDocument().getById('hanna_iframe_' + editor.id);
			$dialog_iframe = $('#' + iframe.getAttribute('id')); // iframe to jQuery object
			iframe.setAttribute('src', iframeSrc(tag, field_name));
		},
		onCancel: function() {
			// Clear src to avoid flash of old iframe src on next load
			var iframe = this.getElement().getDocument().getById('hanna_iframe_' + editor.id);
			iframe.setAttribute('src', '');
		},
		onOk: function() {
			// Clear src to avoid flash of old iframe src on next load
			var iframe = this.getElement().getDocument().getById('hanna_iframe_' + editor.id);
			iframe.setAttribute('src', '');
			// Write tag back to editor
			var tag_name = $dialog_iframe.contents().find('#hanna-form').data('name');
			var $inputfields = $dialog_iframe.contents().find('#hanna-form li.Inputfield');
			var out = '';
			$inputfields.each(function() {
				if( $(this).attr('id') === 'wrap_hanna-submit' ) return;
				var id = $(this).attr('id').replace('wrap_', '');
				var value = '';
				// Textarea
				if($(this).hasClass('InputfieldTextarea')) {
					value = $(this).find('textarea').val();
					// Remove line breaks because they break CKEditor widget
					value = value.replace(/(\r\n|\n|\r)/gm, '');
				}
				// Select
				else if($(this).hasClass('InputfieldSelect')) {
					value = $(this).find('select').val();
				}
				// AsmSelect and SelectMultiple
				else if($(this).hasClass('InputfieldAsmSelect') || $(this).hasClass('InputfieldSelectMultiple')) {
					var the_value = $(this).find('#' + id).val();
					if(the_value) value = the_value.join('|');
				}
				// Checkboxes and Radios
				else if($(this).hasClass('InputfieldCheckboxes') || $(this).hasClass('InputfieldRadios')) {
					var checked = $.map($(this).find('input:checked'), function(v) { return $(v).val(); });
					value = checked.join('|');
				}
				// Checkbox
				else if($(this).hasClass('InputfieldCheckbox')) {
					value = $(this).find('#' + id).is(':checked') ? 1 : '';
				}
				// InputfieldText and everything else
				else {
					value = $(this).find('input').val();
				}
				out += ' ' + id + '="' + value + '"';
			});
			editor.insertText( hcd_config.open_tag + tag_name + out + hcd_config.close_tag );
		}
	};
});
