function buildQuiz(quizTitle, quizBuilderInputs, wordsData) {
  let quizItems = [];
  let itemNumber = 1;

  for (let conf = 0; conf <= 10; conf++) {
    ['word', 'shortphrase', 'longphrase', 'sentence'].forEach(type => {
      const key = `${conf}-${type}`;
      let needed = quizBuilderInputs[key] || 0;
      if (!needed) return;

      // Gather all valid candidates for this type and confidence
      let candidates = [];
      wordsData.forEach(wordObj => {
        if ((Number(wordObj.confidence) || 0) !== conf) return;

        // Word (must be non-empty)
        if (type === 'word') {
          if (wordObj.word && String(wordObj.word).trim() !== '') {
            candidates.push({ thai: wordObj.word, item: wordObj.word });
          }
        }
        // Short phrases
        if (type === 'shortphrase' && Array.isArray(wordObj.shortphrases)) {
          wordObj.shortphrases.forEach(phrase => {
            if (phrase && String(phrase).trim() !== '') {
              candidates.push({ thai: wordObj.word, item: phrase });
            }
          });
        }
        // Long phrases
        if (type === 'longphrase' && Array.isArray(wordObj.longphrases)) {
          wordObj.longphrases.forEach(phrase => {
            if (phrase && String(phrase).trim() !== '') {
              candidates.push({ thai: wordObj.word, item: phrase });
            }
          });
        }
        // Sentences
        if (type === 'sentence' && Array.isArray(wordObj.sentences)) {
          wordObj.sentences.forEach(sentence => {
            if (sentence && String(sentence).trim() !== '') {
              candidates.push({ thai: wordObj.word, item: sentence });
            }
          });
        }
      });

      // Shuffle the candidates array
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }

      // Select up to needed (only non-empty items included above)
      candidates.slice(0, needed).forEach(obj => {
        quizItems.push({
          itemNumber: itemNumber++,
          thai: obj.thai,
          item: obj.item,
          state: 'not tested'
        });
      });
    });
  }

  return {
    title: quizTitle,
    items: quizItems
  };
}
