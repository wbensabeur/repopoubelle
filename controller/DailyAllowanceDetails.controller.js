sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"com/vinci/timesheet/employee/utility/datetime",
	"com/vinci/timesheet/employee/model/utility",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, Device, datetime, Utility, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.DailyAllowanceDetails", {
		utility: Utility,
		onInit: function() {
			this.getOwnerComponent().oAllowanceDetailsControl = this;
			this.getOwnerComponent().WKDItemIDate = [];
			this.getOwnerComponent().TemplateWKDItemDailyAllowanceDetails = this.getView().byId('listWKD1').getItems()[0].clone();
			var that = this;
			this.init = 'X';
			this.initSrvEmployeeDetails();
			this.getRouter().getRoute("DailyAllowanceDetails").attachPatternMatched(this._onObjectMatched, this);
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});
			this.setModel(oViewModel, "timesheetview");
			var oModel, iOriginalBusyDelay, oTable = this.byId("table");
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			this._oTableSearchState = [];
			oTable.attachEventOnce("updateFinished", function() {
				that.setEmployeeSelected();
				this.showWorkDayItemList();
			});
			jQuery.sap.delayedCall(1000, this, function() {
				this.adjustWeekSummaryTextFont();
			});
		},

		onAfterRendering: function() {
	if (sap.ui.Device.browser.msie) {
				this.getView().byId("table").setWidth("109%");
			} else {
				this.getView().byId("table").setWidth("100%");

			}

		},
onBeforeRendering :function(){
		var tableCells = this.getView().byId("table").getItems()[0].getCells();
		for (var i = 0; i < tableCells.length; i++){
				tableCells[i].getCustomData()[0].setValue("");
				tableCells[i].getCustomData()[1].setValue("");
				}
},
		onUpdateFinished: function(oEvent) {
			var oItems = this.getView().byId('columnList');
		},

		_onObjectMatched: function() {
			this.userPref = this.getView().getModel("userPreference").getData();
			this.twoWeek = false;
			this._calendarBinding(this.userPref.startDate, this.userPref.defaultPeriod);
			this._fragListWidth();
			this.initSrvEmployeeDetails();
			if (this.init !== 'X') {
				this.setEmployeeSelected();
				this.showWorkDayItemList();
			}
			jQuery.sap.delayedCall(1000, this, function() {
				this.adjustWeekSummaryTextFont();
			});
		},

		_calendarBinding: function(startDate, noOfWeek) {
			var caldenderdata = datetime.getCalenderData(startDate, noOfWeek, this.getResourceBundle());
			var oCalendarModel = new JSONModel(caldenderdata);
			this.setModel(oCalendarModel, "calendar");
			var monday = datetime.getMonday(startDate);
			this.currentWeekNumber = datetime.getWeek(monday);
			this.currentYear = new Date(monday.getTime()).getFullYear();
		},

		_fragListWidth: function() {
			if (sap.ui.Device.system.desktop === true) {
				var width = "100%";
			} else {
				width = "97%";
			}
			var fragListWidthdata = {
				width: width
			};
			var oFragListWidthModel = new JSONModel(fragListWidthdata);
			this.setModel(oFragListWidthModel, "fragListWidth");
		},
		
		adjustWeekSummaryTextFont: function() {
			if(sap.ui.Device.system.phone === false) {
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
		
		onPressNavBack: function() {
			this.getRouter().navTo("Home", {}, true);
		},

		onPressAddIPD: function(oEvent) {
			this.getRouter().navTo("DailyAllowanceCreate", {}, true);
			this.getModel("utilityModel").setProperty("/isAllowanceCreate", true);
		},

		onPressEditAllowanceDetails: function(oEvent) {
			this.getRouter().navTo("DailyAllowanceCreate", {}, true);
			this.getModel("utilityModel").setProperty("/isAllowanceCreate", true);
		},

		OnHourPress: function(oEvent) {
			var isSelected = oEvent.getSource().getPressed();
			if (oEvent.getSource().getPressed()) {
				oEvent.getSource().removeStyleClass("hourSize");
				oEvent.getSource().addStyleClass("pressedSize");
			} else {
				oEvent.getSource().removeStyleClass("pressedSize");
				oEvent.getSource().addStyleClass("hourSize");
			}
			var selectedDate = oEvent.getSource().getCustomData()[3].getValue();
			var noOfRecord = this.getOwnerComponent().WKDItemIDate.length;
			for (var i = 0; i < noOfRecord; i++) {
				if (this.getOwnerComponent().WKDItemIDate[i].getDate() === selectedDate.getDate() &&
					this.getOwnerComponent().WKDItemIDate[i].getMonth() === selectedDate.getMonth() &&
					this.getOwnerComponent().WKDItemIDate[i].getYear() === selectedDate.getYear()) {
					var index = i;
					break;
				}
			}
			var listWKDidLocalNo = index + 1;
			var listWKDidLocal = "listWKD" + listWKDidLocalNo;
			this.getView().byId(listWKDidLocal).setVisible(isSelected);
			var buttonDayId = this.getOwnerComponent().oTimesheetControl.getView().byId("table").getItems()[0].getCells()[i].getId();
			sap.ui.getCore().byId(buttonDayId).setPressed(isSelected);
			var tempArray = [];
			var tableCells = this.getOwnerComponent().oTimesheetControl.getView().byId("table").getItems()[0].getCells();
			var count = 0;
			for (i = 0; i < tableCells.length; i++) {
				if (tableCells[i].getPressed()) {
					tempArray[count] = {
						id: tableCells[i].getCustomData()[2].getValue(),
						value: tableCells[i].getCustomData()[3].getValue()
					};
					count = count + 1;
				}
			}
			if (tempArray.length > 0) {
				this.getOwnerComponent().oTimesheetControl.serviceCallForWorkDaySet("", "", tempArray);
			}
		},

		initSrvEmployeeDetails: function() {
			var that = this;
			this.getOwnerComponent().getModel().read("/EmployeeSet('')", {
				success: function(data) {
					var oTable = that.getOwnerComponent().oTimesheetControl.getView().byId("table");
					var oCells = oTable.getItems()[0].getCells()[0];
					try {
						var dWKDData = oTable.getModel().getProperty(oCells.getBindingContext().getPath());
						var startDate = dWKDData.WeekDate1Date;
					} catch (e) {
						startDate = new Date();
					}
					var monday = datetime.getMonday(startDate);
					that.currentWeekNumber = datetime.getWeek(monday);
					that.currentYear = new Date(monday.getTime()).getFullYear();
					var urlString = "/WeekSummarySet(WeekNumber='" + that.currentWeekNumber + "',WeekYear='" + that.currentYear +
						"',isByWeekly=false,EmployeeId='" + data.EmployeeId + "')";
					that.getView().byId('columnList').bindElement(urlString);
					that.employeeId = data.EmployeeId;
					if (that.init === 'X') {
						that.setEmployeeSelected();
						that.showWorkDayItemList();
						that.init = undefined;
					}
					var oItems = that.getView().byId('columnList');
					that.getView().getModel("timesheetview").setProperty("/busy", false);
				},
				error: function(error) {
					that.getView().getModel("timesheetview").setProperty("/busy", false);
				}
			});
		},

		setEmployeeSelected: function() {
			var oTimedetailTable = this.getView().byId("table");
			var oTimesheetTable = this.getOwnerComponent().oTimesheetControl.getView().byId("table");
			var noOfCells = oTimesheetTable.getItems()[0].getCells().length;
			var TimesheetTableItemsSid, TimedetailTableItemsSid, buttonPressed;
			for (var i = 0; i < noOfCells; i++) {
				TimesheetTableItemsSid = oTimesheetTable.getItems()[0].getCells()[i].getId();
				buttonPressed = sap.ui.getCore().byId(TimesheetTableItemsSid).getPressed();
				TimedetailTableItemsSid = oTimedetailTable.getItems()[0].getCells()[i].getId();
				sap.ui.getCore().byId(TimedetailTableItemsSid).setPressed(buttonPressed);
				if (buttonPressed) {
					sap.ui.getCore().byId(TimedetailTableItemsSid).removeStyleClass("hourSize");
					sap.ui.getCore().byId(TimedetailTableItemsSid).addStyleClass("pressedSize");
				} else {
					sap.ui.getCore().byId(TimedetailTableItemsSid).removeStyleClass("pressedSize");
					sap.ui.getCore().byId(TimedetailTableItemsSid).addStyleClass("hourSize");
				}
			}
		},

		showWorkDayItemList: function() {
			var oTimedetailTable = this.getView().byId("table");
			var noOfCells = oTimedetailTable.getItems()[0].getCells().length;
			for (var i = 0; i < noOfCells; i++) {
				var TimedetailTableItemsSid = oTimedetailTable.getItems()[0].getCells()[i].getId();
				this.showListWKDidData(TimedetailTableItemsSid, i);
			}
		},

		showListWKDidData: function(oTableCellControlId, oId) {
			var that = this;
			var buttonPressed = sap.ui.getCore().byId(oTableCellControlId).getPressed();
			var listWKDidNo = oId + 1;
			var listWKDid = "listWKD" + listWKDidNo;
			this.getView().byId(listWKDid).setVisible(buttonPressed);
			var oTable = this.getOwnerComponent().oTimesheetControl.getView().byId("table");
			var oCells = oTable.getItems()[0].getCells()[oId];
			try {
				var dWKDData = oTable.getModel().getProperty(oCells.getBindingContext().getPath());
			} catch (e) {
				var startDate = new Date();
				var monday = datetime.getMonday(startDate);
				that.currentWeekNumber = datetime.getWeek(monday);
				that.currentYear = new Date(monday.getTime()).getFullYear();
				var urlString = "/WeekSummarySet(WeekNumber='" + that.currentWeekNumber + "',WeekYear='" + that.currentYear +
					"',isByWeekly=false,EmployeeId='" + this.employeeId + "')";
			}
			var fWeekDateHours = "WeekDate" + listWKDidNo + "Hours";
			var fWeekDateTargetHours = "WeekDate" + listWKDidNo + "TargetHours";
			var fWeekDayDate = "WeekDate" + listWKDidNo + "Date";
			var dWeekDateHours = this.utility.numberFormatter(dWKDData[fWeekDateHours]);
			var dWeekDateTargetHours = this.utility.numberFormatter(dWKDData[fWeekDateTargetHours]);
			var CalDate = dWKDData[fWeekDayDate];
			// var CalDate = this.getModel("calendar").getData().data[oId].Date;
			var CurDay = ('0' + CalDate.getDate()).slice(-2);
			var CurMonth = ('0' + (CalDate.getMonth() + 1)).slice(-2);
			var dCalDate = new Date(CalDate);
			this.getOwnerComponent().WKDItemIDate[oId] = dCalDate;
			var dayName = dCalDate.toString().split(' ')[0];
			var CurDayName = datetime.getFullDayName(dayName, this.getResourceBundle());
			var headerText = CurDayName + " " + CurDay + "/" + CurMonth + " - " + dWeekDateHours + "H/" + dWeekDateTargetHours + "H";
			this.getView().byId(listWKDid).setHeaderText(headerText);
			var arrParams = [
				new Filter("EmployeeId", FilterOperator.EQ, this.employeeId),
				new Filter("WorkDate", FilterOperator.EQ, CalDate),
				new Filter("EntryType", FilterOperator.EQ, "IPD")
			];
			this.getView().byId(listWKDid).bindAggregation("items", {
				path: "/WorkDayItemSet",
				filters: arrParams,
				template: this.getOwnerComponent().TemplateWKDItemDailyAllowanceDetails
			});
			// this.getOwnerComponent().getModel().read("/WorkDayItemSet", {
			// 	filters: arrParams,
			// 	success: function(data) {
			// 		if (data.results.length > 0) {
			// 			var noOfRecord = that.getOwnerComponent().WKDItemIDate.length;
			// 			for (var i = 0; i < noOfRecord; i++) {
			// 				if (that.getOwnerComponent().WKDItemIDate[i].getDate() === data.results[0].WorkDate.getDate() &&
			// 					that.getOwnerComponent().WKDItemIDate[i].getMonth() === data.results[0].WorkDate.getMonth() &&
			// 					that.getOwnerComponent().WKDItemIDate[i].getYear() === data.results[0].WorkDate.getYear()) {
			// 					var index = i;
			// 					break;
			// 				}
			// 			}
			// 			var listWKDidLocalNo = index + 1;
			// 			var listWKDidLocal = "listWKD" + listWKDidLocalNo;
			// 			var oWorkDayItemModel = new JSONModel();
			// 			oWorkDayItemModel.setProperty("/WorkDayItem", data.results);
			// 			if (that.getView().byId(listWKDidLocal).getBinding("items") !== undefined) {
			// 				that.getView().byId(listWKDidLocal).setModel(oWorkDayItemModel);
			// 			} else {
			// 				that.getView().byId(listWKDidLocal).setModel(oWorkDayItemModel);
			// 				that.getView().byId(listWKDidLocal).bindItems("/WorkDayItem", that.getView().byId(listWKDidLocal).getItems()[0].clone());
			// 			}
			// 		}
			// 	},
			// 	error: function(error) {
			// 		// TBD
			// 	}
			// });
		}
	});
});