function createWordDetailsPanel() {
  var detail = document.createElement('div');
  detail.className = 'word-details hidden';  // hidden until a word is picked

  // header / meta / def / notes
  detail.appendChild(createHeaderSection());
  detail.appendChild(createMetaSection());
  detail.appendChild(createDefinitionSection());
  detail.appendChild(createNotesSection());

  // repeatable sections
  var shortSec = createRepeatableSection('shortphrases', 'Short Phrases');
  var longSec = createRepeatableSection('longphrases', 'Long Phrases');
  var sentSec = createRepeatableSection('sentences', 'Sentences');

  detail.appendChild(shortSec.container);
  detail.appendChild(longSec.container);
  detail.appendChild(sentSec.container);

  // expose these for showworddetails to wire up
  detail._shortSec = shortSec;
  detail._longSec = longSec;
  detail._sentSec = sentSec;

  var delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'word-delete-btn';
  delBtn.textContent = 'Delete Word';
  delBtn.style.margin = '1em 0 0 auto';
  detail.appendChild(delBtn);

  return detail;
}

function createInlineEditableSpan(className) {
  var span = document.createElement('span');
  span.className = className + ' inline-label';
  span.contentEditable = true;
  span.setAttribute('tabindex', 0);
  span.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      span.blur();
    }
  });
  return span;
}

function clearWordDetails() {
  var panel = document.querySelector('.word-details');
  if (!panel) return;
  panel.querySelector('.word-script').textContent = '';
  panel.querySelector('.word-romanization').textContent = '';
  panel.querySelector('.confidence-rating').reset();
  panel.querySelector('.word-type-select').value = '';
  panel.querySelector('.word-pos-input').value = '';
  panel.querySelector('.word-definition-input').value = '';
  panel.querySelector('.word-notes-input').value = '';
}

function showworddetails(w) {
  var panel = document.querySelector('.word-details');

  panel.classList.remove('hidden');

  var delBtn = panel.querySelector('.word-delete-btn');
  if (delBtn) {
    delBtn.onclick = function () {
      var idx = wordsData.indexOf(w);
      if (idx !== -1) {
        wordsData.splice(idx, 1);
      }
      panel.classList.add('hidden');
      // Optionally: refresh the word list/table here
    };
  }

  // inline‐editable
  panel.querySelector('.word-script').textContent = w.word || '';
  panel.querySelector('.word-romanization').textContent = w.romanization || '';
  panel.querySelector('.word-script').onblur = function () {
    var newWord = this.textContent.trim();

    if (!newWord) {
      // Prevent blank entries
      this.textContent = w.word || '';
      return;
    }

    // Allow "ตัวยึดตำแหน่ง" repeats, but number them; for all others, number if needed
    var isPlaceholder = newWord.startsWith('ตัวยึดตำแหน่ง');
    var base = isPlaceholder ? 'ตัวยึดตำแหน่ง' : newWord;
    var count = 1;
    // Ignore self when checking for existing words
    wordsData.forEach(function (entry) {
      if (entry !== w && (entry.word || '').split(/[0-9]+$/)[0] === base) count++;
    });

    if (count > 1) {
      newWord = base + count;
      this.textContent = newWord;
    }

    w.word = newWord;
    refreshWordList();
  };

  panel.querySelector('.word-romanization').onblur = function () {
    w.romanization = this.textContent.trim();
    refreshWordList();
  };

  // confidence
  var rating = panel.querySelector('.confidence-rating');
  rating.reset();
  rating.setRating(w.confidence);

  // type & pos
  panel.querySelector('.word-type-select').value = w.type || '';
  panel.querySelector('.word-type-select').onchange = function () {
    w.type = this.value;
  };
  panel.querySelector('.word-pos-input').value = w.pos || '';
  panel.querySelector('.word-pos-input').onchange = function () {
    w.pos = this.value;
  };

  // definition & notes
  panel.querySelector('.word-definition-input').value = w.definition || '';
  panel.querySelector('.word-definition-input').onchange = function () {
    w.definition = this.value;
    refreshWordList();
  };
  panel.querySelector('.word-notes-input').value = w.notes || '';
  panel.querySelector('.word-notes-input').onchange = function () {
    w.notes = this.value;
  };

  // wire repeatable sections
  panel._shortSec.setValue(w.shortphrases);
  panel._shortSec.onChange(vals => { w.shortphrases = vals; });

  panel._longSec.setValue(w.longphrases);
  panel._longSec.onChange(vals => { w.longphrases = vals; });

  panel._sentSec.setValue(w.sentences);
  panel._sentSec.onChange(vals => { w.sentences = vals; });

  // wire up delete button
  var delBtn = panel.querySelector('.word-delete-btn');
  if (delBtn) {
    delBtn.onclick = function () {
      deleteword(w);
    };
  }
}

function deleteword(w) {
  var idx = wordsData.indexOf(w);
  if (idx !== -1) {
    wordsData.splice(idx, 1);
  }
  var panel = document.querySelector('.word-details');
  if (panel) {
    panel.classList.add('hidden');
  }
  
  refreshWordList();
}