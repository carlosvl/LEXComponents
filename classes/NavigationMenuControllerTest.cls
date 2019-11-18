@isTest
private class NavigationMenuControllerTest {
	static testMethod void testNavigationMenuController() {
    Test.startTest();

    List<NavigationLinkWrapper> links =
      NavigationMenuController.getNavigationLinks();

    System.assertEquals(true, links.isEmpty());

    Navigation_Link__c testLink = TestUtils.createNavigationLink();
    insert testLink;

    links = NavigationMenuController.getNavigationLinks();

    System.assertEquals(1, links.size());

    Test.stopTest();
  }
}