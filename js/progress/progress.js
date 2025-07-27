//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

var progresscontainer = null;

//---------
//ENTRY FUNCTION
//---------

function renderprogress() {
  clearmaincontent();
  progresscontainer = document.createElement('div');
  progresscontainer.className = 'progress-container';

  progresscontainer.appendChild(buildquizsummarytable());
  progresscontainer.appendChild(buildconfidencecounttable());

  document.querySelector('#maincontent').appendChild(progresscontainer);
}

//---------
//MAJOR FUNCTIONS
//---------

function buildquizsummarytable() {
  var table = document.createElement('table');
  table.className = 'progress-quiz-table';

  var header = document.createElement('tr');
  ['quiz', 'correct', 'partial', 'incorrect', '% correct'].forEach(function (label) {
    var th = document.createElement('th');
    th.textContent = label;
    header.appendChild(th);
  });
  table.appendChild(header);

  quizzes.forEach(function (quiz, i) {
    var correct = 0;
    var partial = 0;
    var incorrect = 0;

    quiz.items.forEach(function (item) {
      if (item.state === 'correct') correct++;
      else if (item.state === 'partial') partial++;
      else if (item.state === 'incorrect') incorrect++;
    });

    var total = correct + partial + incorrect;
    var percent = total > 0 ? ((correct / total) * 100).toFixed(1) + '%' : '-';

    var row = document.createElement('tr');
    [
      quiz.title || 'quiz ' + (i + 1),
      correct,
      partial,
      incorrect,
      percent
    ].forEach(function (val) {
      var td = document.createElement('td');
      td.textContent = val;
      row.appendChild(td);
    });

    table.appendChild(row);
  });

  return table;
}

function buildconfidencecounttable() {
  var counts = {};
  wordsdata.forEach(function (word) {
    var conf = word.confidence;
    if (!counts[conf]) counts[conf] = 0;
    counts[conf]++;
  });

  var table = document.createElement('table');
  table.className = 'progress-confidence-table';

  var header = document.createElement('tr');
  ['confidence', 'count'].forEach(function (label) {
    var th = document.createElement('th');
    th.textContent = label;
    header.appendChild(th);
  });
  table.appendChild(header);

  Object.keys(counts).sort(function (a, b) {
    return parseInt(a) - parseInt(b);
  }).forEach(function (conf) {
    var row = document.createElement('tr');
    [conf, counts[conf]].forEach(function (val) {
      var td = document.createElement('td');
      td.textContent = val;
      row.appendChild(td);
    });
    table.appendChild(row);
  });

  return table;
}

//---------
//HELPER FUNCTIONS
//---------

// none

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — renderprogress() must be called from main.js when progress view is selected
