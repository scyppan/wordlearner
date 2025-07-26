// worddetails/panel.js
//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none; uses wordsdata and helpers from elsewhere

//---------
//ENTRY FUNCTION
//---------

function opendetailspanel() {
    const detail = document.createElement('div')
    detail.id = 'word-details'

    // compose sections
    const header      = createheadersection()
    const meta        = createmetasection()
    const detailsect  = createdetailsection()
    const advancement = createadvancementsection()
    const delbtn      = createdeletewordbutton()

    detail.append(header, meta, detailsect, advancement.container, delbtn)
    return detail
}

//---------
//MAJOR FUNCTIONS (PANEL-SPECIFIC HELPERS)
//---------

// none

//---------
//HELPER FUNCTIONS
//---------

// none

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — opendetailspanel() is called externally by wordspanel.js
