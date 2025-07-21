function renderquizmode() {
    const main = document.querySelector('.maincontent');
    main.innerHTML = '';

    // Container for split layout
    const container = document.createElement('div');
    container.className = 'quizmode-container';

    // Left panel: quiz list
    const sidebar = document.createElement('aside');
    sidebar.className = 'quizmode-sidebar';

    const quizList = document.createElement('ul');
    quizList.className = 'quizmode-list';

    // Right panel: quiz/test area
    const quizPanel = document.createElement('section');
    quizPanel.className = 'quizmode-panel';
    quizPanel.textContent = 'Select a quiz to begin. (Quiz area placeholder)';

    if (quizzes.length === 0) {
        const empty = document.createElement('li');
        empty.textContent = 'No quizzes yet';
        empty.className = 'quizmode-empty';
        quizList.appendChild(empty);
    } else {
        quizzes.forEach((quiz, i) => {
            const li = document.createElement('li');
            li.textContent = quiz.title || `Quiz ${i+1}`;
            li.className = 'quizmode-listitem';
            li.tabIndex = 0; // Keyboard accessibility

            li.addEventListener('click', function() {
                // Clear and render quiz in right panel
                quizPanel.innerHTML = '';
                renderQuizSession(i, quizPanel);
            });
            quizList.appendChild(li);
        });
    }

    sidebar.appendChild(quizList);

    // Compose and attach
    container.appendChild(sidebar);
    container.appendChild(quizPanel);
    main.appendChild(container);
}
