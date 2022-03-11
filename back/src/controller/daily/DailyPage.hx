package controller.daily;

import controller.daily.pages.Fr;
import controller.daily.pages.En;
import config.Lang;
using Lambda;

class DailyPage {

    public static final list:Map<Lang, Map<DailyDate, DailyPageType>> = [
      Lang.fr => Fr.dailyPages,
      Lang.en => En.dailyPages
    ];

    public static var current:Map<Lang, DailyPageType> = [];
  
    public static function setDailyCurrentPage() {
      var date = DateTools.format(Date.now(), "%d/%m/%Y");
      for (lang in list.keys()) {
        var c = list[lang][date];
        if (c != null) current[lang] = c;
      }
    }

}

typedef DailyRequest = {
  lang: Lang
}

// date with format dd/mm/yyyy
typedef DailyDate = String;

typedef DailyPageType = {
    start: String,
    end: String
}
