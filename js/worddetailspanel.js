
function showworddetails(w) {
  setWordScript(w.word);
  setRomanization(w.romanization);
  setConfidence(w.confidence);
  setType(w.type);
  setPos(w.pos);
  setDefinition(w.definition);
  setNotes(w.notes);
}

function createScriptElement() {
  var span = document.createElement('span');
  span.className = 'word-script';
  span.contentEditable = true;
  span.style.cursor = 'text';
  return span;
}

function createRomanizationElement() {
  var span = document.createElement('span');
  span.className = 'word-romanization';
  span.style.marginLeft = '0.5em';
  return span;
}

function createConfidenceInput() {
  var input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = '10';
  input.step = '0.1';
  input.className = 'word-confidence-input';
  input.style.marginLeft = '0.5em';
  return input;
}

function createHeaderSection() {
  var header = document.createElement('div');
  header.className = 'word-header';
  header.appendChild(createScriptElement());
  header.appendChild(createRomanizationElement());
  header.appendChild(createConfidenceInput());
  return header;
}

function createTypeSelect() {
  var select = document.createElement('select');
  select.className = 'word-type-select';
  ['content', 'functionary'].forEach(function(optValue) {
    var opt = document.createElement('option');
    opt.value = optValue;
    opt.textContent = optValue;
    select.appendChild(opt);
  });
  return select;
}

function createPosInput() {
  var input = document.createElement('input');
  input.type = 'text';
  input.className = 'word-pos-input';
  return input;
}

function createMetaSection() {
  var meta = document.createElement('div');
  meta.className = 'word-meta';
  meta.style.marginTop = '0.5em';

  var typeLabel = document.createElement('label');
  typeLabel.textContent = 'Type: ';
  typeLabel.appendChild(createTypeSelect());
  meta.appendChild(typeLabel);

  var posLabel = document.createElement('label');
  posLabel.textContent = ' Part of speech: ';
  posLabel.appendChild(createPosInput());
  meta.appendChild(posLabel);

  return meta;
}

function createDefinitionSection() {
  var label = document.createElement('label');
  label.textContent = 'Definition:';
  label.style.display = 'block';
  label.style.marginTop = '0.5em';

  var textarea = document.createElement('textarea');
  textarea.className = 'word-definition-input';
  textarea.rows = 3;
  textarea.style.width = '100%';
  label.appendChild(textarea);

  return label;
}

function createNotesSection() {
  var label = document.createElement('label');
  label.textContent = 'Notes:';
  label.style.display = 'block';
  label.style.marginTop = '0.5em';

  var textarea = document.createElement('textarea');
  textarea.className = 'word-notes-input';
  textarea.rows = 2;
  textarea.style.width = '100%';
  label.appendChild(textarea);

  return label;
}

// panel builder

function createWordDetailsPanel() {
  var detail = document.createElement('div');
  detail.className = 'word-details';
  detail.appendChild(createHeaderSection());
  detail.appendChild(createMetaSection());
  detail.appendChild(createDefinitionSection());
  detail.appendChild(createNotesSection());
  return detail;
}

function setWordScript(text) {
  var el = document.querySelector('.word-script');
  if (el) el.textContent = text || '';
}

function setRomanization(text) {
  var el = document.querySelector('.word-romanization');
  if (el) el.textContent = text || '';
}

function setConfidence(value) {
  var el = document.querySelector('.word-confidence-input');
  if (el) el.value = value == null ? '' : value;
}

function setType(value) {
  var el = document.querySelector('.word-type-select');
  if (el) el.value = value || '';
}

function setPos(value) {
  var el = document.querySelector('.word-pos-input');
  if (el) el.value = value || '';
}

function setDefinition(text) {
  var el = document.querySelector('.word-definition-input');
  if (el) el.value = text || '';
}

function setNotes(text) {
  var el = document.querySelector('.word-notes-input');
  if (el) el.value = text || '';
}