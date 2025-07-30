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

