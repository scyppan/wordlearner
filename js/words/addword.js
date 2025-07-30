
function addword() {
    const placeholderbase = 'ตัวยึดตำแหน่ง'
    const romanbase       = 'placeholder'
    const count = 1 + wordsdata.filter(w =>
        (w.word || '').startsWith(placeholderbase)
    ).length

    const newword = {
        word:           placeholderbase + (count>1?count:''),
        confidence:     1,
        romanization:   romanbase + (count>1?count:''),
        type:           'content',
        pos:            '',
        definition:     '',
        notes:          '',
        shortphrases:   [],
        longphrases:    [],
        sentences:      []
    }

    wordsdata.push(newword)
    storedata('wordsdata', wordsdata)
    showworddetails(newword)
    searchbar(document.getElementById('word-list'))
}

