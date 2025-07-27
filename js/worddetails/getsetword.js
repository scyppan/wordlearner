//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none; uses wordsdata and shared helpers from elsewhere

//---------
//ENTRY FUNCTION
//---------

function showworddetails(word) {
    var panel = document.getElementById('word-details')
    if (!panel || !word) return

    setthaiscript(word)
    setromanization(word)
    setratingfromdb(word)
    settypefromdb(word)
    setposfromdb(word)
    setdefinitionfromdb(word)
    setnotesfromdb(word)
    setshortphrasesfromdb(word)
    setlongphrasesfromdb(word)
    setsentencesfromdb(word)
}

//---------
//MAJOR FUNCTIONS
//---------

function setthaiscript(word) {
    var el = document.getElementById('word-script')
    if (!el) return
    el.textContent = word.word || ''
    el.onblur = function() {
        changethaiscript(this.textContent.trim())
    }
}

function changethaiscript(val) {
    var word = getwordfromdetailspanel()
    word.word = val
    refreshwordlist(wordsdata)
    setthaiscript(word)
}

function setromanization(word) {
    var el = document.getElementById('word-romanization')
    if (!el) return
    el.textContent = word.romanization || ''
    el.onblur = function() {
        changeromanization(this.textContent.trim())
    }
}

function changeromanization(val) {
    var word = getwordfromdetailspanel()
    word.romanization = val
    refreshwordlist(wordsdata)
    setromanization(word)
}

function setratingfromdb(word) {
    var circles = document.getElementsByClassName('confidence-circle')
    var target = Number(word.confidence)
    for (var i = 0; i < circles.length; i++) {
        var c = circles[i]
        var v = Number(c.dataset.value)
        c.classList.toggle('filled', v <= target)
    }
}

function changerating(val) {
    var word = getwordfromdetailspanel()
    word.confidence = val
    setratingfromdb(word)
}

function settypefromdb(word) {
    var el = document.getElementById('word-type-select')
    if (!el) return
    el.value = word.type || ''
    el.onchange = function() {
        changetype(this.value)
    }
}

function changetype(val) {
    var word = getwordfromdetailspanel()
    word.type = val
    settypefromdb(word)
}

function changepos(val) {
    var word = getwordfromdetailspanel()
    word.pos = val
    setposfromdb(word)
}

function setposfromdb(word) {
    var el = document.getElementById('word-pos-input');
    if (!el) return;
    el.value = word.pos || '';
    // Replace any old handler
    el.oninput = function () {
        word.pos = this.value.trim();
        refreshwordlist(wordsdata);
    };
}

function setdefinitionfromdb(word) {
    var el = document.getElementById('word-definition-input');
    if (!el) return;
    el.value = word.definition || '';
    // Replace any old handler
    el.oninput = function () {
        word.definition = this.value;
        refreshwordlist(wordsdata);
    };
}

function changedefinition(val) {
    var word = getwordfromdetailspanel()
    word.definition = val
    refreshwordlist(wordsdata)
    setdefinitionfromdb(word)
}

function setnotesfromdb(word) {
    var el = document.getElementById('word-notes-input');
    if (!el) return;
    el.value = word.notes || '';
    el.oninput = function () {
        word.notes = this.value;
    };
}

function changenotes(val) {
    var word = getwordfromdetailspanel()
    word.notes = val
    setnotesfromdb(word)
}

function setshortphrasesfromdb(word) {
  var panel = document.getElementById('word-details');
  if (!panel) return;

  var sec = panel.querySelector('.word-advancement-section.shortphrases');
  if (!sec) return;

  var tbody = sec.querySelector('tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  var columns = ['thai', 'romanization', 'english'];

  for (var rowidx = 0; rowidx < (word.shortphrases || []).length; rowidx++) {
    var row = word.shortphrases[rowidx] || {};
    var tr = document.createElement('tr');

    for (var colidx = 0; colidx < columns.length; colidx++) {
      var col = columns[colidx];
      var td = document.createElement('td');
      var span = createinlineeditablespan('shortphrases-' + col);
      span.textContent = typeof row[col] === 'string' ? row[col] : '';
      span.onblur = (function(r, c) {
        return function() {
          changeshortphrasecell(word, r, c, this.textContent.trim());
        };
      })(rowidx, colidx);
      td.appendChild(span);
      tr.appendChild(td);
    }

    var tddel = document.createElement('td');
    var delbtn = document.createElement('button');
    delbtn.type = 'button';
    delbtn.className = 'advancement-del';
    delbtn.textContent = '-';
    delbtn.onclick = (function(r) {
      return function() {
        word.shortphrases.splice(r, 1);
        setshortphrasesfromdb(word);
        refreshwordlist(wordsdata);
      };
    })(rowidx);
    tddel.appendChild(delbtn);
    tr.appendChild(tddel);

    tbody.appendChild(tr);
  }

  var addbtn = sec.querySelector('.advancement-add');
  if (addbtn) {
    addbtn.onclick = function() {
      word.shortphrases.push({ thai: '', romanization: '', english: '' });
      setshortphrasesfromdb(word);
      refreshwordlist(wordsdata);
    };
  }
}

function changeshortphrasecell(word, rowidx, colidx, newvalue) {
  if (!word || !word.shortphrases) return;

  var columns = ['thai', 'romanization', 'english'];
  var key = columns[colidx];
  if (!key) return;

  if (!word.shortphrases[rowidx]) {
    word.shortphrases[rowidx] = { thai: '', romanization: '', english: '' };
  }

  word.shortphrases[rowidx][key] = newvalue;
  refreshwordlist(wordsdata);
}

function setlongphrasesfromdb(word) {
  var panel = document.getElementById('word-details');
  if (!panel) return;

  var sec = panel.querySelector('.word-advancement-section.longphrases');
  if (!sec) return;

  var tbody = sec.querySelector('tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  var columns = ['thai', 'romanization', 'english'];

  for (var rowidx = 0; rowidx < (word.longphrases || []).length; rowidx++) {
    var row = word.longphrases[rowidx] || {};
    var tr = document.createElement('tr');

    for (var colidx = 0; colidx < columns.length; colidx++) {
      var col = columns[colidx];
      var td = document.createElement('td');
      var span = createinlineeditablespan('longphrases-' + col);
      span.textContent = typeof row[col] === 'string' ? row[col] : '';
      span.onblur = (function(r, c) {
        return function() {
          changelongphrasecell(word, r, c, this.textContent.trim());
        };
      })(rowidx, colidx);
      td.appendChild(span);
      tr.appendChild(td);
    }

    var tddel = document.createElement('td');
    var delbtn = document.createElement('button');
    delbtn.type = 'button';
    delbtn.className = 'advancement-del';
    delbtn.textContent = '-';
    delbtn.onclick = (function(r) {
      return function() {
        word.longphrases.splice(r, 1);
        setlongphrasesfromdb(word);
        refreshwordlist(wordsdata);
      };
    })(rowidx);
    tddel.appendChild(delbtn);
    tr.appendChild(tddel);

    tbody.appendChild(tr);
  }

  var addbtn = sec.querySelector('.advancement-add');
  if (addbtn) {
    addbtn.onclick = function() {
      word.longphrases.push({ thai: '', romanization: '', english: '' });
      setlongphrasesfromdb(word);
      refreshwordlist(wordsdata);
    };
  }
}

function changelongphrasecell(word, rowidx, colidx, newvalue) {
  if (!word || !word.longphrases) return;

  var columns = ['thai', 'romanization', 'english'];
  var key = columns[colidx];
  if (!key) return;

  if (!word.longphrases[rowidx] || typeof word.longphrases[rowidx] !== 'object') {
    word.longphrases[rowidx] = { thai: '', romanization: '', english: '' };
  }

  word.longphrases[rowidx][key] = newvalue;
  refreshwordlist(wordsdata);
}

function setsentencesfromdb(word) {
  var panel = document.getElementById('word-details');
  if (!panel) return;

  var sec = panel.querySelector('.word-advancement-section.sentences');
  if (!sec) return;

  var tbody = sec.querySelector('tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  var columns = ['thai', 'romanization', 'english'];

  for (var rowidx = 0; rowidx < (word.sentences || []).length; rowidx++) {
    var row = word.sentences[rowidx] || {};
    var tr = document.createElement('tr');

    for (var colidx = 0; colidx < columns.length; colidx++) {
      var col = columns[colidx];
      var td = document.createElement('td');
      var span = createinlineeditablespan('sentences-' + col);
      span.textContent = typeof row[col] === 'string' ? row[col] : '';
      span.onblur = (function(r, c) {
        return function() {
          changesentencecell(word, r, c, this.textContent.trim());
        };
      })(rowidx, colidx);
      td.appendChild(span);
      tr.appendChild(td);
    }

    var tddel = document.createElement('td');
    var delbtn = document.createElement('button');
    delbtn.type = 'button';
    delbtn.className = 'advancement-del';
    delbtn.textContent = '-';
    delbtn.onclick = (function(r) {
      return function() {
        word.sentences.splice(r, 1);
        setsentencesfromdb(word);
        refreshwordlist(wordsdata);
      };
    })(rowidx);
    tddel.appendChild(delbtn);
    tr.appendChild(tddel);

    tbody.appendChild(tr);
  }

  var addbtn = sec.querySelector('.advancement-add');
  if (addbtn) {
    addbtn.onclick = function() {
      word.sentences.push({ thai: '', romanization: '', english: '' });
      setsentencesfromdb(word);
      refreshwordlist(wordsdata);
    };
  }
}

function changesentencecell(word, rowidx, colidx, newvalue) {
  if (!word || !word.sentences) return;

  var columns = ['thai', 'romanization', 'english'];
  var key = columns[colidx];
  if (!key) return;

  if (!word.sentences[rowidx] || typeof word.sentences[rowidx] !== 'object') {
    word.sentences[rowidx] = { thai: '', romanization: '', english: '' };
  }

  word.sentences[rowidx][key] = newvalue;
  refreshwordlist(wordsdata);
}



//---------
//HELPER FUNCTIONS
//---------

function getwordfromdetailspanel() {
    var key = document.getElementById('word-script').textContent.trim()
    var found = wordsdata.find(function(w) { return w.word === key })
    return found || wordsdata[0]
}

//---------
//IMMEDIATE FUNCTIONS
//---------
// (none)
