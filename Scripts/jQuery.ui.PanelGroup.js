/***
 *      Author: KodingSykosis
 *        Date: 07/30/2013
 *     Version: 1.0
 *     License: GPL v3 (see License.txt or http://www.gnu.org/licenses/)
 * Description: This plugin acts like a tab control with drag and drop support
 *
 *        Name: jQuery.ui.PanelGroup.js
 *
 *    Requires: jQuery.ui.panel.js
 ***/
(function($) {
    $.widget('kodingsykosis.panelgroup', {
        options: {
            activePanel: 0,
            panelOptions: {
                resizable: false,
                collapsable: false,
                closable: true,
                tabPanel: true,
                height: '100%',
                width: '100%'
            }
        },

        _create: function() {
            this.element
                .children()
                .panel($.extend({
                            close: $.proxy(this._onPanelClose, this),
                            active: $.proxy(this._onPanelActive, this)
                        },
                        this.options['panelOptions'])
                );

            this.refresh();
            this.active(this.options['activePanel']);
        },

        refresh: function() {
            var left = 0;
            this.element
                .find('.ui-panel-header')
                .each(function() {
                    $(this).css({
                        left: left
                    });

                    left += $(this).outerWidth();
                });
        },

        active: function (index) {
            var active =
                this.element
                    .find('.ui-panel-header.ui-state-active')
                    .parent();
            
            if (typeof index !== 'undefined') {
                active.children('.ui-panel-header')
                    .removeClass('ui-state-active');

                active =
                    this.element
                        .children()
                        .eq(index);

                active.children('.ui-panel-header')
                    .addClass('ui-state-active');
                
                this.refresh();
            }

            return active.index();
        },

        count: function() {
            return this.element
                .children()
                .length;
        },

        _onPanelClose: function (event) {
            var index = event.index;
            var active = this.active();

            if (active === -1) {
                active = Math.max(index - 1, 0);
            }
            
            this.active(active);
        },

        _onPanelActive: function (event) {
            this.active(event.index);
        }
    });
})(jQuery);