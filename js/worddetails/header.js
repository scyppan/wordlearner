//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none; uses wordsdata and shared helpers from elsewhere

//---------
//ENTRY FUNCTION
//---------

function createheadersection() {
  // The ONLY function called externally for header construction.
  var header = document.createElement('div');
  header.id = 'word-header';

  var script = createscriptelement();
  var roman = createromanizationelement();
  var rating = createconfidencerating(10);

  header.appendChild(script);
  header.appendChild(roman);
  header.appendChild(rating);

  return header;
}

//---------
//MAJOR FUNCTIONS
//---------

function createscriptelement() {
  var span = createinlineeditablespan('word-script');
  span.id = 'word-script';
  return span;
}

function createromanizationelement() {
  var span = createinlineeditablespan('word-romanization');
  span.id = 'word-romanization';
  span.style.marginLeft = '0.5em';
  return span;
}

function createconfidencerating(max) {
  if (max === undefined) max = 10;

  var container = document.createElement('div');
  container.id = 'confidence-rating';
  container.dataset.max = max;

  var input = document.createElement('input');
  input.type = 'hidden';
  input.id = 'word-confidence-input';
  container.appendChild(input);

  var circles = [];
  for (var i = 1; i <= max; i++) {
    (function(val) {
      var circle = document.createElement('span');
      circle.className = 'confidence-circle';
      circle.dataset.value = val;
      circle.addEventListener('click', function() {
        changerating(val);
      });
      container.appendChild(circle);
      circles.push(circle);
    })(i);
  }

  return container;
}

//---------
//HELPER FUNCTIONS
//---------

// assumes createinlineeditablespan, wordsdata, and other dependencies are available

//---------
//IMMEDIATE FUNCTIONS
//---------
// (none; only createheadersection is called externally)
