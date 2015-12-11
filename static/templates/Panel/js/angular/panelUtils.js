angular.module('panelApp')
    .factory('dateUtils', function(){
        dateUtils = function () {
            this.getDatePickerFromDate = function(date){
                // FROM: 2015-12-11T20:00:00Z
                // TO: 01/01/2015
                return "" +
                ( ((this.getNumberFromString(date.getUTCMonth())+1)<10)?"0"+(this.getNumberFromString(date.getUTCMonth())+1):(this.getNumberFromString(date.getUTCMonth())+1) ) + "/" +
                ( ((this.getNumberFromString(date.getUTCDate()))<10)?"0"+(this.getNumberFromString(date.getUTCDate())):(this.getNumberFromString(date.getUTCDate())) ) + "/" +
                ( date.getUTCFullYear() );
            }
            this.getTimePickerFromDate = function(date){
                // FROM: 2015-12-11T20:00:00Z
                // TO: 20:00
                return "" +
                ( ((this.getNumberFromString(date.getUTCHours()))<10)?"0"+(this.getNumberFromString(date.getUTCHours())):(this.getNumberFromString(date.getUTCHours())) ) + ":" +
                ( ((this.getNumberFromString(date.getUTCMinutes()))<10)?"0"+(this.getNumberFromString(date.getUTCMinutes())):(this.getNumberFromString(date.getUTCMinutes())) )
            }
            this.getTimestampFromDateTimePicker = function (date, time) {
                // FROM 01/01/2015, 20:00
                // TO 2015-01-01T20:00:00Z
                y = (date.split("/"))[2];
                m = (date.split("/"))[0];
                d = (date.split("/"))[1];
                return ""+y+"-"+m+"-"+d+"T"+time+":00Z";
            }
            this.getPrettyDateFromTimestamp = function (timestamp) {
                // FROM: 2015-12-11T20:00:00Z
                // TO: 2015-12-11 20:00
                date = new Date(timestamp);
                return "" +
                ( ((this.getNumberFromString(date.getUTCMonth())+1)<10)?"0"+(this.getNumberFromString(date.getUTCMonth())+1):(this.getNumberFromString(date.getUTCMonth())+1) ) + "-" +
                ( ((this.getNumberFromString(date.getUTCDate()))<10)?"0"+(this.getNumberFromString(date.getUTCDate())):(this.getNumberFromString(date.getUTCDate())) ) + "-" +
                ( date.getUTCFullYear() ) + "  " +
                ( date.getUTCHours()<10?("0"+date.getUTCHours()):(date.getUTCHours()) ) + ":" +
                ( date.getUTCMinutes()<10?("0"+date.getUTCMinutes()):(date.getUTCMinutes()) )

            }
            this.getNumberFromString = function(number){
                return parseInt(number, 10);
            }
        }
        return new dateUtils();
    })
    .factory('absUtils', function() {
        absUtils = function () {
            this.getTypeNameFromNumber = function(number){
                typesNames = this.getTypesNames();
                switch (number){
                    case 0:
                        return typesNames[0];
                    case 1:
                        return typesNames[1];
                    case 2:
                        return typesNames[2];
                    default:
                        return "Unknown";
                }
            }
            this.getTypeNumberFromName = function(name){
                return (((this.getTypesNames()).indexOf(name)) !== -1) ? ((this.getTypesNames()).indexOf(name)) : "Unknown";
            }
            this.getTypesNames = function(){
                return ["Image without text", "Image with text", "Side image with text"];
            }
        }
        return new absUtils();
    })
    .factory('awardsUtils', function() {
        awardsUtils = function () {
            this.getTypeNameFromNumber = function(number){
                typesNames = this.getTypesNames();
                switch (number){
                    case 0:
                        return typesNames[0];
                    case 1:
                        return typesNames[1];
                    case 2:
                        return typesNames[2];
                    default:
                        return "Unknown";
                }
            }
            this.getTypeNumberFromName = function(name){
                return (((this.getTypesNames()).indexOf(name)) !== -1) ? ((this.getTypesNames()).indexOf(name)) : "Unknown";
            }
            this.getTypesNames = function(){
                return ["Text without image", "Text with full screen image", "Text with side image"];
            }
        }
        return new awardsUtils();
    })
