import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService, AjaxService } from 'koraki-angular-client';
import { NotificationService } from 'app/services/notification.service';
import { LoadingServiceService } from 'app/services/loading-service.service';
import { BreadcrumbService } from 'app/services/breadcrumb.service';
import { IntegrationConfigurationsDataViewModel } from 'koraki-angular-client/model/integrationConfigurationsDataViewModel';
import { IntegrationConfigurationsUpdateDataModel } from 'koraki-angular-client/model/integrationConfigurationsUpdateDataModel';

@Component({
  selector: 'app-event-config-view',
  templateUrl: './event-config-view.component.html',
  styleUrls: ['./event-config-view.component.scss']
})
export class EventConfigViewComponent implements OnInit {

  @Input() code: string;
  @Input() applicationId: string;
  integrationList: Array<IntegrationConfigurationsDataViewModel>;

  constructor(
    private appservice: ApplicationsService,
    private notify: NotificationService,
    private loadingService: LoadingServiceService,
    private breadcrumbService: BreadcrumbService,
    private ajaxService: AjaxService
  ) { }

  ngOnInit() {

    this.ajaxService.getIntegrationConfigs(this.code, this.applicationId).subscribe(a => {
      this.integrationList = a;
    });
  }

  updateIntegrationStatus(config: IntegrationConfigurationsDataViewModel){
    let model:IntegrationConfigurationsUpdateDataModel = {};
    model.enabled = config.enabled;
    this.ajaxService.updateIntegrationConfigs(model, this.code, config.templateCode, this.applicationId).subscribe(a => {
      this.notify.success(config.templateName + " is successfully turned " + (model.enabled ? "<b>on</b>" : "<b>off</b>"));
    }, e => {
      this.notify.error(e.error.message);
    });
  }

  updateTemplate(config: IntegrationConfigurationsDataViewModel){
    let model:IntegrationConfigurationsUpdateDataModel = {};
    model.templateContent = config.templateContent;
    this.ajaxService.updateIntegrationConfigs(model, this.code, config.templateCode, this.applicationId).subscribe(a => {
      this.notify.success(config.templateName + " template successfully updated");
      config['dirty'] = false;
    }, e => {
      this.notify.error(e.error.message);
    });
  }

  trackByFn(index, item) {
    return item;
  }

}
