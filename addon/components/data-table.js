import Ember from 'ember';
import layout from '../templates/components/data-table';

const DEFAULT_HEADER_MARGIN = -20;
const HEADERS_TO_SCROLL_SELECTOR = 'section thead div';

const SortableArray = Ember.ArrayProxy.extend(Ember.SortableMixin);
const SortableArrayWithParent = SortableArray.extend({
    parent: Ember.required,
    content: Ember.computed.alias('parent.content'),
    sortProperties: function () {
        var sortProperty = this.get('parent.sortProperty');
        return sortProperty ? [sortProperty] : null;
    }.property('parent.sortProperty'),
    sortAscending: Ember.computed.alias('parent.sortAscending')
});

const WithSortableContent = Ember.Mixin.create({
    // attrs
    sortProperty: null,
    sortAscending: true,

    sortedContent: function() {
        return SortableArrayWithParent.create({
            parent: this
        });
    }.property(),

    actions: {
        sortByColumn: function (column) {
            if (!column.get('isSortable')) {
                // Simply ignore the action if the column isn't sortable
                return;
            }
            // TODO: consider raising an action. Data down, actions up.
            var newSortProperty = column.get('field'),
                currentSortProperty = this.get('sortProperty');

            if (newSortProperty === currentSortProperty) {
                // Same property, just toggle asc/desc
                this.toggleProperty('sortAscending');
            } else {
                this.setProperties({
                    // defaults to asc
                    sortAscending: true,
                    sortProperty: newSortProperty
                });
            }
        }
    },
    columns: function () {
        return [];
    }.property(),

    _updateColumnsSort: function () {
        var sortProperty = this.get('sortProperty'),
            sortColumn = this.get('columns').findBy('field', sortProperty),
            sortDirection = this.get('sortAscending') ? 'asc' : 'desc';
        this.get('columns').setEach('sortDirection', null);
        if (sortColumn) {
            sortColumn.set('sortDirection', sortDirection);
        }

    }.observes('columns.@each', 'sortAscending', 'sortProperty')
});
const WithSelectionSupport = Ember.Mixin.create({
    _updateSelection: function () {
        var content = this.get('sortedContent'),
            selectedItem = this.get('selectedItem'),
            selectedIndex;
        if (!selectedItem) {
            selectedIndex = -1;
        } else {
            selectedIndex = content.indexOf(selectedItem);
        }
        this.set('selectedIndex', selectedIndex);
    }.observes('selectedItem', 'sortedContent.@each').on('init')
});
export default Ember.Component.extend(WithSelectionSupport, WithSortableContent, {
  layout,
  classNames: ['data-grid-table'],
  classNameBindings: ['canSelect:is-hoverable'],

  // attrs
  height: null,
  rowHeight: null,
  select: null,

  canSelect: Ember.computed.notEmpty('select'),

  heightStyle: function () {
      if (this.get('height')) {
          return 'max-height:' + this.get('height') + ';';
      }
  }.property('height'),

  rowHeightStyle: function () {
      if (this.get('rowHeight')) {
          return 'height:' + this.get('rowHeight') + ';';
      }
  }.property('rowHeight'),

  shownColumns: function () {
      return this.get('columns').filterBy('shown');
  }.property('columns.@each.shown'),

  _setupScrollEvents: function () {
      var _this = this,
          scrollableArea = this.$('.data-grid-table-container'),
          left = 0;

      scrollableArea.on('scroll', function () {
          var headersToScroll = _this.$(HEADERS_TO_SCROLL_SELECTOR),
              newLeft = scrollableArea.scrollLeft();
          if (newLeft !== left) {
              left = newLeft;
              headersToScroll.css('margin-left', '-' + (left - DEFAULT_HEADER_MARGIN) + 'px');
          }
      });
  }.on('didInsertElement'),

  actions: {
      selectRow: function(dataGridColumn, rowDataContext) {
          if (this.get('select') && dataGridColumn && !dataGridColumn.get('preventDefaultSelection')) {
              this.sendAction('select', rowDataContext);
          }
      }
  }
});
