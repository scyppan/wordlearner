//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none

//---------
//ENTRY FUNCTION
//---------

function wirewordlistclicks() {
  var items = document.querySelectorAll('.word-list li');

  items.forEach(function(li) {
    var wordtext = li.textContent.trim();
    var match = wordsdata.find(function(w) {
      return w.word === wordtext;
    });

    if (match) {
      li.addEventListener('click', function() {
        var panel = document.querySelector('.word-details');
        if (panel) {
          panel.classList.remove('hidden');
          // Placeholder content
          panel.textContent = 'Details for "' + match.word + '" will appear here.';
        }
      });
    }
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

// none — must be called manually after list is rendered
