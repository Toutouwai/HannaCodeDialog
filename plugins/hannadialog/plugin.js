var hcd_config = ProcessWire.config.HannaCodeDialog;

// Escape string for regex
function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

CKEDITOR.plugins.add( 'hannadialog', {
	requires: 'widget,lineutils,dialog',

	onLoad: function() {
		CKEDITOR.addCss( '.cke_hannatag { background-color:' + hcd_config.widget_colour + '; }' );
		CKEDITOR.addCss( '.cke_widget_wrapper:hover > .cke_hannatag, .cke_widget_focused .cke_hannatag { outline:2px solid ' + hcd_config.widget_colour + ' !important; }' );
	},

	init: function( editor ) {

		// Register dialog
		CKEDITOR.dialog.add( 'hannadialog', this.path + 'dialogs/hannadialog.js' );

		// Widget
		editor.widgets.add( 'hannadialog', {
			dialog: 'hannadialog',
			pathName: 'hannadialog',
			template: '<span class="cke_hannatag">' + hcd_config.open_tag + hcd_config.close_tag + '</span>',

			downcast: function() {
				return new CKEDITOR.htmlParser.text( hcd_config.open_tag + this.data.name + hcd_config.close_tag );
			},

			init: function() {
				this.setData( 'name', this.element.getText().slice(hcd_config.open_tag.length, -hcd_config.close_tag.length) );
			},

			data: function() {
				this.element.setText( hcd_config.open_tag + this.data.name + hcd_config.close_tag );
			},

			edit: function() {
				// Set tag variable to name of tag being edited
				hcd_tag = this.data.name.trim();
			}
		} );

	},

	afterInit: function( editor ) {
		
		var pattern = new RegExp(escapeRegExp(hcd_config.open_tag) + '.*?' + escapeRegExp(hcd_config.close_tag), "g");

		editor.dataProcessor.dataFilter.addRules( {
			text: function( text, node ) {
				var dtd = node.parent && CKEDITOR.dtd[ node.parent.name ];
				if ( dtd && !dtd.span ) return;
				return text.replace( pattern, function( match ) {
					var innerElement = new CKEDITOR.htmlParser.element( 'span', {
						'class': 'cke_hannatag'
					} );
					innerElement.add( new CKEDITOR.htmlParser.text( match ) );
					var widgetWrapper = editor.widgets.wrapElement( innerElement, 'hannadialog' );
					return widgetWrapper.getOuterHtml();
				} );
			}
		} );

	}
});
