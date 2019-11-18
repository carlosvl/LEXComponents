({
	doInit: function(component, event, helper) {
    helper.getCurrentContact(component);
	},
  handleFormUpdate: function(component, event, helper) {
    helper.checkCitizenship(component);
    helper.checkPresentAddress(component);
    helper.checkValidation(component, event.getParam("requiredFields"),
      event.getParam("fieldSetName"));
  },
  save: function(component, event, helper) {
    helper.saveContact(component);
  },
  handleHideSaveButton: function(component, event, helper) {
    component.set("v.hideSaveButton", true);
  },
  handleMassSave: function(component, event, helper) {
    var valid = component.get("v.valid");

    if (valid) {
      helper.saveContact(component);
    }
  },
  doneRendering: function(component, event, helper) {
    component.set("v.showUserProfileLoading", false);
  }
})