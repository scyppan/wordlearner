// requires createInlineEditableSpan from details/tools

// Factory for a repeatable section (short phrases, long phrases, sentences)
function createRepeatableSection(sectionKey, displayName) {
  var values = [];
  var onChangeCallback = null;

  // root container
  var container = document.createElement('div');
  container.className = 'word-advancement-section ' + sectionKey;

  // header with title + “+” button
  var header = document.createElement('div');
  header.className = 'advancement-header';

  var title = document.createElement('h3');
  title.textContent = displayName;
  header.appendChild(title);

  var addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'advancement-add';
  addBtn.textContent = '+';
  header.appendChild(addBtn);

  container.appendChild(header);

  // list
  var list = document.createElement('ul');
  list.className = 'advancement-list';
  container.appendChild(list);

  // click “+” → append empty entry + re‑render
  addBtn.addEventListener('click', function() {
    values.push('');
    render();
    if (onChangeCallback) onChangeCallback(values);
  });

  function render() {
    list.innerHTML = '';
    values.forEach(function(val, idx) {
      var li = document.createElement('li');
      li.className = 'advancement-item';

      // inline‑editable span
      var span = createInlineEditableSpan(sectionKey + '-item');
      span.textContent = val;
      span.onblur = function() {
        values[idx] = span.textContent.trim();
        if (onChangeCallback) onChangeCallback(values);
      };
      li.appendChild(span);

      // delete “–” button
      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'advancement-del';
      del.textContent = '-';
      del.addEventListener('click', function() {
        values.splice(idx, 1);
        render();
        if (onChangeCallback) onChangeCallback(values);
      });
      li.appendChild(del);

      list.appendChild(li);
    });
  }

  // externally set the array and update UI
  function setValue(arr) {
    values = Array.isArray(arr) ? arr.slice() : [];
    render();
  }

  // register callback when user edits/adds/deletes
  function onChange(fn) {
    onChangeCallback = fn;
  }

  return {
    container: container,
    setValue: setValue,
    onChange: onChange
  };
}
