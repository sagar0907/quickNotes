let back = chrome.extension.getBackgroundPage();

let ui = {
    noteBox: $('<div class="note-box">' +
        '         <div class="note-pad">' +
        '             <div class="note-head">' +
        '                 <div class="note-head-front">' +
        '                     <div class="note-move-box">' +
        '                         <div class="note-move-icon"></div>' +
        '                     </div>' +
        '                     <div class="note-head-text-cover">' +
        '                         <div class="note-head-text" contenteditable="true" spellcheck="false"></div>' +
        '                     </div>' +
        '                     <div class="note-options">' +
        '                         <div class="note-options-icons"></div>' +
        '                     </div>' +
        '                 </div>' +
        '                 <div class="note-head-back">' +
        '                     <div class="color-list">' +
        '                         <div class="color-box">' +
        '                             <div class="color-selector color-blue" data-color="blue"></div>' +
        '                         </div>' +
        '                         <div class="color-box">' +
        '                             <div class="color-selector color-green" data-color="green"></div>' +
        '                         </div>' +
        '                         <div class="color-box">' +
        '                             <div class="color-selector color-orange" data-color="orange"></div>' +
        '                         </div>' +
        '                         <div class="color-box">' +
        '                             <div class="color-selector color-red" data-color="red"></div>' +
        '                         </div>' +
        '                     </div>' +
        '                     <div class="note-options">' +
        '                         <div class="note-options-icons"></div>' +
        '                     </div>' +
        '                     <div class="note-delete"><i class="material-icons">delete_forever</i></div>' +
        '                 </div>' +
        '             </div>' +
        '             <div class="note-text" contenteditable="true" spellcheck="false">' +
        '             </div>' +
        '         </div>' +
        '     </div>')
};

let quickNotes = back.getNotes();

function initHandlers() {
    $(".note-add-box").click(function (event) {
        let noteId = quickNotes.addNote(getSmallestColumn());
        addNoteToUI(noteId);
    });
}

function getSmallestColumn() {
    let smallestColumn = 1;
    let smallestHeight = $("#column_1").height();
    for (let i = 2; i <= 4; i++) {
        let height = $("#column_" + i).height();
        if (height < smallestHeight) {
            smallestColumn = i;
            smallestHeight = height;
        }
    }
    return smallestColumn;
}

function addNoteToList(noteId, note, list) {
    let noteBox = ui.noteBox.clone();
    noteBox.addClass(note.color + '-pad');
    noteBox.attr('id', 'noteId_' + noteId);
    noteBox.find(".note-head-text").html(note.title);
    noteBox.find(".note-text").html(note.text);
    noteBox.find(".note-head-text").click(function (event) {
        $(this).select();
    });
    noteBox.find(".note-options").click(function (event) {
        noteBox.find(".note-head").toggleClass("flip");
    });
    noteBox.find(".note-delete").click(function (event) {
        quickNotes.deleteNote(noteId);
        deleteNoteFromUI(noteBox);
    });
    noteBox.find(".color-selector").click(function (event) {
        let color = $(event.currentTarget).attr('data-color');
        quickNotes.changeNoteColor(noteId, color);
        changeColorInUI(noteBox, color);
    });
    let titleBox = noteBox.find(".note-head-text");
    let textBox = noteBox.find(".note-text");
    util.attachMutationObserver(titleBox[0], function () {
        quickNotes.changeNoteTitle(noteId, noteBox.find(".note-head-text").html());
    });
    util.attachMutationObserver(textBox[0], function () {
        quickNotes.changeNoteText(noteId, noteBox.find(".note-text").html());
    });
    titleBox.bind("paste", util.handlePaste);
    textBox.bind("paste", util.handlePaste);
    list.append(noteBox);
}

function setupNotes() {
    let notes = quickNotes.getNotes();
    let columnNotes = quickNotes.getColumnNotes();
    util.each(columnNotes, function (noteIdList, columnNo) {
        let columnDiv = $("#column_" + columnNo);
        let noteList = $('<div class="note_list"></div>');
        util.each(noteIdList, function (noteId) {
            let note = notes[noteId];
            addNoteToList(noteId, note, noteList);
        });
        columnDiv.append(noteList);
    });
    $(".note_list").sortable({
        handle: ".note-move-box",
        connectWith: ".note_list",
        update: sortableHandler
    });
}

function addNoteToUI(noteId) {
    let note = quickNotes.getNoteById(noteId);
    let columnId = note.columnId;
    let noteList = $("#column_" + columnId).find('.note_list');
    addNoteToList(noteId, note, noteList);
    let titleBox = $("#noteId_" + noteId).find(".note-head-text");
    titleBox.focus();
    util.selectElementContents(titleBox[0]);
}

function deleteNoteFromUI(noteBox) {
    noteBox.remove();
}

function changeColorInUI(noteBox, color) {
    noteBox.removeClass('blue-pad');
    noteBox.removeClass('green-pad');
    noteBox.removeClass('orange-pad');
    noteBox.removeClass('red-pad');
    noteBox.addClass(color + '-pad');
}

function sortableHandler(event, ui) {
    let item = ui.item;
    let noteId = item.attr("id").split("_")[1];
    let list = item.parent();
    let columnNo = list.parent().data("column");
    let columnIds = [];
    util.eachDomObj(list.find(".note-box"), function (noteBox) {
        columnIds.push(noteBox.attr("id").split("_")[1]);
    });
    quickNotes.changeNotePosition(noteId, columnNo, columnIds);
}

$(document).ready(function () {
    initHandlers();
    setupNotes();
});





