import Ember from 'ember';
import layout from '../templates/components/data-table-row-wrapper';

const EXPECTED_CLASS_NAMES = ['ember-view'];

export default Ember.Component.extend({
  layout,
  attributeBindings: ['style'],
  classNameBindings: ['isSelected:is-selected'],
  layoutName: 'components/data-table-row-wrapper',
  tagName: 'tr',

  content: null,
  hasSelectAction: false,
  index: null,
  rowClassNames: null,
  rowClassNameBindings: null,
  selectedIndex: null,
  shownColumns: null,
  style: null,

  canSelect: Ember.computed('hasSelectAction', 'isSelected', function() {
      return this.get('hasSelectAction') && !this.get('isSelected');
  }),

  isSelected: Ember.computed('index', 'selectedIndex', function() {
      return this.get('index') === this.get('selectedIndex');
  }),

  applyRowClassNames: Ember.on('init', function() {
      var rowClassNames = this.get('rowClassNames'),
          rowClassNameBindings = this.get('rowClassNameBindings'),
          classNameBindings = this.get('classNameBindings');

      if (Ember.isPresent(rowClassNames)) {
          this.set('classNames', EXPECTED_CLASS_NAMES.concat(rowClassNames));
      }

      if (Ember.isPresent(rowClassNameBindings)) {
          this.set('classNameBindings', classNameBindings.concat(rowClassNameBindings));
      }
  }),

  actions: {
      selectRow: function(dataColumn, dataContext) {
          this.sendAction('selectRow', dataColumn, dataContext);
      }
  }
});
