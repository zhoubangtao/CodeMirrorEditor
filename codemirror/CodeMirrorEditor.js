/**
 * @class Ext.ux.codemirror.codeMirror
 * @extends Ext.panel.Panel
 * Converts a panel into a code mirror editor with toolbar
 *
 * @author timen - zhoubangtao@gmail.com / http://zhoubangtao.org
 * @version 0.1
 */

Ext.define('Ext.ux.codemirror.codeMirror', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.codemirror',

  requires : [
    'Ext.ux.codemirror.Toolbar'
  ],

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

  /**
   * @cfg {Boolean} prependButtons
   * true to insert any configured items _before_ the editor buttons.
   */
  prependButtons: false,

  /**
   * @cfg {String} sourceCode
   * config the default value of the editor
   */
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
      layout : 'absolute',
      items: [me.textarea],
      tbar: {
        xtype : 'codemirrortoolbar',
        editor : me
      }
    });

    me.callParent(arguments);

    me.addEvents(
      /**
       * @event change
       * Fires every time the content of the editor is changed
       *
       * from and to are the positions (in the pre-change coordinate system)
       * where the change started and ended (for example, it might be {ch:0, line:18} if the position is at the beginning of line #19).
       * text is an array of strings representing the text that replaced the changed range (split by line).
       * removed is the text that used to be between from and to, which is overwritten by this change.
       * @param {Ext.ux.codemirror.codeMirror} this
       * @param {Object} changeObj is a {from, to, text, removed, origin} object
       *
       */
      'change',

      /**
       * @event beforechange
       * Fires just before the active page is changed. Return false to prevent the active page from being changed.
       * @param {Ext.toolbar.Paging} this
       * @param {Number} page The page number that will be loaded on change
       */
      'beforechange',
      /**
       * @event beforestartedit
       * Fires when editing is initiated, but before the value changes.  Editing can be canceled by returning
       * false from the handler of this event.
       * @param {Ext.Editor} this
       * @param {Ext.Element} boundEl The underlying element bound to this editor
       * @param {Object} value The field value being set
       */
      'beforestartedit',

      /**
       * @event startedit
       * Fires when this editor is displayed
       * @param {Ext.Editor} this
       * @param {Ext.Element} boundEl The underlying element bound to this editor
       * @param {Object} value The starting field value
       */
      'startedit',

      /**
       * @event beforecomplete
       * Fires after a change has been made to the field, but before the change is reflected in the underlying
       * field.  Saving the change to the field can be canceled by returning false from the handler of this event.
       * Note that if the value has not changed and ignoreNoChange = true, the editing will still end but this
       * event will not fire since no edit actually occurred.
       * @param {Ext.Editor} this
       * @param {Object} value The current field value
       * @param {Object} startValue The original field value
       */
      'beforecomplete',
      /**
       * @event complete
       * Fires after editing is complete and any changed value has been written to the underlying field.
       * @param {Ext.Editor} this
       * @param {Object} value The current field value
       * @param {Object} startValue The original field value
       */
      'complete',
      /**
       * @event canceledit
       * Fires after editing has been canceled and the editor's value has been reset.
       * @param {Ext.Editor} this
       * @param {Object} value The user-entered field value that was discarded
       * @param {Object} startValue The original field value that was set back into the editor after cancel
       */
      'canceledit',
      /**
       * @event specialkey
       * Fires when any key related to navigation (arrows, tab, enter, esc, etc.) is pressed.  You can check
       * {@link Ext.EventObject#getKey} to determine which key was pressed.
       * @param {Ext.Editor} this
       * @param {Ext.form.field.Field} The field attached to this editor
       * @param {Ext.EventObject} event The event object
       */
      'specialkey'
    );
  },

  triggerOnSave: function () {
    var me = this;
    me.setTitleClass(true);
    var newCode = me.codeMirror.getCode();

    Ext.state.Manager.set("edcmr_" + me.itemId + '_lnmbr', me.codeMirror.currentLine());

    me.oldSourceCode = newCode;
    me.onSave(arguments[0] || false);
  },

  onRender: function () {
    this.oldSourceCode = this.sourceCode;
    this.callParent(arguments);
    // trigger editor on afterlayout
    this.on('afterlayout', this.triggerCodeEditor, this, {
      single: true
    });

  },

  /** @private */
  triggerCodeEditor: function () {
    var me = this;

    var editorConfig = Ext.applyIf(this.codeMirrorConfig || {}, {
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
        var sCode = me.codeMirror.getCode();
        me.textarea.setValue(sCode);

        if (me.oldSourceCode == sCode) {
          me.setTitleClass(true);
        } else {
          me.setTitleClass();
        }

      }
    });

    var sParserType = me.parser || 'defo';
    //editorConfig = Ext.applyIf(editorConfig, Ext.ux.panel.CodeMirrorConfig.parser[sParserType]);
    editorConfig = Ext.applyIf(editorConfig, {
      mode : "text/x-hive",
      theme : "ambiance",
      extraKeys: {"Alt-/": "autocomplete"}
    });
    this.codeMirror = new CodeMirror.fromTextArea(Ext.getDom(me.textarea.id + "-inputEl"), editorConfig);
    // set size of codeMirror
    me.codeMirror.setSize("100%", me.body.getHeight());
    // Disable spell check button for non-js content
    if (sParserType == 'js' || sParserType == 'css') {
      this.getTopToolbar().getComponent('spellChecker').enable();
    }
  },

  afterLayout: function () {
    var me = this;
    me.callParent();
    // reset the size of codeMirror when resize
    me.codeMirror.setSize("100%", me.body.getHeight());
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
  },

  /**
   * dynamic load css file
   * @param cssFilePath
   */
  loadCssFile : function (cssFilePath) {
    Ext.core.DomHelper.append(Ext.getHead(), {tag: 'link', type: 'text/css', rel: 'stylesheet', href: cssFilePath});
  }
});
