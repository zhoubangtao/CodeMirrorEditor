Ext.define('Ext.ux.codemirror.Status', {
  extend: 'Ext.toolbar.Toolbar',
  alias: 'widget.codemirrorstatus',
  requires: [],
  uses: [],

  /**
   * @cfg {Boolean} displayInfo
   * true to display the displayMsg
   */
  displayInfo: false,

  /**
   * @cfg {Boolean} prependButtons
   * true to insert any configured items _before_ the paging buttons.
   */
  prependButtons: false,

  /**
   * @cfg {String} displayMsg
   * The paging status message to display. Note that this string is
   * formatted using the braced numbers {0}-{2} as tokens that are replaced by the values for start, end and total
   * respectively. These tokens should be preserved when overriding this string if showing those values is desired.
   */
  //<locale>
  displayMsg : 'Displaying {0} - {1} of {2}',
  //</locale>

  /**
   * @cfg {String} emptyMsg
   * The message to display when no records are found.
   */
  //<locale>
  emptyMsg : 'No data to display',
  //</locale>

  /**
   * @cfg {String} beforePageText
   * The text displayed before the input item.
   */
  //<locale>
  beforePageText : 'Page',
  //</locale>

  /**
   * @cfg {String} afterPageText
   * Customizable piece of the default paging text. Note that this string is formatted using
   * {0} as a token that is replaced by the number of total pages. This token should be preserved when overriding this
   * string if showing the total page count is desired.
   */
  //<locale>
  afterPageText : 'of {0}',
  //</locale>

  /**
   * @cfg {String} firstText
   * The quicktip text displayed for the first page button.
   * **Note**: quick tips must be initialized for the quicktip to show.
   */
  //<locale>
  firstText : 'First Page',
  //</locale>

  /**
   * @cfg {String} prevText
   * The quicktip text displayed for the previous page button.
   * **Note**: quick tips must be initialized for the quicktip to show.
   */
  //<locale>
  prevText : 'Previous Page',
  //</locale>

  /**
   * @cfg {String} nextText
   * The quicktip text displayed for the next page button.
   * **Note**: quick tips must be initialized for the quicktip to show.
   */
  //<locale>
  nextText : 'Next Page',
  //</locale>

  /**
   * @cfg {String} lastText
   * The quicktip text displayed for the last page button.
   * **Note**: quick tips must be initialized for the quicktip to show.
   */
  //<locale>
  lastText : 'Last Page',
  //</locale>

  /**
   * @cfg {String} refreshText
   * The quicktip text displayed for the Refresh button.
   * **Note**: quick tips must be initialized for the quicktip to show.
   */
  //<locale>
  refreshText : 'Refresh',
  //</locale>

  /**
   * Gets the standard paging items in the toolbar
   * @private
   */
  getStatusItems: function() {
    var me = this;

    return [{
      itemId: 'first',
      tooltip: me.firstText,
      overflowText: me.firstText,
      iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
      disabled: true,
      handler: me.moveFirst,
      scope: me
    },{
      itemId: 'prev',
      tooltip: me.prevText,
      overflowText: me.prevText,
      iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
      disabled: true,
      handler: me.movePrevious,
      scope: me
    },
      '-',
      me.beforePageText,
      {
        xtype: 'numberfield',
        itemId: 'inputItem',
        name: 'inputItem',
        cls: Ext.baseCSSPrefix + 'tbar-page-number',
        allowDecimals: false,
        minValue: 1,
        hideTrigger: true,
        enableKeyEvents: true,
        keyNavEnabled: false,
        selectOnFocus: true,
        submitValue: false,
        // mark it as not a field so the form will not catch it when getting fields
        isFormField: false,
        width: me.inputItemWidth,
        margins: '-1 2 3 2',
        listeners: {
          scope: me,
          keydown: me.onPagingKeyDown,
          blur: me.onPagingBlur
        }
      },{
        xtype: 'tbtext',
        itemId: 'afterTextItem',
        text: Ext.String.format(me.afterPageText, 1)
      },
      '-',
      {
        itemId: 'next',
        tooltip: me.nextText,
        overflowText: me.nextText,
        iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
        disabled: true,
        handler: me.moveNext,
        scope: me
      },{
        itemId: 'last',
        tooltip: me.lastText,
        overflowText: me.lastText,
        iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
        disabled: true,
        handler: me.moveLast,
        scope: me
      },
      '-',
      {
        itemId: 'refresh',
        tooltip: me.refreshText,
        overflowText: me.refreshText,
        iconCls: Ext.baseCSSPrefix + 'tbar-loading',
        handler: me.doRefresh,
        scope: me
      }];
  },

  initComponent: function () {
    var me = this,
      statusItems = me.getStatusItems(),
      userItems   = me.items || me.buttons || [];

    if (me.prependButtons) {
      me.items = userItems.concat(statusItems);
    } else {
      me.items = statusItems.concat(userItems);
    }
    delete me.buttons;

    if (me.displayInfo) {
      me.items.push('->');
      me.items.push({xtype: 'tbtext', itemId: 'displayItem'});
    }

    me.callParent();

    me.on('beforerender', me.onLoad, me, {single: true});

    me.bindStore(me.store || 'ext-empty-store', true);
  }
})
