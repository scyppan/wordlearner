// js/items/itemspanel.js

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// hook this up to real itemsdata later
// for now, just a placeholder so the button works
var itemsviewplaceholder = true


//---------
//ENTRY FUNCTION
//---------

function renderitemspanel() {
    if (typeof clearmaincontent === 'function') {
        clearmaincontent()
    }

    var main = document.getElementById('maincontent')
    if (!main) return

    var container = builditemscontainer()
    main.appendChild(container)
}


//---------
//MAJOR FUNCTIONS
//---------

function builditemscontainer() {
    var container = document.createElement('div')
    container.id = 'items-container'

    var heading = document.createElement('h2')
    heading.textContent = 'Items'
    container.appendChild(heading)

    var note = document.createElement('p')
    note.textContent = 'Items view will show the master list of phrases/sentences tagged by roots and combos.'
    container.appendChild(note)

    return container
}


//---------
//HELPER FUNCTIONS
//---------

// none

//---------
//IMMEDIATE FUNCTIONS
//---------

// none
