function initsidepanel() {

      const app = document.getElementById('app')
  app.innerHTML = `
    <aside class="sidepanel">
      <ul><li>Words</li><li>Quiz</li><li>Data</li></ul>
    </aside>
    <main class="maincontent"></main>
  `;

  const items = document.querySelectorAll('.sidepanel li')
  items.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.textContent.toLowerCase()
      switch (view) {
        case 'words': renderwords(); break
        case 'quiz': renderquiz(); break
        case 'data': renderdata(); break
      }
    })
  })
}

function renderwords() {
  document.querySelector('.maincontent').textContent = 'words view'
}

function renderquiz() {
  document.querySelector('.maincontent').textContent = 'quiz view'
}

function renderdata() {
  document.querySelector('.maincontent').textContent = 'data view'
}