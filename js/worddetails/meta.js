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

  var typeLabel = document.createElement('label');
  typeLabel.textContent = 'Type: ';
  typeLabel.appendChild(createTypeSelect());
  meta.appendChild(typeLabel);

  var posLabel = document.createElement('label');
  posLabel.textContent = 'Part of Speech: ';
  posLabel.appendChild(createPosInput());
  meta.appendChild(posLabel);

  return meta;
}