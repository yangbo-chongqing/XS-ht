(function () {
    function myplugDialog(editor) {
        return {
            title: '添加词条', //窗口标题
            minWidth: 400,
            minHeight: 120,
            buttons: [
                CKEDITOR.dialog.okButton, //对话框底部的确定按钮
                CKEDITOR.dialog.cancelButton], //对话框底部的取消按钮
            contents:      //每一个contents在对话框中都是一个tab页
                [
                   
                ],
            onLoad: function () {
                //alert('onLoad');
            },
            onShow: function () {
                //alert('onShow');
            },
            onHide: function () {
                //alert('onHide');
            },
            onOk: function () {
                //点击 确定 按钮之后触发的事件
                var name = this.getValueOf('user', 'name');
                //从界面上取值的方法，getValueOf( 'contents的id', '控件的id' )
                editor.insertHtml('<a href=' + name + '>' + name + ' : Hello world!' + '</a>');
                //将内容放入到editor
                this.commitContent();
            },
            onCancel: function () {
                //alert('onCancel');
            },
            resizable: CKEDITOR.DIALOG_RESIZE_HEIGHT
        };
    }
    CKEDITOR.dialog.add('myplugDialog', function (editor) {
        return myplugDialog(editor);
    });
})();

