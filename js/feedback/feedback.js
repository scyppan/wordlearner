// feedback.js

function renderfeedback() {
    const main = document.querySelector('.maincontent');
    main.innerHTML = '';

    // Layout container
    const container = document.createElement('div');
    container.className = 'feedback-container';

    // Panels
    const quizListPanel = createFeedbackQuizListPanel();
    const quizTablePanel = createFeedbackTablePanel();
    const wordDetailsPanel = createFeedbackWordPanel();

    // Compose and mount
    container.appendChild(quizListPanel);
    container.appendChild(quizTablePanel);
    container.appendChild(wordDetailsPanel);
    main.appendChild(container);

    // Render first quiz table (if exists)
    if (quizzes.length > 0) renderFeedbackQuizTable(0, quizTablePanel, wordDetailsPanel);
}

// Left panel: Quiz List
function createFeedbackQuizListPanel() {
    const quizListPanel = document.createElement('aside');
    quizListPanel.className = 'feedback-quizlist-panel';

    const quizList = document.createElement('ul');
    quizList.className = 'feedback-quiz-list';

    if (quizzes.length === 0) {
        const empty = document.createElement('li');
        empty.textContent = 'No quizzes yet';
        empty.className = 'feedback-empty';
        quizList.appendChild(empty);
    } else {
        quizzes.forEach((quiz, i) => {
            const li = document.createElement('li');
            li.textContent = quiz.title || `Quiz ${i + 1}`;
            li.className = 'feedback-quiz-listitem';
            li.tabIndex = 0;
            li.addEventListener('click', function () {
                const quizTablePanel = document.querySelector('.feedback-table-panel');
                const wordDetailsPanel = document.querySelector('.feedback-word-panel');
                renderFeedbackQuizTable(i, quizTablePanel, wordDetailsPanel);
            });
            quizList.appendChild(li);
        });
    }
    quizListPanel.appendChild(quizList);
    return quizListPanel;
}

// Middle panel: Quiz Table
function createFeedbackTablePanel() {
    const quizTablePanel = document.createElement('section');
    quizTablePanel.className = 'feedback-table-panel';
    if (quizzes.length === 0) {
        quizTablePanel.textContent = 'Select a quiz to review.';
    }
    return quizTablePanel;
}

// Right panel: Word Details (using existing modular panel)
function createFeedbackWordPanel() {
    const wordDetailsPanel = document.createElement('aside');
    wordDetailsPanel.className = 'feedback-word-panel';

    // Placeholder message (visible by default)
    const placeholder = document.createElement('div');
    placeholder.className = 'word-details-placeholder';
    placeholder.textContent = '← Click a quiz item to view details here.';
    wordDetailsPanel.appendChild(placeholder);

    // Real details panel, hidden by default
    const detailsPanel = createWordDetailsPanel();
    detailsPanel.classList.add('hidden');
    wordDetailsPanel.appendChild(detailsPanel);

    // Expose for internal use
    wordDetailsPanel._detailsPanel = detailsPanel;
    wordDetailsPanel._placeholder = placeholder;
    return wordDetailsPanel;
}

// Render quiz items table for quizIndex in quizTablePanel, connect to wordDetailsPanel
function renderFeedbackQuizTable(quizIndex, quizTablePanel, wordDetailsPanel) {
    quizTablePanel.innerHTML = '';
    if (wordDetailsPanel && wordDetailsPanel._detailsPanel) {
        wordDetailsPanel._detailsPanel.classList.add('hidden');
    }

    const quiz = quizzes[quizIndex];
    if (!quiz) {
        quizTablePanel.textContent = 'Quiz not found.';
        return;
    }

    // Table
    const table = document.createElement('table');
    table.className = 'feedback-table';
    const header = document.createElement('tr');
    ['#', 'Base Word', 'Prompt', 'Correct?'].forEach(txt => {
        const th = document.createElement('th');
        th.textContent = txt;
        header.appendChild(th);
    });
    table.appendChild(header);

    quiz.items.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'feedback-row';
        tr.tabIndex = 0;
        tr.addEventListener('click', function () {
            renderFeedbackWordDetails(item, wordDetailsPanel);
        });

        // Number
        const tdNum = document.createElement('td');
        tdNum.textContent = item.itemNumber;
        tr.appendChild(tdNum);

        // Thai base word
        const tdThai = document.createElement('td');
        tdThai.textContent = item.thai;
        tr.appendChild(tdThai);

        // Quiz prompt
        const tdItem = document.createElement('td');
        tdItem.textContent = item.item;
        tr.appendChild(tdItem);

        // Correct?
        const tdCorrect = document.createElement('td');
        tdCorrect.className = 'feedback-status';
        let iconHtml = '';
        if (item.state === 'succeeded') {
            iconHtml = '<span class="feedback-correct">&#10003;</span>'; // ✔
        } else if (item.state === 'failed') {
            iconHtml = '<span class="feedback-incorrect">&#10007;</span>'; // ✖
        } else if (item.state === 'partial') {
            iconHtml = '<span class="feedback-partial">&#9677;</span>'; // ◍
        } else {
            iconHtml = '<span class="feedback-untested">&#9679;</span>'; // ●
        }
        tdCorrect.innerHTML = iconHtml;
        tr.appendChild(tdCorrect);

        table.appendChild(tr);
    });

    quizTablePanel.appendChild(table);
}

// Show the word details panel for the selected quiz item (using modular panel)
function renderFeedbackWordDetails(item, wordDetailsPanel) {
    const detailsPanel = wordDetailsPanel._detailsPanel;
    const placeholder = wordDetailsPanel._placeholder;
    // Try to find the word in your main wordsData array
    let w = wordsData.find(e => e.word === item.thai);
    if (w) {
        showworddetails(w);
        detailsPanel.classList.remove('hidden');
        if (placeholder) placeholder.style.display = 'none';
    } else {
        detailsPanel.classList.add('hidden');
        if (placeholder) placeholder.style.display = '';
    }
}

