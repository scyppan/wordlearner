// search.js

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function createAutocomplete(inputSelector, dataArray, options) {
  var input = document.querySelector(inputSelector);
  var list  = document.querySelector(options.suggestionsContainer || '.word-list');
  var selectedIndex = -1;
  var maxItems      = options.maxItems || 10;

  // Initial render: show all entries
  renderList(dataArray.slice(0, maxItems));

  // Bind events
  input.addEventListener('input', onInput);
  input.addEventListener('keydown', handleKey);
  input.addEventListener('blur', function() {
    // on blur, restore full list
    setTimeout(function() {
      renderList(dataArray.slice(0, maxItems));
    }, 100);
  });

  function onInput() {
    var term = normalize(input.value.trim());
    var matches = !term
      ? dataArray
      : dataArray.filter(function(item) {
          var thai  = (item.word || '').toLowerCase();
          var roman = normalize(item.romanization || '');
          var def   = (item.definition  || '').toLowerCase();
          return thai.indexOf(term)  !== -1
              || roman.indexOf(term) !== -1
              || def.indexOf(term)   !== -1;
        });

    renderList(matches.slice(0, maxItems));
  }

  function renderList(items) {
    list.innerHTML = '';
    items.forEach(function(item, i) {
      var li = document.createElement('li');
      li.textContent = item.word
        + (item.romanization ? ' – ' + item.romanization : '');
      li.addEventListener('mousedown', function() {
        input.value = item.word;
        selectedIndex = -1;
        if (typeof options.onSelect === 'function') {
          options.onSelect(item);
        }
      });
      list.appendChild(li);
    });
    selectedIndex = -1;
  }

  function handleKey(e) {
    var items = list.querySelectorAll('li');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      updateHighlight(items);
      e.preventDefault();

    } else if (e.key === 'ArrowUp') {
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateHighlight(items);
      e.preventDefault();

    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      items[selectedIndex].dispatchEvent(new MouseEvent('mousedown'));
      e.preventDefault();
    }
  }

  function updateHighlight(items) {
    items.forEach(function(li, i) {
      li.classList.toggle('highlight', i === selectedIndex);
    });
  }
}

function createAutocomplete(inputSelector, dataArray, options) {
  const input = document.querySelector(inputSelector);
  const list  = document.querySelector(options.suggestionsContainer || '.word-list');
  const maxItems = options.maxItems || 10;

  input.addEventListener('input', onInput);
  renderList(dataArray.slice(0, maxItems));

  function onInput() {
    const term = normalize(input.value.trim());
    const matches = !term
      ? dataArray
      : dataArray.filter(item => {
          const thai  = (item.word || '').toLowerCase();
          const roman = normalize(item.romanization || '');
          const def   = (item.definition  || '').toLowerCase();
          return thai.includes(term) || roman.includes(term) || def.includes(term);
        });
    renderList(matches.slice(0, maxItems));
  }

  function renderList(items) {
    list.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');

      // header line
      const headerDiv = document.createElement('div');
      const thaiSpan = document.createElement('span');
      thaiSpan.className = 'thai';
      thaiSpan.textContent = item.word;
      headerDiv.appendChild(thaiSpan);
      if (item.romanization) {
        const romanSpan = document.createElement('span');
        romanSpan.className = 'roman';
        romanSpan.textContent = ` (${item.romanization})`;
        headerDiv.appendChild(romanSpan);
      }
      if (item.type) {
        headerDiv.appendChild(document.createTextNode(` - ${item.type}`));
      }
      li.appendChild(headerDiv);

      // definition line
      if (item.definition) {
        const defDiv = document.createElement('div');
        defDiv.className = 'definition';
        defDiv.textContent = item.definition;
        li.appendChild(defDiv);
      }

      // click populates details panel
      li.addEventListener('click', () => {
        options.onSelect(item);
      });

      list.appendChild(li);
    });
  }
}

function wireSelectAllOnFocus(inputSelector) {
  var input = document.querySelector(inputSelector);
  if (!input) return;
  input.addEventListener('focus', function() {
    input.select();
  });
  input.addEventListener('click', function() {
    input.select();
  });
}

function wireAltSFocus(inputSelector) {
  document.addEventListener('keydown', function(e) {
    if (!e.altKey || e.key.toLowerCase() !== 's') return;
    var input = document.querySelector(inputSelector);
    if (!input) return;
    input.focus();
    e.preventDefault();
  });
}
