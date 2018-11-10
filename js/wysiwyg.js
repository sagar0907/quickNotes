let colors = back.getColors(),
    fonts = back.getFonts(),
    fontSizes = back.getFontSizes(),
    palleteList = colors.getPalleteList(),
    fontList = fonts.getFontList(),
    fontSizeList = fontSizes.getFontSizeList();

function initWYSIWYG() {
    let forePalette = $('.fore-palette');
    let backPalette = $('.back-palette');
    let fontPallete = $('.font-list');
    let fontSizePallete = $('.fsize-list');

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

    util.each(fontSizeList, function (fontSizeDetails) {
        fontSizePallete.append('<a href="#" data-command="fontSize" data-value="' + fontSizeDetails.sizeNo + '">' + fontSizeDetails.fontSize + '</a>');
    });

    $('.toolbar a').click(function (e) {
        let sel = window.getSelection();
        let command = $(this).data('command');
        if (command === 'h1' || command === 'h2' || command === 'p') {
            document.execCommand('formatBlock', false, command);
        }
        else if (command === 'forecolor' || command === 'backcolor' || command === 'fontName' || command === 'fontSize') {
            document.execCommand(command, false, $(this).data('value'));
        }
        else if (command === 'createlink' || command === 'insertimage') {
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
        e.preventDefault();
    });
}

function resetToolbar() {
    let foreColor = document.queryCommandValue("ForeColor");
    let backColor = document.queryCommandValue("BackColor");
    let fontName = document.queryCommandValue("fontName");
    let fontSizeNo = document.queryCommandValue("fontSize");
    let isBold = document.queryCommandState("bold");
    let isItalic = document.queryCommandState("italic");
    let isUnderline = document.queryCommandState("underline");
    let isStrikeThrough = document.queryCommandState("strikethrough");
    let isJustifyLeft = document.queryCommandState("justifyLeft");
    let isJustifyCenter = document.queryCommandState("justifyCenter");
    let isJustifyRight = document.queryCommandState("justifyRight");
    let isJustifyFull = document.queryCommandState("justifyFull");
    let isInsertUnorderedList = document.queryCommandState("insertUnorderedList");
    let isInsertOrderedList = document.queryCommandState("insertOrderedList");
    let isSubscript = document.queryCommandState("subscript");
    let isSuperscript = document.queryCommandState("superscript");
    let boldColor = isBold ? 'rgb(18, 135, 168)' : 'inherit';
    let italicColor = isItalic ? 'rgb(18, 135, 168)' : 'inherit';
    let underlineColor = isUnderline ? 'rgb(18, 135, 168)' : 'inherit';
    let strikeThroughColor = isStrikeThrough ? 'rgb(18, 135, 168)' : 'inherit';
    let justifyLeftColor = isJustifyLeft ? 'rgb(18, 135, 168)' : 'inherit';
    let justifyCenterColor = isJustifyCenter ? 'rgb(18, 135, 168)' : 'inherit';
    let justifyRightColor = isJustifyRight ? 'rgb(18, 135, 168)' : 'inherit';
    let justifyFullColor = isJustifyFull ? 'rgb(18, 135, 168)' : 'inherit';
    let unorderedListColor = isInsertUnorderedList ? 'rgb(18, 135, 168)' : 'inherit';
    let orderedListColor = isInsertOrderedList ? 'rgb(18, 135, 168)' : 'inherit';
    let subscriptColor = isSubscript ? 'rgb(18, 135, 168)' : 'inherit';
    let superscriptColor = isSuperscript ? 'rgb(18, 135, 168)' : 'inherit';
    let fColor = "rgba(255, 255, 255)";
    let bColor = "rgba(255, 255, 255)";
    let fName = "Montserrat";
    let fSize = "14";
    util.each(palleteList, function (pallete) {
        if (pallete.rgb === foreColor) {
            fColor = foreColor;
        }
        if (pallete.rgb === backColor) {
            bColor = backColor;
        }
    });
    util.each(fontList, function (fontDetails) {
        if (fontDetails.familyName === fontName) {
            fName = fontDetails.name;
        }
    });
    util.each(fontSizeList, function (fontSizeDetails) {
        if (fontSizeDetails.sizeNo === fontSizeNo) {
            fSize = fontSizeDetails.fontSize;
        }
    });
    $(".fore-wrapper .tool-color").css({
        'background-color': fColor
    });
    $(".back-wrapper .tool-color").css({
        'background-color': bColor
    });
    $(".font-name").html(fName);

    $(".font-size").html(fSize);

    $("[data-command='bold']").css({
        color: boldColor
    });
    $("[data-command='italic']").css({
        color: italicColor
    });
    $("[data-command='underline']").css({
        color: underlineColor
    });
    $("[data-command='strikeThrough']").css({
        color: strikeThroughColor
    });
    $("[data-command='justifyLeft']").css({
        color: justifyLeftColor
    });
    $("[data-command='justifyCenter']").css({
        color: justifyCenterColor
    });
    $("[data-command='justifyRight']").css({
        color: justifyRightColor
    });
    $("[data-command='justifyFull']").css({
        color: justifyFullColor
    });
    $("[data-command='insertUnorderedList']").css({
        color: unorderedListColor
    });
    $("[data-command='insertOrderedList']").css({
        color: orderedListColor
    });
    $("[data-command='subscript']").css({
        color: subscriptColor
    });
    $("[data-command='superscript']").css({
        color: superscriptColor
    });
}

document.addEventListener("selectionchange", function () {
    resetToolbar();
});



