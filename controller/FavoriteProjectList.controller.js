sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController, JSONModel, Device) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.FavoriteProjectList", {

		onInit: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				projectId:"",
				numOfKm:"",
				vehicle:"kCar"
			});
			this.setModel(oViewModel, "favProjectView");
			this.getRouter().getRoute("FavoriteProjectList").attachPatternMatched(this._onRouteMatched, this);
			
		},

		_onRouteMatched: function() {
		},
		
		onPressNavBack:function(){
			var viewName = this.getModel("utilityModel").getProperty("/favInitiateCtrName");
			this.getRouter().navTo(viewName,{},true);
		},
		
		onPressCancel:function(oEvent){
			// var isAllowDetailOn = this.getModel("utilityModel").getProperty("/isKilometerCreate");
			// if(isAllowDetailOn){
			// 	this.getRouter().navTo("DailyAllowanceDetails", {}, true);
			// }else{
			// 	this.getRouter().navTo("Home", {}, true);
			// }
		}
		

	});
});