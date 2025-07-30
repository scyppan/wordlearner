//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// no module state needed

//---------
//ENTRY FUNCTION
//---------

function storedata(tag, data) {
  localStorage.setItem(tag, JSON.stringify(data))
}

function retrievedata(tag) {
  const serialized = localStorage.getItem(tag)
  if (!serialized) return null
  try {
    return JSON.parse(serialized)
  } catch (e) {
    console.error('failed to parse data for tag:', tag, e)
    return null
  }
}

//---------
//HELPER FUNCTIONS
//---------

// none

//---------
//IMMEDIATE FUNCTIONS
//---------

// none
