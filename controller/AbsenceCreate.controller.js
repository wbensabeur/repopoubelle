sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController, JSONModel, Device) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.AbsenceCreate", {

		onInit: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				firstDay:new Date(),
				lastDay:new Date(),
				categoryId:"categoryId1",
				bHours:false,
				bHalfDay:false,
				comments:""
			});
			this.setModel(oViewModel, "absCreateView");
			this.getRouter().getRoute("TimeCreate").attachPatternMatched(this._onRouteMatched, this);
			
		},

		_onRouteMatched: function() {
		},
		
		onPressNavBack:function(){
			var isAbsDetailOn = this.getModel("utilityModel").getProperty("/isAbsenceCreate");
			if(isAbsDetailOn){
				this.getRouter().navTo("DailyAllowanceDetails", {}, true);
			}else{
				this.getRouter().navTo("Home", {}, true);
			}
			
		},
		
		onPressCancel:function(oEvent){
			var isAbsDetailOn = this.getModel("utilityModel").getProperty("/isAbsenceCreate");
			if(isAbsDetailOn){
				this.getRouter().navTo("DailyAllowanceDetails", {}, true);
			}else{
				this.getRouter().navTo("Home", {}, true);
			}
		},
		
		onPressCategorySelect:function(oEvent){
			this.getModel("absCreateView").setProperty("/bHours",false);
			this.getModel("absCreateView").setProperty("/bHalfDay",false);
			var catType = this.getModel("absCreateView").getProperty("/categoryId");
			if(catType === "categoryId2"){
				this.getModel("absCreateView").setProperty("/bHalfDay",true);
			}
			if(catType === "categoryId3"){
			this.getModel("absCreateView").setProperty("/bHours",true);
			}
		}
	});
});