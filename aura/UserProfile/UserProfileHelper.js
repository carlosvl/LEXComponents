({
  getCurrentContact: function(component) {
    var userId = component.get("v.userId");
    var action = component.get("c.getContactForUser");
    var currentFieldSet = component.get("v.fieldSetName");
    var enableCitizenshipFields = component.get("v.enableCitizenshipFields");
    var enablePresentAddress = component.get("v.enablePresentAddress");
    var fieldSetNames = [];

    fieldSetNames.push(currentFieldSet);

    if (enablePresentAddress) {
      fieldSetNames.push("Present_Address");
    }

    if (enableCitizenshipFields) {
      fieldSetNames.push("Citizenship_Fields");
    }

    action.setParams({
      userId: userId,
      fieldSetNames: fieldSetNames
    });

    action.setCallback(this, function(a) {
      var state = a.getState();

      if (state === "SUCCESS") {
        component.set("v.currentContact", a.getReturnValue());
        this.checkCitizenship(component);
      }
    });

    $A.enqueueAction(action);
  },
  clearForm: function(component, fieldSetName) {
    var clearEvent = $A.get("e.c:ClearFieldSetForm");
    clearEvent.setParams({
      fieldSetName: fieldSetName
    });
    clearEvent.fire();
  },
  checkValidation: function(component, requiredFields, fieldSetName) {
    var rfMap = component.get("v.requiredFields");
    var c = component.get("v.currentContact");
    var valid = true;

    if (!rfMap) {
      rfMap = {};
    }

    rfMap[fieldSetName] = requiredFields;

    valid = this.checkCitizenshipValidation(
      component, rfMap["Citizenship_Fields"], c) &&
        this.checkPresentAddressValidation(component,
          rfMap[component.get("Present_Address")], c) &&
        this.checkFieldValidation(component,
          rfMap[component.get("v.fieldSetName")], c)
    
    
    component.set("v.valid", valid);
    component.set("v.requiredFields", rfMap);
  },
  checkCitizenshipValidation: function(component, rf, c) {
    var isNonCitizen = component.get("v.isNonCitizen");

    if (!isNonCitizen) {
      return true;
    } else {
      return this.checkFieldValidation(component, rf, c);
    }
  },
  checkPresentAddressValidation: function(component, rf, c) {
    var presentAddressDiff = component.get("v.presentAddressDiff");

    if (!presentAddressDiff) {
      return true;
    } else {
      return this.checkFieldValidation(component, rf, c);
    }
  },
  checkFieldValidation: function(component, rf, c) {
    var valid = true;

    if(!rf) {
      return false;
    }

    for (var i = 0; i < rf.length; i++) {
      var f = rf[i];
      if (!c[f]) {
        valid = false;
      }
    }

    return valid;
  },
  checkCitizenship: function(component) {
    var c = component.get("v.currentContact");
    
    var isNonCitizen = component.get("v.isNonCitizen");
    
    if(isNonCitizen && c.Citizenship_Status__c != 'Non-US Citizen'){
      this.clearForm(component, 'Citizenship_Fields');
    }
    
    component.set("v.isNonCitizen", c.Citizenship_Status__c != null &&
      c.Citizenship_Status__c == "Non-US Citizen");
  },
  checkPresentAddress: function(component) {
    var c = component.get("v.currentContact");
    
    var presentAddressDiff = component.get("v.presentAddressDiff");
    
    if(presentAddressDiff && !c.Current_Address_Different_than_Permanent__c){
      this.clearForm(component, 'Present_Address');
    }
    
    component.set("v.presentAddressDiff", c.Current_Address_Different_than_Permanent__c);
  },
  saveContact: function(component) {
    var c = component.get("v.currentContact");
    var action = component.get("c.updateContact");

    component.set("v.saveSuccessful", false);
    component.set("v.saveError", false);
    component.set("v.showUserProfileLoading", true);

    action.setParams({
      c: c
    });

    action.setCallback(this, function(a) {
      var state = a.getState();
      var errorMessages = [];

      if (state === "SUCCESS") {
        component.set("v.saveSuccessful", true);
        component.set("v.showUserProfileLoading", false);

        setTimeout(function(){ component.set("v.saveSuccessful", false); }, 5000);

        var e = component.getEvent("profileSaved");
        e.fire();
      } else if (state === "ERROR") {
        component.set("v.saveError", true);
        var errors = a.getError();
        component.set("v.showUserProfileLoading", false);

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
  }
})