
var customMatchers = {

  toBeIn: function() {

    return {
      compare: function(actual, expected) {
        var result = {
          pass: false
        };

        result.pass = (actual >= expected[0] && actual <= expected[1]);

        return result;
      }
    };
  }

};
