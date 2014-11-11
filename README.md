Ractive.js form data model validation.
================
Based off initial investigation into existing libraries like [Ractive Validator](https://github.com/stewartml/ractive-validator) and [Foundation Abide](http://foundation.zurb.com/docs/components/abide.html)

The Problem
------
DOM manipulation style libraries (Abide) work terribly with reactive templating, and cause headaches. Data validation is the better approach, and aligns well with reactive templating approach.

The Solution
------
When you define your widget in JavaScript, in the constructor you do this:
```javascript
// Create instance of RactiveValidate, passing the reactive widget instance (to get data from) AND a validation definition.
self.validation = new RactiveValidate(self.ractive, {
    'data.accName': {
        required: 'Please enter the account name',
        alpha: 'Please enter a valid name',
        someCustomRuleIMadeUp: 'You obey this rule!'
    }
});
```
```javascript
// Allow for custom validation rules for this specific widget.
// Note we forsee a process of identifying shared rules and lifting them out of the widget and into RactiveValidate (just like abide).
_.extend(self.validation.patterns, {
    someCustomRuleIMadeUp: function (data) {
        // Your code here
        return someBooleanResult;
    }
});
```
