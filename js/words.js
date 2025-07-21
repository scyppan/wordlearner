// words.js
function renderwords() {
  const main = document.querySelector('.maincontent');
  main.innerHTML = '';
  main.append(createWordsContainer());

  // wire up autocomplete
  createAutocomplete(
    '.word-search',
    wordsData,
    { onSelect: showworddetails, maxItems: 10 }
  );

  // now wire UX helpers
  wireSelectAllOnFocus('.word-search');
  wireAltSFocus('.word-search');
}

function createWordsContainer() {
  const container = document.createElement('div')
  container.className = 'words-container'
  container.append(createWordsSidebar(), createWordDetailsPanel())
  return container
}

function createWordsSidebar() {
  const sidebar = document.createElement('div')
  sidebar.className = 'words-sidebar'
  const search = document.createElement('input')
  search.className = 'word-search'
  search.placeholder = 'Search…'
  sidebar.append(search)
  const ul = document.createElement('ul')
  ul.className = 'word-list'
  sidebar.append(ul)
  return sidebar
}

function populateWordList(data) {
  const list = document.querySelector('.word-list')
  list.innerHTML = ''
  data.forEach(w => {
    const li = document.createElement('li')
    li.textContent = w.word
    li.addEventListener('click', () => showworddetails(w))
    list.appendChild(li)
  })
}
