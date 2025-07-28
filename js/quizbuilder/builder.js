//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

let quizbuildertitle = '';
let quizbuilderinputs = {};

//---------
//ENTRY FUNCTION
//---------

function renderquizbuilder() {
    clearmaincontent();
    var main = document.getElementById('maincontent');

    // ---- TITLE SECTION ----
    var titlediv = document.createElement('div');
    titlediv.className = 'quizbuilder-title-block';

    var label = document.createElement('label');
    label.textContent = 'Quiz Title: ';
    label.setAttribute('for', 'quizbuilder-title');
    label.style.fontWeight = 'bold';

    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'quizbuilder-title';
    input.className = 'quizbuilder-title-input';
    input.value = quizbuildertitle || getdefaultquiztitle();
    input.autocomplete = 'off';

    input.addEventListener('input', function () {
        quizbuildertitle = input.value;
    });

    input.addEventListener('focus', function () {
        input.select();
    });

    label.appendChild(input);
    titlediv.appendChild(label);
    main.appendChild(titlediv);

    // ---- TABLE SECTION ----
    var table = document.createElement('table');
    table.className = 'quizbuilder-table';

    var headerrow = document.createElement('tr');
    var firstheader = document.createElement('th');
    firstheader.textContent = 'Confidence';
    headerrow.appendChild(firstheader);

    var colnames = ['Word', 'Short Phrase', 'Long Phrase', 'Sentence'];
    var i;
    for (i = 0; i < colnames.length; i++) {
        var th = document.createElement('th');
        th.textContent = colnames[i];
        headerrow.appendChild(th);
    }
    table.appendChild(headerrow);

    for (var conf = 0; conf <= 10; conf++) {
        var tr = document.createElement('tr');
        var confcell = document.createElement('td');
        confcell.textContent = conf === 0 ? 'None/0' : conf;
        if (conf === 0) confcell.className = 'confidence-zero';
        tr.appendChild(confcell);

        for (var col = 0; col < colnames.length; col++) {
            var td = document.createElement('td');
            var inputbox = document.createElement('input');
            inputbox.type = 'number';
            inputbox.min = 0;
            inputbox.max = 99;
            inputbox.className = 'quiz-num-input';
            inputbox.dataset.confidence = conf;
            inputbox.dataset.type = colnames[col].replace(' ', '').toLowerCase();

            var key = conf + '-' + inputbox.dataset.type;
            inputbox.value = typeof quizbuilderinputs[key] !== 'undefined' ? quizbuilderinputs[key] : 0;

            td.appendChild(inputbox);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    main.appendChild(table);

    // ---- TOTALS SECTION ----
    var totalslabel = document.createElement('div');
    totalslabel.className = 'quizbuilder-totals';
    main.appendChild(totalslabel);

    // ---- BUILD BUTTON SECTION ----
    var btn = document.createElement('button');
    btn.className = 'quizbuilder-build-btn';
    btn.textContent = 'Build Quiz';
    btn.onclick = function () {
        var quiztitle = input.value.trim();
        if (!quiztitle) {
            alert('Quiz title required');
            input.focus();
            return;
        }
        var quiz = buildquiz(quiztitle, quizbuilderinputs, wordsdata);
        quizzes.push(quiz);
        alert('Quiz built and stored! (' + quiz.items.length + ' items)');

        var re = /^Quiz \d{2}\.\d{2}\.\d{2}\.(\d{3})$/;
        var match = quiztitle.match(re);
        if (match) {
            var n = parseint(match[1], 10) + 1;
            var prefix = quiztitle.slice(0, quiztitle.lastIndexOf('.') + 1);
            input.value = prefix + string(n).padStart(3, '0');
            quizbuildertitle = input.value;
            return;
        }

        re = /(.*?)(\d+)\s*$/;
        match = quiztitle.match(re);
        if (match) {
            var base = match[1];
            var n = parseint(match[2], 10) + 1;
            input.value = base + n;
            quizbuildertitle = input.value;
        }
    };
    main.appendChild(btn);

    // ---- AVAILABILITY/DISABLING ----
    var avail = getquizitemavailability(wordsdata);
    applyquizinputlimits(main, avail);
    trimquizbuilderinputs(main, avail);

    // ---- TOTALS/STATE RESTORE ----
    function updatetotalsandstore() {
        var shorttotal = 0, longtotal = 0, senttotal = 0, wordtotal = 0;
        var allinputs = main.querySelectorAll('input[type="number"]');
        var i;
        for (i = 0; i < allinputs.length; i++) {
            var inp = allinputs[i];
            var type = inp.dataset.type;
            var conf = inp.dataset.confidence;
            var key = conf + '-' + type;
            var val = parseint(inp.value, 10) || 0;
            quizbuilderinputs[key] = val;
            if (type === 'shortphrase') shorttotal += val;
            if (type === 'longphrase') longtotal += val;
            if (type === 'sentence') senttotal += val;
            if (type === 'word') wordtotal += val;
        }
        var total = shorttotal + longtotal + senttotal + wordtotal;
        totalslabel.textContent =
            'Total Words: ' + wordtotal +
            '   |   Short Phrases: ' + shorttotal +
            '   |   Long Phrases: ' + longtotal +
            '   |   Sentences: ' + senttotal +
            '   |   All Items: ' + total;
    }

    var allinputs = main.querySelectorAll('input[type="number"]');
    for (i = 0; i < allinputs.length; i++) {
        allinputs[i].addEventListener('input', updatetotalsandstore);
    }

    updatetotalsandstore();
}

//---------
//MAJOR FUNCTIONS
//---------

function buildquiz(quiztitle, quizinputs, wordsdata) {
    // Assumes this function is available elsewhere in your codebase,
    // if not, provide its implementation as required.
    return window.buildquiz(quiztitle, quizinputs, wordsdata);
}

function getquizitemavailability(wordsdata) {
    var types = ['word', 'shortphrase', 'longphrase', 'sentence'];
    var availability = {};
    var i, j;
    for (i = 0; i < types.length; i++) {
        availability[types[i]] = {};
    }

    for (i = 0; i < wordsdata.length; i++) {
        var wordobj = wordsdata[i];
        var conf = number(wordobj.confidence) || 0;

        if (wordobj.word && string(wordobj.word).trim() !== '') {
            availability.word[conf] = (availability.word[conf] || 0) + 1;
        }
        if (arrayisarray(wordobj.shortphrases)) {
            var count = 0;
            for (j = 0; j < wordobj.shortphrases.length; j++) {
                var p = wordobj.shortphrases[j];
                if (p && string(p).trim() !== '') count++;
            }
            availability.shortphrase[conf] = (availability.shortphrase[conf] || 0) + count;
        }
        if (arrayisarray(wordobj.longphrases)) {
            var count = 0;
            for (j = 0; j < wordobj.longphrases.length; j++) {
                var p = wordobj.longphrases[j];
                if (p && string(p).trim() !== '') count++;
            }
            availability.longphrase[conf] = (availability.longphrase[conf] || 0) + count;
        }
        if (arrayisarray(wordobj.sentences)) {
            var count = 0;
            for (j = 0; j < wordobj.sentences.length; j++) {
                var s = wordobj.sentences[j];
                if (s && string(s).trim() !== '') count++;
            }
            availability.sentence[conf] = (availability.sentence[conf] || 0) + count;
        }
    }

    for (var conf = 0; conf <= 10; conf++) {
        for (i = 0; i < types.length; i++) {
            var type = types[i];
            if (!(conf in availability[type])) availability[type][conf] = 0;
        }
    }

    return availability;
}

function applyquizinputlimits(mainelem, availability) {
    mainelem.querySelectorAll('input[type="number"]').forEach(function(inp) {
        var conf = Number(inp.dataset.confidence);
        var type = normalizetype(inp.dataset.type);
        var avail = availability[type]?.[conf] ?? 0;

        inp.max = avail;

        if (avail === 0) {
            inp.value = 0;
            inp.disabled = true;
            inp.classList.add('quizbuilder-disabled');
        } else {
            inp.disabled = false;
            inp.classList.remove('quizbuilder-disabled');
        }

        inp.oninput = function handleinputevent() {
            if (Number(inp.value) > avail) inp.value = avail;
            if (Number(inp.value) < 0) inp.value = 0;
        };
    });
}

//---------
//HELPER FUNCTIONS
//---------

function normalizetype(str) {
    str = string(str).replace(/\s+/g, '').toLowerCase();
    if (str === 'shortphrases') return 'shortphrase';
    if (str === 'longphrases') return 'longphrase';
    if (str === 'sentences') return 'sentence';
    return str;
}

function getdefaultquiztitle() {
    var seq = 0;
    var prefix = 'Quiz ';
    for (var i = 0; i < quizzes.length; i++) {
        var q = quizzes[i];
        if (q.title && q.title.indexOf(prefix) === 0) {
            var n = Number(q.title.slice(prefix.length));
            if (!isNaN(n) && n >= seq) seq = n + 1;
        }
    }
    return prefix + seq;
}

function string(val) {
    return String(val);
}
function number(val) {
    return Number(val);
}
function arrayisarray(val) {
    return Array.isArray(val);
}
function parseint(val, base) {
    return parseInt(val, base);
}

function trimquizbuilderinputs(mainelem, availability) {
    mainelem.querySelectorAll('input[type="number"]').forEach(function(inp) {
        var conf = Number(inp.dataset.confidence);
        var type = normalizetype(inp.dataset.type);
        var avail = availability[type]?.[conf] ?? 0;

        // If current value is above max, set it to max
        if (Number(inp.value) > avail) {
            inp.value = avail;
            var key = conf + '-' + type;
            quizbuilderinputs[key] = avail;
        }
    });
}

//---------
//IMMEDIATE FUNCTIONS
//---------

// none (renderquizbuilder() is called from main.js)
