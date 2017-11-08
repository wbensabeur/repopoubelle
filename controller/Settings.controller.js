sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,Controller, JSONModel) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.Settings", {
		
		onInit: function() {
			var oList = this.byId("vSettingList");
			this._oList = oList;
			this.getRouter().getRoute("Settings").attachPatternMatched(this._onRouteMatched, this);

		},
		
		_onRouteMatched:function(){
			
		},
		
		onPressNavBack:function(){
			this.getRouter().navTo("Home", {}, true);
		},
		
		onPressSelect:function(oEvent){
			var timeTypeKey = oEvent.getParameter("key");
			this.getModel("settings").setProperty("/timeCountDuration",false);
			this.getModel("settings").setProperty("/timeCountDate",false);
			if(timeTypeKey === "kDuration"){
				this.getModel("settings").setProperty("/timeCountDuration",true);
			}
			if(timeTypeKey === "kDate"){
				this.getModel("settings").setProperty("/timeCountDate",true);
			}
		}
	});
});