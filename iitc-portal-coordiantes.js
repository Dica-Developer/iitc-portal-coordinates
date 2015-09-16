// ==UserScript==
// @name         My Fancy New Userscript
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.ingress.com/intel
// @grant        none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    // PLUGIN START ////////////////////////////////////////////////////////

    // use own namespace for plugin
    window.plugin.savePortals = function() {};

    window.plugin.savePortals.setup = function() {
        var allMyShinyPortals = {};
        var downloadButton = $('<button style="display:none; top: 0px; left: 0px; position: absolute; z-index: 1000;">Download shiny portals</button>').click(function () {
            alert(Object.keys(allMyShinyPortals).length + ' shiny portals collected!\n' + JSON.stringify(allMyShinyPortals, null, 2));
        });
        downloadButton.appendTo('body');

        window.addHook('mapDataRefreshStart', function(e) {
            downloadButton.hide();
        });

        window.addHook('mapDataRefreshEnd', function(e) {
            Object.keys(window.portals).forEach(function(portalId, index){
                var portal = window.portals[portalId];
                allMyShinyPortals[portalId] = portal.options.data;
            });
            downloadButton.show();
        });
    }
    var setup = window.plugin.savePortals.setup;

    // PLUGIN END //////////////////////////////////////////////////////////


    setup.info = plugin_info; //add the script info data to the function as a property
    if(!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

