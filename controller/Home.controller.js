sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController, Controller, JSONModel, Device) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.Home", {

		onInit: function() {
			com.vinci.empvinciemptimesheet.homePagePtr = this;
			this.getRouter().getRoute("Home").attachPatternMatched(this._onRouteMatched, this);
			
		},

		_onRouteMatched: function() {
			//this.serviceCallForEmployeeDetails();
		}
		// serviceCallForEmployeeDetails:function(){
		// 	var empJsonModel = this.getModel("EmpDetailsModel");
		// 	this.getModel().read("/EmployeeSet",{
		// 		success: function (data) {
		// 			empJsonModel.setData(data.results[0]);	
		// 			}, 
		// 			error: function (error) {
		// 			sap.m.MessageToast.show("Failed");	
		// 			}
		// 	});
		// }
	});
});