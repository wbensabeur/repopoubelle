sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"com/vinci/timesheet/employee/utility/datetime",
	"com/vinci/timesheet/employee/model/utility", "sap/ui/model/Filter",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, Device, datetime, Utility, Filter, NumberFormat, FilterOperator) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.Timesheet", {
		utility: Utility,
		onInit: function() {
			this.init = 'X';
			this.getOwnerComponent().oTimesheetControl = this;
			this.serviceCallForEmployeeDetails();
			this.getRouter().getRoute("Home").attachPatternMatched(this._onObjectMatched, this);

			//	var empId = this.getModel("EmpDetailsModel").getProperty("/EmployeeId");
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});
			this.setModel(oViewModel, "timesheetview");
			var oModel, iOriginalBusyDelay, oTable = this.byId("table");
			/*	var startDate = new Date();
				var monday = datetime.getMonday(startDate);
				this.currentWeekNumber = datetime.getWeek(monday);
				this.currentYear = new Date(monday.getTime()).getFullYear();
				var urlString="/WeekSummarySet(WeekNumber='"+this.currentWeekNumber+"',WeekYear='"+this.currentYear+"',isByWeekly=false,EmployeeId='50009223')"; 
				this.getView().byId('columnList').bindElement(urlString);*/

			/*var tableJSONModel = new JSONModel();
			var tableData=[];
			this.getOwnerComponent().getModel().read(urlString,{
			success: function(data) {
			tableData[0]=data;
				tableJSONModel.setProperty('/tableData',tableData);
				oTable.setModel(tableJSONModel);
				oTable.bindItems('/tableData',oTemplate);
			},
			error: function(error) {
				// do nothing
			}
			});*/
			// oTable.setModel(tableJSONModel);
			// oTable.bindItems(urlString, oTemplate);
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._oTableSearchState = [];
			// Model used to manipulate control states
			/* oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});*/
			//	this.setModel(oModel, "worklistView");
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				//	oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},

		onAfterRendering: function() {
			/*	var oCal = this.getView().byId("calendar");
				var monDay = Utility.getMonday(oCal.getStartDate());
				oCal.setStartDate(monDay);*/
			//	this.serviceCallForEmployeeDetails();
			if (sap.ui.Device.browser.msie) {
				this.getView().byId("table").setWidth("109%");
			} else {
				this.getView().byId("table").setWidth("100%");

			}

			//width="{path:'device>/system' , formatter:'.utility.tableWidth'}" 
		},
		onBeforeRendering: function() {
			var tableCells = this.getView().byId("table").getItems()[0].getCells();
			for (var i = 0; i < tableCells.length; i++) {
				tableCells[i].getCustomData()[0].setValue("");
				tableCells[i].getCustomData()[1].setValue("");
			}
		},

		onPressCheckVersion: function() {
			sap.m.MessageToast.show("Timesheet Employee Version is R1.0.8", {
				duration: 4000
			});
		},
		_onObjectMatched: function(oEvent) {
			this.userPref = this.getView().getModel("userPreference").getData();
			this.twoWeek = false;
			this._calendarBinding(this.userPref.startDate, this.userPref.defaultPeriod);
			var tableCells = this.getView().byId("table").getItems()[0].getCells();

			for (var i = 0; i < tableCells.length; i++) {
				if (tableCells[i].getPressed()) {
					tableCells[i].removeStyleClass("hourSize");
					tableCells[i].addStyleClass("pressedSize");
				} else {
					tableCells[i].removeStyleClass("pressedSize");
					tableCells[i].addStyleClass("hourSize");
				}
			}

			var tempArray = this.getPressedWeekDayData();
			if (this.init !== 'X') {
				if (tempArray.length > 0) {
					this.serviceCallForWorkDaySet("", "", tempArray);
				}
			} else {
				this.init = undefined;
			}
			/*	jQuery.sap.delayedCall(1000, this, function() {
					this.adjustWeekSummaryTextFont();
				});*/
		},
		validateWorkDaySelected: function() {
			var anyDaySelected = false;
			var tableCells = this.getView().byId("table").getItems()[0].getCells();

			for (var i = 0; i < tableCells.length; i++) {
				if (tableCells[i].getPressed()) {
					anyDaySelected = true;
				}
			}
			return anyDaySelected;
		},
		_calendarBinding: function(startDate, noOfWeek) {
			var caldenderdata = datetime.getCalenderData(startDate, noOfWeek, this.getResourceBundle());
			var oCalendarModel = new JSONModel(caldenderdata);
			this.setModel(oCalendarModel, "calendar");
			// Change Table OData Binding
			var monday = datetime.getMonday(startDate);
			this.currentWeekNumber = datetime.getWeek(monday);
			this.currentYear = new Date(monday.getTime()).getFullYear();
			//	this._applyFilters();

		},

		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			/*
				var sTitle, oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				// only update the counter if the length is final and
				// the table is not empty
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}*/
			//this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			/*	this.getModel("calendar").setProperty("/data/0/ColumnTxt1", sTitle);
				this.getModel("calendar").setProperty("/data/0/ColumnTxt2", this.getModel("userPreference").getProperty("/defaultBU"));*/
		},
		onPressSettings: function(oEvent) {
			this.getRouter().navTo("Settings", {}, true);
		},
		_applyFilters: function() {
			var oTable = this.byId("table");
			var Filters = [
				new Filter("WeekNumber", FilterOperator.EQ, this.currentWeekNumber),
				new Filter("WeekYear", FilterOperator.EQ, this.currentYear),
				new Filter("isByWeekly", FilterOperator.EQ, this.twoWeek)
				//	new Filter("EmployeeId",FilterOperator.EQ,"EmployeeId 1")
			];
			/*	if (this.userPref.employeeFilter != null && this.userPref.employeeFilter.length > 0) {
						Filters.push(new Filter("EmployeeName", FilterOperator.Contains, this.userPref.employeeFilter));
					}*/
			//oTable.getBinding("items").filter(Filters, "Application");
		},
		onPressNavigationMenu: function() {
			this.getModel("utilityModel").setProperty("/isMenuOn", false);
			var menuView = com.vinci.empvinciemptimesheet.homePagePtr.byId("vinMenuId");
			if (menuView.getSize() === "0%") {
				this.getModel("utilityModel").setProperty("/isMenuOn", true);
				this.getView().addStyleClass("homePageBackground");
				menuView.setSize("70%");
			} else {
				menuView.setSize("0%");
				this.getView().removeStyleClass("homePageBackground");
			}
		},

		isMenuClose: function() {
			var menuStatus = this.getModel("utilityModel").getProperty("/isMenuOn");
			if (menuStatus) {
				var menuView = com.vinci.empvinciemptimesheet.homePagePtr.byId("vinMenuId");
				this.getModel("utilityModel").setProperty("/isMenuOn", false);
				menuView.setSize("0%");
				if (this.getView().hasStyleClass("homePageBackground")) {
					this.getView().removeStyleClass("homePageBackground");
				}
				return true;
			}
			return false;
		},

		handleCalendarSelect: function(oEvent) {
			var selectedDate = oEvent.getSource().getSelectedDates()[0].getProperty("startDate");
			this.showWorkDayDetails(selectedDate);
		},

		showWorkDayDetails: function(empId, workDate) {
			if (!this.isMenuClose()) {
				//	var sWorkDate = Utility.convertDateToEdmDateTime(workDate);
				var tempArray = [];
				tempArray[0] = {
					id: empId,
					value: workDate
				};
				this.serviceCallForWorkDaySet(empId, workDate, tempArray);
			}
		},

		onPressTimeCreate: function(oEvent) {

			if (this.validateWorkDaySelected()) {
				var tableData = this.getView().byId("columnList").getCells();
				if (!this.isMenuClose()) {
					this.getRouter().navTo("TimeCreate", {}, true);
					this.getModel("utilityModel").setProperty("/isTimeCreate", false);
				}
			} else {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtleastOneDay"), {
					duration: 4000
				});
			}
		},

		onPressAllowanceCreate: function(oEvent) {
			if (this.validateWorkDaySelected()) {
				if (!this.isMenuClose()) {
					this.getModel("utilityModel").setProperty("/isAllowanceCreate", false);
					this.getRouter().navTo("DailyAllowanceCreate", {}, true);
				}
			} else {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtleastOneDay"), {
					duration: 4000
				});
			}
		},

		onPressAllowanceDetails: function(oEvent) {
			if (this.validateWorkDaySelected()) {
				if (!this.isMenuClose()) {
					this.getRouter().navTo("DailyAllowanceDetails", {}, true);
				}
			} else {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtleastOneDay"), {
					duration: 4000
				});
			}
		},

		onPressTimeDetails: function(oEvent) {
			if (this.validateWorkDaySelected()) {
				if (!this.isMenuClose()) {
					this.getRouter().navTo("TimeDetails", {}, true);
				}
			} else {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtleastOneDay"), {
					duration: 4000
				});
			}
		},

		onPressKilometerCreate: function(oEvent) {
			if (this.validateWorkDaySelected()) {
				if (!this.isMenuClose()) {
					this.getModel("utilityModel").setProperty("/isKilometerCreate", false);
					this.getRouter().navTo("KilometerCreate", {}, true);
				}
			} else {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtleastOneDay"), {
					duration: 4000
				});
			}
		},

		onPressKilometerDetails: function(oEvent) {
			if (this.validateWorkDaySelected()) {
				if (!this.isMenuClose()) {
					this.getRouter().navTo("KilometerDetails", {}, true);
				}
			} else {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtleastOneDay"), {
					duration: 4000
				});
			}
		},

		onPressAbsenceCreate: function(oEvent) {
			if (!this.isMenuClose()) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
				var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
					target: {
						semanticObject: "LeaveRequest",
						action: "displayLeaveRequestExtension"
					},
					params: {

					}
				})) || ""; // generate the Hash 
				oCrossAppNavigator.toExternal({
					// target: {
					//             shellHash: hash
					// }
					target: {
						semanticObject: "LeaveRequest",
						action: "displayLeaveRequestExtension"
					},
					params: {

					}
				});

			}
		},
		getPressedWeekDayData: function() {
			var tempArray = [];
			var tableCells = this.getView().byId("columnList").getCells();
			var count = 0;
			for (var i = 0; i < tableCells.length; i++) {
				if (tableCells[i].getPressed()) {
					tempArray[count] = {
						id: tableCells[i].getCustomData()[2].getValue(),
						value: tableCells[i].getCustomData()[3].getValue()
					};
					count = count + 1;
				}
			}
			return tempArray;
		},

		OnHourPress: function(oEvent) {
			var ocData = [];
			var tempArray = [];
			//	this.getView().getModel("WorkDayModel").setData(ocData);

			if (oEvent.getSource().getPressed()) {
				oEvent.getSource().removeStyleClass("hourSize");
				oEvent.getSource().addStyleClass("pressedSize");
			} else {
				oEvent.getSource().removeStyleClass("pressedSize");
				oEvent.getSource().addStyleClass("hourSize");
			}

			var tableCells = oEvent.getSource().getParent().getCells();
			var count = 0;
			for (var i = 0; i < tableCells.length; i++) {
				if (tableCells[i].getPressed()) {
					tempArray[count] = {
						id: tableCells[i].getCustomData()[2].getValue(),
						value: tableCells[i].getCustomData()[3].getValue()
					};
					count = count + 1;
				}
			}
			if (tempArray.length > 0) {
				this.serviceCallForWorkDaySet("", "", tempArray);
			} else {
				this.getView().getModel("WorkDayModel").setData(ocData);
			}
		},
		onPressAbsenceDetails: function(oEvent) {
			/*if (!this.isMenuClose()) {
				this.getRouter().navTo("AbsenceDetails", {}, true);
			}*/
			//This code was generated by the layout editor.
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			// get a handle on the global XAppNav service
			var hash = oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					shellHash: "LeaveRequest-displayLeaveRequestExtension&/history"
				}
			}) || "";
			// generate the Hash 
			oCrossAppNavigator.toExternal({
				// target: {
				//             shellHash: hash
				// }
				target: {
					shellHash: "LeaveRequest-displayLeaveRequestExtension&/history"
				}
			});
		},

		onPressEquipEntryCreate: function(oEvent) {
			if (!this.isMenuClose()) {
				this.getModel("utilityModel").setProperty("/isEquipmentCreate", false);
				this.getRouter().navTo("EquipmentEntryCreate", {}, true);
			}
		},

		onPressEquipmentDetails: function(oEvent) {
			if (!this.isMenuClose()) {
				this.getRouter().navTo("EquipmentDetails", {}, true);
			}
		},

		onPressWeeklyReport: function(oEvent) {
			this.getRouter().navTo("WeeklyReport", {}, true);
		},

		onPressViewDetailslPress: function(oEvent) {
			this.getRouter().navTo("DailyViewDetails", {}, true);
		},

		serviceCallForWorkDaySet: function(empId, startDate, dataArray) {
			var numFormat = NumberFormat.getInstance({
				maxFractionDigits: 2
			});
			var arrParams = [];
			var thatController = this;
			var employee = "";
			var totalTargetHours = 0;
			var dailyAllowance = 0;
			var dayKms = 0;
			var absenceHours = 0;
			this.getView().getModel("timesheetview").setProperty("/busy", true);
			var urlStr = "/WorkDaySet";
			if (dataArray.length > 0) {
				employee = dataArray[0].id;
				arrParams.push(new Filter("EmployeeId", FilterOperator.EQ, employee));
			}
			for (var i = 0; i < dataArray.length; i++) {
				arrParams.push(new Filter("WorkDate", FilterOperator.EQ, dataArray[i].value));
			}
			var that = this;
			this.getView().getModel().read(urlStr, {
				filters: arrParams,
				success: function(data) {

					for (var count = 0; count < data.results.length; count++) {
						totalTargetHours = parseFloat(totalTargetHours) + parseFloat(data.results[count].FilledHours);
						dailyAllowance = parseFloat(dailyAllowance) + parseFloat(data.results[count].DayAllowanceQty);
						dayKms = parseFloat(dayKms) + parseFloat(data.results[count].DayKms);
						absenceHours = parseFloat(absenceHours) + parseFloat(data.results[count].AbsenceHours);
					}
					that.getView().getModel("timesheetview").setProperty("/busy", false);
					thatController.getModel("WorkDayModel").setProperty("/TargetHours", numFormat.format(totalTargetHours));
					thatController.getModel("WorkDayModel").setProperty("/DayAllowanceQuantity", numFormat.format(dailyAllowance));
					thatController.getModel("WorkDayModel").setProperty("/DayKms", numFormat.format(dayKms));
					thatController.getModel("WorkDayModel").setProperty("/AbsenceHours", numFormat.format(absenceHours));
				},
				error: function(error) {
					that.getView().getModel("timesheetview").setProperty("/busy", false);
					//sap.m.MessageToast.show("Failed");
				}
			});
		},
		onPastPeriodNavPress: function(oEvent) {
			var ocData = [];
			this.deselectWeekSummary();
			this.userPref.startDate.setDate(this.userPref.startDate.getDate() - 7);
			this._calendarBinding(this.userPref.startDate, 1);
			this.getView().getModel("userPreference").setProperty('/startDate', this.userPref.startDate);
			this.getView().getModel("WorkDayModel").setData(ocData);
			this.loadWeekSummaryDetails(this.employeeId);
		},
		onFuturePeriodNavPress: function(oEvent) {
			var ocData = [];
			this.deselectWeekSummary();
			this.getView().getModel("WorkDayModel").setData(ocData);
			this.userPref.startDate.setDate(this.userPref.startDate.getDate() + 7);
			this._calendarBinding(this.userPref.startDate, 1);
			this.getView().getModel("userPreference").setProperty('/startDate', this.userPref.startDate);
			this.loadWeekSummaryDetails(this.employeeId);

		},
		loadWeekSummaryDetails: function(employeeId) {

			var urlString = "/WeekSummarySet(WeekNumber='" + this.currentWeekNumber + "',WeekYear='" + this.currentYear +
				"',isByWeekly=false,EmployeeId='" + employeeId + "')";
			this.getView().byId("columnList").bindElement(urlString);
			/*jQuery.sap.delayedCall(1000, this, function() {
				this.adjustWeekSummaryTextFont();
			});*/
		},
		deselectWeekSummary: function() {

			var tableCells = this.getView().byId("table").getItems()[0].getCells();

			for (var i = 0; i < tableCells.length; i++) {
				tableCells[i].setPressed(false);
				tableCells[i].removeStyleClass("pressedSize");
				tableCells[i].addStyleClass("hourSize");
			}
		},
		adjustWeekSummaryTextFont: function() {
			if (sap.ui.Device.system.phone === false) {
				return;
			}
			var tableCells = this.getView().byId("table").getItems()[0].getCells();
			for (var i = 0; i < tableCells.length; i++) {
				var buttonText = tableCells[i].getText();
				var buttonId = tableCells[i].getId();
				if (buttonText.length > 3) {
					sap.ui.getCore().byId(buttonId).addStyleClass("pressedReducedSize");
				} else {
					sap.ui.getCore().byId(buttonId).removeStyleClass("pressedReducedSize");
				}
			}
		},
		setCurrentDaysAsSelected: function(todayDate) {
			var dayNumber = todayDate.getDay();
			var tableCells = this.getView().byId("table").getItems()[0].getCells();
			//		for (var i = 0; i < tableCells.length; i++) {
			//		if (tableCells[i].data('selectedDate') === todayDate) {
			tableCells[dayNumber - 1].setPressed(true);
			tableCells[dayNumber - 1].removeStyleClass("hourSize");
			tableCells[dayNumber - 1].addStyleClass("pressedSize");
			//		}
			//		break;
			//	}
		},
		serviceCallForEmployeeDetails: function() {
			//	this.getView().getModel("timesheetview").setProperty("/busy",true);
			var that = this;
			//var empJsonModel = this.getView().getModel("EmpDetailsModel");
			this.getOwnerComponent().getModel().read("/EmployeeSet('')", {
				success: function(data) {
					//		empJsonModel.setData(data.results[0]);
					var startDate = datetime.getTodayDateGMT(new Date());
					//	var startDate=datetime.getTodayDate(new Date());
					//Utility.conertDateToISTTimeZone(new Date());
					//startDate=datetime.getMonday(startDate);
					var monday = Utility.getMonday(startDate);
					monday = Utility.conertDateToISTTimeZone(monday);
					that.currentWeekNumber = datetime.getWeek(monday);
					that.currentYear = new Date(monday.getTime()).getFullYear();
					var urlString = "/WeekSummarySet(WeekNumber='" + that.currentWeekNumber + "',WeekYear='" + that.currentYear +
						"',isByWeekly=false,EmployeeId='" + data.EmployeeId + "')";
					that.getView().byId('columnList').bindElement(urlString);
					that.employeeId = data.EmployeeId;
					//var oItems=that.getView().byId('columnList');
					that.showWorkDayDetails(data.EmployeeId, startDate);
					that.setCurrentDaysAsSelected(startDate);

					that.getView().getModel("timesheetview").setProperty("/busy", false);
					/*jQuery.sap.delayedCall(1000, this, function() {
						that.adjustWeekSummaryTextFont();
					});*/
				},
				error: function(error) {
					that.getView().getModel("timesheetview").setProperty("/busy", false);
					//sap.m.MessageToast.show("Failed");	
				}
			});
		}
	});
});