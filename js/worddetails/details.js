//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none; uses document and shared helpers

//---------
//ENTRY FUNCTION
//---------

function createdetailsection() {
  // This is the ONLY function called externally.
  // Returns a fragment containing both the definition and notes sections.
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createdefinitionsection());
  fragment.appendChild(createnotessection());
  return fragment;
}

//---------
//MAJOR FUNCTIONS
//---------

function createdefinitionsection() {
  var container = document.createElement('div');
  container.id = 'word-definition-section';

  var label = document.createElement('label');
  label.htmlFor = 'word-definition-input';
  label.textContent = 'Definition:';
  container.appendChild(label);

  var ta = document.createElement('textarea');
  ta.id = 'word-definition-input';
  ta.rows = 3;
  container.appendChild(ta);

  return container;
}

function createnotessection() {
  var container = document.createElement('div');
  container.id = 'word-notes-section';

  var label = document.createElement('label');
  label.htmlFor = 'word-notes-input';
  label.textContent = 'Notes:';
  container.appendChild(label);

  var ta = document.createElement('textarea');
  ta.id = 'word-notes-input';
  ta.rows = 2;
  container.appendChild(ta);

  return container;
}

//---------
//HELPER FUNCTIONS
//---------

// (none)

//---------
//IMMEDIATE FUNCTIONS
//---------

// (none; only createdetailsection is called externally)
