function renderwords() {
  const main = document.querySelector('.maincontent');
  main.innerHTML = '';

  main.append(
    createWordsContainer(),
    createWordDetailsPanel()
  );

  // immediately hide it
  document.querySelector('.word-details').classList.add('hidden');

  createAutocomplete(
    '.word-search',
    wordsData,
    { onSelect: showworddetails, maxItems: 10 }
  );
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
  const sidebar = document.createElement('div');
  sidebar.className = 'words-sidebar';

  // Create a wrapper for search + button
  const searchRow = document.createElement('div');
  searchRow.style.display = 'flex';
  searchRow.style.alignItems = 'center';

  const search = document.createElement('input');
  search.className = 'word-search';
  search.placeholder = 'Search…';
  searchRow.append(search);

  // Add the "+" button
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'add-word-btn';
  addBtn.textContent = '+';
  addBtn.title = 'Add new word';
  addBtn.style.marginLeft = '0.5em';
  addBtn.onclick = addWord;

  // You can wire this up later: addBtn.onclick = addNewWord;
  searchRow.append(addBtn);

  sidebar.append(searchRow);

  const ul = document.createElement('ul');
  ul.className = 'word-list';
  sidebar.append(ul);

  return sidebar;
}

function addWord() {
  // Count how many placeholders already exist
  var placeholderBase = 'ตัวยึดตำแหน่ง';
  var romanBase = 'placeholder';
  var count = 1 + wordsData.filter(w => (w.word || '').startsWith(placeholderBase)).length;

  var newWord = {
    word: placeholderBase + (count > 1 ? count : ''),
    confidence: 1,
    romanization: romanBase + (count > 1 ? count : ''),
    type: 'content',
    pos: '',
    definition: '',
    notes: '',
    shortphrases: [],
    longphrases: [],
    sentences: []
  };

  wordsData.push(newWord);
  showworddetails(newWord);

  refreshWordList();
}

function refreshWordList() {
  var searchInput = document.querySelector('.word-search');
  if (searchInput) {
    var event = new Event('input', { bubbles: true });
    searchInput.dispatchEvent(event);
  }
}
