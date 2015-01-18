// Copyright (c) 2015 Jan Baykara. All rights reserved.
// Use of this source code is governed by the GNU GPL v2.0 license that can be
// found in the LICENSE.md file.

/* -----
| Config
*/

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

var ALCHEMY_API_URL = "http://access.alchemyapi.com/calls/url/URLGetRankedConcepts"
  , ALCHEMY_API_KEY = "951a2ee54070d01a1ef3950a16cb7cadc2ff6590"
  , WIKIPEDIA_API = _.template("http://en.wikipedia.org/w/api.php?action=query&prop=extracts&excontinue=&format=json&exintro=&redirects=&titles={{query}}");

/* -----
| Controller
*/

function JumpDownTheWikipediaHole(message) {
    console.log("=================\nWikipedia append initialising");

    alchemyConcepts(document.URL, function(data) {
        var concepts = data.concepts;
        var summaries = [];
        _.each(concepts, function(concept) {
            // Fetch Wikipedia summary
            wikipediaSummary(concept.text, function(summary) {
                summaries.push({
                    'concept': concept.text,
                    'wikipedia': summary
                });

                if(summaries.length == concepts.length)
                    buildSnippets(summaries);
            });

            // Some other sources?

            // Find some images
        });
    });
}


/* -----
| Functions
*/

function alchemyConcepts(pageURL, callback) {
    $.getJSON(ALCHEMY_API_URL, {
        url: pageURL,
        apikey: ALCHEMY_API_KEY,
        // maxRetrieve: 10,
        outputMode: 'json'
    })
    .success(function(data) {
        callback(data);
    });
}

function wikipediaSummary(string, callback) {
    $.getJSON(WIKIPEDIA_API({'query':string}))
    .success(function(data) {
        callback(_.sample(data.query.pages));
    });
}

function buildSnippets(summaries) {
    $(".DTWH").remove();

    console.log(summaries);

    var snippetTemplate = _.template(
        "<article class='DTWH DTWH-snippet'>\
            <header class='DTWH-snippet__header'>\
                <h3>{{wikipedia.title}}</h3>\
                <small><a href='http://en.wikipedia.org/wiki/{{wikipedia.title}}'>Read full Wikipedia article</a></small>\
                <hr>\
            </header>\
            <div class='DTWH-snippet__body'>\
                {{wikipedia.extract}}\
            </div>\
            <a href='http://en.wikipedia.org/wiki/{{wikipedia.title}}'>Read full Wikipedia article</a>\
        </article>"
    );

    var mark = _.template('<mark class="DTWH DTWH-mark" data-concept="{{a}}">{{b}}</mark>');

    var newHTML = document.body.innerHTML;
    _.each(summaries, function(summary) {
        var search = summary.concept;
        newHTML = newHTML.replace(search, mark({a:summary.concept,b:search}));
    })

    console.log("Marked terms");

    document.body.innerHTML = newHTML;

    _.each(summaries, function(summary) {
        $('mark[data-concept="'+summary.concept+'"]').append(snippetTemplate(summary));
    });

    console.log("Appended snippets");
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