// sidepanel.js
//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// none

//---------
//ENTRY FUNCTION
//---------

function initsidepanel() {
    var app = document.getElementById('app')
    app.innerHTML = ''

    var aside = createasidepanel()
    var main  = createmainpanel()

    app.appendChild(aside)
    app.appendChild(main)
}

//---------
//MAJOR FUNCTIONS
//---------

function createasidepanel() {
    var aside = document.createElement('aside')
    aside.id = 'sidepanel'

    var ul = document.createElement('ul')
    ul.id = 'view-list'    // unique list

    var views = [
        { label: 'words',        action: renderwordpanel   },
        { label: 'quiz builder', action: renderquizbuilder },
        { label: 'quiz mode',    action: renderquizmode    },
        { label: 'feedback',     action: renderfeedback    },
        { label: 'data',         action: renderdata        }
    ]

    views.forEach(function(view) {
        var li = document.createElement('li')
        li.className = 'view-item'  // repeatable items use a class
        li.textContent = view.label
        li.addEventListener('click', view.action)
        ul.appendChild(li)
    })

    aside.appendChild(ul)
    return aside
}

function createmainpanel() {
    var main = document.createElement('main')
    main.id = 'maincontent'
    return main
}

//---------
//HELPER FUNCTIONS
//---------

// none

//---------
//IMMEDIATE FUNCTIONS
//---------

// none — initsidepanel() is called from main.js
