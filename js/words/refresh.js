//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none

//---------
//ENTRY FUNCTION
//---------

function refreshwordlist() {
  var ul = document.getElementById('word-list');
  if (!ul) return;
  ul.innerHTML = '';
  wordsdata.forEach(function(w) {
    var li = document.createElement('li');
    li.textContent = w.word;
    li.addEventListener('click', function() {
      showworddetails(w);
    });
    ul.appendChild(li);
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
