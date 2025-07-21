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
        wordsData = arr;
        alert('Import successful!');
      } catch (e) {
        alert('Invalid JSON format or structure.');
      }
    };
    reader.readAsText(file);
  };

  input.click();
}
