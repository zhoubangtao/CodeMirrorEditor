Ext.define('Ext.ux.codemirror.Toolbar', {
  extend: 'Ext.toolbar.Toolbar',
  alias: 'widget.codemirrortoolbar',
  requires: [],
  uses: [],
  initComponent: function () {
    var me = this;
    Ext.apply(me, {
//          ui : 'plain',
      border: true,
      items: [
        {
          text: 'Save',
          handler: this.triggerOnSave,
          scope: this
        },
        {
          text: 'Undo',
          handler: function () {
            this.codeMirrorEditor.undo();
          },
          scope: this
        },
        {
          text: 'Redo',
          handler: function () {
            this.codeMirrorEditor.redo();
          },
          scope: this
        },
        {
          text: 'Indent',
          handler: function () {
            this.codeMirrorEditor.reindent();
          },
          scope: this
        },
        {
          itemId: 'spellChecker',
          disabled: true,
          text: 'JS Lint',
          handler: function () {
            try {
              var bValidates = JSLINT(this.findByType('textarea')[0].getValue());

              var oStore = this.debugWindow.findByType('grid')[0].getStore();
              if (!bValidates) {
                var aErrorData = [];

                for (var err in JSLINT.errors) {
                  if (JSLINT.errors.hasOwnProperty(err) && (JSLINT.errors[err] !== null)) {
                    aErrorData.push([JSLINT.errors[err].line, JSLINT.errors[err].character, JSLINT.errors[err].reason]);
                  }
                }

                oStore.loadData(aErrorData, false);
                this.debugWindow.show();

              }
              else {

                oStore.loadData([
                  [1, 1, 'Congratulation! No errors found.']
                ], false);
                this.debugWindow.show();
              }
            } catch (e) {
            }

          },
          scope: this
        }
      ]
    });
    me.callParent();
  }
})
