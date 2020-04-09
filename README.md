# HannaCodeDialog

A module for ProcessWire CMS/CMF. Provides a number of enhancements for working with Hanna Code tags in CKEditor. The main enhancement is that Hanna tags in a CKEditor field may be double-clicked to edit their attributes using core ProcessWire inputfields in a modal dialog.

Requires the Hanna Code module and >= ProcessWire v3.0.0.

## Installation

[Install](http://modules.processwire.com/install-uninstall/) the HannaCodeDialog module using any of the normal methods.

For any CKEditor field where you want the "Insert Hanna tag" dropdown menu to appear in the CKEditor toolbar, visit the field settings and add "HannaDropdown" to the "CKEditor Toolbar" settings field.

## Module configuration

Visit the module configuration screen to set any of the following:

* Exclude prefix: Hanna tags named with this prefix will not appear in the CKEditor toolbar dropdown menu for Hanna tag insertion.
* Exclude Hanna tags: Hanna tags selected here will not appear in the CKEditor toolbar dropdown menu for Hanna tag insertion.
* Background colour of tag widgets: you can customise the background colour used for Hanna tags in CKEditor if you like.
* Dialog width: in pixels
* Dialog height: in pixels

## Features

### Insert tag from toolbar dropdown menu

Place the cursor in the CKEditor window where you want to insert your Hanna tag, then select the tag from the "Insert Hanna tag" dropdown.

!['Insert Hanna tag' dropdown](https://user-images.githubusercontent.com/1538852/50802865-0c394480-134d-11e9-873c-f86273bf1981.png)

Advanced: if you want to control which tags appear in the dropdown on particular pages or templates you can hook `HannaCodeDialog::getDropdownTags`. See the forum support thread for [examples](https://processwire.com/talk/topic/15902-hannacodedialog/?do=findComment&comment=141902) .

### Edit tag attributes in modal dialog

Insert a tag using the dropdown or double-click an existing tag in the CKEditor window to edit the tag attributes in a modal dialog.

![Modal dialog](https://user-images.githubusercontent.com/1538852/50802862-08a5bd80-134d-11e9-91b5-a051b59bccef.png)

### Tags are widgets

Hanna tags that have been inserted in a CKEditor window are "widgets" - they have a background colour for easy identification, are protected from accidental editing, and can be moved within the text by drag-and-drop.

![Widget](https://user-images.githubusercontent.com/1538852/50802867-0d6a7180-134d-11e9-9455-b870c8755946.png)

### Options for tag attributes may be defined

You can define options for a tag attribute so that editors must choose an option rather than type text. This is useful for when only certain strings are valid for an attribute and also has the benefit of avoiding typos.

Add a new attribute for the Hanna tag, named the same as the existing attribute you want to add options for, followed by "__options". The options themselves are defined as a string, using a pipe character as a delimiter between options. Example for an existing attribute named "vegetables":

    vegetables__options=Spinach|Pumpkin|Celery|Tomato|Brussels Sprout|Potato

You can define a default for an attribute as normal. Use a pipe delimiter if defining multiple options as the default, for example:

    vegetables=Tomato|Potato

### Dynamic options

Besides defining static options as above, you can use one Hanna tag to dynamically generate options for another. For instance, you could create a Hanna tag that generates options based on images that have been uploaded to the page, or the titles of children of the page.

Your Hanna tag that generates the options should **echo** a string of options delimited by pipe characters (i.e. the same format as a static options string).

You will probably want to name the Hanna tag that generates the options so that it starts with an underscore (or whatever prefix you have configured as the "exclude" prefix in the module config), to avoid it appearing as an insertable tag in the HannaCodeDialog dropdown menu.

Example for an existing attribute named "image":

    image__options=[[_images_on_page]]

And the code for the `_images_on_page` tag:

    <?php
    $image_names = array();
    $image_fields = $page->fields->find('type=FieldtypeImage')->explode('name');
    foreach($image_fields as $image_field) {
        $image_names = array_unique( array_merge($image_names, $page->$image_field->explode('name') ) );
    }
    echo implode('|', $image_names);

### Choice of inputfield for attribute

You can choose the inputfield that is used for an attribute in the dialog.

For text attributes the supported inputfields are `text` (this is the default inputfield for text attributes so it isn't necessary to specify it if you want it) and `textarea`. Note: any manual line breaks inside a textarea are removed because these will break the CKEditor tag widget.

Inputfields that support the selection of a single option are `select` (this is the default inputfield for attributes with options so it isn't necessary to specify it if you want it) and `radios`.

Inputfields that support the selection of multiple options are `selectmultiple`, `asmselect` and  `checkboxes`.

For selecting pages you can use `pagelistselect` or `pagelistselectmultiple`. You don't supply select options for these inputfield types.

You can also specify a `checkbox` inputfield - this is not for attributes with defined options but will limit an attribute to an integer value of 1 or 0.

The names of the inputfield types are case-insensitive.

Example for an existing attribute named "vegetables":

    vegetables__type=asmselect

### Descriptions and notes for inputfields

You can add a description or notes to an attribute and these will be displayed in the dialog.

Example for an existing attribute named "vegetables":

    vegetables__description=Please select vegetables for your soup.
    vegetables__notes=Pumpkin and celery is a delicious combination.

## Notes

When creating or editing a Hanna tag you can view a basic cheatsheet outlining the HannaCodeDialog features relating to attributes below the "Attributes" config inputfield.

## Advanced

### Define or manipulate options in a hook

You can hook `HannaCodeDialog::prepareOptions` to define or manipulate options for a Hanna tag attribute. Your Hanna tag must include a `someattribute__options` attribute in order for the hook to fire. The `prepareOptions` method receives the following arguments that can be used in your hook:

* `options_string` Any existing string of options you have set for the attribute
* `attribute_name` The name of the attribute the options are for
* `tag_name` The name of the Hanna tag
* `page` The page being edited

If you hook after `HannaCodeDialog::prepareOptions` then your hook should set `$event->return` to an array of option values, or an associative array in the form of `$value => $label`.

### Build entire dialog form in a hook

You can hook after `HannaCodeDialog::buildForm` to add inputfields to the dialog form. You can define options for the inputfields when you add them. Using a hook like this can be useful if you prefer to configure inputfield type/options/descriptions/notes in your IDE rather than as extra attributes in the Hanna tag settings. It's also useful if you want to use inputfield settings such as `showIf`.

**When you add the inputfields you must set both the `name` and the `id` of the inputfield to match the attribute name.**

You only need to set an inputfield value in the hook if you want to force the value - otherwise the current values from the tag are automatically applied.

To use this hook you only have to define the essential attributes (the "fields" for the tag) in the Hanna Code settings and then all the other inputfield settings can be set in the hook.

#### PageAutocomplete inputfield type

The `PageAutocomplete` inputfield type can only be used via a `HannaCodeDialog::buildForm` hook. See the [PHPDoc documentation](https://github.com/processwire/processwire/blob/51629cdd5f381d3881133baf83e1bd2d9306f867/wire/modules/Inputfield/InputfieldPageAutocomplete/InputfieldPageAutocomplete.module#L11-L24) for the list of inputfield properties that may be set. Particularly `findPagesSelector` for limiting the pages that may be selected and `maxSelectedItems` for allowing only a single page selection.

#### Example buildForm() hook

The Hanna Code attributes defined for tag "meal" (a default value is defined for "vegetables"):

```
vegetables=Carrot
meat
cooking_style
comments
```

The hook code in /site/ready.php:

```php
$wire->addHookAfter('HannaCodeDialog::buildForm', function(HookEvent $event) {

    // The Hanna tag that is being opened in the dialog
    $tag_name = $event->arguments(0);

    // Other arguments if you need them
    /* @var Page $edited_page */
    $edited_page = $event->arguments(1); // The page open in Page Edit
    $current_attributes = $event->arguments(2); // The current attribute values
    $default_attributes = $event->arguments(3); // The default attribute values
    $inputfield_name = $event->arguments(4); // The name of the CKEditor inputfield - may end in a repeater suffix

    // The form rendered in the dialog
    /* @var InputfieldForm $form */
    $form = $event->return;

    if($tag_name === 'meal') {

        $modules = $event->wire('modules');

        /* @var InputfieldCheckboxes $f */
        $f = $modules->InputfieldCheckboxes;
        $f->name = 'vegetables'; // Set name to match attribute
        $f->id = 'vegetables'; // Set id to match attribute
        $f->label = 'Vegetables';
        $f->description = 'Please select some vegetables.';
        $f->notes = "If you don't eat your vegetables you can't have any pudding.";
        $f->addOptions(['Carrot', 'Cabbage', 'Celery'], false);
        $form->add($f);

        /* @var InputfieldRadios $f */
        $f = $modules->InputfieldRadios;
        $f->name = 'meat';
        $f->id = 'meat';
        $f->label = 'Meat';
        $f->addOptions(['Pork', 'Beef', 'Chicken', 'Lamb'], false);
        $form->add($f);

        /* @var InputfieldSelect $f */
        $f = $modules->InputfieldSelect;
        $f->name = 'cooking_style';
        $f->id = 'cooking_style';
        $f->label = 'How would you like it cooked?';
        $f->addOptions(['Fried', 'Boiled', 'Baked'], false);
        $form->add($f);

        /* @var InputfieldText $f */
        $f = $modules->InputfieldText;
        $f->name = 'comments';
        $f->id = 'comments';
        $f->label = 'Comments for the chef';
        $f->showIf = 'cooking_style=Fried';
        $form->add($f);

    }

});
````

## Troubleshooting

HannaCodeDialog includes and automatically loads the third-party CKEditor plugins [Line Utilities](http://ckeditor.com/addon/lineutils) and [Widget](http://ckeditor.com/addon/widget). If you have added these plugins to your CKEditor field already for some purpose and experience problems with HannaCodeDialog try deactivating those plugins from the CKEditor field settings.

## License

Released under Mozilla Public License v2. See file LICENSE for details.
