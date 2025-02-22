var hcd_tag = null;
var hcd_config = ProcessWire.config.HannaCodeDialog;

if(typeof CKEDITOR !== 'undefined') {
	CKEDITOR.plugins.addExternal('hannadropdown', hcd_config.plugins_url + 'hannadropdown/');
	CKEDITOR.plugins.addExternal('hannadialog', hcd_config.plugins_url + 'hannadialog/');
}
