'use strict';

var calendar = angular.module('primaryModule');

calendar.factory('calService', function($filter, $translate) {
    var lunarInfo = new Array(
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
        0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0);
    var Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    var Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    var mEng = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var now = new Date();
    var SY = now.getFullYear();
    var SM = now.getMonth()+1;
    var SME = mEng[now.getMonth()];
    var SD = now.getDate();

    //==== 传回农历 y年的总天数
    function lYearDays(y) {
        var i, sum = 348;
        for (i = 0x8000; i > 0x8; i >>= 1) {
            sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
        }
        return (sum + leapDays(y));
    }

    //==== 传回农历 y年闰月的天数
    function leapDays(y) {
        if (leapMonth(y)) {
            return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
        } else {
            return (0);
        }
    }

    //==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
    function leapMonth(y) {
        return (lunarInfo[y - 1900] & 0xf);
    }

    //====================================== 传回农历 y年m月的总天数
    function monthDays(y, m) {
        return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
    }

    //==== 算出农历, 传入日期物件, 传回农历日期物件
    // 该物件属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
    function Lunar(objDate) {
        var i, leap = 0,
            temp = 0,
            baseDate = new Date(1900, 0, 31),
            offset = (objDate - baseDate) / 86400000;

        this.dayCyl = offset + 40
        this.monCyl = 14

        for (i = 1900; i < 2050 && offset > 0; i++) {
            temp = lYearDays(i)
            offset -= temp
            this.monCyl += 12
        }
        if (offset < 0) {
            offset += temp;
            i--;
            this.monCyl -= 12;
        }

        this.year = i
        this.yearCyl = i - 1864

        leap = leapMonth(i) //闰哪个月
        this.isLeap = false

        for (i = 1; i < 13 && offset > 0; i++) {
            //闰月
            if (leap > 0 && i === (leap + 1) && this.isLeap === false) {
                --i;
                this.isLeap = true;
                temp = leapDays(this.year);
            } else {
                temp = monthDays(this.year, i);
            }

            //解除闰月
            if (this.isLeap === true && i === (leap + 1)) {
                this.isLeap = false;
            }

            offset -= temp
            if (this.isLeap === false) {
                this.monCyl++;
            }
        };

        if (offset === 0 && leap > 0 && i === leap + 1)
            if (this.isLeap) {
                this.isLeap = false;
            } else {
                this.isLeap = true;
                --i;
                --this.monCyl;
            }

        if (offset < 0) {
            offset += temp;
            --i;
            --this.monCyl;
        }

        this.month = i
        this.day = offset + 1
    }

    //-- 农历
    function cDay(m, d) {
        var nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
        var nStr2 = new Array('初', '十', '廿', '卅', '　');
        var s = '';
        /* getMonth
        if (m > 10) {
        s = '十' + nStr1[m - 10]
        } else {
        s = nStr1[m]
        }
        s += '月'
        */
        switch (d) {
            case 10:
                s += '初十';
                break;
            case 20:
                s += '二十';
                break;
            case 30:
                s += '三十';
                break;
            default:
                s += nStr2[Math.floor(d / 10)];
                s += nStr1[d % 10];
                break;
        }
        return (s);
    };

    // 获取农历 月/日
    function getSolarDay(year, month, day) {
        var sDObj = new Date(year, month, day);
        var lDObj = new Lunar(sDObj);
        //农历BB'+(cld[d].isLeap?'闰 ':' ')+cld[d].lMonth+' 月 '+cld[d].lDay+' 日
        return cDay(lDObj.month, lDObj.day);
    }

    // 获取农历 天干地支年
    function getSolarYear(year) {
        var tyear = Gan[(year - 3) % 10 - 1]; // 天干
        var dyear = Zhi[(year - 3) % 12 - 1]; // 地支
        return tyear + ' ' + dyear;
    };

    // 获取C值
    function getC(year) {
        var _year = Math.floor(year / 100) + 1;
        var C;

        switch (_year) {
            case 20:
                C = 4.6295;
                break;
            case 21:
                C = 3.87;
                break;
            case 22:
                C = 4.15;
                break;
            default:
                C = 3.87;
        }
        return C;
    };

    // 获取立春日
    function getSpringDay(year) {
        var Y = year % 100,
            D = 0.2422,
            C = getC(year),
            L = (Y - 1) / 4,
            springDay = 0;
        springDay = Math.floor(Y * D + C) - Math.floor((Y - 1) / 4);
        return springDay;
    };

    // 获取生肖
    function getZodiac(year, month, day) {
        var zodiac = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
            myPos = (year - 1900) % 12,
            myZodiac = zodiac[myPos],
            springDay = getSpringDay(year),
            _myPos;

        switch (month) {
            case 1:
                _myPos = myPos - 1;
                if (_myPos < 0) {
                    _myPos = 11;
                }
                myZodiac = zodiac[_myPos];
                break;
            case 2:
                if (day < springDay) {
                    _myPos = myPos - 1;
                    if (_myPos < 0) {
                        _myPos = 11;
                    }
                    myZodiac = zodiac[_myPos];
                }
                break;
        }
        return myZodiac;
    };

    //-->

    //获取该月天数有几天
    function getNowMonthDays(year, month) {
        var isy = false;
        if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
            isy = true;
        }
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 2:
                return isy ? 28 : 29;
        }
    };

    //获取该月一号是周几
    function getStartWeek() {
        var tempnum = SD % 7;
        var week = now.getDay() + 1; //今天周几
        var startweek = week + 7 - tempnum;
        return startweek > 7 ? startweek % 7 : startweek;
    };

    var service = {};
    // 月视图 calendarService.showMonth
    service.showMonth = function() {
        var days = getNowMonthDays(SY, SM + 1),
            startweek = getStartWeek(),
            html = "",
            index = 0,
            i, SYMD;
        /* 星期 */
        html += "<tr>";
        for(i = 1; i < 8; i++) {
            html += "<th>"+$translate.instant('T_CALENDAR_'+i);+"</th>"
        }
        html += "</tr>";
        html += "<tr style='height: 28px'></tr>";
        html += "<tr>";

        /* 占位 */
        for (i = 1; i < startweek; i++) {
            html += "<td> </td>";
            index++;
        }

        /* 日期信息单元格 */
        for (i = 1; i <= days; i++) {
            if (index % 7 === 0) {
                html += "</tr><tr>";
            }
            SYMD = SY+'-'+SM+'-'+i;
            html += '\
                <td id="' + SYMD + '">\
                    <div class="day">' + i + '\
                        <div class="lunar">' + getSolarDay(SY, SM, i) + '</div>\
                    </div>\
                </td>';
            index++;
        }

        /* 占位 */
        for (var i = 0; i < 7; i++) {
            if (index % 7 === 0) {
                break;
            }
            html += "<td> </td>";
            index++;
        }

        /* 结束 */
        html += "</tr>";
        return html;
    };

    // 月视图 calendarService.showTitle
    service.showTitle = function() {
        var title = {
            'month': SM < 10 ? '0'+SM : SM, // 本月NUM
            'year': SY, // 年份NUM
            'zyear': getZodiac(SY, SM, SD), // 生肖年份
            'lyear': getSolarYear(SY), // 农历年份
            'eng': SME, // 本月Eng
        };
        return title;
    };
    return service;
});