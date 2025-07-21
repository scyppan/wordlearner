function initsidepanel() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const aside = document.createElement('aside');
  aside.className = 'sidepanel';

  const views = [
    { label: 'Words',        action: renderwords },
    { label: 'Quiz Builder', action: renderquizbuilder },
    { label: 'Quiz Mode',    action: renderquizmode },
    { label: 'Feedback',     action: renderfeedback },
    { label: 'Data',         action: renderdata }
  ];

  const ul = document.createElement('ul');
  views.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.label;
    li.addEventListener('click', item.action);
    ul.appendChild(li);
  });

  aside.appendChild(ul);

  const main = document.createElement('main');
  main.className = 'maincontent';

  app.appendChild(aside);
  app.appendChild(main);
}


function renderwords() {
  document.querySelector('.maincontent').textContent = 'words view';
}

function renderquiz() {
  document.querySelector('.maincontent').textContent = 'quiz view';
}

function renderquizbuilder() {
  document.querySelector('.maincontent').textContent = 'quiz builder view';
}

function renderquizmode() {
  document.querySelector('.maincontent').textContent = 'quiz mode view';
}

function renderdata() {
  document.querySelector('.maincontent').textContent = 'data view';
}

function renderfeedback() {
  document.querySelector('.maincontent').textContent = 'feedback view';
}
