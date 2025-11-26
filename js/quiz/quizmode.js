// quizzespanel.js (list and open produced quizzes)

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

var selectedquizindex = null


//---------
//ENTRY FUNCTION
//---------

function renderquizzespanel() {
  if (typeof clearmaincontent === 'function') {
    clearmaincontent()
  }

  var main = document.getElementById('maincontent')
  if (!main) return

  main.innerHTML = ''

  ensurequizzesarray()

  var container = document.createElement('div')
  container.id = 'quizzes-container'

  var listpanel = document.createElement('div')
  listpanel.id = 'quizzes-list-panel'

  var detailpanel = document.createElement('div')
  detailpanel.id = 'quiz-detail-panel'

  var heading = document.createElement('h2')
  heading.textContent = 'Quizzes'
  listpanel.appendChild(heading)

  var list = buildquizzeslist(detailpanel)
  listpanel.appendChild(list)

  container.appendChild(listpanel)
  container.appendChild(detailpanel)

  main.appendChild(container)
}


//---------
//MAJOR FUNCTIONS
//---------

function buildquizzeslist(detailpanel) {
  var ul = document.createElement('ul')
  ul.id = 'quizzes-list'

  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    var empty = document.createElement('li')
    empty.className = 'quiz-empty'
    empty.textContent = 'No quizzes yet. Use the Quiz planner to produce one.'
    ul.appendChild(empty)
    return ul
  }

  for (var i = 0; i < quizzes.length; i++) {
    var quiz = quizzes[i]
    var li = createquizlistitem(quiz, i, detailpanel)
    ul.appendChild(li)
  }

  // autoselect first quiz
  if (selectedquizindex === null && quizzes.length > 0) {
    selectedquizindex = 0
    renderquizsession(0, detailpanel)
    var first = ul.querySelector('li.quiz-entry')
    if (first) {
      first.classList.add('selected')
    }
  }

  return ul
}

//---------
//HELPER FUNCTIONS
//---------

function createquizlistitem(quiz, index, detailpanel) {
  var li = document.createElement('li')
  li.className = 'quiz-entry'
  li.setAttribute('data-quiz-index', String(index))

  var title = quiz && quiz.title ? quiz.title : 'Quiz ' + (index + 1)
  var itemcount = quiz && Array.isArray(quiz.items) ? quiz.items.length : 0

  // label span (clicking anywhere on this selects the quiz)
  var labelspan = document.createElement('span')
  labelspan.className = 'quiz-entry-label'
  labelspan.textContent =
    title + ' (' + itemcount + ' item' + (itemcount === 1 ? '' : 's') + ')'
  li.appendChild(labelspan)

  // red X button to delete this quiz
  var deletebtn = document.createElement('button')
  deletebtn.type = 'button'
  deletebtn.className = 'quiz-entry-remove'
  deletebtn.textContent = '×'
  deletebtn.title = 'Delete this quiz'

  deletebtn.addEventListener('click', function (e) {
    e.stopPropagation()
    deletequiz(index)
  })

  li.appendChild(deletebtn)

  // clicking the li (but not the X) selects and opens the quiz
  li.addEventListener('click', function () {
    selectedquizindex = index

    var list = document.getElementById('quizzes-list')
    if (list) {
      var children = list.querySelectorAll('.quiz-entry')
      for (var i = 0; i < children.length; i++) {
        children[i].classList.remove('selected')
      }
    }
    li.classList.add('selected')

    renderquizsession(index, detailpanel)
  })

  return li
}

function deletequiz(index) {
  if (!Array.isArray(quizzes)) return
  if (index < 0 || index >= quizzes.length) return

  quizzes.splice(index, 1)

  if (typeof storedata === 'function') {
    storedata('quizzes', quizzes)
  }

  selectedquizindex = null
  renderquizzespanel()
}

function showquizitempopup(qitem) {
  if (!qitem) return

  var thai = typeof qitem.thai === 'string' ? qitem.thai : ''
  var roman = typeof qitem.romanization === 'string' ? qitem.romanization : ''
  var definition = typeof qitem.definition === 'string' ? qitem.definition : ''
  var notes = typeof qitem.notes === 'string' ? qitem.notes : ''

  var header = ''
  if (thai && roman) {
    header = thai + ' (' + roman + ')'
  } else if (thai) {
    header = thai
  } else if (roman) {
    header = '(' + roman + ')'
  }

  var lines = []

  if (definition) {
    lines.push('Definition: ' + definition)
  }
  if (notes) {
    lines.push('Notes: ' + notes)
  }

  var msg = ''

  if (header) {
    msg += header
  }

  if (lines.length > 0) {
    if (msg) msg += '\n\n'
    msg += lines.join('\n')
  }

  if (!msg) {
    msg = 'No details recorded for this item yet.'
  }

  if (typeof showquizstatusmodal === 'function') {
    showquizstatusmodal(msg)
  } else {
    alert(msg)
  }
}

//---------
//IMMEDIATE FUNCTIONS
//---------

// none
