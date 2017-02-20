# jQuery Pretty Dropdowns

Pretty Dropdowns is a simple, lightweight jQuery plugin that converts `<select>` drop-down menus into "pretty" menus that you can style using CSS.

### Features:

- Two arrow styles and sizes to choose from (or add your own style)
- Full keyboard navigation support (you can even go directly to a menu item by typing its text)
- Accessible (it plays nicely with screen readers)
- Sensible (when you open the menu it does its best to keep the menu items within the viewport)

**[See a demo &raquo;](https://thdoan.github.io/pretty-dropdowns/demo.html)**

## Getting Started

### Step 1: Link the required files

```
<link rel="stylesheet" href="/css/prettydropdowns.css">
<script src="//code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="/js/jquery.prettydropdowns.js"></script>
```

You have complete control over the look and feel of the drop-down menu by modifying `prettydropdowns.css`. It is recommended to load the JavaScript files at the bottom just before the closing `</body>` tag if possible.

### Step 2: Call the .prettyDropdown() function

Make sure this comes after the two required JavaScript files from Step 1 are loaded.

```
<script>
$(document).ready(function() {
  $('select').prettyDropdown();
});
</script>
```

You can also specify some options:

```
<script>
$(document).ready(function() {
  $('select').prettyDropdown({
    height: 30
  });
});
</script>
```

## Options

Name          | Type   | Default | Description
------------- | ------ | ------- | -----------
`customClass` | string | arrow   | The class name to customize the drop-down menu style. The default `arrow` class displays a chevron-type arrow icon. Two additional helper classes are built in (add either or both to `arrow`): `triangle` converts the chevron into a solid triangle; `small` renders the arrow icon at half size.
`height`      | number | 50      | The drop-down menu height.
`hoverIntent` | number | 200     | The wait period (in milliseconds) before collapsing the drop-down menu after you hover off of it. If you hover back onto the menu within the wait period, it will remain open.

## Keyboard Navigation

Key     | Menu Closed | Menu Open
------- | ----------- | ---------
`Tab`   | Put focus on the next drop-down menu. |
`Shift`+`Tab` | Put focus on the previous drop-down menu. |
`Enter` | Open the drop-down menu. | Select the highlighted item.
`Esc`   | | Close the drop-down menu.
`Home`  | | Jump to the first item in the drop-down menu.
`End`   | | Jump to the last item in the drop-down menu.
`PgUp`  | | Go to the previous page of items. If there is no scrollbar, then this is the same as `Home`.
`PgDn`  | | Go to the next page of items. If there is no scrollbar, then this is the same as `End`.
`Up`    | | Highlight the previous item in the drop-down menu.
`Down`  | | Highlight the next item in the drop-down menu.
`A`-`Z`<br>`0`-`9`<br>`Space` | `Space` opens the drop-down menu. | Jump to the first item matching the key(s) pressed. Every time you press a key it will cycle through the matching items. **Hint:** if you type fast enough, it will try to find a match for everything you typed instead of just the first character.

## Installation

Choose from one of the following methods:

- `git clone git@github.com:thdoan/pretty-dropdowns.git`
- `git clone https://github.com/thdoan/pretty-dropdowns.git`
- `bower install pretty-dropdowns`
- `npm install pretty-dropdowns`
- [Download ZIP](https://github.com/thdoan/pretty-dropdowns/archive/master.zip)
