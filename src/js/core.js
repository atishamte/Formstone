(function(window) {

  // Core

  var Formstone = (function() {
    // Umbrella

    //=include umbrellajs/src/umbrella.js
    //=include umbrellajs/src/plugins/addclass/addclass.js
    //=include umbrellajs/src/plugins/adjacent/adjacent.js
    //=include umbrellajs/src/plugins/after/after.js
    //=include umbrellajs/src/plugins/append/append.js
    //=include umbrellajs/src/plugins/args/args.js
    //=include umbrellajs/src/plugins/array/array.js
    //=include umbrellajs/src/plugins/attr/attr.js
    //=include umbrellajs/src/plugins/before/before.js
    //=include umbrellajs/src/plugins/children/children.js
    //=include umbrellajs/src/plugins/data/data.js
    //=include umbrellajs/src/plugins/each/each.js
    //=include umbrellajs/src/plugins/eacharg/eacharg.js
    //=include umbrellajs/src/plugins/filter/filter.js
    //=include umbrellajs/src/plugins/find/find.js
    //=include umbrellajs/src/plugins/first/first.js
    //=include umbrellajs/src/plugins/generate/generate.js
    //=include umbrellajs/src/plugins/html/html.js
    //=include umbrellajs/src/plugins/is/is.js
    //=include umbrellajs/src/plugins/isInPage/isInPage.js
    //=include umbrellajs/src/plugins/map/map.js
    //=include umbrellajs/src/plugins/not/not.js
    //=include umbrellajs/src/plugins/off/off.js
    //=include umbrellajs/src/plugins/on/on.js
    //=include umbrellajs/src/plugins/pairs/pairs.js
    //=include umbrellajs/src/plugins/prepend/prepend.js
    //=include umbrellajs/src/plugins/remove/remove.js
    //=include umbrellajs/src/plugins/removeClass/removeClass.js
    //=include umbrellajs/src/plugins/select/select.js
    //=include umbrellajs/src/plugins/size/size.js
    //=include umbrellajs/src/plugins/slice/slice.js
    //=include umbrellajs/src/plugins/str/str.js
    //=include umbrellajs/src/plugins/trigger/trigger.js
    //=include umbrellajs/src/plugins/unique/unique.js

    //=include includes/methods.js

    return u;
  })();

  //=include includes/plugin.js
  //=include includes/storage.js
  //=include includes/utils.js

  // Expose

  window.Formstone = Formstone;

})(window);