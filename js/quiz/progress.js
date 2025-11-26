// js/quiz/progress.js

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none – this file operates on the global `fullset` array.

//---------
//ENTRY FUNCTION
//---------

// call this once after your scripts load (for example from initsidepanel or on DOMContentLoaded)
function initprogressdata() {
  var stored = retrievedata('fullset')

  // ensure we have a global fullset array
  if (Array.isArray(stored)) {
    fullset = stored
  } else if (typeof fullset === 'undefined' || !Array.isArray(fullset)) {
    fullset = []
  }

  // make sure every item has progress fields
  for (var i = 0; i < fullset.length; i++) {
    ensurelessonprogressfields(fullset[i])
  }

  // write back any newly added progress fields
  storedata('fullset', fullset)
}


//---------
//MAJOR FUNCTIONS
//---------

function ensurelessonprogressfields(lesson) {
  if (!lesson || !Array.isArray(lesson.items)) return

  for (var i = 0; i < lesson.items.length; i++) {
    ensureitemprogressfields(lesson.items[i])
  }
}

// call this from quiz logic whenever you have changed attempts/correct/confidence
function savefullsetprogress() {
  if (!Array.isArray(fullset)) return
  storedata('fullset', fullset)
}


//---------
//HELPER FUNCTIONS
//---------

function ensureitemprogressfields(item) {
  if (!item) return

  if (typeof item.attempts !== 'number') {
    item.attempts = 0
  }

  if (typeof item.correct !== 'number') {
    item.correct = 0
  }

  if (typeof item.confidence !== 'number') {
    item.confidence = 0
  }

  if (typeof item.lastseen !== 'number') {
    item.lastseen = 0
  }
}


//---------
//IMMEDIATE FUNCTIONS
//---------

// none – remember to call initprogressdata() somewhere in your startup flow
