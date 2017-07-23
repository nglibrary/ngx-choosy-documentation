import { NgxChoosyPage } from './app.po';

describe('ngx-choosy App', () => {
  let page: NgxChoosyPage;

  beforeEach(() => {
    page = new NgxChoosyPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
