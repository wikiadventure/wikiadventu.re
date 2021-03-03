package lobby.wikiAPI;

typedef WikiRequest = {
    var action:String;
    var ?list:String;

    var ?srlimit:Int;
    var ?srnamespace:Int;
    var ?srsearch:String;
    var ?srprop:String;

    var ?rnnamespace:Int;
    var ?rnlimit:Int;

    var ?titles:String;

    var ?redirects:Int;
    var ?format:String;
    var ?formatversion:String;

    var ?generator:String;
    var ?gpltitles:String;
};
