({
	initializeObjects: function(component) {
    var contact = {};
    contact.sobjectType = 'Contact';

    component.set("v.currentContact", contact);
	},
  checkForDuplicateUsername: function(component) {
    var action = component.get("c.getIsUsernameTaken");

    action.setParams({
      un: component.get("v.currentContact").Email
    });

    action.setCallback(this, function(a) {
      var state = a.getState();

      if (state === "SUCCESS") {
        var isTaken = a.getReturnValue();
        component.set("v.showDuplicateUserError", isTaken);

        if (!isTaken) {
          this.save(component);
        }
      } 
    });

    $A.enqueueAction(action);
  },
  save: function(component) {
    var action = component.get("c.createUser");

    component.set("v.savingInProgress", true);

    action.setParams({
      contact: component.get("v.currentContact")
    });

    action.setCallback(this, function(a) {
      var state = a.getState();

      console.log(state);
      console.log(a.getError());

      if (state === "SUCCESS") {
        component.set("v.savingInProgress", false);
        window.location.href = component.get("v.confirmationUrl");
      } else if (state === "ERROR") {
        component.set("v.savingInProgress", false);
        component.set("v.saveError", true);
        var errorMessages = [];
        var errors = a.getError();

        for (i in errors) {
          var currentError = errors[i];

          for (currentField in currentError.fieldErrors) {
            for (cfe in currentError.fieldErrors[currentField]) {
              errorMessages.push(
                currentError.fieldErrors[currentField][cfe].message);
            }
          }
        }

        component.set("v.errorMessages", errorMessages);
      }
    });

    $A.enqueueAction(action);
  },
  checkValidation: function(component) {
    var c = component.get("v.currentContact");
    var requiredFields = component.get("v.requiredFields");
    var valid = true;

    for (var i = 0; i < requiredFields.length; i++) {
      if (!c[requiredFields[i]]) {
        valid = false;
      }
    }


    component.set("v.valid", valid);
  },
  getTermOptions: function(component) {
    var action = component.get("c.getTermOptions");

    action.setCallback(this, function(a) {
      var state = a.getState();

      if (state === "SUCCESS") {
          var options = a.getReturnValue();

          var termOptions = [];

          var emptyOption = {};
          emptyOption.value = "";
          emptyOption.label = "-- Select One -- ";

          termOptions.push(emptyOption);

          for (var i = 0; i < options.length; i++) {
            var currentOption = {};

            currentOption.value = options[i].Name;
            currentOption.label = options[i].Name;
            termOptions.push(currentOption);
          }

          var cl = component.find("Entry_Term__c");
          if (!cl) {
            return;
          }
          cl.set("v.options", termOptions);
      }
    });

    $A.enqueueAction(action);
  }
})