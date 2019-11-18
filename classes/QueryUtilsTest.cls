@isTest
private class QueryUtilsTest {

  private static Map<Id, Account> accounts;

  static testMethod void testQueryUtils() {
    initTestData();

    Test.startTest();

    System.assertEquals(null, QueryUtils.queryObject(null));
    System.assertEquals(null, QueryUtils.queryObjects(null));
    System.assertEquals(null, QueryUtils.queryObjects(new Set<Id>()));

    Account a = accounts.values()[0];

    Account testAccount = (Account) QueryUtils.queryObject(a.Id);

    System.assertEquals(a.Id, testAccount.Id);

    List<Account> testAccountList = QueryUtils.queryObjects(accounts.keySet());

    System.assertEquals(accounts.size(), testAccountList.size());

    for (Account acc : testAccountList) {
      System.assertEquals(true, accounts.containsKey(acc.Id));
    }

    Test.stopTest();
  }

  private static void initTestData() {
    List<Account> aList = new List<Account>();

    for (Integer i = 0; i < 10; i++) {
      aList.add(TestUtils.createAccount());
    }

    insert aList;

    accounts = new Map<Id, Account>(aList);
  }
}