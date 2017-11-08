sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController, JSONModel, Device) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.EquipmentEntryCreate", {

		onInit: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				project:"",
				hours:"1",
				equipment:"",
				isFullListDisplay:true
			});
			this.setModel(oViewModel, "equipCreateView");
			this.getRouter().getRoute("EquipmentEntryCreate").attachPatternMatched(this._onRouteMatched, this);
			
		},

		_onRouteMatched: function() {
		},
		
		onPressNavBack:function(){
			var isEuipDetailOn = this.getModel("utilityModel").getProperty("/isEquipmentCreate");
			if(isEuipDetailOn){
				this.getRouter().navTo("EquipmentDetails", {}, true);
			}else{
				this.getRouter().navTo("Home", {}, true);
			}
			
		},
		
		onPressCancel:function(oEvent){
			var isEuipDetailOn = this.getModel("utilityModel").getProperty("/isEquipmentCreate");
			if(isEuipDetailOn){
				this.getRouter().navTo("EquipmentDetails", {}, true);
			}else{
				this.getRouter().navTo("Home", {}, true);
			}
		},
		
		onPressResizeList:function(){
			var bResize = this.getModel("equipCreateView").getProperty("/isFullListDisplay");
			if(bResize){
				this.getModel("equipCreateView").setProperty("/isFullListDisplay",false);
			}else{
				this.getModel("equipCreateView").setProperty("/isFullListDisplay",true);
			}
		},
		
		onPressFavorite:function(oEvent){
			this.getModel("utilityModel").setProperty("/favInitiateCtrName","EquipmentEntryCreate");
			this.getRouter().navTo("FavoriteProjectList",{},true);
		}
	});
});