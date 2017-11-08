sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController, Controller, JSONModel, Device) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.EquipmentDetails", {

		onInit: function() {
			this.getRouter().getRoute("EquipmentDetails").attachPatternMatched(this._onRouteMatched, this);
			
		},

		_onRouteMatched: function() {
		},
		
		onPressNavBack:function(){
			this.getRouter().navTo("Home", {}, true);
		},
		
		onPressAddEquipment:function(oEvent){
			this.getRouter().navTo("EquipmentEntryCreate", {}, true);
			this.getModel("utilityModel").setProperty("/isEquipmentCreate",true);
		},
		
		onPressEquipmentEdit:function(oEvent){
			this.getRouter().navTo("EquipmentEntryCreate", {}, true);
			this.getModel("utilityModel").setProperty("/isEquipmentCreate",true);
		}
	});
});