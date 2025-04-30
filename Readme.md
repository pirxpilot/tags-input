[![NPM version][npm-image]][npm-url]

# @pirxpilot/tags-input

HTML input component that allows for simplified adding and removing tags, emails, urls etc.
Click [**here**][demo] to see the demo.

This is a fork of [tags-input] project with some additional features:

- configurable tag separator - through `data-separator`
- various input types like `email`, `phone`, or `url`
- can be used with browserify (possible other bundlers)

Features of [tags-input] are also supported:

- full keyboard, mouse and focus support
- works with HTML5 `pattern`, `placeholder`, `autocomplete` etc.
- native [`change`][change-event] and [`input`][input-event] _("live" change)_ events
- works in modern browsers and IE10+

## Options

Component can be configured through `dataset` attributes:

- `data-separator` - string containing one or more characters that will be used as separators
- `data-allow-duplicates` - if set to truthy value input will not automatically remove duplicated tags

## Usage

`tags-input.css` can be used for basic styling

```html
<form>
	<label for='simple'>Simple</label>
	<input id='simple' type='text'>
	<label for='email'>Email</label>
	<input id='email' type='email' data-separator=' ,;' placeholder="space, comma, or semicolon">
	<label for='url'>URL</label>
	<input id='url' type='url' data-separator=' '>
</form>
<script type="text/javascript">
	var tagsInput = require('@pirxpilot/tags-input');
	for (let input of document.querySelectorAll('form input')) {
		tagsInput(input);
	}
</script>
```

More detailed example can be found in [index.html][example]

## License

MIT Copyright (c) 2014 Jason Miller

[tags-input]: https://github.com/developit/tags-input
[demo]: https://pirxpilot.github.io/tags-input
[example]: https://raw.githubusercontent.com/pirxpilot/tags-input/gh-pages/index.html
[change-event]: https://developer.mozilla.org/en-US/docs/Web/Events/change
[input-event]: https://developer.mozilla.org/en-US/docs/Web/Events/input

[npm-image]: https://img.shields.io/npm/v/@pirxpilot/tags-input.svg
[npm-url]: https://npmjs.org/package/@pirxpilot/tags-input

