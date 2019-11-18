({
	postApplicationFetch: function(component) {
    console.log("about to get user for profile");
    this.getUserForProfile(component);
	},
  getUserForProfile: function(component) {
    var admissionsId = component.get("v.admissionsId");
    var action = component.get('c.getUserForAdmission');

    action.setParams({
      admissionsId: admissionsId
    });

    action.setCallback(this, function(a) {
      var state = a.getState();

      console.log(a.getReturnValue());

      if (state === "SUCCESS") {
        component.set("v.currentUser", a.getReturnValue());
      }
    });

    $A.enqueueAction(action);
  }
})