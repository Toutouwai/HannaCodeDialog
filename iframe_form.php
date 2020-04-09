<?php namespace ProcessWire;

/* @var array $current_attributes */
/* @var array $hanna_tags */
/* @var Page $edited_page */
/* @var string $inputfield_name */
/* @var Modules $modules */

// Current attribute values
$tag_name = $current_attributes['name'];
unset($current_attributes['name']);

// Default attributes for tag
$default_attributes = isset($hanna_tags[$tag_name]) ? $hanna_tags[$tag_name] : [];

// Get form from hookable method
$form = $modules->HannaCodeDialog->buildForm($tag_name, $edited_page, $current_attributes, $default_attributes, $inputfield_name);

// Work out inputfield attributes from default attributes
$options = [];
$types = [];
$descriptions = [];
$notes = [];
foreach($default_attributes as $key => $value) {
	if(strpos($key, '__') === false) continue;
	if(substr($key, -9) === '__options') {
		$options[substr($key, 0, -9)] = $value;
		unset($default_attributes[$key]);
	} elseif(substr($key, -6) === '__type') {
		$types[substr($key, 0, -6)] = strtolower($value);
		unset($default_attributes[$key]);
	} elseif(substr($key, -13) === '__description') {
		$descriptions[substr($key, 0, -13)] = $value;
		unset($default_attributes[$key]);
	} elseif(substr($key, -7) === '__notes') {
		$notes[substr($key, 0, -7)] = $value;
		unset($default_attributes[$key]);
	}
}

// Add fields to form if they weren't already added in hook
foreach($default_attributes as $key => $value) {
	// Get the field if it already exists in the form
	$f = $form->getChildByName($key);
	// Otherwise create field from default attributes
	if(!$f) {
		// Determine field type
		if(isset($options[$key])) {
			// Options-type field
			$type = 'InputfieldSelect';
			if(isset($types[$key])) {
				switch($types[$key]) {
					case 'radios':
						$type = 'InputfieldRadios';
						break;
					case 'selectmultiple':
						$type = 'InputfieldSelectMultiple';
						break;
					case 'asmselect':
						$type = 'InputfieldAsmSelect';
						break;
					case 'checkboxes':
						$type = 'InputfieldCheckboxes';
						break;
				}
			}
			$f = $this->modules->get($type);
			// Add options
			$select_options_string = $options[$key];
			$data = $this->modules->getModuleConfigData('TextformatterHannaCode');
			$open_tag = !empty($data['openTag']) ? $data['openTag'] : \TextformatterHannaCode::DEFAULT_OPEN_TAG;
			if(strpos($select_options_string, $open_tag) !== false) {
				$this->modules->TextformatterHannaCode->formatValue($edited_page, new Field(), $select_options_string);
			}
			$select_options = $this->modules->HannaCodeDialog->prepareOptions($select_options_string, $key, $tag_name, $edited_page);
			if(array_values($select_options) === $select_options) {
				// Regular array
				foreach($select_options as $select_option) {
					$f->addOption($select_option);
				}
			} else {
				// Associative array
				$f->addOptions($select_options);
			}
		} else {
			// Non-options-type field
			$type = 'InputfieldText';
			if(isset($types[$key])) {
				switch($types[$key]) {
					case 'textarea':
						$type = 'InputfieldTextarea';
						break;
					case 'checkbox':
						$type = 'InputfieldCheckbox';
						break;
					case 'pagelistselect':
						$type = 'InputfieldPageListSelect';
						break;
					case 'pagelistselectmultiple':
						$type = 'InputfieldPageListSelectMultiple';
						break;
				}
			}
			$f = $this->modules->get($type);
		}
		// Set other field attributes
		$f->attr('id+name', $key);
		if(isset($descriptions[$key])) $f->description = $descriptions[$key];
		if(isset($notes[$key])) $f->notes = $notes[$key];
		$f->label = ucfirst(str_replace('_', ' ', $key));
		// Add field to form
		$form->append($f);
	}
	// Set value if not already set in hook
	if(!$f->value) {
		switch($f->className) {
			case 'InputfieldCheckbox':
				$checked = isset($current_attributes[$key]) ? (int) $current_attributes[$key] : (int) $value;
				$f->attr('checked', $checked === 1 ? 'checked' : '');
				break;
			case 'InputfieldPageListSelectMultiple':
			case 'InputfieldPageAutocomplete':
				$f->value = isset($current_attributes[$key]) ? explode(',', $current_attributes[$key]) : explode(',', $value);
				break;
			default:
				$f->value = isset($current_attributes[$key]) ? $current_attributes[$key] : $value;
		}
	}
}

?>

<style>
	#notices, #NotificationMenu, #NotificationGhosts { display:none !important; } /* Don't show notices/notifications */
	/*#tracy-debug { display:none !important; }*/ /* Tracy doesn't fit well in the dialog */
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