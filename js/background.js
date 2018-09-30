let notes = function () {
    let defaultColumn = 1;
    let defaultColor = 'blue';
    let notesCounter = 1;
    let quickNotes = {
        '1': {
            title: 'Welcome To Quick Notes',
            color: 'blue',
            text: 'Hello! Quick Notes lets you make notes on the fly which are accessible just as you open a new tab.' +
                ' Quick notes helps you organise your notes and color code them as you please.' +
                'The fact that you see them whenever you open a new tab ensures that you donot miss any TODO item.'
        }
    };
    let columnNotes = {
        1: ['1'],
        2: [],
        3: [],
        4: []
    };

    function getNotes() {
        return quickNotes;
    }

    function getColumnNotes() {
        return columnNotes;
    }

    function getNoteById(noteId) {
        if (!quickNotes[noteId]) {
            return null;
        }
        let note = $.extend({}, quickNotes[noteId]);
        let columnId = util.any(columnNotes, function (noteIds, columnNo) {
            let index = noteIds.indexOf(noteId);
            if (index > -1) {
                return columnNo;
            }
        });
        if (note && columnId) {
            note.columnId = columnId;
            return note;
        }
    }

    function setColumnNotes(columnNo, noteIds) {
        columnNotes[columnNo] = noteIds;
        updateStorage();
    }

    function changeNoteTitle(noteId, title) {
        quickNotes[noteId].title = title;
        updateStorage();
    }

    function changeNoteColor(noteId, color) {
        defaultColor = color;
        quickNotes[noteId].color = color;
        updateStorage();
    }

    function changeNoteText(noteId, text) {
        quickNotes[noteId].text = text;
        updateStorage();
    }

    function addNote(columnId) {
        columnId = columnId || defaultColumn;
        notesCounter++;
        let noteId = notesCounter + '';
        quickNotes[noteId] = {
            title: 'New Note',
            color: defaultColor,
            text: ''
        };
        columnNotes[columnId].push(noteId);
        updateStorage();
        return noteId;
    }

    function deleteNote(noteId) {
        delete quickNotes[noteId];
        util.each(columnNotes, function (noteIdList) {
            let index = noteIdList.indexOf(noteId);
            if (index > -1) {
                noteIdList.splice(index, 1);
            }
        });
        updateStorage();
    }

    function changeNotePosition(noteId, columnNo, NodeIdList) {
        util.each(columnNotes, function (noteIdList) {
            let index = noteIdList.indexOf(noteId);
            if (index > -1) {
                noteIdList.splice(index, 1);
            }
        });
        NodeIdList = util.filter(NodeIdList, function (noteId) {
            return quickNotes[noteId]
        });
        columnNotes[columnNo] = NodeIdList;
        updateStorage();
    }

    function updateStorage() {
        try {
            chrome.storage.sync.set({notes: quickNotes, columnNotes: columnNotes, counter: notesCounter}, function () {

            });
        } catch (e) {
        }
    }

    function fetchFromStorage() {
        chrome.storage.sync.get(['notes', 'columnNotes', 'counter'], function (obj) {
            let notes_storage = obj && obj.notes,
                columnNotes_storage = obj && obj.columnNotes,
                counter_storage = obj && obj.counter;
            if (notes_storage && columnNotes_storage && counter_storage && !$.isEmptyObject(notes_storage)) {
                quickNotes = notes_storage;
                notesCounter = counter_storage;
                columnNotes = columnNotes_storage;
            }
        });
    }

    return {
        getNotes: getNotes,
        getColumnNotes: getColumnNotes,
        getNoteById: getNoteById,
        setColumnNotes: setColumnNotes,
        changeNoteTitle: changeNoteTitle,
        changeNoteColor: changeNoteColor,
        changeNoteText: changeNoteText,
        addNote: addNote,
        deleteNote: deleteNote,
        changeNotePosition: changeNotePosition,
        fetchFromStorage: fetchFromStorage
    }
}();

function getNotes() {
    return notes;
}

notes.fetchFromStorage();
