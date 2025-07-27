//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none for this module

//---------
//ENTRY FUNCTION
//---------

function renderquizmode() {
    clearmaincontent();
    var main = document.querySelector('#maincontent');

    var container = document.createElement('div');
    container.className = 'quizmode-container';

    var sidebar = document.createElement('aside');
    sidebar.className = 'quizmode-sidebar';

    var quizlist = document.createElement('ul');
    quizlist.className = 'quizmode-list';

    var quizpanel = document.createElement('section');
    quizpanel.className = 'quizmode-panel';
    quizpanel.textContent = 'Select a quiz to begin. (Quiz area placeholder)';

    if (quizzes.length === 0) {
        var empty = document.createElement('li');
        empty.textContent = 'No quizzes yet';
        empty.className = 'quizmode-empty';
        quizlist.appendChild(empty);
    } else {
        for (var i = 0; i < quizzes.length; i++) {
            var quiz = quizzes[i];
            var li = document.createElement('li');
            li.textContent = '\u0009' + (quiz.title || 'Quiz ' + (i + 1));
            li.className = 'quizmode-listitem';
            li.tabIndex = 0;
            li.setAttribute('aria-label', 'Quiz ' + (quiz.title || (i + 1)));

            // --- Add delete (X) button ---
            var delbtn = document.createElement('button');
            delbtn.type = 'button';
            delbtn.className = 'quiz-delete-btn';
            delbtn.textContent = '✖'; // Unicode heavy X, visually clear
            delbtn.title = 'Delete quiz';
            delbtn.setAttribute('aria-label', 'Delete ' + (quiz.title || 'Quiz ' + (i + 1)));
            delbtn.onclick = createdeletehandler(i);
            li.appendChild(delbtn);

            li.addEventListener('click', createquizclickhandler(i, quizpanel));
            quizlist.appendChild(li);
        }
    }

    sidebar.appendChild(quizlist);

    container.appendChild(sidebar);
    container.appendChild(quizpanel);
    main.appendChild(container);
}

//---------
//MAJOR FUNCTIONS
//---------

function createquizclickhandler(index, quizpanel) {
    return function(event) {
        // Don't open the quiz if the delete button was clicked
        if (event && event.target && event.target.classList.contains('quiz-delete-btn')) return;
        quizpanel.innerHTML = '';
        renderquizsession(index, quizpanel);
    };
}

function createdeletehandler(index) {
    return function(event) {
        event.stopPropagation(); // prevent li click
        quizzes.splice(index, 1);
        renderquizmode();
    };
}

//---------
//HELPER FUNCTIONS
//---------

// none

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — renderquizmode() is called from main.js or menu
