(function() {
    // アイテムカテゴリに「MOD」「素材」を追加するテスト
    TextManager.getter_str = function(param) {
        return {
            get : function() { return param; },
            configurable: true
        };
    };

    Object.defineProperties(TextManager, {
        mod : TextManager.getter_str("MOD"),
        mod_type : TextManager.getter_str("mod"),
        material : TextManager.getter_str("素材"),
        material_type : TextManager.getter_str("material"),
    });

    var _Window_ItemCategory_maxCols = Window_ItemCategory.prototype.maxCols;
    Window_ItemCategory.prototype.maxCols = function() {
        return _Window_ItemCategory_maxCols.call(this) + 2;
    };

    Window_ItemCategory.prototype.makeCommandList = function() {
        this.addCommand(TextManager.item,     'item');
        this.addCommand(TextManager.weapon,   'weapon');
        this.addCommand(TextManager.armor,    'armor');
        this.addCommand(TextManager.mod,      TextManager.mod_type);
        this.addCommand(TextManager.material, TextManager.material_type);
        this.addCommand(TextManager.keyItem,  'keyItem');
    };

    // 追加カテゴリのアイテムを追加して捜査するテスト
    // <type:mod>
    // <type:material>
    // [※注意] <type: mod> ではエラー

    DataManager.isExtraItem = function(item, param) {
        return DataManager.isItem(item) && item.meta.type === param;
    };

    Window_ItemList.prototype.includes = function(item) {
        switch (this._category) {
        case 'item': return DataManager.isItem(item) && item.itypeId === 1 && item.meta.type === undefined;
        case 'weapon': return DataManager.isWeapon(item);
        case 'armor': return DataManager.isArmor(item);
        case TextManager.mod_type: return DataManager.isExtraItem(item, TextManager.mod_type);
        case TextManager.material_type: return DataManager.isExtraItem(item, TextManager.material_type);
         case 'keyItem': return DataManager.isItem(item) && item.itypeId === 2;
        default: return false;
        }
    };

    // 「鍛冶屋」を実装し、プラグインコマンドから呼べるようにする
    // `Blacksmith`
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if ((command || '') === 'Blacksmith') {
            _Blacksmith.call(this);
        }
    };

    function _Blacksmith() {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Blacksmith);
            SceneManager.prepareNextScene([[0,1,0,0],[1,2,1,0]], false);
        }
    }

    function Scene_Blacksmith() {
        this.initialize.apply(this, arguments);
    }

    Scene_Blacksmith.prototype = Object.create(Scene_Shop.prototype);
    Scene_Blacksmith.prototype.constructor = Scene_Blacksmith;

    Scene_Blacksmith.prototype.initialize = function() {
        Scene_Shop.prototype.initialize.call(this);
    };

    Scene_Blacksmith.prototype.create = function() {
        Scene_Shop.prototype.create.call(this);
    };

    // TODO: 戦闘時、味方のステータス表示をキャラそれぞれ1つのwindowにし、キャラチップも表示
    // TODO: 戦闘中、カスタムスキルを円で表示
    // TODO: コマンド選択時、キャラ名を左上に表示
    // TODO: 戦闘中、アイテムウィンドウ・スキルウィンドウの横幅を小さく(要らないかも)
    // TODO: 攻撃時、攻撃する自キャラに選択枠を表示する
    // TODO: HP・MPが満タンならバーの色を変える
    // TODO: 戦闘で敵選択時、矢印を表示 + 左上に名前表示
    // TODO: 戦闘時、全体技を使う時も敵を選択するフェーズに移行(全員に矢印が付いている状態にする)
    // TODO: 戦闘開始時の遷移が目に悪いのでどうにかする
})();
