sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"com/vinci/timesheet/employee/utility/datetime",
	"com/vinci/timesheet/employee/model/utility",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/vinci/timesheet/employee/utility/fragment"
], function(BaseController, JSONModel, Device, datetime, utility, Filter, FilterOperator, fragment) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.TimeCreate", {
		utility: utility,
		datetime: datetime,
		fragment: fragment,
		onInit: function() {
			var userData = this.getOwnerComponent().getModel("userPreference").getData();
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				projectId: "",
				hrValue: "1",
				comments: "",
				attendeesType: "1",
				zone: "z1",
				meal: "",
				travel: "",
				transport: "",
				duration: userData.durationFlag
			});
			this.setModel(oViewModel, "timeCreateView");
			this.getRouter().getRoute("TimeCreate").attachPatternMatched(this._onRouteMatched, this);
			//	this.getView().byId("createTime").getItems()[0].getItems()[0].getBindings().refresh(true);
			this.i18nModel = this.getResourceBundle();

		},

		_onRouteMatched: function() {

			this.byId("RB1").setSelected(true);
			this.byId("searchList1").setVisible(true);
			this.byId("searchList2").setVisible(true);
			this.byId("searchList3").setVisible(false);
			this.byId("toolbar").setVisible(false);
			this.clearFields(this);
			this.byId("createTime").getItems()[0].getItems()[0].setVisible(false);
			this.getView().byId("createTime").getItems()[0].getItems()[2].setVisible(false);
			this.byId("addTimeSelectButton").setEnabled(true);
			if (this.getOwnerComponent().editPath) {
				this.mode = "update";
				if (this.getView().byId("timeCreateScreen").getElementBinding()) {
					this.getView().byId("timeCreateScreen").unbindElement();
					this.getView().byId("createTime").getItems()[0].getItems()[2].unbindElement();
				}
				this.getView().byId("timeCreateScreen").bindElement(this.getOwnerComponent().editPath);
				this.setUpdateDetails();
				this.getOwnerComponent().editPath = undefined;
			} else {
				this.mode = "create";
				this.byId("hoursSelection").getButtons()[0].setSelected(true);
				this.byId("hoursSelection").getButtons()[1].setSelected(false);
				this.byId("addHours").setVisible(false);
				if (this.getModel("timeCreateView").oData.duration !== true) {
					this.getView().byId("addHours").getItems()[1].getItems()[0].setVisible(true);
					this.getView().byId("addHours").getItems()[1].getItems()[1].setVisible(true);
					this.getView().byId("addHours").getItems()[2].getItems()[1].setVisible(false);
					this.getView().byId("addHours").getItems()[2].getItems()[0].setVisible(false);
					this.getView().byId("addHours").getItems()[3].getItems()[1].setVisible(false);
					this.getView().byId("addHours").getItems()[3].getItems()[0].setVisible(false);
				} else {
					this.getView().byId("addHours").getItems()[2].getItems()[1].setVisible(true);
					this.getView().byId("addHours").getItems()[2].getItems()[0].setVisible(true);
					this.getView().byId("addHours").getItems()[3].getItems()[1].setVisible(true);
					this.getView().byId("addHours").getItems()[3].getItems()[0].setVisible(true);

					this.getView().byId("addHours").getItems()[1].getItems()[0].setVisible(false);
					this.getView().byId("addHours").getItems()[1].getItems()[1].setVisible(false);
				}

			}
		},
		setUpdateDetails: function() {
			this.mode = "update";
			this.getModel("utilityModel").setProperty("/isTimeCreate", "DailyView");
			var oTimeData = this.getView().getModel().getProperty(this.getOwnerComponent().editPath);
			if (oTimeData.StartTime === "00:00") {
				this.getView().byId("addHours").getItems()[1].getItems()[0].setVisible(true);
				this.getView().byId("addHours").getItems()[1].getItems()[1].setVisible(true);
				this.getView().byId("addHours").getItems()[2].getItems()[1].setVisible(false);
				this.getView().byId("addHours").getItems()[2].getItems()[0].setVisible(false);
				this.getView().byId("addHours").getItems()[3].getItems()[1].setVisible(false);
				this.getView().byId("addHours").getItems()[3].getItems()[0].setVisible(false);
				this.getView().byId("addHours").getItems()[1].getItems()[1].setValue(oTimeData.Hours);
			} else {
				this.getView().byId("addHours").getItems()[2].getItems()[1].setDateValue(new Date(datetime.timeToMilliSec(oTimeData.StartTime)));
				this.getView().byId("addHours").getItems()[3].getItems()[1].setDateValue(new Date(datetime.timeToMilliSec(oTimeData.EndTime)));
				this.getView().byId("addHours").getItems()[2].getItems()[1].setVisible(true);
				this.getView().byId("addHours").getItems()[2].getItems()[0].setVisible(true);
				this.getView().byId("addHours").getItems()[3].getItems()[1].setVisible(true);
				this.getView().byId("addHours").getItems()[3].getItems()[0].setVisible(true);

				this.getView().byId("addHours").getItems()[1].getItems()[0].setVisible(false);
				this.getView().byId("addHours").getItems()[1].getItems()[1].setVisible(false);
			}
			this.getView().byId("createTime").getItems()[0].getItems()[2].setVisible(true);
			this.getView().byId("selectFragmentPrj").getItems()[2].setVisible(true);
			this.getView().byId("selectFragmentPrj").getItems()[1].setVisible(false);

		},
		onBUFilterChange: function(oEvent) {
			var BUId = oEvent.getSource().getSelectedKey();
			this.BUfilter = new Filter("BusinessUnit", FilterOperator.EQ, BUId);
			this.SearchProject_applyFiler();

		},
		onPressNavBack: function() {
			fragment.refreshSearchField(this); 
			if (this.getView().byId("timeCreateScreen").getVisible()) {
				var isTmDetailOn = this.getModel("utilityModel").getProperty("/isTimeCreate");
				if (isTmDetailOn === true) {
					this.getRouter().navTo("TimeDetails", {}, true);
				} else if (isTmDetailOn === "DailyView") {
					this.getRouter().navTo("DailyViewDetails", {}, true);
				} else {
					this.getRouter().navTo("Home", {}, true);
				}
			} else {
				this.getView().byId("projectSearchFragment").setVisible(false);
				this.getView().byId("timeCreateScreen").setVisible(true);
				this.getView().byId("addTimeFooter").setVisible(true);
			}
		},

		onPressCancel: function(oEvent) {
			fragment.refreshSearchField(this); 
			var isTmDetailOn = this.getModel("utilityModel").getProperty("/isTimeCreate");
			if (isTmDetailOn === true) {
				this.getRouter().navTo("TimeDetails", {}, true);
			} else if (isTmDetailOn === "DailyView") {
				this.getRouter().navTo("DailyViewDetails", {}, true);
			} else {
				this.getRouter().navTo("Home", {}, true);
			}
		},
		openSearchCriteria: function(oEvent) {
			this.getView().byId("searchProjectCriteriaFragment").setVisible(true);
			this.getView().byId("searchPrjList").setVisible(false);
			this.getView().byId("searchPrjListFooter").setVisible(false);

		},
		onSearch: function(oEvt) {
			fragment.onSearchProject(oEvt, this);
			// add filter for search
			/*	var aFilters = [];
				var sQuery = oEvt.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("ProjectDescription", sap.ui.model.FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}

				// update list binding
				var list = this.getView().byId("serachPrjList");
				var binding = list.getBinding("items");
				binding.filter(aFilters, "Application");*/
		},
		onPressMeal: function(oEvent) {
			if (oEvent.getSource().hasStyleClass("btnSelection")) {
				oEvent.getSource().removeStyleClass("btnSelection");
				this.getModel("timeCreateView").setProperty("/meal", "");
			} else {
				oEvent.getSource().addStyleClass("btnSelection");
				this.getModel("timeCreateView").setProperty("/meal", "M");
			}

		},

		onPressTravel: function(oEvent) {
			if (oEvent.getSource().hasStyleClass("btnSelection")) {
				oEvent.getSource().removeStyleClass("btnSelection");
				this.getModel("timeCreateView").setProperty("/travel", "");
			} else {
				oEvent.getSource().addStyleClass("btnSelection");
				this.getModel("timeCreateView").setProperty("/travel", "C");
			}

		},

		onPressTransport: function(oEvent) {
			if (oEvent.getSource().hasStyleClass("btnSelection")) {
				oEvent.getSource().removeStyleClass("btnSelection");
				this.getModel("timeCreateView").setProperty("/transport", "");
			} else {
				oEvent.getSource().addStyleClass("btnSelection");
				this.getModel("timeCreateView").setProperty("/transport", "T");
			}

		},
		OnchangeTimeSelection: function(oEvent) {
			if (oEvent.getParameter("selectedIndex") === 1) {
				this.getView().byId("addHours").setVisible(true);
			} else {
				this.getView().byId("addHours").setVisible(false);
			}
		},
		OnProjectSearch: function(oEvent) {
			var employee = this.getOwnerComponent().oTimesheetControl.employeeId;
			var favFilters = [];
			var lastPrjFilters = [];
			var favFilter = new Filter("Favorite", sap.ui.model.FilterOperator.EQ, true);
			var lastPrjFilter = new Filter("LastUsedProject", sap.ui.model.FilterOperator.EQ, true);
			var lastPrjEmpFilter = new Filter("EmployeeId", sap.ui.model.FilterOperator.EQ, employee);
			favFilters.push(favFilter);
			lastPrjFilters.push(lastPrjFilter);
			lastPrjFilters.push(lastPrjEmpFilter);
			var listFav = this.getView().byId("favPrjList");
			var listLastPrj = this.getView().byId("serachPrjList");

			var favBinding = listFav.getBinding("items");
			favBinding.filter(favFilters, "Application");

			var lastPrjBinding = listLastPrj.getBinding("items");
			lastPrjBinding.filter(lastPrjFilters, "Application");

			this.getView().byId("timeCreateScreen").setVisible(false);
			//	this.getView().byId("addTimeFooter").setVisible(false);
			this.getView().byId("addTimeCancelButton").setVisible(false);
			this.getView().byId("addTimeSelectButton").setVisible(false);
			this.getView().byId("ProjectCancelButton").setVisible(true);
			this.getView().byId("ProjectSelectButton").setVisible(true);

			this.getView().byId("projectSearchFragment").setVisible(true);
			//	controler._setProjectSearchFragment(fragment.getId());
			/*	this.projectSearchFragment = fragment.getId();    
		container.addItem(this.projectSearchFragment);
		container.setVisible(true);
*/
		},
		OnProjectSelected: function(oEvent) {
			var selectButton = this.getView().byId('ProjectSelectButton');
			var contextPath = oEvent.getParameter('listItem').getBindingContext().getPath();
			oEvent.getSource().getCustomData()[0].setValue(contextPath);
			selectButton.getCustomData()[0].setValue(contextPath);
		},
		OnProjectSelectedFav: function(oEvent) {
			var selectButton = this.getView().byId('ProjectSelectButton');
			var contextPath = oEvent.getParameter('listItem').getBindingContext().getPath();
			oEvent.getSource().getCustomData()[0].setValue(contextPath);
			selectButton.getCustomData()[0].setValue(contextPath);
			var prjList = this.getView().byId("serachPrjList").getItems();
			for (var i = 0; i < prjList.length; i++) {
				prjList[i].setSelected(false);

			}
		},
		OnProjectSelectedLast: function(oEvent) {
			var selectButton = this.getView().byId('ProjectSelectButton');
			var contextPath = oEvent.getParameter('listItem').getBindingContext().getPath();
			oEvent.getSource().getCustomData()[0].setValue(contextPath);
			selectButton.getCustomData()[0].setValue(contextPath);
			var prjList = this.getView().byId("favPrjList").getItems();
			for (var i = 0; i < prjList.length; i++) {
				prjList[i].setSelected(false);

			}
		},
		onPressProjectSelect: function(oEvent) {
			
		if (fragment.checkAnyProjectSelected(this)) {
			var projectContext = oEvent.getSource().getCustomData()[0].getValue();
			var prjLabel = this.getView().byId("createTime").getItems()[0].getItems()[0];
			var prjLabelId = this.getView().byId("createTime").getItems()[0].getItems()[1];
			prjLabel.bindElement(projectContext); // Label 1 for description
			prjLabelId.bindElement(projectContext); //Label 2 for project id
			prjLabel.setVisible(true); // Label
			this.getView().byId("selectFragmentPrj").getItems()[2].setVisible(true);
			this.getView().byId("selectFragmentPrj").getItems()[1].setVisible(false);
			this.getView().byId("createTime").getItems()[0].getItems()[2].setVisible(false);
			this.getView().byId("timeCreateScreen").setVisible(true);
			this.getView().byId("projectSearchFragment").setVisible(false);
			this.getView().byId("addTimeFooter").setVisible(true);
			this.getView().byId("addTimeCancelButton").setVisible(true);
			this.getView().byId("addTimeSelectButton").setVisible(true);
			this.getView().byId("ProjectCancelButton").setVisible(false);
			this.getView().byId("ProjectSelectButton").setVisible(false);
			fragment.refreshSearchField(this); 
		}
		else{
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtleastOnePrj"), {
					duration: 5000
				});
				return;
		}
			//	this.selectProjectcontext[1].setVisible(false); // ownIntialButton
			//	this.selectProjectcontext[2].setVisible(true); // ownRefreshButton
		},
		onPressFavorite: function(oEvent) {

			this.getModel("utilityModel").setProperty("/favInitiateCtrName", "TimeCreate");
			this.getRouter().navTo("FavoriteProjectList", {}, true);
		},

		onPressRegisterHours: function() {

		},
		OnChangeStartTime: function(oEvent) {
			var source = oEvent.getSource();

			var endTimer = source.getParent().getParent().getItems()[3].getItems()[1];
			endTimer.setEnabled(true);
			var diffTime = 0;

			if (endTimer.getValue() !== null && endTimer.getValue().length > 0) {
				diffTime = datetime.timeToMilliSec(endTimer.getValue()) - datetime.timeToMilliSec(oEvent.getParameter("value"));
			}
			if (diffTime < 0) {
				source.setValueState("Error");
				this.Common_raiseinputError(source, this.i18nModel.getText("timeValidationErrorMsg"));
				return;
			}
			source.setValueState("None");
			endTimer.setValueState("None");
			var dDate = new Date(diffTime);
			var duration = dDate.getUTCHours() + ":" + dDate.getUTCMinutes();
			var newValue = datetime.timeToDecimal(duration);
			var sourcePanel = this.AddProjectTime__getOwnFrameObject(source);
			var currentValue = sourcePanel.getCustomData()[0].getValue();
			var deltahrs = newValue - currentValue;
			//		var currentTotalhrs = this.AddUpdatetimeModel.getProperty('/totalhrs');
			//	var newTotalhrs = currentTotalhrs + deltahrs;
			//		this.AddUpdatetimeModel.setProperty('/totalhrs', newTotalhrs);
			sourcePanel.getCustomData()[0].setValue(newValue);
			source.setDateValue(new Date(datetime.timeToMilliSec(oEvent.getParameter("value"))));
			//endTimer.setValue(source.getValue());

		},
		AddProjectTime__getOwnFrameObject: function(source) {
			var parent = source.getParent();

			while (parent.getCustomData().length === 0) {
				parent = parent.getParent();
			}
			return parent;
		},
		Common_raiseinputError: function(source, text) {
			source.setValueStateText(text);
			source.setShowValueStateMessage(true);
			source.openValueStateMessage();
			source.focus();
		},
		getOwnAllDayComboBox: function(radioGroup) {
			var parent = radioGroup.getParent();
			while (parent.getMetadata().getName() !== 'sap.m.HBox') {
				parent = parent.getParent();
			}
			var items = parent.getItems();
			var comboBox = null;
			for (var k = 0; k < items.length; k++) {
				if (items[k].getMetadata().getName() === 'sap.m.ComboBox') {
					comboBox = items[k];
					break;
				}
			}
			return comboBox;
		},
		OnChangeEndTime: function(oEvent) {
			var source = oEvent.getSource();
			var startTimer = source.getParent().getParent().getItems()[2].getItems()[1];

			//	var milliSecond = datetime.timeToMilliSec(oEvent.getParameter("value"));
			var diffTime = datetime.timeToMilliSec(oEvent.getParameter("value")) - datetime.timeToMilliSec(startTimer.getValue());
			if (diffTime < 0) {
				source.setValueState("Error");
				this.Common_raiseinputError(source, this.i18nModel.getText("timeValidationErrorMsg"));
				return;
			}
			source.setValueState("None");
			startTimer.setValueState("None");
			var dDate = new Date(diffTime);
			var duration = dDate.getUTCHours() + ":" + dDate.getUTCMinutes();
			var newValue = datetime.timeToDecimal(duration);
			var sourcePanel = this.AddProjectTime__getOwnFrameObject(source);
			//	var currentValue = sourcePanel.getCustomData()[0].getValue();
			//	var deltahrs = newValue - currentValue;
			//	var currentTotalhrs = this.AddUpdatetimeModel.getProperty('/totalhrs');
			//	var newTotalhrs = currentTotalhrs + deltahrs;
			//	this.AddUpdatetimeModel.setProperty('/totalhrs', newTotalhrs);
			sourcePanel.getCustomData()[0].setValue(newValue);
			source.setDateValue(new Date(datetime.timeToMilliSec(oEvent.getParameter("value"))));

		},

		saveEntries: function(oEvent) {
			var sourcePanel = this.AddProjectTime__getOwnFrameObject(oEvent.getSource());
			var thisEvent = oEvent;
			thisEvent.getSource().setEnabled(false);
			var that = this;
			var cmbHoursType = this.getView().byId("hoursType");
			var entryTypeId = cmbHoursType.getSelectedKey();
			var timesheetDetails = this.getOwnerComponent().oTimesheetControl;
			var hoursData = this.getView().byId("addHours").getItems();
			var hours;
			var startTime;
			var endTime;
			var fullDay = false;
			var Counter = "0";
			var updateUrl = "";
			var updateWorkDate="";
			if (this.mode === "update") {
				updateUrl = this.getView().byId("timeCreateScreen").getBindingContext().getPath();

				var oModelData = this.getView().getModel().getProperty(this.getView().byId("timeCreateScreen").getBindingContext().getPath());
			updateWorkDate=oModelData.WorkDate;
				Counter = oModelData.Counter;
			}
			var timesheetData = timesheetDetails.getView().byId("columnList").getCells();
			var projectId = this.getView().byId("createTime").getItems()[0].getItems()[1].getText();
			var projectName ="";// this.getView().byId("createTime").getItems()[0].getItems()[0].getText();
			if (this.mode === "update") {
				if (projectId === "" || projectId === null || projectId === undefined) {
					//projectId = this.getView().byId("createTime").getItems()[0].getItems()[2].getText();
					projectName = this.getView().byId("createTime").getItems()[0].getItems()[2].getText();
				projectId = this.getView().getModel().getProperty(updateUrl).ProjectID;
				}
				if (projectId === "" || projectId === null || projectId === undefined) {
					thisEvent.getSource().setEnabled(true);
					sap.m.MessageToast.show(that.getResourceBundle().getText("selectAtleastOnePrj"), {
						duration: 5000
					});
					return;
				}
			} else {
				projectName = this.getView().byId("createTime").getItems()[0].getItems()[0].getText();
				if (projectId === "" || projectId === null) {
					thisEvent.getSource().setEnabled(true);
					sap.m.MessageToast.show(that.getResourceBundle().getText("selectAtleastOnePrj"), {
						duration: 5000
					});
					return;
				}
			}
			

			if (this.getView().byId("hoursSelection").getButtons()[0].getSelected()) {
				hours = "";
				fullDay = true;
			} else {
				if (this.getModel("timeCreateView").oData.duration !== true) {
					hours = hoursData[1].getItems()[1].getValue();
					startTime = "";
					endTime = "";
				} else {
					hours = ""; //this.getView().byId("createTime").getItems()[1].getItems()[0].getCustomData()[0].getValue();
					startTime = hoursData[2].getItems()[1].getValue();
					endTime = hoursData[3].getItems()[1].getValue();
					if (startTime === "" || startTime === null) {
						thisEvent.getSource().setEnabled(true);
						sap.m.MessageToast.show(that.getResourceBundle().getText("selectStartTime"), {
							duration: 5000
						});
						return;
					}
					if (endTime === "" || endTime === null) {
						thisEvent.getSource().setEnabled(true);
						sap.m.MessageToast.show(that.getResourceBundle().getText("selectEndTime"), {
							duration: 5000
						});
						return;
					}

				}

			}
			//	var count=0;
			var data = {
				"EmployeeId": "",
				"WorkDate": "",
				"NavWorkDayTimeItems": []
			};
			
			if(this.mode==="update"){
			for (var i = 0; i < timesheetData.length; i++) {
				
				if (timesheetData[i].getPressed() &&  timesheetData[i].getCustomData()[3].getValue().getTime()===updateWorkDate.getTime()) {
					data.EmployeeId = timesheetData[i].getCustomData()[2].getValue();
					data.WorkDate = timesheetData[i].getCustomData()[3].getValue();
					//	tempArray[count]={id : timesheetData[i].getCustomData()[2].getValue() , value :tableCells[i].getCustomData()[3].getValue()};
					var record = {
						"EmployeeId": timesheetData[i].getCustomData()[2].getValue(),
						"WorkDate": timesheetData[i].getCustomData()[3].getValue(),
						"Counter": Counter,
						"ProjectID": projectId,
						"ProjectName": projectName,
						"EntryType": "HOURS",
						"Hours": hours.toString(),
						"StartTime": startTime,
						"EndTime": endTime,
						"Status": "D",
						"EntryTypeCatId": entryTypeId,
						"Comment": this.getModel("timeCreateView").oData.comments,
						"CreatedBy": "",
						"CreatedOn": new Date(),
						"ReleaseOn": null,
						"ApprovedOn": null,
						"Reason": "",
						"AllowancesType": "",
						"AllowancesName": "",
						"ZoneType": "",
						"ZoneName": "",
						"FullDay": fullDay,
						"MealIndicator": false,
						"JourneyIndicator": false,
						"TransportIndicator": false,
						"ApplicationName": "EMPLOYEE"

					};
					data.NavWorkDayTimeItems.push(record);

					//	this.getModel().create("/WorkDayItemSet", item);

				}
			}
}
else{
		for ( i = 0; i < timesheetData.length; i++) {
				
				if (timesheetData[i].getPressed()) {
					data.EmployeeId = timesheetData[i].getCustomData()[2].getValue();
					data.WorkDate = timesheetData[i].getCustomData()[3].getValue();
					//	tempArray[count]={id : timesheetData[i].getCustomData()[2].getValue() , value :tableCells[i].getCustomData()[3].getValue()};
					 record = {
						"EmployeeId": timesheetData[i].getCustomData()[2].getValue(),
						"WorkDate": timesheetData[i].getCustomData()[3].getValue(),
						"Counter": Counter,
						"ProjectID": projectId,
						"ProjectName": projectName,
						"EntryType": "HOURS",
						"Hours": hours.toString(),
						"StartTime": startTime,
						"EndTime": endTime,
						"Status": "D",
						"EntryTypeCatId": entryTypeId,
						"Comment": this.getModel("timeCreateView").oData.comments,
						"CreatedBy": "",
						"CreatedOn": new Date(),
						"ReleaseOn": null,
						"ApprovedOn": null,
						"Reason": "",
						"AllowancesType": "",
						"AllowancesName": "",
						"ZoneType": "",
						"ZoneName": "",
						"FullDay": fullDay,
						"MealIndicator": false,
						"JourneyIndicator": false,
						"TransportIndicator": false,
						"ApplicationName": "EMPLOYEE"

					};
					data.NavWorkDayTimeItems.push(record);

					//	this.getModel().create("/WorkDayItemSet", item);

				}
			}
}
			if (this.mode === "update") {
				this.getView().getModel().update(updateUrl, data.NavWorkDayTimeItems[0], {
					success: function(oData, oResponse) {
						// Success
						that.getOwnerComponent().oTimesheetControl.getView().byId("table").getModel().refresh(true);
						var tempArray = timesheetDetails.getPressedWeekDayData();
						timesheetDetails.serviceCallForWorkDaySet(data.EmployeeId, data.WorkDate, tempArray);
						that.byId("addTimeSelectButton").setEnabled(true);
						that.getRouter().navTo("Home", {}, true);
						sap.m.MessageToast.show(that.getResourceBundle().getText("successMsgTimeCreate"), {
							duration: 5000
						});
					},
					error: function(oError) {
						// Error
						that.mode = "update";
						that.byId("addTimeSelectButton").setEnabled(true);
					}
				});

			} else {
				this.getView().getModel().create("/WorkDaySet", data, {
					success: function(oData, oResponse) {
						// Success
						that.getOwnerComponent().oTimesheetControl.getView().byId("table").getModel().refresh(true);
						var tempArray = timesheetDetails.getPressedWeekDayData();
						timesheetDetails.serviceCallForWorkDaySet(data.EmployeeId, data.WorkDate, tempArray);
						that.byId("addTimeSelectButton").setEnabled(true);
						that.getRouter().navTo("Home", {}, true);
						sap.m.MessageToast.show(that.getResourceBundle().getText("successMsgTimeCreate"), {
							duration: 5000
						});
					},
					error: function(oError) {
						// Error
						that.mode = "create";
						that.byId("addTimeSelectButton").setEnabled(true);
					}
				});
			}
		},
		clearFields: function(thatPtr) {
			thatPtr.getView().byId("createTime").getItems()[0].getItems()[0].bindElement("");
			thatPtr.getView().byId("createTime").getItems()[0].getItems()[1].bindElement("");
			thatPtr.getView().byId("createTime").getItems()[0].getItems()[2].bindElement("");
			thatPtr.getView().byId("addHours").getItems()[1].getItems()[1].setValue(0.00);
			thatPtr.getView().byId("addHours").getItems()[2].getItems()[1].setValue("");
			thatPtr.getView().byId("addHours").getItems()[3].getItems()[1].setValue("");
			thatPtr.getView().byId("commentsArea").setValue("");
			thatPtr.getView().byId("addHours").setVisible(false);
			thatPtr.getView().byId("hoursSelection").getButtons()[0].setSelected(true);
			thatPtr.getView().byId("hoursType").setSelectedKey(null);
			this.getView().byId("selectFragmentPrj").getItems()[2].setVisible(false);
			this.getView().byId("selectFragmentPrj").getItems()[1].setVisible(true);
				thatPtr.byId("addTimeSelectButton").setEnabled(true);
		},
		onSelectFilter: function(oEvent) {
			this.fragment.onSelectFilter(oEvent, this);
		},
		onPressProjectCancel: function() {
			this.getView().byId("createTime").getItems()[0].getItems()[0].setText("");
			this.getView().byId("createTime").getItems()[0].getItems()[1].setText("");
			this.getView().byId("createTime").getItems()[0].getItems()[2].setText("");
			this.getView().byId("timeCreateScreen").setVisible(true);
			this.getView().byId("projectSearchFragment").setVisible(false);
			this.getView().byId("addTimeFooter").setVisible(true);
			this.getView().byId("addTimeCancelButton").setVisible(true);
			this.getView().byId("addTimeSelectButton").setVisible(true);
			this.getView().byId("ProjectCancelButton").setVisible(false);
			this.getView().byId("ProjectSelectButton").setVisible(false);
			fragment.refreshSearchField(this); 
		},
		OnFavoriteChange: function(oEvent) {
			var model = this.getView().getModel();
			var icon = oEvent.getSource();
			var currentState = model.getProperty(icon.getBindingContext().getPath() + '/Favorite');
			if (currentState) // to become unfav
			{
				model.setProperty(icon.getBindingContext().getPath() + '/Favorite', false);
				model.update(icon.getBindingContext().getPath(), {
					Favorite: false
				});

			} else // to become Fav
			{
				model.setProperty(icon.getBindingContext().getPath() + '/Favorite', true);
				model.update(icon.getBindingContext().getPath(), {
					Favorite: true
				});
			}
		}
	});
});