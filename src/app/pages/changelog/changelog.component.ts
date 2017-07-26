import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent implements OnInit {

  changelogUrl = `https://raw.githubusercontent.com/nglibrary/ngx-choosy/master/CHANGELOG.md`;
  // changelogUrl = `https://api.github.com/repos/nglibrary/ngx-choosy/contents/CHANGELOG.md`;
  mdContent;
  constructor(private http: Http) { }

  ngOnInit() {
    this.http.get(this.changelogUrl).subscribe(res => {
      this.mdContent = res.text();
    });
  }

}
