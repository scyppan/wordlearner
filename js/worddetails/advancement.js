//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none; this module only constructs the bare DOM structure

//---------
//ENTRY FUNCTION
//---------

function createadvancementsection() {
    // The ONLY externally callable function in this module.
    // Returns a container plus references for each triple‐field table.
    var container = document.createElement('div');
    container.className = 'advancement-sections';

    var shortsec = createrepeatablesectiontable('shortphrases', 'Short Phrases');
    var longsec  = createrepeatablesectiontable('longphrases',  'Long Phrases');
    var sentsec  = createrepeatablesectiontable('sentences',    'Sentences');

    container.appendChild(shortsec.container);
    container.appendChild(longsec.container);
    container.appendChild(sentsec.container);

    return {
        container: container,
        shortsec: shortsec,
        longsec: longsec,
        sentsec: sentsec
    };
}

//---------
//MAJOR FUNCTIONS (PRIVATE)
//---------

function createrepeatablesectiontable(sectionkey, displayname) {
    var container = document.createElement('div');
    container.className = 'word-advancement-section ' + sectionkey;

    // header with title + add button (no data logic)
    var header = document.createElement('div');
    header.className = 'advancement-header';
    var title = document.createElement('h3');
    title.textContent = displayname;
    header.appendChild(title);

    var addbtn = document.createElement('button');
    addbtn.type = 'button';
    addbtn.className = 'advancement-add';
    addbtn.textContent = '+';
    header.appendChild(addbtn);

    container.appendChild(header);

    // table skeleton
    var table = document.createElement('table');
    table.className = 'advancement-table';

    var thead = document.createElement('thead');
    var thr = document.createElement('tr');
    ['thai', 'romanization', 'english', ''].forEach(function(col) {
        var th = document.createElement('th');
        if (col) th.textContent = col;
        thr.appendChild(th);
    });
    thead.appendChild(thr);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    container.appendChild(table);

    // expose only DOM references; external code will fill rows and wire events
    return {
        container: container,
        addbtn: addbtn,
        tbody: tbody
    };
}

//---------
//HELPER FUNCTIONS (EXTERNAL)
//---------

function createinlineeditablespan(classname) {
    var span = document.createElement('span');
    span.className = classname + ' inline-label';
    span.contentEditable = true;
    span.setAttribute('tabindex', '0');
    span.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            span.blur();
        }
    });
    return span;
}

//---------
//IMMEDIATE FUNCTIONS
//---------
// (none; only createadvancementsection is called externally)
