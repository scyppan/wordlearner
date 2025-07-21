function renderdata() {
  var main = document.querySelector('.maincontent');
  if (!main) return;

  main.innerHTML = '';

  var container = document.createElement('div');
  container.style.padding = '1em';

  var importBtn = document.createElement('button');
  importBtn.id = 'importDataBtn';
  importBtn.textContent = 'Import Data from JSON';
  importBtn.onclick = importfromjson;

  var exportBtn = document.createElement('button');
  exportBtn.id = 'exportDataBtn';
  exportBtn.textContent = 'Export Data to JSON';
  exportBtn.style.marginLeft = '1em';
  exportBtn.onclick = exporttojson;

  container.appendChild(importBtn);
  container.appendChild(exportBtn);

  main.appendChild(container);
}