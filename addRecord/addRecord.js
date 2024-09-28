var modal = document.getElementById("myModal");
var restoreModal = document.getElementById("restoreModal");
var searchModal = document.getElementById("searchModal");
var btn = document.getElementById("addRecordBtn");
var restoreBtn = document.getElementById("restoreBtn");
var searchBtn = document.getElementById("searchRecordBtn");
var searchInput = document.getElementById("searchInput");
var searchResults = document.getElementById("searchResults");
var restoreSelect = document.getElementById("restoreSelect");
var deletedRecords = [];
var deleteMode = false;

window.onload = function() {
  loadRecordsFromStorage();
};

btn.onclick = function() {
  modal.style.display = "block";
}

searchBtn.onclick = function() {
  searchModal.style.display = "block";
}

document.querySelectorAll('.close').forEach(function(closeBtn) {
  closeBtn.onclick = function() {
    modal.style.display = "none";
    restoreModal.style.display = "none";
    searchModal.style.display = "none";
  }
});

window.onclick = function(event) {
  if (event.target == modal || event.target == restoreModal || event.target == searchModal) {
    modal.style.display = "none";
    restoreModal.style.display = "none";
    searchModal.style.display = "none";
  }
}

document.getElementById("addRecordForm").onsubmit = function(event) {
  event.preventDefault();

  var idNumber = document.getElementById("idNumber").value;
  var fullName = document.getElementById("fullName").value;
  var username = document.getElementById("username").value;
  var role = document.getElementById("role").value;

  var recordData = {
    idNumber: idNumber,
    fullName: fullName,
    username: username,
    role: role
  };

  addRecordToDOM(recordData);
  saveRecordsToStorage(); 

  modal.style.display = "none";
  document.getElementById("addRecordForm").reset();
}

function addRecordToDOM(recordData) {
  var recordRow = document.createElement('div');
  recordRow.classList.add('record-row');

  recordRow.innerHTML = `
    <div class="child child-1"><p>${recordData.idNumber}</p></div>
    <div class="child child-2"><p>${recordData.fullName}</p></div>
    <div class="child child-3"><p>${recordData.username}</p></div>
    <div class="child child-4"><p>${recordData.role}</p></div>
    <input type="checkbox" class="delete-checkbox" style="display: ${deleteMode ? 'block' : 'none'}">
  `;

  document.querySelector(".container").appendChild(recordRow);
}

function saveRecordsToStorage() {
  var recordRows = document.querySelectorAll('.record-row');
  var recordsArray = [];

  recordRows.forEach(function(row) {
    var recordData = {
      idNumber: row.querySelector('.child-1 p').textContent,
      fullName: row.querySelector('.child-2 p').textContent,
      username: row.querySelector('.child-3 p').textContent,
      role: row.querySelector('.child-4 p').textContent
    };
    recordsArray.push(recordData);
  });

  localStorage.setItem('records', JSON.stringify(recordsArray));
}

function loadRecordsFromStorage() {
  var storedRecords = localStorage.getItem('records');
  if (storedRecords) {
    var recordsArray = JSON.parse(storedRecords);
    recordsArray.forEach(function(recordData) {
      addRecordToDOM(recordData);
    });
  }
}

document.getElementById("fixedDeleteBtn").onclick = function() {
  deleteMode = !deleteMode;
  document.querySelectorAll('.delete-checkbox').forEach(function(checkbox) {
    checkbox.style.display = deleteMode ? 'block' : 'none';
  });
}

document.getElementById("fixedRetrieveBtn").onclick = function() {
  restoreSelect.innerHTML = '<option value="">Select a record to restore</option>';
  
  deletedRecords.forEach(function(record, index) {
    var option = document.createElement('option');
    option.value = index;
    option.textContent = `${record.idNumber} - ${record.fullName} (${record.username}, ${record.role})`;
    restoreSelect.appendChild(option);
  });
  
  restoreModal.style.display = "block";
}

restoreBtn.onclick = function() {
  var selectedIndex = restoreSelect.value;
  if (selectedIndex !== "") {
    var recordData = deletedRecords.splice(selectedIndex, 1)[0];
    addRecordToDOM(recordData);
    saveRecordsToStorage(); 
    restoreModal.style.display = "none";
  }
}

document.querySelector(".container").addEventListener('click', function(event) {
  if (deleteMode && event.target.classList.contains('delete-checkbox')) {
    var row = event.target.parentElement;

    var recordData = {
      idNumber: row.querySelector('.child-1 p').textContent,
      fullName: row.querySelector('.child-2 p').textContent,
      username: row.querySelector('.child-3 p').textContent,
      role: row.querySelector('.child-4 p').textContent
    };

    deletedRecords.push(recordData);
    row.remove();
    saveRecordsToStorage(); 
  }
});


searchInput.oninput = function() {
  var query = searchInput.value.toLowerCase();
  searchResults.innerHTML = ''; 

  document.querySelectorAll('.record-row').forEach(function(row) {
    row.classList.remove('highlighted');
  });

  document.querySelectorAll('.record-row').forEach(function(row) {
    var idNumber = row.querySelector('.child-1 p').textContent.toLowerCase();
    var fullName = row.querySelector('.child-2 p').textContent.toLowerCase();
    var username = row.querySelector('.child-3 p').textContent.toLowerCase();
    var role = row.querySelector('.child-4 p').textContent.toLowerCase();

    if (idNumber.includes(query) || fullName.includes(query) || username.includes(query) || role.includes(query)) {
      searchResults.innerHTML += `
        <div class="search-result">
          <p>ID: ${idNumber}, Name: ${fullName}, Username: ${username}, Role: ${role}</p>
        </div>
      `;
      // Highlight the matching row
      row.classList.add('highlighted');
    }
  });
}
