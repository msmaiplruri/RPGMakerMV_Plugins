//=============================================================================
// HideActorCommandWindow.js
//=============================================================================

/*:
 * @plugindesc This plugin hide a Actor Command Window during selecting target.
 * @author masami
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc 攻撃・スキルの対象選択中、ActorCommandWindowを非表示にします。
 * @author masami
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function() {
    var _Window_ActorCommand_activate = Window_ActorCommand.prototype.activate;
    Window_ActorCommand.prototype.activate = function() {
        _Window_ActorCommand_activate.call(this);
        this.show();
    };

    var _Scene_Battle_selectEnemySelection = Scene_Battle.prototype.selectEnemySelection;
    Scene_Battle.prototype.selectEnemySelection = function() {
        this._actorCommandWindow.hide();
        _Scene_Battle_selectEnemySelection.call(this);
    };
})();
