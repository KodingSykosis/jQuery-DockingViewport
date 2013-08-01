﻿(function ($) {
    $.widget('kodingsykosis.panel', {
        options: {
            title: undefined,
            collapsable: true,
            collapsed: false,
            closable: false,
            refreshable: true,
            tabPanel: false,
            tabPosition: 'bottom',
            url: undefined,
            draggable: undefined,
            resizable: undefined,
            height: 400,
            width: 300
        },

        _create: function() {
            var showHeader =
                this.options['title'] ||
                    this.options['collapsable'] ||
                    this.options['closable'] ||
                    this.options['refreshable'] ||
                    this.element.attr('title');

            $.extend(this, {
                header: $('.ui-panel-header', this.element),
                content: $('.ui-panel-content', this.element),
                panel: $('.ui-panel', this.element)
            });

            if (this.content.length == 0) {
                this.content = this.element;
            }

            if (this.panel.length == 0) {
                this.panel = $('<div>', {
                    'class': 'ui-panel'
                });

                this.content
                    .wrap(this.panel);

                this.panel =
                    this.content.parent();

                if (!this.panel.is(this.element)) {
                    this.panel
                        .on({
                            resize: $.proxy(this._onResize, this),
                            drag: $.proxy(this._onDrag, this)
                        });
                }

            }

            if (this.header.length == 0 && showHeader !== false) {
                this._createHeader();
            }

            if (this.options['collapsed']) {
                this.content
                    .hide();
            }

            this.panel
                .css({
                    height: this.options
                        .height,
                    width: this.options
                        .width
                });

            this.header
                .addClass('ui-widget-header ui-not-selectable')
                .toggleClass('ui-corner-top', !this.options['tabPanel']);

            this.content
                .addClass('ui-panel-content ui-widget-content')
                .toggleClass('ui-corner-bottom', !this.options['tabPanel']);

            if (this.options['draggable']) {
                if (typeof this.options['draggable'] == 'boolean') {
                    this.options['draggable'] = {};
                }

                this.panel
                    .draggable($.extend({
                        handle: this.header
                    }, this.options['draggable']));
            }

            if (this.options['resizable']) {
                this.panel
                    .resizable(this.options['resizable']);
            }

            if (this.options['closable']) {
                this.header
                    .append(
                        $('<span>', {
                            'class': 'ui-icon ui-icon-close',
                            'click': $.proxy(this._onCloseClicked, this)
                        })
                    );
            }

            if (this.options['collapsable']) {
                this.header
                    .append(
                        $('<span>', {
                            'class': 'ui-icon ui-icon-minus',
                            'click': $.proxy(this._onCollapseClicked, this)
                        })
                    );
            }

            if (this.options['refreshable'] && this.options['url']) {
                this.header
                    .append(
                        $('<span>', {
                            'class': 'ui-icon ui-icon-refresh',
                            'click': $.proxy(this._onRefreshClicked, this)
                        })
                    );
            }

            if (this.options['layout'] && this.content.layout) {
                this.content
                    .layout(this.options['layout']);
            }

            if (this.options['tabPanel']) {
                this._createTab();
            }

            if (this.options['url']) {
                this.load(this.options['url']);
            }
        },

        load: function(url) {
            var el = this.element,
                self = this;

            this.content
                .load(url, function() {
                    el.trigger('refresh');
                    self._autoRefresh();
                });
        },

        title: function(value) {
            if (typeof value != 'undefined') {
                this.options['title'] = value;

                if (this.header) {
                    this.header
                        .children('.ui-panel-title')
                        .html(value);
                } else {
                    this._createHeader();
                }
            }

            return this.header
                .children('.ui-panel-title')
                .text();
        },

        _createHeader: function() {
            this.header = $('<div>', {
                'class': 'ui-panel-header ui-accordin-header',
                'append': $('<span>', {
                    'class': 'ui-panel-title',
                    'html': this.options['title'] || this.element.attr('title') || 'Untitled'
                })
            });

            this.content
                .removeAttr('title');

            this.panel
                .prepend(this.header);
        },

        _createTab: function() {
            var tabPosition =
                this.options
                    .tabPosition;

            this.panel
                .addClass('ui-panel-tab');

            this.header
                .addClass('ui-state-default')
                .toggle(tabPosition !== 'left' && tabPosition !== 'right');

            if (this.header.is(':visible')) {
                this.panel
                    .toggleClass('ui-panel-tab-bottom', tabPosition === 'bottom');
            }

            this.header
                .click($.proxy(this._onTitleClicked, this))
                .hover(function() { $(this).addClass('ui-state-hover'); },
                    function() { $(this).removeClass('ui-state-hover'); });
        },

        _autoRefresh: function() {
            if (this.options['url'] && typeof this.options['refreshInterval'] === 'number') {
                setTimeout(
                    $.proxy(this._onRefreshClicked, this),
                    this.options['refreshInterval']);
            }
        },

        _onTitleClicked: function (evt) {
            evt.index = this.panel.index();
            this._trigger('active', evt);
        },

        _onCloseClicked: function (evt) {
            evt.index = this.panel.index();
            if (!this._trigger('closing', evt)) return;

            this.panel
                .remove();
            
            this._trigger('close', evt);
        },

        _onCollapseClicked: function (event) {
            var collapse = this.content.is(':visible');
            var icon = $(event.delegateTarget || event.target);
            var header = this.header;
            var panel = this.panel;

            icon.toggleClass('ui-icon-minus', !collapse);
            icon.toggleClass('ui-icon-extlink', collapse);
            header.toggleClass('ui-corner-all', collapse);
            
            if (collapse) {
                this.originalHeight = this.content.height();
            }

            this.content
                .show()
                .animate({
                        height: collapse ? 0 : this.originalHeight
                    }, {
                    step: function (now, tween) {
                        panel.height(now + header.outerHeight());
                    },
                    complete: $.proxy(this._animateComplete, this)
                 });
        },
        
        _animateComplete: function () {
            var resizable = this.options['resizable'];
            var collapse = parseInt(this.content.height()) == 0;
            
            this.header
                .toggleClass('ui-corner-all', collapse);
            
            if (!resizable) return;

            if (collapse) {
                this.panel
                    .resizable('destroy');
                
                this.content
                    .hide();

                this.element
                    .trigger('collapsed');
            } else {
                this.panel
                    .resizable(resizable);

                this.content
                    .css({
                        height: 'auto',
                        bottom: '0'
                    });

                this.element
                    .trigger('expanded');
            }
        },

        _onRefreshClicked: function () {
            this.load(this.options['url']);
        },
        
        _onResize: function (event, ui) {
            this.element
                .triggerHandler('resize', ui);
        },
        
        _onDrag: function(event, ui) {
            this.element
                .triggerHandler('drag', ui);
        }
    });
})(jQuery);