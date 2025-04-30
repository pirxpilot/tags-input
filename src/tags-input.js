const escapeStringRegexp = require('escape-string-regexp');

module.exports = tagsInput;

const BACKSPACE = 8;
const TAB = 9;
const ENTER = 13;
const ESC = 27;
const LEFT = 37;
const RIGHT = 39;
const DELETE = 46;

const COPY_PROPS = ['autocomplete', 'disabled', 'readonly', 'type', 'list'];
const MOVE_PROPS = [
  'accept',
  'accesskey',
  'autocapitalize',
  'autofocus',
  'dir',
  'inputmode',
  'lang',
  'max',
  'maxlength',
  'min',
  'minlength',
  'pattern',
  'placeholder',
  'size',
  'spellcheck',
  'step',
  'tabindex',
  'title'
];

function checkerForSeparator(separator) {
  function simple(separator) {
    return {
      split: s => s.split(separator),
      join: arr => arr.join(separator),
      test: char => char === separator
    };
  }

  function multi(separators) {
    let regex = separators.split('').map(escapeStringRegexp).join('|');

    regex = new RegExp(regex);

    return {
      split: s => s.split(regex),
      join: arr => arr.join(separators[0]),
      test: char => regex.test(char)
    };
  }

  return separator.length > 1 ? multi(separator) : simple(separator);
}

function createElement(type, name, text, attributes) {
  const el = document.createElement(type);
  if (name) el.className = name;
  if (text) el.textContent = text;
  for (const key in attributes) {
    el.setAttribute(`data-${key}`, attributes[key]);
  }
  return el;
}

function caretAtStart({ selectionStart, selectionEnd, value }) {
  try {
    return selectionStart === 0 && selectionEnd === 0;
  } catch {
    return value === '';
  }
}

function tagsInput(input) {
  const base = createElement('div', 'tags-input');
  const checker = checkerForSeparator(input.getAttribute('data-separator') || ',');
  const allowDuplicates = checkAllowDuplicates();

  input.insertAdjacentElement('afterend', base);
  input.classList.add('visuallyhidden');

  const inputType = input.getAttribute('type');
  if (!inputType || inputType === 'tags') {
    input.setAttribute('type', 'text');
  }
  base.input = createElement('input');
  COPY_PROPS.forEach(prop => {
    if (input.hasAttribute(prop)) {
      base.input.setAttribute(prop, input.getAttribute(prop));
    }
  });
  MOVE_PROPS.forEach(prop => {
    if (input.hasAttribute(prop)) {
      base.input.setAttribute(prop, input.getAttribute(prop));
      input.removeAttribute(prop);
    }
  });
  base.appendChild(base.input);

  const datalistUpdater = makeDatalistUpdater();

  input.setAttribute('type', 'text');
  input.tabIndex = -1;

  input.addEventListener('focus', () => {
    base.input.focus();
  });

  base.input.addEventListener('focus', () => {
    base.classList.add('focus');
    select();
  });

  base.input.addEventListener('blur', () => {
    base.classList.remove('focus');
    select();
    savePartialInput();
    dispatchEvent('complete');
  });

  base.input.addEventListener('keydown', e => {
    // ignore keydown events when IME is active
    if (e.isComposing || e.keyCode === 229) {
      return;
    }

    const el = base.input;
    const key = e.keyCode || e.which;
    const separator = checker.test(e.key);
    const selectedTag = $('.tag.selected');
    const lastTag = $('.tag:last-of-type');

    if (key === ESC) {
      base.input.value = '';
      base.input.blur();
      return;
    }
    if (key === ENTER || key === TAB || separator) {
      if (!el.value && !separator) {
        if (key === ENTER) base.input.blur();
        return;
      }
      savePartialInput();
    } else if (key === DELETE && selectedTag) {
      if (selectedTag !== lastTag) select(selectedTag.nextSibling);
      base.removeChild(selectedTag);
      save();
    } else if (key === BACKSPACE) {
      if (selectedTag) {
        select(selectedTag.previousSibling);
        base.removeChild(selectedTag);
        save();
      } else if (lastTag && caretAtStart(el)) {
        select(lastTag);
      } else {
        return;
      }
    } else if (key === LEFT) {
      if (selectedTag) {
        if (selectedTag.previousSibling) {
          select(selectedTag.previousSibling);
        }
      } else if (!caretAtStart(el)) {
        return;
      } else {
        select(lastTag);
      }
    } else if (key === RIGHT) {
      if (!selectedTag) return;
      select(selectedTag.nextSibling);
    } else {
      return select();
    }

    e.preventDefault();
    return false;
  });

  // Proxy "input" (live change) events , update the first tag live as the user types
  // This means that users who only want one thing don't have to enter commas
  base.input.addEventListener('input', () => {
    input.value = getValue();
    input.dispatchEvent(new Event('input'));
  });

  // handle selection from datalist
  base.input.addEventListener('change', () => setTimeout(savePartialInput, 0));

  // One tick after pasting, parse pasted text as CSV:
  base.input.addEventListener('paste', () => setTimeout(savePartialInput, 0));

  if (window.PointerEvent) {
    base.addEventListener('pointerdown', refocus);
  } else {
    base.addEventListener('mousedown', refocus);
    base.addEventListener('touchstart', refocus);
  }

  base.setValue = setValue;
  base.getValue = getValue;

  // Add tags for existing values
  savePartialInput(input.value, true);

  const self = { setValue, getValue };
  Object.defineProperty(self, 'disabled', {
    get: () => base.input.disabled,
    set(v) {
      if (v) {
        base.setAttribute('disabled', '');
      } else {
        base.removeAttribute('disabled');
      }
      base.input.disabled = v;
    }
  });
  return self;

  function $(selector) {
    return base.querySelector(selector);
  }

  function $$(selector) {
    return base.querySelectorAll(selector);
  }

  function getValue(vv = getValues()) {
    return checker.join(vv);
  }

  function getValues() {
    const values = [];
    $$('.tag').forEach(({ textContent }) => values.push(textContent));
    if (base.input.value) values.unshift(base.input.value);
    return values;
  }

  function setValue(value) {
    $$('.tag').forEach(t => base.removeChild(t));
    savePartialInput(value, true);
  }

  function save(init) {
    const values = getValues();
    input.value = getValue(values);
    datalistUpdater?.update(values);
    if (init) {
      return;
    }
    input.dispatchEvent(new Event('change'));
  }

  function checkAllowDuplicates() {
    const allow = input.getAttribute('data-allow-duplicates') || input.getAttribute('duplicates');
    return allow === 'on' || allow === '1' || allow === 'true';
  }

  // Return false if no need to add a tag
  function addTag(text) {
    let added = false;
    function addOneTag(text) {
      const tag = text?.trim();
      // Ignore if text is empty
      if (!tag) return;

      // Check input validity (eg, for pattern=)
      // At tags-input init fill the base.input
      base.input.value = text;
      if (!base.input.checkValidity()) {
        base.classList.add('error');
        setTimeout(() => base.classList.remove('error'), 150);
        return;
      }

      // For duplicates, briefly highlight the existing tag
      if (!allowDuplicates) {
        const exisingTag = $(`[data-tag="${tag}"]`);
        if (exisingTag) {
          exisingTag.classList.add('dupe');
          setTimeout(() => exisingTag.classList.remove('dupe'), 100);
          return;
        }
      }

      base.insertBefore(createElement('span', 'tag', tag, { tag }), base.input);
      added = true;
    }

    // Add multiple tags if the user pastes in data with SEPERATOR already in it
    checker.split(text).forEach(addOneTag);
    return added;
  }

  function select(el) {
    const sel = $('.selected');
    if (sel) sel.classList.remove('selected');
    if (el) el.classList.add('selected');
  }

  function savePartialInput(value, init) {
    if (typeof value !== 'string' && !Array.isArray(value)) {
      // If the base input does not contain a value, default to the original element passed
      value = base.input.value;
    }
    if (addTag(value) !== false) {
      base.input.value = '';
      save(init);
    } else {
      datalistUpdater?.update(getValues());
    }
  }

  function refocus(e) {
    base.input.focus();
    if (e.target.classList.contains('tag')) select(e.target);
    if (e.target === base.input) return select();
    e.preventDefault();
    return false;
  }

  function dispatchEvent(name) {
    const ce = new CustomEvent(`tags-input-${name}`, { bubbles: true });
    input.dispatchEvent(ce);
  }

  function makeDatalistUpdater() {
    // no need to maintain if duplicates are allowed
    if (allowDuplicates) return;

    // cannot use input.list here because input might not be connected to the document yet
    const listId = input.getAttribute('list');

    // no need to maintain a shadow list if there's no original list
    if (!listId) return;

    // use querySelector to find the list in case it's not connected to the document
    const datalist = document.getElementById(listId) || input.parentNode?.querySelector(`datalist#${listId}`);
    if (!datalist) return;

    // observe the datalist for changes
    const observer = new MutationObserver(() => update(getValues()));
    observer.observe(datalist, { childList: true });

    return {
      update
    };

    function update(values) {
      for (const option of datalist.children) {
        option.disabled = values.includes(option.value);
      }
    }
  }
}

// make life easier:
tagsInput.enhance = tagsInput.tagsInput = tagsInput;
