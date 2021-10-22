const async = require("async");
var sax = require("sax");
var util = require("../bin/util.");
var httpProxy = require("../bin/httpProxy.");

var SPARQLutil = {
    generateTriples: function (graphUri, triples, replaceGraph, callback) {
        var sparqlServerUrl = "http://51.178.139.80:8890/sparql";
        var slicedTriples = util.sliceArray(triples, 1000);
        var totalTriples = 0;
        var uniqueTriples = {};

        async.series(
            [
                function (callbackSeries) {
                    if (!replaceGraph) return callbackSeries();

                    console.log("CLEAR GRAPH <" + graphUri + ">");
                    var queryGraph = "CLEAR GRAPH <" + graphUri + ">";
                    var params = { query: queryGraph };
                    httpProxy.post(sparqlServerUrl, null, params, function (err, result) {
                        return callbackSeries(err);
                    });
                },
                function (callbackSeries) {
                    async.eachSeries(
                        slicedTriples,
                        function (triples, callbackEach) {
                            //    return callbackEach();
                            var triplesStr = "";
                            triples.forEach(function (triple) {
                                var subject = triple.subject;
                                if (subject.indexOf("_:b") == 0);
                                else subject = "<" + subject + ">";

                                var value = triple.object;
                                if (value.indexOf("_:b") == 0);
                                else if (value.indexOf("http") == 0) value = "<" + value + ">";
                                var tripleStr =
                                    subject + " <" + triple.predicate + "> " + value + ".\n";
                                var tripleHash = util.hashCode(tripleStr);
                                if (uniqueTriples[tripleHash]) return;
                                else {
                                    uniqueTriples[tripleHash] = 1;
                                    triplesStr += tripleStr;
                                }
                            });
                            var queryGraph =
                                "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
                                "PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
                                "PREFIX owl: <http://www.w3.org/2002/07/owl#> ";
                            queryGraph += "with <" + graphUri + ">" + "insert {";
                            queryGraph += triplesStr;

                            queryGraph += "}";

                            var params = { query: queryGraph };

                            httpProxy.post(sparqlServerUrl, null, params, function (err, result) {
                                if (err) {
                                    var x = queryGraph;
                                    return callbackEach(err);
                                }
                                totalTriples += triples.length;
                                console.log(totalTriples);
                                return callbackEach(null);
                            });
                        },
                        function (err) {
                            return callbackSeries(err);
                        }
                    );
                },
            ],
            function (err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, "DONE " + totalTriples);
            }
        );
    },
};
module.exports = SPARQLutil;
