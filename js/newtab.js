let ui = {
    noteBox: $('<div class="note-box">' +
        '         <div class="note-pad">' +
        '             <div class="note-head">' +
        '                 <div class="note-head-front">' +
        '                     <div class="note-move-box">' +
        '                         <div class="note-move-icon"></div>' +
        '                     </div>' +
        '                     <div class="note-head-text-cover">' +
        '                         <input class="note-head-text" spellcheck="false" placeholder="New Note">' +
        '                     </div>' +
        '                     <div class="note-options">' +
        '                         <div class="note-options-icons"></div>' +
        '                     </div>' +
        '                 </div>' +
        '                 <div class="note-head-back">' +
        '                     <div class="color-list"></div>' +
        '                     <div class="note-options">' +
        '                         <div class="note-options-icons"></div>' +
        '                     </div>' +
        '                     <div class="note-delete"><i class="material-icons">delete_forever</i></div>' +
        '                 </div>' +
        '             </div>' +
        '             <div class="note-text" contenteditable="true" spellcheck="false">' +
        '             </div>' +
        '         </div>' +
        '     </div>'),
    popupWrapper: $('<div class="popup-wrapper">' +
        '        <div class="popup">' +
        '            <div class="popup_query">Link Please.</div>' +
        '            <input id="popup_input" type="url" placeholder="Paste Link Here">' +
        '            <div id="popup_buttons">' +
        '               <button id="popup_submit">Submit</button>' +
        '               <button id="popup_cancel">Cancel</button>' +
        '            </div>' +
        '            <div id="popup_notification">Valid links start with http:// or https://</div>' +
        '        </div>' +
        '    </div>')
};

function initHandlers() {
    $(".note-add-box").click(function (event) {
        qN.addNote();
    });
    $(document).click(function (event) {
        if(!$(event.target).closest(".flip").length) {
            $(".flip").removeClass("flip");
        }
    });
    chrome.runtime.onMessage.addListener(
        function (request, sender) {
            if (request.from === "quickNotes") {
                if (request.info === "storageUpdated") {
                    let message = request.message;
                    if (message.columnNotes && message.notes) {
                        qN.updateNotesInUi(message.columnNotes, message.notes)
                    }
                }
            }
        });
}

function initUiElements() {
    let colorList = ui.noteBox.find('.color-list');
    let palleteList = colors.getPalleteList();
    util.each(palleteList, function (pallete) {
        if (pallete.noteColor) {
            colorList.append('<div class="color-box"><div class="color-selector" data-color="' + pallete.name + '" style="background-color: #' + pallete.bg + '"></div></div>');
        }
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
    setColorInUI(noteBox, note.color);
    noteBox.attr('id', 'noteId_' + noteId);
    noteBox.find(".note-head-text").val(note.title);
    noteBox.find(".note-text").html(note.text);
    noteBox.find(".note-head-text").focus(function (event) {
        $(this).select();
    });
    noteBox.find(".note-options").click(function (event) {
        noteBox.find(".note-head").toggleClass("flip");
    });
    noteBox.find(".note-delete").click(function (event) {
        qN.deleteNote(noteId);
    });
    noteBox.find(".color-selector").click(function (event) {
        let color = $(event.currentTarget).attr('data-color');
        qN.changeNoteColor(noteId, color);
    });
    let titleBox = noteBox.find(".note-head-text");
    let textBox = noteBox.find(".note-text");
    setupTextBoxHandlers(textBox);
    titleBox.change(function () {
        qN.changeNoteTitle(noteId, titleBox.val());
    });
    util.attachMutationObserver(textBox[0], function () {
        qN.changeNoteText(noteId, noteBox.find(".note-text").html());
    });
    list.append(noteBox);
}

function updateNoteInUi(noteId, note) {
    let noteBox = $("#noteId_" + noteId);
    if (!noteBox) return;
    setColorInUI(noteBox, note.color);
    noteBox.find(".note-head-text").val(note.title);
    noteBox.find(".note-text").html(note.text);
}

function setupNotes() {
    let notes = qN.getNotes();
    let columnNotes = qN.getColumnNotes();
    $(".note_list").remove();
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
    let note = qN.getNoteById(noteId);
    let columnId = note.columnId;
    let noteList = $("#column_" + columnId).find('.note_list');
    addNoteToList(noteId, note, noteList);
    let titleBox = $("#noteId_" + noteId).find(".note-head-text");
    titleBox.focus();
}

function setupTextBoxHandlers(textBox) {
    textBox.on('keydown keypress', function (event) {
        if (event.keyCode === 9) { // tab key
            event.preventDefault();
            if (event.shiftKey) {
                document.execCommand('outdent', false, null);
            }
            else {
                document.execCommand('indent', false, null);
            }
        }
    });
}

function setColorInUI(noteBox, color) {
    noteBox.attr('data-color', color);
    let notePad = noteBox.find('.note-pad'),
        dragIcon = notePad.find('.note-move-icon'),
        optionIcon = notePad.find('.note-options-icons'),
        pallete = colors.getPalleteForColor(color),
        selectors = notePad.find('.color-selector');
    if (pallete.name && pallete.bg && pallete.text) {
        notePad.css({
            'background-color': '#' + pallete.bg,
            'color': '#' + pallete.text
        });
        dragIcon.attr("style", "--iconColor: #" + pallete.text);
        optionIcon.attr("style", "--iconColor: #" + pallete.text);
        util.eachDomObj(selectors, function (selector) {
            if (selector.data("color") === color) {
                selector.css("border", "2px solid #" + pallete.text);
            } else {
                selector.css("border", "");
            }
        })
    }
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
    qN.changeNotePosition(noteId, columnNo, columnIds);
}

function launchLinkQueryPopup(callback) {
    let popupWrapper = ui.popupWrapper.clone();
    let submit = popupWrapper.find("#popup_submit"),
        cancel = popupWrapper.find("#popup_cancel"),
        input = popupWrapper.find("#popup_input");
    submit.click(function () {
        callback(input.val(), function () {
            popupWrapper.remove();
        });
    });
    cancel.click(function () {
        callback(null, function () {
            popupWrapper.remove();
        });
    });
    $(".full_body").append(popupWrapper);
    input.focus();
}

$(document).ready(function () {
    let image_number = Math.floor(Math.random() * 20) + 1;
    $('head').append('<style>html:before{background-image: url("https://sagar0907.github.io/static/images/quicknotes/background/q_' + image_number + '.jpeg");}</style>');
    initHandlers();
    initUiElements();
    setupNotes();
    initWYSIWYG();
});

