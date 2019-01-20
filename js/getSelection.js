(function () {
    let success = document.execCommand('copy');
    if (success) {
        chrome.runtime.sendMessage(
            chrome.runtime.id,
            {type: 'readClipboard'},
            function (response) {
            }
        );
    }
})();
