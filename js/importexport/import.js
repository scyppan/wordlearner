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
          var objKeys = Object.keys(obj);
          if (
            objKeys.length !== keys.length ||
            !keys.every(function (k) { return objKeys.includes(k); })
          ) {
            throw 0;
          }
        }
        wordsdata = arr;
        alert('Import successful!');
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
                var importedQuizzes = Array.isArray(obj) ? obj : [obj];

                var requiredQuizKeys = ['title', 'items'];
                var requiredItemKeys = ['itemNumber', 'thai', 'item', 'state'];

                // Gather all existing titles (set for fast lookup)
                var existingTitles = quizzes.map(q => q.title);
                var newTitles = new Set(existingTitles);

                // Validation and unique title generation
                importedQuizzes.forEach(function(quiz, idx) {
                    if (!quiz || typeof quiz !== 'object') throw 0;

                    // Quiz must have the required keys
                    var quizKeys = Object.keys(quiz);
                    if (
                        quizKeys.length !== 2 ||
                        !requiredQuizKeys.every(function (k) { return quizKeys.includes(k); })
                    ) throw 0;

                    if (!Array.isArray(quiz.items) || quiz.items.length === 0) throw 0;

                    // Check all items
                    quiz.items.forEach(function(item) {
                        if (!item || typeof item !== 'object') throw 0;
                        var itemKeys = Object.keys(item);
                        if (
                            itemKeys.length !== 4 ||
                            !requiredItemKeys.every(function (k) { return itemKeys.includes(k); })
                        ) throw 0;
                    });

                    // ---- Rename if duplicate ----
                    let baseTitle = quiz.title;
                    let testTitle = baseTitle;
                    let n = 1;

                    // Remove any existing (n) at the end, e.g., 'Quiz 25.07.21.001 (1)' → 'Quiz 25.07.21.001'
                    let baseNoSuffix = baseTitle.replace(/\s*\(\d+\)$/, '');

                    while (newTitles.has(testTitle)) {
                        testTitle = baseNoSuffix + ' (' + n + ')';
                        n++;
                    }
                    quiz.title = testTitle;
                    newTitles.add(testTitle); // Reserve it for this batch
                });

                // Add to quizzes array
                importedQuizzes.forEach(function(q) {
                    quizzes.push(q);
                });

                alert('Quiz import successful! Imported ' + importedQuizzes.length + ' quiz' + (importedQuizzes.length > 1 ? 'zes' : '') + '.');
            } catch (e) {
                alert('Invalid quiz JSON format or structure.');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}
