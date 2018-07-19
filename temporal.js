/*!
 * Temporal JavaScript library v1.2.4
 * (C) David Timovski - https://www.davidtimovski.com/MyProjects/Temporal
 */

(function () {
    'use strict';
    
    function Temporal(date, format) {
        var self, dateSeparatorRegex, timeSeparatorRegex, msSeparatorRegex, formatRegexArray, formatRegex, formatArray, tokenCount, match, newDate, 
            tokensRegex, tokens, bracketsRegex, formatWithoutBrackets, tokenWithoutBrackets, tokenObj, value, valueInteger, monthIndex, hours, i, j;

        self = this;
        self._isTemporal = true;
        self._msInAYear = 31532400000;
        self._msInAMonth = 2592000000;
        self._msInADay = 86400000;
        self._msInAnHour = 3600000;
        self._msInAMinute = 60000;
        self._msInASecond = 1000;
        self._months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        self._weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        self._throwDateCouldNotBeParsedError = function () {
            throw 'Temporal: The "' + date + '" date string could not be parsed. You may need to specify the exact format in the second parameter.';
        };
        self._matchableTokens = [
            { 
                name: 'y', 
                set: function (value, date) {
                    date.setFullYear(parseInt(value, 10));
                }
            },
            { 
                name: 'yy', 
                set: function (value, date) {
                    date.setFullYear(parseInt(value, 10));
                }
            },
            { 
                name: 'yyy', 
                set: function (value, date) {
                    date.setFullYear(parseInt(value, 10));
                }
            },
            { 
                name: 'yyyy', 
                set: function (value, date) {
                    date.setFullYear(parseInt(value, 10));
                }
            },
            { 
                name: 'M', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 1 || valueInteger > 12) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setMonth(valueInteger - 1);
                }
            },
            { 
                name: 'MM', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 1 || valueInteger > 12) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setMonth(valueInteger - 1);
                }
            },
            { 
                name: 'MMM', 
                set: function (value, date) {
                    monthIndex = self._months.findIndex(function (month) {
                        return month.indexOf(value) > -1;
                    });
                    if (monthIndex === -1) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setMonth(monthIndex);
                }
            },
            { 
                name: 'd', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 1 || valueInteger > 31) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setDate(valueInteger);
                }
            },
            { 
                name: 'dd', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 1 || valueInteger > 31) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setDate(valueInteger);
                }
            },
            { 
                name: 'H', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 0 || valueInteger > 23) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setHours(valueInteger);
                } 
            },
            { 
                name: 'HH', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 0 || valueInteger > 23) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setHours(valueInteger);
                } 
            },
            { 
                name: 'h', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 1 || valueInteger > 12) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setHours(valueInteger);
                } 
            },
            { 
                name: 'hh', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 1 || valueInteger > 12) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setHours(valueInteger);
                } 
            },
            { 
                name: 'm', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 0 || valueInteger > 59) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setMinutes(valueInteger);
                } 
            },
            { 
                name: 'mm', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 0 || valueInteger > 59) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setMinutes(valueInteger);
                } 
            },
            { 
                name: 's', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 0 || valueInteger > 59) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setSeconds(valueInteger);
                } 
            },
            { 
                name: 'ss', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 0 || valueInteger > 59) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setSeconds(valueInteger);
                } 
            },
            { 
                name: 'f', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 0 || valueInteger > 9) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setMilliseconds(valueInteger * 100);
                } 
            },
            { 
                name: 'ff', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 0 || valueInteger > 99) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setMilliseconds(valueInteger * 10);
                } 
            },
            { 
                name: 'fff', 
                set: function (value, date) {
                    valueInteger = parseInt(value, 10);
                    if (valueInteger < 0 || valueInteger > 999) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    date.setMilliseconds(valueInteger);
                } 
            },
            { 
                name: 't', 
                set: function (value, date) {
                    if (value.toUpperCase().match(/A|P/g) === null) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    hours = date.getHours();
                    hours = hours === 12 ? 0 : hours;
                    date.setHours((value.toUpperCase() === 'A') ? hours : 12 + hours);
                } 
            },
            { 
                name: 'tt', 
                set: function (value, date) {
                    if (value.toUpperCase().match(/AM|PM/g) === null) {
                        self._throwDateCouldNotBeParsedError();
                    }
                    hours = date.getHours();
                    hours = hours === 12 ? 0 : hours;
                    date.setHours((value.toUpperCase() === 'AM') ? hours : 12 + hours);
                } 
            }
        ];

        if (date === undefined) {
            self._date = new Date();
        } else if (date._isTemporal) { // If temporal object
            self._date = date._date;
        } else if (typeof date === 'string' || date instanceof String) { // If string
            if (format === undefined) {

                dateSeparatorRegex = '(-|\\.|\\/)';
                timeSeparatorRegex = ':';
                msSeparatorRegex = '\\.';

                formatRegexArray = [
                    '^' + '\\d{4}', // yyyy
                    dateSeparatorRegex + '\\d{2}', // MM
                    dateSeparatorRegex + '\\d{2}', // dd
                    '(T| )' + '\\d{2}', // HH
                    timeSeparatorRegex + '\\d{2}', // mm
                    timeSeparatorRegex + '\\d{2}', // ss
                    msSeparatorRegex + '\\d{3}' // fff
                ];

                formatRegex = formatRegexArray.join('');
                formatArray = ['[yyyy]', '[MM]', '[dd]', '[HH]', '[mm]', '[ss]', '[fff]'];

                for (i = 0, tokenCount = formatRegexArray.length; i < tokenCount; i++)
                {
                    match = date.match(new RegExp(formatRegex));
                    if (match === null || match[0].length !== date.trim().length) {
                        formatRegexArray.pop();
                        formatRegex = formatRegexArray.join('');
                        formatArray.pop();
                    } else {
                        break;
                    }
                }

                if (formatArray.length)
                    format = formatArray.join(' ');
                else
                    self._throwDateCouldNotBeParsedError();
            }

            newDate = new Date(1970, 0, 1, 0, 0, 0, 0);
            tokensRegex = /(\[y\]|\[yy\]|\[yyy\]|\[yyyy\]|\[M\]|\[MM\]|\[MMM\]|\[d\]|\[dd\]|\[H\]|\[HH\]|\[h\]|\[hh\]|\[mm\]|\[m\]|\[ss\]|\[s\]|\[f\]|\[ff\]|\[fff\]|\[t\]|\[tt\])/g;
            bracketsRegex = /\[|\]/g;
            tokens = format.match(tokensRegex);

            if (tokens) {
                formatWithoutBrackets = format.replace(bracketsRegex, '');

                for (i = 0; i < tokens.length; i++) {
                    tokenWithoutBrackets = tokens[i].replace(bracketsRegex, '');
                    value = date.substr(formatWithoutBrackets.indexOf(tokenWithoutBrackets), tokenWithoutBrackets.length);

                    for (j = 0; j < self._matchableTokens.length; j++) {
                        if (self._matchableTokens[j].name === tokenWithoutBrackets) {
                            tokenObj = self._matchableTokens[j];
                            break;
                        }
                    }
                    tokenObj.set(value, newDate);
                }
            }

            self._date = newDate;
        } else if (Object.prototype.toString.call(date) === '[object Date]') { // If date
            self._date = date;
        } else if (!isNaN(parseFloat(date)) && isFinite(date)) { // If number
            date = new Date(date);

            if (isNaN(date.getTime())) {
                throw 'Temporal: Parameter could not be parsed - when invoking temporal() with a number make sure you specify the time in milliseconds';
            }
            self._date = date;
        } else if (date.constructor === Array) { // If array
            date[0] = date[0] || 0;
            date[1] = date[1] || 0;
            date[2] = date[2] || 1;
            date[3] = date[3] || 0;
            date[4] = date[4] || 0;
            date[5] = date[5] || 0;
            date[6] = date[6] || 0;

            newDate = new Date(date[0], date[1], date[2], date[3], date[4], date[5], date[6]);
            newDate.setFullYear(date[0]);
            self._date = newDate;
        } else {
            throw 'Temporal: An invalid parameter was sent to the temporal() function - valid arugments for the temporal() function include: date string, number in milliseconds, array, JavaScript Date() object and temporal() object';
        }
    }

    // Properties
    Temporal.prototype.version = '1.2.2';

    // Methods
    Temporal.prototype.format = function (format) {
        var self = this;
        var tokensRegex = /(\[y\]|\[yy\]|\[yyy\]|\[yyyy\]|\[M\]|\[MM\]|\[MMM\]|\[MMMM\]|\[d\]|\[dd\]|\[ddd\]|\[dddd\]|\[do\]|\[H\]|\[HH\]|\[h\]|\[hh\]|\[mm\]|\[m\]|\[ss\]|\[s\]|\[f\]|\[ff\]|\[fff\]|\[t\]|\[tt\])/g;
        var termsAssocArrayObj = {};
        var year, month, day, hours, minutes, seconds, milliseconds, segment, tokens, i;

        function formatDatetimeSegment(token) {
            switch (token) {
                case '[y]':
                    year = self._date.getFullYear().toString();
                    return year.substr(year.length - 1);
                case '[yy]':
                    year = '0' + self._date.getFullYear();
                    return year.substr(year.length - 2);
                case '[yyy]':
                    year = '00' + self._date.getFullYear();
                    return year.substr(year.length - 3);
                case '[yyyy]':
                    year = '000' + self._date.getFullYear();
                    return year.substr(year.length - 4);
                case '[M]':
                    return (self._date.getMonth() + 1);
                case '[MM]':
                    month = '0' + (self._date.getMonth() + 1);
                    return month.substr(month.length - 2);
                case '[MMM]':
                    return self.monthName(self._date.getMonth(), 'short');
                case '[MMMM]':
                    return self.monthName(self._date.getMonth());
                case '[d]':
                    return self._date.getDate();
                case '[dd]':
                    day = '0' + self._date.getDate();
                    return day.substr(day.length - 2);
                case '[do]':
                    day = self._date.getDate();

                    if (day > 3 && day < 21) {
                        return day + 'th';
                    }
                    switch (day % 10) {
                        case 1:
                            return day + 'st';
                        case 2:
                            return day + 'nd';
                        case 3:
                            return day + 'rd';
                        default:
                            return day + 'th';
                    }
                case '[ddd]':
                    return self.weekdayName(self._date.getDay(), 'short');
                case '[dddd]':
                    return self.weekdayName(self._date.getDay());
                case '[H]':
                    return self._date.getHours();
                case '[HH]':
                    hours = '0' + self._date.getHours();
                    return hours.substr(hours.length - 2);
                case '[h]':
                    hours = self._date.getHours() % 12;
                    return hours || 12;
                case '[hh]':
                    hours = self._date.getHours() % 12;
                    hours = (hours) ? ('0' + hours) : '12';
                    return hours.substr(hours.length - 2);
                case '[m]':
                    return self._date.getMinutes();
                case '[mm]':
                    minutes = '0' + self._date.getMinutes();
                    return minutes.substr(minutes.length - 2);
                case '[s]':
                    return self._date.getSeconds();
                case '[ss]':
                    seconds = '0' + self._date.getSeconds();
                    return seconds.substr(seconds.length - 2);
                case '[f]':
                    milliseconds = self._date.getMilliseconds();
                    return Math.floor(milliseconds / 100);
                case '[ff]':
                    milliseconds = '0' + Math.floor(self._date.getMilliseconds() / 10);
                    return milliseconds.substr(milliseconds.length - 2);
                case '[fff]':
                    milliseconds = '00' + self._date.getMilliseconds();
                    return milliseconds.substr(milliseconds.length - 3);
                case '[t]':
                    hours = self._date.getHours();
                    return hours >= 12 ? 'P' : 'A';
                case '[tt]':
                    hours = self._date.getHours();
                    return hours >= 12 ? 'PM' : 'AM';
                default:
                    return '';
            }
        };

        if (format === undefined || format === null || typeof format == 'string' || format instanceof String) {
            if (format === undefined || format === null) {
                format = '[dddd], [MMMM] [dd], [yyyy]';
            }

            tokens = format.match(tokensRegex);

            if (tokens) {
                for (i = 0; i < tokens.length; i++) {
                    termsAssocArrayObj[tokens[i]] = formatDatetimeSegment(tokens[i]);
                }
                for (segment in termsAssocArrayObj) {
                    format = format.split(segment).join(termsAssocArrayObj[segment]);
                }
            }

            return format;
        }

        throw 'Temporal: An invalid format parameter was sent to the format() function';
    };

    Temporal.prototype.toJSDate = function () {
        return this._date;
    };

    Temporal.prototype.toArray = function () {
        return [
            this._date.getFullYear(),
            this._date.getMonth(),
            this._date.getDate(),
            this._date.getHours(),
            this._date.getMinutes(),
            this._date.getSeconds(),
            this._date.getMilliseconds()
        ];
    };

    Temporal.prototype.toMilliseconds = function () {
        return this._date.getTime();
    };

    Temporal.prototype.difference = function (otherDate) {
        otherDate = (otherDate === undefined || otherDate === null) ? new Temporal() : (otherDate._isTemporal) ? otherDate : new Temporal(otherDate);
        return (this._date.getTime() - otherDate._date.getTime());
    };

    Temporal.prototype.isBefore = function (otherDate, precision) {
        otherDate = (otherDate === undefined || otherDate === null) ? new Temporal() : (otherDate._isTemporal) ? otherDate : new Temporal(otherDate);
        precision = precision || 'second';

        switch (precision) {
            case 'year':
                return ((this._date.getTime() - otherDate._date.getTime()) <= -this._msInAYear);
            case 'month':
                return ((this._date.getTime() - otherDate._date.getTime()) <= -this._msInAMonth);
            case 'day':
                return ((this._date.getTime() - otherDate._date.getTime()) <= -this._msInADay);
            case 'hour':
                return ((this._date.getTime() - otherDate._date.getTime()) <= -this._msInAnHour);
            case 'minute':
                return ((this._date.getTime() - otherDate._date.getTime()) <= -this._msInAMinute);
            case 'second':
                return ((this._date.getTime() - otherDate._date.getTime()) <= -this._msInASecond);
            default:
                throw 'Temporal: An invalid precision parameter was sent to the isBefore() function';
        }
    };

    Temporal.prototype.isAfter = function (otherDate, precision) {
        otherDate = (otherDate === undefined || otherDate === null) ? new Temporal() : (otherDate._isTemporal) ? otherDate : new Temporal(otherDate);
        precision = precision || 'second';

        switch (precision) {
            case 'year':
                return ((this._date.getTime() - otherDate._date.getTime()) >= this._msInAYear);
            case 'month':
                return ((this._date.getTime() - otherDate._date.getTime()) >= this._msInAMonth);
            case 'day':
                return ((this._date.getTime() - otherDate._date.getTime()) >= this._msInADay);
            case 'hour':
                return ((this._date.getTime() - otherDate._date.getTime()) >= this._msInAnHour);
            case 'minute':
                return ((this._date.getTime() - otherDate._date.getTime()) >= this._msInAMinute);
            case 'second':
                return ((this._date.getTime() - otherDate._date.getTime()) >= this._msInASecond);
            default:
                throw 'Temporal: An invalid precision parameter was sent to the isAfter() function';
        }
    };

    Temporal.prototype.relativeTimeString = function (precision) {
        var years, days, hours, minutes, seconds, lastTerm, fullString;
        var temporalArray = [];
        var now = new Date();
        var difference = now.getTime() - this._date.getTime();
        precision = precision || 'second';

        if (Math.abs(difference) < 1000) {
            return 'just now';
        }

        years = Math.abs(Math.floor(difference / this._msInAYear));
        if (years > 0) {
            temporalArray.push(years + (years > 1 ? ' years' : ' year'));
        }

		if (precision === 'day' || precision === 'hour' || precision === 'minute' || precision === 'second') {
	        difference = difference % this._msInAYear;
	        days = Math.abs(Math.floor(difference / this._msInADay));
	        if (days > 0) {
	            temporalArray.push(days + (days > 1 ? ' days' : ' day'));
	        }
			
			if (precision === 'hour' || precision === 'minute' || precision === 'second') {
		        difference = difference % this._msInADay;
		        hours = Math.abs(Math.floor(difference / this._msInAnHour));
		        if (hours > 0) {
		            temporalArray.push(hours + (hours > 1 ? ' hours' : ' hour'));
		        }
				
				if (precision === 'minute' || precision === 'second') {
		            difference = difference % this._msInAnHour;
		            minutes = Math.abs(Math.floor(difference / this._msInAMinute));
		            if (minutes > 0) {
		                temporalArray.push(minutes + (minutes > 1 ? ' minutes' : ' minute'));
		            }

		            if (precision === 'second') {
		                difference = difference % this._msInAMinute;
		                seconds = Math.abs(Math.floor(difference / this._msInASecond));
		                if (seconds > 0) {
		                    temporalArray.push(seconds + (seconds > 1 ? ' seconds' : ' second'));
		                }
		            }
		        }
			}
		}

        if (temporalArray.length === 0) {
            return 'just now';
        } else if (temporalArray.length === 1) {
            fullString = temporalArray[0];
        } else {
            lastTerm = temporalArray.pop();
            fullString = temporalArray.join(', ') + ' and ' + lastTerm;
        }

        if (difference < 0) {
            return 'in ' + fullString;
        }
        return fullString + ' ago';
    };

    Temporal.prototype.age = function () {
        var now = new Date();
        var yearsDiff = now.getFullYear() - this._date.getFullYear();
        var monthsDiff = now.getMonth() - this._date.getMonth();
        var daysDiff = now.getDate() - this._date.getDate();

        if (monthsDiff < 0) {
            return yearsDiff - 1;
        }
        if (monthsDiff > 0) {
            return yearsDiff;
        }
        if (daysDiff >= 0) {
            return yearsDiff;
        }

        return yearsDiff - 1;
    };

    Temporal.prototype.tomorrow = function () {
        this._date.setDate(this._date.getDate() + 1);
        return this;
    };

    Temporal.prototype.yesterday = function () {
        this._date.setDate(this._date.getDate() - 1);
        return this;
    };

    Temporal.prototype.monthName = function (month, length) {
        var monthName;

        if (month === undefined) {
            month = this._date.getMonth();
        } else if (month === 'short') {
            length = month;
            month = this._date.getMonth();
        } else {
            month = parseInt(month, 10);
        }

        monthName = this._months[month];
        if (length === 'short') {
            monthName = monthName.substring(0, 3);
        }

        return monthName;
    };

    Temporal.prototype.weekdayName = function (weekday, length) {
        var weekdayName;

        if (weekday === undefined) {
            weekday = this._date.getDay();
        } else if (weekday === 'short') {
            length = weekday;
            weekday = this._date.getDay();
        } else {
            weekday = parseInt(weekday, 10);
        }

        weekdayName = this._weekdays[weekday];
        if (length === 'short') {
            weekdayName = weekdayName.substring(0, 3);
        }

        return weekdayName;
    };

    Temporal.prototype.isLeapYear = function (year) {
        year = (year === undefined) ? this._date.getFullYear() : year;

        if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
            return true;
        }
        return false;
    };

    Temporal.prototype.timeZoneOffset = function () {
        return this._date.getTimezoneOffset();
    };

    Temporal.prototype.year = function () {
        return this._date.getFullYear();
    };

    Temporal.prototype.month = function () {
        return this._date.getMonth();
    };

    Temporal.prototype.day = function () {
        return this._date.getDate();
    };

    Temporal.prototype.hour = function () {
        return this._date.getHours();
    };

    Temporal.prototype.minute = function () {
        return this._date.getMinutes();
    };

    Temporal.prototype.second = function () {
        return this._date.getSeconds();
    };

    Temporal.prototype.millisecond = function () {
        return this._date.getMilliseconds();
    };

    Temporal.prototype.years = function (year) {
        year = year || this._date.getFullYear();
        this._date.setFullYear(parseInt(year, 10));
        return this;
    };

    Temporal.prototype.months = function (month) {
        month = month || this._date.getMonth();
        this._date.setMonth(parseInt(month, 10));
        return this;
    };

    Temporal.prototype.days = function (day) {
        day = day || this._date.getDate();
        this._date.setDate(parseInt(day, 10));
        return this;
    };

    Temporal.prototype.hours = function (hour) {
        hour = hour || this._date.getHours();
        this._date.setHours(parseInt(hour, 10));
        return this;
    };

    Temporal.prototype.minutes = function (minute) {
        minute = minute || this._date.getMinutes();
        this._date.setMinutes(parseInt(minute, 10));
        return this;
    };

    Temporal.prototype.seconds = function (second) {
        second = second || this._date.getSeconds();
        this._date.setSeconds(parseInt(second, 10));
        return this;
    };

    Temporal.prototype.milliseconds = function (millisecond) {
        millisecond = millisecond || this._date.getMilliseconds();
        this._date.setMilliseconds(parseInt(millisecond, 10));
        return this;
    };

    Temporal.prototype.addYears = function (years) {
        this._date.setFullYear(this._date.getFullYear() + parseInt(years, 10));
        return this;
    };

    Temporal.prototype.addMonths = function (months) {
        this._date.setMonth(this._date.getMonth() + parseInt(months, 10));
        return this;
    };

    Temporal.prototype.addWeeks = function (weeks) {
        this._date.setDate(this._date.getDate() + (parseInt(weeks, 10) * 7));
        return this;
    };

    Temporal.prototype.addDays = function (days) {
        this._date.setDate(this._date.getDate() + parseInt(days, 10));
        return this;
    };

    Temporal.prototype.addHours = function (hours) {
        this._date.setHours(this._date.getHours() + parseInt(hours, 10));
        return this;
    };

    Temporal.prototype.addMinutes = function (minutes) {
        this._date.setMinutes(this._date.getMinutes() + parseInt(minutes, 10));
        return this;
    };

    Temporal.prototype.addSeconds = function (seconds) {
        this._date.setSeconds(this._date.getSeconds() + parseInt(seconds, 10));
        return this;
    };

    Temporal.prototype.addMilliseconds = function (milliseconds) {
        this._date.setMilliseconds(this._date.getMilliseconds() + parseInt(milliseconds, 10));
        return this;
    };

    Temporal.prototype.subtractYears = function (years) {
        this._date.setFullYear(this._date.getFullYear() - parseInt(years, 10));
        return this;
    };

    Temporal.prototype.subtractMonths = function (months) {
        this._date.setMonth(this._date.getMonth() - parseInt(months, 10));
        return this;
    };

    Temporal.prototype.subtractWeeks = function (weeks) {
        this._date.setDate(this._date.getDate() - (parseInt(weeks, 10) * 7));
        return this;
    };

    Temporal.prototype.subtractDays = function (days) {
        this._date.setDate(this._date.getDate() - parseInt(days, 10));
        return this;
    };

    Temporal.prototype.subtractHours = function (hours) {
        this._date.setHours(this._date.getHours() - parseInt(hours, 10));
        return this;
    };

    Temporal.prototype.subtractMinutes = function (minutes) {
        this._date.setMinutes(this._date.getMinutes() - parseInt(minutes, 10));
        return this;
    };

    Temporal.prototype.subtractSeconds = function (seconds) {
        this._date.setSeconds(this._date.getSeconds() - parseInt(seconds, 10));
        return this;
    };

    Temporal.prototype.subtractMilliseconds = function (milliseconds) {
        this._date.setMilliseconds(this._date.getMilliseconds() - parseInt(milliseconds, 10));
        return this;
    };

    var temporal = function (date, format) {
        return new Temporal(date, format);
    };

    if (!window.temporal) {
        window.temporal = temporal;
    }
})();