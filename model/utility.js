sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"com/vinci/timesheet/employee/utility/datetime",
	"sap/ui/core/format/NumberFormat"
], function(JSONModel, Device, datetime, NumberFormat) {
	"use strict";

	return {

		getMonday: function(fromDate) {
			// length of one day i milliseconds
			var dayLength = 24 * 60 * 60 * 1000;
			// Get the current date (without time)
			var currentDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
			// Get the current date's millisecond for this week
			var currentWeekDayMillisecond = ((currentDate.getDay()) * dayLength);
			// subtract the current date with the current date's millisecond for this week
			var monday = new Date(currentDate.getTime() - currentWeekDayMillisecond + dayLength); //for Monday: + dayLength etc.
			if (monday > currentDate) {
				// It is sunday, so we need to go back further
				monday = new Date(monday.getTime() - (dayLength * 7));
			}
			return monday;
		},
		conertDateToISTTimeZone: function(workDate) {
			var d = new Date(workDate);
			var offset = 5.5;

			// convert to msec
			// add local time zone offset 
			// get UTC time in msec
			var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

			// create new Date object for different city
			// using supplied offset
			var nd = new Date(utc + (3600000 * offset));
			return nd;
		},
		convertDateToEdmDateTime: function(workDate) {
			var sDate = new Date(workDate);
			var hr = ("0" + sDate.getHours()).slice(-2);
			var min = ("0" + sDate.getMinutes()).slice(-2);
			var sec = ("0" + sDate.getSeconds()).slice(-2);
			var mnth = sDate.getMonth() + 1;
			var formteedDate = sDate.getFullYear() + "-" + ("0" + mnth).slice(-2) + "-" + sDate.getDate() + "T" + hr + ":" + min + ":" + sec;
			return formteedDate;
		},

		periodFormat: function(oDate, biweekly) {
			var currentWeekNumber = datetime.getWeek(oDate);
			var month = oDate.toLocaleString(sap.ui.getCore().getConfiguration().getLocale().toString(), {
				month: "long"
			});
			month = month[0].toUpperCase() + month.slice(1);
			var currentYear = oDate.getFullYear();
			var oString = null;
			if (biweekly) {
				oString = this.getResourceBundle().getText("week") + " " + currentWeekNumber + " " + this.getResourceBundle().getText("and") + " " +
					(currentWeekNumber + 1) + ' - ' + this.getResourceBundle()
					.getText("from") + ' ';
			} else {
				oString = this.getResourceBundle().getText("week") + " " + currentWeekNumber + ', ' + month + ' ' + currentYear + ' - ' + this.getResourceBundle()
					.getText("from") + ' ';
			}
			var dd = oDate.getDate();
			if (dd < 10) {
				dd = '0' + dd;
			}
			var mm = oDate.getMonth() + 1;
			if (mm < 10) {
				mm = '0' + mm;
			}
			oString = oString.concat(dd + '/' + mm + ' ' + this.getResourceBundle().getText("to") + ' ');
			var oDateEnd = null;

			if (this.twoWeek) {
				oDateEnd = datetime.getLastDay(oDate, 2);
			} else {
				oDateEnd = datetime.getLastDay(oDate, 1);
			}
			var dd2 = oDateEnd.getDate();
			if (dd2 < 10) {
				dd2 = '0' + dd2;
			}
			var mm2 = oDateEnd.getMonth() + 1;
			if (mm2 < 10) {
				mm2 = '0' + mm2;
			}
			return oString + dd2 + '/' + mm2;
		},
		/*	periodFormat: function(oDate) {
				var currentWeekNumber = datetime.getWeek(oDate);
				var month = oDate.toLocaleString(sap.ui.getCore().getConfiguration().getLocale().toString(), {
					month: "long"
				});
				var currentYear = oDate.getFullYear();
				var oString = this.getResourceBundle().getText("week") + ' ' + currentWeekNumber + ',' + month + ' ' + currentYear + ' - ' + this.getResourceBundle()
					.getText("from") + ' ';
				var dd = oDate.getDate();
				var mm = oDate.getMonth() + 1;
				oString = oString.concat(dd + '/' + mm + ' ' + this.getResourceBundle().getText("to") + ' ');
				var oDateEnd = null;

				if (this.twoWeek) {
					oDateEnd = datetime.getLastDay(oDate, 2);
				} else {
					oDateEnd = datetime.getLastDay(oDate, 1);
				}
				var dd2 = oDateEnd.getDate();
				var mm2 = oDateEnd.getMonth() + 1;
				return oString + dd2 + '/' + mm2;
			},*/
		leaveFormatter: function(value) {
			if (value === null) {
				return '';
			}
			if (value.getDay() === 0 || value.getDay() === 6) {
				return "L";
			}
			return '';
		},
		bckgrndFormatter: function(value) {
		if(value){	
			if (value === null || value === '') {
				return 'NA';
			}
			if (value.getDay() === 0 || value.getDay() === 6) {
				return "L";
			}
			return "NA";
		}
		else{
			return "NA";
		}
		},
		statusFormatter: function(value) {
			if(value){
				if (value === null || value === '') {
					return 'NA';
				}
				return value;
			}
			else{
				return "NA";
			}
		},
		booleanNot: function(value) {
			if (value) {
				return false;
			}
			return true;
		},
		weekendFormatter: function(number) {
			if (number === null || number === 0 || number === '') {
				return '';
			}
			return number;

		},
		weekFormatter: function(number) {
			if (number === null || number === 0 || number === '') {
				return '';
			}
			return number;

		},
		numberFormatter: function(value) {
			var oLocale = sap.ui.getCore().getConfiguration().getLocale();
			var oFormatOptions = {
				minIntegerDigits: 1,
				maxIntegerDigits: 3,
				minFractionDigits: 0,
				maxFractionDigits: 2
			};
			var oFloatFormat = NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			var valueInNum = Number(value); //.toString();
			return oFloatFormat.format(valueInNum);
		},
		numberUnitFormatter: function(value, unit, km) {
			var oLocale = sap.ui.getCore().getConfiguration().getLocale();
			var oFormatOptions = {
				minIntegerDigits: 1,
				maxIntegerDigits: 3,
				minFractionDigits: 0,
				maxFractionDigits: 2
			};
			var oFloatFormat = NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			var valueInNum = Number(value); //.toString();
			var valueInNumFormat = oFloatFormat.format(valueInNum);
			switch (unit) {
				case 'HOURS':
					var unitFormat = 'H';
					break;
				case 'IPD':
					unitFormat = '';
					break;
				case 'KM':
					unitFormat = 'KM';
					break;
				case 'ABSENCE':
					unitFormat = 'H';
					break;
				default:
					unitFormat = '';
			}
			if (unit !== 'KM') {
				var valueUnit = valueInNumFormat + unitFormat;
			} else {
				var valueInKm = Number(km); //.toString();
				var valueInKmFormat = oFloatFormat.format(valueInKm);
				valueUnit = valueInNumFormat + "H " + valueInKmFormat + unitFormat;
			}
			return valueUnit;
		},
		numberConvertor: function(value) {
			if (!value) {
				return 0;
			}
			return value;
		},
		favIcon: function(fav) {
			if (fav) {
				return "sap-icon://favorite";
			} else {
				return "sap-icon://unfavorite";
			}
		},
		isFullDay : function(fullDay){
			if(!fullDay){
				return true;
			}
			else{
				return false;
			}
		},
			
		onMealPress:function(data){
			//if(oEvent.getSource().hasStyleClass("btnSelection")){
				if(data){
				//oEvent.getSource().removeStyleClass("btnSelection");
				this.getModel("dailyAllowCreateView").setProperty("/meal","M");
			}else{
				this.getModel("dailyAllowCreateView").setProperty("/meal","");
				//oEvent.getSource().addStyleClass("btnSelection");
			}
			return data;
		},
			
		onJourneyPress:function(data){
			//if(oEvent.getSource().hasStyleClass("btnSelection")){
				if(data){
				//oEvent.getSource().removeStyleClass("btnSelection");
				this.getModel("dailyAllowCreateView").setProperty("/travel","C");
			}else{
				this.getModel("dailyAllowCreateView").setProperty("/travel","");
				//oEvent.getSource().addStyleClass("btnSelection");
			}
			return data;
		},
			
		onTransportPress:function(data){
			//if(oEvent.getSource().hasStyleClass("btnSelection")){
				if(data){
				//oEvent.getSource().removeStyleClass("btnSelection");
				this.getModel("dailyAllowCreateView").setProperty("/transport","T");
			}else{
				this.getModel("dailyAllowCreateView").setProperty("/transport","");
				//oEvent.getSource().addStyleClass("btnSelection");
			}
			return data;
		},
		isDesktop: function(value, NotEditable) {
			if(NotEditable === true) {
				return false;
			}
			if (sap.ui.Device.system.desktop === true) {
				return true;
			} else {
				return false;
			}

		}

	};
});