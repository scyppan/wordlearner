//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none

//---------
//ENTRY FUNCTION
//---------

function buildli(item, input, onselect) {
  var li = document.createElement('li')

  var header = document.createElement('div')

  var thaispan = document.createElement('span')
  thaispan.className = 'thai'
  thaispan.textContent = item.word
  header.appendChild(thaispan)

  if (item.romanization) {
    var romanspan = document.createElement('span')
    romanspan.className = 'roman'
    romanspan.textContent = ' (' + item.romanization + ')'
    header.appendChild(romanspan)
  }

  if (item.type) {
    header.appendChild(document.createTextNode(' - ' + item.type))
  }

  li.appendChild(header)

  if (item.definition) {
    var def = document.createElement('div')
    def.className = 'definition'
    def.textContent = item.definition
    li.appendChild(def)
  }

  li.addEventListener('mousedown', function () {
    input.value = item.word
    if (typeof onselect === 'function') onselect()
    showworddetails(item)
  })

  return li
}

//---------
//MAJOR FUNCTIONS
//---------

function updatehighlight(items) {
    items.forEach(function (li, i) {
      li.classList.toggle('highlight', i === selectedindex)
    })
  }

//---------
//HELPER FUNCTIONS
//---------

// none

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — must be imported and called from search.js
