import Ember from 'ember';
import DataTable from './data-table';
import layout from '../templates/components/data-table-row';

export default Ember.Component.extend({
  layout,
  tagName: '',

  rowClassNames: null,
  rowClassNameBindings: null,

  render: function () {
      // intentionally left as no-op since this template shouldn't be rendered.
  },

  onInit: function () {
      var table = this.nearestOfType(DataTable);

      Ember.assert('The data-table-row needs to be rendered inside a data-table', table);
      table.set('rowDefinition', this);
  }.on('init')
});
