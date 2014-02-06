describe('ContactsBook', function() {

  beforeEach(function() {
    browser().navigateTo('/index.html');
  });

  it('should load the first page', function() {
      expect(element('title').text()).toEqual("Contacts Book");
  });

  it('should show search box and list of contacts with no selection', function() {
      expect(repeater('input.contacts-searchbox').count()).toBe(1);
      expect(repeater('div.contact-short-info').count()).toBe(5);
      expect(repeater('div.contact-short-info.selected').count()).toBe(0);

      //Contact details panel is hidden
      expect(repeater('.contact-properties input').count()).toBe(0);
  });

  it('should allow selecting a contact', function() {
      element('div:first-child.contact-short-info').click();
      expect(repeater('div:first-child.contact-short-info.selected').count()).toBe(1);

      //Contact details panel is shown
      expect(repeater('.contact-properties input').count()).toBe(4);
  });

  it('should allow searching a contact', function() {
      input('searchTerm').enter('Catherine');

      expect(repeater('div.contact-short-info').count()).toBe(1);
  });
});