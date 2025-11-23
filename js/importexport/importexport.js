function renderdata() {
    clearmaincontent();
    var main = document.querySelector('#maincontent');

    main.innerHTML = '';

    var container = document.createElement('div');
    container.className = 'data-actions-container';

    var group1 = document.createElement('div');
    group1.className = 'data-actions-group';

    // Import complete word set (will remove all existing words)
    var importBtn = document.createElement('button');
    importBtn.id = 'importDataBtn';
    importBtn.textContent = 'Import complete word set';
    importBtn.title = 'This will remove all existing words and replace them with the imported set.';
    importBtn.onclick = importfromjson;

    // Import additional words (will add to existing words)
    var importAdditionalBtn = document.createElement('button');
    importAdditionalBtn.id = 'importAdditionalDataBtn';
    importAdditionalBtn.textContent = 'Import additional words into this set';
    importAdditionalBtn.title = 'This will add new words to the existing word list (duplicates will be skipped).';
    importAdditionalBtn.onclick = importadditionalwords;

    // Import words from TSV
    var importTsvWordsBtn = document.createElement('button');
    importTsvWordsBtn.id = 'importTsvWordsBtn';
    importTsvWordsBtn.textContent = 'Import words from TSV';
    importTsvWordsBtn.title = 'Add/update words from a TSV file with THAI / ROMANIZATION / DEFINITION / NOTES.';
    importTsvWordsBtn.onclick = importtsvwords;

    // Import phrases from TSV
    var importTsvPhrasesBtn = document.createElement('button');
    importTsvPhrasesBtn.id = 'importTsvPhrasesBtn';
    importTsvPhrasesBtn.textContent = 'Import phrases from TSV';
    importTsvPhrasesBtn.title = 'Add phrases/sentences from a TSV file with Thai Script Word / Type / Romanization / Definition / Notes.';
    importTsvPhrasesBtn.onclick = importtsvphrases;

    // Export words
    var exportBtn = document.createElement('button');
    exportBtn.id = 'exportDataBtn';
    exportBtn.textContent = 'Export Words to JSON';
    exportBtn.onclick = exporttojson;

    group1.appendChild(importBtn);
    group1.appendChild(importAdditionalBtn);
    group1.appendChild(importTsvWordsBtn);
    group1.appendChild(importTsvPhrasesBtn);
    group1.appendChild(exportBtn);

    var group2 = document.createElement('div');
    group2.className = 'data-actions-group';

    var importQuizzesBtn = document.createElement('button');
    importQuizzesBtn.id = 'importQuizzesBtn';
    importQuizzesBtn.textContent = 'Import Quizzes from JSON';
    importQuizzesBtn.onclick = importquizzes;

    var exportQuizzesBtn = document.createElement('button');
    exportQuizzesBtn.id = 'exportQuizzesBtn';
    exportQuizzesBtn.textContent = 'Export Quizzes to JSON';
    exportQuizzesBtn.onclick = exportquizzes;

    group2.appendChild(importQuizzesBtn);
    group2.appendChild(exportQuizzesBtn);

    container.appendChild(group1);
    container.appendChild(group2);

    main.appendChild(container);
}