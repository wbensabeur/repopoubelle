sap.ui.define([
	"sap/m/MessageBox",
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"com/vinci/timesheet/employee/utility/datetime",
	"com/vinci/timesheet/employee/model/utility",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function(MessageBox, BaseController, JSONModel, Device, datetime, Utility, Filter, FilterOperator,  MessageToast) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.DailyViewDetails", {
		messageBox: MessageBox,
		utility: Utility,
		onInit: function() {
			this.getOwnerComponent().oWeeklyReportControl = this;
			this.getOwnerComponent().WKDItemWRDate = [];
			this.getOwnerComponent().TemplateWKDItemDailyViewDetails = this.getView().byId('listWKD1').getItems()[0].clone();
			var that = this;
			this.init = 'X';
			this.initSrvEmployeeDetails();
			this.getRouter().getRoute("DailyViewDetails").attachPatternMatched(this._onRouteMatched, this);
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
		onBeforeRendering: function() {
			var tableCells = this.getView().byId("table").getItems()[0].getCells();
			for (var i = 0; i < tableCells.length; i++) {
				tableCells[i].getCustomData()[0].setValue("");
				tableCells[i].getCustomData()[1].setValue("");
			}
		},
		onUpdateFinished: function(oEvent) {
			var oItems = this.getView().byId('columnList');
		},

		_onRouteMatched: function() {
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

		onPressNavBack: function() {
			this.getRouter().navTo("Home", {}, true);
		},

		onPressAddTime: function(oEvent) {
			this.getRouter().navTo("TimeCreate", {}, true);
			this.getModel("utilityModel").setProperty("/isTimeCreate", true);
		},

		onPressSubmitWeek: function(oEvent) {
			// window.html2canvas($("#shell-container-canvas"), {
			// 	onrendered: function(canvas) {
			// 		var img = canvas.toDataURL("image/jpg", 0);
			// 		window.open(img);
			// 		/*var doc = new jsPDF();
			// 		doc.addImage(img, 'JPEG', 600, 400);
			// 		doc.save('test.pdf');*/
			// 	}
			// });
			// this.getView().byId("panelSignature").setVisible(false);
			// this.getView().byId("btnSubmitWeek").setVisible(false);
			var thatControl = this;
			var requestBody = {
				"EmployeeId": this.employeeId,
				"WorkDate": this.getOwnerComponent().WKDItemWRDate[0],
				"Status": "RELEASE",
				"NavWorkDayTimeItems": []
			};
			for (var i = 1; i < 8; i++) {
				var listWKDidLocal = "listWKD" + i;
				var listWKDidLocalModel = this.getView().byId(listWKDidLocal).getModel();
				var listWKDidLocalItems = this.getView().byId(listWKDidLocal).getItems();
				for (var j = 0; j < listWKDidLocalItems.length; j++) {
					var listWKDidLocalItemData = listWKDidLocalModel.getProperty(listWKDidLocalItems[j].getBindingContext().getPath());
					var locatData = {
						EmployeeId: listWKDidLocalItemData.EmployeeId,
						WorkDate: listWKDidLocalItemData.WorkDate,
						Counter: listWKDidLocalItemData.Counter,
						ProjectID: listWKDidLocalItemData.ProjectID,
						ProjectName: listWKDidLocalItemData.ProjectName,
						EntryType: listWKDidLocalItemData.EntryType,
						EntryTypeCatId: listWKDidLocalItemData.EntryTypeCatId,
						EntryTypeDesc: listWKDidLocalItemData.EntryTypeDesc,
						Hours: listWKDidLocalItemData.Hours,
						HourUnit: listWKDidLocalItemData.HourUnit,
						KMNumber: listWKDidLocalItemData.KMNumber,
						StartTime: listWKDidLocalItemData.StartTime,
						EndTime: listWKDidLocalItemData.EndTime,
						FullDay: listWKDidLocalItemData.FullDay,
						Status: listWKDidLocalItemData.Status,
						Comment: listWKDidLocalItemData.Comment,
						CreatedBy: listWKDidLocalItemData.CreatedBy,
						CreatedOn: listWKDidLocalItemData.CreatedOn,
						ReleaseOn: listWKDidLocalItemData.ReleaseOn,
						ApprovedOn: listWKDidLocalItemData.ApprovedOn,
						Reason: listWKDidLocalItemData.Reason,
						AllowancesType: listWKDidLocalItemData.AllowancesType,
						AllowancesName: listWKDidLocalItemData.AllowancesName,
						ZoneType: listWKDidLocalItemData.ZoneType,
						ZoneName: listWKDidLocalItemData.ZoneName,
						MealIndicator: listWKDidLocalItemData.MealIndicator,
						JourneyIndicator: listWKDidLocalItemData.JourneyIndicator,
						TransportIndicator: listWKDidLocalItemData.TransportIndicator,
						ApplicationName: 'EMPLOYEE'
					};
					requestBody.NavWorkDayTimeItems.push(locatData);
				}
			}
			this.getView().getModel().create("/WorkDaySet", requestBody, {
				success: jQuery.proxy(function(value, success) {
					thatControl.getOwnerComponent().oTimesheetControl.getView().byId("table").getModel().refresh(true);
					thatControl.getRouter().navTo("Home", {}, true);
					sap.m.MessageToast.show(thatControl.getResourceBundle().getText("successMsgWeeklyReport"), {
						duration: 5000
					});
				}, this),
				error: jQuery.proxy(function(error) {
					var bCompact = !!thatControl.getView().$().closest(".sapUiSizeCompact").length;
					thatControl.messageBox.error(
						"Error", {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
				})
			});
		},

		onPressSendPDF: function(oEvent) {

		},

		onPressClear: function() {
			sap.ui.getCore().getControl("mySignaturePad").clear();
		},

		onPressSignature: function() {
			this.dialogPressSignature.close();
			var srcImg = sap.ui.getCore().getControl("mySignaturePad").save();
			this.getView().byId("imageSignature").setSrc(srcImg);
			this.getView().byId("panelSignature").setVisible(true);
			this.getView().byId("btnSubmitWeek").setVisible(true);
			// this.getView().byId("btnSendPdf").setVisible(true);
		},

		onPressSignatureDialog: function() {
			if (!this.dialogPressSignature) {
				this.dialogPressSignature = sap.ui.xmlfragment("com.vinci.timesheet.employee.view.Signature", this);
				this.dialogPressSignature.setModel(this.getView().getModel());
			}
			jQuery.sap.syncStyleClass("sapUISizeCompact", this.getView(), this.dialogPressSignature);
			this.getView().addDependent(this.dialogPressSignature);
			this.dialogPressSignature.open();
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
			var noOfRecord = this.getOwnerComponent().WKDItemWRDate.length;
			for (var i = 0; i < noOfRecord; i++) {
				if (this.getOwnerComponent().WKDItemWRDate[i].getDate() === selectedDate.getDate() &&
					this.getOwnerComponent().WKDItemWRDate[i].getMonth() === selectedDate.getMonth() &&
					this.getOwnerComponent().WKDItemWRDate[i].getYear() === selectedDate.getYear()) {
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

		handleSwipe: function(oEvent) {
			var binding = oEvent.getParameter("listItem").getBindingContext().getPath();
			var NotEditable = this.getView().getModel().getProperty(binding).NotEditable;
			var entryType = this.getView().getModel().getProperty(binding).EntryType;
			if (NotEditable === true) {
				oEvent.getSource().getSwipeContent().setVisible(false);
			} else {
				oEvent.getSource().getSwipeContent().setVisible(true);
			}
			oEvent.getSource().getSwipeContent().getContent()[0].getItems()[0].getCustomData()[0].setValue(binding);
			oEvent.getSource().getSwipeContent().getContent()[0].getItems()[1].getCustomData()[0].setValue(binding);
			oEvent.getSource().getSwipeContent().getContent()[0].getItems()[0].getCustomData()[1].setValue(entryType);

			//oEvent.getSource().getSwipeContent().getContent()[0].getCustomData()[0].setValue(binding);

		},

		onPressDeleteSwipe: function(oEvent) {
				var listId = oEvent.getSource().getParent().getCustomData()[0].getValue();
			//var binding = oEvent.getSource().getParent().getSwipeContent().getContent()[0].getCustomData()[0].getValue();
		//	var binding = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getSwipeContent().getContent()[
		//		0].getItems()[0].getCustomData()[0].getValue();
			var binding = this.getView().byId(listId).getSwipeContent().getContent()[0].getItems()[0].getCustomData()[0].getValue();
			var that = this;
			//	var contextPath = this.getView().byId('EmpDayTotal').getBindingContext().getPath();

			//this.getView().byId('EmpDayTotal').getBinding('text').refresh();
			//oView.byId('EmpDayStatus').bindElement(urlStr);
			//oView.byId('EmpDayInfo').bindElement(urlStr);

			this.getView().getModel().remove(binding, {
				success: function(data) {
					//			that.getView().getModel().read(contextPath);
					that.getOwnerComponent().oTimesheetControl.getView().byId("table").getModel().refresh(true);
					MessageToast.show(that.getResourceBundle().getText("successDeleteMsg"));
				}
			});
		},
		onPressEditSwipe: function(oEvent) {
			var listId = oEvent.getSource().getParent().getCustomData()[0].getValue();
			//	var binding =oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getSwipeContent().getContent()[0].getItems()[0].getCustomData()[0].getValue();
			var binding = this.getView().byId(listId).getSwipeContent().getContent()[0].getItems()[0].getCustomData()[0].getValue();
			this.getOwnerComponent().editPath = binding;
		//	var entryTypeValue = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getSwipeContent().getContent()[
		//		0].getItems()[0].getCustomData()[1].getValue();
		var entryTypeValue=this.getView().byId(listId).getSwipeContent().getContent()[0].getItems()[0].getCustomData()[1].getValue();
			if (entryTypeValue === "HOURS") {
				this.getRouter().navTo("TimeCreate", {}, true);
			this.getModel("utilityModel").setProperty("/isTimeCreate", "DailyView");
			}
			if (entryTypeValue === "IPD") {
				this.getRouter().navTo("DailyAllowanceCreate", {}, true);
			this.getModel("utilityModel").setProperty("/isAllowanceCreate", "DailyView");
			}
			if (entryTypeValue === "KM") {
				this.getRouter().navTo("KilometerCreate", {}, true);
			}

		},
		onPressDelete: function(oEvent) {
			var binding = oEvent.getSource().getBindingContext().getPath();
			var that = this;
			//	var contextPath = this.getView().byId('EmpDayTotal').getBindingContext().getPath();

			//this.getView().byId('EmpDayTotal').getBinding('text').refresh();
			//oView.byId('EmpDayStatus').bindElement(urlStr);
			//oView.byId('EmpDayInfo').bindElement(urlStr);

			this.getView().getModel().remove(binding, {
				success: function(data) {
					//			that.getView().getModel().read(contextPath);
					that.getOwnerComponent().oTimesheetControl.getView().byId("table").getModel().refresh(true);
					MessageToast.show(that.getResourceBundle().getText("successDeleteMsg"));
				}
			});
		},
	onPressEdit: function(oEvent) {
			var binding = oEvent.getSource().getBindingContext().getPath();
		this.getOwnerComponent().editPath = binding;
		//	var entryTypeValue = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getSwipeContent().getContent()[
		//		0].getItems()[0].getCustomData()[1].getValue();
		var entryTypeValue=oEvent.getSource().getParent().getCustomData()[0].getValue();
			if (entryTypeValue === "HOURS") {
				this.getRouter().navTo("TimeCreate", {}, true);
			}
			if (entryTypeValue === "IPD") {
				this.getRouter().navTo("DailyAllowanceCreate", {}, true);
			}
			if (entryTypeValue === "KM") {
				this.getRouter().navTo("KilometerCreate", {}, true);
			}

			this.getModel("utilityModel").setProperty("/isTimeCreate", "DailyView");
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
			this.getOwnerComponent().WKDItemWRDate[oId] = dCalDate;
			var dayName = dCalDate.toString().split(' ')[0];
			var CurDayName = datetime.getFullDayName(dayName, this.getResourceBundle());
			var headerText = CurDayName + " " + CurDay + "/" + CurMonth + " - " + dWeekDateHours + "H/" + dWeekDateTargetHours + "H";
			this.getView().byId(listWKDid).setHeaderText(headerText);
			var arrParams = [
				new Filter("EmployeeId", FilterOperator.EQ, this.employeeId),
				new Filter("WorkDate", FilterOperator.EQ, CalDate)
			];
			this.getView().byId(listWKDid).bindAggregation("items", {
				path: "/WorkDayItemSet",
				filters: arrParams,
				template: this.getOwnerComponent().TemplateWKDItemDailyViewDetails
			});
			// this.getOwnerComponent().getModel().read("/WorkDayItemSet", {
			// 	filters: arrParams,
			// 	success: function(data) {
			// 		if (data.results.length > 0) {
			// 			var noOfRecord = that.getOwnerComponent().WKDItemWRDate.length;
			// 			for (var i = 0; i < noOfRecord; i++) {
			// 				if (that.getOwnerComponent().WKDItemWRDate[i].getDate() === data.results[0].WorkDate.getDate() &&
			// 					that.getOwnerComponent().WKDItemWRDate[i].getMonth() === data.results[0].WorkDate.getMonth() &&
			// 					that.getOwnerComponent().WKDItemWRDate[i].getYear() === data.results[0].WorkDate.getYear()) {
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