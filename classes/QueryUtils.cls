public with sharing class QueryUtils {

  private static final String QUERY_TEMPLATE =
    'select {0} from {1} where Id in :objectIds';
  private static final String FIELD_SEPARATOR = ',';

  public static SObject queryObject(Id objectId) {
    return queryObject(objectId, null);
  }

  public static SObject queryObjectFromFieldSets(Id objectId,
      List<String> fieldSetNames) {
    if (String.isBlank(objectId) || fieldSetNames == null ||
        fieldSetNames.isEmpty()) {
      return null;
    }

    List<SObject> results = queryObjectsFromFieldSets(
      new Set<Id> { objectId }, fieldSetNames);

    return (results.isEmpty()) ? null : results[0];
  }

  public static List<SObject> queryObjectsFromFieldSets(Set<Id> objectIds,
      List<String> fieldSetNames) {
    if (objectIds == null || objectIds.isEmpty() || fieldSetNames == null ||
        fieldSetNames.isEmpty()) {
      return null;
    }

    Schema.SObjectType objectType = new List<Id>(objectIds)[0].getSObjectType();

    return Database.query(generateQuery(
      getFieldNamesFromFieldSets(objectType, fieldSetNames), objectType));
  }

  public static SObject queryObject(Id objectId, Set<String> additionalFields) {
    if (String.isBlank(objectId)) {
      return null;
    }

    List<SObject> results = queryObjects(new Set<Id> { objectId },
      additionalFields);

    return (results.isEmpty()) ? null : results[0];
  }

  public static List<SObject> queryObjects(Set<Id> objectIds) {
    return queryObjects(objectIds, null);
  }

  public static List<SObject> queryObjects(Set<Id> objectIds,
      Set<String> additionalFields) {
    if (objectIds == null || objectIds.isEmpty()) {
      return null;
    }

    Schema.SObjectType objectType = new List<Id>(objectIds)[0].getSObjectType();

    return Database.query(generateQuery(
      getFieldNames(objectType, additionalFields), objectType));
  }

  private static String getFieldNamesFromFieldSets(
      Schema.SObjectType objectType, List<String> fieldSetNames) {
    Set<String> fieldNames = new Set<String>();
    List<Schema.FieldSetMember> currentMembers;
    Map<String, Schema.FieldSet> fsMap =
      objectType.getDescribe().fieldSets.getMap();

    for (String fsn : fieldSetNames) {
      if (!fsMap.containsKey(fsn)) {
        continue;
      }

      currentMembers = fsMap.get(fsn).getFields();

      for (Schema.FieldSetMember m : currentMembers) {
        fieldNames.add(m.getFieldPath());
      }
    }

    return String.join(new List<String>(fieldNames), FIELD_SEPARATOR);
  }

  private static String getFieldNames(
      Schema.SObjectType objectType, Set<String> additionalFields) {
    Set<String> allFields = new Set<String>(
      objectType.getDescribe().fields.getMap().keySet());

    if (additionalFields != null) {
      allFields.addAll(additionalFields);
    }

    return String.join(new List<String> (allFields), FIELD_SEPARATOR);
  }

  private static String generateQuery(String fieldNames,
      Schema.SObjectType objectType) {
    return String.format(QUERY_TEMPLATE, new List<String> { fieldNames,
      objectType.getDescribe().getName() });
  }
}