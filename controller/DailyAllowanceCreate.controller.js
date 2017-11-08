sap.ui.define([
	"com/vinci/timesheet/employee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"com/vinci/timesheet/employee/utility/datetime",
	"com/vinci/timesheet/employee/utility/fragment",
	"com/vinci/timesheet/employee/model/utility",
	"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, Device, datetime, fragment, utility, Filter,FilterOperator) {
	"use strict";

	return BaseController.extend("com.vinci.timesheet.employee.controller.DailyAllowanceCreate", {
		utility: utility,
		fragment: fragment,
		onInit: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				projectId: "",
				comments: "",
				zone: "z1",
				meal: "",
				travel: "",
				transport: ""
			});
			this.setModel(oViewModel, "dailyAllowCreateView");
			this.getRouter().getRoute("DailyAllowanceCreate").attachPatternMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function() {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				projectId: "",
				comments: "",
				zone: "z1",
				meal: "",
				travel: "",
				transport: ""
			});
			this.setModel(oViewModel, "dailyAllowCreateView");
			this.clearFields(this);
			this.byId("addTimeSelectButton").setEnabled(true);
			this.byId("RB1").setSelected(true);
			this.byId("searchList1").setVisible(true);
			this.byId("searchList2").setVisible(true);
			this.byId("searchList3").setVisible(false);
			this.byId("toolbar").setVisible(false);
			if (this.getOwnerComponent().editPath) {
				this.mode = "update";
				if (this.getView().byId("dailyAllownceCreate").getElementBinding()) {
					this.getView().byId("dailyAllownceCreate").unbindElement();
					this.getView().byId("createTime").getItems()[0].getItems()[2].unbindElement();
				}
				this.getView().byId("dailyAllownceCreate").bindElement(this.getOwnerComponent().editPath);
				this.setUpdateDetails();
				this.getOwnerComponent().editPath = undefined;
			} else {
				this.mode = "create";
			}

		},
		setUpdateDetails: function() {
		//	var that = this;
/*	var arrParams = [];
		var urlStr = "/ValueHelpSet";
		arrParams.push(new Filter("ApplicationName", FilterOperator.EQ, "EMPLOYEE"));
		arrParams.push(new Filter("HelpType", FilterOperator.EQ, "ZN"));*/
		
			var oModelData = this.getView().getModel().getProperty(this.getView().byId("dailyAllownceCreate").getBindingContext().getPath());
		//arrParams.push(new Filter("FieldDescription", FilterOperator.EQ,oModelData.ZoneType));
			var projectName = oModelData.ProjectName;
			/*	this.getView().getModel().read(urlStr, {
				filters: arrParams,
				success: function(data) {
					that.getView().byId("zoneCombo").setSelectedKey(data.results[0].FieldValue);
				},
				error: function(error) {
					//sap.m.MessageToast.show("Failed");
				}
			});*/
		
			this.getModel("utilityModel").setProperty("/isAllowanceCreate", "DailyView");
			this.getView().byId("createTime").getItems()[0].getItems()[2].setVisible(true);
			if (projectName !== '' && projectName !== undefined) {
				this.getView().byId("selectFragmentPrj").getItems()[2].setVisible(true);
				this.getView().byId("selectFragmentPrj").getItems()[3].setVisible(true);
				this.getView().byId("selectFragmentPrj").getItems()[1].setVisible(false);
			} else {
				this.getView().byId("selectFragmentPrj").getItems()[2].setVisible(false);
				this.getView().byId("selectFragmentPrj").getItems()[3].setVisible(false);
				this.getView().byId("selectFragmentPrj").getItems()[1].setVisible(true);
			}

		},
		OnProjectDelete: function(oEvent) {
			var btn = oEvent.getSource();
			var projectContext = btn.getParent().getItems();
			this.getView().byId("createTime").getItems()[0].getItems()[0].unbindElement();
			this.getView().byId("createTime").getItems()[0].getItems()[0].setVisible(false);
			this.getView().byId("createTime").getItems()[0].getItems()[2].unbindElement();
			this.getView().byId("createTime").getItems()[0].getItems()[2].setVisible(false);
				this.getView().byId("createTime").getItems()[0].getItems()[0].setText("");
			this.getView().byId("createTime").getItems()[0].getItems()[1].setText("");
			this.getView().byId("createTime").getItems()[0].getItems()[2].setText("");
			//	this.getView().byId("selectFragmentPrj").getItems()[0].unbindElement();
			//	projectContext[0].unbindElement();
			//	projectContext[0].setVisible(false);
			projectContext[1].setVisible(true); // ownIntialButton
			projectContext[2].setVisible(false); // ownRefreshButton
			btn.setVisible(false); // delete Button

		},
		onPressNavBack: function() {
			fragment.refreshSearchField(this); 
			if (this.getView().byId("dailyAllownceCreate").getVisible()) {
				var isTmDetailOn = this.getModel("utilityModel").getProperty("/isAllowanceCreate");
				if (isTmDetailOn === true) {
					this.getRouter().navTo("DailyAllowanceDetails", {}, true);
				} else if (isTmDetailOn === "DailyView") {
					this.getRouter().navTo("DailyViewDetails", {}, true);
				} else {
					this.getRouter().navTo("Home", {}, true);
				}
			} else {
				this.getView().byId("projectSearchFragment").setVisible(false);
				this.getView().byId("dailyAllownceCreate").setVisible(true);
				this.getView().byId("dailyAllowanceFooter").setVisible(true);
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

			this.getView().byId("dailyAllownceCreate").setVisible(false);
			//	this.getView().byId("dailyAllowanceFooter").setVisible(false);
			this.getView().byId("projectSearchFragment").setVisible(true);
			this.getView().byId("addTimeCancelButton").setVisible(false);
			this.getView().byId("addTimeSelectButton").setVisible(false);
			this.getView().byId("ProjectCancelButton").setVisible(true);
			this.getView().byId("ProjectSelectButton").setVisible(true);

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
		onPressProjectCancel: function() {
			fragment.refreshSearchField(this); 
			this.getView().byId("createTime").getItems()[0].getItems()[0].setText("");
			this.getView().byId("createTime").getItems()[0].getItems()[1].setText("");
			this.getView().byId("createTime").getItems()[0].getItems()[2].setText("");
			this.getView().byId("dailyAllownceCreate").setVisible(true);
			this.getView().byId("projectSearchFragment").setVisible(false);
			this.getView().byId("addTimeCancelButton").setVisible(true);
			this.getView().byId("addTimeSelectButton").setVisible(true);
			this.getView().byId("ProjectCancelButton").setVisible(false);
			this.getView().byId("ProjectSelectButton").setVisible(false);
		},
		onPressProjectSelect: function(oEvent) {
			if (fragment.checkAnyProjectSelected(this)) {

				var projectContext = oEvent.getSource().getCustomData()[0].getValue();
				var prjLabel = this.getView().byId("createTime").getItems()[0].getItems()[0];
				var prjLabelId = this.getView().byId("createTime").getItems()[0].getItems()[1];
				prjLabel.bindElement(projectContext); // Label 1 for description
				prjLabelId.bindElement(projectContext); //Label 2 for project id
				prjLabel.setVisible(true); // Label
				this.getView().byId("createTime").getItems()[0].getItems()[2].setVisible(false);
				this.getView().byId("selectFragmentPrj").getItems()[2].setVisible(true);
				this.getView().byId("selectFragmentPrj").getItems()[1].setVisible(false);
				this.getView().byId("selectFragmentPrj").getItems()[3].setVisible(true);
				this.getView().byId("dailyAllownceCreate").setVisible(true);
				this.getView().byId("projectSearchFragment").setVisible(false);
				//	this.getView().byId("dailyAllowanceFooter").setVisible(true);
				this.getView().byId("addTimeCancelButton").setVisible(true);
				this.getView().byId("addTimeSelectButton").setVisible(true);
				this.getView().byId("ProjectCancelButton").setVisible(false);
				this.getView().byId("ProjectSelectButton").setVisible(false);
				fragment.refreshSearchField(this); 
			} else {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtleastOnePrj"), {
					duration: 5000
				});
				return;
			}
			//	this.selectProjectcontext[1].setVisible(false); // ownIntialButton
			//	this.selectProjectcontext[2].setVisible(true); // ownRefreshButton
		},
		onPressSave: function(oEvent) {
			var thisEvent = oEvent;
			thisEvent.getSource().setEnabled(false);
			var that = this;
		var updateWorkDate="";
			var Counter = "0";
			var updateUrl = "";
				var projectId = this.getView().byId("createTime").getItems()[0].getItems()[1].getText();
			var projectName ="";// this.getView().byId("createTime").getItems()[0].getItems()[0].getText();
			if (this.mode === "update") {
				updateUrl = this.getView().byId("dailyAllownceCreate").getBindingContext().getPath();

				var oModelData = this.getView().getModel().getProperty(this.getView().byId("dailyAllownceCreate").getBindingContext().getPath());
				Counter = oModelData.Counter;
				updateWorkDate=oModelData.WorkDate;
					if (projectId === "" || projectId === null || projectId === undefined) {
					//projectId = this.getView().byId("createTime").getItems()[0].getItems()[2].getText();
					projectName = this.getView().byId("createTime").getItems()[0].getItems()[2].getText();
					if(projectName !== "" && projectName !== undefined && projectName !== null){
						projectId = this.getView().getModel().getProperty(updateUrl).ProjectID;
					}
				}
			}
			else{
				projectName = this.getView().byId("createTime").getItems()[0].getItems()[0].getText();
			}
			var cmbZoneType = this.getView().byId("zoneCombo");
			var entryTypeId = cmbZoneType.getSelectedKey();
			var zoneName = cmbZoneType.getSelectedItem().getText();

			var mealIndicator = false;
			var transportIndicator = false;
			var travelIndicator = false;
			var selectionItem = this.getView().byId("allowanceSelection").getItems();
			var hoursCount = 0;
			for (var i = 0; i < selectionItem.length; i++) {
				if (selectionItem[i].hasStyleClass("btnSelection")) {
					hoursCount = hoursCount + 1;
				}

			}
			if (this.getModel("dailyAllowCreateView").getProperty("/meal") === "M") {
				mealIndicator = true;
			}
			if (this.getModel("dailyAllowCreateView").getProperty("/transport") === "T") {
				transportIndicator = true;
			}
			if (this.getModel("dailyAllowCreateView").getProperty("/travel") === "C") {
				travelIndicator = true;
			}

			var data = {
				"EmployeeId": "",
				"WorkDate": "",
				"NavWorkDayTimeItems": []
			};
			var timesheetDetails = this.getOwnerComponent().oTimesheetControl;
			var timesheetData = timesheetDetails.getView().byId("columnList").getCells();
		//	var projectId = this.getView().byId("createTime").getItems()[0].getItems()[1].getText();
		//	var projectName = this.getView().byId("createTime").getItems()[0].getItems()[0].getText();
			if (this.mode === "update") {
			for (var i = 0; i < timesheetData.length; i++) {
				data.EmployeeId = timesheetData[i].getCustomData()[2].getValue();
				data.WorkDate = timesheetData[i].getCustomData()[3].getValue();
				if (timesheetData[i].getPressed() &&  timesheetData[i].getCustomData()[3].getValue().getTime()===updateWorkDate.getTime()) {
					//	tempArray[count]={id : timesheetData[i].getCustomData()[2].getValue() , value :tableCells[i].getCustomData()[3].getValue()};
					var record = {
						"EmployeeId": timesheetData[i].getCustomData()[2].getValue(),
						"WorkDate": timesheetData[i].getCustomData()[3].getValue(),
						"Counter": Counter,
						"ProjectID": projectId,
						"ProjectName": projectName,
						"EntryType": "IPD",
						"EntryTypeCatId": null,
						"Hours": "1",
						"StartTime": "000000",
						"EndTime": "000000",
						"Status": "V",
						"Comment": "",
						"CreatedBy": "",
						"CreatedOn": new Date(),
						"ReleaseOn": null,
						"ApprovedOn": null,
						"Reason": "",
						"AllowancesType": "",
						"AllowancesName": "",
						"ZoneType": entryTypeId.trim(),
						"ZoneName": zoneName,
						"MealIndicator": mealIndicator,
						"JourneyIndicator": travelIndicator,
						"TransportIndicator": transportIndicator,
						"ApplicationName": "EMPLOYEE"
					};
					data.NavWorkDayTimeItems.push(record);
				}
			}
			}else{	
				for (var i = 0; i < timesheetData.length; i++) {
				data.EmployeeId = timesheetData[i].getCustomData()[2].getValue();
				data.WorkDate = timesheetData[i].getCustomData()[3].getValue();
				if (timesheetData[i].getPressed()) {
					//	tempArray[count]={id : timesheetData[i].getCustomData()[2].getValue() , value :tableCells[i].getCustomData()[3].getValue()};
					var record = {
						"EmployeeId": timesheetData[i].getCustomData()[2].getValue(),
						"WorkDate": timesheetData[i].getCustomData()[3].getValue(),
						"Counter": Counter,
						"ProjectID": projectId,
						"ProjectName": projectName,
						"EntryType": "IPD",
						"EntryTypeCatId": null,
						"Hours": "1",
						"StartTime": "000000",
						"EndTime": "000000",
						"Status": "V",
						"Comment": "",
						"CreatedBy": "",
						"CreatedOn": new Date(),
						"ReleaseOn": null,
						"ApprovedOn": null,
						"Reason": "",
						"AllowancesType": "",
						"AllowancesName": "",
						"ZoneType": entryTypeId.trim(),
						"ZoneName": zoneName,
						"MealIndicator": mealIndicator,
						"JourneyIndicator": travelIndicator,
						"TransportIndicator": transportIndicator,
						"ApplicationName": "EMPLOYEE"
					};
					data.NavWorkDayTimeItems.push(record);
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
						sap.m.MessageToast.show(that.getResourceBundle().getText("successMsgIPD"), {
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
						sap.m.MessageToast.show(that.getResourceBundle().getText("successMsgIPD"), {
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
			thatPtr.getView().byId("createTime").getItems()[0].getItems()[0].setText("");
			thatPtr.getView().byId("createTime").getItems()[0].getItems()[1].setText("");
			thatPtr.getView().byId("createTime").getItems()[0].getItems()[2].setText("");
			thatPtr.getView().byId("selectFragmentPrj").getItems()[2].setVisible(false);
			thatPtr.getView().byId("selectFragmentPrj").getItems()[3].setVisible(false);
			thatPtr.getView().byId("selectFragmentPrj").getItems()[1].setVisible(true);
			thatPtr.getView().byId("allowanceSelection").getItems()[0].setPressed(false);
			thatPtr.getView().byId("allowanceSelection").getItems()[1].setPressed(false);
			thatPtr.getView().byId("allowanceSelection").getItems()[2].setPressed(false);
			thatPtr.getView().byId("zoneCombo").setSelectedKey(null);
				thatPtr.byId("addTimeSelectButton").setEnabled(true);
		},
		onPressCancel: function(oEvent) {
			fragment.refreshSearchField(this); 
			this.clearFields(this);
			var isAllowDetailOn = this.getModel("utilityModel").getProperty("/isAllowanceCreate");
			if (isAllowDetailOn === true) {
				this.getRouter().navTo("DailyAllowanceDetails", {}, true);
			}  else if (isAllowDetailOn === "DailyView") {
				this.getRouter().navTo("DailyViewDetails", {}, true);
			} else {
				this.getRouter().navTo("Home", {}, true);
			}
		},

		onPressMeal: function(oEvent) {
			//if(oEvent.getSource().hasStyleClass("btnSelection")){
			if (oEvent.getSource().getPressed()) {
				//oEvent.getSource().removeStyleClass("btnSelection");
				this.getModel("dailyAllowCreateView").setProperty("/meal", "M");
			} else {
				this.getModel("dailyAllowCreateView").setProperty("/meal", "");
				//oEvent.getSource().addStyleClass("btnSelection");
			}

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
		onPressTravel: function(oEvent) {
			if (oEvent.getSource().getPressed()) {
				//	oEvent.getSource().removeStyleClass("btnSelection");
				this.getModel("dailyAllowCreateView").setProperty("/travel", "C");
			} else {
				this.getModel("dailyAllowCreateView").setProperty("/travel", "");
				//	oEvent.getSource().addStyleClass("btnSelection");
			}

		},
		onSelectFilter: function(oEvent) {
			this.fragment.onSelectFilter(oEvent, this);
		},
		onPressTransport: function(oEvent) {
			if (oEvent.getSource().getPressed()) {
				this.getModel("dailyAllowCreateView").setProperty("/transport", "T");
				//oEvent.getSource().removeStyleClass("btnSelection");
			} else {
				this.getModel("dailyAllowCreateView").setProperty("/transport", "");
				//oEvent.getSource().addStyleClass("btnSelection");
			}

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
		onPressFavorite: function(oEvent) {
			this.getModel("utilityModel").setProperty("/favInitiateCtrName", "DailyAllowanceCreate");
			this.getRouter().navTo("FavoriteProjectList", {}, true);
		}

	});
});