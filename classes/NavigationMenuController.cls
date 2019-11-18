public with sharing class NavigationMenuController {

  private static final String URL_TEMPLATE = '{0}/{1}';

  @AuraEnabled
  public static List<NavigationLinkWrapper> getNavigationLinks() {
    NavigationLinkWrapper currentWrapper;
    List<NavigationLinkWrapper> links = new List<NavigationLinkWrapper>();

    for (Navigation_Link__c nl :
        [select Id,
                Name,
                Link__c,
                Append_User_Id__c
         from Navigation_Link__c
         order by Sort_Order__c asc]) {
      currentWrapper = new NavigationLinkWrapper();
      currentWrapper.label = nl.Name;

      currentWrapper.link = (nl.Append_User_Id__c) ? String.format(URL_TEMPLATE,
        new List<String> { nl.Link__c, UserInfo.getUserId() }) : nl.Link__c;

      links.add(currentWrapper);
    }

    return links;
  }
}