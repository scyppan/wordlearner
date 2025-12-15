// modals-esc.js

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

var toastcontainer = null
var toastmax = 1
var toastduration = 0
var toastpersist = true


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
    closetasts()
  }
}

function closeallimportmodals() {
  var modals = document.querySelectorAll('.import-modal.is-open')
  if (!modals || !modals.length) return

  modals.forEach(function(modal) {
    modal.classList.remove('is-open')
  })
}

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

  // keep only one toast visible (status-style)
  while (toastcontainer.firstChild) {
    toastcontainer.removeChild(toastcontainer.firstChild)
  }

  var toast = document.createElement('div')
  toast.className = 'toast-message'
  toast.textContent = message

  toast.addEventListener('click', function () {
    hidetoast(toast)
  })

  toastcontainer.appendChild(toast)

  if (!toastpersist && toastduration > 0) {
    settimeoutfortoast(toast)
  }
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

function closetasts() {
  if (!toastcontainer) return
  var toasts = toastcontainer.querySelectorAll('.toast-message')
  if (!toasts || !toasts.length) return

  toasts.forEach(function(toast) {
    hidetoast(toast)
  })
}

// adapter used everywhere in the app
function showquizstatusmodal(message) {
  showtoastmessage(message)
}
