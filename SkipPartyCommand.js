//=============================================================================
// SkipPartyCommand.js
//=============================================================================

/*:
 * @plugindesc This plugin skip a Party Command Window after a battle start.
 * @author masami
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc 戦闘開始時、PartyCommandを飛ばします。(「戦う」を選んだ時と同じ扱いです。)
 * @author masami
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function() {
    Scene_Battle.prototype.startPartyCommandSelection = function() {
        this.refreshStatus();
        this._statusWindow.deselect();
        this._statusWindow.open();
        this._actorCommandWindow.close();
        this.selectNextCommand();
    };
})();
