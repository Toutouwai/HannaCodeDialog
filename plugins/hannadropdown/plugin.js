CKEDITOR.plugins.add('hannadropdown',
{
	requires : ['richcombo'],
	init : function( editor )
	{
		// hanna tag names for the dropdown
		var tag_names = hcd_config.hanna_tags;

		// add the menu to the editor
		editor.ui.addRichCombo('HannaDropdown',
		{
			label: hcd_config.dropdown_title,
			title: hcd_config.dropdown_title,
			voiceLabel: hcd_config.dropdown_title,
			className: 'cke_format',
			multiSelect:false,
			panel:
			{
				css: [ editor.config.contentsCss, CKEDITOR.skin.getPath('editor') ],
				voiceLabel: editor.lang.panelVoiceLabel
			},

			init: function()
			{
				this.startGroup( hcd_config.dropdown_title );
				for (var i = 0; i < tag_names.length; i++)
				{
					this.add(tag_names[i], tag_names[i], tag_names[i]);
				}
			},

			onClick: function( value )
			{
				if(hcd_config.tags_no_attributes.indexOf(value) !== -1) {
					editor.insertHtml(hcd_config.open_tag + value + hcd_config.close_tag);
				} else {
					tag = value;
					editor.openDialog('hannadialog');
				}
			}
		});
	}
});
