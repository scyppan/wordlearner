// importexport.js

//---------
//ENTRY FUNCTION
//---------
var lessonimportmodal = null
var lessonimportcallback = null

function renderdata() {
    clearmaincontent()
    var main = document.querySelector('#maincontent')
    if (!main) return

    main.innerHTML = ''

    var container = document.createElement('div')
    container.className = 'data-actions-container'

    // Import group
    var importgroup = document.createElement('div')
    importgroup.className = 'data-actions-group'

    var importlabel = document.createElement('div')
    importlabel.className = 'data-group-label'
    importlabel.textContent = 'Import'
    importgroup.appendChild(importlabel)

    var importfullbtn = document.createElement('button')
    importfullbtn.id = 'import-full-set-btn'
    importfullbtn.textContent = 'Full Set'
    importfullbtn.title = 'Import an entire dataset of lessons/items (replaces current full set).'
    importfullbtn.onclick = importfullset
    importgroup.appendChild(importfullbtn)

    var importlessonbtn = document.createElement('button')
    importlessonbtn.id = 'import-lesson-btn'
    importlessonbtn.textContent = 'Lesson'
    importlessonbtn.title = 'Import data for a single lesson.'
    importlessonbtn.onclick = importlesson
    importgroup.appendChild(importlessonbtn)

    // Export group
    var exportgroup = document.createElement('div')
    exportgroup.className = 'data-actions-group'

    var exportlabel = document.createElement('div')
    exportlabel.className = 'data-group-label'
    exportlabel.textContent = 'Export'
    exportgroup.appendChild(exportlabel)

    var exportfullbtn = document.createElement('button')
    exportfullbtn.id = 'export-full-set-btn'
    exportfullbtn.textContent = 'Full Set'
    exportfullbtn.title = 'Export the entire lesson/item dataset.'
    exportfullbtn.onclick = exportfullset
    exportgroup.appendChild(exportfullbtn)

    container.appendChild(importgroup)
    container.appendChild(exportgroup)

    main.appendChild(container)
}

//---------
//MAJOR FUNCTIONS
//---------

function importfullset() {
    var input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'

    input.onchange = function (event) {
        var file = event.target.files[0]
        if (!file) return

        var reader = new FileReader()
        reader.onload = function (e) {
            try {
                var parsed = JSON.parse(e.target.result)

                if (!Array.isArray(parsed)) {
                    throw new Error('Top-level JSON must be an array (fullset).')
                }

                var cleaned = []
                parsed.forEach(function (lessonraw, idx) {
                    if (!lessonraw || typeof lessonraw !== 'object') return

                    var lessonnumber = typeof lessonraw.lessonnumber === 'number'
                        ? lessonraw.lessonnumber
                        : (parseInt(lessonraw.lessonnumber, 10) || 0)

                    var lessonname = typeof lessonraw.lessonname === 'string'
                        ? lessonraw.lessonname
                        : ('Lesson ' + (idx + 1))

                    var items = Array.isArray(lessonraw.items) ? lessonraw.items : []

                    var cleaneditems = items.map(function (it) {
                        var thai = it && typeof it.thai === 'string' ? it.thai : ''
                        var romanization = it && typeof it.romanization === 'string' ? it.romanization : ''
                        var definition = it && typeof it.definition === 'string' ? it.definition : ''
                        var notes = it && typeof it.notes === 'string' ? it.notes : ''

                        var roots = []
                        if (it && Array.isArray(it.roots)) {
                            roots = it.roots
                                .map(function (r) { return typeof r === 'string' ? r.trim() : '' })
                                .filter(function (r) { return r !== '' })
                        } else if (it && typeof it.roots === 'string') {
                            roots = it.roots
                                .split(',')
                                .map(function (r) { return r.trim() })
                                .filter(function (r) { return r !== '' })
                        }

                        // keep progress fields if present
                        var confidence = typeof it.confidence === 'number' ? it.confidence : 0
                        var attempts = typeof it.attempts === 'number' ? it.attempts : 0
                        var correct = typeof it.correct === 'number' ? it.correct : 0

                        return {
                            thai: thai,
                            romanization: romanization,
                            definition: definition,
                            notes: notes,
                            roots: roots,
                            confidence: confidence,
                            attempts: attempts,
                            correct: correct
                        }
                    })

                    cleaned.push({
                        lessonnumber: lessonnumber,
                        lessonname: lessonname,
                        items: cleaneditems
                    })
                })

                if (!Array.isArray(cleaned) || cleaned.length === 0) {
                    throw new Error('No valid lessons/items found in JSON.')
                }

                if (typeof fullset === 'undefined') {
                    fullset = []
                }

                fullset = cleaned
                if (typeof storedata === 'function') {
                    storedata('fullset', fullset)
                }

                var totalitems = fullset.reduce(function (sum, l) {
                    return sum + (Array.isArray(l.items) ? l.items.length : 0)
                }, 0)

                showquizstatusmodal(
                    'Full set import complete.\n' +
                    'Lessons: ' + fullset.length + '\n' +
                    'Total items: ' + totalitems
                )
            } catch (err) {
                console.error(err)
                showquizstatusmodal('Invalid Full Set JSON format or structure.')
            }
        }

        reader.readAsText(file, 'utf-8')
    }

    input.click()
}

function exportfullset() {
    if (typeof fullset === 'undefined' || !Array.isArray(fullset) || !fullset.length) {
        showquizstatusmodal('No full set data to export.')
        return
    }

    var data = fullset

    var dataStr = JSON.stringify(data, null, 2)
    var blob = new Blob([dataStr], { type: 'application/json' })
    var url = URL.createObjectURL(blob)

    var now = new Date()
    var yy = String(now.getFullYear()).slice(2)
    var mm = String(now.getMonth() + 1).padStart(2, '0')
    var dd = String(now.getDate()).padStart(2, '0')
    var filename = 'Thai Full Set - ' + yy + '.' + mm + '.' + dd + '.json'

    var a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    var totalitems = fullset.reduce(function (sum, l) {
        return sum + (Array.isArray(l.items) ? l.items.length : 0)
    }, 0)

    showquizstatusmodal(
        'Exported full set.\n' +
        'Lessons: ' + fullset.length + '\n' +
        'Total items: ' + totalitems
    )
}

function showlessonimportmodal(defaultnum, defaultname, callback) {
    lessonimportcallback = callback

    if (!lessonimportmodal) {
        lessonimportmodal = document.createElement('div')
        lessonimportmodal.id = 'lesson-import-modal'
        lessonimportmodal.className = 'import-modal'

        var dialog = document.createElement('div')
        dialog.className = 'import-modal-dialog'

        var header = document.createElement('div')
        header.className = 'import-modal-header'

        var title = document.createElement('span')
        title.className = 'import-modal-title'
        title.textContent = 'Import lesson'

        var closebtn = document.createElement('button')
        closebtn.type = 'button'
        closebtn.className = 'import-modal-close'
        closebtn.textContent = '×'

        header.appendChild(title)
        header.appendChild(closebtn)

        var body = document.createElement('div')
        body.className = 'import-modal-body'

        // row wrapper for side-by-side fields
        var row = document.createElement('div')
        row.className = 'lesson-import-row'

        // number field
        var numfieldwrap = document.createElement('div')
        numfieldwrap.className = 'lesson-import-field lesson-import-number-field'

        var numlabel = document.createElement('label')
        numlabel.htmlFor = 'lesson-import-number'
        numlabel.textContent = 'Lesson number'

        var numinput = document.createElement('input')
        numinput.id = 'lesson-import-number'
        numinput.type = 'number'
        numinput.min = '1'
        numinput.step = '1'

        numfieldwrap.appendChild(numlabel)
        numfieldwrap.appendChild(numinput)

        // name field
        var namefieldwrap = document.createElement('div')
        namefieldwrap.className = 'lesson-import-field lesson-import-name-field'

        var namelabel = document.createElement('label')
        namelabel.htmlFor = 'lesson-import-name'
        namelabel.textContent = 'Lesson name'

        var nameinput = document.createElement('input')
        nameinput.id = 'lesson-import-name'
        nameinput.type = 'text'

        namefieldwrap.appendChild(namelabel)
        namefieldwrap.appendChild(nameinput)

        row.appendChild(numfieldwrap)
        row.appendChild(namefieldwrap)
        body.appendChild(row)

        var footer = document.createElement('div')
        footer.className = 'import-modal-footer'

        var cancelbtn = document.createElement('button')
        cancelbtn.type = 'button'
        cancelbtn.className = 'lesson-import-cancel'
        cancelbtn.textContent = 'Cancel'

        var okbtn = document.createElement('button')
        okbtn.type = 'button'
        okbtn.className = 'lesson-import-ok'
        okbtn.textContent = 'Import lesson'

        footer.appendChild(cancelbtn)
        footer.appendChild(okbtn)

        dialog.appendChild(header)
        dialog.appendChild(body)
        dialog.appendChild(footer)
        lessonimportmodal.appendChild(dialog)
        document.body.appendChild(lessonimportmodal)

        function hidemodal() {
            lessonimportmodal.classList.remove('is-open')
            lessonimportcallback = null
        }

        // CLOSE only on X or Cancel (no more backdrop-click close)
        closebtn.addEventListener('click', function () {
            hidemodal()
        })

        cancelbtn.addEventListener('click', function () {
            hidemodal()
        })

        okbtn.addEventListener('click', function () {
            if (!lessonimportcallback) {
                hidemodal()
                return
            }

            var numfield = document.getElementById('lesson-import-number')
            var namefield = document.getElementById('lesson-import-name')

            var numval = parseInt(numfield.value, 10)
            if (!numval || isNaN(numval)) {
                numval = parseInt(numfield.getAttribute('data-default') || '1', 10)
            }

            var nameval = (namefield.value || '').trim()
            if (!nameval) {
                nameval = namefield.getAttribute('data-default') || 'New lesson'
            }

            var cb = lessonimportcallback
            lessonimportcallback = null
            hidemodal()
            cb(numval, nameval)
        })
    }

    var numinputnode = document.getElementById('lesson-import-number')
    var nameinputnode = document.getElementById('lesson-import-name')

    numinputnode.value = String(defaultnum || 1)
    numinputnode.setAttribute('data-default', String(defaultnum || 1))

    nameinputnode.value = defaultname || 'New lesson'
    nameinputnode.setAttribute('data-default', defaultname || 'New lesson')

    lessonimportmodal.classList.add('is-open')

    numinputnode.focus()
    numinputnode.select()
}


function importlesson() {
  var input = document.createElement('input')
  input.type = 'file'
  input.accept = '.tsv,text/tab-separated-values'

  input.onchange = function (event) {
    var file = event.target.files[0]
    if (!file) return

    var reader = new FileReader()
    reader.onload = function (e) {
      try {
        var text = e.target.result
        if (!text || !text.trim()) {
          showquizstatusmodal('TSV appears to be empty.')
          return
        }

        var lines = text.split(/\r?\n/).filter(function (line) {
          return line.trim() !== ''
        })
        if (lines.length <= 1) {
          showquizstatusmodal('No data rows found in TSV.')
          return
        }

        var header = lines[0].split('\t')
        var colthai = -1
        var colroman = -1
        var coldef = -1
        var colnotes = -1
        var colroots = -1

        for (var i = 0; i < header.length; i++) {
          var h = header[i].trim().toUpperCase()
          if (h === 'THAI') colthai = i
          else if (h === 'ROMANIZATION') colroman = i
          else if (h === 'DEFINITION') coldef = i
          else if (h === 'NOTES') colnotes = i
          else if (h === 'ROOTS' || h === 'ROOT') colroots = i
        }

        if (colthai === -1 || colroman === -1 || coldef === -1) {
          showquizstatusmodal('TSV header must include "THAI", "ROMANIZATION", and "DEFINITION" columns.')
          return
        }

        if (!Array.isArray(fullset)) {
          fullset = []
        }

        // existing items by thai from lessons before this import
        var existingbythai = {}
        for (var li = 0; li < fullset.length; li++) {
          var lesson0 = fullset[li]
          if (!lesson0 || !Array.isArray(lesson0.items)) continue
          for (var ii = 0; ii < lesson0.items.length; ii++) {
            var item0 = lesson0.items[ii]
            if (!item0 || typeof item0.thai !== 'string') continue
            var key0 = item0.thai.trim()
            if (!key0) continue
            if (!existingbythai[key0]) {
              existingbythai[key0] = item0
            }
          }
        }

        // canonical items (existing + new from this TSV), keyed by thai
        var canonicalbythai = {}
        for (var key in existingbythai) {
          if (Object.prototype.hasOwnProperty.call(existingbythai, key)) {
            canonicalbythai[key] = existingbythai[key]
          }
        }

        function mergefields(target, thai, roman, definition, notes, rootslist) {
          if (!target) return

          if (roman && (!target.romanization || target.romanization === '')) {
            target.romanization = roman
          }

          if (definition) {
            if (!target.definition || target.definition === '') {
              target.definition = definition
            } else if (target.definition.indexOf(definition) === -1) {
              target.definition += ' / ' + definition
            }
          }

          if (notes) {
            if (!target.notes || target.notes === '') {
              target.notes = notes
            } else if (target.notes.indexOf(notes) === -1) {
              target.notes += ' | ' + notes
            }
          }

          if (!Array.isArray(target.roots)) {
            target.roots = []
          }

          if (thai && target.roots.indexOf(thai) === -1) {
            target.roots.push(thai)
          }

          if (Array.isArray(rootslist) && rootslist.length) {
            for (var ri = 0; ri < rootslist.length; ri++) {
              var raw = rootslist[ri]
              if (typeof raw !== 'string') continue
              var trimmed = raw.trim()
              if (!trimmed) continue
              if (target.roots.indexOf(trimmed) === -1) {
                target.roots.push(trimmed)
              }
            }
          }
        }

        var items = []
        var duplicatewordset = {}
        var duplicatewordlabels = []

        var rootsmentioned = {}     // rootthai -> true
        var rootsources = {}        // rootthai -> { anchorthai, anchorroman }
        var importedthaimap = {}    // thai in this TSV

        for (var r = 1; r < lines.length; r++) {
          var row = lines[r].split('\t')
          if (!row.length) continue

          var thai = (row[colthai] || '').trim()
          if (!thai) continue
          importedthaimap[thai] = true

          var roman = (colroman >= 0 ? row[colroman] : '').trim()
          var definition = (coldef >= 0 ? row[coldef] : '').trim()
          var notes = colnotes >= 0 ? (row[colnotes] || '').trim() : ''

          var rootslist = []

          if (colroots >= 0) {
            var rootsraw = (row[colroots] || '').trim()
            if (rootsraw) {
              var parts = rootsraw.split(/[;,]/)
              for (var pi = 0; pi < parts.length; pi++) {
                var part = parts[pi]
                if (typeof part !== 'string') continue
                var rt = part.trim()
                if (!rt) continue

                var rtupper = rt.toUpperCase()
                if (rtupper === 'ROOTS' || rtupper === 'ROOT') {
                  continue
                }

                rootslist.push(rt)
                rootsmentioned[rt] = true

                if (!rootsources[rt]) {
                  rootsources[rt] = {
                    anchorthai: thai,
                    anchorroman: roman
                  }
                }
              }
            }
          }

          if (rootslist.indexOf(thai) === -1) {
            rootslist.push(thai)
          }

          var canonical = canonicalbythai[thai]

          if (!canonical) {
            canonical = {
              thai: thai,
              romanization: roman || '',
              definition: definition || '',
              notes: notes || '',
              roots: [],
              confidence: 0,
              attempts: 0,
              correct: 0
            }
            canonicalbythai[thai] = canonical
            mergefields(canonical, thai, roman, definition, notes, rootslist)
          } else {
            mergefields(canonical, thai, roman, definition, notes, rootslist)

            if (Object.prototype.hasOwnProperty.call(existingbythai, thai) && !duplicatewordset[thai]) {
              duplicatewordset[thai] = true
              var labelroman = canonical.romanization || roman
              var wordlabel = labelroman
                ? thai + ' (' + labelroman + ')'
                : thai
              duplicatewordlabels.push(wordlabel)
            }
          }

          if (!Array.isArray(canonical.roots)) {
            canonical.roots = []
          }
          if (canonical.roots.indexOf(thai) === -1) {
            canonical.roots.push(thai)
          }

          if (items.indexOf(canonical) === -1) {
            items.push(canonical)
          }
        }

        if (items.length === 0) {
          showquizstatusmodal('No valid items found in TSV.')
          return
        }

        // build detailed list of roots that are not in existing items nor in this TSV word set
        var unknownrootentries = []
        var rootsmissinglines = []

        for (var rootkey in rootsmentioned) {
          if (!Object.prototype.hasOwnProperty.call(rootsmentioned, rootkey)) continue

          // skip if root already existed before import
          if (Object.prototype.hasOwnProperty.call(existingbythai, rootkey)) {
            continue
          }

          // skip if root itself is one of the items in this imported TSV
          if (Object.prototype.hasOwnProperty.call(importedthaimap, rootkey)) {
            continue
          }

          var source = rootsources[rootkey] || { anchorthai: rootkey, anchorroman: '' }
          var anchorthai = source.anchorthai || rootkey
          var anchorroman = source.anchorroman || ''

          // try to fill anchor roman from canonical if missing
          if (!anchorroman && canonicalbythai[anchorthai] && typeof canonicalbythai[anchorthai].romanization === 'string') {
            anchorroman = canonicalbythai[anchorthai].romanization
          }

          unknownrootentries.push({
            root: rootkey,
            anchorthai: anchorthai,
            anchorroman: anchorroman
          })

          var anchorlabel = anchorroman
            ? anchorthai + ' (' + anchorroman + ')'
            : anchorthai

          rootsmissinglines.push(
            'Root: ' + rootkey +
            ' in item ' + anchorlabel +
            ' not found in existing items nor in this word set.'
          )
        }

        var defaultnum = 1
        if (fullset.length > 0) {
          var maxnum = 0
          for (var j = 0; j < fullset.length; j++) {
            var ln = fullset[j] && typeof fullset[j].lessonnumber === 'number'
              ? fullset[j].lessonnumber
              : 0
            if (ln > maxnum) maxnum = ln
          }
          defaultnum = maxnum + 1
        }

        var defaultname = 'New lesson'

        var duplicatemessage = ''
        if (duplicatewordlabels.length > 0) {
          duplicatemessage =
            'The following ' + duplicatewordlabels.length + ' item' +
            (duplicatewordlabels.length > 1 ? 's already exist' : ' already exists') +
            ' in your dataset. Existing records and this lesson item will be updated ' +
            'to include any new definition/notes information:\n' +
            duplicatewordlabels.join(', ')
        }

        var rootsmissingmessage = ''
        if (rootsmissinglines.length > 0) {
          rootsmissingmessage =
            'These roots are not currently present in the existing items nor in this word set:\n' +
            rootsmissinglines.join('\n')
        }

        showlessonimportmodal(defaultnum, defaultname, function (lessonnumber, lessonname) {
          var lesson = {
            lessonnumber: lessonnumber,
            lessonname: lessonname,
            items: items
          }

          fullset.push(lesson)

          fullset.sort(function (a, b) {
            var an = a && typeof a.lessonnumber === 'number' ? a.lessonnumber : 0
            var bn = b && typeof b.lessonnumber === 'number' ? b.lessonnumber : 0
            return an - bn
          })

          if (typeof storedata === 'function') {
            storedata('fullset', fullset)
          }

          var basemessage =
            'Lesson import complete.\n' +
            'Lesson ' + lessonnumber + ': ' + lessonname + '\n' +
            'Items added to this lesson: ' + items.length

          if (duplicatewordlabels.length > 0) {
            basemessage +=
              '\n\nDuplicates detected and merged for:\n' +
              duplicatewordlabels.join(', ')
          }

          if (rootsmissingmessage) {
            basemessage +=
              '\n\n' + rootsmissingmessage
          }

          showquizstatusmodal(basemessage)

          if (typeof renderlessonspanel === 'function') {
            renderlessonspanel()
          }
        })

        var modal = document.getElementById('lesson-import-modal')
        if (modal) {
          var body = modal.querySelector('.import-modal-body')
          if (body) {
            if (duplicatemessage) {
              var dupnote = body.querySelector('.lesson-import-duplicates')
              if (!dupnote) {
                dupnote = document.createElement('div')
                dupnote.className = 'lesson-import-duplicates'
                body.appendChild(dupnote)
              }
              dupnote.textContent = duplicatemessage
            }

            if (unknownrootentries.length > 0) {
              var rootsnote = body.querySelector('.lesson-import-missing-roots')
              if (!rootsnote) {
                rootsnote = document.createElement('div')
                rootsnote.className = 'lesson-import-missing-roots'
                body.appendChild(rootsnote)
              }

              // clear previous content
              rootsnote.innerHTML = ''

              var title = document.createElement('div')
              title.textContent = 'These roots are not currently present in the existing items nor in this word set:'
              rootsnote.appendChild(title)

              var ul = document.createElement('ul')

              for (var ur = 0; ur < unknownrootentries.length; ur++) {
                var entry = unknownrootentries[ur]
                var anchorlabel = entry.anchorroman
                  ? entry.anchorthai + ' (' + entry.anchorroman + ')'
                  : entry.anchorthai

                var liroot = document.createElement('li')
                liroot.textContent =
                  'Root: ' + entry.root +
                  ' in item ' + anchorlabel +
                  ' not found in existing items nor in this word set.'
                ul.appendChild(liroot)
              }

              rootsnote.appendChild(ul)
            }
          }
        }
      } catch (err) {
        console.error(err)
        showquizstatusmodal('Error while importing Lesson TSV.')
      }
    }

    reader.readAsText(file, 'utf-8')
  }

  input.click()
}
