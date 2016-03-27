import Ember from 'ember';
import layout from '../templates/components/data-default-cell';

export default Ember.Component.extend({
  layout,
  tagName: '',

  // attrs
  field: Ember.required,
  row: Ember.required,

  displayText: function () {
      // TODO: [later] add observer dynamically to refresh the displayText
      return Ember.get(this.get('row'), this.get('field'));
  }.property('row', 'field')
});
