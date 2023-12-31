import common from "../shared/common.js";
import KGcreator from "../tools/KGcreator.js";
import PromptedSelectWidget from "./promptedSelectWidget.js";
import OntologyModels from "../shared/ontologyModels.js";
import DateWidget from "./dateWidget.js";
import Sparql_common from "../sparqlProxies/sparql_common.js";
import IndividualValueFilterWidget from "./individualValuefilterWidget.js";
import {LitElement, html,css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';



/**
 * ***********************************************************************
 *  Widget >Description
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * @type {{}}
 */


/**
 * ***************************************************************************************
 * WebComponent
 *
 *
 *
 * @type {{}}
 */



class predicateSelector extends LitElement {
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
   
  render() {
  return html`<style>
  .editPredicatePanel {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin: 3px;
      width: 300px;
  }

  .editPredicatePanel input {
      width: 240px;
      margin: 3px;
      padding: 0px;
      border: #6e2500 solid 1px;
      border-radius: 3px;
      background-color: #ddd;
  }

  input[type="checkbox"] {
      width: 30px;
  }
</style>
<div id="editPredicate_mainDiv" style="display: flex; flex-direction: row">
  <div class="editPredicatePanel" id="editPredicate_propertyDiv">
      <div><b>Property</b></div>
      <div>
          
          <select
              id="editPredicate_vocabularySelect"
              style="min-width: 100px; background-color: #ddd"
              onchange="PredicatesSelectorWidget.setCurrentVocabPropertiesSelect($(this).val(),'editPredicate_currentVocabPredicateSelect')"
          ></select>
          <select
              id="editPredicate_currentVocabPredicateSelect"
              style="min-width: 200px; background-color: #ddd"
              onchange="PredicatesSelectorWidget.onSelectPredicateProperty($(this).val())"
          ></select>
      </div>
      <input id="editPredicate_propertyValue" style="width: 95%; background-color: beige" /><br />
      <div id="editPredicate_customPredicateContentDiv"></div>
  </div>

  <div class="editPredicatePanel" id="editPredicate_objectDiv">
      <div><b>Object</b></div>
      <button class="btn btn-sm my-1 py-0 btn-outline-primary" id="editPredicate_savePredicateButton">
              <b>Save</b>
          </button>
      <div id="editPredicate_controlsDiv" style="display: none">
          <b>Object</b> &nbsp;
          <!--   <button class="btn btn-sm my-1 py-0 btn-outline-primary" onclick="PredicatesSelectorWidget.hideAddPredicateDiv()"><b>cancel</b></button>-->
      </div>
      <div>
          <select
              id="editPredicate_vocabularySelect2"
              style="min-width: 100px; background-color: #ddd"
              onchange="PredicatesSelectorWidget.setCurrentVocabClassesSelect($(this).val(),'editPredicate_objectSelect')"
          ></select
          >&nbsp;

          <select id="editPredicate_objectSelect" style="min-width: 200px; background-color: #ddd" onchange="PredicatesSelectorWidget.onSelectCurrentVocabObject($(this).val())"></select>
      </div>
      <div></div>
      <textarea id="editPredicate_objectValueTA" style="width: 95%; display: none"></textarea>
      <input id="editPredicate_objectValue" style="width: 95%; background-color: beige" />
      <div id="editPredicate_customContentDiv"></div>
  </div>
</div>
`;
  }
  
  
  firstUpdated() {
    super.firstUpdated();


var shadowRootContent = $("slsv-predicate-selector")[0].shadowRoot;

var fragment = document.createDocumentFragment();
//Create document fragement to contain cloned elements


// clone each children of the shadowRoot and add it to the fragement
shadowRootContent.childNodes.forEach(function(node) {
    fragment.appendChild(node.cloneNode(true));
});

// Use the fragment to insert the element cloned inside the target element
$("#sourceBrowser_addPropertyDiv").empty().append(fragment);

  
  }
  }
    customElements.define("slsv-predicate-selector", predicateSelector);


/**
 * **********************************************************************************************
 * Business logic
 *
 *
 *
 * @type {{}}
 */
var PredicatesSelectorWidget = (function () {
    var self = {};

    self.predicatesIdsMap = {};

    self.load = function (divId, source, configureFn, callback) {
        $("#" + divId).load("modules/uiWidgets/predicatesSelectorWidgetDialog.html", function () {
            self.init(source, configureFn, function (err, result) {
                if (callback) {
                    return callback();
                }
            });
        });
    };

    self.init = function (source, configureFn, callback) {
        $("#sourceBrowser_addPropertyDiv").css("display", "flex");

        $("#editPredicate_currentVocabPredicateSelect").prop("disabled", false);
        $("#editPredicate_vocabularySelect").prop("disabled", false);
        $("#editPredicate_propertyValue").prop("disabled", false);

        self.setVocabulariesSelect(source);
        self.setCurrentVocabClassesSelect("usual", "editPredicate_objectSelect");
        self.setCurrentVocabPropertiesSelect("usual", "editPredicate_currentVocabPredicateSelect");

        // var properties = Config.Lineage.basicObjectProperties;

        self.configure(configureFn, function (err, result) {
            if (callback) {
                return callback();
            }
        });
    };

    self.configure = function (configureFn, callback) {
        self.onSelectPropertyFn = null;
        self.onSelectObjectFn = null;
        $("#editPredicate_vocabularySelect").val("usual");
        $("#editPredicate_vocabularySelect2").val("usual");
        if (configureFn) {
            configureFn();
            if (callback) {
                return callback();
            }
        }
    };

    self.setVocabulariesSelect = function (source, filter) {
        var vocabularies = [];
        if (!filter || filter == "_all") {
            vocabularies = ["usual", source];
            vocabularies = vocabularies.concat(Config.sources[source].imports);
            vocabularies = vocabularies.concat(Object.keys(Config.ontologiesVocabularyModels));
        } else if (filter == "_loadedSources") {
            vocabularies = Lineage_sources.loadedSources;
            vocabularies = vocabularies.concat(Config.sources[source].imports);
        } else if (filter == "_basicVocabularies") {
            vocabularies = Object.keys(Config.basicVocabularies);
        } else if (filter == "_curentSourceAndImports") {
            vocabularies = [source];
            vocabularies = vocabularies.concat(Config.sources[source].imports);
        } else {
            if (!Array.isArray(filter)) {
                filter = [filter];
            }
            vocabularies = filter;
        }
        common.fillSelectOptions("editPredicate_vocabularySelect", vocabularies, true);
        common.fillSelectOptions("editPredicate_vocabularySelect2", vocabularies, true);
    };

    self.setCurrentVocabPropertiesSelect = function (vocabulary, selectId) {
        var properties = [];

        if (vocabulary == "usual") {
            KGcreator.usualProperties.forEach(function (item) {
                properties.push({ label: item, id: item });
            });
            properties.push({ label: "-------", id: "" });
            common.fillSelectOptions(selectId, properties, true, "label", "id");
        } else if (Config.ontologiesVocabularyModels[vocabulary]) {
            properties = OntologyModels.getPropertiesArray(vocabulary);
            common.fillSelectOptions(selectId, properties, true, "label", "id");
        } else {
            return PromptedSelectWidget.prompt("owl:ObjectProperty", "editPredicate_currentVocabPredicateSelect", vocabulary);
        }
    };

    self.onSelectPredicateProperty = function (value) {
        $("#editPredicate_objectSelect").val("");
        $("#editPredicate_objectValue").val("");
        $("#editPredicate_propertyValue").val(value);
        $("#editPredicate_vocabularySelect2").css("display", "block");
        DateWidget.unsetDatePickerOnInput("editPredicate_objectValue");
        if (self.onSelectPropertyFn) {
            self.onSelectPropertyFn(value);
        }
        self.operators = {
            String: ["contains", "not contains", "="],
            Number: ["=", "!=", "<", "<=", ">", ">="],
        };

        if (value.indexOf("xsd:") > -1) {
            $("#editPredicate_vocabularySelect2").css("display", "none");
            if (value == "xsd:dateTime") {
                common.fillSelectOptions("editPredicate_objectSelect", self.operators.Number);
                DateWidget.setDatePickerOnInput("editPredicate_objectValue");
            } else if (value == "xsd:string") {
                common.fillSelectOptions("editPredicate_objectSelect", self.operators.String);
            } else {
                common.fillSelectOptions("editPredicate_objectSelect", self.operators["Number"]);
            }
        } else if (Sparql_common.isTripleObjectString(value)) {
            $("#editPredicate_vocabularySelect2").css("display", "none");
            common.fillSelectOptions("editPredicate_objectSelect", self.operators.String);
        } else {
            $("#editPredicate_vocabularySelect2").css("display", "block");
            $("#editPredicate_vocabularySelect2").val("usual");
            self.setCurrentVocabClassesSelect("usual", "editPredicate_objectSelect");
        }
    };

    self.onSelectCurrentVocabObject = function (value) {
        if (value == "_searchClass") {
            return PromptedSelectWidget.prompt("owl:Class", "editPredicate_objectSelect", self.currentVocabulary);
        }
        if (value == "_search") {
            return PromptedSelectWidget.prompt(null, "editPredicate_objectSelect", self.currentVocabulary);
        }
        $("#editPredicate_objectValue").val(value);
        if (self.onSelectObjectFn) {
            self.onSelectObjectFn(value);
        }
    };

    self.setCurrentVocabClassesSelect = function (vocabulary, selectId) {
        self.currentVocabulary = vocabulary;
        var classes = [];

        if (vocabulary == "usual") {
            KGcreator.usualObjectClasses.forEach(function (item) {
                classes.push({
                    id: item,
                    label: item,
                });
            });
            common.fillSelectOptions(selectId, classes, true, "label", "id");
        } else {
            OntologyModels.registerSourcesModel([vocabulary], function (err, result) {
                if (err) return alert(err.responseText);
                if (Config.ontologiesVocabularyModels[vocabulary] && Config.ontologiesVocabularyModels[vocabulary].classesCount <= Config.ontologyModelMaxClasses) {
                    var classes = [];
                    for (var classId in Config.ontologiesVocabularyModels[vocabulary].classes) {
                        var classObj = Config.ontologiesVocabularyModels[vocabulary].classes[classId];
                        classes.push({
                            id: classObj.id,
                            label: classObj.label,
                        });
                    }

                    common.fillSelectOptions(selectId, classes, true, "label", "id");
                } else {
                    //PromptedSelectWidget
                    return PromptedSelectWidget.prompt("owl:Class", "editPredicate_objectSelect", vocabulary);
                }
            });
        }
    };

    self.getSelectedProperty = function () {
        var property = $("#editPredicate_propertyValue").val();

        if (property.indexOf("xsd:") == 0) {
            // get operator
            return "owl:hasValue";
        } else {
            if (property.indexOf("http") == 0) {
                return "<" + property + ">";
            } else {
                return property;
            }
        }
    };
    self.getSelectedObjectValue = function () {
        var property = $("#editPredicate_propertyValue").val();
        var value = $("#editPredicate_objectValue").val().trim();

        if (property.indexOf("xsd") > -1) {
            if (property == "xsd:dateTime") {
                var date = $("#editPredicate_objectValue").datepicker("getDate");
                return "'" + common.dateToRDFString(date) + "'^^xsd:dateTime";
            } else {
                return "'" + value + "'^^" + property;
            }
        } else if (value.indexOf("http") == 0) {
            return "<" + value + ">";
        } else {
            return value;
        }
    };

    self.getSelectedOperator = function () {
        var property = $("#editPredicate_propertyValue").val();
        if (property.indexOf("xsd") > -1) {
            return $("#editPredicate_objectSelect").val();
        }
        return null;
    };

    self.getSparqlFilter = function () {
        var property = self.getSelectedProperty();
        var value = self.getSelectedObjectValue();
        var operator = self.getSelectedOperator();
        var operator = null;
        if (Sparql_common.isTripleObjectString(property, value)) {
            operator = $("#editPredicate_objectSelect").val();
        }
        IndividualValueFilterWidget.getSparqlFilter(varName, property, operator, value);
    };

    return self;
})();

export default PredicatesSelectorWidget;
window.PredicatesSelectorWidget = PredicatesSelectorWidget;
