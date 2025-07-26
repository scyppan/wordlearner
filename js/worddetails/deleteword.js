//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none; relies on wordsdata and shared helpers from elsewhere

//---------
//ENTRY FUNCTION
//---------

function createdeletewordbutton(word) {
    var delbtn = document.createElement('button');
    delbtn.type = 'button';
    delbtn.id = 'word-delete-btn';
    delbtn.className = 'word-delete-btn';
    delbtn.textContent = 'Delete Word';
    delbtn.style.margin = '1em 0 0 auto';
    delbtn.onclick = function () {
        deleteword();
    };
    return delbtn;
}

//---------
//MAJOR FUNCTIONS
//---------

function deleteword() {
  const detail = getwordfromdetailspanel();
  const idx = wordsdata.findIndex(function(w) {
    return w.word === detail.word;
  });
  if (idx !== -1) {
    wordsdata.splice(idx, 1);
  }
  renderwordpanel();
}


//---------
//HELPER FUNCTIONS
//---------

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — createdeletewordbutton is called externally
