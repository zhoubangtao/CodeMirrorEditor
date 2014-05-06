/**
 * @class Ext.ux.codemirror.CodeMirrorEditor
 * @extends Ext.panel.Panel
 * Converts a panel into a code mirror editor with toolbar
 *
 * @author timen - zhoubangtao@gmail.com / http://zhoubangtao.org
 * @version 0.1
 */

Ext.define('Ext.ux.codemirror.CodeMirrorEditor', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.codemirror',

  config: {

    /* CodeMirror Folder, this is base on CodeMirror 4.0*/
    cmFolder: undefined,

    /* Mime modes Mapping*/
    mimeModes: {
      "text/x-sql": "sql",
      "text/x-plsql": "sql",
      "text/x-mssql": "sql",
      "text/x-mysql": "sql",
      "text/x-hive": "sql"
    }
  },

  sourceCode: '/* Default code */',

  initComponent: function () {
    // this property is used to determine if the source content changes
    this.contentChanged = false;
    var me = this;

    // create a textarea as a property of the class
    me.textarea = Ext.create('Ext.form.field.TextArea', {
      readOnly: false,
      value: me.sourceCode,
      anchor: '100% 100%'
    });

    Ext.apply(me, {
      items: [me.textarea],
      tbar: [
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

    Ext.ux.panel.CodeMirror.superclass.initComponent.apply(this, arguments);
  },

  triggerOnSave: function () {
    var me = this;
    me.setTitleClass(true);
    var newCode = me.codeMirrorEditor.getCode();

    Ext.state.Manager.set("edcmr_" + me.itemId + '_lnmbr', me.codeMirrorEditor.currentLine());

    me.oldSourceCode = newCode;
    me.onSave(arguments[0] || false);
  },

  onRender: function () {
    this.oldSourceCode = this.sourceCode;
    Ext.ux.panel.CodeMirror.superclass.onRender.apply(this, arguments);
    // trigger editor on afterlayout
    this.on('afterlayout', this.triggerCodeEditor, this, {
      single: true
    });

  },

  /** @private */
  triggerCodeEditor: function () {
    var me = this;

    var editorConfig = Ext.applyIf(this.codeMirror || {}, {
      height: "100%",
      width: "100%",
      lineNumbers: true,
      textWrapping: false,
      content: me.textarea.getValue(),
      indentUnit: 4,
      tabMode: 'shift',
      readOnly: me.textarea.readOnly,
      autoMatchParens: true,
      initCallback: function (editor) {
        editor.win.document.body.lastChild.scrollIntoView();
        try {
          var iLineNmbr = ((Ext.state.Manager.get("edcmr_" + me.itemId + '_lnmbr') !== undefined) ? Ext.state.Manager.get("edcmr_" + me.itemId + '_lnmbr') : 1);
          //console.log(iLineNmbr);
          editor.jumpToLine(iLineNmbr);
        } catch (e) {
          //console.error(e);
        }
      },
      onChange: function () {
        var sCode = me.codeMirrorEditor.getCode();
        me.textarea.setValue(sCode);

        if (me.oldSourceCode == sCode) {
          me.setTitleClass(true);
        } else {
          me.setTitleClass();
        }

      }
    });

    var sParserType = me.parser || 'defo';
    editorConfig = Ext.applyIf(editorConfig, Ext.ux.panel.CodeMirrorConfig.parser[sParserType]);

    this.codeMirrorEditor = new CodeMirror.fromTextArea(Ext.getDom(oCmp.id).id, editorConfig);
    // set size of codeMirrorEditor
    me.codeMirrorEditor.setSize("100%", me.body.getHeight());
    // Disable spell check button for non-js content
    if (sParserType == 'js' || sParserType == 'css') {
      this.getTopToolbar().getComponent('spellChecker').enable();
    }
  },

  afterLayout: function () {
    var me = this;
    me.callParent();
    // reset the size of codeMirrorEditor when resize
    me.codeMirrorEditor.setSize("100%", me.body.getHeight());
  },

  setTitleClass: function () {
    //var tabEl = Ext.get(this.ownerCt.getTabEl( this ));
    if (arguments[0] === true) {// remove class
      //tabEl.removeClass( "tab-changes" );
      this.contentChanged = false;
    } else {//add class
      //tabEl.addClass( "tab-changes" );
      this.contentChanged = true;
    }
  }
});
