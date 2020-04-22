import { Component, OnInit, Input } from '@angular/core';
import { AjaxService } from 'koraki-angular-client';
import { RuleConfig } from 'koraki-angular-client/model/ruleConfig';
import { IntegrationRules } from 'koraki-angular-client/model/integrationRules';
import { IntegrationRulesDataModel } from 'koraki-angular-client/model/integrationRulesDataModel';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-rule-config-view',
  templateUrl: './rule-config-view.component.html',
  styleUrls: ['./rule-config-view.component.scss']
})
export class RuleConfigViewComponent implements OnInit {

  @Input() code: string;
  @Input() applicationId: string;
  index: number;
  ruleConfigs: Array<RuleConfig>;
  rulesList: Array<IntegrationRules> = [{}];
  rulesListDefault: Array<IntegrationRules> = [{}];

  constructor(
    private ajaxService: AjaxService,
    private notify: NotificationService,
  ) { }

  ngOnInit() {
    this.ajaxService.getIntegrationRules(this.code, this.applicationId).subscribe(a => {
      this.ruleConfigs = a.ruleConfigs;
      if(a.rules && a.rules.length > 0){
        this.rulesList = a.rules;
        this.rulesListDefault = JSON.parse(JSON.stringify(a.rules));
      }
    }, e => {
      this.notify.error(e.error.message);
    });
  }

  trackByFn(index, item) {
    return item;
  }

  remove(i){
    var sure = confirm("Are you sure to remove this rule?");
    if(sure){
      this.rulesList.splice(i, 1);
    }
  }

  add(){
    this.rulesList.push({});
  }

  updateRules(){
    let model: IntegrationRulesDataModel = {
      rules : this.rulesList
    };
    this.ajaxService.updateIntegrationRules(model, this.code, this.applicationId).subscribe(a => {
      this.notify.success("Rules successfully updated");
    }, e => {
      this.notify.error(e.error.message);
    });
  }

  resetRules(){
    this.rulesList = JSON.parse(JSON.stringify(this.rulesListDefault));
  }
}
