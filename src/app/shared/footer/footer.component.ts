import { Component } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-footer-cmp',
    templateUrl: 'footer.component.html'
})

export class FooterComponent {
    date: Date = new Date();
    version: string = environment.version;

    constructor(){
        console.log("Koraki app version : " + environment.version);
    }
}
