//=============================================================================
// CancelAtBackSpace.js
//=============================================================================

/*:
 * @plugindesc This allows you to cancel by typing the backspace key.
 * @author masami
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc バックスペースキーでキャンセルを可能にします。
 * @author masami
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function () {
    var km = Input.keyMapper;
    km[8] = 'escape';   // backspace
})();
