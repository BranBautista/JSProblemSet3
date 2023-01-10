function showNotes() {
    document.querySelectorAll(".note").forEach(note => note.remove());

    notes.forEach((note, index) => {

        editRegisterObj.push({
            title: note.title,
            body: note.body,
            id: index,
            lastEdit: [],
        })
        editRegisterObj[index].lastEdit.push(note.date);
        if (isUpdate === false){
            console.log('we are not editing');
            let creationDate = editRegisterObj[index].lastEdit[0];
            localStorage.setItem(`creationDate${index}`, creationDate);
        }

        let divNote = document.createElement("div"); 
            divNote.setAttribute("id", `${index}`);
            divNote.setAttribute("class", "note");
        
        let divDetails = document.createElement("div");
            divDetails.setAttribute("class", "details");
        
        let divFoot = document.createElement("div");
            divFoot.setAttribute("class", "foot");

        let displayDetails = `<p>${note.title}</p>
        <span>${note.body}</span>`;
        
        let displayFoot = `<span>Last edit: ${note.date}</span>
        <br>
        <span>Created at: ${localStorage.getItem(`creationDate${index}`)}</span>
        <br>
        <a onclick="deleteNote(${index})" class="delete" href="#">Delete</a>
        <a onclick="editNote(${index}, '${note.title}','${note.body}')" id="editBtn" class="edit" href="#">Edit</a>`

        divDetails.insertAdjacentHTML("afterbegin", displayDetails);
        divFoot.insertAdjacentHTML("afterbegin", displayFoot); 

        divNote.appendChild(divDetails);
        divNote.appendChild(divFoot);

        cloneTemplate.appendChild(divNote)
        notesContainer.appendChild(cloneTemplate);
    });
}

//This function will delete the selected note
function deleteNote(noteId) {
    if (confirm("You really want to delete the note?")==true) {
        isDelete = true;
        //remove selected note from the array 'notes'
        notes.splice(noteId, 1);
        //We pass to a string the 'notes' array
        notesString = JSON.stringify(notes);
        //save updated notes to local storage
        localStorage.setItem("notes", notesString);
        //Show to the page the notes without the deleted one
        localStorage.removeItem(`creationDate${noteId}`);
        showNotes();
    }
}

//This function will edit the selected note
function editNote(noteId, title, body) {
    isUpdate = true;
    updateId = noteId;
    // noteNoEdited = notes[updateId];
    popUpBox.classList.add("show");
    popupTitleTag.value = notes[noteId].title;
    popupBodyTag.value = notes[noteId].body;
    popupTitleTag.focus();
    
    //Here I use the last date of edit in order to save it in the dateHelp variable 

    let lengthArray = editRegisterObj[noteId].lastEdit.length
    editRegister = JSON.stringify(editRegisterObj[noteId].lastEdit[lengthArray-1])
    dateHelp = editRegister;
}

const submit = document.getElementById("btnsubmit");
const titleTag = document.getElementById("notetitleinput");
const bodyTag = document.getElementById("notebodyarea");
const popupTitleTag = document.getElementById("popup-notetitleinput");
const popupBodyTag = document.getElementById("popup-notebodyarea");
const notesArea = document.getElementById("notes");
const popUpBox = document.getElementById("popup-box");
const closeIcon = document.getElementById("close-icon");
const updateNote = document.getElementById("update-note");
const notesContainer = document.getElementById("notesContainer");
const template = document.getElementById("template");
const cloneTemplate = template.content.cloneNode(true);

let editRegisterObj = [];
let dateHelp = "";
let noteNoEdited;
let isUpdate = false, updateId;
let isEdit = false;
let isDelete = false;
let isCreate = false;
let isOrdering = false;
let indexFrom, indexTo;

const notesLocalStorage = localStorage.getItem("notes");
const notes = JSON.parse(notesLocalStorage || "[]");
const commandsLocalStorage = localStorage.getItem("commands");
const commands = JSON.parse(commandsLocalStorage || "[]");

showNotes();

submit.addEventListener("click", e => {
    e.preventDefault();
    let noteTitle, noteBody
    if (!isUpdate){
    noteTitle = titleTag.value;
    noteBody = bodyTag.value;
    }
    else{
        noteTitle = popupTitleTag.value;
        noteBody = popupBodyTag.value;
    }

    if (noteTitle || noteBody) {

        //Here we get the current date
        let dateObj = new Date()

        let options = {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'America/Los_Angeles'};
        let currentDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);

        let noteStructure ={};
        
        //We define the structure of the note

        if (dateHelp == ""){ //If is new note
            noteStructure = {
                title: noteTitle,
                body: noteBody,
                date: currentDate,
                editDate: currentDate
            }
        }
        else {
            noteStructure = { //Is is an edition
                title: noteTitle,
                body: noteBody,
                date: currentDate,
                editDate: dateHelp
            }
        }

        dateHelp = "";

        // We will save all the notes on the next array
        // and we will add the notes to the array notes

        if (!isUpdate){
            notes.push(noteStructure);
            isCreate = true;
        }
        else
        {
            notes[updateId] = noteStructure;
            isEdit = true;
        }

        notesString = JSON.stringify(notes);
        localStorage.setItem("notes", notesString);

        showNotes();

        //We reset the value of the input and textarea
        titleTag.value = "";
        bodyTag.value = "";
    }
})

// ---------- Buttons for the emergent window


closeIcon.addEventListener("click", ()=>{
    popUpBox.classList.remove("show");
})

updateNote.addEventListener("click", ()=>{
    submit.click();
    isUpdate = false;
    closeIcon.click();
})

//--------- This event will enable the use of the Tab key


bodyTag.addEventListener('keydown', (event) => {
    let start, end, beforeTab, afterTab, newString;
    if (event.keyCode === 9) {
        event.preventDefault();
        start = bodyTag.selectionStart;
        end = bodyTag.selectionEnd;
        beforeTab = bodyTag.value.substring(0, start);
        afterTab = bodyTag.value.substring(end);
        newString = beforeTab + "\t" + afterTab;
        bodyTag.value = newString
        bodyTagselectionStart = start + 1
        bodyTagselectionEnd = start + 1
        return false;
    }
})

popupBodyTag.addEventListener('keydown', (event) => {
    let start, end, beforeTab, afterTab, newString;
    if (event.keyCode === 9) {
        event.preventDefault();
        start = popupBodyTag.selectionStart;
        end = popupBodyTag.selectionEnd;
        beforeTab = popupBodyTag.value.substring(0, start);
        afterTab = popupBodyTag.value.substring(end);
        newString = beforeTab + "\t" + afterTab;
        popupBodyTag.value = newString
        bodyTagselectionStart = start + 1
        bodyTagselectionEnd = start + 1
        return false;
    }
})