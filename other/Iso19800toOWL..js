var fs = require("fs");
const async = require("async");
var util = require("../bin/util.");
var httpProxy = require("../bin/httpProxy.")
const csvCrawler = require("../bin/_csvCrawler.");
const SPARQLutil = require("../bin/SPARQLutil.")

var Iso19800toOWL = {


    parse: function (sourcePath, callback) {
        var data;
        var headers
        var triples = []
        var triples = []
        var classesMap = {}
        var graphUri = "http://souslesens.org/iso19008/cor/"
        var topClassUri = "http://souslesens.org/iso19008/pbs/Iso_19008_COR"


        async.series(
            [
                // read csv
                function (callbackSeries) {
                    csvCrawler.readCsv({filePath: sourcePath}, 5000000, function (err, result) {
                        if (err)
                            return callbackseries(err);
                        data = result.data;
                        headers = result.headers;
                        return callbackSeries();
                    });
                },


                function (callbackSeries) {

                    triples.push({
                        subject: topClassUri,
                        predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        object: "owl:Class",
                    });

                    triples.push({
                        subject: topClassUri,
                        predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                        object: "'" + util.formatStringForTriple('Iso_19008_COR') + "'",
                    });


                    // generates classes
                    data[0].forEach(function (item) {
                        var uri = graphUri + util.formatStringForTriple(item.cORCode, true)
                        classesMap[item.cORCode] = uri

                        triples.push({
                            subject: uri,
                            predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            object: "owl:Class",
                        });

                        triples.push({
                            subject: uri,
                            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                            object: "'" + util.formatStringForTriple(item.cORName) + "'",
                        });
                        if (item.cORDescription) {
                            triples.push({
                                subject: uri,
                                predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                                object: "'" + util.formatStringForTriple(item.cORDescription) + "'",
                            });
                        }

                    })
                    return callbackSeries();
                }
                , function (callbackSeries) {
                var existingCodes = {}
                data[0].forEach(function (item) {
                    //hierarchy

                    if (!existingCodes[item.cORCode]) {
                        existingCodes[item.cORCode] = 1
                        var uri = classesMap[item.cORCode]
                        var parentUri;
                        if (item.cORCode.length == 1)
                            parentUri = topClassUri
                        else {
                            var parentCode = item.cORCode.substring(0, item.cORCode.length - 1)
                            parentUri = classesMap[parentCode]
                        }
                        triples.push({
                            subject: uri,
                            predicate: "http://www.w3.org/2000/01/rdf-schema#subClassOf",
                            object: parentUri
                        })


                    }
                })

                return callbackSeries();
            },
                function (callbackSeries) {
                    SPARQLutil.generateTriples(graphUri, triples, true,function (err, result) {
                        if (err)
                            return console.log(err)
                        console.log(result)
                    })
                }
            ]
            ,

            function (err) {
                if (err)
                    return console.log(err)
                var x = triples
                console.log("DONE")
            }
        )
    },

    parseMappings:function(sourcePath){
        var data;
        var headers
        var triples = []
        var triples = []
        var classesMap = {}
        var graphUri = "http://souslesens.org/iso19008/cor/"
        var topClassUri = "http://souslesens.org/iso19008/pbs/Iso_19008_COR"


        async.series(
            [
                // read csv
                function (callbackSeries) {
                    csvCrawler.readCsv({filePath: sourcePath}, 5000000, function (err, result) {
                        if (err)
                            return callbackseries(err);
                        data = result.data;
                        headers = result.headers;
                        return callbackSeries();
                    });
                },


                function (callbackSeries) {


                    // generates classes
                    data[0].forEach(function (item) {

                        if( item.cORCode &&  item.sABCode){
                            var uri = graphUri + util.formatStringForTriple(item.cORCode, true)


                        }
                            var uri = graphUri + util.formatStringForTriple(item.cORCode, true)
                        classesMap[item.cORCode] = uri

                        triples.push({
                            subject: uri,
                            predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            object: "owl:Class",
                        });

                        triples.push({
                            subject: uri,
                            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                            object: "'" + util.formatStringForTriple(item.cORName) + "'",
                        });
                        if (item.cORDescription) {
                            triples.push({
                                subject: uri,
                                predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                                object: "'" + util.formatStringForTriple(item.cORDescription) + "'",
                            });
                        }

                    })
                    return callbackSeries();
                }
                , function (callbackSeries) {
                var existingCodes = {}
                data[0].forEach(function (item) {
                    //hierarchy

                    if (!existingCodes[item.cORCode]) {
                        existingCodes[item.cORCode] = 1
                        var uri = classesMap[item.cORCode]
                        var parentUri;
                        if (item.cORCode.length == 1)
                            parentUri = topClassUri
                        else {
                            var parentCode = item.cORCode.substring(0, item.cORCode.length - 1)
                            parentUri = classesMap[parentCode]
                        }
                        triples.push({
                            subject: uri,
                            predicate: "http://www.w3.org/2000/01/rdf-schema#subClassOf",
                            object: parentUri
                        })


                    }
                })

                return callbackSeries();
            },
                function (callbackSeries) {
                    SPARQLutil.generateTriples(graphUri, triples, true,function (err, result) {
                        if (err)
                            return console.log(err)
                        console.log(result)
                    })
                }
            ]
            ,

            function (err) {
                if (err)
                    return console.log(err)
                var x = triples
                console.log("DONE")
            }
        )




    }


}
module.exports = Iso19800toOWL

var sourcePath = "D:\\NLP\\ontologies\\19008\\annexeC.csv"
//Iso19800toOWL.parse(sourcePath)

var sourcePath = "D:\\NLP\\ontologies\\19008\\annexeE.csv"
Iso19800toOWL.parseMappings(sourcePath)