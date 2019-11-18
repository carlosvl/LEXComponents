public with sharing class ApplicationUtils {

  private static final String SELECT_ONE_OPTION = '-- Select One --';
  private static final Set<String> RECORD_TYPE_FIELDS = new Set<String> {
    'RecordType.Name', 'RecordType.DeveloperName' };
  private static final Set<String> TERM_AND_SESSION_FIELDS = new Set<String> {
    'Entry_Term__r.Name', 'Term_Session__r.Name' };

  @AuraEnabled
  public static Admissions__c getAdmissionById(Id admissionId) {
    if (String.isBlank(admissionId)) {
      return null;
    }

    Set<String> additionalFields = new Set<String>();

    additionalFields.addAll(RECORD_TYPE_FIELDS);
    additionalFields.addAll(TERM_AND_SESSION_FIELDS);

    return (Admissions__c) QueryUtils.queryObject(
      admissionId, additionalFields);
  }

  public static RecordType getSpecificRecordType(String objectName,
      String developerName) {
    if (String.isBlank(objectName) || String.isBlank(developerName)) {
      return null;
    }

    try {
      return [select Id,
                     Name,
                     DeveloperName
              from RecordType
              where SObjectType = :objectName
              and DeveloperName = :developerName];
    } catch (Exception e) {
      return null;
    }
  }

  public static List<Term__c> getActiveTerms() {
    return [select Id,
                   Name
            from Term__c
            where Active_Display_on_Online_Application__c = true
            order by Term_Start_Date__c asc];
  }

  public static List<Session__c> getSessionsByTerm(Id termId) {
    if (String.isBlank(termId)) {
      return null;
    }

    return [select Id,
                   Name
            from Session__c
            where Term__c = :termId
            order by Start_Date__c asc];
  }

  public static List<RecordType> getRecordTypesForObject(String objectName) {
    if (String.isBlank(objectName)) {
      return null;
    }

    return [select Id,
                   Name,
                   DeveloperName
            from RecordType
            where SObjectType = :objectName
            order by Name asc];
  }

  public static Contact getContactForUser(Id userId) {
    if (String.isBlank(userId)) {
      return null;
    }

    return [select Id,
                   ContactId,
                   Contact.Id,
                   Contact.Name,
                   Contact.FirstName,
                   Contact.LastName
            from User
            where Id = :userId].Contact;
  }

  public static Map<String, List<SelectOption>>
      getSelectOptionsForFieldAndObject(
        Schema.DescribeSObjectResult objectDescribe, List<String> fieldNames) {
    return getSelectOptionsForFieldAndObject(objectDescribe, fieldNames, true);
  }

  public static Map<String, List<SelectOption>>
      getSelectOptionsForFieldAndObject(
        Schema.DescribeSObjectResult objectDescribe, List<String> fieldNames,
          Boolean addEmptyOption) {
    if (objectDescribe == null || fieldNames == null || fieldNames.isEmpty()) {
      return null;
    }

    Schema.DescribeFieldResult fd;
    Schema.SObjectField field;
    List<SelectOption> options;
    Map<String, Schema.SObjectField> fieldMap = objectDescribe.fields.getMap();
    Map<String, List<SelectOption>> optionMap =
      new Map<String, List<SelectOption>>();

    for (String fn : fieldNames) {
      field = fieldMap.get(fn);

      if (field == null) {
        continue;
      }

      fd = field.getDescribe();
      options = new List<SelectOption>();

      if (addEmptyOption) {
        options.add(new SelectOption('', SELECT_ONE_OPTION));
      }

      for (Schema.PicklistEntry ple : fd.getPicklistValues()) {
        options.add(new SelectOption(ple.getValue(), ple.getLabel()));
      }

      optionMap.put(fn, options);
    }

    return optionMap;
  }
}