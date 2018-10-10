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

let quickNotes = back.getNotes(),
    colors = back.getColors(),
    fonts = back.getFonts();

function initHandlers() {
    $(".note-add-box").click(function (event) {
        let noteId = quickNotes.addNote(getSmallestColumn());
        addNoteToUI(noteId);
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
        quickNotes.deleteNote(noteId);
        deleteNoteFromUI(noteBox);
    });
    noteBox.find(".color-selector").click(function (event) {
        let color = $(event.currentTarget).attr('data-color');
        quickNotes.changeNoteColor(noteId, color);
        setColorInUI(noteBox, color);
    });
    let titleBox = noteBox.find(".note-head-text");
    let textBox = noteBox.find(".note-text");
    titleBox.change(function () {
        quickNotes.changeNoteTitle(noteId, titleBox.val());
    });
    util.attachMutationObserver(textBox[0], function () {
        quickNotes.changeNoteText(noteId, noteBox.find(".note-text").html());
    });
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
}

function deleteNoteFromUI(noteBox) {
    noteBox.remove();
}

function setColorInUI(noteBox, color) {
    noteBox.attr('data-color' + color);
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
    quickNotes.changeNotePosition(noteId, columnNo, columnIds);
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
    initHandlers();
    initUiElements();
    setupNotes();
    initWYSIWYG();
});


/* WYSIWYG */
function initWYSIWYG() {
    let palleteList = colors.getPalleteList(),
        fontList = fonts.getFontList();
    let forePalette = $('.fore-palette');
    let backPalette = $('.back-palette');
    let fontPallete = $('.font-list');

    util.each(palleteList, function (pallete) {
        forePalette.append('<a href="#" data-command="forecolor" data-value="' + '#' + pallete.bg + '" style="background-color:'
            + '#' + pallete.bg + ';" class="palette-item"></a>');
        backPalette.append('<a href="#" data-command="backcolor" data-value="' + '#' + pallete.bg + '" style="background-color:'
            + '#' + pallete.bg + ';" class="palette-item"></a>');
    });

    util.each(fontList, function (fontDetails) {
        fontPallete.append('<a href="#" data-command="fontName" data-value="' + fontDetails.fontFamily + '" style="font-family:'
            + fontDetails.fontFamily + ';" class="font-item">' + fontDetails.name + '</a>');
    });

    $('.toolbar a').click(function (e) {
        let command = $(this).data('command');
        if (command === 'h1' || command === 'h2' || command === 'p') {
            document.execCommand('formatBlock', false, command);
        }
        else if (command === 'forecolor' || command === 'backcolor' || command === 'fontName') {
            document.execCommand(command, false, $(this).data('value'));
        }
        else if (command === 'createlink' || command === 'insertimage') {
            let sel = window.getSelection();
            if (!sel) return;
            let range = null;
            try {
                range = sel.getRangeAt(0);
            } catch (e) {
                return;
            }
            if (!range) return;
            launchLinkQueryPopup(function (url, callback) {
                if (url) {
                    if (!RegExp("^https?://.+").test(url)) {
                        $("#popup_notification").show()
                    } else {
                        callback();
                        sel.removeAllRanges();
                        sel.addRange(range);
                        document.execCommand(command, false, url);
                    }
                } else {
                    callback();
                }
            });
        }
        else {
            document.execCommand($(this).data('command'), false, null);
        }
    });
}




