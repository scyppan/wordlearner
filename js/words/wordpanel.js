// wordspanel.js
//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none

//---------
//ENTRY FUNCTION
//---------

function renderwordpanel() {
    clearmaincontent();
    const container = buildwordscontainer()
    document.querySelector('#maincontent').appendChild(container)
    showworddetails(wordsdata[0]);
}

//---------
//MAJOR FUNCTIONS
//---------

function buildwordscontainer() {
    const container = document.createElement('div')
    container.id = 'words-container'; 
    container.append(
        buildwordlist(),
        opendetailspanel()
    )

    return container
}

//---------
//HELPER FUNCTIONS
//---------

// clearmaincontent(), buildwordlist(), opendetailspanel() are imported from their modules

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — renderwordpanel() is invoked from main.js when the Words view is activated
