//=============================================================================
// OverlayWindow.js
//=============================================================================

/*:
 * @plugindesc Overlaying windows (WebGL mode only).
 * @author masami
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc ウィンドウを重ねられるようにします(WebGL modeのみ)。
 * @author masami
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */


(function() {
    WindowLayer.prototype._renderWebGL = function(renderSession) {
        if (!this.visible) {
            return;
        }

        var gl = renderSession.gl;

        if (!this._vertexBuffer) {
            this._vertexBuffer = gl.createBuffer();
        }

        this._dummySprite._renderWebGL(renderSession);

        renderSession.spriteBatch.stop();
        gl.enable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        this._webglMaskOutside(renderSession);
        renderSession.spriteBatch.start();

        for (var i = 0; i < this.children.length; ++i) {
            var child = this.children[i];
            if (child._isWindow && child.visible && child.openness > 0) {
                gl.stencilFunc(gl.EQUAL, 0, 0xFF);
                child._renderWebGL(renderSession);
            }
        }

        gl.disable(gl.STENCIL_TEST);

        for (var j = 0; j < this.children.length; j++) {
            if (!this.children[j]._isWindow) {
                this.children[j]._renderWebGL(renderSession);
            }
        }
    };
})();
