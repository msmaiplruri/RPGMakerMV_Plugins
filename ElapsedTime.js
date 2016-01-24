//=============================================================================
// ElapsedTime.js
//=============================================================================

/*:
 * @plugindesc Displays the elapse time counter at menu.
 * @author masami
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
* @plugindesc メニュー画面に経過時間を表示します。
* @auther masami
* 
* @help このプラグインには、プラグインコマンドはありません。
*/

(function () {
    function Window_ElapsedTime() {
        this.initialize.apply(this, arguments);
    }

    Window_ElapsedTime.prototype = Object.create(Window_Base.prototype);
    Window_ElapsedTime.prototype.constructor = Window_ElapsedTime;

    Window_ElapsedTime.prototype.initialize = function(x, y) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    Window_ElapsedTime.prototype.windowWidth = function() {
        return 240;
    };

    Window_ElapsedTime.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };

    Window_ElapsedTime.prototype.refresh = function() {
        var x = this.textPadding();
        var width = this.contents.width - this.textPadding() * 2;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
    };

    Window_ElapsedTime.prototype.value = function() {
        return $gameSystem.playtimeText();
    };

    Window_ElapsedTime.prototype.currencyUnit = function() {
        return "";
    };

    Window_ElapsedTime.prototype.open = function() {
        this.refresh();
        Window_Base.prototype.open.call(this);
    };
    
    Window_ElapsedTime.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.refresh();
    };
    
    // add scene
    Scene_Menu.prototype.createElapsedTimeWindow = function() {
        this._elapsedTime = new Window_ElapsedTime(0, 0);
        this._elapsedTime.y = Graphics.boxHeight - this._goldWindow.height - this._elapsedTime.height;
        this.addWindow(this._elapsedTime);
    };
    
    var createSceneMenu = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        createSceneMenu.call(this);
        this.createElapsedTimeWindow();
    };
    
})();