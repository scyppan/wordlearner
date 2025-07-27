function importfromjson() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';

    input.onchange = function(event) {
        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var arr = JSON.parse(e.target.result);
                if (!Array.isArray(arr)) throw 0;
                var keys = [
                    'word', 'confidence', 'romanization', 'type', 'pos',
                    'definition', 'notes', 'shortphrases', 'longphrases', 'sentences'
                ];
                for (var i = 0; i < arr.length; i++) {
                    var obj = arr[i];
                    var objkeys = Object.keys(obj);
                    if (
                        objkeys.length !== keys.length ||
                        !keys.every(function(k) { return objkeys.includes(k); })
                    ) {
                        throw 0;
                    }
                }
                wordsdata = arr;
                alert('Import successful! All existing words replaced.');
            } catch (e) {
                alert('Invalid JSON format or structure.');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

function importadditionalwords() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';

    input.onchange = function(event) {
        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var arr = JSON.parse(e.target.result);
                if (!Array.isArray(arr)) throw 0;
                var keys = [
                    'word', 'confidence', 'romanization', 'type', 'pos',
                    'definition', 'notes', 'shortphrases', 'longphrases', 'sentences'
                ];
                for (var i = 0; i < arr.length; i++) {
                    var obj = arr[i];
                    var objkeys = Object.keys(obj);
                    if (
                        objkeys.length !== keys.length ||
                        !keys.every(function(k) { return objkeys.includes(k); })
                    ) {
                        throw 0;
                    }
                }

                var existingmap = {};
                wordsdata.forEach(function(w, idx) {
                    existingmap[w.word] = idx;
                });

                var added = 0, merged = 0;

                arr.forEach(function(obj) {
                    if (existingmap.hasOwnProperty(obj.word)) {
                        // Merge unique shortphrases, longphrases, sentences
                        var existing = wordsdata[existingmap[obj.word]];

                        ['shortphrases', 'longphrases', 'sentences'].forEach(function(field) {
                            if (!Array.isArray(existing[field])) existing[field] = [];
                            if (!Array.isArray(obj[field])) return;

                            // Gather all existing Thai for this section
                            var existingthai = new Set(existing[field].map(function(e) { return e.thai; }));
                            obj[field].forEach(function(phrase) {
                                if (!existingthai.has(phrase.thai)) {
                                    existing[field].push(phrase);
                                    merged++;
                                }
                            });
                        });
                    } else {
                        wordsdata.push(obj);
                        added++;
                    }
                });

                alert('Added ' + added + ' new words. Merged ' + merged + ' new phrases/sentences into existing words.');
            } catch (e) {
                alert('Invalid JSON format or structure.');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

function importquizzes() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';

    input.onchange = function(event) {
        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var obj = JSON.parse(e.target.result);

                // Normalize to array
                var importedquizzes = Array.isArray(obj) ? obj : [obj];

                var requiredquizkeys = ['title', 'items'];
                var requireditemkeys = ['itemnumber', 'thai', 'item', 'state'];

                // Gather all existing titles (set for fast lookup)
                var existingtitles = quizzes.map(function(q) { return q.title; });
                var newtitles = new Set(existingtitles);

                // Validation and unique title generation
                importedquizzes.forEach(function(quiz) {
                    if (!quiz || typeof quiz !== 'object') throw 0;

                    // Quiz must have the required keys
                    var quizkeys = Object.keys(quiz);
                    if (
                        quizkeys.length !== 2 ||
                        !requiredquizkeys.every(function(k) { return quizkeys.includes(k); })
                    ) throw 0;

                    if (!Array.isArray(quiz.items) || quiz.items.length === 0) throw 0;

                    // Check all items
                    quiz.items.forEach(function(item) {
                        if (!item || typeof item !== 'object') throw 0;
                        var itemkeys = Object.keys(item);
                        if (
                            itemkeys.length !== 4 ||
                            !requireditemkeys.every(function(k) { return itemkeys.includes(k); })
                        ) throw 0;
                    });

                    // ---- Rename if duplicate ----
                    var basetitle = quiz.title;
                    var testtitle = basetitle;
                    var n = 1;
                    var basenosuffix = basetitle.replace(/\s*\(\d+\)$/, '');

                    while (newtitles.has(testtitle)) {
                        testtitle = basenosuffix + ' (' + n + ')';
                        n++;
                    }
                    quiz.title = testtitle;
                    newtitles.add(testtitle); // Reserve it for this batch
                });

                // Add to quizzes array
                importedquizzes.forEach(function(q) {
                    quizzes.push(q);
                });

                alert('Quiz import successful! Imported ' + importedquizzes.length + ' quiz' + (importedquizzes.length > 1 ? 'zes' : '') + '.');
            } catch (e) {
                alert('Invalid quiz JSON format or structure.');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}
