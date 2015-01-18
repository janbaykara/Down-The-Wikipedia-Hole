// Copyright (c) 2015 Jan Baykara. All rights reserved.
// Use of this source code is governed by the GNU GPL v2.0 license that can be
// found in the LICENSE.md file.

/* -----
| Config
*/

var ALCHEMY_KEY = "951a2ee54070d01a1ef3950a16cb7cadc2ff6590";


/* -----
| Controller
*/

function JumpDownTheWikipediaHole(message) {
    console.log("=================\nWikipedia append initialising "+ALCHEMY_KEY);
}


/* -----
| Extension UI event listeners
*/

function ListeningMethod(message, sender, callback) {
    console.log("Heard a message: "+message);
    if (message == 'JumpDownTheWikipediaHole') {
        JumpDownTheWikipediaHole(message);
    }
}

chrome.extension.onMessage.addListener(ListeningMethod);