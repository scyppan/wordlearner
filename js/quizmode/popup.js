//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none

//---------
//ENTRY FUNCTION
//---------

function showquizitempopup(item) {
  removewordpopup();

  var content = getquizitempopupcontent(item);

  var popup = document.createElement('div');
  popup.id = 'quiz-item-popup';
  popup.className = 'quiz-item-popup';

  var textdiv = document.createElement('div');
  textdiv.className = 'quiz-item-popup-text';
  textdiv.textContent = content;

  popup.appendChild(textdiv);
  document.body.appendChild(popup);

  function dismisspopup() {
    document.removeEventListener('keydown', escclose);
    document.removeEventListener('click', outsideclick);
    removewordpopup();
  }

  // Dismiss on ESC
  function escclose(ev) {
    if (ev.key === 'Escape') dismisspopup();
  }
  document.addEventListener('keydown', escclose);

  // Dismiss on outside click
  function outsideclick(ev) {
    if (!popup.contains(ev.target)) dismisspopup();
  }
  document.addEventListener('click', outsideclick);
}

//---------
//MAJOR FUNCTIONS
//---------

function getquizitempopupcontent(item) {
  var wordobj = findwordobjectforitem(item);
  if (!wordobj) {
    return '❌ cannot find entry';
  }

  // Direct word match
  if (wordobj.word === item.item) {
    var main = wordobj.word || '';
    var roman = wordobj.romanization ? ' (' + wordobj.romanization + ')' : '';
    var pos = wordobj.pos ? ' - ' + wordobj.pos : '';
    var def = wordobj.definition ? '\n' + wordobj.definition : '';
    var notes = wordobj.notes ? '\n\n' + wordobj.notes : '';
    return main + roman + pos + def + notes;
  }

  // Phrase or sentence
  var found = findphraseorsentenceinwordobj(item, wordobj);
  if (found) {
    var line1 = found.thai || '';
    var line2 = found.romanization || '';
    var line3 = found.english || '';
    return line1 + '\n\n' + line2 + '\n\n' + line3;
  }

  // fallback
  var fallback = item.thai || item.item || '';
  return fallback;
}

function findwordobjectforitem(item) {
  return wordsdata.find(function (w) {
    if (w.word === item.thai) return true;
    return ['shortphrases', 'longphrases', 'sentences'].some(function (arr) {
      return w[arr] && w[arr].some(function (p) { return p.thai === item.thai; });
    });
  });
}

function findphraseorsentenceinwordobj(item, wordobj) {
  var short = checkshortphrasesforitem(item, wordobj);
  if (short) return short;

  var long = checklongphrasesforitem(item, wordobj);
  if (long) return long;

  var sent = checksentencesforitem(item, wordobj);
  if (sent) return sent;

  return null;
}

function checkshortphrasesforitem(item, wordobj) {
  if (!Array.isArray(wordobj.shortphrases)) return null;
  var match = wordobj.shortphrases.find(function (p) {
    return p.thai === item.item || p.thai === item.thai;
  });
  if (match) {
    return {
      thai: match.thai,
      romanization: match.romanization || '',
      english: match.english || ''
    };
  }
  return null;
}

function checklongphrasesforitem(item, wordobj) {
  if (!Array.isArray(wordobj.longphrases)) return null;
  var match = wordobj.longphrases.find(function (p) {
    return p.thai === item.item || p.thai === item.thai;
  });
  if (match) {
    return {
      thai: match.thai,
      romanization: match.romanization || '',
      english: match.english || ''
    };
  }
  return null;
}

function checksentencesforitem(item, wordobj) {
  if (!Array.isArray(wordobj.sentences)) return null;
  var match = wordobj.sentences.find(function (p) {
    return p.thai === item.item || p.thai === item.thai;
  });
  if (match) {
    return {
      thai: match.thai,
      romanization: match.romanization || '',
      english: match.english || ''
    };
  }
  return null;
}

//---------
//HELPER FUNCTIONS
//---------

function removewordpopup() {
  var pop = document.getElementById('quiz-item-popup');
  if (pop) pop.remove();
}

//---------
//IMMEDIATE FUNCTIONS
//---------

// none
