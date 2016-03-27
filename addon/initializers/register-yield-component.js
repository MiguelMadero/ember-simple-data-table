import Ember from 'ember';

export function initialize(/* application */) {
  var yieldComponentHelper = function (params, hash, options, env) {
      let componentToRender = params.splice(0,1)[0].value();
      return componentToRender._yield(this, env, options.morph, params);
  };

  Ember.HTMLBars._registerHelper('yield-component', yieldComponentHelper);
}

export default {
  name: 'register-yield-component',
  initialize
};
