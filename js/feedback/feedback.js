function renderfeedback() {
    const main = document.querySelector('.maincontent');
    main.innerHTML = '';

    // ---- 3-column container ----
    const container = document.createElement('div');
    container.className = 'feedback-container';

    // --- Left: Quiz List ---
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
                renderFeedbackQuizTable(i);
            });
            quizList.appendChild(li);
        });
    }
    quizListPanel.appendChild(quizList);

    // --- Middle: Quiz Table ---
    const quizTablePanel = document.createElement('section');
    quizTablePanel.className = 'feedback-table-panel';
    // Placeholder or first quiz if exists
    if (quizzes.length > 0) renderFeedbackQuizTable(0);
    else quizTablePanel.textContent = 'Select a quiz to review.';

    // --- Right: Word Details ---
    const wordDetailsPanel = document.createElement('aside');
    wordDetailsPanel.className = 'feedback-word-panel';
    wordDetailsPanel.textContent = 'Click an item to see details.';

    // --- Compose all ---
    container.appendChild(quizListPanel);
    container.appendChild(quizTablePanel);
    container.appendChild(wordDetailsPanel);
    main.appendChild(container);

    // --- Store for access by table renderer ---
    renderfeedback.wordDetailsPanel = wordDetailsPanel;

    // --- Quiz Table Renderer ---
    function renderFeedbackQuizTable(quizIndex) {
        quizTablePanel.innerHTML = '';
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
            // Click for details
            tr.addEventListener('click', function () {
                renderFeedbackWordDetails(item);
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

    // --- Word Details Renderer (placeholder) ---
    function renderFeedbackWordDetails(item) {
        const panel = renderfeedback.wordDetailsPanel;
        panel.innerHTML = '';
        const h3 = document.createElement('h3');
        h3.textContent = 'Word Details';
        panel.appendChild(h3);

        // For now, just display base word and prompt
        const wordInfo = document.createElement('div');
        wordInfo.innerHTML =
            `<b>Base Word:</b> ${item.thai}<br>
             <b>Prompt:</b> ${item.item}<br>
             <b>Status:</b> ${item.state}`;
        panel.appendChild(wordInfo);

        // You can expand this with real details later.
    }
}
