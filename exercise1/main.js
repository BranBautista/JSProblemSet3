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

const searchBar = document.getElementById("searchBar");
const submitSearch = document.getElementById("btnsearch");

let dragStartIndex;

const submitUndo = document.getElementById("btnundo");
const commands = [];

let dateHelp = "";

let template = document.getElementById("template")

//I save in 'notes' all the notes in the local storage
const notesLocalStorage = localStorage.getItem("notes");
//I pass the string into an object with JSONparse, if there no data we pass an empty array
const notes = JSON.parse(notesLocalStorage || "[]");
//I create an array to save the dates of editions 
let editRegisterObj = [];
let filteredNotes = [];
let listNotes = [];

let isUpdate = false, updateId;
let isEdit = false;
let isDelete = false;
let isCreate = false;
let isOrdering = false;
let noteNoEdited;



//This function will show all the notes on the page
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


        let displayTag = `
        <div class="note" draggable="true" id="${index}">
            <div class="details">
                <p>${note.title}</p>
                <span>${note.body}</span>
            </div>
            <div class="foot">
                <span>${note.date}</span>
                <br>
                <span>Last edit: ${note.editDate}</span>
                <br>
                <a onclick="deleteNote(${index})" class="delete" href="#">Delete</a>
                <a onclick="editNote(${index}, '${note.title}','${note.body}')" id="editBtn" class="edit" href="#">Edit</a>
            </div>
        </div>
        `;

        listNotes.push(template)

        template.innerHTML = displayTag;

        let cloneTemplate = template.content.cloneNode(true);

        notesContainer.appendChild(cloneTemplate);

        addEventListeners();
    });

    // if(notes.length != 0 && isDelete == false){
    //     saveCommand(notes[notes.length-1]);
    // }
    
}

showNotes();

//This function will delete the selected note
function deleteNote(noteId) {
    if (confirm("You really want to delete the note?")==true) {
        isDelete = true;
        saveCommand(notes[noteId],noteId);
        //remove selected note from the array 'notes'
        notes.splice(noteId, 1);
        //We pass to a string the 'notes' array
        notesString = JSON.stringify(notes);
        //save updated notes to local storage
        localStorage.setItem("notes", notesString);
        //Show to the page the notes without the deleted one
        
        showNotes();
    }
}

//This function will edit the selected note
function editNote(noteId, title, body) {
    isUpdate = true;
    updateId = noteId;
    noteNoEdited = notes[updateId];
    popUpBox.classList.add("show");
    popupTitleTag.value = notes[noteId].title;
    popupBodyTag.value = notes[noteId].body;
    popupTitleTag.focus();
    //Here I put the title and body of the note about to edit, on the input and textarea in order to edit
    // titleTag.value = notes[noteId].title;
    // bodyTag.value = notes[noteId].body;
    
    //Here I use the last date of edit in order to save it in the dateHelp variable 

    let lengthArray = editRegisterObj[noteId].lastEdit.length
    editRegister = JSON.stringify(editRegisterObj[noteId].lastEdit[lengthArray-1])

    dateHelp = editRegister;

    // if (updateNoteReg){
    //     notes.splice(noteId,1)
    //     notesString = JSON.stringify(notes);
    // }

    // notes.splice(noteId,1)
    // notesString = JSON.stringify(notes);

    // showNotes();
}

//This event will be to control the submit button
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

        if(notes.length != 0){
            if (!isUpdate){
                saveCommand(notes[notes.length-1], notes.length-1);
            }
            else
            {
                saveCommand(noteNoEdited,updateId);
                isEdit = true;
                saveCommand(notes[updateId], updateId);
            }
        }

        showNotes();

        //We reset the value of the input and textarea
        titleTag.value = "";
        bodyTag.value = "";
    }
})

//This event will enable the use of the Tab key
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

closeIcon.addEventListener("click", ()=>{
    popUpBox.classList.remove("show");
})

updateNote.addEventListener("click", ()=>{
    submit.click();
    isUpdate = false;
    closeIcon.click();
})

// Here starts the search 

submitSearch.addEventListener("click", e => {
    e.preventDefault();
    const searchString = searchBar.value;
    filteredNotes = notes.filter(note =>{
        return note.body.includes(searchString) || note.title.includes(searchString);
    })
    displayNotes()
})

searchBar.addEventListener("keyup", (e) => {
    if( e.target.value == ""){
        showNotes()
    }
})

function displayNotes() {
    document.querySelectorAll(".note").forEach(note => note.remove());

    filteredNotes.forEach((note, index) => {
        let displayTag = `
        <div class="note">
        <div class="details">
                <p>${note.title}</p>
                <span>${note.body}</span>
            </div>
            <div class="foot">
                <span>${note.date}</span>
                <br>
                <span>Last edit: ${note.editDate}</span>
                <br>
                <a onclick="deleteNote(${index})" class="delete" href="#">Delete</a>
                <a onclick="editNote(${index}, '${note.title}','${note.body}')" class="edit" href="#">Edit</a>
            </div>
        </div>
        `;

        listNotes.push(template)

        template.innerHTML = displayTag;

        let cloneTemplate = template.content.cloneNode(true);

        notesContainer.appendChild(cloneTemplate);

    });
}

// Here starts the drag functionality

function dragStart(){
    dragStartIndex = +this.closest('div').getAttribute('id');
}

function dragEnter(){
//   console.log('Event: ', 'dragenter')
}

function dragLeave(){
//    console.log('Event: ', 'dragleave')
}

function dragOver(e){
    e.preventDefault();
//    console.log('Event: ', 'dragover')
}

function dragDrop(){
    const dragEndIndex = +this.getAttribute('id');
    swapItems(dragStartIndex, dragEndIndex);
//    console.log('Event: ', 'drop')
}

let indexFrom;
let indexTo;

function swapItems(fromIndex,toIndex){
    let theNote = document.querySelectorAll('.note')
    let noteFrom = theNote[fromIndex] 
    let noteTo = theNote[toIndex];
    indexFrom = fromIndex;
    indexTo = toIndex;

    let temp = theNote[fromIndex].innerHTML;
    theNote[fromIndex].innerHTML = theNote[toIndex].innerHTML
    theNote[toIndex].innerHTML = temp;
    isOrdering = true;
    saveCommand()
}

function addEventListeners(){
    const draggables = document.querySelectorAll('.note');
    const dragListItems = document.querySelectorAll('.notesContainer');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart)
    })

    draggables.forEach(item => {
        item.addEventListener('dragover', dragOver)
        item.addEventListener('drop', dragDrop)
        item.addEventListener('dragenter', dragEnter)
        item.addEventListener('dragleave', dragLeave)
    })
}


// Here starts the undo button functionality

submitUndo.addEventListener("click", e => {
    e.preventDefault();
    let lastCommand = commands.pop();
    if(lastCommand){
        if(lastCommand.type == "delete"){
            notes.splice(lastCommand.noteId,0,lastCommand.object);
            displayNotesUndo();
        }
        else if (lastCommand.type == "create"){
            notes.pop();
            displayNotesUndo();
        }
        else if (lastCommand.type == "edit"){
            lastCommand = commands.pop()
            notes.splice(lastCommand.noteId,1,lastCommand.object);
            displayNotesUndo();
        }
        else if (lastCommand.type == "ordering"){
            let theNote = document.querySelectorAll('.note')
            let indexToUndo= indexFrom;
            let indexFromUndo= indexTo;

            let temp = theNote[indexFromUndo].innerHTML;
            theNote[indexFromUndo].innerHTML = theNote[indexToUndo].innerHTML
            theNote[indexToUndo].innerHTML = temp;
        }
            // notes.pop()
            // if(notes[notes.length - 1].body == commands[commands.length - 1].object.body){
            //     displayNotesUndo();
            // } else{
            //     notes.push(commands[commands.length - 1].object);
            //     displayNotesUndo();
            // }
        }
    }) 

// submitUndo.addEventListener("click", e => {
//     e.preventDefault();
//     const lastCommand = commands.pop();
//     if(lastCommand.type == "delete"){
//         if(isDelete ==true){
//             notes.push(commands[commands.length - 1]);
//             displayNotesUndo();
//         }
//         else {
//         notes.pop()
//         if(notes[notes.length - 1].body == commands[commands.length - 1].body){
//             displayNotesUndo();
//         } else{
//             notes.push(commands[commands.length - 1]);
//             displayNotesUndo();
//         }
//         }
//     }
//     else {
//         return;
//     }   
// })

// submitUndo.addEventListener("click", e => {
//     e.preventDefault();
//     console.log("Hello")
//     const lastCommand = commands.pop();
//     if(lastCommand){
//         notes.splice(lastCommand.inverse.noteId, 1);
//         //We pass to a string the 'notes' array
//         notesString = JSON.stringify(notes);
//         //save updated notes to local storage
//         localStorage.setItem("notes", notesString);
//         //Show to the page the notes without the deleted one
//         showNotes();
//     }
//     else {
//         return;
//     }   
// })

function saveCommand(objectHistory,noteId) {
    if (isDelete){
        commands.push(
            {type: "delete",
            object: objectHistory,
            noteId: noteId
            });
        isDelete = false;
    }
    else if(isEdit){
        commands.push(
            {type: "edit",
            object:objectHistory,
            noteId: noteId
            });
        isEdit = false;
    }
    else if(isCreate){
        commands.push(
            {type: "create",
            object:objectHistory,
            noteId: noteId
            });
        isCreate = false;
    }
    else if(isOrdering){
        commands.push(
            {type: "ordering",
            object:"",
            noteId:""
            })
        isOrdering = false;
    }
}

function displayNotesUndo() {
    document.querySelectorAll(".note").forEach(note => note.remove());

    notes.forEach((note, index) => {
        let displayTag = `
        <div class="note">
        <div class="details">
                <p>${note.title}</p>
                <span>${note.body}</span>
            </div>
            <div class="foot">
                <span>${note.date}</span>
                <br>
                <span>Last edit: ${note.editDate}</span>
                <br>
                <a onclick="deleteNote(${index})" class="delete" href="#">Delete</a>
                <a onclick="editNote(${index}, '${note.title}','${note.body}')" class="edit" href="#">Edit</a>
            </div>
        </div>
        `;

        listNotes.push(template)

        template.innerHTML = displayTag;

        let cloneTemplate = template.content.cloneNode(true);

        notesContainer.appendChild(cloneTemplate);

    });
}