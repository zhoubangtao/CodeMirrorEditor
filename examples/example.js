/**
 * Ext.ux.panel.CodeMirror example
 * @author Bangtao Zhou - zhoubangtao@gmail.com / http://zhoubangtao.org
 */



Ext.onReady(function () {
  console.log("ready");
  var win = Ext.create("Ext.window.Window", {
    title: 'Examples',
    layout: 'border',
    height: 300,
    width: 800,
    items: [
      {
        xtype: 'tabpanel',
        region: 'center',
        border: false,
        activeTab: 0,

        //frame:true,
        //defaults:{autoHeight: true},
        items: [
          {
            xtype: 'codemirror',
            title: 'Php example',
            sourceCode: '/* paste here somme php code */',
            onSave: function () {
              // save logic here
              // this.codeMirrorEditor gets you access to original code mirror object :)
            },
            codeMirror: {
              height: '100%',
              width: '100%'
            }
          }
        ]
      }
    ]

  }).show();

  // dynamic add of code panel
  var oCodeMirrorPanel = win.down("tabpanel").add({
    xtype: 'panel',
    title: 'JS example',
    closable: true,
    listeners: {
      render: function () {
        this.doLayout();
      }
    },
    sourceCode: '/* paste here somme js code */',
    //layout: 'fit',
    parser: 'js',
    onSave: function () {
      // save logic here
      // this.codeMirrorEditor gets you access to original code mirror object :)
    },
    codeMirror: {
      height: '100%',
      width: '100%'
    }
  });
});
