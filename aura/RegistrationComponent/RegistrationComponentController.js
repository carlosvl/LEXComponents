({
	doInit: function(component, event, helper) {
    helper.initializeObjects(component);
    helper.getTermOptions(component);
	},
  save: function(component, event, helper) {
    helper.checkForDuplicateUsername(component);
  },
  handleFormUpdate: function(component, event, helper) {
    var requiredFields = component.get("v.requiredFields");
    var eventRequiredFields = event.getParam("requiredFields");

    if (eventRequiredFields) {
      for (var i = 0; i < eventRequiredFields.length; i++) {
        requiredFields.push(eventRequiredFields[i]);
      }
    }

    component.set("v.requiredFields", requiredFields);

    helper.checkValidation(component);
  },
  handleTermChange: function(component, event, helper) {
    helper.checkValidation(component);
  }
})