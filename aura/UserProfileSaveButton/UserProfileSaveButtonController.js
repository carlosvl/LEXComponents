({
  doDoneRendering: function(component, event, helper) {
    var hideEvent = $A.get("e.c:UserProfileHideSaveButton");
    hideEvent.fire();
  },
	save: function(component, event, helper) {
    var clickEvent = $A.get("e.c:UserProfileSaveButtonClick");
    clickEvent.fire();
	}
})