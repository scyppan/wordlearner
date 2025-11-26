// js/lessons/lessonspanel.js

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

var selectedlessonindex = null
var deletelessonmodal = null
var deletelessonindexpending = null


//---------
//ENTRY FUNCTION
//---------

function renderlessonspanel() {
  if (typeof clearmaincontent === 'function') {
    clearmaincontent()
  }

  var main = document.getElementById('maincontent')
  if (!main) return

  main.innerHTML = ''

  var layout = buildlessonslayout()
  main.appendChild(layout)
}


//---------
//MAJOR FUNCTIONS
//---------

function buildlessonslayout() {
  var container = document.createElement('div')
  container.id = 'lessons-container'

  var listpanel = document.createElement('div')
  listpanel.id = 'lessons-list-panel'

  var detailpanel = document.createElement('div')
  detailpanel.id = 'lesson-detail-panel'

  var list = buildlessonslist()
  listpanel.appendChild(list)

  renderlessondetailpanel(null, null)

  container.appendChild(listpanel)
  container.appendChild(detailpanel)

  return container
}

function buildlessonslist() {
  var list = document.createElement('ul')
  list.id = 'lesson-unit-list'

  var lessons = []
  if (Array.isArray(fullset)) {
    lessons = fullset.slice()
  }

  lessons.sort(function (a, b) {
    var an = a && typeof a.lessonnumber === 'number' ? a.lessonnumber : 0
    var bn = b && typeof b.lessonnumber === 'number' ? b.lessonnumber : 0
    return an - bn
  })

  if (lessons.length === 0) {
    var empty = document.createElement('li')
    empty.className = 'lesson-empty'
    empty.textContent = 'No lessons yet.'
    list.appendChild(empty)
    return list
  }

  lessons.forEach(function (lesson, index) {
    var li = createlessonli(lesson, index)
    list.appendChild(li)
  })

  return list
}

function renderlessondetailpanel(lesson, lessonindex) {
  var panel = document.getElementById('lesson-detail-panel')
  if (!panel) return

  panel.innerHTML = ''

  if (!lesson || !Array.isArray(lesson.items) || lesson.items.length === 0) {
    var placeholder = document.createElement('div')
    placeholder.className = 'lesson-detail-placeholder'
    placeholder.textContent = 'Select a lesson to see its items.'
    panel.appendChild(placeholder)
    return
  }

  var header = document.createElement('div')
  header.id = 'lesson-detail-header'
  header.className = 'lesson-detail-header'

  var title = document.createElement('div')
  title.className = 'lesson-detail-title'
  title.textContent = getlessonheadertext(lesson)

  header.appendChild(title)
  panel.appendChild(header)

  var stats = getlessonstats(lesson)

  var statswrap = document.createElement('div')
  statswrap.id = 'lesson-stats'

  var btnuntested = document.createElement('button')
  btnuntested.className = 'lesson-stat-btn stat-untested'
  btnuntested.textContent =
    'Untested items: ' + stats.untested + ' attempts'
  btnuntested.onclick = function () {
    addlessonrangetoquizplan(lesson, 'untested')
  }
  statswrap.appendChild(btnuntested)

  var btnlow = document.createElement('button')
  btnlow.className = 'lesson-stat-btn stat-low'
  btnlow.textContent =
    'Low confidence items: ' + stats.low
  btnlow.onclick = function () {
    addlessonrangetoquizplan(lesson, 'lowplus')
  }
  statswrap.appendChild(btnlow)

  var btnmid = document.createElement('button')
  btnmid.className = 'lesson-stat-btn stat-mid'
  btnmid.textContent =
    'Middle confidence items: ' + stats.mid
  btnmid.onclick = function () {
    addlessonrangetoquizplan(lesson, 'midplus')
  }
  statswrap.appendChild(btnmid)

  var btnhigh = document.createElement('button')
  btnhigh.className = 'lesson-stat-btn stat-high'
  btnhigh.textContent =
    'High confidence items: ' + stats.high
  btnhigh.onclick = function () {
    addlessonrangetoquizplan(lesson, 'highplus')
  }
  statswrap.appendChild(btnhigh)

  var btnsolid = document.createElement('button')
  btnsolid.className = 'lesson-stat-btn stat-solid'
  btnsolid.textContent =
    'Solidified items: ' + stats.solid
  btnsolid.onclick = function () {
    addlessonrangetoquizplan(lesson, 'solid')
  }
  statswrap.appendChild(btnsolid)

  panel.appendChild(statswrap)

  var scroll = document.createElement('div')
  scroll.id = 'lesson-items-scroll'

  var itemslist = document.createElement('ul')
  itemslist.id = 'lesson-items-list'

  lesson.items.forEach(function (item, index) {
    var li = createlessondetailitem(lesson, item, index)
    itemslist.appendChild(li)
  })

  scroll.appendChild(itemslist)
  panel.appendChild(scroll)
}


function getlessonstats(lesson) {
  var stats = {
    untested: 0,
    low: 0,
    mid: 0,
    high: 0,
    solid: 0
  }

  if (!lesson || !Array.isArray(lesson.items)) {
    return stats
  }

  lesson.items.forEach(function (item) {
    var bucket = getitemconfidencebucket(item)
    if (bucket && stats.hasOwnProperty(bucket)) {
      stats[bucket]++
    }
  })

  return stats
}


//---------
//HELPER FUNCTIONS
//---------

function createlessonli(lesson, index) {
  var li = document.createElement('li')
  li.className = 'lesson-unit'
  li.setAttribute('data-lesson-index', String(index))

  var num = lesson && typeof lesson.lessonnumber === 'number'
    ? lesson.lessonnumber
    : ''

  var name = lesson && typeof lesson.lessonname === 'string'
    ? lesson.lessonname
    : 'Lesson'

  var count = Array.isArray(lesson.items) ? lesson.items.length : 0

  var text = ''
  if (num !== '') {
    text = 'Lesson ' + num + ': ' + name
  } else {
    text = name
  }
  text += ' (' + count + ' items)'

  var labelspan = document.createElement('span')
  labelspan.className = 'lesson-unit-label'
  labelspan.textContent = text

  var deletebtn = document.createElement('button')
  deletebtn.type = 'button'
  deletebtn.className = 'lesson-unit-delete'
  deletebtn.textContent = '×'
  deletebtn.title = 'Delete lesson'

  deletebtn.addEventListener('click', function (e) {
    e.stopPropagation()
    if (Array.isArray(fullset) && index >= 0 && index < fullset.length) {
      showdeletelessonmodal(index, fullset[index])
    }
  })

  li.appendChild(labelspan)
  li.appendChild(deletebtn)

  li.addEventListener('click', function () {
    selectedlessonindex = index

    var list = document.getElementById('lesson-unit-list')
    if (list) {
      var children = list.querySelectorAll('.lesson-unit')
      children.forEach(function (node) {
        node.classList.remove('selected')
      })
    }
    li.classList.add('selected')

    var lessonobj = null
    if (Array.isArray(fullset) && index >= 0 && index < fullset.length) {
      lessonobj = fullset[index]
    }

    renderlessondetailpanel(lessonobj, index)
  })

  return li
}

function createlessondetailitem(lesson, item, index) {
  var li = document.createElement('li')
  li.className = 'lesson-item'

  var row1 = document.createElement('div')
  row1.className = 'lesson-item-row lesson-item-row1'

  var mainspan = document.createElement('span')
  mainspan.className = 'lesson-item-main'

  var thai = item && typeof item.thai === 'string' ? item.thai : ''
  var roman = item && typeof item.romanization === 'string' ? item.romanization : ''

  if (thai || roman) {
    if (thai && roman) {
      mainspan.textContent = thai + ' (' + roman + ')'
    } else if (thai) {
      mainspan.textContent = thai
    } else {
      mainspan.textContent = '(' + roman + ')'
    }
  } else {
    mainspan.textContent = '(no text)'
  }

  var confspan = document.createElement('span')
  confspan.className = 'lesson-item-confidence'
  confspan.textContent = getitemconfidencelabel(item)

  row1.appendChild(mainspan)
  row1.appendChild(confspan)

  var row2 = document.createElement('div')
  row2.className = 'lesson-item-row lesson-item-row2'

  var defspan = document.createElement('span')
  defspan.className = 'lesson-item-definition'
  defspan.textContent =
    item && typeof item.definition === 'string' && item.definition.trim() !== ''
      ? item.definition
      : '(no definition)'

  var progspan = document.createElement('span')
  progspan.className = 'lesson-item-progress'
  progspan.textContent = getitemprogresslabel(item)

  row2.appendChild(defspan)
  row2.appendChild(progspan)

  li.appendChild(row1)
  li.appendChild(row2)

  li.addEventListener('click', function () {
    additemtoquizplan(lesson, item, index)
  })

  return li
}

function getlessonheadertext(lesson) {
  if (!lesson) return ''
  var label = getlessonlabel(lesson)
  var count = Array.isArray(lesson.items) ? lesson.items.length : 0
  return label + ' (' + count + ' items)'
}

function getlessonlabel(lesson) {
  if (!lesson) return 'Lesson'
  var num = typeof lesson.lessonnumber === 'number' ? lesson.lessonnumber : ''
  var name = typeof lesson.lessonname === 'string' ? lesson.lessonname : 'Lesson'
  if (num !== '') return 'Lesson ' + num + ': ' + name
  return name
}

function getitemconfidencebucket(item) {
  if (!item) return 'untested'

  var attempts = typeof item.attempts === 'number' ? item.attempts : 0
  var conf = typeof item.confidence === 'number' ? item.confidence : null

  if (!attempts || attempts <= 0) {
    return 'untested'
  }

  if (conf === null) {
    if (attempts < 3) return 'low'
    if (attempts < 6) return 'mid'
    if (attempts < 10) return 'high'
    return 'solid'
  }

  if (conf >= 4) return 'solid'
  if (conf >= 3) return 'high'
  if (conf >= 2) return 'mid'
  if (conf >= 1) return 'low'
  return 'untested'
}

function getitemconfidencelabel(item) {
  var bucket = getitemconfidencebucket(item)
  if (bucket === 'untested') return 'confidence: untested'
  if (bucket === 'low') return 'confidence: low'
  if (bucket === 'mid') return 'confidence: medium'
  if (bucket === 'high') return 'confidence: high'
  if (bucket === 'solid') return 'confidence: solidified'
  return 'confidence: untested'
}

function getitemprogresslabel(item) {
  var correct = typeof item.correct === 'number' ? item.correct : 0
  var attempts = typeof item.attempts === 'number' ? item.attempts : 0
  return correct + ' / ' + attempts
}


// delete lesson modal + logic

function showdeletelessonmodal(index, lesson) {
  if (!Array.isArray(fullset)) return
  if (index < 0 || index >= fullset.length) return

  deletelessonindexpending = index

  if (!deletelessonmodal) {
    deletelessonmodal = document.createElement('div')
    deletelessonmodal.id = 'delete-lesson-modal'
    deletelessonmodal.className = 'import-modal'

    var dialog = document.createElement('div')
    dialog.className = 'import-modal-dialog'

    var header = document.createElement('div')
    header.className = 'import-modal-header'

    var title = document.createElement('span')
    title.className = 'import-modal-title'
    title.textContent = 'Delete lesson'

    var closebtn = document.createElement('button')
    closebtn.type = 'button'
    closebtn.className = 'import-modal-close'
    closebtn.textContent = '×'

    header.appendChild(title)
    header.appendChild(closebtn)

    var body = document.createElement('div')
    body.className = 'import-modal-body'
    body.id = 'delete-lesson-body'

    var footer = document.createElement('div')
    footer.className = 'import-modal-footer'

    var cancelbtn = document.createElement('button')
    cancelbtn.type = 'button'
    cancelbtn.className = 'lesson-import-cancel'
    cancelbtn.textContent = 'Cancel'

    var okbtn = document.createElement('button')
    okbtn.type = 'button'
    okbtn.className = 'lesson-import-ok'
    okbtn.textContent = 'Delete lesson'

    footer.appendChild(cancelbtn)
    footer.appendChild(okbtn)

    dialog.appendChild(header)
    dialog.appendChild(body)
    dialog.appendChild(footer)
    deletelessonmodal.appendChild(dialog)
    document.body.appendChild(deletelessonmodal)

    function hidemodal() {
      deletelessonmodal.classList.remove('is-open')
      deletelessonindexpending = null
    }

    closebtn.addEventListener('click', function () {
      hidemodal()
    })

    cancelbtn.addEventListener('click', function () {
      hidemodal()
    })

    okbtn.addEventListener('click', function () {
      if (typeof deletelessonindexpending === 'number') {
        deletelesson(deletelessonindexpending)
      }
      hidemodal()
    })

    deletelessonmodal.addEventListener('click', function (e) {
      if (e.target === deletelessonmodal) {
        hidemodal()
      }
    })
  }

  var bodynode = document.getElementById('delete-lesson-body')
  if (bodynode) {
    var label = getlessonlabel(lesson)
    var count = Array.isArray(lesson.items) ? lesson.items.length : 0
    bodynode.textContent =
      'Delete ' + label + ' (' + count + ' items)? This cannot be undone.'
  }

  deletelessonmodal.classList.add('is-open')
}

function deletelesson(index) {
  if (!Array.isArray(fullset)) return
  if (index < 0 || index >= fullset.length) return

  fullset.splice(index, 1)

  if (typeof storedata === 'function') {
    storedata('fullset', fullset)
  }

  selectedlessonindex = null
  renderlessonspanel()
}


//---------
//IMMEDIATE FUNCTIONS
//---------

// none
