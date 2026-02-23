import tagsInput from '../src/tags-input.js';

const tis = [];
for (const input of document.querySelectorAll('form input')) {
  const ti = tagsInput(input);
  input.addEventListener('change', onchange);
  tis.push(ti);
}

document.querySelector('input[type="checkbox"]').addEventListener('change', ev => {
  const enabled = ev.target.checked;
  tis.forEach(ti => (ti.disabled = !enabled));
});
document.querySelector('.forms').addEventListener('tags-input-complete', oncomplete);

function onchange({ target }) {
  const span = target.parentElement.querySelector('.value');
  span.textContent = target.value;
}

function oncomplete(ev) {
  console.log('complete', ev.details, ev.target.value);
}
