
function createScriptElement() {
  return createInlineEditableSpan('word-script');
}

function createRomanizationElement() {
  var span = createInlineEditableSpan('word-romanization');
  span.style.marginLeft = '0.5em';
  return span;
}

function createConfidenceRating(max = 10) {
  var container = document.createElement('div');
  container.className = 'confidence-rating';
  container.dataset.max = max;

  var input = document.createElement('input');
  input.type = 'hidden';
  input.className = 'word-confidence-input';
  container.appendChild(input);

  var circles = [];
  for (var i = 1; i <= max; i++) {
    (function(val) {
      var circle = document.createElement('span');
      circle.className = 'confidence-circle';
      circle.dataset.value = val;
      circle.addEventListener('click', function() {
        container.setRating(val);
      });
      container.appendChild(circle);
      circles.push(circle);
    })(i);
  }

  container.reset = function() {
    input.value = '';
    circles.forEach(c => c.classList.remove('filled'));
  };

  container.setRating = function(val) {
    input.value = val;
    circles.forEach(c =>
      c.classList.toggle('filled', Number(c.dataset.value) <= val)
    );
    if (typeof container.onChange === 'function') {
      container.onChange(val);
    }

    setrating(container);
  };

  container.onChange = null;
  return container;
}

function setrating(container) {
  const key = container.parentElement.children[0].textContent.trim();
  const entry = wordsData.find(e => e.word === key);
  if (!entry) return;
  const val = Number(container.querySelector('input.word-confidence-input').value);
  entry.confidence = val;
}

function createHeaderSection() {
  var header = document.createElement('div');
  header.className = 'word-header';
  header.appendChild(createScriptElement());
  header.appendChild(createRomanizationElement());
  header.appendChild(createConfidenceRating(10));
  return header;
}
