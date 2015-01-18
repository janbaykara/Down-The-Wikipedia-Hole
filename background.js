// Copyright (c) 2015 Jan Baykara. All rights reserved.
// Use of this source code is governed by the GNU GPL v2.0 license that can be
// found in the LICENSE.md file.

/* -----
| Extension UI event handlers
*/

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({
        code: 'console.log("Clicked DTWH button")'
    });
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, 'JumpDownTheWikipediaHole');
    });
});