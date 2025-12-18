// importexport.js

//---------
//ENTRY FUNCTION
//---------
var lessonimportmodal = null;
var lessonimportcallback = null;


function renderdata() {
  clearmaincontent();
  var main = document.querySelector("#maincontent");
  if (!main) return;

  main.innerHTML = "";

  var container = document.createElement("div");
  container.className = "data-actions-container";

  // Import group
  var importgroup = document.createElement("div");
  importgroup.className = "data-actions-group";

  var importlabel = document.createElement("div");
  importlabel.className = "data-group-label";
  importlabel.textContent = "Import";
  importgroup.appendChild(importlabel);

  var importfullbtn = document.createElement("button");
  importfullbtn.id = "import-full-set-btn";
  importfullbtn.textContent = "Full Set";
  importfullbtn.title =
    "Import an entire dataset of lessons/items (replaces current full set).";
  importfullbtn.onclick = importfullset;
  importgroup.appendChild(importfullbtn);

  var importlessonbtn = document.createElement("button");
  importlessonbtn.id = "import-lesson-btn";
  importlessonbtn.textContent = "Lesson";
  importlessonbtn.title = "Import data for a single lesson.";
  importlessonbtn.onclick = importlesson;
  importgroup.appendChild(importlessonbtn);

  var removeitembtn = document.createElement("button");
  removeitembtn.id = "remove-dataset-item-btn";
  removeitembtn.textContent = "Remove item";
  removeitembtn.title =
    "Remove an item by THAI from lessons (fullset) and itemsdata, and also clear it from the quiz planner.";
  removeitembtn.onclick = removedatasetitem;
  importgroup.appendChild(removeitembtn);

  // Export group
  var exportgroup = document.createElement("div");
  exportgroup.className = "data-actions-group";

  var exportlabel = document.createElement("div");
  exportlabel.className = "data-group-label";
  exportlabel.textContent = "Export";
  exportgroup.appendChild(exportlabel);

  var exportfullbtn = document.createElement("button");
  exportfullbtn.id = "export-full-set-btn";
  exportfullbtn.textContent = "Full Set";
  exportfullbtn.title = "Export the entire lesson/item dataset.";
  exportfullbtn.onclick = exportfullset;
  exportgroup.appendChild(exportfullbtn);

  container.appendChild(importgroup);
  container.appendChild(exportgroup);

  main.appendChild(container);
}


//---------
//MAJOR FUNCTIONS
//---------

function importfullset() {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";

  input.onchange = function (event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var parsed = JSON.parse(e.target.result);

        if (!Array.isArray(parsed)) {
          throw new Error("Top-level JSON must be an array (fullset).");
        }

        var cleaned = [];
        parsed.forEach(function (lessonraw, idx) {
          if (!lessonraw || typeof lessonraw !== "object") return;

          // always keep lessonnumber as a string
          var lessonnumberraw = lessonraw.lessonnumber;
          var lessonnumber = "";

          if (typeof lessonnumberraw === "string") {
            lessonnumber = lessonnumberraw.trim() || String(idx + 1);
          } else if (
            typeof lessonnumberraw === "number" &&
            !isNaN(lessonnumberraw)
          ) {
            lessonnumber = String(lessonnumberraw);
          } else {
            lessonnumber = String(idx + 1);
          }

          var lessonname =
            typeof lessonraw.lessonname === "string"
              ? lessonraw.lessonname
              : "Lesson " + (idx + 1);

          var items = Array.isArray(lessonraw.items) ? lessonraw.items : [];

          var cleaneditems = items.map(function (it) {
            var thai = it && typeof it.thai === "string" ? it.thai : "";
            var romanization =
              it && typeof it.romanization === "string" ? it.romanization : "";
            var definition =
              it && typeof it.definition === "string" ? it.definition : "";
            var notes = it && typeof it.notes === "string" ? it.notes : "";

            var roots = [];
            if (it && Array.isArray(it.roots)) {
              roots = it.roots
                .map(function (r) {
                  return typeof r === "string" ? r.trim() : "";
                })
                .filter(function (r) {
                  return r !== "";
                });
            } else if (it && typeof it.roots === "string") {
              roots = it.roots
                .split(",")
                .map(function (r) {
                  return r.trim();
                })
                .filter(function (r) {
                  return r !== "";
                });
            }

            // keep progress fields if present
            var confidence =
              typeof it.confidence === "number" ? it.confidence : 0;
            var attempts = typeof it.attempts === "number" ? it.attempts : 0;
            var correct = typeof it.correct === "number" ? it.correct : 0;

            return {
              thai: thai,
              romanization: romanization,
              definition: definition,
              notes: notes,
              roots: roots,
              confidence: confidence,
              attempts: attempts,
              correct: correct,
            };
          });

          cleaned.push({
            lessonnumber: lessonnumber, // string
            lessonname: lessonname,
            items: cleaneditems,
          });
        });

        if (!Array.isArray(cleaned) || cleaned.length === 0) {
          throw new Error("No valid lessons/items found in JSON.");
        }

        if (typeof fullset === "undefined") {
          fullset = [];
        }

        fullset = cleaned;
        if (typeof storedata === "function") {
          storedata("fullset", fullset);
        }

        var totalitems = fullset.reduce(function (sum, l) {
          return sum + (Array.isArray(l.items) ? l.items.length : 0);
        }, 0);

        showquizstatusmodal(
          "Full set import complete.\n" +
            "Lessons: " +
            fullset.length +
            "\n" +
            "Total items: " +
            totalitems
        );
      } catch (err) {
        console.error(err);
        showquizstatusmodal("Invalid Full Set JSON format or structure.");
      }
    };

    reader.readAsText(file, "utf-8");
  };

  input.click();
}

function exportfullset() {
  if (
    typeof fullset === "undefined" ||
    !Array.isArray(fullset) ||
    !fullset.length
  ) {
    showquizstatusmodal("No full set data to export.");
    return;
  }

  var data = fullset;

  var dataStr = JSON.stringify(data, null, 2);
  var blob = new Blob([dataStr], { type: "application/json" });
  var url = URL.createObjectURL(blob);

  var now = new Date();
  var yy = String(now.getFullYear()).slice(2);
  var mm = String(now.getMonth() + 1).padStart(2, "0");
  var dd = String(now.getDate()).padStart(2, "0");
  var filename = "Thai Full Set - " + yy + "." + mm + "." + dd + ".json";

  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  var totalitems = fullset.reduce(function (sum, l) {
    return sum + (Array.isArray(l.items) ? l.items.length : 0);
  }, 0);

  showquizstatusmodal(
    "Exported full set.\n" +
      "Lessons: " +
      fullset.length +
      "\n" +
      "Total items: " +
      totalitems
  );
}

function showlessonimportmodal(defaultnum, defaultname, callback) {
  lessonimportcallback = callback

  if (!lessonimportmodal) {
    lessonimportmodal = document.createElement('div')
    lessonimportmodal.id = 'lesson-import-modal'
    lessonimportmodal.className = 'import-modal'

    var dialog = document.createElement('div')
    dialog.className = 'import-modal-dialog'

    var header = document.createElement('div')
    header.className = 'import-modal-header'

    var title = document.createElement('span')
    title.className = 'import-modal-title'
    title.textContent = 'Import lesson'

    var closebtn = document.createElement('button')
    closebtn.type = 'button'
    closebtn.className = 'import-modal-close'
    closebtn.textContent = '×'

    header.appendChild(title)
    header.appendChild(closebtn)

    var body = document.createElement('div')
    body.className = 'import-modal-body'

    var row = document.createElement('div')
    row.className = 'lesson-import-row'

    var numfieldwrap = document.createElement('div')
    numfieldwrap.className = 'lesson-import-field lesson-import-number-field'

    var numlabel = document.createElement('label')
    numlabel.htmlFor = 'lesson-import-number'
    numlabel.textContent = 'Lesson number'

    var numinput = document.createElement('input')
    numinput.id = 'lesson-import-number'
    numinput.type = 'text'   // allow values like "0.0.0", "25.10.215"

    numfieldwrap.appendChild(numlabel)
    numfieldwrap.appendChild(numinput)

    var namefieldwrap = document.createElement('div')
    namefieldwrap.className = 'lesson-import-field lesson-import-name-field'

    var namelabel = document.createElement('label')
    namelabel.htmlFor = 'lesson-import-name'
    namelabel.textContent = 'Lesson name'

    var nameinput = document.createElement('input')
    nameinput.id = 'lesson-import-name'
    nameinput.type = 'text'

    namefieldwrap.appendChild(namelabel)
    namefieldwrap.appendChild(nameinput)

    row.appendChild(numfieldwrap)
    row.appendChild(namefieldwrap)
    body.appendChild(row)

    var footer = document.createElement('div')
    footer.className = 'import-modal-footer'

    var cancelbtn = document.createElement('button')
    cancelbtn.type = 'button'
    cancelbtn.className = 'lesson-import-cancel'
    cancelbtn.textContent = 'Cancel'

    var okbtn = document.createElement('button')
    okbtn.type = 'button'
    okbtn.className = 'lesson-import-ok'
    okbtn.textContent = 'Import lesson'

    footer.appendChild(cancelbtn)
    footer.appendChild(okbtn)

    dialog.appendChild(header)
    dialog.appendChild(body)
    dialog.appendChild(footer)
    lessonimportmodal.appendChild(dialog)
    document.body.appendChild(lessonimportmodal)

    function hidemodal() {
      lessonimportmodal.classList.remove('is-open')
      lessonimportcallback = null
    }

    function handlekey(e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        okbtn.click()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        cancelbtn.click()
      }
    }

    closebtn.addEventListener('click', function () {
      hidemodal()
    })

    cancelbtn.addEventListener('click', function () {
      hidemodal()
    })

    okbtn.addEventListener('click', function () {
      if (!lessonimportcallback) {
        hidemodal()
        return
      }

      var numfield = document.getElementById('lesson-import-number')
      var namefield = document.getElementById('lesson-import-name')

      var rawnum = (numfield.value || '').trim()
      var defnum = (numfield.getAttribute('data-default') || '').trim()

      // keep lessonnumber as a string (e.g., "0.0.0", "25.10.215")
      var numval = rawnum || defnum || '0'

      var nameval = (namefield.value || '').trim()
      if (!nameval) {
        nameval = namefield.getAttribute('data-default') || 'New lesson'
      }

      var cb = lessonimportcallback
      lessonimportcallback = null
      hidemodal()
      cb(numval, nameval)
    })

    // key handler on the modal (works for both inputs)
    lessonimportmodal.addEventListener('keydown', handlekey)
  }

  var numinputnode = document.getElementById('lesson-import-number')
  var nameinputnode = document.getElementById('lesson-import-name')

  var effnumstr
  if (typeof defaultnum === 'string') {
    effnumstr = defaultnum
  } else if (typeof defaultnum === 'number' && !isNaN(defaultnum)) {
    effnumstr = String(defaultnum)
  } else {
    effnumstr = ''
  }

  numinputnode.value = effnumstr
  numinputnode.setAttribute('data-default', effnumstr)

  nameinputnode.value = defaultname || 'New lesson'
  nameinputnode.setAttribute('data-default', defaultname || 'New lesson')

  lessonimportmodal.classList.add('is-open')

  numinputnode.focus()
  numinputnode.select()
}

function importlesson() {
  var input = document.createElement('input')
  input.type = 'file'
  input.accept = '.tsv,text/tab-separated-values'

  input.onchange = function (event) {
    var file = event.target.files[0]
    if (!file) return

    var reader = new FileReader()
    reader.onload = function (e) {
      try {
        var text = e.target.result
        if (!text || !text.trim()) {
          showquizstatusmodal('TSV appears to be empty.')
          return
        }

        var lines = text.split(/\r?\n/).filter(function (line) {
          return line.trim() !== ''
        })
        if (lines.length <= 1) {
          showquizstatusmodal('No data rows found in TSV.')
          return
        }

        var header = lines[0].split('\t')
        var colthai = -1
        var colroman = -1
        var coldef = -1
        var colnotes = -1
        var colroots = -1

        for (var i = 0; i < header.length; i++) {
          var h = header[i].trim().toUpperCase()
          if (h === 'THAI') colthai = i
          else if (h === 'ROMANIZATION') colroman = i
          else if (h === 'DEFINITION') coldef = i
          else if (h === 'NOTES') colnotes = i
          else if (h === 'ROOTS' || h === 'ROOT') colroots = i
        }

        if (colthai === -1 || colroman === -1 || coldef === -1) {
          showquizstatusmodal('TSV header must include "THAI", "ROMANIZATION", and "DEFINITION" columns.')
          return
        }

        if (!Array.isArray(fullset)) {
          fullset = []
        }

        // existing items by thai from lessons before this import
        var existingbythai = {}
        for (var li = 0; li < fullset.length; li++) {
          var lesson0 = fullset[li]
          if (!lesson0 || !Array.isArray(lesson0.items)) continue
          for (var ii = 0; ii < lesson0.items.length; ii++) {
            var item0 = lesson0.items[ii]
            if (!item0 || typeof item0.thai !== 'string') continue
            var key0 = item0.thai.trim()
            if (!key0) continue
            if (!existingbythai[key0]) {
              existingbythai[key0] = item0
            }
          }
        }

        // canonical items (existing + new from this TSV), keyed by thai
        var canonicalbythai = {}
        for (var key in existingbythai) {
          if (Object.prototype.hasOwnProperty.call(existingbythai, key)) {
            canonicalbythai[key] = existingbythai[key]
          }
        }

        function mergefields(target, thai, roman, definition, notes, rootslist) {
          if (!target) return

          if (roman && (!target.romanization || target.romanization === '')) {
            target.romanization = roman
          }

          if (definition) {
            if (!target.definition || target.definition === '') {
              target.definition = definition
            } else if (target.definition.indexOf(definition) === -1) {
              target.definition += ' / ' + definition
            }
          }

          if (notes) {
            if (!target.notes || target.notes === '') {
              target.notes = notes
            } else if (target.notes.indexOf(notes) === -1) {
              target.notes += ' | ' + notes
            }
          }

          if (!Array.isArray(target.roots)) {
            target.roots = []
          }

          if (thai && target.roots.indexOf(thai) === -1) {
            target.roots.push(thai)
          }

          if (Array.isArray(rootslist) && rootslist.length) {
            for (var ri = 0; ri < rootslist.length; ri++) {
              var raw = rootslist[ri]
              if (typeof raw !== 'string') continue
              var trimmed = raw.trim()
              if (!trimmed) continue
              if (target.roots.indexOf(trimmed) === -1) {
                target.roots.push(trimmed)
              }
            }
          }
        }

        var items = []
        var duplicatewordset = {}
        var duplicatewordlabels = []

        var rootsmentioned = {}     // rootthai -> true
        var rootsources = {}        // rootthai -> { anchorthai, anchorroman }
        var importedthaimap = {}    // thai in this TSV

        for (var r = 1; r < lines.length; r++) {
          var row = lines[r].split('\t')
          if (!row.length) continue

          var thai = (row[colthai] || '').trim()
          if (!thai) continue
          importedthaimap[thai] = true

          var roman = (colroman >= 0 ? row[colroman] : '').trim()
          var definition = (coldef >= 0 ? row[coldef] : '').trim()
          var notes = colnotes >= 0 ? (row[colnotes] || '').trim() : ''

          var rootslist = []

          if (colroots >= 0) {
            var rootsraw = (row[colroots] || '').trim()
            if (rootsraw) {
              var parts = rootsraw.split(/[;,]/)
              for (var pi = 0; pi < parts.length; pi++) {
                var part = parts[pi]
                if (typeof part !== 'string') continue
                var rt = part.trim()
                if (!rt) continue

                var rtupper = rt.toUpperCase()
                if (rtupper === 'ROOTS' || rtupper === 'ROOT') {
                  continue
                }

                rootslist.push(rt)
                rootsmentioned[rt] = true

                if (!rootsources[rt]) {
                  rootsources[rt] = {
                    anchorthai: thai,
                    anchorroman: roman
                  }
                }
              }
            }
          }

          if (rootslist.indexOf(thai) === -1) {
            rootslist.push(thai)
          }

          var canonical = canonicalbythai[thai]

          if (!canonical) {
            canonical = {
              thai: thai,
              romanization: roman || '',
              definition: definition || '',
              notes: notes || '',
              roots: [],
              confidence: 0,
              attempts: 0,
              correct: 0
            }
            canonicalbythai[thai] = canonical
            mergefields(canonical, thai, roman, definition, notes, rootslist)
          } else {
            mergefields(canonical, thai, roman, definition, notes, rootslist)

            if (Object.prototype.hasOwnProperty.call(existingbythai, thai) && !duplicatewordset[thai]) {
              duplicatewordset[thai] = true
              var labelroman = canonical.romanization || roman
              var wordlabel = labelroman
                ? thai + ' (' + labelroman + ')'
                : thai
              duplicatewordlabels.push(wordlabel)
            }
          }

          if (!Array.isArray(canonical.roots)) {
            canonical.roots = []
          }
          if (canonical.roots.indexOf(thai) === -1) {
            canonical.roots.push(thai)
          }

          if (items.indexOf(canonical) === -1) {
            items.push(canonical)
          }
        }

        if (items.length === 0) {
          showquizstatusmodal('No valid items found in TSV.')
          return
        }

        // build detailed list of roots that are not in existing items nor in this TSV word set
        var unknownrootentries = []
        var rootsmissinglines = []

        for (var rootkey in rootsmentioned) {
          if (!Object.prototype.hasOwnProperty.call(rootsmentioned, rootkey)) continue

          // skip if root already existed before import
          if (Object.prototype.hasOwnProperty.call(existingbythai, rootkey)) {
            continue
          }

          // skip if root itself is one of the items in this imported TSV
          if (Object.prototype.hasOwnProperty.call(importedthaimap, rootkey)) {
            continue
          }

          var source = rootsources[rootkey] || { anchorthai: rootkey, anchorroman: '' }
          var anchorthai = source.anchorthai || rootkey
          var anchorroman = source.anchorroman || ''

          // try to fill anchor roman from canonical if missing
          if (!anchorroman && canonicalbythai[anchorthai] && typeof canonicalbythai[anchorthai].romanization === 'string') {
            anchorroman = canonicalbythai[anchorthai].romanization
          }

          unknownrootentries.push({
            root: rootkey,
            anchorthai: anchorthai,
            anchorroman: anchorroman
          })

          var anchorlabel = anchorroman
            ? anchorthai + ' (' + anchorroman + ')'
            : anchorthai

          rootsmissinglines.push(
            'Root: ' + rootkey +
            ' in item ' + anchorlabel +
            ' not found in existing items nor in this word set.'
          )
        }

        // ---- NEW: parse lesson number/name from filename ----
        var defaultnum = null
        var defaultname = null

        if (file && typeof file.name === 'string') {
          var fname = file.name
          var base = fname.replace(/\.[^.]+$/, '') // strip last extension only
          base = base.trim()

          // pattern: "0.0.0 - Greetings Vocab"
          var m = base.match(/^([0-9]+(?:\.[0-9]+)*)\s*-\s*(.+)$/)
          if (m) {
            defaultnum = m[1].trim()
            defaultname = m[2].trim()
          } else if (base) {
            // fallback: just use whole filename (no extension) as lesson name
            defaultname = base
          }
        }

        // if no explicit number from filename, fall back to numeric increment
        if (defaultnum === null) {
          defaultnum = 1
          if (fullset.length > 0) {
            var maxnum = 0
            for (var j = 0; j < fullset.length; j++) {
              var lnraw = fullset[j] ? fullset[j].lessonnumber : null
              var ln = parseInt(lnraw, 10)
              if (!isNaN(ln) && ln > maxnum) maxnum = ln
            }
            if (maxnum > 0) {
              defaultnum = maxnum + 1
            }
          }
        }

        if (!defaultname) {
          defaultname = 'New lesson'
        }
        // -----------------------------------------------------

        var duplicatemessage = ''
        if (duplicatewordlabels.length > 0) {
          duplicatemessage =
            'The following ' + duplicatewordlabels.length + ' item' +
            (duplicatewordlabels.length > 1 ? 's already exist' : ' already exists') +
            ' in your dataset. Existing records and this lesson item will be updated ' +
            'to include any new definition/notes information:\n' +
            duplicatewordlabels.join(', ')
        }

        var rootsmissingmessage = ''
        if (rootsmissinglines.length > 0) {
          rootsmissingmessage =
            'These roots are not currently present in the existing items nor in this word set:\n' +
            rootsmissinglines.join('\n')
        }

        showlessonimportmodal(defaultnum, defaultname, function (lessonnumber, lessonname) {
          var lesson = {
            lessonnumber: String(lessonnumber),  // store as string
            lessonname: lessonname,
            items: items
          }

          fullset.push(lesson)

          fullset.sort(function (a, b) {
            var an = parseInt(a && a.lessonnumber, 10)
            var bn = parseInt(b && b.lessonnumber, 10)

            if (isNaN(an) && isNaN(bn)) return 0
            if (isNaN(an)) return 1
            if (isNaN(bn)) return -1
            return an - bn
          })

          if (typeof storedata === 'function') {
            storedata('fullset', fullset)
          }

          var basemessage =
            'Lesson import complete.\n' +
            'Lesson ' + lessonnumber + ': ' + lessonname + '\n' +
            'Items added to this lesson: ' + items.length

          if (duplicatewordlabels.length > 0) {
            basemessage +=
              '\n\nDuplicates detected and merged for:\n' +
              duplicatewordlabels.join(', ')
          }

          if (rootsmissingmessage) {
            basemessage +=
              '\n\n' + rootsmissingmessage
          }

          showquizstatusmodal(basemessage)

          if (typeof renderlessonspanel === 'function') {
            renderlessonspanel()
          }
        })

        // IMPORTANT: reset notes in the modal body before adding new ones,
        // so cancelling + reuploading starts with a clean slate.
        var modal = document.getElementById('lesson-import-modal')
        if (modal) {
          var body = modal.querySelector('.import-modal-body')
          if (body) {
            var olddup = body.querySelector('.lesson-import-duplicates')
            if (olddup && olddup.parentNode) {
              olddup.parentNode.removeChild(olddup)
            }

            var oldroots = body.querySelector('.lesson-import-missing-roots')
            if (oldroots && oldroots.parentNode) {
              oldroots.parentNode.removeChild(oldroots)
            }

            if (duplicatemessage) {
              var dupnote = document.createElement('div')
              dupnote.className = 'lesson-import-duplicates'
              dupnote.textContent = duplicatemessage
              body.appendChild(dupnote)
            }

            if (unknownrootentries.length > 0) {
              var rootsnote = document.createElement('div')
              rootsnote.className = 'lesson-import-missing-roots'

              var title = document.createElement('div')
              title.textContent = 'These roots are not currently present in the existing items nor in this word set:'
              rootsnote.appendChild(title)

              var ul = document.createElement('ul')

              for (var ur = 0; ur < unknownrootentries.length; ur++) {
                var entry = unknownrootentries[ur]
                var anchorlabel = entry.anchorroman
                  ? entry.anchorthai + ' (' + entry.anchorroman + ')'
                  : entry.anchorthai

                var liroot = document.createElement('li')
                liroot.textContent =
                  'Root: ' + entry.root +
                  ' in item ' + anchorlabel +
                  ' not found in existing items nor in this word set.'
                ul.appendChild(liroot)
              }

              rootsnote.appendChild(ul)
              body.appendChild(rootsnote)
            }
          }
        }
      } catch (err) {
        console.error(err)
        showquizstatusmodal('Error while importing Lesson TSV.')
      }
    }

    reader.readAsText(file, 'utf-8')
  }

  input.click()
}



function importitemupdates() {
  if (typeof fullset === 'undefined' || !Array.isArray(fullset) || !fullset.length) {
    if (typeof showquizstatusmodal === 'function') {
      showquizstatusmodal('No dataset loaded. Import a Full Set first.')
    }
    return
  }

  var input = document.createElement('input')
  input.type = 'file'
  input.accept = '.tsv,text/tab-separated-values'

  input.onchange = function (event) {
    var file = event.target.files[0]
    if (!file) return

    var reader = new FileReader()
    reader.onload = function (e) {
      try {
        var text = e.target.result
        if (!text || !text.trim()) {
          if (typeof showquizstatusmodal === 'function') {
            showquizstatusmodal('TSV appears to be empty.')
          }
          return
        }

        var lines = text.split(/\r?\n/).filter(function (line) {
          return line.trim() !== ''
        })

        if (lines.length < 2) {
          if (typeof showquizstatusmodal === 'function') {
            showquizstatusmodal('No data rows found in TSV.')
          }
          return
        }

        var headercells = lines[0].split('\t')
        var cols = parseupdatecolumns(headercells)

        if (cols.colthai === -1) {
          if (typeof showquizstatusmodal === 'function') {
            showquizstatusmodal('TSV header must include "THAI".')
          }
          return
        }

        if (cols.coldef === -1 && cols.colnotes === -1 && cols.colroman === -1) {
          if (typeof showquizstatusmodal === 'function') {
            showquizstatusmodal('TSV must include at least one of "DEFINITION", "NOTES", or "ROMANIZATION".')
          }
          return
        }

        var index = buildthaiindex(fullset)

        var updatedrows = 0
        var updateditems = 0
        var notfound = 0
        var notfoundlist = []
        var skipped = 0

        for (var r = 1; r < lines.length; r++) {
          var row = lines[r].split('\t')
          if (!row || !row.length) continue

          var thai = getcell(row, cols.colthai)
          if (!thai) {
            skipped++
            continue
          }

          var def = cols.coldef >= 0 ? getcell(row, cols.coldef) : ''
          var notes = cols.colnotes >= 0 ? getcell(row, cols.colnotes) : ''
          var roman = cols.colroman >= 0 ? getcell(row, cols.colroman) : ''

          // no patch content in this row
          if (!def && !notes && !roman) {
            skipped++
            continue
          }

          var matches = index[thai]
          if (!matches || !matches.length) {
            notfound++
            if (notfoundlist.length < 25) notfoundlist.push(thai)
            continue
          }

          updatedrows++

          for (var i = 0; i < matches.length; i++) {
            var item = matches[i]
            if (!item || typeof item !== 'object') continue

            // only overwrite fields that are actually provided (non-empty)
            if (def) item.definition = def
            if (notes) item.notes = notes
            if (roman) item.romanization = roman

            updateditems++
          }
        }

        if (typeof storedata === 'function') {
          storedata('fullset', fullset)
        }

        var msg =
          'Hotfix applied.\n' +
          'Rows applied: ' + updatedrows + '\n' +
          'Items updated (including duplicates across lessons): ' + updateditems + '\n' +
          'Not found: ' + notfound + '\n' +
          'Skipped (blank/no patch content): ' + skipped

        if (notfoundlist.length) {
          msg += '\n\nFirst missing THAI values:\n' + notfoundlist.join(', ')
          if (notfound > notfoundlist.length) msg += ' ...'
        }

        if (typeof showquizstatusmodal === 'function') {
          showquizstatusmodal(msg)
        }

        // optional: refresh current view so you immediately see patched text
        if (typeof renderlessonspanel === 'function') {
          renderlessonspanel()
        }
      } catch (err) {
        console.error(err)
        if (typeof showquizstatusmodal === 'function') {
          showquizstatusmodal('Error while importing hotfix TSV.')
        }
      }
    }

    reader.readAsText(file, 'utf-8')
  }

  input.click()
}


function parseupdatecolumns(headercells) {
  var cols = { colthai: -1, coldef: -1, colnotes: -1, colroman: -1 }

  for (var i = 0; i < headercells.length; i++) {
    var h = String(headercells[i] || '').trim().toUpperCase()
    if (h === 'THAI') cols.colthai = i
    else if (h === 'DEFINITION') cols.coldef = i
    else if (h === 'NOTES') cols.colnotes = i
    else if (h === 'ROMANIZATION') cols.colroman = i
  }

  return cols
}

function buildthaiindex(fullsetarr) {
  var index = {}

  for (var li = 0; li < fullsetarr.length; li++) {
    var lesson = fullsetarr[li]
    if (!lesson || !Array.isArray(lesson.items)) continue

    for (var ii = 0; ii < lesson.items.length; ii++) {
      var item = lesson.items[ii]
      if (!item || typeof item.thai !== 'string') continue

      var thai = item.thai.trim()
      if (!thai) continue

      if (!index[thai]) index[thai] = []
      index[thai].push(item)
    }
  }

  return index
}

function getcell(row, idx) {
  if (idx < 0) return ''
  if (!row || idx >= row.length) return ''
  return String(row[idx] || '').trim()
}

//---------
//MAJOR FUNCTIONS
//---------

// removes an item from the dataset so it won't appear anywhere
// deletes by THAI across ALL lessons (global delete)
function deleteitemfromdataset(thai, romanization) {
  var key = normalizethai(thai)
  if (!key) return

  var confirmtext =
    'Delete this item from the dataset?\n\n' +
    key +
    (romanization ? ' (' + romanization + ')' : '') +
    '\n\nThis removes it from ALL lessons. It can also purge it from existing quizzes.'

  if (!window.confirm(confirmtext)) return

  if (typeof fullset === 'undefined' || !Array.isArray(fullset) || !fullset.length) {
    if (typeof showquizstatusmodal === 'function') {
      showquizstatusmodal('No dataset loaded.')
    }
    return
  }

  var result = {
    removedfromlessons: 0,
    lessonsaffected: 0,
    removedfromquizplan: 0,
    quizzesaffected: 0,
    removedfromquizzes: 0
  }

  removeitemfromfullsetbythai(key, result)
  removeitemfromquizplanbythai(key, result)

  // optional but recommended: purge from already-produced quizzes too
  removeitemfromquizzesbythai(key, result)

  if (typeof storedata === 'function') {
    storedata('fullset', fullset)
    if (typeof quizzes !== 'undefined' && Array.isArray(quizzes)) {
      storedata('quizzes', quizzes)
    }
  }

  if (typeof showquizstatusmodal === 'function') {
    var msg =
      'Item deleted.\n\n' +
      'Removed from lessons: ' + result.removedfromlessons + '\n' +
      'Lessons affected: ' + result.lessonsaffected + '\n' +
      'Removed from quiz planner: ' + result.removedfromquizplan + '\n' +
      'Quizzes affected: ' + result.quizzesaffected + '\n' +
      'Removed from quizzes: ' + result.removedfromquizzes
    showquizstatusmodal(msg)
  }

  // refresh whatever is currently visible (safe calls)
  if (typeof renderlessonspanel === 'function') renderlessonspanel()
  if (typeof refreshquizpanel === 'function') refreshquizpanel()
  if (typeof renderquizzespanel === 'function') renderquizzespanel()
}


//---------
//HELPER FUNCTIONS
//---------

function normalizethai(value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function getitemthai(item) {
  if (!item || typeof item !== 'object') return ''
  if (typeof item.thai === 'string') return item.thai.trim()
  if (typeof item.word === 'string') return item.word.trim()
  if (typeof item.item === 'string') return item.item.trim()
  return ''
}

function removeitemfromfullsetbythai(key, result) {
  if (!Array.isArray(fullset)) return

  for (var li = 0; li < fullset.length; li++) {
    var lesson = fullset[li]
    if (!lesson || !Array.isArray(lesson.items) || !lesson.items.length) continue

    var before = lesson.items.length
    var kept = []

    for (var ii = 0; ii < lesson.items.length; ii++) {
      var it = lesson.items[ii]
      var itthai = getitemthai(it)
      if (!itthai) continue

      if (itthai === key) {
        result.removedfromlessons++
      } else {
        kept.push(it)
      }
    }

    if (kept.length !== before) {
      lesson.items = kept
      result.lessonsaffected++
    }
  }
}

function removeitemfromquizplanbythai(key, result) {
  if (typeof quizplan === 'undefined' || !Array.isArray(quizplan) || !quizplan.length) return

  var kept = []
  for (var i = 0; i < quizplan.length; i++) {
    var entry = quizplan[i]
    if (!entry || typeof entry !== 'object') {
      kept.push(entry)
      continue
    }

    if (entry.kind === 'item' && normalizethai(entry.thai) === key) {
      result.removedfromquizplan++
      continue
    }

    kept.push(entry)
  }

  quizplan = kept
}

function removeitemfromquizzesbythai(key, result) {
  if (typeof quizzes === 'undefined' || !Array.isArray(quizzes) || !quizzes.length) return

  for (var qi = 0; qi < quizzes.length; qi++) {
    var quiz = quizzes[qi]
    if (!quiz || !Array.isArray(quiz.items) || !quiz.items.length) continue

    var before = quiz.items.length
    var kept = []

    for (var ii = 0; ii < quiz.items.length; ii++) {
      var it = quiz.items[ii]
      var itthai = getitemthai(it)
      if (!itthai) continue

      if (itthai === key) {
        result.removedfromquizzes++
      } else {
        kept.push(it)
      }
    }

    if (kept.length !== before) {
      quiz.items = kept
      result.quizzesaffected++

      // re-number if this quiz was already prepared
      for (var j = 0; j < quiz.items.length; j++) {
        quiz.items[j].itemnumber = j + 1
      }
    }
  }
}
