var register = function(Handlebars) {
    var helpers = {
    eachData: function(context, options) {
      var fn = options.fn, inverse = options.inverse, ctx;
      var ret = "";

      if(context && context.length > 0) {
        for(var i=0, j=context.length; i<j; i++) {
          ctx = Object.create(context[i]);
          ctx.index = i;
          ret = ret + fn(ctx);
        }
      } else {
        ret = inverse(this);
      }
      return ret;
    },
    math: function(lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue
        }[operator];
    }
};

if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (var prop in helpers) {
        Handlebars.registerHelper(prop, helpers[prop]);
    }
} else {
    return helpers;
}

};

module.exports.register = register;
module.exports.helpers = register(null); 

