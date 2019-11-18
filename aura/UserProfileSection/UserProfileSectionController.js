({
  doInit : function(component, event, helper) {
    component.set("v.currentSectionName", "UserProfileSection");
    component.set("v.showNextButton", false);
  },
  handleProfileSaved: function(component, event, helper) {
    component.set("v.showNextButton", true);
  }
})