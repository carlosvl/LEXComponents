({
	doInit: function(component, event, helper) {
        
		var action = component.get("c.getCurrentContact"); // method in the apex class
        action.setCallback(this, function(a) {
            var tempContact = a.getReturnValue();
            console.debug('----- temp contact');
            console.debug(tempContact);

            if (tempContact && tempContact.RegistrationComplete__c != true) {
				console.debug('----- redirecting');
                var redirectAction = component.get("c.getCurrentUser"); // method in the apex class
                redirectAction.setCallback(this, function(b) {
                    var tempUser = b.getReturnValue();
                    console.debug('----- temp user');
                    console.debug(tempUser);

                    var ra = $A.get("e.force:navigateToSObject");

                    ra.setParams({
                      "recordId" : tempUser.Id
                    });

                    ra.fire();

                });
                $A.enqueueAction(redirectAction );
            }
        });
        $A.enqueueAction(action); 

        
    }
})