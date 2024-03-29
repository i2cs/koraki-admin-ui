import { Component, OnInit, Input } from '@angular/core';
import { AjaxService, IntegrationConfigurationsDataViewModel } from 'koraki-angular-client';
import { RuleConfig } from 'koraki-angular-client/model/ruleConfig';
import { IntegrationRules } from 'koraki-angular-client/model/integrationRules';
import { IntegrationRulesDataModel } from 'koraki-angular-client/model/integrationRulesDataModel';
import { NotificationService } from 'app/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rule-config-view',
  templateUrl: './rule-config-view.component.html',
  styleUrls: ['./rule-config-view.component.scss']
})
export class RuleConfigViewComponent implements OnInit {

  @Input() code: string;
  @Input() applicationId: string;
  index: number = 0;
  ruleConfigs: Array<RuleConfig>;
  rulesList: Array<IntegrationRules> = [{}];
  rulesListDefault: Array<IntegrationRules> = [{}];
  events: IntegrationConfigurationsDataViewModel[];

  constructor(
    private ajax: AjaxService,
    private notify: NotificationService,
  ) { }

  ngOnInit() {
    this.ajax.getIntegrationRules(this.code, this.applicationId).subscribe(a => {
      this.ruleConfigs = a.ruleConfigs;
      if(a.rules && a.rules.length > 0){
        a.rules.forEach(b => { 
          if(!b.event){
            b.event = "all";
          }
        });
        this.rulesList = a.rules;
        this.rulesListDefault = JSON.parse(JSON.stringify(a.rules));
      }
    }, e => {
      this.notify.error(e.error.message);
    });

    this.ajax.getIntegrationConfigs(this.code, this.applicationId).subscribe(a => {
      this.events = a;
    });
  }

  trackByFn(index, item) {
    return item;
  }

  remove(i){
    var sure = confirm("Are you sure to remove this rule?");
    if(sure){
      this.rulesList.splice(i, 1);
      if(this.rulesList.length > 1){
        this.rulesList[0].combine = "";
      }
    }
  }

  add(type, position){
    this.rulesList.splice(position + 1, 0, { combine: type, event: "all" });
  }

  updateRules(){
    let model: IntegrationRulesDataModel = {
      rules : this.rulesList
    };
    this.ajax.updateIntegrationRules(model, this.code, this.applicationId).subscribe(a => {
      this.notify.success("Rules successfully updated");
    }, e => {
      this.notify.error(e.error.message);
    });
  }

  resetRules(){
    this.rulesList = JSON.parse(JSON.stringify(this.rulesListDefault));
  }
}
