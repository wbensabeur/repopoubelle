sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController, Controller, JSONModel, Device) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.Menu", {

		onInit: function() {
			//this.getRouter().getRoute("Home").attachPatternMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function() {

		},

		onPressSettings: function(oEvent) {
			this.getRouter().navTo("Settings", {}, true);
		},

		onPressNavigationMenu: function(oEvent) {

		},

		onPressTimeCreate: function(oEvent) {
			this.getRouter().navTo("TimeCreate", {}, true);
		},

		onPressAllowanceCreate: function(oEvent) {
			this.getModel("utilityModel").setProperty("/isAllowanceCreate", false);
			this.getRouter().navTo("DailyAllowanceCreate", {}, true);
		},

		onPressKilometerCreate: function(oEvent) {
			this.getModel("utilityModel").setProperty("/isKilometerCreate", false);
			this.getRouter().navTo("KilometerCreate", {}, true);
		},

		onPressAbsenceCreate: function(oEvent) {
			this.getModel("utilityModel").setProperty("/isAbsenceCreate", false);
			this.getRouter().navTo("AbsenceCreate", {}, true);
		},

		onPressEquipEntryCreate: function(oEvent) {
			this.getModel("utilityModel").setProperty("/isEquipmentCreate", false);
			this.getRouter().navTo("EquipmentEntryCreate", {}, true);
		},
		
		onPressWeeklyReport:function(oEvent){
			this.getRouter().navTo("WeeklyReport", {}, true);
		}
	});
});