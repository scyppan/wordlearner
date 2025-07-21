function initsidepanel() {

      const app = document.getElementById('app')
  app.innerHTML = `
    <aside class="sidepanel">
      <ul><li>Words</li><li>Quiz</li><li>temp</li></ul>
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
        case 'confidence': renderconfidence(); break
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

function renderrenderconfidencetemp() {
  document.querySelector('.maincontent').textContent = 'temp view'
}