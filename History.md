
4.0.1 / 2026-02-23
==================

 * update github actions
 * upgrade `biome` to 2.4.4
 * remove broken Readme badge

4.0.0 / 2025-04-29
==================

 * update dependencies
 * transition to ESM format
 * use `biome` as a linter and formatter

3.1.3 / 2024-03-23
==================

 * fix deleting tags on Firefox

3.1.2 / 2024-03-23
==================

 * update datalist when empty input become active
 * add mutation observer to properly react on datalist updates
 * maintain a single datalist per input

3.1.1 / 2024-02-27
==================

 * use `insertAdjacentElement` to insert dom nodes
 * improve support for cases when input is not in the document

3.1.0 / 2024-02-25
==================

 * add better support for datalist / autocomplete
 * improve demo
 * remove polyfill for event.key
 * remove polyfill for NodeList.forEach

3.0.0 / 2019-04-12
==================

 * add `tags-input-complete` event
 * handle ESC key
 * stop transpiling to ES5

2.3.0 / 2018-01-22
==================

 * revert to original DOM structure
 * add support for disabling tags input

2.2.0 / 2018-01-22
==================

 * use PointerEvents if available
 * export get/setValue for the wrapped component
 * use .visuallyhidden to hide input

2.1.8 / 2018-01-22
==================

 * use passive listeners for mousedown and touchstart

2.1.7 / 2017-07-19
==================

 * improve support for `pattern` and other validation attributes 

2.1.6 / 2017-06-03
==================

 * fix pattern support

2.1.5 / 2017-05-15
==================

 * transpile ES2015 to ES5 before publishing
 * switch from babel to buble

2.1.4 / 2017-02-17
==================

 * change name to @pirxpilot/tags-input

2.1.3 / 2016-12-06
==================

 * fix unnecessary saving when no new tag was added
 * no need for workaround for FF input.dispatchEvent bug
 * don't dispatch 'change' event when input field is merely being initialized

2.1.2 / 2016-12-02
==================

 * improve example / test
 * minor performance fixes

2.1.1 / 2016-12-02
==================

 * add workaround for FF input.dispatchEvent bug

2.1.0 / 2016-11-26
==================

 * add support for multiple separators

2.0.0 / 2016-11-25
==================

 * switch to browserify only builds
 * make separator configurable through `data-separator`
 * use flex instead of recalculating input width
 * preserve original input type - etc. 'edit' or 'url'
