let back = chrome.extension.getBackgroundPage();

let qN = function () {
    let quickNotes = back.getNotes();
    let notes = quickNotes.getNotes();
    let columnNotes = quickNotes.getColumnNotes();

    function getNotes() {
        return notes;
    }

    function getColumnNotes() {
        return columnNotes;
    }

    function getNoteById(noteId) {
        return quickNotes.getNoteById(noteId);
    }

    function addNote() {
        let noteId = quickNotes.addNote(getSmallestColumn());
        let note = quickNotes.getNoteById(noteId);
        let columnId = note.columnId;
        columnNotes[columnId].push(noteId);
        notes[noteId] = note;
        addNoteToUI(noteId);
    }

    function deleteNote(noteId) {
        delete notes[noteId];
        util.each(columnNotes, function (noteIdList) {
            let index = noteIdList.indexOf(noteId);
            if (index > -1) {
                noteIdList.splice(index, 1);
            }
        });
        quickNotes.deleteNote(noteId);
        $("#noteId_" + noteId).remove();
    }

    function changeNoteTitle(noteId, title) {
        notes[noteId].title = title;
        quickNotes.changeNoteTitle(noteId, title);
    }

    function changeNoteColor(noteId, color) {
        notes[noteId].color = color;
        quickNotes.changeNoteColor(noteId, color);
        setColorInUI($("#noteId_" + noteId), color);
    }

    function changeNoteText(noteId, text) {
        notes[noteId].text = text;
        quickNotes.changeNoteText(noteId, text);
    }

    function changeNotePosition(noteId, columnNo, columnIds) {
        util.each(columnNotes, function (noteIdList) {
            let index = noteIdList.indexOf(noteId);
            if (index > -1) {
                noteIdList.splice(index, 1);
            }
        });
        columnIds = util.filter(columnIds, function (noteId) {
            return notes[noteId]
        });
        columnNotes[columnNo] = columnIds;
        quickNotes.changeNotePosition(noteId, columnNo, columnIds);
    }

    function updateNotesInUi(_columnNotes, _notes) {
        if (_columnNotes && !_.isEqual(_columnNotes, columnNotes)) {
            columnNotes = _columnNotes;
            if (_notes) {
                notes = _notes;
            }
            setupNotes();
        } else if (_notes && !_.isEqual(_notes, notes)) {
            util.each(_notes, function(_noteObj, _noteId) {
                if (!_.isEqual(_noteObj, notes[_noteId])) {
                    updateNoteInUi(_noteId, _noteObj);
                }
            });
            notes = _notes;
        }
    }

    return {
        getNotes: getNotes,
        getColumnNotes: getColumnNotes,
        getNoteById: getNoteById,
        addNote: addNote,
        deleteNote: deleteNote,
        changeNoteTitle: changeNoteTitle,
        changeNoteColor: changeNoteColor,
        changeNoteText: changeNoteText,
        changeNotePosition: changeNotePosition,
        updateNotesInUi: updateNotesInUi
    };
}();
