//=============================================================================
// ParallelBattleStatus.js
//=============================================================================

/*:
 * @plugindesc This plugin arrange an Actor Status in parallel.
 * @author masami
 *
 * @param is_fase
 * @desc Show actor face or do not. true or false.
 * @default true
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc 戦闘中のステータス表示を横並びで表示します。
 * @author masami
 *
 * @param is_fase
 * @desc アクターのアイコンを表示します。trueかfalseで指定してください。
 * @default true
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

var params = PluginManager.parameters('ParallelBattleStatus');
var is_fase = params['is_fase'];

(function() {
    Window_BattleStatus.prototype.maxCols = function() {
        return 4;
    };

    Window_BattleStatus.prototype.numVisibleRows = function() {
        if (is_fase !== "false" || $dataSystem.optDisplayTp) {
            return 4;
        } else {
            return 3;
        }
    };

    // Actor選択時の縦幅をウィンドウ全体に広げる
    var _Window_BattleStatus_itemRect = Window_BattleStatus.prototype.itemRect;
    Window_BattleStatus.prototype.itemRect = function(index) {
        var rect = _Window_BattleStatus_itemRect.call(this, index);
        rect.height = this.windowHeight() - 35;
        return rect;
    };

    Window_BattleStatus.prototype.itemRectForText = function(index) {
        var rect = this.itemRect(index);
        rect.x += (rect.width - 144) / 2;
        return rect;
    };

    Window_BattleStatus.prototype.gaugeAreaRect = function(index) {
        var rect = this.itemRectForText(index);
        rect.x += (144 - 130) / 2;
        return rect;
    };

    Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
        this.drawActorHp(actor, rect.x, rect.y + 35,  130);
        this.drawActorMp(actor, rect.x, rect.y + 70,  130);
        this.drawActorTp(actor, rect.x, rect.y + 105, 130);
    };

    Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
        var dy;
        if (is_fase !== "false") dy = 70;
        else dy = 35;
        this.drawActorHp(actor, rect.x, rect.y + dy,  130);
        this.drawActorMp(actor, rect.x, rect.y + dy + 35, 130);
    };

    Window_BattleStatus.prototype.basicAreaRect = function(index) {
        var rect = this.itemRectForText(index);
        return rect;
    };

    Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
        // ActorFace表示
        if (is_fase !== "false") {
            this.drawActorFace(actor,  rect.x + 0,  rect.y, 144);
        }
        this.drawActorName(actor,  rect.x + 7,   rect.y, 130);
        this.drawActorIcons(actor, rect.x + 156, rect.y, rect.width - 156);
    };
})();
