sap.ui.define(["com/vinci/timesheet/employee/utility/datetime",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function(datetime, JSONModel, MessageBox,Filter,FilterOperator) {
	"use strict";

	return {
		Common_raiseinputError: function(source, text) {
			source.setValueStateText(text);
			source.setShowValueStateMessage(true);
			source.openValueStateMessage();
			source.focus();
		},
		refreshSearchField: function(that) {
			that.getView().byId("toolbar").getContent()[0].setValue("");
			that.getView().byId("searchField").fireLiveChange({
				newValue: ""
			});
		},
		onSelectFilter: function(radioEvent,that){
			
		if(that.getView().byId("radioVBox").getItems()[2].getSelected())
		{
				that.getView().byId("toolbar").setVisible(true);
				that.getView().byId("searchList1").setVisible(false);
				that.getView().byId("searchList2").setVisible(false);
				that.getView().byId("searchList3").setVisible(true);
				
		}else{
			var favFilters = [];
			var lastPrjFilters = [];
			var employee=that.getOwnerComponent().oTimesheetControl.employeeId;
			var favFilter = new Filter("Favorite", sap.ui.model.FilterOperator.EQ, true);
			var lastPrjFilter = new Filter("LastUsedProject", sap.ui.model.FilterOperator.EQ, true);
			var lastPrjEmpFilter = new Filter("EmployeeId", sap.ui.model.FilterOperator.EQ, employee);
			
			favFilters.push(favFilter);
			lastPrjFilters.push(lastPrjFilter);
			lastPrjFilters.push(lastPrjEmpFilter);
			
			var listFav = that.getView().byId("favPrjList");
			var listLastPrj = that.getView().byId("serachPrjList");
			
			that.getView().byId("toolbar").setVisible(false);
			
			var favBinding = listFav.getBinding("items");
			favBinding.filter(favFilters, "Application");

			var lastPrjBinding = listLastPrj.getBinding("items");
			lastPrjBinding.filter(lastPrjFilters, "Application");

				that.getView().byId("searchList1").setVisible(true);
				that.getView().byId("searchList2").setVisible(true);
				that.getView().byId("searchList3").setVisible(false);
		}
			
		},
		checkAnyProjectSelected : function(that){
			var favPrj=false;
			var allPrj=false;
			var lastPrj=false;
				var prjList=that.getView().byId("favPrjList").getItems();
				for (var i=0; i<prjList.length; i++) {
					if(prjList[i].getSelected()){
						favPrj=true;
					}
					
				}
					var lastPrjList=that.getView().byId("serachPrjList").getItems();
				for (var j=0; j<lastPrjList.length; j++) {
					if(lastPrjList[j].getSelected()){
						lastPrj=true;
					}
					
				}
				var allPrjList=that.getView().byId("allPrjList").getItems();
				for (var k=0; k<allPrjList.length; k++) {
					if(allPrjList[k].getSelected()){
						allPrj=true;
					}
					
				}
			
			if(!(favPrj || allPrj || lastPrj)){
				return false;
			}
			else{
				return true;
			}
			
		},
			onSearchProject : function(oEvt,that){
				var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				
				
	/*			var prjSerachFilter= new sap.ui.model.Filter([
       new Filter("ProjectDescription", sap.ui.model.FilterOperator.Contains, sQuery),
     new Filter("ProjectId", sap.ui.model.FilterOperator.Contains, sQuery),
      new Filter("ResponsiblePMName", sap.ui.model.FilterOperator.Contains, sQuery)]);*/
   
				var filterPD = new Filter("ProjectDescription", sap.ui.model.FilterOperator.Contains, sQuery);
				var filterPID = new Filter("ProjectId", sap.ui.model.FilterOperator.Contains, sQuery);
				var filterPM = new Filter("ResponsiblePMName", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filterPD);
				aFilters.push(filterPID);
				aFilters.push(filterPM);
			//	
			}

			// update list binding
			var list = that.getView().byId("allPrjList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		}

	};         

});