let colors = function () {
    let colorList = ['black', 'darkGray', 'darkBlue', 'blue', 'green', 'red', 'pink', 'orange', 'yellow', 'white'];
    let pallete = {
        black: {
            name: 'black',
            bg: '000000',
            text: 'FFFFFF'
        },
        darkGray: {
            name: 'darkGray',
            bg: '555555',
            text: 'FFFFFF',
            noteColor: true
        },
        darkBlue: {
            name: 'darkBlue',
            bg: '1287A8',
            text: 'FFFFFF',
            noteColor: true
        },
        blue: {
            name: 'blue',
            bg: '29B6F6',
            text: 'FFFFFF'
        },
        green: {
            name: 'green',
            bg: '66BB6A',
            text: 'FFFFFF',
            noteColor: true
        },
        red: {
            name: 'red',
            bg: 'EF5350',
            text: 'FFFFFF',
            noteColor: true
        },
        pink: {
            name: 'pink',
            bg: 'F06292',
            text: 'FFFFFF'
        },
        orange: {
            name: 'orange',
            bg: 'FFA726',
            text: 'FFFFFF'
        },
        yellow: {
            name: 'yellow',
            bg: 'EED359',
            text: '555555',
            noteColor: true
        },
        white: {
            name: 'white',
            bg: 'FFFFFF',
            text: '555555',
            noteColor: true
        }
    };

    function getPalleteList() {
        let palleteList = [];
        util.each(colorList, function (name) {
            palleteList.push(pallete[name]);
        });
        return palleteList;
    }

    function getPalleteForColor(name) {
        return pallete[name];
    }

    return {
        getPalleteList: getPalleteList,
        getPalleteForColor: getPalleteForColor
    }
}();

let fonts = function () {
    let fontList = ["Arial", "Helvetica", "Noto Sans", "Times", "Times New Roman", "Courier New", "Impact"];
    let fontDetails = {
        "Arial": {
            name: "Arial",
            fontFamily: "Arial"
        },
        "Helvetica": {
            name: "Helvetica",
            fontFamily: "Helvetica"
        },
        "Noto Sans": {
            name: "Noto Sans",
            fontFamily: "Noto Sans"
        },
        "Times": {
            name: "Times",
            fontFamily: "Times"
        },
        "Times New Roman": {
            name: "Times New Roman",
            fontFamily: "Times New Roman"
        },
        "Courier New": {
            name: "Courier New",
            fontFamily: "Courier New"
        },
        "Impact": {
            name: "Impact",
            fontFamily: "Impact"
        },
    };

    function getFontList() {
        let list = [];
        util.each(fontList, function (name) {
            list.push(fontDetails[name]);
        });
        return list;
    }

    function getDetailsForFont(name) {
        return fontDetails[name];
    }

    return {
        getFontList: getFontList,
        getDetailsForFont: getDetailsForFont
    }
}();

let notes = function () {
    let defaultColumn = 1;
    let defaultColor = 'white';
    let notesCounter = 1;
    let quickNotes = {
        '1': {
            "color": "yellow",
            "text": "<img src=\"http://sagar0907.github.io/static/images/quicknotes/Quick_Notes_blue_600x200.png\"><div><div>Hello Organised Human!</div><div><br></div><div>Quick Notes lets you make notes on the fly which are accessible at the launch a new tab.</div><div>It helps you organise your notes and color code them as you please. It lets you add rich formatted text, images and links. Also drag and drop pretty much any thing you find interesting while you browse the internet.</div></div><div><br></div><div>Thank You.</div>",
            "title": "Welcome to Quick Notes."
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
            title: '',
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
        chrome.storage.sync.set({notes: quickNotes, columnNotes: columnNotes, counter: notesCounter}, function () {
            if (chrome.runtime.lastError) {
            }
        });
    }

    function fetchFromStorage() {
        chrome.storage.sync.get(['notes', 'columnNotes', 'counter'], function (obj) {
            if (chrome.runtime.lastError) {
            } else {
                let notes_storage = obj && obj.notes,
                    columnNotes_storage = obj && obj.columnNotes,
                    counter_storage = obj && obj.counter;
                if (notes_storage && columnNotes_storage && counter_storage && !$.isEmptyObject(notes_storage)) {
                    quickNotes = notes_storage;
                    notesCounter = counter_storage;
                    columnNotes = columnNotes_storage;
                }
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

function getColors() {
    return colors;
}

function getFonts() {
    return fonts;
}

notes.fetchFromStorage();
