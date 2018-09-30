let util = function () {
    let eventsRegistered = {};

    function sendAjax(url, type, data, successFunction, errorFunction, headers) {
        type = type || "GET";
        data = data || {};
        headers = headers || {};
        $.ajax({
            url: url,
            type: type,
            data: data,
            headers: headers,
            success: function (result) {
                successFunction(result);
            },
            error: function (result) {
                errorFunction(result);
            }
        });
    }

    function ajaxPromise(url, type, data, headers, callbackArgument) {
        return new Promise(function (resolve, reject) {
            if (callbackArgument) {

            } else {
                sendAjax(url, type, data, resolve, reject, headers);
            }
        });
    }

    function isSet(val) {
        switch (typeof val) {
            case "string":
                return val !== undefined && val !== "" && val !== null;
            case "object":
                return val !== null;
            case "number":
            case "boolean":
                return true;
            default:
                return false;
        }
    }

    function isFunction(reference) {
        return typeof reference === "function";
    }

    function isArray(item) {
        return Object.prototype.toString.call(item) === '[object Array]';
    }

    function each(obj, callback) {
        var i, key;
        if (obj) {
            if (obj.constructor === Array) {
                for (i = 0; i < obj.length; i++) {
                    callback(obj[i], i, obj.length);
                }
            } else if (typeof obj === 'object') {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        callback(obj[key], key);
                    }
                }
            }
        }
    }

    function eachDomObj(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback($(list[i]), i, list.length);
        }
    }

    function filter(arr, callback) {
        var array = [],
            i;
        if (arr) {
            for (i = 0; i < arr.length; i++) {
                if (callback(arr[i])) array.push(arr[i]);
            }
        }
        return array;
    }

    function any(obj, callback) {
        if (!isSet(obj)) {
            return;
        }
        if (!isFunction(callback)) {
            callback = function (val, key) {
                return !!val;
            };
        }
        var i = 0,
            length = obj.length,
            returnValue;

        if (isArray(obj)) {
            for (; i < length; i++) {
                returnValue = callback.call(obj[i], obj[i], i);
                if (isSet(returnValue)) {
                    return returnValue;
                }
            }
        } else {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    returnValue = callback.call(obj[i], obj[i], i);
                    if (isSet(returnValue)) {
                        return returnValue;
                    }
                }
            }
        }
    }

    function replaceAll(str, search, replacement) {
        return str.replace(new RegExp(search, 'g'), replacement);
    }

    function getDocFromHTML(html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        return $(doc);
    }

    function getProxy(target, args, scope) {
        scope = scope || null;
        args = args || [];
        return function () {
            var argsCopy = args.slice(0);
            if (arguments.length > 0) {
                Array.prototype.push.apply(argsCopy, Array.prototype.slice.call(arguments));
            }
            target.apply(scope, argsCopy);
        };
    }

    function fireEvent(eventName, args) {
        if (eventsRegistered[eventName]) {
            var func = getProxy(eventsRegistered[eventName], args);
            func();
        }
    }

    function listenEvent(eventName, func) {
        eventsRegistered[eventName] = func;
    }

    function removeEvent(eventName) {
        delete eventsRegistered[eventName];
    }

    function selectElementContents(el) {
        let range = document.createRange();
        range.selectNodeContents(el);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function debounce(func, wait, immediate) {
        let timeout;
        return function () {
            let context = this, args = arguments;
            let later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function attachMutationObserver(element, callback) {
        let debouncedCallback = debounce(callback, 500);
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                switch (mutation.type) {
                    case 'characterData':
                        debouncedCallback();
                        break;
                    case "childList":
                        debouncedCallback();
                        break;
                }
            });
        });
        observer.observe(element, {
            characterData: true,
            childList: true,
            subtree: true
        });
    }

    function handlePaste(e) {
        let clipboardData, pastedData;
        e.stopPropagation();
        e.preventDefault();
        clipboardData = (e.originalEvent || e).clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('text/plain');
        document.execCommand('inserttext', false, pastedData);
    }

    return {
        sendAjax: sendAjax,
        ajaxPromise: ajaxPromise,
        isFunction: isFunction,
        isSet: isSet,
        isArray: isArray,
        each: each,
        eachDomObj: eachDomObj,
        any: any,
        filter: filter,
        replaceAll: replaceAll,
        getDocFromHTML: getDocFromHTML,
        getProxy: getProxy,
        fireEvent: fireEvent,
        listenEvent: listenEvent,
        removeEvent: removeEvent,
        selectElementContents: selectElementContents,
        debounce: debounce,
        attachMutationObserver: attachMutationObserver,
        handlePaste: handlePaste
    }
}();