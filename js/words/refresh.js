//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none

//---------
//ENTRY FUNCTION
//---------

function refreshwordlist(items) {
  var ul = document.getElementById('word-list');
  if (!ul) return;
  ul.innerHTML = '';
  (items || wordsdata).forEach(function(w, idx) {
    ul.appendChild(buildli(w));
  });
}


//---------
//MAJOR FUNCTIONS
//---------

// none

//---------
//HELPER FUNCTIONS
//---------

// none

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — refreshwordlist() is the only function external scripts should call
