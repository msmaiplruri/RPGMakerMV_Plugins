//=============================================================================
// AddEscapeCommandForAllActor.js
//=============================================================================

/*:
 * @plugindesc This plugin add a Escape Command for all Actor.
 * @author masami
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc Actor全員に「逃げる」コマンドを追加します。
 * @author masami
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function(){
    Window_ActorCommand.prototype.addEscapeCommand = function() {
        this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
    };

    var _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList; Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.call(this);
        if (this._actor) {
            this.addEscapeCommand();
        }
    };

    var _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.call(this);
        this._actorCommandWindow.setHandler('escape', this.commandEscape.bind(this));
    };

    Window_ActorCommand.prototype.numVisibleRows = function() {
        return 4 + 1;
    };
})();
