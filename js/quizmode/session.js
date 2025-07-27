function renderquizsession(quizIndex, targetElem) {
    const target = targetElem || document.querySelector('.maincontent');
    target.innerHTML = '';

    const quiz = quizzes[quizIndex];
    if (!quiz) {
        target.textContent = 'Quiz not found.';
        return;
    }

    // Title
    const h2 = document.createElement('h2');
    h2.className = 'quizsession-title';
    h2.textContent = quiz.title || `Quiz ${quizIndex + 1}`;
    target.appendChild(h2);

    // Table
    const table = document.createElement('table');
    table.className = 'quizsession-table';

    // Header
    const header = document.createElement('tr');
    ['#', 'Item', 'Status'].forEach(txt => {
        const th = document.createElement('th');
        th.textContent = txt;
        header.appendChild(th);
    });
    table.appendChild(header);

    // Rows
    quiz.items.forEach((item, idx) => {
        const tr = document.createElement('tr');

        // Number
        const tdNum = document.createElement('td');
        tdNum.textContent = item.itemnumber;
        tr.appendChild(tdNum);

        // Item
        const tdItem = document.createElement('td');
        tdItem.className = 'quizsession-itemcell';

        const spanText = document.createElement('span');
        spanText.textContent = item.item;
        tdItem.appendChild(spanText);

        // Paper icon button
        const infoBtn = document.createElement('button');
        infoBtn.type = 'button';
        infoBtn.className = 'quiz-info-btn';
        infoBtn.title = 'Show details';
        infoBtn.setAttribute('aria-label', 'Show details for this item');

        // ← only these two lines are new:
        infoBtn.dataset.itemIndex = idx;
        infoBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            showitemprompt(e);
        });

        tdItem.appendChild(infoBtn);
        tr.appendChild(tdItem);

        // Status bubbles
        const tdStatus = document.createElement('td');
        tdStatus.className = 'quizsession-statuscell';

        const states = [
            { state: 'not tested', label: 'Not tested', class: 'bubble-not-tested' },
            { state: 'failed', label: 'Failed', class: 'bubble-failed' },
            { state: 'partial', label: 'Partial', class: 'bubble-partial' },
            { state: 'succeeded', label: 'Correct', class: 'bubble-succeeded' }
        ];

        states.forEach(s => {
            const bubble = document.createElement('span');
            bubble.className = 'quizsession-bubble ' + s.class;
            if (item.state === s.state) bubble.classList.add('selected');
            bubble.title = s.label;
            bubble.tabIndex = 0; // focusable
            bubble.setAttribute('aria-label', s.label);

            bubble.addEventListener('click', function () {
                item.state = s.state;
                // Update all bubbles in this cell
                tdStatus.querySelectorAll('.quizsession-bubble').forEach(b => b.classList.remove('selected'));
                bubble.classList.add('selected');
            });

            tdStatus.appendChild(bubble);
        });

        tr.appendChild(tdStatus);
        table.appendChild(tr);
    });

    target.appendChild(table);
}
