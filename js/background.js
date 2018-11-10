let colors = function () {
    let colorList = ['black', 'darkGray', 'darkBlue', 'blue', 'green', 'red', 'pink', 'orange', 'yellow', 'white'];
    let pallete = {
        black: {
            name: 'black',
            bg: '000000',
            rgb: "rgb(0, 0, 0)",
            text: 'FFFFFF'
        },
        darkGray: {
            name: 'darkGray',
            bg: '555555',
            rgb: "rgb(85, 85, 85)",
            text: 'FFFFFF',
            noteColor: true
        },
        darkBlue: {
            name: 'darkBlue',
            bg: '1287A8',
            rgb: "rgb(18, 135, 168)",
            text: 'FFFFFF',
            noteColor: true
        },
        blue: {
            name: 'blue',
            bg: '29B6F6',
            rgb: "rgb(41, 182, 246)",
            text: 'FFFFFF'
        },
        green: {
            name: 'green',
            bg: '66BB6A',
            rgb: "rgb(102, 187, 106)",
            text: 'FFFFFF',
            noteColor: true
        },
        red: {
            name: 'red',
            bg: 'EF5350',
            rgb: "rgb(239, 83, 80)",
            text: 'FFFFFF',
            noteColor: true
        },
        pink: {
            name: 'pink',
            bg: 'F06292',
            rgb: "rgb(240, 98, 146)",
            text: 'FFFFFF'
        },
        orange: {
            name: 'orange',
            bg: 'FFA726',
            rgb: "rgb(255, 167, 38)",
            text: 'FFFFFF'
        },
        yellow: {
            name: 'yellow',
            bg: 'EED359',
            rgb: "rgb(238, 211, 89)",
            text: '555555',
            noteColor: true
        },
        white: {
            name: 'white',
            bg: 'FFFFFF',
            rgb: "rgb(255, 255, 255)",
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
    let fontList = ["Arial", "Alegreya", "Courier New", "Dancing Script", "EB Garamond", "Helvetica", "Impact", "Lato", "Montserrat", "Noto Sans", "Oswald", "Oxygen", "Quicksand", "Roboto", "Roboto Mono", "Times", "Varela Round"];
    let fontDetails = {
        "Arial": {
            name: "Arial",
            fontFamily: "Arial",
            familyName: "Arial"
        },
        "Alegreya": {
            name: "Alegreya",
            fontFamily: "Alegreya",
            familyName: "Alegreya"
        },
        "Courier New": {
            name: "Courier New",
            fontFamily: "Courier New",
            familyName: '"Courier New"'
        },
        "Dancing Script": {
            name: "Dancing Script",
            fontFamily: "Dancing Script",
            familyName: '"Dancing Script"'
        },
        "EB Garamond": {
            name: "EB Garamond",
            fontFamily: "EB Garamond",
            familyName: '"EB Garamond"'
        },
        "Helvetica": {
            name: "Helvetica",
            fontFamily: "Helvetica",
            familyName: "Helvetica"
        },
        "Impact": {
            name: "Impact",
            fontFamily: "Impact",
            familyName: "Impact"
        },
        "Lato": {
            name: "Lato",
            fontFamily: "Lato",
            familyName: "Lato"
        },
        "Montserrat": {
            name: "Montserrat",
            fontFamily: "Montserrat",
            familyName: "Montserrat"
        },
        "Noto Sans": {
            name: "Noto Sans",
            fontFamily: "Noto Sans",
            familyName: '"Noto Sans"'
        },
        "Oswald": {
            name: "Oswald",
            fontFamily: "Oswald",
            familyName: "Oswald"
        },
        "Oxygen": {
            name: "Oxygen",
            fontFamily: "Oxygen",
            familyName: "Oxygen"
        },
        "Quicksand": {
            name: "Quicksand",
            fontFamily: "Quicksand",
            familyName: "Quicksand"
        },
        "Roboto": {
            name: "Roboto",
            fontFamily: "Roboto",
            familyName: "Roboto"
        },
        "Roboto Mono": {
            name: "Roboto Mono",
            fontFamily: "Roboto Mono",
            familyName: '"Roboto Mono"'
        },
        "Times": {
            name: "Times",
            fontFamily: "Times",
            familyName: "Times"
        },
        "Varela Round": {
            name: "Varela Round",
            fontFamily: "Varela Round",
            familyName: '"Varela Round"'
        }
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

let fontSizes = function () {
    let sizeList = ["1", "2", "3", "4", "5", "6", "7"];
    let sizeDetails = {
        "1": {
            sizeNo: "1",
            fontSize: "12"
        },
        "2": {
            sizeNo: "2",
            fontSize: "14"
        },
        "3": {
            sizeNo: "3",
            fontSize: "16"
        },
        "4": {
            sizeNo: "4",
            fontSize: "18"
        },
        "5": {
            sizeNo: "5",
            fontSize: "20"
        },
        "6": {
            sizeNo: "6",
            fontSize: "22"
        },
        "7": {
            sizeNo: "7",
            fontSize: "24"
        }
    };

    function getFontSizeList() {
        let list = [];
        util.each(sizeList, function (sizeNo) {
            list.push(sizeDetails[sizeNo]);
        });
        return list;
    }

    function getDetailsForFontSize(sizeNo) {
        return sizeDetails[sizeNo];
    }

    return {
        getFontSizeList: getFontSizeList,
        getDetailsForFontSize: getDetailsForFontSize
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
        return _.cloneDeep(quickNotes);
    }

    function getColumnNotes() {
        return _.cloneDeep(columnNotes);
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

    function changeNotePosition(noteId, columnNo, columnIds) {
        util.each(columnNotes, function (noteIdList) {
            let index = noteIdList.indexOf(noteId);
            if (index > -1) {
                noteIdList.splice(index, 1);
            }
        });
        columnIds = util.filter(columnIds, function (noteId) {
            return quickNotes[noteId]
        });
        columnNotes[columnNo] = columnIds;
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

    function handleStorageChange(changes) {
        if (changes.counter && changes.counter.newValue) {
            notesCounter = changes.counter.newValue;
        }
        if (changes.columnNotes && changes.columnNotes.newValue) {
            columnNotes = changes.columnNotes.newValue
        }
        if (changes.notes && changes.notes.newValue) {
            quickNotes = changes.notes.newValue;
        }
        if (changes.columnNotes || changes.notes) {
            triggerChangesInUi(columnNotes, quickNotes);
        }
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
        fetchFromStorage: fetchFromStorage,
        handleStorageChange: handleStorageChange
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

function getFontSizes() {
    return fontSizes;
}

function addStorageChangeHandler() {
    chrome.storage.onChanged.addListener(notes.handleStorageChange);
}

function triggerChangesInUi(columnNotes, notes) {
    chrome.tabs.query({}, function (tabs) {
        let message = {
            from: "quickNotes",
            info: "storageUpdated",
            message: {
                columnNotes: columnNotes,
                notes: notes
            }
        };
        util.each(tabs, function (tab) {
            chrome.tabs.sendMessage(tab.id, message);
        });
    });
}

notes.fetchFromStorage();
addStorageChangeHandler();
