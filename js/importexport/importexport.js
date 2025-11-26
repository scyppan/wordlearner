// importexport.js
//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none — uses globals: fullset (new), wordsdata, quizzes, storedata


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


function importlesson() {
    var input = document.createElement('input')
    input.type = 'file'
    input.accept = '.tsv,text/tab-separated-values'

    input.onchange = function(event) {
        var file = event.target.files[0]
        if (!file) return

        var reader = new FileReader()
        reader.onload = function(e) {
            try {
                var text = e.target.result
                if (!text || !text.trim()) {
                    showquizstatusmodal('TSV appears to be empty.')
                    return
                }

                var lines = text.split(/\r?\n/).filter(function(line) {
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

                for (var i = 0; i < header.length; i++) {
                    var h = header[i].trim().toUpperCase()
                    if (h === 'THAI') colthai = i
                    else if (h === 'ROMANIZATION') colroman = i
                    else if (h === 'DEFINITION') coldef = i
                    else if (h === 'NOTES') colnotes = i
                }

                if (colthai === -1 || colroman === -1 || coldef === -1) {
                    showquizstatusmodal('TSV header must include "THAI", "ROMANIZATION", and "DEFINITION" columns.')
                    return
                }

                var items = []

                for (var r = 1; r < lines.length; r++) {
                    var row = lines[r].split('\t')
                    if (!row.length) continue

                    var thai = (row[colthai] || '').trim()
                    if (!thai) continue

                    var roman = (colroman >= 0 ? row[colroman] : '').trim()
                    var definition = (coldef >= 0 ? row[coldef] : '').trim()
                    var notes = colnotes >= 0 ? (row[colnotes] || '').trim() : ''

                    var roots = [thai]

                    items.push({
                        thai: thai,
                        romanization: roman,
                        definition: definition,
                        notes: notes,
                        roots: roots,
                        confidence: 0,
                        attempts: 0,
                        correct: 0
                    })
                }

                if (items.length === 0) {
                    showquizstatusmodal('No valid items found in TSV.')
                    return
                }

                if (!Array.isArray(fullset)) {
                    fullset = []
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

                showlessonimportmodal(defaultnum, defaultname, function(lessonnumber, lessonname) {
                    var lesson = {
                        lessonnumber: lessonnumber,
                        lessonname: lessonname,
                        items: items
                    }

                    fullset.push(lesson)

                    fullset.sort(function(a, b) {
                        var an = a && typeof a.lessonnumber === 'number' ? a.lessonnumber : 0
                        var bn = b && typeof b.lessonnumber === 'number' ? b.lessonnumber : 0
                        return an - bn
                    })

                    if (typeof storedata === 'function') {
                        storedata('fullset', fullset)
                    }

                    showquizstatusmodal(
                        'Lesson import complete.\n' +
                        'Lesson ' + lessonnumber + ': ' + lessonname + '\n' +
                        'Items added: ' + items.length
                    )

                    if (typeof renderlessonspanel === 'function') {
                        renderlessonspanel()
                    }
                })
            } catch (err) {
                console.error(err)
                showquizstatusmodal('Error while importing Lesson TSV.')
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