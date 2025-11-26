//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// itemsdata is declared in globals.js
// shape of each item:
// {
//   id: 'it1',
//   thai: 'ฉันจะไปกินข้าว',
//   romanization: 'chan ja bpai gin khaao',
//   english: 'I will go eat rice',
//   notes: '',
//   type: 'shortphrase' | 'longphrase' | 'sentence',
//   roots:  ['ไป', 'กิน'],
//   combos: ['จะไป', 'ไปกิน']
// }

var itemsidcounter = 1;


//---------
//MAJOR FUNCTIONS
//---------

function ensureitemsarray() {
  if (!Array.isArray(itemsdata)) {
    itemsdata = [];
  }
}

function normalisetags(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map(function(t) { return typeof t === 'string' ? t.trim() : ''; })
      .filter(function(t) { return t !== ''; });
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(function(t) { return t.trim(); })
      .filter(function(t) { return t !== ''; });
  }
  return [];
}

function makeitemkey(thai, romanization, english) {
  var t = (thai || '').trim();
  var r = (romanization || '').trim();
  var e = (english || '').trim();
  return t + '||' + r + '||' + e;
}

function finditemindex(thai, romanization, english) {
  ensureitemsarray();
  var key = makeitemkey(thai, romanization, english);
  for (var i = 0; i < itemsdata.length; i++) {
    var item = itemsdata[i];
    if (!item) continue;
    var k = makeitemkey(item.thai, item.romanization, item.english);
    if (k === key) return i;
  }
  return -1;
}

function additem(thai, romanization, english, notes, type, roots, combos) {
  ensureitemsarray();

  var existingindex = finditemindex(thai, romanization, english);
  if (existingindex !== -1) {
    var existing = itemsdata[existingindex];
    mergetags(existing, roots, combos);
    return existing;
  }

  var item = {
    id: 'it' + (itemsidcounter++),
    thai: (thai || '').trim(),
    romanization: (romanization || '').trim(),
    english: (english || '').trim(),
    notes: (notes || '').trim(),
    type: (type || '').trim().toLowerCase(),
    roots: normalisetags(roots),
    combos: normalisetags(combos)
  };

  itemsdata.push(item);
  return item;
}

function mergetags(item, roots, combos) {
  if (!item) return;

  var newroots = normalisetags(roots);
  var newcombos = normalisetags(combos);

  if (!Array.isArray(item.roots)) item.roots = [];
  if (!Array.isArray(item.combos)) item.combos = [];

  newroots.forEach(function(r) {
    if (item.roots.indexOf(r) === -1) {
      item.roots.push(r);
    }
  });

  newcombos.forEach(function(c) {
    if (item.combos.indexOf(c) === -1) {
      item.combos.push(c);
    }
  });
}

function getitemsforroot(rootthai, type) {
  ensureitemsarray();
  var root = (rootthai || '').trim();
  var kind = type ? type.trim().toLowerCase() : '';
  if (!root) return [];

  return itemsdata.filter(function(item) {
    if (!item || !Array.isArray(item.roots)) return false;
    if (kind && typeof item.type === 'string') {
      if (item.type.trim().toLowerCase() !== kind) return false;
    }
    return item.roots.indexOf(root) !== -1;
  });
}

function getitemsforcombo(combothai, type) {
  ensureitemsarray();
  var combo = (combothai || '').trim();
  var kind = type ? type.trim().toLowerCase() : '';
  if (!combo) return [];

  return itemsdata.filter(function(item) {
    if (!item || !Array.isArray(item.combos)) return false;
    if (kind && typeof item.type === 'string') {
      if (item.type.trim().toLowerCase() !== kind) return false;
    }
    return item.combos.indexOf(combo) !== -1;
  });
}

// convenience for UI later: bundle by kind for one word
function getphrasesforword(wordthai) {
  return {
    shortphrases: getitemsforroot(wordthai, 'shortphrase'),
    longphrases: getitemsforroot(wordthai, 'longphrase'),
    sentences: getitemsforroot(wordthai, 'sentence')
  };
}


//---------
//HELPER FUNCTIONS
//---------

function getrootsstring(item) {
  if (!item || !Array.isArray(item.roots)) return '';
  return item.roots.join(', ');
}

function getcombosstring(item) {
  if (!item || !Array.isArray(item.combos)) return '';
  return item.combos.join(', ');
}
