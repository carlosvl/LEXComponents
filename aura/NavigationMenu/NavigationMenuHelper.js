({
	getNavigationLinks : function(component) {
        var action = component.get("c.getNavigationLinks");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.navigationLinks", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	}
})