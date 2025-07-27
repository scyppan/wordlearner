// search.js
//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none

//---------
//ENTRY FUNCTION
//---------

function searchbar(list) {
  var input = document.getElementById('word-search');
  if (!input) {
    input = document.createElement('input')
    input.id = 'word-search'
    input.placeholder = 'Search…'
    attachsearchlistener(input)
  }

  createautocomplete(input, list)
  wireselectallonfocus(input)
  wirealtsfocus()
  return input
}

//---------
//MAJOR FUNCTIONS
//---------

function createautocomplete(input, list) {
  var selectedindex = -1

  renderlist(wordsdata)
  

  input.addEventListener('input', oninput)
  input.addEventListener('keydown', handlekey)
  input.addEventListener('blur', function () {
    setTimeout(function () { renderlist(wordsdata) }, 100)
  })

  function oninput() {
    var term = normalize(input.value.trim()) 
    console.log(term);
    var matches = term === ''
      ? wordsdata
      : wordsdata.filter(function (item) {
        var thai = (item.word || '').toLowerCase()
        var roman = normalize(item.romanization || '')
        var def = (item.definition || '').toLowerCase()
        var notes = (item.notes || '').toLowerCase()
        return thai.includes(term)
          || roman.includes(term)
          || def.includes(term)
          || notes.includes(term)
      })
    renderlist(matches)
  }

  function renderlist(items) {
    list.innerHTML = ''
    items.forEach(function (item, idx) {
      list.append(buildli(item, input, function () {
        selectedindex = -1
      }))
    })
    selectedindex = -1
  }

  function handlekey(e) {
    var items = list.querySelectorAll('li')
    if (!items.length) return

    if (e.key === 'ArrowDown') {
      selectedindex = Math.min(selectedindex + 1, items.length - 1)
      updatehighlight(items)
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      selectedindex = Math.max(selectedindex - 1, 0)
      updatehighlight(items)
      e.preventDefault()
    } else if (e.key === 'Enter' && selectedindex >= 0) {
      items[selectedindex].dispatchEvent(new MouseEvent('mousedown'))
      e.preventDefault()
    }
  }

  function updatehighlight(items) {
    items.forEach(function (li, idx) {
      if (idx === selectedindex) {
        li.classList.add('selected')
        li.scrollIntoView({ block: 'nearest' })
      } else {
        li.classList.remove('selected')
      }
    })
  }
}

//---------
//HELPER FUNCTIONS
//---------

function wireselectallonfocus(input) {
  input.addEventListener('focus', function () { input.select() })
  input.addEventListener('click', function () { input.select() })
}

function wirealtsfocus() {
  document.addEventListener('keydown', function (e) {
    if (!e.altKey || e.key.toLowerCase() !== 's') return
    var input = document.getElementById('word-search')
    if (!input) return
    input.focus()
    e.preventDefault()
  })
}

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function attachsearchlistener(input) {
  input.addEventListener('input', function () {
    var list = document.getElementById('word-list')
    if (!list) return
    var term = normalize(input.value.trim())
    var matches = term === ''
      ? wordsdata
      : wordsdata.filter(function (item) {
          var thai = (item.word || '').toLowerCase()
          var roman = normalize(item.romanization || '')
          var def = (item.definition || '').toLowerCase()
          var notes = (item.notes || '').toLowerCase()
          return thai.includes(term)
            || roman.includes(term)
            || def.includes(term)
            || notes.includes(term)
      })
    list.innerHTML = ''
    matches.forEach(function (item) {
      // Use buildli from your helpers; clearselect can be a no-op if not used
      list.appendChild(buildli(item, input, function () {}))
    })
  })
}


//---------
//IMMEDIATE FUNCTIONS
//---------

// none — call searchbar() after your sidebar is in place
