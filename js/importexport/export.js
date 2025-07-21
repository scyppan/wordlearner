function exporttojson() {
  var dataStr = JSON.stringify(wordsData, null, 2);
  var blob = new Blob([dataStr], {type: 'application/json'});
  var url = URL.createObjectURL(blob);

  var now = new Date();
  var yy = String(now.getFullYear()).slice(2);
  var mm = String(now.getMonth() + 1).padStart(2, '0');
  var dd = String(now.getDate()).padStart(2, '0');
  var filename = `Thai Words - ${yy}.${mm}.${dd}.json`;

  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportquizzes() {
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
        alert('No quizzes to export.');
        return;
    }

    var dataStr = JSON.stringify(quizzes, null, 2);
    var blob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);

    var now = new Date();
    var yy = String(now.getFullYear()).slice(2);
    var mm = String(now.getMonth() + 1).padStart(2, '0');
    var dd = String(now.getDate()).padStart(2, '0');
    var filename = `Thai Quizzes - ${yy}.${mm}.${dd}.json`;

    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
