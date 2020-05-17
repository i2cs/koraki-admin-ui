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
        var variables = {};
        if(element.variables && element.variables.length > 0){
          element.variables.forEach(a => {
            variables[a.variable] = a.sample;
          });
        }
        var object = { 
          notificationText: element.sampleNotification,
          thumbnailUrl: element.image,
          createdOnWord: "Few minutes ago",
          variables: variables
        };

        if(element.notificationType == "AnalyticsLive" 
        || element.notificationType == "AnalyticsHour"
        || element.notificationType == "AnalyticsVisitorCity"
        || element.notificationType == "AnalyticsCountry"){
          object['analytics'] = true;
          object['createdOnWord'] = "Live";
          var number = element.variables.filter(a => a.variable == "count");
          if(number.length > 0){
            object['number'] = number[0].sample;
          }
        }

        if(element.inputs){
          element.inputs.forEach(input => {
            input[input.code] = input.value;
          });
        }

        element['configs'] =  {
          sample: JSON.stringify(object)
        };
        this.integrationList.push(this.updateElement(element));
      });
    });
  }

  updateElement(element: IntegrationConfigurationsDataViewModel): IntegrationConfigurationsDataViewModel {
    element['tags'] = [];
    element['originalContent'] = element.templateContent;
    if(element['inputs']){
      element.inputs.forEach(a => {
        a['_' + a.code] = a.value;
      })
    }
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
      var object = JSON.parse(template['configs']['sample']);
      object['notificationText'] = a.template;
      object['thumbnailUrl'] = a.image;
      
      template['configs'] =  {
        sample: JSON.stringify(object)
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
    let inputs: any = {};
    config.inputs.forEach(e => {
      inputs[e.code] = e[e.code];
    });
    model.templateContent = config.templateContent;
    model.inputs = inputs;
    this.ajax.updateIntegrationConfigs(model, this.code, config.templateCode, this.applicationId).subscribe(a => {
      this.notify.success(config.templateName + " template and settings successfully updated");
      config['dirty'] = false;
    }, e => {
      this.notify.error(e.error.message);
    });
  }

  reset(element: IntegrationConfigurationsDataViewModel){
    element.templateContent = element["originalContent"];
    if(element.inputs){
      element.inputs.forEach(a => {
        a[a.code] = a['_' + a.code];
      });
    }
  }

  trackByFn(index, item) {
    return item;
  }

}
