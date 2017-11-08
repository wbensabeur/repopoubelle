sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	 "sap/ui/model/Filter",
	 	"sap/ui/model/FilterOperator"
], function(JSONModel, Device,Filter,FilterOperator) {
	"use strict";

	return {

		createDeviceModel: function() {                
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createSettingsModel: function(that) {
		/*	var oModel;
			var shoowAbsence=false;
			var showKm=false;
			var shoowEquipment=false;
			var duration=false;
				var arrParams = [];
					arrParams.push(new Filter("ApplicationName", FilterOperator.EQ, "EMPLOYEE"));
			var urlStr = "/PersonalizationSet";
		that.read(urlStr,
		{	filters: arrParams,
			success: function(data) {
		if(data !== null && data.length>0){
			for (var count=0; count<data.length; count++) {
				if(data[count].PersoId==='TE' && data[count].PersoValue==='DT'){
					duration=true;
				}
					if(data[count].PersoId==='ABSENCE' && data[count].PersoValue==='X'){
					shoowAbsence=true;
				}
					if(data[count].PersoId==='KM' && data[count].PersoValue==='X'){
					showKm=true;
				}
					if(data[count].PersoId==='EQUIPMENT' && data[count].PersoValue==='X'){
					shoowEquipment=true;
				}
			}
				 oModel = new JSONModel({
				"absState":shoowAbsence,
				"kmState":showKm,
				"equipState":shoowEquipment,
				"barState":true,
				"timeCountType":"kDuration",
				"timeCountDuration":duration,
				"timeCountDate":false
			});
			oModel.setDefaultBindingMode("OneWay");
			
		}
			},
			error: function(error) {
				// do nothing
			}
			});*/
			var oModel = new JSONModel({
				"absState":true,
				"kmState":true,
				"equipState":true,
				"barState":true,
				"timeCountType":"kDuration",
				"timeCountDuration":true,
				"timeCountDate":false
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},
		createUtilityModel: function() {
			var oModel = new JSONModel({
				isTimeCreate:false,
				isAllowanceCreate:false,
				isKilometerCreate:false,
				isAbsenceCreate:false,
				isEquipmentCreate:false,
				isMenuOn:false,
				favInitiateCtrName:""
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},
		
		createEmpDetailsModel: function() {
			var oModel = new JSONModel({
			});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
			createWorkDayModel: function() {
			var oModel = new JSONModel({
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},
		
			createWeekSummarySetModel: function() {
			var oModel = new JSONModel({
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},
			createUserPersolisationModel: function() {
			var startDate = new Date(); /// =datetime.getLastWeek(new Date()); in case of default 2 week display
			var defaultBU = null;
			var defaultPeriod = 1;
		
			var userPref = {
				defaultBU:defaultBU,
				defaultPeriod:defaultPeriod,
				employeeFilter:null,
				startDate:startDate,
				userID:null,
				successMaskEntry : false,
				defaultHours : false,
				defaultIPD : false,
				durationFlag : false,
				defaultKM : false,
				defaultAbsence : false,
				defaultEquipment : false,
				defaultOvernight : false,
				defaultBonus: false,
				defaultCraftCode: false
				
			};
			var oModel = new JSONModel(userPref);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}
	/*	createUserPersolisationModel: function(backendModel) {
			var startDate = new Date(); /// =datetime.getLastWeek(new Date()); in case of default 2 week display
			
			var userPref = {
				defaultBU:'BU1',
				defaultPeriod:1,
				employeeFilter:null,
				startDate:startDate
			};
			var oModel = new JSONModel(userPref);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}
*/
	};
});