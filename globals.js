let fullset=[];

//-----------------------------
// globals.js  (add near the top, after other globals)
//-----------------------------
if (typeof quizzes === 'undefined' || !Array.isArray(quizzes)) {
  var quizzes = []
}


//-----------------------------
// add to your lessons script (where buttons call addlessonrangetoquizplan / additemtoquizplan)
// make sure this is in a <script> that loads AFTER js/quiz/quizpanel.js
//-----------------------------

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
