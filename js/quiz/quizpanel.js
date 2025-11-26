// quizpanel.js (quiz planner + quiz production)

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// planner entries are added from the Lessons view
// each entry:
//   kind: 'range' | 'item'
//   label: string
//   lessonnumber: number | null
//   lessonname: string
//   range: 'untested'|'lowplus'|'midplus'|'highplus'|'solid'  (for kind='range')
//   itemindex: number (for kind='item')
//   thai: string       (for kind='item')
//   romanization: string (for kind='item')
var quizplan = [];

var quizstatusmodal = null;
var quizstatusbody = null;

//---------
//ENTRY FUNCTION
//---------

function renderquizpanel() {
  if (typeof clearmaincontent === "function") {
    clearmaincontent();
  }

  var main = document.getElementById("maincontent");
  if (!main) return;

  main.innerHTML = "";

  var container = document.createElement("div");
  container.id = "quiz-container";

  var header = document.createElement("div");
  header.className = "quiz-planner-header";

  var heading = document.createElement("h2");
  heading.textContent = "Quiz planner";
  header.appendChild(heading);

  var producebtn = document.createElement("button");
  producebtn.type = "button";
  producebtn.className = "quiz-produce-button";
  producebtn.textContent = "Produce quiz";
  producebtn.addEventListener("click", producequizfromplan);
  header.appendChild(producebtn);

  container.appendChild(header);

  var note = document.createElement("p");
  note.className = "quiz-intro";
  note.textContent =
    'Use the Lessons view to add item groups or individual items here, then click "Produce quiz" to build a quiz.';
  container.appendChild(note);

  var listcontainer = document.createElement("div");
  listcontainer.id = "quiz-plan-list-container";
  container.appendChild(listcontainer);

  main.appendChild(container);

  refreshquizpanel();
}

//---------
//MAJOR FUNCTIONS
//---------

function refreshquizpanel() {
  var listcontainer = document.getElementById("quiz-plan-list-container");
  if (!listcontainer) return;

  listcontainer.innerHTML = "";

  if (!Array.isArray(quizplan) || quizplan.length === 0) {
    var empty = document.createElement("p");
    empty.className = "quiz-plan-empty";
    empty.textContent =
      "No quiz selections yet. Choose ranges or items from the Lessons tab.";
    listcontainer.appendChild(empty);
    return;
  }

  var ul = document.createElement("ul");
  ul.id = "quiz-plan-list";

  quizplan.forEach(function (entry, index) {
    var li = createquizplanentryli(entry, index);
    ul.appendChild(li);
  });

  listcontainer.appendChild(ul);
}

function addquizplanentry(entry) {
  if (!entry || typeof entry !== "object") return;

  if (!Array.isArray(quizplan)) {
    quizplan = [];
  }

  quizplan.push(entry);
  refreshquizpanel();
}

function removequizplanentry(index) {
  if (!Array.isArray(quizplan)) return;
  if (index < 0 || index >= quizplan.length) return;
  quizplan.splice(index, 1);
  refreshquizpanel();
}

// build a quiz from quizplan, store into `quizzes`, and show a status modal
function producequizfromplan() {
  if (!Array.isArray(quizplan) || quizplan.length === 0) {
    showquizstatusmodal(
      "No quiz selections in planner yet.\nAdd ranges or items from the Lessons tab first."
    );
    return;
  }

  if (!Array.isArray(fullset) || fullset.length === 0) {
    showquizstatusmodal(
      "No lessons loaded.\nImport or create lessons before producing a quiz."
    );
    return;
  }

  ensurequizzesarray();

  var collected = [];
  var seen = {};

  for (var i = 0; i < quizplan.length; i++) {
    var entry = quizplan[i];
    if (!entry) continue;

    if (entry.kind === "item") {
      collectitemfromentry(entry, collected, seen);
    } else if (entry.kind === "range") {
      collectrangefromentry(entry, collected, seen);
    } else if (entry.kind === "roots") {
      collectrootsfromentry(entry, collected, seen);
    }
  }

  if (collected.length === 0) {
    showquizstatusmodal(
      "No items were found for these planner selections.\nCheck lesson progress and try again."
    );
    return;
  }

  shuffleitems(collected);

  for (var j = 0; j < collected.length; j++) {
    collected[j].itemnumber = j + 1;
    collected[j].state = "not tested";
  }

  var nextindex = quizzes.length + 1;
  var title = "Quiz " + nextindex;

  var quiz = {
    title: title,
    items: collected,
    created: Date.now(),
    prepared: false,
  };

  quizzes.push(quiz);
  storedata("quizzes", quizzes);

  // clear planner after successful quiz creation
  quizplan = [];
  refreshquizpanel();

  showquizstatusmodal(
    title +
      " created.\n\n" +
      "Items: " +
      collected.length +
      "\n" +
      "Total quizzes: " +
      quizzes.length
  );
}

//---------
//HELPER FUNCTIONS
//---------

function createquizplanentryli(entry, index) {
  var li = document.createElement("li");
  li.className = "quiz-plan-entry";
  li.setAttribute("data-quizplan-index", String(index));

  var labelspan = document.createElement("span");
  labelspan.className = "quiz-plan-label";
  labelspan.textContent =
    entry && typeof entry.label === "string"
      ? entry.label
      : "(unnamed selection)";

  var removebtn = document.createElement("button");
  removebtn.type = "button";
  removebtn.className = "quiz-plan-remove";
  removebtn.textContent = "×";
  removebtn.title = "Remove from quiz planner";

  removebtn.addEventListener("click", function (e) {
    e.stopPropagation();
    removequizplanentry(index);
  });

  li.appendChild(labelspan);
  li.appendChild(removebtn);

  return li;
}

function showquizstatusmodal(message) {
  if (!quizstatusmodal) {
    quizstatusmodal = document.createElement("div");
    quizstatusmodal.id = "quiz-status-modal";
    quizstatusmodal.className = "import-modal";

    var dialog = document.createElement("div");
    dialog.className = "import-modal-dialog";

    var header = document.createElement("div");
    header.className = "import-modal-header";

    var title = document.createElement("span");
    title.className = "import-modal-title";
    title.textContent = "Quiz planner";

    var closebtn = document.createElement("button");
    closebtn.type = "button";
    closebtn.className = "import-modal-close";
    closebtn.textContent = "×";

    header.appendChild(title);
    header.appendChild(closebtn);

    quizstatusbody = document.createElement("div");
    quizstatusbody.className = "import-modal-body";

    var footer = document.createElement("div");
    footer.className = "import-modal-footer";

    var okbtn = document.createElement("button");
    okbtn.type = "button";
    okbtn.className = "lesson-import-ok";
    okbtn.textContent = "Close";

    footer.appendChild(okbtn);

    dialog.appendChild(header);
    dialog.appendChild(quizstatusbody);
    dialog.appendChild(footer);
    quizstatusmodal.appendChild(dialog);
    document.body.appendChild(quizstatusmodal);

    function hidemodal() {
      quizstatusmodal.classList.remove("is-open");
    }

    closebtn.addEventListener("click", function () {
      hidemodal();
    });

    okbtn.addEventListener("click", function () {
      hidemodal();
    });

    quizstatusmodal.addEventListener("click", function (e) {
      if (e.target === quizstatusmodal) {
        hidemodal();
      }
    });
  }

  quizstatusbody.textContent = message || "";
  quizstatusmodal.classList.add("is-open");
}

function ensurequizzesarray() {
  if (Array.isArray(quizzes)) return;

  var stored =
    typeof retrievedata === "function" ? retrievedata("quizzes") : null;

  if (Array.isArray(stored)) {
    quizzes = stored;
  } else {
    quizzes = [];
  }
}

// given a planner entry for a single item, add it if not already present
function collectitemfromentry(entry, collected, seen) {
  var lessoninfo = findlessonforentry(entry);
  if (!lessoninfo) return;

  var lesson = lessoninfo.lesson;
  var lessonindex = lessoninfo.index;
  if (!lesson || !Array.isArray(lesson.items)) return;

  var src = null;

  if (
    typeof entry.itemindex === "number" &&
    entry.itemindex >= 0 &&
    entry.itemindex < lesson.items.length
  ) {
    src = lesson.items[entry.itemindex];
  }

  if (!src && entry.thai) {
    for (var i = 0; i < lesson.items.length; i++) {
      var candidate = lesson.items[i];
      if (candidate && candidate.thai === entry.thai) {
        src = candidate;
        break;
      }
    }
  }

  if (!src) return;

  addquizcandidate(src, lesson, lessonindex, collected, seen);
}

// given a planner entry for a range, add all matching items
function collectrangefromentry(entry, collected, seen) {
  var lessoninfo = findlessonforentry(entry);
  if (!lessoninfo) return;

  var lesson = lessoninfo.lesson;
  var lessonindex = lessoninfo.index;
  if (!lesson || !Array.isArray(lesson.items)) return;

  for (var i = 0; i < lesson.items.length; i++) {
    var src = lesson.items[i];
    if (!src) continue;

    var bucket =
      typeof getitemconfidencebucket === "function"
        ? getitemconfidencebucket(src)
        : "untested";

    if (!itemmatchesrange(bucket, entry.range)) continue;

    addquizcandidate(src, lesson, lessonindex, collected, seen);
  }
}

function addquizcandidate(srcitem, lesson, lessonindex, collected, seen) {
  var thai = srcitem.thai || srcitem.word || "";
  thai = thai ? String(thai).trim() : "";
  if (!thai) return;

  var roman = srcitem.romanization || "";
  var key = thai + "|" + roman;

  if (seen[key]) return;
  seen[key] = true;

  var quizitem = {
    thai: thai,
    romanization: roman,
    definition: srcitem.definition || "",
    notes: srcitem.notes || "",
    lessonnumber:
      typeof lesson.lessonnumber === "number" ? lesson.lessonnumber : null,
    lessonname: typeof lesson.lessonname === "string" ? lesson.lessonname : "",
    lessonindex: lessonindex,
    sourceindex: null, // optional; not currently used
    state: "not tested",
    itemnumber: 0,
  };

  collected.push(quizitem);
}

function findlessonforentry(entry) {
  if (!Array.isArray(fullset)) return null;

  var num = typeof entry.lessonnumber === "number" ? entry.lessonnumber : null;
  var name = typeof entry.lessonname === "string" ? entry.lessonname : "";

  for (var i = 0; i < fullset.length; i++) {
    var lesson = fullset[i];
    if (!lesson) continue;

    var lnum =
      typeof lesson.lessonnumber === "number" ? lesson.lessonnumber : null;
    var lname = typeof lesson.lessonname === "string" ? lesson.lessonname : "";

    if (num !== null && lnum === num && name && lname === name) {
      return { lesson: lesson, index: i };
    }

    if (num !== null && lnum === num && !name) {
      return { lesson: lesson, index: i };
    }

    if (name && lname === name && num === null) {
      return { lesson: lesson, index: i };
    }
  }

  return null;
}

function itemmatchesrange(bucket, range) {
  if (!range || !bucket) return true;

  if (range === "untested") {
    return bucket === "untested";
  }

  if (range === "lowplus") {
    return bucket === "untested" || bucket === "low";
  }

  if (range === "midplus") {
    return bucket === "untested" || bucket === "low" || bucket === "mid";
  }

  if (range === "highplus") {
    return (
      bucket === "untested" ||
      bucket === "low" ||
      bucket === "mid" ||
      bucket === "high"
    );
  }

  if (range === "solid") {
    return bucket === "solid";
  }

  return true;
}

function shuffleitems(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}

//---------
//IMMEDIATE FUNCTIONS
//---------

// none
function collectrootsfromentry(entry, collected, seen) {
  if (!entry || !entry.anchorthai) return
  if (!Array.isArray(fullset)) return

  var anchorthai = String(entry.anchorthai).trim()
  if (!anchorthai) return

  // find the canonical anchor item by thai
  var anchoritem = null
  for (var li = 0; li < fullset.length && !anchoritem; li++) {
    var lesson = fullset[li]
    if (!lesson || !Array.isArray(lesson.items)) continue
    for (var ii = 0; ii < lesson.items.length; ii++) {
      var it = lesson.items[ii]
      if (!it || typeof it.thai !== 'string') continue
      if (it.thai === anchorthai) {
        anchoritem = it
        break
      }
    }
  }

  if (!anchoritem) return

  var roots = Array.isArray(anchoritem.roots) ? anchoritem.roots : []
  if (!roots.length) return

  // normalize into a set of root strings
  var rootset = {}
  for (var r = 0; r < roots.length; r++) {
    var val = typeof roots[r] === 'string' ? roots[r].trim() : ''
    if (val) {
      rootset[val] = true
    }
  }

  if (!Object.keys(rootset).length) return

  // for every lesson/item, if its thai is one of the roots, add as quiz candidate
  for (var li2 = 0; li2 < fullset.length; li2++) {
    var lesson2 = fullset[li2]
    if (!lesson2 || !Array.isArray(lesson2.items)) continue

    for (var ii2 = 0; ii2 < lesson2.items.length; ii2++) {
      var src = lesson2.items[ii2]
      if (!src || typeof src.thai !== 'string') continue
      var t = src.thai.trim()
      if (!t || !rootset[t]) continue

      addquizcandidate(src, lesson2, li2, collected, seen)
    }
  }
}