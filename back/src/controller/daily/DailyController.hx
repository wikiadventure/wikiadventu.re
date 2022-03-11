package controller.daily;

import controller.daily.DailyPage.DailyPageType;
import controller.daily.DailyPage.DailyRequest;
import utils.Random;
import haxe.Json;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;

using Lambda;

class DailyController {
	public function new(im:IncomingMessage, sr:ServerResponse, body:String) {
		try {
			var form:DailyRequest = Json.parse(body);
			var c = DailyPage.current[form.lang];
			if (c == null) throw "";
			sr.setHeader("Content-Type", "application/json");
			sr.writeHead(OK);
			sr.write(Json.stringify({
				start: c.start,
				end: c.end
			}));
	  	} catch(e) {
			sr.writeHead(400);
			sr.write(Json.stringify({code: DailyError.NoDailyForLang}));
		}
		sr.end();
	}

	public static function init() {
		DailyPage.setDailyCurrentPage();
		NodeCron.schedule('0 1 * * *', DailyPage.setDailyCurrentPage, {
			scheduled: true,
			timezone: "UTC"
		});
	}
} 

enum abstract DailyError(Int) from Int to Int {
	var NoDailyForLang = 300;
}

@:jsRequire("node-cron") extern class NodeCron {
	public static function schedule(cronExpression:String, func:() -> Void, ?options:Any):Any;
	public static function validate(cronExpression:String):Bool;
	public static function getTasks():Array<Any>;
}
