function addword() {
    const placeholderBase = 'ตัวยึดตำแหน่ง'
    const romanBase       = 'placeholder'
    const count = 1 + wordsdata.filter(w =>
        (w.word || '').startsWith(placeholderBase)
    ).length

    const newWord = {
        word:           placeholderBase + (count>1?count:''),
        confidence:     1,
        romanization:   romanBase + (count>1?count:''),
        type:           'content',
        pos:            '',
        definition:     '',
        notes:          '',
        shortphrases:   [],
        longphrases:    [],
        sentences:      []
    }

    wordsdata.push(newWord)
    showworddetails(newWord)
    refreshWordList(wordsdata);
}