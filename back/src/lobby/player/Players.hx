package lobby.player;

/**
 * Auto cast Player and Lobby to an Array<Player> allowing
 * function that use Players as argument
 * to be used with either a lobby, a player or an array of player
 */
abstract Players(Array<Player>) from Array<Player> to Array<Player> {

    inline function new(l:Array<Player>) this = l;

    @:from static public inline function fromLobby(l:Lobby) return new Players(l.players);

    @:from static public inline function fromPlayer(p:Player) return new Players([p]);

}
