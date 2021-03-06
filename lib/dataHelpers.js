
///////////////////////////////////////////////////////////////////////////////
/**
 * Return true or false to indicate if a string is a valid looking email address
 */
exports.isValidEmail = function(email) {
    try {
        if (typeof(email) === "undefined") return false;
        var s = ("" + email).trim();
        if (s.length === 0) return false;
        
        var re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
        if (!re.test(s)) {
            return false;
        };
        
        return true;
    } catch (ex) {
        Alrtz.log("error", ""+ex);
        return false;
    }
}

///////////////////////////////////////////////////////////////////////////////
/**
 * Adjust a date to a given timezone offset. The timezone is given as hours
 * offset from UTC
 */
exports.toTZ = function(gmt, tz) {
    if (tz == 0.0) return gmt;
    
    var toAdjust = tz * 3600000;
    var newMS = gmt.valueOf() + toAdjust;
    
    // This new date's "UTC" time is now the adjusted version
    return new Date(newMS);
}


///////////////////////////////////////////////////////////////////////////////
/**
 * Get the name associated with a numerical timezone
 */
var TIMEZONE = [];

TIMEZONE[-12]="-12:00, Eniwetok, Kwajalein"
TIMEZONE[-11]="-11:00, Midway Island, Samoa"
TIMEZONE[-10]="-10:00, Hawaii"
TIMEZONE[-9]="- 9:00, Alaska"
TIMEZONE[-8]="- 8:00, US PACIFIC"
TIMEZONE[-7]="- 7:00, US MOUNTAIN"
TIMEZONE[-6]="- 6:00, US CENTRAL, Mexico City"
TIMEZONE[-5]="- 5:00, US EASTERN, Bogota, Lima"
TIMEZONE[-4]="- 4:00, Atlantic Time, Caracas, La Paz"
TIMEZONE[-3.5]="- 3:30, Newfoundland"
TIMEZONE[-3]="- 3:00, Brazil, Buenos Aires, Georgetown"
TIMEZONE[-2]="- 2:00, Mid-Atlantic"
TIMEZONE[-1]="- 1:00, Azores, Cape Verde Islands"
TIMEZONE[0]="+ 0:00, Western Europe Time, London"
TIMEZONE[1]="+ 1:00, Copenhagen, Madrid, Paris"
TIMEZONE[2]="+ 2:00, Kaliningrad, South Africa"
TIMEZONE[3]="+ 3:00, Baghdad, Moscow, St. Petersburg"
TIMEZONE[3.5]="+ 3:30, Tehran"
TIMEZONE[4]="+ 4:00, Abu Dhabi, Muscat, Baku, Tbilisi"
TIMEZONE[4.5]="+ 4:30, Kabul"
TIMEZONE[5]="+ 5:00, Islamabad, Karachi, Tashkent"
TIMEZONE[5.5]="+ 5:30, Bombay, Madras, New Delhi"
TIMEZONE[5.75]="+ 5:45, Kathmandu"
TIMEZONE[6]="+ 6:00, Almaty, Dhaka, Colombo"
TIMEZONE[7]="+ 7:00, Bangkok, Hanoi, Jakarta"
TIMEZONE[8]="+ 8:00, Beijing, Perth, Singapore"
TIMEZONE[9]="+ 9:00, Tokyo, Seoul, Yakutsk"
TIMEZONE[9.5]="+ 9:30, Adelaide, Darwin"
TIMEZONE[10]="+10:00, Eastern Australia, Vladivostok"
TIMEZONE[11]="+11:00, Solomon Islands, New Caledonia"
TIMEZONE[12]="+12:00, Auckland, Wellington"

exports.tzName = function(tz) {
    var r = TIMEZONE[tz];
    if (!r) return ""+tz+" UNUSUAL TIMEZONE!";
    return r;
}


///////////////////////////////////////////////////////////////////////////////
/**
 * Return a formatted date string for the given timezone, which is presumably
 * the user's preference they've set.
 */
 
var dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Probably not what you want
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthAbbrev = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function pad(n) {
    return n < 10 ? '0' + n: n;
}
function pad100(n) {
    return n < 100 ? '0' + pad(n) : n;
}


exports.formatDate = function(gmt, tz) {
    tz = tz || 0.0;
    
    if (typeof gmt !== 'object') {
        gmt = new Date(gmt);
        if (typeof gmt != 'object') return gmt;
    }
    
    // We have a date object
    
    // Need to adjust it by the given number of hours. Do this in the millisecond range
    var d = exports.toTZ(gmt, tz);
    
    // Wed Apr 2 18:23:04.344
    var out = dayNames[d.getUTCDay()] + " " + 
        d.getUTCDate() + " " +
        monthAbbrev[d.getUTCMonth()] + " " + 
        pad(d.getUTCHours()) + ":" +
        pad(d.getUTCMinutes()) + ":" +
        pad(d.getUTCSeconds()) + "." +
        pad100(d.getUTCMilliseconds());
        
    return out;        
}



///////////////////////////////////////////////////////////////////////////////
/**
 * Returns an object with the following things:
 *
 *      adjusted: Timezone adjusted date object
 *      dayAndMonth:  Wed 6 Jul
 *      dayName: Wed
 *      monthAbbrev: Jul
 *      time24: 08:39:23.000
 *      time12:  3:23:23 AM  << Not yet... >>
 *      full:  Wed Apr 2 18:23:04.344
 */
exports.formatDateAndTime = function(gmt, tz) {
    tz = parseFloat(tz) || 0.0;
    
    if (typeof gmt !== 'object') {
        gmt = new Date(gmt);
        if (typeof gmt != 'object') return null;
    }
    
    // We have a date object
    
    // Need to adjust it by the given number of hours. Do this in the millisecond range
    var d = exports.toTZ(gmt, tz);

    var out = {};
    
    out.adjusted = d;
    out.dayAndMonth = dayNames[d.getUTCDay()] + " " + 
        d.getUTCDate() + " " +
        monthAbbrev[d.getUTCMonth()];
        
    out.dayName = dayNames[d.getUTCDay()];
    out.monthAbbrev = monthAbbrev[d.getUTCMonth()] ;
    
    out.time24 =  pad(d.getUTCHours()) + ":" +
        pad(d.getUTCMinutes()) + ":" +
        pad(d.getUTCSeconds()) + "." +
        pad100(d.getUTCMilliseconds());
    //out.time12 = 
    // Wed Apr 2 18:23:04.344
    out.full = dayNames[d.getUTCDay()] + " " + 
        d.getUTCDate() + " " +
        monthAbbrev[d.getUTCMonth()] + " " + 
        pad(d.getUTCHours()) + ":" +
        pad(d.getUTCMinutes()) + ":" +
        pad(d.getUTCSeconds()) + "." +
        pad100(d.getUTCMilliseconds());
        
    return out;        
}

///////////////////////////////////////////////////////////////////////////////
/**
 * Test code
 */

if (!module.parent) {
    var gmt = new Date(Date.UTC(2011, 6, 15, 12, 1, 2, 3));
    
    console.log(gmt);
    debugger
    console.log(exports.formatDate(gmt)+"\n");
    
    for (var tz = -12.0; tz < 12.0; tz += 1.0) {
        console.log(exports.formatDate(gmt,tz));        
    }
    
    console.log(exports.formatDateAndTime(gmt,0.0));
    console.log(exports.formatDateAndTime(gmt,"-8.0"));
    console.log(exports.formatDateAndTime(gmt,2.0));
}