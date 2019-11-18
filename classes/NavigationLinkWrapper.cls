public with sharing class NavigationLinkWrapper {
  @AuraEnabled
	public String label { get; set; }

  @AuraEnabled
  public String link { get; set; }
}