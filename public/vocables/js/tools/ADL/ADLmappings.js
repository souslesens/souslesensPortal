/** The MIT License
 Copyright 2020 Claude Fauconnet / SousLesens Claude.fauconnet@gmail.com

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var ADLmappings = (function () {

        var self = {}
        self.currentModelSource;
        self.prefixes = {
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdf",
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdfs",
            "http://www.w3.org/2002/07/owl#": "owl",
            "http://data.total.com/resource/one-model/ontology/": "total"


        }


        var dbName;

        //  self.currentMappingsMap={type:"",joins:[],relations:[] }
        self.currentMappingsMap = null;
        self.currentMappedColumns = null;
        self.init = function () {
            self.subjectPropertiesMap = {}
            self.typedObjectsMap = {}
            self.sheetJoinColumns = {}
            self.currentMappedColumns = {}
            constraintsMap = {}
            // ADLcommon.allObjectsMap = {}

        }


        self.onLoaded = function () {
            self.init()


            $("#actionDivContolPanelDiv").html("ADL database &nbsp;<select onchange='ADLmappingData.loadADL_SQLModel()' id=\"ADLmappings_DatabaseSelect\"> </select>  ");

            $("#actionDiv").html(" <div id=\"ADLmappings_dataModelTree\"  style=\"width:400px\"></div>");
            $("#accordion").accordion("option", {active: 2});

            MainController.UI.toogleRightPanel(true)
            $("#graphDiv").load("./snippets/ADL/ADLmappings.html");
            $("#rightPanelDiv").load("snippets/ADL/ADLmappingRightPanel.html");
            setTimeout(function () {

                $("#ADLmappings_OneModelTab").html(" <button onclick=\"ADLmappings.displayOneModelTree()\">reload</button>" +
                    "<div> Ontology  Properties <div id=\"ADLmappings_OneModelTree\" style=\"width:400px\"></div></div>")
                self.currentModelSource = Config.ADL.OneModelSource;
                ADLmappingData.initAdlsList()

                ADLcommon.Ontology.load(Config.ADL.OneModelSource, function (err, result) {
                    if (err)
                        return MainController.UI.message(err)
                    ADLmappings.displayOneModelTree()
                })


            }, 200)
        }

        //
        self.onSourceSelect = function (source) {

            self.clearMappings()
            OwlSchema.currentADLdatabaseSchema = null;
            visjsGraph.clearGraph()

            ADLcommon.Ontology.load(Config.ADL.OneModelSource, function (err, result) {
                if (err)
                    return MainController.UI.message(err)
            })

        }


        //!!! shared by OneModelOntology and sourceBrowser(search)
        self.selectTreeNodeFn = function (event, propertiesMap) {
            if (!ADLmappingData.currentColumn)
                return alert("select a column")
            self.AssignOntologyTypeToColumn(ADLmappingData.currentColumn, propertiesMap.node)
        }


        self.displayOneModelTree = function () {
            var propJstreeData = []

            propJstreeData.push({
                id: "http://www.w3.org/2002/07/owl#DatatypeProperty",
                text: "owl:DatatypePropertyOf",
                parent: "#",
                data: {
                    type: "DatatypePropertyOf",
                    id: "http://www.w3.org/2002/07/owl#DatatypeProperty",
                    label: "owl:DatatypeProperty",
                    source: ADLmappingData.currentDatabase
                }
            })

            for (var id in self.typedObjectsMap) {
                propJstreeData.push({
                    id: id + common.getRandomHexaId(3),
                    text: id,
                    parent: "http://www.w3.org/2002/07/owl#DatatypeProperty",
                    data: {
                        type: "http://www.w3.org/2002/07/owl#DatatypeProperty",
                        id: id,
                        label: id.substring(id.lastIndexOf(".") + 1),
                        source: ADLmappingData.currentDatabase
                    }

                })
            }
            propJstreeData.push({
                id: "http://www.w3.org/2000/01/rdf-schema#label",
                text: "rdfs:labelOf",
                parent: "#",
                data: {
                    type: "labelOf",
                    id: "http://www.w3.org/2000/01/rdf-schema#label",
                    label: "http://www.w3.org/2000/01/rdf-schema#label",
                    source: ADLmappingData.currentDatabase
                }
            })

            for (var id in self.typedObjectsMap) {
                propJstreeData.push({
                    id: id + common.getRandomHexaId(3),
                    text: id,
                    parent: "http://www.w3.org/2000/01/rdf-schema#label",
                    data: {
                        type: "http://www.w3.org/2000/01/rdf-schema#label",
                        id: id,
                        label: id.substring(id.lastIndexOf(".") + 1),
                        source: ADLmappingData.currentDatabase
                    }
                })
            }


            ADLcommon.Ontology.jstreeData_types.forEach(function (item) {
                item.parent = Config.ADL.OneModelSource
                propJstreeData.push(item)
            })
            propJstreeData.push({
                id: Config.ADL.OneModelSource,
                text: Config.ADL.OneModelSource,
                parent: "#"
            })
            var optionsClass = {
                selectTreeNodeFn: self.selectTreeNodeFn,
                openAll: true
            }
            common.loadJsTree("ADLmappings_OneModelTree", propJstreeData, optionsClass)
        }


        self.AssignOntologyTypeToColumn = function (column, node) {
            ADLmappingData.setDataSampleColumntype(column, node)


            var types = []
            if (!Array.isArray(node.data))
                node.data = [node.data]
            node.data.forEach(function (item) {
                types.push({
                    type_id: item.id,
                    type_label: item.label,
                    type_parents: node.parents,
                    condition: item.condition
                })
            })
            ADLmappings.currentMappedColumns[column] = {
                columnId: column,
                types: types,
            }

            ADLmappingGraph.drawNode(column)

            ADLmappingData.currentColumn = null;
            $(".dataSample_type").removeClass("dataSample_type_selected")
        }


        self.loadMappings = function (name) {
            if (!name)
                name = self.currentADLdatabase + "_" + self.currentADLtable.data.label
            var payload = {ADL_GetMappings: name}
            $.ajax({
                type: "POST",
                url: Config.serverUrl,
                data: payload,
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    if (!data.mappings)
                        return;
                    if (!data.model) {
                        data.model = self.generateADLModel(data.mappings)

                    }
                    self.clearMappings()


                    data.mappings.forEach(function (item) {

                        /*   if(item.object.indexOf("http")==0 && !data.model[item.object])
                               return*/
                        //type
                        if (item.predicate == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                            var node = {}
                            if (typeof item.object === "object") {
                                //process switch
                                if (item.object.switch) {
                                    node.data = []
                                    for (var key in item.object.switch) {
                                        var value = item.object.switch[key]
                                        node.data.push({
                                            condition: key,
                                            id: value,
                                            label: data.model[value].label,
                                            parents: data.model[value].parents
                                        })
                                    }
                                }
                            } else {

                                node.data = {
                                    id: item.object,
                                    label: data.model[item.object].label,
                                    parents: data.model[item.object].parents
                                }
                            }

                            self.AssignOntologyTypeToColumn(item.subject, node)
                        }
                        //association
                        else if (item.object.indexOf("http") < 0) {
                            var property = {data: {id: item.predicate, label: data.model[item.predicate].label}}
                            var assocation = {
                                subject: {data: {columnId: item.subject}},
                                object: {data: {columnId: item.object}}
                            }
                            ADLmappingGraph.graphActions.setAssociation(property, assocation)
                        }
                    })


                }, error: function (err) {

                    return MainController.UI.message(err);
                }
            })

        }

        /**
         *
         * for old mappings (before march 2020 generate model from one model jstree
         *
         * @param mappings
         * @returns {{}}
         */
        self.generateADLModel = function (mappings) {
            var model = {}

            function getOneModelTreeInfos(id) {
                var oneModelNode = $("#ADLmappings_OneModelTree").jstree().get_node(id)
                if (oneModelNode) {
                    return {
                        parents: oneModelNode.parents,
                        label: oneModelNode.data.label
                    }
                } else
                    return null;
            }

            mappings.forEach(function (item) {
                if (typeof item.object === "object") {
                    if (item.object.switch) {
                        for (var key in item.object.switch) {
                            var id = item.object.switch[key]
                            model[item.object] = getOneModelTreeInfos(item.object)
                        }
                    }

                } else if (item.object.indexOf("http") > -1) {
                    model[item.object] = getOneModelTreeInfos(item.object)
                }


            })
            return model;

        }

        self.displayMappings = function () {
            var mappings = self.generateMappings()
            common.copyTextToClipboard(JSON.stringify(mappings, null, 2))
            MainController.UI.message("mappings copied to clipboard");
        }
        self.saveMappings = function () {
            var mappingName = ADLmappingData.currentADLdatabase + "_" + ADLmappingData.currentADLtable.data.label
            var mappings = self.generateMappings();
            var comment = prompt(mappingName + " optional comment :")
            if (!comment)
                return
            mappings.infos = {lastModified: new Date(), modifiedBy: authentication.currentUser.identifiant, comment}
            var payload = {
                ADL_SaveMappings: true,
                mappings: JSON.stringify(mappings, null, 2),
                ADLsource: mappingName
            }

            $.ajax({
                type: "POST",
                url: Config.serverUrl,
                data: payload,
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    return MainController.UI.message(mappingName + " mappings saved");


                }, error: function (err) {

                    return MainController.UI.message(err);
                }
            })
        }
        self.generateMappings = function () {

            var data = {mappings: [], model: {}}
            for (var key in self.currentMappedColumns) {
                var obj = self.currentMappedColumns[key]
                data.mappings.push({
                    subject: key,
                    predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                    object: obj.type_id
                })

                obj.types.forEach(function (item) {
                    data.model[item.type_id] = {parents: item.type_parents, label: item.type_label}
                })


            }

            for (var key in ADLmappingGraph.mappedProperties.mappings) {
                var obj = ADLmappingGraph.mappedProperties.mappings[key]
                data.mappings.push({
                    subject: obj.subject,
                    predicate: obj.predicate,
                    object: obj.object
                })
            }
            for (var key in ADLmappingGraph.mappedProperties.model) {

                data.model[key] = ADLmappingGraph.mappedProperties.model[key]
            }


            return data
            /* $("#mainDialogDiv").html(JSON.stringify(data, null, 2))
             $("#mainDialogDiv").dialog("open")*/

        }

        self.clearMappings = function () {
            self.currentMappedColumns = {}
            ADLmappingGraph.initMappedProperties()
            $(".dataSample_type").html("");
            visjsGraph.clearGraph()
        }

        return self;
    }

)
()
