import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-wp-content-render',
  templateUrl: './wp-content-render.component.html',
  styleUrls: ['./wp-content-render.component.scss']
})
export class WpContentRenderComponent implements OnInit {

  @Input() slug: string;
  @Input() type: string;
  wp_content: string;
  constructor(
    private client: HttpClient
  ) { }

  ngOnInit() {
    var content_type = "pages";
    if(this.type == "post"){
      content_type = "posts";
    }
    this.client.get("https://koraki.io/wp-json/wp/v2/" + content_type + "?slug=" + this.slug).subscribe(a => {  
    if(a[0] && a[0]['content'] && a[0]['content']['rendered']){
        this.wp_content = a[0]['content']['rendered'];
      }
    });
  }

}
