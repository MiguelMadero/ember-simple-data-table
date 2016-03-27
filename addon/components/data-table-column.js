import Ember from 'ember';
import layout from '../templates/components/data-table-column';
import DataTable from './data-table';

const SORT_DIRECTION_CLASS_MAP = {
    asc: 'data-grid-icon data-grid-i-arrow-n',
    desc: 'data-grid-icon data-grid-i-arrow-s'
};
const WithSortableColumnSupport = Ember.Mixin.create({
    // attrs
    /***
     * Field used for sorting and default text cells
     */
    field: Ember.required,
    isSortable: true,

    /***
     * Set by data-grid when changing the sort. Asc, desc or null when not sorting
     */
    sortDirection: null,
    sortDirectionClass: function () {
        return SORT_DIRECTION_CLASS_MAP[this.get('sortDirection')];
    }.property('sortDirection'),
});

export default Ember.Component.extend(WithSortableColumnSupport, {
  layout,
  tagName: '',

  render: function () {
      // intentionally left as no-op since this template shouldn't be rendered.
  },

  style: function() {
      var width = this.get('width');
      if (width) {
          return 'min-width: ' + width + '; max-width: ' + width + '; width: ' + width;
      }
  }.property('width'),

  // attrs
  width: null,
  title: Ember.required,
  shown: true,
  preventDefaultSelection: false,

  onInit: function () {
      var table = this.nearestOfType(DataTable);
      Ember.assert('The data-table-column needs to be rendered inside a data-table', table);
      this.set('_table', table);
      table.get('columns').pushObject(this);
  }.on('init'),

  content: Ember.computed.alias('_table.sortedContent')
});
