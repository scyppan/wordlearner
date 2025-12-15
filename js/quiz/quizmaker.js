// js/quizmode/session.js

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none


//---------
//ENTRY FUNCTION
//---------

function renderquizsession(quizindex, targetelem) {
  var target =
    targetelem || document.getElementById('quiz-detail-panel') || document.querySelector('#maincontent')
  if (!target) return

  target.innerHTML = ''

  if (!Array.isArray(quizzes) || !quizzes[quizindex]) {
    target.textContent = 'quiz not found.'
    return
  }

  var quiz = quizzes[quizindex]
  var items = preparequizitems(quiz)
  if (!items.length) {
    target.textContent = 'no items in this quiz.'
    return
  }

  var h2 = document.createElement('h2')
  h2.className = 'quizsession-title'
  h2.textContent = quiz.title || 'quiz ' + (quizindex + 1)
  target.appendChild(h2)

  var table = document.createElement('table')
  table.className = 'quizsession-table'

  var header = document.createElement('tr')
  var cols = ['#', 'item', 'status']
  for (var i = 0; i < cols.length; i++) {
    var th = document.createElement('th')
    th.textContent = cols[i]
    header.appendChild(th)
  }
  table.appendChild(header)

  for (var idx = 0; idx < items.length; idx++) {
    var item = items[idx]
    var tr = document.createElement('tr')

    var tdnum = document.createElement('td')
    tdnum.textContent = item.itemnumber
    tr.appendChild(tdnum)

    var tditem = document.createElement('td')
    tditem.className = 'quizsession-itemcell'

    var spantext = document.createElement('span')
    spantext.className = 'quizsession-itemtext'
    spantext.textContent = item.thai

    spantext.addEventListener('click', function (e) {
      e.stopPropagation()
      var selection = window.getSelection()
      if (!selection) return
      selection.removeAllRanges()
      var range = document.createRange()
      range.selectNodeContents(this)
      selection.addRange(range)
    })

    tditem.appendChild(spantext)

    var infobtn = document.createElement('button')
    infobtn.type = 'button'
    infobtn.className = 'quiz-info-btn'
    infobtn.title = 'show details'
    infobtn.setAttribute('aria-label', 'show details for this item')
    infobtn.dataset.quizindex = String(quizindex)
    infobtn.dataset.itemindex = String(idx)
    infobtn.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none">' +
      '<path d="M7 2H17C18.1046 2 19 2.89543 19 4V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4C5 2.89543 5.89543 2 7 2Z" stroke="#666" stroke-width="2"/>' +
      '<path d="M9 6H15" stroke="#666" stroke-width="2"/>' +
      '<path d="M9 10H15" stroke="#666" stroke-width="2"/>' +
      '<path d="M9 14H13" stroke="#666" stroke-width="2"/>' +
      '</svg>'

    infobtn.addEventListener('click', function (e) {
      e.stopPropagation()
      var q = parseInt(this.dataset.quizindex, 10)
      var id = parseInt(this.dataset.itemindex, 10)
      var clickeditem = quizzes[q].items[id]
      if (typeof showquizitempopup === 'function') {
        showquizitempopup(clickeditem)
      }
    })

    tditem.appendChild(infobtn)

    var morebtn = document.createElement('button')
    morebtn.type = 'button'
    morebtn.className = 'quiz-more-btn'
    morebtn.title = 'show plain text'
    morebtn.setAttribute('aria-label', 'show plain text for this item')
    morebtn.dataset.itemnumber = String(item.itemnumber)
    morebtn.dataset.itemtext = String(item.thai || '')
    morebtn.textContent = '•'

    morebtn.addEventListener('click', function (e) {
      e.stopPropagation()
      showquizitemtextmodal(this.dataset.itemnumber, this.dataset.itemtext)
    })

    tditem.appendChild(morebtn)

    tr.appendChild(tditem)

    var tdstatus = document.createElement('td')
    tdstatus.className = 'quizsession-statuscell'

    var states = [
      { state: 'not tested', className: 'bubble-not-tested' },
      { state: 'wrong', className: 'bubble-wrong' },
      { state: 'right', className: 'bubble-right' }
    ]

    ;(function (tdstatusref, itemref) {
      for (var s = 0; s < states.length; s++) {
        ;(function (choice) {
          var bubble = document.createElement('span')
          bubble.className = 'quizsession-bubble ' + choice.className
          if (itemref.state === choice.state) {
            bubble.classList.add('selected')
          }
          bubble.addEventListener('click', function () {
            itemref.state = choice.state
            var all = tdstatusref.querySelectorAll('.quizsession-bubble')
            for (var k = 0; k < all.length; k++) {
              all[k].classList.remove('selected')
            }
            bubble.classList.add('selected')
            storedata('quizzes', quizzes)
          })
          tdstatusref.appendChild(bubble)
        })(states[s])
      }
    })(tdstatus, item)

    tr.appendChild(tdstatus)
    table.appendChild(tr)
  }

  target.appendChild(table)

  var submitwrap = document.createElement('div')
  submitwrap.className = 'quiz-submit-wrap'

  var submitbtn = document.createElement('button')
  submitbtn.type = 'button'
  submitbtn.className = 'quiz-submit-button'
  submitbtn.textContent = 'Submit quiz'
  submitbtn.addEventListener('click', function () {
    submitquiz(quizindex)
  })
  submitwrap.appendChild(submitbtn)

  target.appendChild(submitwrap)

  var feedback = document.createElement('div')
  feedback.id = 'quiz-feedback'
  target.appendChild(feedback)

  if (quiz.laststats) {
    renderquizfeedback(quizindex, quiz.laststats)
  }
}


//---------
//MAJOR FUNCTIONS
//---------

function preparequizitems(quiz) {
  if (!quiz || !Array.isArray(quiz.items)) return []

  if (quiz.prepared && quiz.items.length) {
    return quiz.items
  }

  var raw = quiz.items
  var seen = {}
  var normalized = []

  for (var i = 0; i < raw.length; i++) {
    var src = raw[i]
    if (!src) continue

    var thai = ''
    if (typeof src.thai === 'string') {
      thai = src.thai
    } else if (typeof src.word === 'string') {
      thai = src.word
    } else if (typeof src.item === 'string') {
      thai = src.item
    }

    thai = thai ? String(thai).trim() : ''
    if (!thai) continue

    if (seen[thai]) continue
    seen[thai] = true

    var itemobj = {
      thai: thai,
      romanization: src.romanization || '',
      definition: src.definition || '',
      notes: src.notes || '',
      lessonnumber:
        typeof src.lessonnumber === 'number'
          ? src.lessonnumber
          : typeof quiz.lessonnumber === 'number'
          ? quiz.lessonnumber
          : null,
      lessonname: src.lessonname || quiz.lessonname || '',
      lessonindex:
        typeof src.lessonindex === 'number'
          ? src.lessonindex
          : typeof quiz.lessonindex === 'number'
          ? quiz.lessonindex
          : null,
      sourceindex:
        typeof src.sourceindex === 'number'
          ? src.sourceindex
          : typeof src.itemindex === 'number'
          ? src.itemindex
          : -1,
      state: src.state || 'not tested',
      itemnumber: 0
    }

    normalized.push(itemobj)
  }

  shuffleitems(normalized)

  for (var j = 0; j < normalized.length; j++) {
    normalized[j].itemnumber = j + 1
  }

  quiz.items = normalized
  quiz.prepared = true

  return normalized
}

function submitquiz(quizindex) {
  if (!Array.isArray(quizzes) || !quizzes[quizindex]) return
  if (!Array.isArray(fullset)) return

  var quiz = quizzes[quizindex]
  var items = quiz.items || []

  var totalanswered = 0
  var correctcount = 0

  for (var i = 0; i < items.length; i++) {
    var qitem = items[i]
    if (!qitem) continue

    var state = qitem.state || 'not tested'
    if (state !== 'right' && state !== 'wrong') {
      continue
    }

    totalanswered++
    if (state === 'right') {
      correctcount++
    }

    var info = getlessonitemforquizitem(qitem)
    if (!info) continue

    var src = info.item

    if (typeof src.attempts !== 'number') src.attempts = 0
    if (typeof src.correct !== 'number') src.correct = 0
    if (typeof src.confidence !== 'number') src.confidence = 0

    src.attempts += 1
    if (state === 'right') {
      src.correct += 1
      src.confidence = bumpconfidencelevel(src.confidence)
    } else if (state === 'wrong') {
      src.confidence = dropconfidencelevel(src.confidence)
    }
  }

  storedata('fullset', fullset)

  var percent = 0
  if (totalanswered > 0) {
    percent = Math.round((correctcount / totalanswered) * 100)
  }

  var stats = {
    totalanswered: totalanswered,
    correctcount: correctcount,
    percent: percent
  }

  quiz.laststats = stats
  storedata('quizzes', quizzes)

  renderquizfeedback(quizindex, stats)
}

// replace ONLY the result-column section inside renderquizfeedback
// (the rest of the function stays the same)

function renderquizfeedback(quizindex, stats) {
  var feedback = document.getElementById('quiz-feedback')
  if (!feedback) return

  feedback.innerHTML = ''

  if (!Array.isArray(quizzes) || !quizzes[quizindex]) return
  var quiz = quizzes[quizindex]
  var items = quiz.items || []

  var heading = document.createElement('h3')
  heading.className = 'quiz-feedback-title'
  heading.textContent = 'Feedback'
  feedback.appendChild(heading)

  var summary = document.createElement('p')
  summary.className = 'quiz-feedback-summary'

  if (stats.totalanswered > 0) {
    summary.textContent =
      'You answered ' +
      stats.correctcount +
      ' of ' +
      stats.totalanswered +
      ' items correctly (' +
      stats.percent +
      '%).'
  } else {
    summary.textContent = 'No items were marked as right or wrong.'
  }

  feedback.appendChild(summary)

  var table = document.createElement('table')
  table.className = 'quiz-feedback-table'

  var header = document.createElement('tr')

  var hthai = document.createElement('th')
  hthai.textContent = 'thai'
  header.appendChild(hthai)

  var hroman = document.createElement('th')
  hroman.textContent = 'romanization'
  header.appendChild(hroman)

  var hdef = document.createElement('th')
  hdef.textContent = 'definition'
  header.appendChild(hdef)

  var hres = document.createElement('th')
  hres.textContent = 'result'
  header.appendChild(hres)

  var hadd = document.createElement('th')
  hadd.textContent = 'add'
  header.appendChild(hadd)

  table.appendChild(header)

  for (var i = 0; i < items.length; i++) {
    var qitem = items[i]
    if (!qitem) continue

    var row = document.createElement('tr')

    var tdthai = document.createElement('td')
    var thaispan = document.createElement('span')
    thaispan.className = 'quiz-feedback-thai'
    thaispan.textContent = qitem.thai || ''
    thaispan.addEventListener(
      'click',
      (function (quizindexref, itemindexref) {
        return function () {
          addquizitemfromfeedback(quizindexref, itemindexref)
        }
      })(quizindex, i)
    )
    tdthai.appendChild(thaispan)
    row.appendChild(tdthai)

    var tdroman = document.createElement('td')
    tdroman.textContent = qitem.romanization || ''
    row.appendChild(tdroman)

    var tddef = document.createElement('td')
    tddef.textContent = qitem.definition || ''
    row.appendChild(tddef)

    var tdres = document.createElement('td')
    var icon = document.createElement('span')
    icon.className = 'quiz-feedback-result-icon'
    var st = qitem.state || 'not tested'

    if (st === 'right') {
      icon.classList.add('quiz-feedback-result-right')
      icon.textContent = '✓'
      icon.setAttribute('aria-label', 'right')
    } else if (st === 'wrong') {
      icon.classList.add('quiz-feedback-result-wrong')
      icon.textContent = '✕'
      icon.setAttribute('aria-label', 'wrong')
    } else {
      icon.classList.add('quiz-feedback-result-untested')
      icon.textContent = ''
      icon.setAttribute('aria-label', 'not tested')
    }

    tdres.appendChild(icon)
    row.appendChild(tdres)

    var tdadd = document.createElement('td')

    var rootsbtn = document.createElement('button')
    rootsbtn.type = 'button'
    rootsbtn.className = 'quiz-feedback-roots-btn'
    rootsbtn.textContent = '+roots'
    rootsbtn.addEventListener(
      'click',
      (function (quizindexref, itemindexref) {
        return function () {
          addrootsfromfeedback(quizindexref, itemindexref)
        }
      })(quizindex, i)
    )

    tdadd.appendChild(rootsbtn)
    row.appendChild(tdadd)

    table.appendChild(row)
  }

  feedback.appendChild(table)
}


function addquizitemfromfeedback(quizindex, itemindex) {
  if (!Array.isArray(quizzes) || !quizzes[quizindex]) return
  var quiz = quizzes[quizindex]
  var items = quiz.items || []
  if (itemindex < 0 || itemindex >= items.length) return

  var qitem = items[itemindex]
  var info = getlessonitemforquizitem(qitem)
  if (!info) return

  var lesson = info.lesson
  var src = info.item
  var idx = info.itemindex

  // only this call should handle any toasts;
  // do NOT show a separate toast here to avoid duplicates.
  if (typeof additemtoquizplan === 'function') {
    additemtoquizplan(lesson, src, idx)
  }
}


//---------
//HELPER FUNCTIONS
//---------

function shuffleitems(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
}

function getlessonitemforquizitem(qitem) {
  if (!qitem || !Array.isArray(fullset)) return null

  var candidatelessonindex = -1
  if (typeof qitem.lessonindex === 'number') {
    candidatelessonindex = qitem.lessonindex
  }

  var lesson = null
  if (candidatelessonindex >= 0 && candidatelessonindex < fullset.length) {
    lesson = fullset[candidatelessonindex]
  }

  if (!lesson) {
    var ln = typeof qitem.lessonnumber === 'number' ? qitem.lessonnumber : null
    var lname = typeof qitem.lessonname === 'string' ? qitem.lessonname : ''
    for (var i = 0; i < fullset.length; i++) {
      var l = fullset[i]
      if (!l) continue
      var lnum = typeof l.lessonnumber === 'number' ? l.lessonnumber : null
      var lnam = typeof l.lessonname === 'string' ? l.lessonname : ''
      if (ln !== null && lnum === ln && lname && lnam === lname) {
        lesson = l
        candidatelessonindex = i
        break
      }
    }
  }

  if (!lesson || !Array.isArray(lesson.items)) return null

  var idx = -1
  if (typeof qitem.sourceindex === 'number') {
    idx = qitem.sourceindex
    if (idx < 0 || idx >= lesson.items.length) {
      idx = -1
    }
  }

  if (idx === -1) {
    for (var j = 0; j < lesson.items.length; j++) {
      var it = lesson.items[j]
      if (!it) continue
      var matchthai = (it.thai || it.word || '') === (qitem.thai || '')
      var matchroman =
        !qitem.romanization ||
        (it.romanization || '') === (qitem.romanization || '')
      if (matchthai && matchroman) {
        idx = j
        break
      }
    }
  }

  if (idx === -1) return null

  return {
    lesson: lesson,
    lessonindex: candidatelessonindex,
    item: lesson.items[idx],
    itemindex: idx
  }
}

function bumpconfidencelevel(conf) {
  if (typeof conf !== 'number') conf = 0
  if (conf <= 0) return 1
  if (conf === 1) return 2
  if (conf === 2) return 3
  if (conf >= 3) return 4
  return conf
}

function dropconfidencelevel(conf) {
  if (typeof conf !== 'number') conf = 0
  if (conf <= 0) return 0
  if (conf === 1) return 0
  if (conf === 2) return 1
  if (conf === 3) return 2
  if (conf >= 4) return 3
  return conf
}

function addlessonrangetoquizplan(lesson, range) {
  if (!lesson) return

  var labelbase = getlessonlabel(lesson)
  var label

  if (range === 'untested') {
    label = 'Untested items from ' + labelbase
  } else if (range === 'lowplus') {
    label = 'Low confidence (or untested) items from ' + labelbase
  } else if (range === 'midplus') {
    label = 'Middle confidence (or less) items from ' + labelbase
  } else if (range === 'highplus') {
    label = 'High confidence (or less) items from ' + labelbase
  } else if (range === 'solid') {
    label = 'Solidified items from ' + labelbase
  } else {
    label = 'Items from ' + labelbase
  }

  var entry = {
    kind: 'range',
    range: range,
    lessonnumber: typeof lesson.lessonnumber === 'number' ? lesson.lessonnumber : null,
    lessonname: typeof lesson.lessonname === 'string' ? lesson.lessonname : '',
    label: label
  }

  if (typeof addquizplanentry === 'function') {
    addquizplanentry(entry)
  }

  if (typeof showquizstatusmodal === 'function') {
    showquizstatusmodal('Added to quiz planner:\n' + label)
  }
}

function additemtoquizplan(lesson, item, index) {
  if (!lesson || !item) return

  var labelbase = getlessonlabel(lesson)

  var thai = item && typeof item.thai === 'string' ? item.thai : ''
  var roman = item && typeof item.romanization === 'string' ? item.romanization : ''

  var wordlabel = ''
  if (thai && roman) {
    wordlabel = thai + ' (' + roman + ')'
  } else if (thai) {
    wordlabel = thai
  } else if (roman) {
    wordlabel = '(' + roman + ')'
  } else {
    wordlabel = '(no text)'
  }

  var label = wordlabel + ' from ' + labelbase

  var entry = {
    kind: 'item',
    lessonnumber: typeof lesson.lessonnumber === 'number' ? lesson.lessonnumber : null,
    lessonname: typeof lesson.lessonname === 'string' ? lesson.lessonname : '',
    itemindex: typeof index === 'number' ? index : -1,
    thai: thai,
    romanization: roman,
    label: label
  }

  if (typeof addquizplanentry === 'function') {
    addquizplanentry(entry)
  }

  if (typeof showquizstatusmodal === 'function') {
    showquizstatusmodal('Added to quiz planner:\n' + label)
  }
}

function addrootsfromfeedback(quizindex, itemindex) {
  if (!Array.isArray(quizzes) || !quizzes[quizindex]) return
  var quiz = quizzes[quizindex]
  var items = quiz.items || []
  if (itemindex < 0 || itemindex >= items.length) return

  var qitem = items[itemindex]
  var info = getlessonitemforquizitem(qitem)
  if (!info) return

  var src = info.item

  if (typeof addrootstoquizplan === 'function') {
    addrootstoquizplan(src)
  }
}

function addrootstoquizplan(item) {
  if (!item) return

  var thai = item && typeof item.thai === 'string' ? item.thai : ''
  thai = thai ? String(thai).trim() : ''

  var roman = item && typeof item.romanization === 'string' ? item.romanization : ''

  var wordlabel = ''
  if (thai && roman) {
    wordlabel = thai + ' (' + roman + ')'
  } else if (thai) {
    wordlabel = thai
  } else if (roman) {
    wordlabel = '(' + roman + ')'
  } else {
    wordlabel = '(no text)'
  }

  var label = 'all roots of ' + wordlabel

  var entry = {
    kind: 'roots',
    anchorthai: thai,
    anchorromanization: roman,
    label: label
  }

  if (typeof addquizplanentry === 'function') {
    addquizplanentry(entry)
  }

  if (typeof showquizstatusmodal === 'function') {
    showquizstatusmodal('Added to quiz planner:\n' + label)
  }
}

function showquizitemtextmodal(itemnumber, itemtext) {
var modal = document.createElement('div')
modal.className = 'import-modal is-open'

var dialog = document.createElement('div')
dialog.className = 'import-modal-dialog'

var header = document.createElement('div')
header.className = 'import-modal-header'

var title = document.createElement('span')
title.className = 'import-modal-title'
title.textContent = 'Quiz item'

var closebtn = document.createElement('button')
closebtn.type = 'button'
closebtn.className = 'import-modal-close'
closebtn.textContent = '×'

header.appendChild(title)
header.appendChild(closebtn)

var body = document.createElement('div')
body.className = 'import-modal-body'

var pre = document.createElement('pre')
pre.className = 'quiz-item-plaintext'
pre.textContent = 'Item ' + String(itemnumber || '') + '\n\n' + String(itemtext || '')
body.appendChild(pre)

var footer = document.createElement('div')
footer.className = 'import-modal-footer'

var okbtn = document.createElement('button')
okbtn.type = 'button'
okbtn.className = 'lesson-import-ok'
okbtn.textContent = 'Close'

footer.appendChild(okbtn)

dialog.appendChild(header)
dialog.appendChild(body)
dialog.appendChild(footer)
modal.appendChild(dialog)
document.body.appendChild(modal)

function hidemodal() {
if (modal && modal.parentNode) {
modal.parentNode.removeChild(modal)
}
}

closebtn.addEventListener('click', hidemodal)
okbtn.addEventListener('click', hidemodal)

modal.addEventListener('click', function (e) {
if (e.target === modal) {
hidemodal()
}
})
}

function buildquizmorebtn(itemnumber, itemtext) {
var btn = document.createElement('button')
btn.type = 'button'
btn.className = 'quiz-more-btn'
btn.title = 'show plain text'
btn.setAttribute('aria-label', 'show plain text for this item')

btn.innerHTML =
'<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
'<circle cx="5" cy="12" r="2"></circle>' +
'<circle cx="12" cy="12" r="2"></circle>' +
'<circle cx="19" cy="12" r="2"></circle>' +
'</svg>'

btn.addEventListener('click', function (e) {
e.stopPropagation()
showquizitemtextmodal(itemnumber, itemtext)
})

return btn
}