// Copyright (c) 2015 Jan Baykara. All rights reserved.
// Use of this source code is governed by the GNU GPL v2.0 license that can be
// found in the LICENSE.md file.

/* -----
| Config
*/

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

var ALCHEMY_API_URL = "http://access.alchemyapi.com/calls/url/URLGetRankedKeywords"
  , ALCHEMY_API_KEY = "951a2ee54070d01a1ef3950a16cb7cadc2ff6590"
  , WIKIPEDIA_API = _.template("http://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=500&excontinue=&format=json&exintro=&redirects=&titles={{query}}");
    // &titles=separated|like|this
    // prop=pageterms
        // alt names
        // description
    // prop=pageprops
        // page_image
    // export=
        // $("page") <title>=pagetitle <text>

/* -----
| Controller
*/

function JumpDownTheWikipediaHole(message) {
    console.log("=================\nWikipedia append initialising");

    alchemyConcepts(document.URL, function(data) {
        var concepts = data.keywords;
        var relevantKeywords = _.filter(concepts, function(concept) { return concept.relevance > 0.8 });
        var summaries = [];
        // console.log(concepts);
        _.each(relevantKeywords, function(concept) {
            console.log(concept);
            wikipediaSummary(concept.text, function(summary) {
                summaries.push({
                    'concept': concept.text,
                    'wikipedia': summary
                });

                if(summaries.length == relevantKeywords.length) {
                    console.log("Building snippets.")
                    console.log(summaries);
                    buildSnippets(summaries);
                }
            });
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
        outputMode: 'json',
        keywordExtractMode: 'strict'
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
    console.log(summaries);
    $(".DTWH").remove();

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
        console.log(summary);
        var search = summary.concept;
        newHTML = newHTML.replace(search, mark({a:summary.concept,b:search}));
    })

    document.body.innerHTML = newHTML;

    _.each(summaries, function(summary) {
        $('mark[data-concept="'+summary.concept+'"]').append(snippetTemplate(summary));
    });
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