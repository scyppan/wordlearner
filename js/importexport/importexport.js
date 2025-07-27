function renderdata() {
    clearmaincontent();
    var main = document.querySelector('#maincontent');

    main.innerHTML = '';

    var container = document.createElement('div');
    container.className = 'data-actions-container';

    var group1 = document.createElement('div');
    group1.className = 'data-actions-group';

    var importBtn = document.createElement('button');
    importBtn.id = 'importDataBtn';
    importBtn.textContent = 'Import Words from JSON';
    importBtn.onclick = importfromjson;

    var exportBtn = document.createElement('button');
    exportBtn.id = 'exportDataBtn';
    exportBtn.textContent = 'Export Words to JSON';
    exportBtn.onclick = exporttojson;

    group1.appendChild(importBtn);
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
