sap.ui.define([
		"sap/ui/core/format/NumberFormat"], function(NumberFormat) {
	"use strict";
	return {

		getMonday: function(cDate) {
			cDate = new Date(cDate.getUTCFullYear(), cDate.getMonth(), cDate.getDate());
			var day = cDate.getDay(),
				diff = cDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
			return new Date(cDate.setDate(diff));
		},
		getLastWeek: function(cDate) {
			var lastWeek = new Date(cDate.getUTCFullYear(), cDate.getMonth(), cDate.getDate() - 7);
			return lastWeek;
		},
		getLastMonday: function(cDate) {
			cDate = new Date(cDate.getUTCFullYear(), cDate.getMonth(), cDate.getDate());
			var day = cDate.getDay(),
				diff = cDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
			return new Date(cDate.setDate(diff));
		},

		getLastDay: function(cDate, noOfWeeks) {

			var oDate = new Date(cDate.getUTCFullYear(), cDate.getMonth(), cDate.getDate());
			var numberOfDaysToAdd = 7 * noOfWeeks;
			return new Date(oDate.setDate(cDate.getDate() + numberOfDaysToAdd - 1));
		},

		getWeek: function(cDate) {
			
			var oDate = new Date(cDate.getUTCFullYear(), cDate.getMonth(), cDate.getDate());
			oDate.setHours(0, 0, 0, 0);
			// Thursday in current week decides the year.
			oDate.setDate(oDate.getDate() + 3 - (oDate.getDay() + 6) % 7);
			// January 4 is always in week 1.
			var week1 = new Date(oDate.getUTCFullYear(), 0, 4);
			// Adjust to Thursday in week 1 and count number of weeks from date to week1.
			return 1 + Math.round(((oDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);

		},
		getTodayDate: function(cDate) {
			var oDate = new Date(cDate.getUTCFullYear(), cDate.getMonth(), cDate.getDate());
			return oDate;
		},
		getTodayDateGMT : function(cDate){
			
		return	new Date(cDate.valueOf() + cDate.getTimezoneOffset() * 60000);
		},
		getFullDayName: function(cDayName,resourceBundle) {
			var fullDayName = null;
			if (resourceBundle.getText("mon") === cDayName ) {
				fullDayName = resourceBundle.getText("mon_fd");
			} else if (resourceBundle.getText("tue") === cDayName ) {
				fullDayName = resourceBundle.getText("tue_fd");
			} else if (resourceBundle.getText("wed") === cDayName ) {
				fullDayName = resourceBundle.getText("wed_fd");
			} else if (resourceBundle.getText("thr") === cDayName ) {
				fullDayName = resourceBundle.getText("thr_fd");
			} else if (resourceBundle.getText("fri") === cDayName ) {
				fullDayName = resourceBundle.getText("fri_fd");
			} else if (resourceBundle.getText("sat") === cDayName ) {
				fullDayName = resourceBundle.getText("sat_fd");
			} else if (resourceBundle.getText("sun") === cDayName ) {
				fullDayName = resourceBundle.getText("sun_fd");
			} else {
				fullDayName = "";
			}
			return fullDayName;
		},

		timeToDecimal: function(t) {
				var numFormat= NumberFormat.getInstance({maxFractionDigits:2});
			var arr = t.split(':');
			return numFormat.format(parseInt(arr[0], 10) + '.' + parseInt((arr[1] / 6) * 10, 10));
		},
		timeToMilliSec: function(time) { // format = 13:00 PM
			var arr = time.split(':');
			var arr2 = arr[1].split(' ');

			var hour = Number(arr[0]);
			var min = Number(arr2[0]);

		/*	if (hour < 12 && arr2[1] === 'PM')
				hour = hour + 12;*/
			var date = new Date();
			var vDate= new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getDate(),hour,min,0);
			//var offset = date.getTimezoneOffset() * 60000;
			return  vDate.getTime();//(hour * 60 + min) * 60000 + offset;

		},
		getCalenderData: function(startDate, noOfWeek, resourceBundle) {
			var monday = this.getMonday(startDate);
			var sunday = this.getLastDay(monday, noOfWeek);
			var oCalendarData = {
				StartDate: new Date(monday.getTime()),
				data: []
			};
			var weekday = [resourceBundle.getText("tablleColTitleSun"), resourceBundle.getText("tablleColTitleMon"), resourceBundle
				.getText("tablleColTitleTues"), resourceBundle.getText("tablleColTitleWed"), resourceBundle.getText(
					"tablleColTitleThru"), resourceBundle.getText("tablleColTitleFri"), resourceBundle.getText(
					"tablleColTitleSat")
			];
			/*	var idata = {
					ColumnTxt1: resourceBundle.getText("tableNameColumnTitleEmpName"),
					ColumnTxt2: '...',
					ComboVisible: true,
					width: '180px',
					cssClass: 'tableColumnE',
					Date: new Date(monday.getTime())
				};
				oCalendarData.data.push(idata);*/
			if (noOfWeek === 2) {

				for (var d = monday; d <= sunday; d.setDate(d.getDate() + 1)) {
					var cDate = d;
					var data = {
						ColumnTxt1: weekday[d.getDay()],
						ColumnTxt2: '  ' + d.getDate(),
					//	width: "6%",
						cssClass: 'tableColumn',
						ComboVisible: false,
						Date: new Date(cDate.getTime())
					};
					oCalendarData.data.push(data);
				}
			} else {

				var friday = this.getTodayDate(new Date());
				friday.setTime(sunday.getTime() - (2 * 24 * 60 * 60 * 1000));
				for (var d3 = monday; d3 <= friday; d3.setDate(d3.getDate() + 1)) {
					var cDate3 = d3;
					var data3 = {
						ColumnTxt1: weekday[d3.getDay()],
						ColumnTxt2: '  ' + d3.getDate(),
						width: "13.13%",
						cssClass: 'tableColumn',
						ComboVisible: false,
						Date: new Date(cDate3.getTime())
					};
					oCalendarData.data.push(data3);
				}

				var saturday = this.getTodayDate(new Date());
				saturday.setTime(sunday.getTime() - (1 * 24 * 60 * 60 * 1000));
				for (var d2 = saturday; d2 <= sunday; d2.setDate(d2.getDate() + 1)) {
					var cDate2 = d2;
					var data2 = {
						ColumnTxt1: weekday[d2.getDay()],
						ColumnTxt2: '  ' + d2.getDate(),
						width: "13.13%",
						cssClass: 'tableColumn',
						ComboVisible: false,
						Date: new Date(cDate2.getTime())
					};
					oCalendarData.data.push(data2);
				}
			}
			return oCalendarData;
		}

	};

});