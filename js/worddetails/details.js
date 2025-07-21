
function createDefinitionSection() {
  var container = document.createElement('div');
  container.className = 'word-definition-section';

  var label = document.createElement('label');
  label.className = 'definition-label';
  label.textContent = 'Definition:';
  container.appendChild(label);

  var ta = document.createElement('textarea');
  ta.className = 'word-definition-input';
  ta.rows = 3;
  container.appendChild(ta);

  return container;
}

function createNotesSection() {
  var container = document.createElement('div');
  container.className = 'word-notes-section';

  var label = document.createElement('label');
  label.className = 'notes-label';
  label.textContent = 'Notes:';
  container.appendChild(label);

  var ta = document.createElement('textarea');
  ta.className = 'word-notes-input';
  ta.rows = 2;
  container.appendChild(ta);

  return container;
}