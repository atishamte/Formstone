// Component

Formstone.Components = [];

Formstone.Component = function(namespace, methods) {

  Formstone.Components.push(namespace);

  // Register Component

  Formstone.prototype[namespace] = Formstone[namespace] = function(method) {
    var targetMethod = methods[method];
    var targetData = arguments;

    if (Formstone.type(method) === 'object' || !method) {
      targetMethod = methods._construct;
    } else if (targetMethod && method.indexOf('_') !== 0) {
      targetData = Array.prototype.slice.call(targetData, 1);
    }

    if (method == 'defaults' && targetMethod) {
      targetMethod.apply(this, targetData);
    } else if (this instanceof Formstone) {
      if (targetMethod) {
        this.each(function(item, i) {
          targetMethod.apply(item, targetData);
        });

        if (targetMethod === methods._construct && methods._postConstruct) {
          this.each(function(item, i) {
            methods._postConstruct.apply(item);
          });
        }
      }

      return this;
    }
  };

  // jQuery Wrapper

  if (window.jQuery) {
    window.jQuery.fn[namespace] = window.jQuery[namespace] = function() {
      Formstone.prototype[namespace].apply(Formstone(this.toArray()), arguments);

      return this;
    };
  }

};


// Utility

Formstone.Utilities = [];

Formstone.Utility = function(namespace, methods) {

  Formstone.Utilities.push(namespace);

  // Register Utility

  Formstone[namespace] = methods._delegate || function(method) {
    var targetMethod = methods[method];
    var targetData = arguments;

    if (Formstone.type(method) === 'object' || !method) {
      targetMethod = methods._initialize;
    } else if (targetMethod && method.indexOf('_') !== 0) {
      targetData = Array.prototype.slice.call(targetData, 1);
    }

    if (targetMethod) {
      return targetMethod.apply(window, targetData);
    }
  };

  // jQuery Wrapper

  if (window.jQuery) {
    window.jQuery[namespace] = function() {
      return Formstone[namespace].apply(this, arguments);

      // return this;
    };
  }

};