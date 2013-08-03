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
            height: '100%',
            width: '100%',
            titlebar: true,
            autoHide: true,
            hideDirection: 'left',
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
            this.wrap =
                this.element
                    .children('.ui-panel-group');

            if (this.wrap.length === 0) {
                this.element
                    .children()
                    .wrapAll('<div class="ui-panel-group">');

                this.wrap =
                    this.element
                        .children('.ui-panel-group');
            }

            this.wrap
                .css({
                    height: this.options['height'],
                    width: this.options['width']
                });

            this.wrap
                .children()
                .panel($.extend({
                        close: $.proxy(this._onPanelClose, this),
                        active: $.proxy(this._onPanelActive, this)
                    },
                    this.options['panelOptions']));

            if (this.options['titlebar']) {
                this.titleBar =
                    this._createTitleBar();

                this.wrap
                    .prepend(this.titleBar);
            }

            this.active(-1);
        },

        refresh: function() {
            var left = 0;
            this.wrap
                .find('.ui-panel-header')
                .each(function() {
                    $(this).css({
                        left: left
                    });

                    left += $(this).outerWidth();
                });

            if (this.options['titlebar']) {
                this.wrap
                    .children('.ui-panel')
                    .height(this.wrap.innerHeight() - this.titleBar.outerHeight());
            }
        },

        active: function(index) {
            var active =
                this.wrap
                    .find('.ui-panel .ui-panel-header.ui-state-active')
                    .parent();

            if (index === -1) {
                index = this.options['activePanel'] || 0;
            }

            if (typeof index !== 'undefined') {
                active.children('.ui-panel .ui-panel-header')
                    .removeClass('ui-state-active');

                active =
                    this.wrap
                        .children('.ui-panel')
                        .eq(index);

                active.children('.ui-panel .ui-panel-header')
                    .addClass('ui-state-active');
                
                if (this.titleBar) {
                    var title = active.find('.ui-panel-title').text();
                    
                    this.titleBar
                        .children('span')
                        .html(title);
                }

                this.refresh();
            }

            return active.index();
        },

        count: function() {
            return this.wrap
                .children()
                .length;
        },

        _createTitleBar: function () {
            var titleBar = $('<div>', {
                'class': 'ui-panel-group-titlebar ui-widget-header ui-not-selectable',
                'append': [
                    $('<span>', {
                        'class': 'ui-panel-group-titlebar-title'
                    }),
                    $('<ul>', {
                        'class': 'ui-panel-group-titlebar-buttons ui-widget ui-helper-clearfix'
                    })
                ]
            });
            
            if (this.options['autoHide']) {
                var autohideButton = $('<li>', {
                    'class': 'ui-panel-group-titlebar-button ui-state-default ui-corner-all',
                    'title': 'Auto Hide',
                    'append': $('<span>', {
                        'class': 'ui-icon ui-icon-pin-s'
                    })
                });

                autohideButton.bind({
                    click: $.proxy(this._onAutoHide, this),
                    mousedown: function () { $(this).addClass('ui-state-active'); },
                    mouseup: function () { $(this).removeClass('ui-state-active'); },
                    mouseenter: function () { $(this).addClass('ui-state-hover'); },
                    mouseleave: function () { $(this).removeClass('ui-state-hover'); }
                });

                titleBar.children('ul')
                    .append(autohideButton);
            }

            var closeButton = $('<li>', {
                'class': 'ui-panel-group-titlebar-button ui-state-default ui-corner-all',
                'title': 'Close',
                'append': $('<span>', {
                    'class': 'ui-icon ui-icon-close'
                }),
            });

            closeButton.bind({
                click: $.proxy(this._onClosePanel, this),
                mousedown: function() { $(this).addClass('ui-state-active'); },
                mouseup: function() { $(this).removeClass('ui-state-active'); },
                mouseenter: function() { $(this).addClass('ui-state-hover'); },
                mouseleave: function() { $(this).removeClass('ui-state-hover'); }
            });

            titleBar.children('ul')
                .append(closeButton);

            return titleBar;
        },

        _onAutoHide: function(event) {
            var button = $(event.delegateTarget || event.target);
            var icon = button.children('.ui-icon');
            icon.toggleClass('ui-icon-pin-s', this.autoHide);
            icon.toggleClass('ui-icon-pin-w', !this.autoHide);

            this.autoHide = icon.is('.ui-icon-pin-w');
        },
        
        _onClosePanel: function() {
            var active = this.active();
            console.log(active);
            this.wrap
                .children()
                .eq(active)
                .panel('close');
        },

        _onPanelClose: function(event) {
            var index = event.index || this.active();
            var active = this.active();

            if (active === -1) {
                active = Math.max(index - 1, 0);
            }

            this.active(active);
        },

        _onPanelActive: function (event) {
            var index = event.index;
            
            //If a titleBar exists drop the index by 1
            if (this.titleBar) {
                index--;
            }

            this.active(index);
        }
    });
})(jQuery);