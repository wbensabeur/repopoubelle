sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/vinci/timesheet/employee/model/models",
	"com/vinci/timesheet/employee/controller/ErrorHandler",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/vinci/timesheet/employee/utility/datetime"
], function(UIComponent, Device, models, ErrorHandler,Filter,FilterOperator,datetime) {
	"use strict";

	return UIComponent.extend("com.vinci.timesheet.employee.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// initialize the error handler with the component
				this._oErrorHandler = new ErrorHandler(this);
			// set the device model
			com.vinci.empvinciemptimesheet.homePagePtr = null;
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createSettingsModel(this.getModel()), "settings");
			this.setModel(models.createUtilityModel(),"utilityModel");
			this.setModel(models.createEmpDetailsModel(),"EmpDetailsModel");
			this.setModel(models.createWorkDayModel(),"WorkDayModel");
			this.setModel(models.createWeekSummarySetModel(),"WeekSummarySet");
			
				// set the userPref model
				this.setModel(models.createUserPersolisationModel(this.getModel()), "userPreference");
					var userPreferenceModel = this.getModel("userPreference");
			this._updateUserPreference(this.getModel(), userPreferenceModel);
				
			this.getRouter().initialize();
		},
		
		destroy : function () {
				this._oErrorHandler.destroy();
				// call the base component's destroy function
				UIComponent.prototype.destroy.apply(this, arguments);
			},
		/**
			 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
			 * design mode class should be set, which influences the size appearance of some controls.
			 * @public
			 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
			 */
			getContentDensityClass : function() {
				if (this._sContentDensityClass === undefined) {
					// check whether FLP has already set the content density class; do nothing in this case
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			},
				_updateUserPreference: function(odataModel, userPreferenceModel) {
			var that = this;
			odataModel.read('/PersonalizationSet', {
				async: false,
				filters: [new Filter("ApplicationName", FilterOperator.EQ, 'EMPLOYEE')],
				success: function(data) {
					var results = data.results;
					for (var k = 0; k < results.length; k++) {
						var key = data.results[k].PersoId;
						switch (key) {
							case 'BU':
								userPreferenceModel.setProperty('/defaultBU', data.results[k].PersoValue);
								break;
						case 'HOURS':
								if (data.results[k].PersoValue === 'X')
									userPreferenceModel.setProperty('/defaultHours', true);
								break;
							case 'IPD':
								if (data.results[k].PersoValue === 'X')
									userPreferenceModel.setProperty('/defaultIPD', true);
								break;
							case 'KM':
								if (data.results[k].PersoValue === 'X')
									userPreferenceModel.setProperty('/defaultKM', true);
								break;
							case 'ABSENCE':
								if (data.results[k].PersoValue === 'X')
									userPreferenceModel.setProperty('/defaultAbsence', true);
								break;
							case 'EQUIPMENT':
								if (data.results[k].PersoValue === 'X')
									userPreferenceModel.setProperty('/defaultEquipment', true);
								break;
							case 'OVERNIGHT':
								if (data.results[k].PersoValue === 'X')
									userPreferenceModel.setProperty('/defaultOvernight', true);
								break;
							case 'BONUS':
								if (data.results[k].PersoValue === 'X')
									userPreferenceModel.setProperty('/defaultBonus', true);
								break;
							case 'CRAFTCODE':
								if (data.results[k].PersoValue === 'X')
									userPreferenceModel.setProperty('/defaultCraftCode', true);
								break;
							case 'DT':
								if (data.results[k].PersoValue === 'TIME')
								userPreferenceModel.setProperty('/durationFlag', true);
								break;

						}
					}

				}
			});

		}
	});
});