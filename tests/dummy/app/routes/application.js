import Ember from 'ember';
import people from 'dummy/models/people';

export default Ember.Route.extend({
  model () {
    return people;
  }
});
