document.addEventListener('DOMContentLoaded', initsidepanel)

function clearmaincontent() {
    var main = document.querySelector('#maincontent')
    if (main) {
        main.innerHTML = ''
    }
}