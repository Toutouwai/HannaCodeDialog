CKEDITOR.plugins.add('hannadropdown',
{
	requires : ['richcombo'],
	lang: ['en'],
	init : function( editor )
	{
		// hanna tag names for the dropdown
		var tag_names = hcd_config.hanna_tags;

		// add the menu to the editor
		editor.ui.addRichCombo('HannaDropdown',
		{
			label: editor.lang.hannadropdown.dropdown_title,
			title: editor.lang.hannadropdown.dropdown_title,
			voiceLabel: editor.lang.hannadropdown.dropdown_title,
			className: 'cke_format',
			multiSelect:false,
			panel:
			{
				css: [ editor.config.contentsCss, CKEDITOR.skin.getPath('editor') ],
				voiceLabel: editor.lang.panelVoiceLabel
			},

			init: function()
			{
				this.startGroup( editor.lang.hannadropdown.dropdown_title );
				for (var i = 0; i < tag_names.length; i++)
				{
					this.add(tag_names[i], tag_names[i], tag_names[i]);
				}
			},

			onClick: function( value )
			{
				tag = value;
				editor.openDialog('hannadialog');
			}
		});
	}
});