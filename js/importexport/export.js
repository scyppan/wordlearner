// js/importexport/export.js

function exporttojson() {
  var haslessons = Array.isArray(fullset) && fullset.length > 0
  var hasquizzes = Array.isArray(quizzes) && quizzes.length > 0
  var haswords = Array.isArray(wordsdata) && wordsdata.length > 0

  if (!haslessons && !haswords && !hasquizzes) {
    showquizstatusmodal('No data to export.')
    return
  }

  var payload

  if (haslessons) {
    payload = {
      version: 2,
      fullset: fullset,
      quizzes: hasquizzes ? quizzes : []
    }
  } else {
    payload = {
      version: 1,
      words: haswords ? wordsdata : []
    }
  }

  var dataStr = JSON.stringify(payload, null, 2)
  var blob = new Blob([dataStr], { type: 'application/json' })
  var url = URL.createObjectURL(blob)

  var now = new Date()
  var yy = String(now.getFullYear()).slice(2)
  var mm = String(now.getMonth() + 1).padStart(2, '0')
  var dd = String(now.getDate()).padStart(2, '0')
  var filename = 'thai word learner - ' + yy + '.' + mm + '.' + dd + '.json'

  var a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  var summary = haslessons
    ? 'Exported ' + fullset.length + ' lessons' +
      (hasquizzes ? '\nQuizzes: ' + quizzes.length : '')
    : 'Exported legacy word list (' + (haswords ? wordsdata.length : 0) + ' items).'

  showquizstatusmodal(summary)
}