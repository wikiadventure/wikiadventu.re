package controller.daily.pages;

import controller.daily.DailyPage.DailyPageType;
import controller.daily.DailyPage.DailyDate;

class En {
    
    public static final dailyPages:Map<DailyDate, DailyPageType> = [
        "09/03/2022" => { start: "Paris", end: "France" },
        "10/03/2022" => { start: "France", end: "Paris" },
    ];

}