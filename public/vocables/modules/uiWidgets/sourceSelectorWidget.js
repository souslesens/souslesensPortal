import MainController from "../shared/mainController.js";
import common from "../shared/common.js";
import {LitElement, html,css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import JstreeWidget from "./jstreeWidget.js";
import "./js/basicComponents.js";
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



class sourceSelector extends LitElement {
    
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  }

  createRenderRoot() {
    return this;
}    

render() {
return html`
<div id="sourceSelector" style="margin-bottom: 10px; width: auto; min-height: 0px; max-height: none; height: 680px">
<div class="sourceSelector_buttons">
<slsv-button id="xxxx" btnId="zzzz" value="Cancel" action="close"></slsv-button>
<slsv-button id="test1" btnId="sourceSelector_validateButton" value="OK"></slsv-button>

</div>

<div>Search : <slsv-input id="sourceSelector_searchInput" value="" autocomplete="off"></slsv-input></div>


<div class="jstreeContainer" style="width: 360px; height: 600px; overflow: auto; margin-top: 5px">
  <div id="sourceSelector_jstreeDiv"></div>
</div>

</div>
`;
}


firstUpdated() {
  super.firstUpdated();
  var shadowDom=null;
    shadowDom = this.renderRoot.querySelector('#sourceSelector')
  setTimeout(function(){
  $("#mainDialogDiv").html(shadowDom);
  SourceSelectorWidget.initJsTree();
},2220)
console.log("GERWGFERG")

}
}
  customElements.define("slsv-source-selector", sourceSelector);
/**
 * **********************************************************************************************
 * Business logic
 *
 *
 *
 * @type {{}}
 */

var SourceSelectorWidget = (function() {
  var self = {};
  self.currentTreeDiv = null;
  self.initJsTree = function(){
    var options = {
      includeSourcesWithoutSearchIndex: true,
      withCheckboxes: true,
  };
  var selectTreeNodeFn = function () {
      $("#mainDialogDiv").dialog("close");
      var checkedSource = SourceSelectorWidget.getCheckedSources();
  
      if (checkedSource.length > 0) {
          return;
      }
      var source = SourceSelectorWidget.getSelectedSource()[0];
      self.mainSource = source;
      Lineage_sources.setCurrentSource(source);
      $("#sourcesSelectionDialogdiv").dialog("close");
      $("#lineage_allActions").css("visibility", "visible");
      MainController.UI.showHideRightPanel("show");
  };
  
  var validateButtonFn = function () {
      var sources = SourceSelectorWidget.getCheckedSources();
      self.loadSources(sources);
  };

  options.selectTreeNodeFn = selectTreeNodeFn;
   SourceSelectorWidget.loadSourcesTreeDiv("sourceSelector_jstreeDiv", options);
    $("#sourceSelector_searchInput").focus();
    //  $("#sourceSelector_SearchSourceInput");
    var isDialog = true;
    $("#sourceSelector_validateButton").bind("click", function() {
      okButtonValidateFn();
      
      if (isDialog) {
        $("#" + targetDivId).dialog("close");
      }
    });
  
    if (options.withCheckboxes) {
      $(".sourceSelector_buttons").css("display", "block");
    }
    else {
      $(".sourceSelector_buttons").css("display", "none");
    }
    
    if (false) {
      $("#" + targetDivId).dialog("open");
    }
    else {
    }
  }
  self.initWidget = function(types, targetDivId, isDialog, selectTreeNodeFn, okButtonValidateFn, options) {
    if (self.currentTreeDiv != null) {
      if ($("#" + self.currentTreeDiv).jstree() != undefined) {
        $("#" + self.currentTreeDiv)
          .jstree()
          .destroy();
      }
    }

    self.currentTreeDiv = targetDivId;
    if (!options) {
      options = {};
    }
    var jsTreeOptions = options;
    jsTreeOptions.selectTreeNodeFn = selectTreeNodeFn;
    MainController.UI.showHideRightPanel("hide");
  $("#mainDialogDiv").dialog("open");
  $("#mainDialogDiv").html("<slsv-source-selector></slsv-source-selector>");

};

self.getSourcesJstreeData = function(types, sourcesSelection) {
  var distinctNodes = {};

  var distinctGroups = {};

  var treeData = [];
  if (Config.currentProfile.allowedSourceSchemas.length == 0) {
    return alert(Config.currentProfile.name + " has no schema type allowed. Contact administrator");
  }
  Config.currentProfile.allowedSourceSchemas.sort().forEach(function(item) {
    if (!types || (types && types.indexOf(item) > -1)) {
      treeData.push({
        id: item,
        text: item,
        parent: "#",
        type: item
      });
    }
  });
  Object.keys(Config.sources)
    .sort()
    .forEach(function(sourceLabel, index) {
      //  self.initControllers();
      if (sourcesSelection && sourcesSelection.indexOf(sourceLabel) < 0) {
        return;
      }
      if (Config.sources[sourceLabel].isDraft) {
        return;
      }
      if (Config.currentProfile.allowedSourceSchemas.indexOf(Config.sources[sourceLabel].schemaType) < 0) {
        return;
      }
      Config.sources[sourceLabel].name = sourceLabel;

      var parent = Config.sources[sourceLabel].schemaType;

      var othersGroup = "OTHERS";

      if (!types && !distinctGroups[othersGroup]) {
        distinctGroups[othersGroup] = 1;
        treeData.push({
          id: othersGroup + "_" + parent,
          text: "OTHERS",
          type: "group",
          parent: "#"
        });
      }

      var group = Config.sources[sourceLabel].group;
      if (group) {
        var subGroups = group.split("/");
        subGroups.forEach(function(subGroup, index) {
          if (index > 0) {
            parent = subGroups[index - 1];
          }
          if (!distinctGroups[subGroup]) {
            distinctGroups[subGroup] = 1;
            treeData.push({
              id: subGroup,
              text: subGroup,
              type: "group",
              parent: parent
            });
          }
          group = subGroup;
        });
      }
      else {
        group = othersGroup + "_" + parent;
        if (types) {
          group = Config.sources[sourceLabel].schemaType;
        }
        else {
          group = Config.sources[sourceLabel].schemaType;
        }
      }

      if (!distinctNodes[sourceLabel]) {
        distinctNodes[sourceLabel] = 1;

        if (!Config.sources[sourceLabel].color) {
          Config.sources[sourceLabel].color = common.palette[index % common.palette.length];
        }
        //  console.log(JSON.stringify(jstreeData,null,2))
        if (!types || types.indexOf(Config.sources[sourceLabel].schemaType) > -1) {
          treeData.push({
            id: sourceLabel,
            text: sourceLabel,
            type: Config.sources[sourceLabel].schemaType,
            parent: group
          });
        }
      }
    });

  return treeData;
};
/**
 *
 * @param divId
 * @param jstreeOptions
 *  contextMenu
 *  withCheckboxes
 *  selectTreeNodeFn
 * @param validateFn
 * @param okButtonValidateFn
 */
self.loadSourcesTreeDiv = function(treeDiv, jstreeOptions, callback) {
  if (!jstreeOptions) {
    optiojstreeOptionsns = {};
  }

  var treeData = self.getSourcesJstreeData();

  if (!jstreeOptions.contextMenu) {
    jstreeOptions.contextMenu = MainController.UI.getJstreeConceptsContextMenu();
  }

  if (!jstreeOptions.withCheckboxes && !jstreeOptions.selectTreeNodeFn) {
    jstreeOptions.selectTreeNodeFn = self.defaultSelectTreeNodeFn;
  }
  if (jstreeOptions.withCheckboxes) {
    jstreeOptions.tie_selection = false;
  }

  if (!jstreeOptions.onOpenNodeFn) {
    jstreeOptions.onOpenNodeFn = self.defaultOpenNodeFn;
  }

  $("#sourceSelector_searchInput").bind("keydown", null, function() {
    if (event.keyCode != 13 && event.keyCode != 9) {
      return;
    }
    var value = $(this).val();
    $("#" + treeDiv)
      .jstree(true)
      .search(value);
  });

  jstreeOptions.searchPlugin = {
    case_insensitive: true,
    fuzzy: false,
    show_only_matches: true
  };

  JstreeWidget.loadJsTree(treeDiv, treeData, jstreeOptions, function() {
    var openedTypes = Config.preferredSchemaType;
    $("#" + treeDiv)
      .jstree(true)
      .open_node(openedTypes);
    if (callback) {
      return callback();
    }
  });
};

self.defaultSelectTreeNodeFn = function(evt, obj) {
  if (!Config.sources[obj.node.id]) {
    return;
  }
  $("#mainDialogDiv").dialog("close");
  if (obj.node.parent == "#") {
    //first level group by schema type
    if (Config.currentProfile.allowedSourceSchemas.indexOf(obj.node.id) > -1) {
      //schemaTypeNode
      if (obj.node.id == "KNOWLEDGE_GRAPH") {
        MainController.currentSchemaType = "OWL";
      }
      else {
        MainController.currentSchemaType = obj.node.id;
      }

      if ($("#sourcesTreeDiv").children().length > 0) {
        $("#sourcesTreeDiv").jstree(true).open_node(obj.node.id);
      }
      return;
    }
  }
  else {
    self.currentSource = obj.node.id;
    MainController.UI.onSourceSelect(obj.event);
  }
};

self.defaultOpenNodeFn = function(evt, obj) {
  if (obj.node.parent == "#") {
    //first level group by schema type
    if (Config.currentProfile.allowedSourceSchemas.indexOf(obj.node.id) > -1) {
      //schemaTypeNode
      if (obj.node.id == "KNOWLEDGE_GRAPH") {
        MainController.currentSchemaType = "OWL";
      }
      else {
        MainController.currentSchemaType = obj.node.id;
      }
    }
  }
};

self.showDialog = function(types, options, validateFn, okButtonValidateFn) {
};

self.getSelectedSource = function() {
  return $("#sourceSelector_jstreeDiv").jstree().get_selected();
};

self.getCheckedSources = function() {
  var checkedNodes = $("#sourceSelector_jstreeDiv").jstree().get_checked();
  var sources = [];
  checkedNodes.forEach(function(item) {
    if (Config.sources[item]) {
      sources.push(item);
    }
  });
  return sources;
};

return self;
})
();

export default SourceSelectorWidget;
window.SourceSelectorWidget = SourceSelectorWidget;