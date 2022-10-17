const submit = document.getElementById("btnsubmit");
const titleTag = document.getElementById("notetitleinput");
const bodyTag = document.getElementById("notebodyarea");
const notesArea = document.getElementById("notes");
let dateHelp = "";

let template = document.getElementById("template")

//We save in 'notes' all the notes in the local storage
const notesLocalStorage = localStorage.getItem("notes");
//we pass the string into an object with JSONparse, if there no data we pass an empty array
const notes = JSON.parse(notesLocalStorage || "[]");

let editRegisterObj = [];



//This function will show all the notes on the page
function showNotes() {
    document.querySelectorAll(".note").forEach(note => note.remove());

    notes.forEach((note, index) => {

        editRegisterObj.push({
            title: note.title,
            body: note.body,
            id: index,
            lastEdit: []
        })
    
        editRegisterObj[index].lastEdit.push(note.date);

        let displayTag = `
        <article class="note">
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
        </article>
        `;

        template.innerHTML = displayTag;

        let cloneTemplate = template.content.cloneNode(true);

        notesArea.appendChild(cloneTemplate);

    });
}

showNotes();

//This function will delete the selected note
function deleteNote(noteId) {
    if (confirm("You really want to delete the note?")==true) {
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

    //Here we put the title and body of the note about to edit, on the input and textarea in order to edit
    notes.findIndex((element, noteId) => {
        titleTag.value = element.title;
        bodyTag.value = element.body;
    })
    
    let lengthArray = editRegisterObj[noteId].lastEdit.length
    editRegister = JSON.stringify(editRegisterObj[noteId].lastEdit[lengthArray-1])

    dateHelp = editRegister;

    notes.splice(noteId, 1);
    notesString = JSON.stringify(notes);

    showNotes();
}

//This event will be to control the submit button
submit.addEventListener("click", e => {
    e.preventDefault();
    let noteTitle = titleTag.value;
    let noteBody = bodyTag.value;

    if (noteTitle || noteBody) {

        //Here we get the current date
        let dateObj = new Date()

        let options = {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'America/Los_Angeles'};
        let currentDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);

        let noteStructure ={};
        
        //We define the structure of the note

        if (dateHelp == ""){
            noteStructure = {
                title: noteTitle,
                body: noteBody,
                date: currentDate,
                editDate: currentDate
            }
        }
        else {
            noteStructure = {
                title: noteTitle,
                body: noteBody,
                date: currentDate,
                editDate: dateHelp
            }
        }

        // We will save all the notes on the next array
        // and we will add the notes to the array notes
        notes.push(noteStructure);
        notesString = JSON.stringify(notes);
        localStorage.setItem("notes", notesString);

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
});
