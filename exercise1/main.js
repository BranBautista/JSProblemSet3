// document.getElementById("btnsubmit").onclick = function(){

//     var section = document.getElementById("notes");

//     //For the title

//     const articleTag = document.createElement("article");
//     articleTag.setAttribute("class","story-article");

//     var theNoteTitle = document.getElementById("notetitlearea").value;

//     const newTitle = document.createElement("h3");
//     newTitle.setAttribute("class","story-title");
//     const noteTitle = document.createTextNode(theNoteTitle);

//     newTitle.appendChild(noteTitle);
//     articleTag.appendChild(newTitle);

//     //For the text

//     var theNoteText = document.getElementById("notetextarea").value;

//     const newNote = document.createElement("p");
//     newNote.setAttribute("class","story-text");
//     const noteText = document.createTextNode(theNoteText);

//     newNote.appendChild(noteText);
//     articleTag.appendChild(newNote);

//     const deleteButton = document.createElement("button");
//     deleteButton.setAttribute("type","submit");

//     const textDeleteButton = document.createTextNode("Delete note")

//     deleteButton.appendChild(textDeleteButton);

//     articleTag.appendChild(deleteButton);

//     section.appendChild(articleTag);
//}


$('#btnsubmit').click(function () {

    var section = $("#notes")

    articleTag = document.createElement("article")

    $(section).append(articleTag);
    $(articleTag).addClass("story-article");

    var theNoteTitle = $("#notetitlearea").val();

    newTitle = document.createElement("h3");

    $(articleTag).append(newTitle);
    $(newTitle).addClass("story-title");
    $(newTitle).text(theNoteTitle);

    var theNoteText = $("#notetextarea").val();

    newNote = document.createElement("p");

    $(articleTag).append(newNote);
    $(newNote).addClass("story-text");
    $(newNote).text(theNoteText);

    // $("article").each(function () {
    //     $(this).append('<a class="delete" href="#">Delete</a>  <a href="#" class="edit">Edit</a>')
    // });

    linkDelete = document.createElement("a");

    $(articleTag).append(linkDelete);
    $(linkDelete).addClass("delete");
    $(linkDelete).attr("href", "#");
    $(linkDelete).text("Delete");

    linkEdit = document.createElement("a");

    $(articleTag).append(linkEdit);
    $(linkEdit).addClass("edit");
    $(linkEdit).attr("href", "#");
    $(linkEdit).text("Edit");

    $('article a.delete').on('click', function () {
        $(this).parent().remove();
        return false;
    });

    // $("article a.edit").click(function () {
    //     var section = $(this).siblings('.story-text');
    //     var isEdit = $(this).is('.edit');

    //     linkUpdate = document.createElement("a");

    //     $(articleTag).append(linkUpdate);
    //     $(linkUpdate).addClass("update");
    //     $(linkUpdate).attr("href", "#");
    //     $(linkUpdate).text("Update");

    //     section.prop('contenteditable', isEdit).css('border', isEdit ? "2px solid" : "none");
    //     $('.edit').toggle(!isEdit);
    //     $('.update').toggle(isEdit);
    //     if (isEdit) { section.focus(); document.execCommand('selectAll', false, null); }
    // });


    $('article a.edit').on('click', function () {
        var val = $(this).siblings('.story-text').html();
        if (val) {
            $(this).parent().prepend('<input type="text" class="txt" value="' + val + '" />');
            $(this).siblings('.story-text').remove();
            $(this).html('Update');
        } else {
            var $txt = $(this).siblings().filter(function() { return $(this).hasClass('txt') });
            $(this).parent().prepend('<p class="story-text">' + $txt.val() + '</p>');
            $txt.remove();
            $(this).html('Edit');
        }
        return false;
    });
})