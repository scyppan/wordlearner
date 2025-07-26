//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none needed for this module

//---------
//ENTRY FUNCTION
//---------

function buildquiz(quiztitle, quizbuilderinputs, wordsdata) {
    var quizitems = [];
    var itemnumber = 1;

    for (var conf = 0; conf <= 10; conf++) {
        var types = ['word', 'shortphrase', 'longphrase', 'sentence'];
        for (var t = 0; t < types.length; t++) {
            var type = types[t];
            var key = conf + '-' + type;
            var needed = quizbuilderinputs[key] || 0;
            if (!needed) continue;

            var candidates = [];
            for (var w = 0; w < wordsdata.length; w++) {
                var wordobj = wordsdata[w];
                if ((Number(wordobj.confidence) || 0) !== conf) continue;

                // Single word
                if (type === 'word') {
                    if (wordobj.word && String(wordobj.word).trim() !== '') {
                        candidates.push({ thai: wordobj.word, item: wordobj.word });
                    }
                }

                // Short phrases
                if (type === 'shortphrase' && Array.isArray(wordobj.shortphrases)) {
                    for (var sp = 0; sp < wordobj.shortphrases.length; sp++) {
                        var phrase = wordobj.shortphrases[sp];
                        if (phrase && String(phrase.thai).trim() !== '') {
                            candidates.push({ thai: wordobj.word, item: phrase.thai });
                        }
                    }
                }

                // Long phrases
                if (type === 'longphrase' && Array.isArray(wordobj.longphrases)) {
                    for (var lp = 0; lp < wordobj.longphrases.length; lp++) {
                        var phrase = wordobj.longphrases[lp];
                        if (phrase && String(phrase.thai).trim() !== '') {
                            candidates.push({ thai: wordobj.word, item: phrase.thai });
                        }
                    }
                }

                // Sentences
                if (type === 'sentence' && Array.isArray(wordobj.sentences)) {
                    for (var se = 0; se < wordobj.sentences.length; se++) {
                        var sentence = wordobj.sentences[se];
                        if (sentence && String(sentence.thai).trim() !== '') {
                            candidates.push({ thai: wordobj.word, item: sentence.thai });
                        }
                    }
                }
            }

            shufflearray(candidates);

            // Add up to needed items
            for (var c = 0; c < Math.min(needed, candidates.length); c++) {
                quizitems.push({
                    itemnumber: itemnumber++,
                    thai: candidates[c].thai,
                    item: candidates[c].item,
                    state: 'not tested'
                });
            }
        }
    }

    return {
        title: quiztitle,
        items: quizitems
    };
}

//---------
//MAJOR FUNCTIONS
//---------

function shufflearray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

//---------
//HELPER FUNCTIONS
//---------

// none needed

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — buildquiz() is called from other code
