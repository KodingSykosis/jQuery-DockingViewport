/***
 *      Author: KodingSykosis
 *        Date: 07/30/2013
 *     Version: 1.0
 *     License: GPL v3 (see License.txt or http://www.gnu.org/licenses/)
 * Description: This plugin extends the jQuery.ui.ViewPort plugin
 *              to support dockable, collapsable, and resizable
 *              region panels.
 *
 *        Name: jQuery.ui.DockingViewPort.js
 *
 *    Requires: jQuery.ui.panel.js
 *              jQuery.ui.PanelGroup.js
 *              jQuery.ui.Drawer.js
 *              jQuery.ui.ViewPort.js
 ***/
(function($) {
    $.widget('kodingsykosis.dockingViewPort', $.kodingsykosis.viewport, {
        _create: function () {
            this._super();
        },
        
        _initRegion: function (config, name) {
            var regionConfig = this._super(config, name);

            regionConfig.el.panelgroup({                
                
            });
            
            return regionConfig;
        }
    });
})(jQuery);