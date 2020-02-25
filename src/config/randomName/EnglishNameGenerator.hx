package config.randomName;

class EnglishNameGenerator {
    
    private static var instance:EnglishNameGenerator;

    public static function getInstance():EnglishNameGenerator {
        if (instance == null) {
            instance = new EnglishNameGenerator();
        }
        return instance;
    }

    public var disheList:Array<String>;
    public var actionList:Array<String>;

    function new() {
        disheList = new Array<String>();
        actionList = new Array<String>();

        disheList.push("Cobbler");
        disheList.push("Faggots");
        disheList.push("Scones");
        disheList.push("Scouse");
        disheList.push("Brownie");
        disheList.push("Cookie");
        disheList.push("Muffins");
        disheList.push("Tea");
        disheList.push("PopCorn");

        actionList.push("Monster");
        actionList.push("Devourer");
        actionList.push("Smasher");
        actionList.push("Lawyer");
        actionList.push("Zealot");
        actionList.push("Leader");
        actionList.push("Dealer");
        actionList.push("Manager");

    }

    public function getRandomName():String {
        var randomDisheID = Std.random(disheList.length);
        var randomActionID = Std.random(actionList.length);
        return disheList[randomDisheID] + actionList[randomActionID];
    }

    

}