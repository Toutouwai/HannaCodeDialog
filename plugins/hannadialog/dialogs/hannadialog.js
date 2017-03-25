var $dialog_iframe = null;

function iframeSrc(tag) {
	return hcd_config.iframe_path + '&tag=' + encodeURIComponent(tag);
}

CKEDITOR.dialog.add( 'hannadialog', function( editor ) {
	return {
		title: editor.lang.hannadialog.dialog_title,
		minWidth: 200,
		minHeight: 200,
		resizable: CKEDITOR.DIALOG_RESIZE_NONE,
		contents : [
			{
				id: 'hanna_iframe_wrap',
				elements : [
					{
						type: 'html',
						html: '<iframe id="hanna_iframe" src="' + iframeSrc(tag) + '" frameborder="0" style="width:' + hcd_config.dialog_width + 'px; height:' + hcd_config.dialog_height + 'px;"></iframe>'
					}
				]
			}
		],
		onShow: function() {
			var iframe = this.getElement().getDocument().getById('hanna_iframe');
			$dialog_iframe = $('#' + iframe.getAttribute('id')); // iframe to jQuery object
			iframe.setAttribute('src', iframeSrc(tag));
		},
		onCancel: function() {
			// clear src to avoid flash of old iframe src on next load
			var iframe = this.getElement().getDocument().getById('hanna_iframe');
			iframe.setAttribute('src', '');
		},
		onOk: function() {
			// clear src to avoid flash of old iframe src on next load
			var iframe = this.getElement().getDocument().getById('hanna_iframe');
			iframe.setAttribute('src', '');
			// write tag back to editor
			var tag_name = $dialog_iframe.contents().find('#hanna-form').data('name');
			var $inputfields = $dialog_iframe.contents().find('#hanna-form li.Inputfield');
			var out = '';
			$inputfields.each(function() {
				if( $(this).attr('id') === 'wrap_hanna-submit' ) return;
				var id = $(this).attr('id').replace('wrap_', '');
				var value = '';
				if( $(this).hasClass('InputfieldText') ) {
					value = $(this).find('input').val();
				} else if( $(this).hasClass('InputfieldSelect') ) {
					value = $(this).find('select').val();
				}
				else if( $(this).hasClass('InputfieldAsmSelect') || $(this).hasClass('InputfieldSelectMultiple') ) {
					value = $(this).find('#' + id).val().join('|');
				} else if( $(this).hasClass('InputfieldCheckboxes') || $(this).hasClass('InputfieldRadios') ) {
					var checked = $.map($(this).find('input:checked'), function(v) { return $(v).val(); });
					value = checked.join('|');
				} else if( $(this).hasClass('InputfieldCheckbox') ) {
					value = $(this).find('#' + id).is(':checked') ? 1 : '';
				}
				out += ' ' + id + '="' + value + '"';
			});
			editor.insertText( hcd_config.open_tag + tag_name + out + hcd_config.close_tag );
		}
	};
});
