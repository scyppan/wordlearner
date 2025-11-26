
function importfromjson() {
  var input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,application/json'

  input.onchange = function (event) {
    var file = event.target.files[0]
    if (!file) return

    var reader = new FileReader()
    reader.onload = function (e) {
      try {
        var data = JSON.parse(e.target.result)

        // new format: { version, fullset, quizzes? }
        if (data && Array.isArray(data.fullset)) {
          fullset = data.fullset

          for (var li = 0; li < fullset.length; li++) {
            var lesson = fullset[li]
            if (!lesson || !Array.isArray(lesson.items)) continue

            for (var ii = 0; ii < lesson.items.length; ii++) {
              var item = lesson.items[ii]
              if (!item) continue

              if (typeof item.confidence !== 'number') item.confidence = 0
              if (typeof item.attempts !== 'number') item.attempts = 0
              if (typeof item.correct !== 'number') item.correct = 0
            }
          }

          storedata('fullset', fullset)

          if (Array.isArray(data.quizzes)) {
            quizzes = data.quizzes
            storedata('quizzes', quizzes)
          }

          var msg =
            'Import complete.\n' +
            'Lessons: ' + fullset.length +
            (Array.isArray(data.quizzes) ? '\nQuizzes: ' + data.quizzes.length : '')

          showquizstatusmodal(msg)
          return
        }

        // legacy format: plain array
        if (Array.isArray(data)) {
          wordsdata = data
          storedata('wordsdata', wordsdata)
          showquizstatusmodal(
            'Imported legacy word list.\n' +
            'Lesson / quiz structure not included in this format.'
          )
          return
        }

        showquizstatusmodal('JSON did not look like a full-set export.')
      } catch (err) {
        console.error(err)
        showquizstatusmodal('Invalid JSON format or structure.')
      }
    }
    reader.readAsText(file)
  }

  input.click()
}

function showimportmodal(title, message) {
    var modal = document.getElementById('import-modal')
    if (!modal) {
        modal = document.createElement('div')
        modal.id = 'import-modal'
        modal.className = 'import-modal'

        var dialog = document.createElement('div')
        dialog.className = 'import-modal-dialog'

        var header = document.createElement('div')
        header.className = 'import-modal-header'

        var titleelem = document.createElement('span')
        titleelem.className = 'import-modal-title'

        var closebtn = document.createElement('button')
        closebtn.type = 'button'
        closebtn.className = 'import-modal-close'
        closebtn.textContent = '×'

        header.appendChild(titleelem)
        header.appendChild(closebtn)

        var body = document.createElement('div')
        body.className = 'import-modal-body'

        var textareaelem = document.createElement('textarea')
        textareaelem.className = 'import-modal-text'
        textareaelem.readOnly = true

        body.appendChild(textareaelem)

        dialog.appendChild(header)
        dialog.appendChild(body)
        modal.appendChild(dialog)
        document.body.appendChild(modal)

        function hidemodal() {
            modal.classList.remove('is-open')
        }

        closebtn.addEventListener('click', function () {
            hidemodal()
        })

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                hidemodal()
            }
        })
    }

    var t = modal.querySelector('.import-modal-title')
    var ta = modal.querySelector('.import-modal-text')
    if (t) t.textContent = title || ''
    if (ta) ta.value = message || ''

    modal.classList.add('is-open')
}