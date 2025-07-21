let quizBuilderTitle = '';
let quizBuilderInputs = {};

function renderquizbuilder() {
    const main = document.querySelector('.maincontent');
    main.innerHTML = '';

    // ---- TITLE SECTION ----
    const titleDiv = document.createElement('div');
    titleDiv.className = 'quizbuilder-title-block';

    const label = document.createElement('label');
    label.textContent = 'Quiz Title: ';
    label.setAttribute('for', 'quizbuilder-title');
    label.style.fontWeight = 'bold';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'quizbuilder-title';
    input.className = 'quizbuilder-title-input';
    input.value = quizBuilderTitle || getDefaultQuizTitle();
    input.autocomplete = 'off';

    input.addEventListener('input', function () {
        quizBuilderTitle = input.value;
    });

    input.addEventListener('focus', function () {
        input.select();
    });

    label.appendChild(input);
    titleDiv.appendChild(label);
    main.appendChild(titleDiv);

    // ---- TABLE SECTION ----
    const table = document.createElement('table');
    table.className = 'quizbuilder-table';

    // Header row
    const headerRow = document.createElement('tr');
    const firstHeader = document.createElement('th');
    firstHeader.textContent = 'Confidence';
    headerRow.appendChild(firstHeader);

    const colNames = ['Word', 'Short Phrase', 'Long Phrase', 'Sentence'];
    colNames.forEach(name => {
        const th = document.createElement('th');
        th.textContent = name;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Rows: 0-10
    for (let conf = 0; conf <= 10; conf++) {
        const tr = document.createElement('tr');
        const confCell = document.createElement('td');
        confCell.textContent = conf === 0 ? 'None/0' : conf;
        if (conf === 0) confCell.className = 'confidence-zero';
        tr.appendChild(confCell);

        for (let col = 0; col < colNames.length; col++) {
            const td = document.createElement('td');
            const inputBox = document.createElement('input');
            inputBox.type = 'number';
            inputBox.min = 0;
            inputBox.max = 99;
            inputBox.className = 'quiz-num-input';
            inputBox.dataset.confidence = conf;
            inputBox.dataset.type = colNames[col].replace(' ', '').toLowerCase();

            // Restore value if present
            const key = conf + '-' + inputBox.dataset.type;
            inputBox.value = quizBuilderInputs[key] !== undefined ? quizBuilderInputs[key] : 0;

            td.appendChild(inputBox);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    main.appendChild(table);

    // ---- TOTALS SECTION ----
    const totalsLabel = document.createElement('div');
    totalsLabel.className = 'quizbuilder-totals';
    main.appendChild(totalsLabel);

    // ---- BUILD BUTTON SECTION ----
    const btn = document.createElement('button');
    btn.className = 'quizbuilder-build-btn';
    btn.textContent = 'Build Quiz';
    btn.onclick = function () {
        let quizTitle = input.value.trim();
        if (!quizTitle) {
            alert('Quiz title required');
            input.focus();
            return;
        }
        let quiz = buildQuiz(quizTitle, quizBuilderInputs, wordsData);
        quizzes.push(quiz);
        alert("Quiz built and stored! (" + quiz.items.length + " items)");

        // First, try to match "Quiz YY.MM.DD.###" and increment
        let re = /^Quiz \d{2}\.\d{2}\.\d{2}\.(\d{3})$/;
        let match = quizTitle.match(re);
        if (match) {
            let n = parseInt(match[1], 10) + 1;
            let prefix = quizTitle.slice(0, quizTitle.lastIndexOf('.') + 1);
            input.value = prefix + String(n).padStart(3, '0');
            quizBuilderTitle = input.value; // keep global in sync
            return;
        }

        // Otherwise, increment any integer at the end of the string (with optional whitespace)
        re = /(.*?)(\d+)\s*$/;
        match = quizTitle.match(re);
        if (match) {
            let base = match[1];
            let n = parseInt(match[2], 10) + 1;
            input.value = base + n;
            quizBuilderTitle = input.value; // keep global in sync
        }
    };

    main.appendChild(btn);

    // ---- AVAILABILITY/DISABLING ----
    const avail = getQuizItemAvailability(wordsData);
    applyQuizInputLimits(main, avail);

    // ---- TOTALS/STATE RESTORE ----
    function updateTotalsAndStore() {
        let shortTotal = 0, longTotal = 0, sentTotal = 0, wordTotal = 0;
        main.querySelectorAll('input[type="number"]').forEach(inp => {
            const type = inp.dataset.type;
            const conf = inp.dataset.confidence;
            const key = conf + '-' + type;
            const val = parseInt(inp.value, 10) || 0;
            quizBuilderInputs[key] = val;
            if (type === 'shortphrase') shortTotal += val;
            if (type === 'longphrase') longTotal += val;
            if (type === 'sentence') sentTotal += val;
            if (type === 'word') wordTotal += val;
        });
        const total = shortTotal + longTotal + sentTotal + wordTotal;
        totalsLabel.textContent =
            `Total Words: ${wordTotal}   |   Short Phrases: ${shortTotal}   |   Long Phrases: ${longTotal}   |   Sentences: ${sentTotal}   |   All Items: ${total}`;
    }

    main.querySelectorAll('input[type="number"]').forEach(inp => {
        inp.addEventListener('input', updateTotalsAndStore);
    });

    updateTotalsAndStore(); // Initial display & storage
}

// 1. Helper: normalize column/type names
function normalizeType(str) {
    str = str.replace(/\s+/g, '').toLowerCase();
    if (str === 'shortphrases') return 'shortphrase';
    if (str === 'longphrases') return 'longphrase';
    if (str === 'sentences') return 'sentence';
    return str;
}

// 2. Returns availability map by type and confidence
function getQuizItemAvailability(wordsData) {
    // Types to count
    const types = ['word', 'shortphrase', 'longphrase', 'sentence'];
    // Map: { type: {confidence: count, ...}, ... }
    const availability = {};
    types.forEach(type => availability[type] = {});

    wordsData.forEach(wordObj => {
        const conf = Number(wordObj.confidence) || 0;

        // Word itself (only count if non-empty)
        if (wordObj.word && String(wordObj.word).trim() !== '') {
            availability.word[conf] = (availability.word[conf] || 0) + 1;
        }

        // Short phrases (only count non-empty)
        if (Array.isArray(wordObj.shortphrases)) {
            const count = wordObj.shortphrases.filter(p => p && String(p).trim() !== '').length;
            availability.shortphrase[conf] = (availability.shortphrase[conf] || 0) + count;
        }

        // Long phrases (only count non-empty)
        if (Array.isArray(wordObj.longphrases)) {
            const count = wordObj.longphrases.filter(p => p && String(p).trim() !== '').length;
            availability.longphrase[conf] = (availability.longphrase[conf] || 0) + count;
        }

        // Sentences (only count non-empty)
        if (Array.isArray(wordObj.sentences)) {
            const count = wordObj.sentences.filter(s => s && String(s).trim() !== '').length;
            availability.sentence[conf] = (availability.sentence[conf] || 0) + count;
        }
    });

    // Fill gaps with zeros (conf 0-10)
    for (let conf = 0; conf <= 10; conf++) {
        types.forEach(type => {
            if (!(conf in availability[type])) availability[type][conf] = 0;
        });
    }

    return availability;
}

// 3. Applies max/disabled/greyed logic to all table inputs
function applyQuizInputLimits(mainElem, availability) {
    // mainElem: container holding the inputs (e.g. document.querySelector('.maincontent'))

    mainElem.querySelectorAll('input[type="number"]').forEach(inp => {
        const conf = Number(inp.dataset.confidence);
        const type = normalizeType(inp.dataset.type);
        const avail = availability[type]?.[conf] ?? 0;

        inp.max = avail;

        if (avail === 0) {
            inp.value = 0;
            inp.disabled = true;
            inp.classList.add('quizbuilder-disabled');
        } else {
            inp.disabled = false;
            inp.classList.remove('quizbuilder-disabled');
        }
    });
}

function getDefaultQuizTitle() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    let seq = 1;
    // Check existing quizzes for today’s sequence
    const prefix = `Quiz ${yy}.${mm}.${dd}.`;
    quizzes.forEach(q => {
        if (q.title && q.title.startsWith(prefix)) {
            const n = Number(q.title.slice(prefix.length));
            if (!isNaN(n) && n >= seq) seq = n + 1;
        }
    });
    return `${prefix}${String(seq).padStart(3, '0')}`;
}
