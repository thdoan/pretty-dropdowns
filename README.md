# jQuery Pretty Dropdowns

Pretty Dropdowns is a simple, lightweight jQuery plugin that converts `<select>` drop-down menus into "pretty" menus that you can style using CSS. As an extra bonus, it does its best to keep the menu options within the viewport.

**[See a demo &raquo;](http://thdoan.github.io/pretty-dropdowns/demo.html)**

## Getting Started

### Step 1: Link the required files

```
<link rel="stylesheet" href="/css/prettydropdowns.css">
<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
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

## Installation

Choose from one of the following methods:

- `git clone git@github.com:thdoan/pretty-dropdowns.git`
- `git clone https://github.com/thdoan/pretty-dropdowns.git`
- `bower install pretty-dropdowns`
- `npm install pretty-dropdowns`
- [Download ZIP](https://github.com/thdoan/pretty-dropdowns/archive/master.zip)
