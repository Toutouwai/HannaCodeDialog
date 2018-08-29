<?php
// current attribute values
$tag_name = $current_attributes['name'];
unset($current_attributes['name']);

// default attributes for tag
$default_attributes = isset($hanna_tags[$tag_name]) ? $hanna_tags[$tag_name] : array();
$options = array();
$types = array();
$descriptions = array();
$notes = array();
foreach($default_attributes as $key => $value) {
    if(substr($key, -9) === '__options') {
    	$options[substr($key, 0, -9)] = $value;
    	unset($default_attributes[$key]);
    }
	if(substr($key, -6) === '__type') {
		$types[substr($key, 0, -6)] = $value;
		unset($default_attributes[$key]);
	}
	if(substr($key, -13) === '__description') {
		$descriptions[substr($key, 0, -13)] = $value;
		unset($default_attributes[$key]);
	}
	if(substr($key, -7) === '__notes') {
		$notes[substr($key, 0, -7)] = $value;
		unset($default_attributes[$key]);
	}
}

$form = $this->modules->get('InputfieldForm');
$form->attr('id+name', 'hanna-form');
$form->attr('data-name', $tag_name);

// add form elements
foreach($default_attributes as $key => $value) {
    if(isset($options[$key])) {
	    $if = 'InputfieldSelect';
	    if(isset($types[$key])) {
		    switch ( strtolower($types[$key]) ) {
			    case 'radios':
				    $if = 'InputfieldRadios';
				    break;
			    case 'selectmultiple':
				    $if = 'InputfieldSelectMultiple';
				    break;
			    case 'asmselect':
				    $if = 'InputfieldAsmSelect';
				    break;
			    case 'checkboxes':
				    $if = 'InputfieldCheckboxes';
				    break;
		    }
	    }
	    $f = $this->modules->get($if);
	    $select_options_string = $options[$key];
	    $data = $this->modules->getModuleConfigData('TextformatterHannaCode');
	    $open_tag = isset($data['openTag']) ? $data['openTag'] : TextformatterHannaCode::DEFAULT_OPEN_TAG;
	    if(strpos($select_options_string, $open_tag) !== false) {
		    $this->modules->TextformatterHannaCode->formatValue($edited_page, new Field(), $select_options_string);
	    }
	    $select_options = $this->modules->HannaCodeDialog->prepareOptions($select_options_string, $key, $tag_name, $edited_page);
	    if(array_values($select_options) === $select_options) {
	    	// regular array
		    foreach($select_options as $select_option) {
			    $f->addOption($select_option);
		    }
	    } else {
	    	// associative array
		    $f->addOptions($select_options);
	    }


	    $f->value = isset($current_attributes[$key]) ? $current_attributes[$key] : $value;
    } elseif( isset($types[$key]) && strtolower($types[$key]) === 'checkbox' ) {
	    $f = $this->modules->get('InputfieldCheckbox');
	    $checked = isset($current_attributes[$key]) ? (int) $current_attributes[$key] : (int) $value;
	    $f->attr('checked', $checked === 1 ? 'checked' : '');
    } elseif( isset($types[$key]) && strtolower($types[$key]) === 'textarea' ) {
	    $f = $this->modules->get('InputfieldTextarea');
	    $f->value = isset($current_attributes[$key]) ? $current_attributes[$key] : $value;
    } else {
	    $f = $this->modules->get('InputfieldText');
	    $f->value = isset($current_attributes[$key]) ? $current_attributes[$key] : $value;
    }
	$f->attr('id+name', $key);
	if(isset($descriptions[$key])) $f->description = $descriptions[$key];
	if(isset($notes[$key])) $f->notes = $notes[$key];
	$f->label = ucfirst(str_replace('_', ' ', $key));

	$form->append($f);
}
?>

<style>
	#notices, #NotificationMenu, #NotificationGhosts { display:none !important; } /* Don't show notices/notifications */
	#tracy-debug { display:none !important; } /* Tracy doesn't fit well in the dialog */
	body.modal { margin-top:5px; }
	body.modal #content { padding:0 5px; }
	body.modal .pw-container { padding:0; }
	body.modal .pw-content #tag-head { margin:0 0 15px 0; font-size:20px; }
	.InputfieldForm { margin-bottom:0; }
	.pw-content p.hanna-message { margin:-5px 0 0; }
	body.AdminThemeUikit #main { padding:0 !important; margin:10px 0 20px !important; }
</style>

<h2 id="tag-head"><?= ucfirst(str_replace('_', ' ', $tag_name)) ?></h2>
<?= $form->render() ?>
<?php
if(!$default_attributes) {
	if(!isset($hanna_tags[$tag_name])) {
		echo '<p class="hanna-message">'. $this->_('Invalid tag: no Hanna tag with this name exists.') . '</p>';
	} else {
		echo '<p class="hanna-message">'. $this->_('This tag has no editable attributes.') . '</p>';
	}
}
?>