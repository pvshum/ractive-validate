define([lodash], function (_) {

    var Validate = function (ractive, rules, errorSuffix) {

        var self = this;

        self.ractive = ractive;

        self.rules = rules;

        /**
         * If set, if there is a validation error with a given keypath, then the
         * error text will be set at the keypath with the errorSuffix appended.
         */
        self.errorSuffix = errorSuffix || 'ErrorMsg';

        self.patterns = {
            alpha: /[a-z A-Z ]+/,
            alpha_numeric: /[a-zA-Z0-9]+/,
            digits: /-?\d+/,
            required: function (value) {
                return !_.isNull(value) && !_.isEqual(value, '') && !_.isUndefined(value);
            },
            minlength: function (value, param) {
                return !_.isNull(value) && !_.isUndefined(value) && !_.isBoolean(value) &&
                        String(value).length >= parseInt(param, 10);
            },
            maxlength: function (value, param) {
                return !_.isNull(value) && !_.isUndefined(value) && !_.isBoolean(value) &&
                        String(value).length <= parseInt(param, 10);
            }
        };
    };

    Validate.prototype = {

        validate: function () {
            var self = this;

            var validateValue = function (params, rule) {
                var self = this,
                    passed = false,
                    message = params.message || params,
                    param = params.param || null;

                if (_.isFunction(self.patterns[rule])) {
                    passed = self.patterns[rule](self.value, param);
                }
                if (_.isRegExp(self.patterns[rule])) {
                    passed = self.patterns[rule].test(self.value);
                }

                return {
                    rule: rule,
                    passed: passed,
                    message: passed ? '' : message
                };
            };

            var invalidCount = _.filter(self.rules, function (rules, keypath) {
                var invalid = _(rules)
                    .map(validateValue, {
                        patterns: self.patterns,
                        value: self.ractive.get(keypath)
                    })
                    .filter(function (result) {
                        return !result.passed;
                    });

                self.ractive.set(keypath + self.errorSuffix, invalid[0] || null);

                return invalid.length > 0;
            }).length;

            return {
                valid: invalidCount === 0
            };
        }

    };

    return Validate;
});
