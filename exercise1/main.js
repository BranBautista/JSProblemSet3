const submit = document.getElementById("btnsubmit");
const titleTag = document.getElementById("notetitleinput");
const bodyTag = document.getElementById("notebodyarea");
const notesArea = document.getElementById("notes");

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

//Get all the notes in the local storage if there exist and parse them to an object. Else passing and empty array
const notes = JSON.parse(localStorage.getItem("notes") || "[]"); 

function showNotes (){
    document.querySelectorAll(".note").forEach(note => note.remove());
    notes.forEach((note, index) => {
        let displayTag = `
        <article class="note">
        <div class="details">
                <p>${note.title}</p>
                <span>${note.body}</span>
            </div>
            <div class="foot">
                <span>${note.date}</span>
                <br>
                <a onclick="deleteNote(${index})" class="delete" href="#">Delete</a>
                <a onclick="editNote(${index}, '${note.title}','${note.body}')" class="edit" href="#">Edit</a>
            </div>
        </article>
        `;
        notesArea.insertAdjacentHTML("beforeend",displayTag);
    });
}

showNotes();

function deleteNote(noteId){
    notes.splice(noteId, 1); //remove selected note from array
    //save updated notes to local storage
    notesString = JSON.stringify(notes);
    localStorage.setItem("notes", notesString);
    showNotes();
}

function editNote(noteId, title, body) {
    
    notes.findIndex((element,noteId) => {
        titleTag.value = element.title;
        bodyTag.value = element.body;
    })

    notes.splice(noteId,1);
    notesString = JSON.stringify(notes);
    localStorage.setItem("notes",notesString);
    showNotes();
}

submit.addEventListener("click",e => {
    e.preventDefault();
    let noteTitle = titleTag.value;
    let noteBody = bodyTag.value;

    if(noteTitle || noteBody) {

        //We need to get the date
        let dateObj = new Date(),
        month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();

        let noteStructure = {
            title: noteTitle,
            body: noteBody,
            date: `${month} ${day}, ${year}`
        }

        // We will save all the notes on the next array
        notes.push(noteStructure); //Here we are adding the notes to the array notes
        notesString = JSON.stringify(notes); //We need to convert the array into string, then save in the local.storage
        localStorage.setItem("notes", notesString); //Here we are saving the notes' array in the local storage

        showNotes();

        titleTag.value = "";
        bodyTag.value = "";
    }
})

