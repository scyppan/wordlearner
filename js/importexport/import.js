function importfromjson() {
    var input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'

    input.onchange = function(event) {
        var file = event.target.files[0]
        if (!file) return

        var reader = new FileReader()
        reader.onload = function(e) {
            try {
                var arr = JSON.parse(e.target.result)
                if (!Array.isArray(arr)) throw 0
                var keys = [
                    'word', 'confidence', 'romanization', 'type', 'pos',
                    'definition', 'notes', 'shortphrases', 'longphrases', 'sentences'
                ]
                for (var i = 0; i < arr.length; i++) {
                    var obj = arr[i]
                    var objkeys = Object.keys(obj)
                    if (
                        objkeys.length !== keys.length ||
                        !keys.every(function(k) { return objkeys.includes(k) })
                    ) {
                        throw 0
                    }
                }
                wordsdata = arr
                storedata('wordsdata', wordsdata)   // ← persist full replacement
                alert('Import successful! All existing words replaced.')
            } catch (e) {
                alert('Invalid JSON format or structure.')
            }
        }
        reader.readAsText(file)
    }

    input.click()
}


function importadditionalwords() {
    var input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'

    input.onchange = function(event) {
        var file = event.target.files[0]
        if (!file) return

        var reader = new FileReader()
        reader.onload = function(e) {
            try {
                var arr = JSON.parse(e.target.result)
                if (!Array.isArray(arr)) throw 0
                var keys = [
                    'word', 'confidence', 'romanization', 'type', 'pos',
                    'definition', 'notes', 'shortphrases', 'longphrases', 'sentences'
                ]
                for (var i = 0; i < arr.length; i++) {
                    var obj = arr[i]
                    var objkeys = Object.keys(obj)
                    if (
                        objkeys.length !== keys.length ||
                        !keys.every(function(k) { return objkeys.includes(k) })
                    ) {
                        throw 0
                    }
                }

                var existingmap = {}
                wordsdata.forEach(function(w, idx) {
                    existingmap[w.word] = idx
                })

                var added = 0, merged = 0

                arr.forEach(function(obj) {
                    if (existingmap.hasOwnProperty(obj.word)) {
                        var existing = wordsdata[existingmap[obj.word]]
                        ;['shortphrases','longphrases','sentences'].forEach(function(field) {
                            if (!Array.isArray(existing[field])) existing[field] = []
                            if (!Array.isArray(obj[field])) return
                            var seen = new Set(existing[field].map(e => e.thai))
                            obj[field].forEach(function(phrase) {
                                if (!seen.has(phrase.thai)) {
                                    existing[field].push(phrase)
                                    merged++
                                }
                            })
                        })
                    } else {
                        wordsdata.push(obj)
                        added++
                    }
                })

                storedata('wordsdata', wordsdata)   // ← persist merged additions
                alert('Added ' + added + ' new words. Merged ' + merged +
                      ' new phrases/sentences into existing words.')
            } catch (e) {
                alert('Invalid JSON format or structure.')
            }
        }
        reader.readAsText(file)
    }

    input.click()
}

function importquizzes() {
    var input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'

    input.onchange = function(event) {
        var file = event.target.files[0]
        if (!file) return

        var reader = new FileReader()
        reader.onload = function(e) {
            try {
                var obj = JSON.parse(e.target.result)
                var imported = Array.isArray(obj) ? obj : [obj]
                var requiredquizkeys = ['title','items']
                var requireditemkeys = ['itemnumber','thai','item','state']
                var existingtitles = quizzes.map(q => q.title)
                var newtitles = new Set(existingtitles)

                imported.forEach(function(quiz) {
                    if (!quiz || typeof quiz !== 'object') throw 0
                    var qkeys = Object.keys(quiz)
                    if (
                        qkeys.length !== 2 ||
                        !requiredquizkeys.every(k => qkeys.includes(k))
                    ) throw 0
                    if (!Array.isArray(quiz.items) || quiz.items.length === 0) throw 0
                    quiz.items.forEach(function(item) {
                        var ikeys = Object.keys(item)
                        if (
                            ikeys.length !== 4 ||
                            !requireditemkeys.every(k => ikeys.includes(k))
                        ) throw 0
                    })
                    var base = quiz.title.replace(/\s*\(\d+\)$/, '')
                    var test = base, n = 1
                    while (newtitles.has(test)) {
                        test = base + ' (' + n + ')'
                        n++
                    }
                    quiz.title = test
                    newtitles.add(test)
                })

                imported.forEach(function(q) { quizzes.push(q) })
                storedata('quizzes', quizzes)    // ← persist new quizzes
                alert('Quiz import successful! Imported ' + imported.length +
                      ' quiz' + (imported.length>1?'zes':'') + '.')
            } catch (e) {
                alert('Invalid quiz JSON format or structure.')
            }
        }
        reader.readAsText(file)
    }

    input.click()
}

function importtsvwords() {
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
                    alert('TSV appears to be empty.')
                    return
                }

                var lines = text.split(/\r?\n/).filter(function(line) {
                    return line.trim() !== ''
                })
                if (lines.length <= 1) {
                    alert('No data rows found in TSV.')
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

                if (colthai === -1) {
                    alert('TSV header must include a "THAI" column.')
                    return
                }

                var existingmap = {}
                if (Array.isArray(wordsdata)) {
                    wordsdata.forEach(function(w, idx) {
                        if (w && typeof w.word === 'string') {
                            existingmap[w.word] = idx
                        }
                    })
                } else {
                    wordsdata = []
                }

                var added = 0
                var updated = 0

                for (var j = 1; j < lines.length; j++) {
                    var row = lines[j].split('\t')
                    if (!row.length) continue

                    var thai = (row[colthai] || '').trim()
                    if (!thai) continue

                    var roman = colroman >= 0 ? (row[colroman] || '').trim() : ''
                    var definition = coldef >= 0 ? (row[coldef] || '').trim() : ''
                    var notes = colnotes >= 0 ? (row[colnotes] || '').trim() : ''

                    if (existingmap.hasOwnProperty(thai)) {
                        var existing = wordsdata[existingmap[thai]]
                        var changed = false

                        if (roman && (!existing.romanization || existing.romanization === '')) {
                            existing.romanization = roman
                            changed = true
                        }

                        if (definition) {
                            if (!existing.definition || existing.definition === '') {
                                existing.definition = definition
                                changed = true
                            } else if (existing.definition.indexOf(definition) === -1) {
                                existing.definition += ' / ' + definition
                                changed = true
                            }
                        }

                        if (notes) {
                            if (!existing.notes || existing.notes === '') {
                                existing.notes = notes
                                changed = true
                            } else if (existing.notes.indexOf(notes) === -1) {
                                existing.notes += ' | ' + notes
                                changed = true
                            }
                        }

                        if (changed) updated++
                    } else {
                        var newword = {
                            word: thai,
                            confidence: 1,
                            romanization: roman || '',
                            type: 'content',
                            pos: '',
                            definition: definition || '',
                            notes: notes || '',
                            shortphrases: [],
                            longphrases: [],
                            sentences: []
                        }
                        wordsdata.push(newword)
                        existingmap[thai] = wordsdata.length - 1
                        added++
                    }
                }

                storedata('wordsdata', wordsdata)
                alert(
                    'TSV word import complete.\n' +
                    'Added ' + added + ' new word' + (added === 1 ? '' : 's') + '.\n' +
                    'Updated ' + updated + ' existing word' + (updated === 1 ? '' : 's') + '.'
                )
            } catch (err) {
                console.error(err)
                alert('Error while importing TSV words.')
            }
        }
        reader.readAsText(file, 'utf-8')
    }

    input.click()
}

function importtsvphrases() {
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
                    alert('TSV appears to be empty.')
                    return
                }

                var lines = text.split(/\r?\n/).filter(function(line) {
                    return line.trim() !== ''
                })
                if (lines.length <= 1) {
                    alert('No data rows found in TSV.')
                    return
                }

                var header = lines[0].split('\t')

                var colanchor = -1
                var coltype = -1
                var colphrase = -1
                var colroman = -1
                var colenglish = -1
                var colnotes = -1

                for (var i = 0; i < header.length; i++) {
                    var h = header[i].trim().toUpperCase()
                    if (h.indexOf('THAI SCRIPT WORD') === 0) {
                        colanchor = i
                    } else if (h === 'TYPE') {
                        coltype = i
                    } else if (h.indexOf('THAI SCRIPT PHRASE') === 0 || h === 'THAI SCRIPT') {
                        colphrase = i
                    } else if (h === 'ROMANIZATION') {
                        colroman = i
                    } else if (h === 'ENGLISH' || h === 'DEFINITION') {
                        colenglish = i
                    } else if (h === 'NOTES') {
                        colnotes = i
                    }
                }

                if (colanchor === -1 || coltype === -1 || colroman === -1 || colenglish === -1) {
                    alert(
                        'TSV header must include at least: "Thai Script Word", "Type", ' +
                        '"Romanization", and "English" (or "Definition").'
                    )
                    return
                }

                if (!Array.isArray(wordsdata)) {
                    wordsdata = []
                }

                var existingmap = {}
                wordsdata.forEach(function(w, idx) {
                    if (w && typeof w.word === 'string') {
                        existingmap[w.word] = idx
                    }
                })

                function gettargetfield(typestr) {
                    if (!typestr) return null
                    var t = typestr.toLowerCase()
                    if (t.indexOf('short') === 0) return 'shortphrases'
                    if (t.indexOf('long') === 0) return 'longphrases'
                    if (t.indexOf('sentence') === 0) return 'sentences'
                    return null
                }

                var attachedphrases = 0
                var createdanchors = 0
                var skipped = 0

                for (var j = 1; j < lines.length; j++) {
                    var row = lines[j].split('\t')
                    if (!row.length) continue

                    var anchorthai = (row[colanchor] || '').trim()
                    if (!anchorthai) {
                        skipped++
                        continue
                    }

                    var typestr = coltype >= 0 ? (row[coltype] || '').trim() : ''
                    var field = gettargetfield(typestr)
                    if (!field) {
                        skipped++
                        continue
                    }

                    var phrasethai = ''
                    if (colphrase >= 0) {
                        phrasethai = (row[colphrase] || '').trim()
                    }
                    if (!phrasethai) {
                        // fallback: if there is no separate phrase column,
                        // use the anchor text as the phrase text as well.
                        phrasethai = anchorthai
                    }

                    var phraseroman = colroman >= 0 ? (row[colroman] || '').trim() : ''
                    var english = colenglish >= 0 ? (row[colenglish] || '').trim() : ''

                    if (colnotes >= 0) {
                        var notes = (row[colnotes] || '').trim()
                        if (notes) {
                            english = english ? (english + ' — ' + notes) : notes
                        }
                    }

                    if (!phrasethai && !phraseroman && !english) {
                        skipped++
                        continue
                    }

                    var phraseobj = {
                        thai: phrasethai,
                        romanization: phraseroman || '',
                        english: english || ''
                    }

                    var wordobj
                    if (existingmap.hasOwnProperty(anchorthai)) {
                        wordobj = wordsdata[existingmap[anchorthai]]
                    } else {
                        wordobj = {
                            word: anchorthai,
                            confidence: 1,
                            romanization: 'placeholder',
                            type: 'content',
                            pos: '',
                            definition: 'placeholder',
                            notes: '',
                            shortphrases: [],
                            longphrases: [],
                            sentences: []
                        }
                        wordsdata.push(wordobj)
                        existingmap[anchorthai] = wordsdata.length - 1
                        createdanchors++
                    }

                    if (!Array.isArray(wordobj[field])) {
                        wordobj[field] = []
                    }

                    var exists = wordobj[field].some(function(p) {
                        if (!p) return false
                        if (p.thai && phraseobj.thai && p.thai === phraseobj.thai) return true
                        if (p.romanization && phraseobj.romanization &&
                            p.romanization === phraseobj.romanization) return true
                        return false
                    })

                    if (exists) {
                        skipped++
                        continue
                    }

                    wordobj[field].push(phraseobj)
                    attachedphrases++
                }

                storedata('wordsdata', wordsdata)

                alert(
                    'TSV phrase import complete.\n' +
                    'Attached ' + attachedphrases + ' phrase' + (attachedphrases === 1 ? '' : 's') + '.\n' +
                    'Created ' + createdanchors + ' new anchor word' + (createdanchors === 1 ? '' : 's') + '.\n' +
                    'Skipped ' + skipped + ' row' + (skipped === 1 ? '' : 's') + '.'
                )
            } catch (err) {
                console.error(err)
                alert('Error while importing TSV phrases.')
            }
        }

        reader.readAsText(file, 'utf-8')
    }

    input.click()
}
