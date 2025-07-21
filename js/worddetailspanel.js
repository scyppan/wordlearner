// Factory for inline‐editable labels
function createInlineEditableSpan(className) {
    var span = document.createElement('span');
    span.className = className + ' inline-label';
    span.contentEditable = true;
    span.setAttribute('tabindex', 0);
    span.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            span.blur();
        }
    });
    return span;
}

// Field factories
function createScriptElement() {
    return createInlineEditableSpan('word-script');
}

function createRomanizationElement() {
    var span = createInlineEditableSpan('word-romanization');
    span.style.marginLeft = '0.75em';
    return span;
}

function createConfidenceRating(max = 10) {
    const container = document.createElement('div');
    container.className = 'confidence-rating';
    container.dataset.max = max;

    // hidden input
    const input = document.createElement('input');
    input.type = 'hidden';
    input.className = 'word-confidence-input';
    container.appendChild(input);

    // build circles
    const circles = [];
    for (let i = 1; i <= max; i++) {
        const circle = document.createElement('span');
        circle.className = 'confidence-circle';
        circle.dataset.value = i;
        circle.addEventListener('click', () => container.setRating(i));
        container.appendChild(circle);
        circles.push(circle);
    }

    // clear all fills
    container.reset = function () {
        input.value = '';
        circles.forEach(c => c.classList.remove('filled'));
    };

    // apply a rating and fire onChange
    container.setRating = function (val) {
        input.value = val;
        circles.forEach(c =>
            c.classList.toggle('filled', Number(c.dataset.value) <= val)
        );
        if (typeof container.onChange === 'function') {
            container.onChange(val);
        }
    };

    return container;
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

// Definition section factory (no inline styles)
function createDefinitionSection() {
  var section = document.createElement('div');
  section.className = 'word-definition-section';

  var label = document.createElement('label');
  label.className = 'definition-label';
  label.textContent = 'Definition:';
  section.appendChild(label);

  var textarea = document.createElement('textarea');
  textarea.className = 'word-definition-input';
  textarea.rows = 3;
  section.appendChild(textarea);

  return section;
}

// Notes section factory (no inline styles)
function createNotesSection() {
  var section = document.createElement('div');
  section.className = 'word-notes-section';

  var label = document.createElement('label');
  label.className = 'notes-label';
  label.textContent = 'Notes:';
  section.appendChild(label);

  var textarea = document.createElement('textarea');
  textarea.className = 'word-notes-input';
  textarea.rows = 2;
  section.appendChild(textarea);

  return section;
}

// Meta section factory, only Part of Speech
function createMetaSection() {
  var meta = document.createElement('div');
  meta.className = 'word-meta';

  // Type dropdown
  var typeLabel = document.createElement('label');
  typeLabel.className = 'meta-label';
  typeLabel.textContent = 'Content Type:';
  var typeSelect = createTypeSelect();
  typeLabel.appendChild(typeSelect);
  meta.appendChild(typeLabel);

  // Part of Speech
  var posLabel = document.createElement('label');
  posLabel.className = 'meta-label';
  posLabel.textContent = 'Part of Speech: ';
  
  var posInput = createPosInput();
  posLabel.appendChild(posInput);
  meta.appendChild(posLabel);

  return meta;
}

function createHeaderSection() {
    var header = document.createElement('div');
    header.className = 'word-header';
    header.style.display = 'flex';
    header.style.alignItems = 'baseline';
    header.style.gap = '0.75em';

    header.appendChild(createScriptElement());
    header.appendChild(createRomanizationElement());
    header.appendChild(createConfidenceRating(10));

    return header;
}

function createWordDetailsPanel() {
    var detail = document.createElement('div');
    detail.className = 'word-details';
    detail.appendChild(createHeaderSection());
    detail.appendChild(createMetaSection());
    detail.appendChild(createDefinitionSection());
    detail.appendChild(createNotesSection());
    return detail;
}

function showworddetails(w) {
 document.querySelector('.word-details').classList.remove('hidden');


  // inline‐editable fields
  const scriptEl = document.querySelector('.word-script');
  const romanEl  = document.querySelector('.word-romanization');
  scriptEl.textContent = w.word || '';
  romanEl.textContent  = w.romanization || '';
  scriptEl.onblur    = () => { w.word = scriptEl.textContent.trim(); };
  romanEl.onblur     = () => { w.romanization = romanEl.textContent.trim(); };

  // confidence rating
  const ratingWidget = document.querySelector('.confidence-rating');
    ratingWidget.reset();
    ratingWidget.setRating(w.confidence);

  // other fields
  const typeSelect = document.querySelector('.word-type-select');
  typeSelect.value    = w.type || '';
  typeSelect.onchange = () => { w.type = typeSelect.value; };

  const posInput = document.querySelector('.word-pos-input');
  posInput.value      = w.pos || '';
  posInput.onchange   = () => { w.pos = posInput.value; };

  const defArea = document.querySelector('.word-definition-input');
  defArea.value       = w.definition || '';
  defArea.onchange    = () => { w.definition = defArea.value; };

  const notesArea = document.querySelector('.word-notes-input');
  notesArea.value     = w.notes || '';
  notesArea.onchange  = () => { w.notes = notesArea.value; };
}

