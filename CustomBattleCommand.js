// 戦闘時コマンドを手動設定する

(function() {
    // メニュー画面にカスタムを追加

    var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        var enabled = this.areMainCommandsEnabled();
        this.addCommand("カスタム", 'custom', enabled);
    };

    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('custom', this.commandPersonal.bind(this));
    };

    var _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
    Scene_Menu.prototype.onPersonalOk = function() {
        _Scene_Menu_onPersonalOk.call(this);
        switch (this._commandWindow.currentSymbol()) {
        case 'custom':
            SceneManager.push(Scene_Custom);
            break;
        }
    };

    // Scene_Custom
    // TODO: コマンド位置記憶

    function Scene_Custom() {
        this.initialize.apply(this, arguments);
    };

    Scene_Custom.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Custom.prototype.constructor = Scene_Custom;

    Scene_Custom.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createStatusWindow();
        this.createSlotWindow();
        this.createSlotTypeWindow();
        this.createSlotTypeNameWindow();
        this.createSkillWindow();
        this.createItemWindow();
        this.createHelpWindow();
        this.refreshActor();
        this._slotWindow.activate();
    };

    Scene_Custom.prototype.createStatusWindow = function() {
        this._statusWindow = new Window_CustomStatus(50, 50);
        this.addWindow(this._statusWindow);
    };

    Scene_Custom.prototype.createSlotWindow = function() {
        var wx = this._statusWindow.x;
        var wy = this._statusWindow.y + this._statusWindow.height;
        this._slotWindow = new Window_CustomSlot(wx, wy, 500);
        this._slotWindow.setHandler('ok',       this.onSlotOk.bind(this));
        this._slotWindow.setHandler('cancel',   this.popScene.bind(this));
        this._slotWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._slotWindow.setHandler('pageup',   this.previousActor.bind(this));
        this.addWindow(this._slotWindow);
    };

    Scene_Custom.prototype.createSlotTypeWindow = function() {
        var wx = this._slotWindow.x + this._slotWindow.width;
        var wy = this._slotWindow.y;
        this._slotTypeWindow = new Window_CustomSlotType(wx, wy);
        this._slotTypeWindow.setHandler('skill',    this.commandSkill.bind(this));
        this._slotTypeWindow.setHandler('cancel',   this.onSkillListCancel.bind(this));
        this._slotTypeWindow.setHandler('item',     this.commandItem.bind(this));
        this._slotTypeWindow.setHandler('remove',   this.commandRemove.bind(this));
        this._slotTypeWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._slotTypeWindow.setHandler('pageup',   this.previousActor.bind(this));
        this.addWindow(this._slotTypeWindow);
    };

    Scene_Custom.prototype.createSlotTypeNameWindow = function() {
        var wx = this._slotTypeWindow.x;
        var wy = this._slotTypeWindow.y;
        var ww = this._slotTypeWindow.width;
        this._slotTypeNameWindow = new Window_CustomSlotTypeName(wx, wy, ww);
        this._slotTypeNameWindow.visible = false;
        this.addWindow(this._slotTypeNameWindow);
    };

    Scene_Custom.prototype.createSkillWindow = function() {
        var wx = this._slotTypeWindow.x - 150;
        var wy = this._slotTypeWindow.y;
        var ww = this._slotTypeWindow.width + 150;
        var wh = this._slotTypeWindow.height;
        this._skillWindow = new Window_CustomSkillList(wx, wy, ww, wh);
        this._skillWindow.setHandler('ok',       this.onSkillOk.bind(this));
        this._skillWindow.setHandler('cancel',   this.onSkillCancel.bind(this));
        this._skillWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._skillWindow.setHandler('pageup',   this.previousActor.bind(this));
        this._skillWindow.visible = false;
        this._slotTypeWindow.setSkillWindow(this._skillWindow);
        this.addWindow(this._skillWindow);
    };

    Scene_Custom.prototype.createItemWindow = function() {
        var wx = this._skillWindow.x;
        var wy = this._skillWindow.y;
        var ww = this._skillWindow.width;
        var wh = this._skillWindow.height;
        this._itemWindow = new Window_CustomItemList(wx, wy, ww, wh);
        this._itemWindow.setHandler('ok',       this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel',   this.onItemCancel.bind(this));
        this._itemWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._itemWindow.setHandler('pageup',   this.previousActor.bind(this));
        this._itemWindow.visible = false;
        this.addWindow(this._itemWindow);
    };

    Scene_Custom.prototype.createHelpWindow = function() {
        var wx = this._slotWindow.x;
        var wy = this._slotWindow.y + this._slotWindow.height;
        var ww = this._slotWindow.width + this._slotTypeWindow.width;
        this._helpWindow = new Window_CustomHelp(2, wx, wy, ww);
        this.addWindow(this._helpWindow);
        this._slotWindow.setHelpWindow(this._helpWindow);
        this._slotTypeWindow.setHelpWindow(this._helpWindow);
        this._skillWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHelpWindow(this._helpWindow);
    };

    Scene_Custom.prototype.refreshActor = function() {
        var actor = this.actor();
        this._statusWindow.setActor(actor);
        this._slotWindow.setActor(actor);
        this._slotTypeWindow.setActor(actor);
        this._skillWindow.setActor(actor);
    };

    Scene_Custom.prototype.onActorChange = function() {
        this.refreshActor();
        this._skillWindow.visible = false;
        this._itemWindow.visible = false;
        this._slotTypeNameWindow.visible = false;
        this._slotTypeWindow.visible = true;
        this._slotTypeWindow.deselect();
        this._slotWindow.activate();
        this._slotWindow.select(0);
    };

    Scene_Custom.prototype.onSlotOk = function() {
        this._slotTypeWindow.activate();
        this._slotTypeWindow.select(0);
    };

    Scene_Custom.prototype.commandSkill = function() {
        this._slotTypeWindow.visible = false;
        this._skillWindow.visible = true;
        this._slotTypeNameWindow.setText(this._slotTypeWindow.currentData().name);
        this._slotTypeNameWindow.visible = true;
        this._skillWindow.activate();
        this._skillWindow.select(0);
    };

    Scene_Custom.prototype.commandItem = function() {
        this._slotTypeWindow.visible = false;
        this._itemWindow.visible = true;
        this._slotTypeNameWindow.setText(this._slotTypeWindow.currentData().name);
        this._slotTypeNameWindow.visible = true;
        this._itemWindow.activate();
        this._itemWindow.select(0);
    };

    Scene_Custom.prototype.commandRemove = function() {
        SoundManager.playEquip();
        this.actor().changeCustom(this._slotWindow.index(), null);
        this._itemWindow.refresh();
        this._slotTypeWindow.deselect();
        this._slotWindow.activate();
        this._slotWindow.refresh();
    };

    Scene_Custom.prototype.onSkillListCancel = function() {
        this._slotTypeWindow.deselect();
        this._slotWindow.activate();
    };

    Scene_Custom.prototype.onSkillOk = function() {
        SoundManager.playEquip();
        this.actor().changeCustom(this._slotWindow.index(), this._skillWindow.item());
        this._itemWindow.refresh();
        this._skillWindow.visible = false;
        this._slotTypeNameWindow.visible = false;
        this._slotTypeWindow.visible = true;
        this._slotTypeWindow.deselect();
        this._slotWindow.activate();
        this._slotWindow.refresh();
    };

    Scene_Custom.prototype.onSkillCancel = function() {
        this._skillWindow.visible = false;
        this._slotTypeWindow.visible = true;
        this._slotTypeNameWindow.visible = false;
        this.onSlotOk();
    };

    Scene_Custom.prototype.onItemOk = function() {
        SoundManager.playEquip();
        this.actor().changeCustom(this._slotWindow.index(), this._itemWindow.item());
        this._itemWindow.visible = false;
        this._itemWindow.refresh();
        this._slotTypeWindow.visible = true;
        this._slotTypeNameWindow.visible = false;
        this._slotTypeWindow.deselect();
        this._slotWindow.activate();
        this._slotWindow.refresh();
    };

    Scene_Custom.prototype.onItemCancel = function() {
        this._itemWindow.visible = false;
        this._slotTypeWindow.visible = true;
        this._slotTypeNameWindow.visible = false;
        this.onSlotOk();
    };

    // Window_CustomSlot

    function Window_CustomSlot() {
        this.initialize.apply(this, arguments);
    };

    Window_CustomSlot.prototype = Object.create(Window_Selectable.prototype);
    Window_CustomSlot.prototype.constructor = Window_CustomSlot;

    Window_CustomSlot.prototype.initialize = function(x, y, width) {
        var height = this.lineHeight() * (this.maxItems() + 1);
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
        this.refresh();
        this.activate();
        this.select(0);
    };

    Window_CustomSlot.prototype.drawItem = function(index) {
        if (this._actor) {
            var rect = this.itemRectForText(index);
            var item = this._actor.customs()[index];
            if (!item.isNull()) {
                var obj = item.object();
                this.drawItemName(obj, rect.x, rect.y);
                // スキルならコストを表示
                if (item.isSkill()) {
                    this.drawSkillCost(obj, rect.x, rect.y, rect.width);
                } else {
                    this.drawItemObject(rect.x, rect.y, rect.width);
                }
            } else {
                this.resetTextColor();
                this.drawText("--------", rect.x, rect.y, rect.width, 'center');
            }
        }
    };

    Window_CustomSlot.prototype.drawSkillCost = function(skill, x, y, width) {
        if (this._actor.skillTpCost(skill) > 0) {
            this.changeTextColor(this.tpCostColor());
            this.drawText(this._actor.skillTpCost(skill), x, y, width, 'right');
        } else if (this._actor.skillMpCost(skill) > 0) {
            this.changeTextColor(this.mpCostColor());
            this.drawText(this._actor.skillMpCost(skill), x, y, width, 'right');
        }
    };

    Window_CustomSlot.prototype.drawItemObject = function(x, y, width) {
        this.changeTextColor(this.tpCostColor());
        this.drawText("★", x, y, width, 'right');
    };

    Window_CustomSlot.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    Window_CustomSlot.prototype.maxItems = function() {
        // 攻撃・防御含めて8
        return 6;
    };

    Window_CustomSlot.prototype.item = function() {
        return this._actor ? this._actor.customs()[this.index()].object() : null;
    };

    Window_CustomSlot.prototype.updateHelp = function() {
        Window_Selectable.prototype.updateHelp.call(this);
        this.setHelpWindowItem(this.item());
    };

    // Window_CustomSkillType

    function Window_CustomSlotType() {
        this.initialize.apply(this, arguments);
    }

    Window_CustomSlotType.prototype = Object.create(Window_SkillType.prototype);
    Window_CustomSlotType.prototype.constructor = Window_CustomSlotType;

    Window_CustomSlotType.prototype.initialize = function(x, y) {
        Window_SkillType.prototype.initialize.call(this, x, y);
        this.deselect();
        this.deactivate();
    };

    Window_CustomSlotType.prototype.windowWidth = function() {
        return 216;
    };

    Window_CustomSlotType.prototype.selectLast = function() {
    };

    Window_CustomSlotType.prototype.numVisibleRows = function() {
        return 6;
    };

    Window_CustomSlotType.prototype.makeCommandList = function() {
        if (this._actor) {
            var skillTypes = this._actor.addedSkillTypes();
            skillTypes.sort(function(a, b) {
                return a - b;
            });
            skillTypes.forEach(function(stypeId) {
                var name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, 'skill', true, stypeId);
            }, this);

            this.addCommand("アイテム", 'item', true);
            this.addCommand("解除", 'remove', true);
        }
    };

    // Window_CustomStatus

    function Window_CustomStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_CustomStatus.prototype = Object.create(Window_Base.prototype);
    Window_CustomStatus.prototype.constructor = Window_CustomStatus;

    Window_CustomStatus.prototype.initialize = function(x, y) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
        this.refresh();
    };

    Window_CustomStatus.prototype.windowWidth = function() {
        return 200;
    };

    Window_CustomStatus.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };

    Window_CustomStatus.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    Window_CustomStatus.prototype.refresh = function() {
        this.contents.clear();
        if (this._actor) {
            this.drawActorName(this._actor, this.textPadding(), 0);
        }
    };

    // Window_CustomSlotTypeName
    function Window_CustomSlotTypeName() {
        this.initialize.apply(this, arguments);
    }

    Window_CustomSlotTypeName.prototype = Object.create(Window_Base.prototype);
    Window_CustomSlotTypeName.prototype.constructor = Window_CustomSlotTypeName;

    Window_CustomSlotTypeName.prototype.initialize = function(x, y, width) {
        var height = this.windowHeight();
        var wy = y - height;
        Window_Base.prototype.initialize.call(this, x, wy, width, height);
        this._text = "";
    };

    Window_CustomSlotTypeName.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };

    Window_CustomSlotTypeName.prototype.refresh = function() {
        this.contents.clear();
        this.drawText(this._text, 0, 0, this.width);
    };

    Window_CustomSlotTypeName.prototype.setText = function(text) {
        this._text = text;
        this.refresh();
    }

    // Window_CustomSkillList

    function Window_CustomSkillList() {
        this.initialize.apply(this, arguments);
    }

    Window_CustomSkillList.prototype = Object.create(Window_SkillList.prototype);
    Window_CustomSkillList.prototype.constructor = Window_CustomSkillList;

    Window_CustomSkillList.prototype.maxCols = function() {
        return 1;
    };

    Window_CustomSkillList.prototype.isEnabled = function() {
        return this._actor;
    };

    // Window_CustomItemList

    function Window_CustomItemList() {
        this.initialize.apply(this, arguments);
    }

    Window_CustomItemList.prototype = Object.create(Window_ItemList.prototype);
    Window_CustomItemList.prototype.constructor = Window_CustomItemList;

    Window_CustomItemList.prototype.initialize = function(x, y, width, height) {
        Window_ItemList.prototype.initialize.call(this, x, y, width, height);
        this.setCategory('item');
    };

    Window_CustomItemList.prototype.maxCols = function() {
        return 1;
    };

    Window_CustomItemList.prototype.isEnabled = function(item) {
        return true
    };

    // Window_CustomHelp

    function Window_CustomHelp() {
        this.initialize.apply(this, arguments);
    }

    Window_CustomHelp.prototype = Object.create(Window_Help.prototype);
    Window_CustomHelp.prototype.constructor = Window_CustomHelp;

    Window_CustomHelp.prototype.initialize = function(numLines, x, y, width) {
        var height = this.fittingHeight(numLines || 2);
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._text = '';
    };

    // Game_Actorにcustomを追加していく

    var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._lastBattleItemIndex = -1;
    };

    // 最後に選んだアイテムインデックスを保持
    Game_Actor.prototype.lastBattleItemIndex = function() {
        return this._lastBattleItemIndex;
    };

    Game_Actor.prototype.setLastBattleItemIndex = function(index) {
        this._lastBattleItemIndex = index;
    };

    var _Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        this.initCustoms();
    };

    Game_Actor.prototype.initCustoms = function() {
        this._customs = [];
        for (var i = 0; i < this.maxCustom(); ++i) {
            this._customs[i] = new Game_Item();
        }
        this.refresh();
    };

    Game_Actor.prototype.customs = function() {
        return this._customs;
    };

    Game_Actor.prototype.changeCustom = function(slotId, item) {
        var custom = this._customs[slotId].object();

        // 重複チェック
        var dup = -1;
        for (var i = 0; i < this.maxCustom(); ++i) {
            if (this._customs[i].object() === item) {
                dup = i;
                break;
            }
        }

        // [スキル]重複していたら前のデータを消去
        if ((item && item.stypeId) && dup !== -1) {
            this._customs[dup].setObject(null);
        }

        // [アイテム]所持品から減らす
        if ((item && item.itypeId) && custom !== item) {
            $gameParty.consumeItem(item);
        }

        // [アイテム]消去・別のitemで上書きするとき、個数を増やす
        if (this._customs[slotId].isItem() && custom !== item) {
            $gameParty.gainItem(custom, 1, false);
        }

        if (slotId < this.maxCustom()) {
            this._customs[slotId].setObject(item);
        }
        this.refresh();
    };

    Game_Actor.prototype.deleteCustom = function(index) {
        if (index >= 0 && index < this.maxCustom()) {
            this._customs[index].setObject(null);
        }
    };

    Game_Actor.prototype.maxCustom = function() {
        return 6;
    };

    // 持ち物にアイテムが無くても使用可能にする
    Game_Actor.prototype.meetsItemConditions = function(item) {
        return this.meetsUsableItemConditions(item);
    };

    // 戦闘時、カスタムからコマンドを選ぶようにする
    var _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        this._actorCommandWindow.setHelpWindow(this._helpWindow);
    };

    var _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
    Scene_Battle.prototype.startActorCommandSelection = function() {
        _Scene_Battle_startActorCommandSelection.call(this);
        this.createCustomHandler();
    };

    Scene_Battle.prototype.createCustomHandler = function() {
        var actor = BattleManager.actor();
        var maxCustom = actor.maxCustom();
        var key = 0;
        for (var i = 0; i < maxCustom; ++i) {
            var custom = actor.customs()[i];
            if (custom.isNull()) continue;
            var obj = custom.object();
            this._actorCommandWindow.setHandler(
                obj.name + "_" + key++,
                this.commandCustom.bind(this, custom, i)
            );
        }
    };

    Scene_Battle.prototype.commandCustom = function(custom, index) {
        var c = custom.object();
        if (custom.isSkill()) {
            BattleManager.inputtingAction().setSkill(c.id);
        } else if (custom.isItem()) {
            BattleManager.inputtingAction().setItem(c.id);
            BattleManager.actor().setLastBattleItemIndex(index);
        }
        this.onSelectAction();
    };

    Scene_Battle.prototype.onSelectAction = function() {
        var action = BattleManager.inputtingAction();
        if (!action.needsSelection()) {
            this.selectNextCommand();
        } else if (action.isForOpponent()) {
            this.selectEnemySelection();
        } else {
            this.selectActorSelection();
        }
    };

    // 戦闘中、アイテムを消費する際にカスタムから消費し、アイテム欄からは消費しない
    BattleManager.startAction = function() {
        var subject = this._subject;
        var action = subject.currentAction();
        var targets = action.makeTargets();
        this._phase = 'action';
        this._action = action;
        this._targets = targets;
        if (action.isItem()) {
            var index = subject.lastBattleItemIndex();
            subject.deleteCustom(index);
        } else {
            subject.useItem(action.item());
        }
        this._action.applyGlobal();
        this.refreshStatus();
        this._logWindow.startAction(subject, action, targets);
    };

    // コマンドウィンドウの高さをコマンド数に応じて変更する
    Window_ActorCommand.prototype.setup = function(actor) {
        this._actor = actor;
        this.move(this.x, this.y, this.width, this.windowHeight());
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
        this.selectLast();
        this.activate();
        this.open();
    };

    Window_ActorCommand.prototype.numVisibleRows = function() {
        var customs = this._actor ? this._actor.customs().filter(function(custom) {
            return !custom.isNull();
        }, this) : [];
        return this._actor ? customs.length + 2 : 8;
    };

    Window_ActorCommand.prototype.makeCommandList = function() {
        if (this._actor) {
            this.addAttackCommand();
            this.addCustomCommand();
            this.addGuardCommand();
        }
    };

    Window_ActorCommand.prototype.addCustomCommand = function() {
        var customs = this._actor.customs().filter(function(custom) {
            return !custom.isNull();
        }, this);
        for (var i = 0; i < customs.length; ++i) {
            var custom = customs[i].object();
            var symbol = custom.name + "_" + i;
            if (customs[i].isItem()) {
                this.addCommand(custom.name, symbol, true);
            } else {
                this.addCommand(custom.name, symbol, this._actor.canUse(custom));
            }
        }
    };

    Window_ActorCommand.prototype.item = function() {
        // 「戦う」を除くので -1する
        var index = this.index() - 1;
        var customs = this._actor.customs().filter(function(custom) {
            return !custom.isNull();
        }, this);
        if (index < 0 || index >= customs.length || !this._actor) return new Game_Item();
        return customs[index];
    };

    // カスタムコマンドのアイテムを取得
    Window_ActorCommand.prototype.item = function() {
        // 「戦う」を除くので -1する
        var index = this.index() - 1;
        var customs = this._actor.customs().filter(function(custom) {
            return !custom.isNull();
        }, this);
        if (index < 0 || index >= customs.length || !this._actor) return new Game_Item();
        return customs[index];
    };

    Window_ActorCommand.prototype.item_with_index = function(index) {
        // 「戦う」を除くので -1する
        index--;
        var customs = this._actor.customs().filter(function(custom) {
            return !custom.isNull();
        }, this);
        if (index < 0 || index >= customs.length || !this._actor) return new Game_Item();
        return customs[index];
    };

    // カスタムコマンドの説明をhelpWindowに表示する
    Window_ActorCommand.prototype.updateHelp = function() {
        Window_Command.prototype.updateHelp.call(this);
        this.setHelpWindowItem(this.item().object());
    };

    // 「攻撃」を所持武器名にする
    Window_ActorCommand.prototype.addAttackCommand = function() {
        var first = this._actor.equips()[0];
        var weapon = first ? first.name : "素手"
        this.addCommand(weapon, 'attack', this._actor.canAttack());
    };

    // 戦闘中もMPコスト、アイテムかどうかを表示
    // TODO: cost表示のためwindowを広げる
    Window_ActorCommand.prototype.drawItem = function(index) {
            var rect = this.itemRectForText(index);
            var align = this.itemTextAlign();
            var item = this.item_with_index(index);
            this.resetTextColor();
            this.changePaintOpacity(this.isCommandEnabled(index));
            this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
            this.drawCost(item, rect.x, rect.y, rect.width);
    };

    Window_ActorCommand.prototype.drawCost = function(item, x, y, width) {
        var custom = item.object();
        if (item.isItem()) {
            this.drawItemCount(custom, x, y, width, 'right');
        } else if (item.isSkill()){
            this.drawSkillCost(custom, x, y, width, 'right');
        }
    };

    Window_ActorCommand.prototype.drawItemCount = function(item, x, y, width) {
        this.changeTextColor(this.tpCostColor());
        this.drawText("★", x, y, width, 'right');
    };

    Window_ActorCommand.prototype.drawSkillCost = function(skill, x, y, width) {
        if (this._actor.skillTpCost(skill) > 0) {
            this.changeTextColor(this.tpCostColor());
            this.drawText(this._actor.skillTpCost(skill), x, y, width, 'right');
        } else if (this._actor.skillMpCost(skill) > 0) {
            this.changeTextColor(this.mpCostColor());
            this.drawText(this._actor.skillMpCost(skill), x, y, width, 'right');
        }
    };

})();
