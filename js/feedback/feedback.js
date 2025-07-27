//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

var selectedquizindex = null;
var selectedrowindex = null;

//---------
//ENTRY FUNCTION
//---------

function renderfeedback() {
    clearmaincontent();
    var main = document.querySelector('#maincontent');

    var container = document.createElement('div');
    container.className = 'feedback-container';

    var quizlistpanel = createfeedbackquizlistpanel();
    var quiztablepanel = createfeedbacktablepanel();
    var worddetailspanel = createfeedbackwordpanel();

    container.appendChild(quizlistpanel);
    container.appendChild(quiztablepanel);
    container.appendChild(worddetailspanel);
    main.appendChild(container);

    if (quizzes.length > 0) {
        if (selectedquizindex === null || selectedquizindex > quizzes.length - 1) {
            selectedquizindex = quizzes.length - 1;
        }
        renderfeedbackquiztable(selectedquizindex, quiztablepanel, worddetailspanel);
    }
}
//---------
//MAJOR FUNCTIONS
//---------

function createfeedbackquizlistpanel() {
    var quizlistpanel = document.createElement('aside');
    quizlistpanel.className = 'feedback-quizlist-panel';

    var quizlist = document.createElement('ul');
    quizlist.className = 'feedback-quiz-list';

    if (quizzes.length === 0) {
        var empty = document.createElement('li');
        empty.textContent = 'No quizzes yet';
        empty.className = 'feedback-empty';
        quizlist.appendChild(empty);
    } else {
        for (var i = 0; i < quizzes.length; i++) {
            var quiz = quizzes[i];
            var li = document.createElement('li');
            li.textContent = quiz.title || 'Quiz ' + (i + 1);
            li.className = 'feedback-quiz-listitem';
            li.tabIndex = 0;
            if (i === selectedquizindex) {
                console.log('Selected:', i); // <---- DEBUG
                li.classList.add('selected');
            }
            li.addEventListener('click', createfeedbackquizclickhandler(i));
            quizlist.appendChild(li);
        }
    }
    quizlistpanel.appendChild(quizlist);
    return quizlistpanel;
}

function createfeedbackquizclickhandler(i) {
    return function () {
        selectedquizindex = i;
        selectedrowindex = null;  // <--- reset row selection when quiz changes
        renderfeedback();
    };
}

function createfeedbacktablepanel() {
    var quiztablepanel = document.createElement('section');
    quiztablepanel.className = 'feedback-table-panel';
    if (quizzes.length === 0) {
        quiztablepanel.textContent = 'Select a quiz to review.';
    }
    return quiztablepanel;
}

function createfeedbackwordpanel() {
    var worddetailspanel = document.createElement('aside');
    worddetailspanel.id = 'feedback-word-panel';

    var placeholder = document.createElement('div');
    placeholder.className = 'word-details-placeholder';
    placeholder.textContent = '← Click a quiz item to view details here.';
    worddetailspanel.appendChild(placeholder);

    var detailspanel = opendetailspanel();

    worddetailspanel._detailsPanel = detailspanel;
    worddetailspanel._placeholder = placeholder;
    return worddetailspanel;
}

function renderfeedbackquiztable(quizindex, quiztablepanel, worddetailspanel) {
    quiztablepanel.innerHTML = '';
    if (worddetailspanel && worddetailspanel._detailsPanel) {
        worddetailspanel._detailsPanel.classList.add('hidden');
    }

    var quiz = quizzes[quizindex];
    if (!quiz) {
        quiztablepanel.textContent = 'Quiz not found.';
        return;
    }

    var table = document.createElement('table');
    table.className = 'feedback-table';
    var header = document.createElement('tr');
    var headers = ['#', 'Base Word', 'Prompt', 'Correct?'];
    for (var h = 0; h < headers.length; h++) {
        var th = document.createElement('th');
        th.textContent = headers[h];
        header.appendChild(th);
    }
    table.appendChild(header);

    for (var i = 0; i < quiz.items.length; i++) {
        var item = quiz.items[i];
        var tr = document.createElement('tr');
        tr.className = 'feedback-row';
        tr.tabIndex = 0;

        // Highlight selected row
        if (i === selectedrowindex) {
            tr.classList.add('selected');
        }

        // This closure will set selectedrowindex and re-render table on click
        tr.addEventListener('click', (function(rowidx, quizidx){
            return function() {
                selectedrowindex = rowidx;
                renderfeedbackquiztable(quizidx, quiztablepanel, worddetailspanel);
                // Optionally, show word details as before:
                let container = document.getElementById('feedback-word-panel');
                container.innerHTML = '';
                container.appendChild(opendetailspanel());
                var w = wordsdata.find(function (it) { return it.word === item.thai; });
                showworddetails(w);
            };
        })(i, quizindex));

        // Number
        var tdnum = document.createElement('td');
        tdnum.textContent = item.itemnumber;
        tr.appendChild(tdnum);

        // Thai base word
        var tdthai = document.createElement('td');
        tdthai.textContent = item.thai;
        tr.appendChild(tdthai);

        // Quiz prompt
        var tditem = document.createElement('td');
        tditem.textContent = item.item;
        tr.appendChild(tditem);

        // Correct?
        var tdcorr = document.createElement('td');
        tdcorr.className = 'feedback-status';
        var iconhtml = '';
        if (item.state === 'succeeded') {
            iconhtml = '<span class="feedback-correct">&#10003;</span>'; // ✔
        } else if (item.state === 'failed') {
            iconhtml = '<span class="feedback-incorrect">&#10007;</span>'; // ✖
        } else if (item.state === 'partial') {
            iconhtml = '<span class="feedback-partial">&#9677;</span>'; // ◍
        } else {
            iconhtml = '<span class="feedback-untested">&#9679;</span>'; // ●
        }
        tdcorr.innerHTML = iconhtml;
        tr.appendChild(tdcorr);

        table.appendChild(tr);
    }

    quiztablepanel.appendChild(table);
}

function createfeedbackitemclickhandler(item) {
    return function () {
        let container = document.getElementById('feedback-word-panel');
        container.innerHTML = '';
        container.appendChild(opendetailspanel());

        var w = wordsdata.find(function (it) { return it.word === item.thai; });
        showworddetails(w);
    };
}

function renderfeedbackworddetails(item, worddetailspanel) {
    var detailspanel = worddetailspanel._detailsPanel;
    var placeholder = worddetailspanel._placeholder;
    var w = wordsdata.find(function (e) { return e.word === item.thai; });
    if (w) {
        showworddetails(w);
        detailspanel.classList.remove('hidden');
        if (placeholder) placeholder.style.display = 'none';
    } else {
        detailspanel.classList.add('hidden');
        if (placeholder) placeholder.style.display = '';
    }
}

//---------
//HELPER FUNCTIONS
//---------

// none needed (relies on createworddetailspanel and showworddetails from elsewhere)

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — renderfeedback() is called from main.js or menu
