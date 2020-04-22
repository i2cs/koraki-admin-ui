import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService, AjaxService } from 'koraki-angular-client';
import { NotificationService } from 'app/services/notification.service';
import { LoadingServiceService } from 'app/services/loading-service.service';
import { BreadcrumbService } from 'app/services/breadcrumb.service';
import { IntegrationConfigurationsDataViewModel } from 'koraki-angular-client/model/integrationConfigurationsDataViewModel';
import { IntegrationConfigurationsUpdateDataModel } from 'koraki-angular-client/model/integrationConfigurationsUpdateDataModel';
import { HighlightTag } from 'angular-text-input-highlight';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-event-config-view',
  templateUrl: './event-config-view.component.html',
  styleUrls: ['./event-config-view.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class EventConfigViewComponent implements OnInit {

  @Input() code: string;
  @Input() applicationId: string;
  integrationList: Array<IntegrationConfigurationsDataViewModel> = [];
  constructor(
    private appservice: ApplicationsService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private breadcrumbService: BreadcrumbService,
    private ajax: AjaxService
  ) { }

  ngOnInit() {
    this.ajax.getIntegrationConfigs(this.code, this.applicationId).subscribe(a => {
      a.forEach(element => {
        element['configs'] =  {
          sample: JSON.stringify({ 
            notificationText: element.sampleNotification,
            thumbnailUrl: element.image,
            createdOnWord: "Few minutes ago"
          })
        };
        this.integrationList.push(this.updateElement(element));
      });
    });
  }

  updateElement(element: IntegrationConfigurationsDataViewModel): IntegrationConfigurationsDataViewModel {
    element['tags'] = [];
    element['originalContent'] = element.templateContent;
    let regex = /{{\s*([^{][^}])+\s*}}/g;
    let hashtag;
    // tslint:disable-next-line
    while ((hashtag = regex.exec(element.templateContent))) {
      element['tags'].push({
        indices: {
          start: hashtag.index,
          end: hashtag.index + hashtag[0].length
        },
        cssClass: 'bg-yellow',
        data: hashtag[1]
      });
    }

    return element;
  }

  getRenderedTemplate(template: IntegrationConfigurationsDataViewModel){
    this.ajax.getSampleTemplate(template.templateContent, this.code, template.templateCode, this.applicationId).subscribe(a => {
      template['configs'] =  {
        sample: JSON.stringify({ 
          notificationText: a.template,
          thumbnailUrl: a.image,
          createdOnWord: "Few minutes ago"
        })
      };
    }, e => {
      this.notify.error(e.error.message);
    });
  }

  updateIntegrationStatus(config: IntegrationConfigurationsDataViewModel){
    let model:IntegrationConfigurationsUpdateDataModel = {};
    model.enabled = config.enabled;
    this.ajax.updateIntegrationConfigs(model, this.code, config.templateCode, this.applicationId).subscribe(a => {
      this.notify.success(config.templateName + " is successfully turned " + (model.enabled ? "<b>on</b>" : "<b>off</b>"));
    }, e => {
      this.notify.error(e.error.message);
    });
  }

  updateTemplate(config: IntegrationConfigurationsDataViewModel){
    let model:IntegrationConfigurationsUpdateDataModel = {};
    model.templateContent = config.templateContent;
    this.ajax.updateIntegrationConfigs(model, this.code, config.templateCode, this.applicationId).subscribe(a => {
      this.notify.success(config.templateName + " template successfully updated");
      config['dirty'] = false;
    }, e => {
      this.notify.error(e.error.message);
    });
  }

  reset(element: IntegrationConfigurationsDataViewModel){
    element.templateContent = element["originalContent"];
  }

  trackByFn(index, item) {
    return item;
  }

}