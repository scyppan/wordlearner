// wordlist.js
//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none

//---------
//ENTRY FUNCTION
//---------

function buildwordlist() {
    // sidebar wrapper
    const sidebar = document.createElement('div')
    sidebar.id = 'words-sidebar'; 

    // search row
    const searchRow = document.createElement('div')
    searchRow.style.display = 'flex'
    searchRow.style.alignItems = 'center'

    const search = document.createElement('input')
    search.id = 'word-search'
    search.placeholder = 'Search…'
    searchRow.append(search)

    const addBtn = document.createElement('button')
    addBtn.type = 'button'
    addBtn.id = 'add-word-btn'
    addBtn.textContent = '+'
    addBtn.title = 'Add new word'
    addBtn.style.marginLeft = '0.5em'
    addBtn.addEventListener('click', addword)
    searchRow.append(addBtn)

    sidebar.append(searchRow)

    // suggestion list
    const ul = document.createElement('ul')
    ul.id = 'word-list'
    sidebar.append(ul)

    // wire up search + focus + initial render
    searchbar(ul)
    wireselectallonfocus(search)
    wirealtsfocus()

    return sidebar
}

//---------
//MAJOR FUNCTIONS
//---------

// (addword and refreshwordlist remain here as needed)

//---------
//HELPER FUNCTIONS
//---------

// opensearchbar(), wireselectallonfocus(), wirealtsfocus(), showworddetails() are in other modules

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — buildwordlist() is called externally by wordspanel.js
