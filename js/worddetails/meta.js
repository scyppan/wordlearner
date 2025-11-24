//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none; uses document and shared helpers

//---------
//ENTRY FUNCTION
//---------

function createmetasection() {
  // simple empty meta container; no type or part-of-speech UI
  var meta = document.createElement('div');
  meta.id = 'word-meta';
  return meta;
}

//---------
//MAJOR FUNCTIONS (PRIVATE)
//---------

function createtypeselect() {
  var select = document.createElement('select');
  select.id = 'word-type-select';  // was className, now id
  ['content', 'functionary'].forEach(function(optvalue) {
    var opt = document.createElement('option');
    opt.value = optvalue;
    opt.textContent = optvalue;
    select.appendChild(opt);
  });
  return select;
}

function createposinput() {
  var input = document.createElement('input');
  input.type = 'text';
  input.id = 'word-pos-input';     // was className, now id
  return input;
}

//---------
//HELPER FUNCTIONS
//---------
// (none)

//---------
//IMMEDIATE FUNCTIONS
//---------
// (none)
