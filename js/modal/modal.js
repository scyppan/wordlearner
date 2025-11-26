// modals-esc.js

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none


//---------
//ENTRY FUNCTION
//---------

document.addEventListener('keydown', handlemodalesc)


//---------
//MAJOR FUNCTIONS
//---------

function handlemodalesc(e) {
    var key = e.key || e.keyCode

    // support both modern and older key representations
    if (key === 'Escape' || key === 'Esc' || key === 27) {
        closeallimportmodals()
    }
}

function closeallimportmodals() {
    var modals = document.querySelectorAll('.import-modal.is-open')
    if (!modals || !modals.length) return

    modals.forEach(function(modal) {
        modal.classList.remove('is-open')
    })
}


// ---------------------------
// JS (add to modal.js)
// ---------------------------

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

var toastcontainer = null
var toastmax = 5
var toastduration = 3000   // ms on screen before fading


//---------
//MAJOR FUNCTIONS
//---------

function ensuretoastcontainer() {
  if (toastcontainer) return
  var div = document.createElement('div')
  div.className = 'toast-container'
  document.body.appendChild(div)
  toastcontainer = div
}

function showtoastmessage(message) {
  if (!message) return
  ensuretoastcontainer()

  // if the most recent toast has the same message, just reset its timer
  var last = toastcontainer.lastElementChild
  if (last && last.textContent === message) {
    if (last.dataset.timeoutid) {
      var oldid = parseInt(last.dataset.timeoutid, 10)
      if (!isNaN(oldid)) clearTimeout(oldid)
    }
    settimeoutfortoast(last)
    return
  }

  // limit stack size
  while (toastcontainer.children.length >= toastmax) {
    toastcontainer.removeChild(toastcontainer.firstChild)
  }

  var toast = document.createElement('div')
  toast.className = 'toast-message'
  toast.textContent = message

  toast.addEventListener('click', function () {
    hidetoast(toast)
  })

  toastcontainer.appendChild(toast)
  settimeoutfortoast(toast)
}

function settimeoutfortoast(toast) {
  var timeoutid = setTimeout(function () {
    hidetoast(toast)
  }, toastduration)
  toast.dataset.timeoutid = String(timeoutid)
}

function hidetoast(toast) {
  if (!toast || !toast.parentNode) return
  if (toast.classList.contains('toast-message-hide')) return

  toast.classList.add('toast-message-hide')

  if (toast.dataset.timeoutid) {
    var id = parseInt(toast.dataset.timeoutid, 10)
    if (!isNaN(id)) clearTimeout(id)
  }

  setTimeout(function () {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, 220)
}

// adapter used everywhere in the app
function showquizstatusmodal(message) {
  showtoastmessage(message)
}