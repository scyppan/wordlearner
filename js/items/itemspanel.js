// js/items/itemspanel.js

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// hook this up to real itemsdata later
// for now, just a placeholder so the button works
var itemsviewplaceholder = true


//---------
//ENTRY FUNCTION
//---------

function renderitemspanel() {
    if (typeof clearmaincontent === 'function') {
        clearmaincontent()
    }

    var main = document.getElementById('maincontent')
    if (!main) return

    var container = builditemscontainer()
    main.appendChild(container)
}


//---------
//MAJOR FUNCTIONS
//---------

function builditemscontainer() {
    var container = document.createElement('div')
    container.id = 'items-container'

    var heading = document.createElement('h2')
    heading.textContent = 'Items'
    container.appendChild(heading)

    var note = document.createElement('p')
    note.textContent = 'Items view will show the master list of phrases/sentences tagged by roots and combos.'
    container.appendChild(note)

    return container
}

function removedatasetitem() {
  var raw = prompt('Enter the exact THAI value to remove (this is destructive):', '')
  if (raw === null) return

  var thai = String(raw || '').trim()
  if (!thai) {
    if (typeof showquizstatusmodal === 'function') {
      showquizstatusmodal('Nothing entered.')
    }
    return
  }

  var ok = confirm('Remove "' + thai + '" from lessons + itemsdata?')
  if (!ok) return

  var fullsetresult = removefromfullsetbythai(thai)
  var itemsresult = removefromitemsdatabythai(thai)
  var planremoved = removefromquizplanbythai(thai)

  if (typeof storedata === 'function') {
    if (typeof fullset !== 'undefined') storedata('fullset', fullset)
    if (typeof itemsdata !== 'undefined') storedata('itemsdata', itemsdata)
    if (typeof quizplan !== 'undefined') storedata('quizplan', quizplan)
  }

  var lines = []
  lines.push('Remove complete.')
  lines.push('THAI: ' + thai)
  lines.push('')
  lines.push('Removed from lessons (fullset): ' + fullsetresult.removed)
  lines.push('Lessons affected: ' + (fullsetresult.lessonsaffected.length ? fullsetresult.lessonsaffected.join(', ') : 'none'))
  lines.push('')
  lines.push('Removed from itemsdata: ' + itemsresult.removed)
  lines.push('Removed from quiz planner: ' + planremoved)

  if (typeof showquizstatusmodal === 'function') {
    showquizstatusmodal(lines.join('\n'))
  } else {
    alert(lines.join('\n'))
  }

  if (typeof renderlessonspanel === 'function') renderlessonspanel()
  if (typeof renderitemspanel === 'function') renderitemspanel()
  if (typeof refreshquizpanel === 'function') refreshquizpanel()
}

function removefromfullsetbythai(thai) {
  var t = (thai || '').trim()
  var removed = 0
  var lessonsaffected = []

  if (typeof fullset === 'undefined' || !Array.isArray(fullset)) {
    return { removed: 0, lessonsaffected: [] }
  }

  for (var li = 0; li < fullset.length; li++) {
    var lesson = fullset[li]
    if (!lesson || !Array.isArray(lesson.items)) continue

    var before = lesson.items.length

    lesson.items = lesson.items.filter(function (it) {
      if (!it || typeof it.thai !== 'string') return true
      return it.thai.trim() !== t
    })

    var delta = before - lesson.items.length
    if (delta > 0) {
      removed += delta
      var label = (lesson.lessonnumber ? String(lesson.lessonnumber) : String(li + 1))
      if (lesson.lessonname) label += ' ' + lesson.lessonname
      lessonsaffected.push(label)
    }
  }

  return { removed: removed, lessonsaffected: lessonsaffected }
}

function removefromitemsdatabythai(thai) {
  var t = (thai || '').trim()
  if (!t) return { removed: 0 }

  if (typeof ensureitemsarray === 'function') {
    ensureitemsarray()
  } else {
    if (!Array.isArray(itemsdata)) itemsdata = []
  }

  var removed = 0

  if (typeof removeitemsbythai === 'function') {
    removed = removeitemsbythai(t)
  } else {
    for (var i = itemsdata.length - 1; i >= 0; i--) {
      var item = itemsdata[i]
      if (!item || typeof item.thai !== 'string') continue
      if (item.thai.trim() === t) {
        itemsdata.splice(i, 1)
        removed++
      }
    }
  }

  return { removed: removed }
}

function removefromquizplanbythai(thai) {
  var t = (thai || '').trim()
  if (!t) return 0

  if (typeof quizplan === 'undefined' || !Array.isArray(quizplan)) return 0

  var removed = 0

  for (var i = quizplan.length - 1; i >= 0; i--) {
    var entry = quizplan[i]
    if (!entry || typeof entry !== 'object') continue
    if (entry.kind !== 'item') continue
    if (typeof entry.thai !== 'string') continue

    if (entry.thai.trim() === t) {
      quizplan.splice(i, 1)
      removed++
    }
  }

  return removed
}

//---------
//HELPER FUNCTIONS
//---------

// none

//---------
//IMMEDIATE FUNCTIONS
//---------

// none
