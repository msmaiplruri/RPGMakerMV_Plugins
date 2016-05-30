//=============================================================================
// CommandWindowToTopLeftInBattle.js
//=============================================================================

/*:
 * @plugindesc This plugin move a Command Window to Top Left in Battle.
 * @author masami
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc 戦闘中、コマンドウィンドウを左上に表示します。
 * @author masami
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function() {
    Window_BattleStatus.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_BattleEnemy.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Scene_Battle.prototype.createEnemyWindow = function() {
        this._enemyWindow = new Window_BattleEnemy(0, this._statusWindow.y);
        this._enemyWindow.setHandler('ok',     this.onEnemyOk.bind(this));
        this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
        this.addWindow(this._enemyWindow);
    };

    Scene_Battle.prototype.updateWindowPositions = function() {
    };

    Window_PartyCommand.prototype.numVisibleRows = function() {
        return Math.ceil(this.maxItems() / this.maxCols());
    };

    Window_PartyCommand.prototype.initialize = function() {
        var y = 40;
        Window_Command.prototype.initialize.call(this, 0, y);
        this.openness = 0;
        this.deactivate();
    };

    Window_ActorCommand.prototype.initialize = function() {
        var y = 40;
        Window_Command.prototype.initialize.call(this, 0, y);
        this.openness = 0;
        this.deactivate();
        this._actor = null;
    };
})();
