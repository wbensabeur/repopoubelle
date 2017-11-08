sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"com/vinci/timesheet/employee/utility/datetime",
	"com/vinci/timesheet/employee/model/utility",
	"com/vinci/timesheet/employee/utility/fragment",
	"sap/ui/model/Filter",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, Device, datetime, utility, fragment, Filter, MessageBox) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.KilometerCreate", {
		utility: utility,
		fragment: fragment,
		onInit: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				projectId: "",
				numOfKm: "",
				vehicle: "kCar"
			});
			this.setModel(oViewModel, "kmCreateView");
			this.getRouter().getRoute("KilometerCreate").attachPatternMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function() {
			this.clearFields(this);
			if (this.getOwnerComponent().editPath) {
				this.mode = "update";
				this.getView().byId("createTime").bindElement(this.getOwnerComponent().editPath);
				this.setUpdateDetails();
				this.getOwnerComponent().editPath = undefined;
			}
			else{
				this.mode="create";
			}

		},
		setUpdateDetails: function() {
			this.mode = "update";
			this.getModel("utilityModel").setProperty("/isTimeCreate", "DailyView");
			this.getView().byId("createTime").getItems()[0].getItems()[2].setVisible(true);
			this.getView().byId("selectFragmentPrj").getItems()[2].setVisible(true);
			this.getView().byId("selectFragmentPrj").getItems()[1].setVisible(false);

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
		},

		onPressNavBack: function() {
			if (this.getView().byId("createTime").getVisible()) {
				var isTmDetailOn = this.getModel("utilityModel").getProperty("/isKilometerCreate");
				if (isTmDetailOn) {
					this.getRouter().navTo("DailyAllowanceDetails", {}, true);
				} else {
					this.getRouter().navTo("Home", {}, true);
				}
			} else {
				this.getView().byId("projectSearchFragment").setVisible(false);
				this.getView().byId("createTime").setVisible(true);
			}
		},
		check2ndTravelBookedorNot: function() {
			var secondTravelBooked = false;
			var allValuesSelected = false;
			var partialValuesSelected = false;
			if ((this.getView().byId("startTimeSecond").getValue() !== "" || this.getView().byId("startTimeSecond").getValue() !== null) &&
				(this.getView().byId("endTimeSecond").getValue() !== "" || this.getView().byId("endTimeSecond").getValue() !== null) &&
				(this.getView().byId("kmNumberSecond").getValue() !== "" || this.getView().byId("kmNumberSecond").getValue() !== null))
			//	(this.getView().byId("kmTypeComboSecond").getSelectedItem().getText() !== "" || this.getView().byId("kmTypeComboSecond").getSelectedItem().getText() !== null)
			//	) 
			{
				allValuesSelected = true;
			}

			if ((this.getView().byId("startTimeSecond").getValue() !== "" && this.getView().byId("startTimeSecond").getValue() !== null) ||
				(this.getView().byId("endTimeSecond").getValue() !== "" && this.getView().byId("endTimeSecond").getValue() !== null) ||
				(this.getView().byId("kmNumberSecond").getValue() !== "" && this.getView().byId("kmNumberSecond").getValue() !== null))
			//	(this.getView().byId("kmTypeComboSecond").getSelectedItem().getText() !== "" && this.getView().byId("kmTypeComboSecond").getSelectedItem().getText() !== null)
			//	) 
			{
				partialValuesSelected = true;
			}
			if (allValuesSelected && partialValuesSelected) {
				secondTravelBooked = true;
				return secondTravelBooked;
			}

			return secondTravelBooked;
		},
		clearFields: function(thatPtr) {
			thatPtr.getView().byId("createTime").getItems()[0].getItems()[0].bindElement("");
			thatPtr.getView().byId("createTime").getItems()[0].getItems()[1].bindElement("");
			thatPtr.getView().byId("createTime").getItems()[0].getItems()[2].bindElement("");
			thatPtr.getView().byId("startTimeFirst").setValue("");
			thatPtr.getView().byId("endTimeFirst").setValue("");
			thatPtr.getView().byId("kmNumberFirst").setValue("");
			thatPtr.getView().byId("kmTypeComboSecond").setSelectedKey(null);
			thatPtr.getView().byId("startTimeSecond").setValue("");
			thatPtr.getView().byId("endTimeSecond").setValue("");
			thatPtr.getView().byId("kmNumberSecond").setValue("");
			thatPtr.getView().byId("kmTypeComboSecond").setSelectedKey(null);
			this.getView().byId("selectFragmentPrj").getItems()[2].setVisible(false);
			this.getView().byId("selectFragmentPrj").getItems()[1].setVisible(true);
		},
		validateKMEntries: function(isSecondTravel) {
			var validate = true;
			if ((this.getView().byId("startTimeFirst").getValue() === "" || this.getView().byId("startTimeFirst").getValue() === null) ||
				(this.getView().byId("endTimeFirst").getValue() === "" || this.getView().byId("endTimeFirst").getValue() === null) ||
				(this.getView().byId("kmNumberFirst").getValue() === "" || this.getView().byId("kmNumberFirst").getValue() === null) ||
				(this.getView().byId("kmTypeComboFirst").getSelectedItem().getText() === "" || this.getView().byId("kmTypeComboFirst").getSelectedItem()
					.getText() === null)
			) {
				validate = false;
			}

			if (isSecondTravel) {
				if ((this.getView().byId("startTimeSecond").getValue() === "" || this.getView().byId("startTimeSecond").getValue() === null) ||
					(this.getView().byId("endTimeSecond").getValue() === "" || this.getView().byId("endTimeSecond").getValue() === null) ||
					(this.getView().byId("kmNumberSecond").getValue() === "" || this.getView().byId("kmNumberSecond").getValue() === null) ||
					(this.getView().byId("kmTypeComboSecond").getSelectedItem().getText() === "" || this.getView().byId("kmTypeComboSecond").getSelectedItem()
						.getText() === null)
				) {
					validate = false;
				}
			}

			return validate;
		},
		onPressSave: function(oEvent) {
			var that = this;
			var isSecondTravel = this.check2ndTravelBookedorNot();
			var kmEntries = [];
			if (isSecondTravel) {
				kmEntries.push("First");
				kmEntries.push("Second");
			} else {
				kmEntries.push("First");
			}

			var isvalidate = this.validateKMEntries(isSecondTravel);
			if (!isvalidate) {
				MessageBox.alert("All Items are not selected");
				return;
			}
			var data = {
				"EmployeeId": "",
				"WorkDate": "",
				"NavWorkDayTimeItems": []
			};
			var timesheetDetails = this.getOwnerComponent().oTimesheetControl;
			var timesheetData = timesheetDetails.getView().byId("columnList").getCells();
			var projectId = this.getView().byId("createTime").getItems()[0].getItems()[1].getText();
			var projectName = this.getView().byId("createTime").getItems()[0].getItems()[0].getText();
			for (var i = 0; i < timesheetData.length; i++) {
				data.EmployeeId = timesheetData[i].getCustomData()[2].getValue();
				data.WorkDate = timesheetData[i].getCustomData()[3].getValue();
				if (timesheetData[i].getPressed()) {
					//	tempArray[count]={id : timesheetData[i].getCustomData()[2].getValue() , value :tableCells[i].getCustomData()[3].getValue()};
					for (var count = 0; count < kmEntries.length; count++) {
						var record = {
							"EmployeeId": timesheetData[i].getCustomData()[2].getValue(),
							"WorkDate": timesheetData[i].getCustomData()[3].getValue(),
							"Counter": "0",
							"ProjectID": projectId,
							"ProjectName": projectName,
							"EntryType": "KM",
							"EntryTypeCatId": this.getView().byId("kmTypeCombo" + kmEntries[count]).getSelectedKey(),
							"Hours": "",
							"KMNumber": this.getView().byId("kmNumber" + kmEntries[count]).getValue(),
							"StartTime": this.getView().byId("startTime" + kmEntries[count]).getValue(),
							"EndTime": this.getView().byId("endTime" + kmEntries[count]).getValue(),
							"Status": "D",
							"Comment": "",
							"CreatedBy": "",
							"CreatedOn": new Date(),
							"ReleaseOn": null,
							"ApprovedOn": null,
							"Reason": "",
							"AllowancesType": "",
							"AllowancesName": "",
							"ZoneType": "",
							"ZoneName": "",
							"MealIndicator": false,
							"JourneyIndicator": false,
							"TransportIndicator": false,
							"ApplicationName": "EMPLOYEE"
						};
						data.NavWorkDayTimeItems.push(record);

					}
				}
			}

			if (this.mode === "update") {
				this.getView().getModel().create("/WorkDaySet", data.NavWorkDayTimeItems[0], {
					success: function(oData, oResponse) {
						// Success
						that.getOwnerComponent().oTimesheetControl.getView().byId("table").getModel().refresh(true);
						var tempArray = timesheetDetails.getPressedWeekDayData();
						timesheetDetails.serviceCallForWorkDaySet(data.EmployeeId, data.WorkDate, tempArray);
						that.byId("addTimeSelectButton").setEnabled(true);
						that.getRouter().navTo("Home", {}, true);
						sap.m.MessageToast.show(that.getResourceBundle().getText("successMsgKm"), {
							duration: 5000
						});
					},
					error: function(oError) {
						// Error
						 that.mode="update";
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
						sap.m.MessageToast.show(that.getResourceBundle().getText("successMsgKm"), {
							duration: 5000
						});
					},
					error: function(oError) {
						// Error
						 that.mode="create";
						that.byId("addTimeSelectButton").setEnabled(true);
					}
				});
			}
		},
		OnChangeStartTime: function(oEvent) {
			var source = oEvent.getSource();

			var endTimer = source.getParent().getItems()[2];
			//	endTimer.setEnabled(true);
			var diffTime = 0;

			if (endTimer.getValue() !== null && endTimer.getValue().length > 0) {
				diffTime = datetime.timeToMilliSec(datetime.timeToMilliSec(endTimer.getValue() - oEvent.getParameter("value")));
			}
			if (diffTime > 0) {
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
			//		var currentTotalhrs = this.AddUpdatetimeModel.getProperty('/totalhrs');
			//	var newTotalhrs = currentTotalhrs + deltahrs;
			//		this.AddUpdatetimeModel.setProperty('/totalhrs', newTotalhrs);
			sourcePanel.getCustomData()[0].setValue(newValue);
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
			var startTimer = source.getParent().getItems()[1];

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
			var currentValue = sourcePanel.getCustomData()[0].getValue();
			var deltahrs = newValue - currentValue;
			//	var currentTotalhrs = this.AddUpdatetimeModel.getProperty('/totalhrs');
			//	var newTotalhrs = currentTotalhrs + deltahrs;
			//	this.AddUpdatetimeModel.setProperty('/totalhrs', newTotalhrs);
			sourcePanel.getCustomData()[0].setValue(newValue);

		},

		onPressCancel: function(oEvent) {
			var isAllowDetailOn = this.getModel("utilityModel").getProperty("/isKilometerCreate");
			if (isAllowDetailOn) {
				this.getRouter().navTo("DailyAllowanceDetails", {}, true);
			} else {
				this.getRouter().navTo("Home", {}, true);
			}
		},
		onSelectFilter: function(oEvent) {
			this.fragment.onSelectFilter(oEvent, this);
		},

		onPressFavorite: function(oEvent) {
			this.getModel("utilityModel").setProperty("/favInitiateCtrName", "KilometerCreate");
			this.getRouter().navTo("FavoriteProjectList", {}, true);
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
			var projectContext = oEvent.getSource().getCustomData()[0].getValue();
			var prjLabel = this.getView().byId("createTime").getItems()[0].getItems()[0];
			var prjLabelId = this.getView().byId("createTime").getItems()[0].getItems()[1];
			prjLabel.bindElement(projectContext); // Label 1 for description
			prjLabelId.bindElement(projectContext); //Label 2 for project id
			prjLabel.setVisible(true); // Label
			this.getView().byId("createTime").setVisible(true);
			this.getView().byId("selectFragmentPrj").getItems()[2].setVisible(true);
			this.getView().byId("selectFragmentPrj").getItems()[1].setVisible(false);
			this.getView().byId("projectSearchFragment").setVisible(false);
			this.getView().byId("addTimeCancelButton").setVisible(true);
			this.getView().byId("addTimeSelectButton").setVisible(true);
			this.getView().byId("ProjectCancelButton").setVisible(false);
			this.getView().byId("ProjectSelectButton").setVisible(false);

			//	this.selectProjectcontext[1].setVisible(false); // ownIntialButton
			//	this.selectProjectcontext[2].setVisible(true); // ownRefreshButton
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

			this.getView().byId("createTime").setVisible(false);
			this.getView().byId("projectSearchFragment").setVisible(true);
			this.getView().byId("addTimeCancelButton").setVisible(false);
			this.getView().byId("addTimeSelectButton").setVisible(false);
			this.getView().byId("ProjectCancelButton").setVisible(true);
			this.getView().byId("ProjectSelectButton").setVisible(true);

		}

	});
});