var simplemde = undefined;
va = imgArry = [];
// simpleMDE
function renderSimplemde() {
    simplemde = new SimpleMDE({
        element: $('#editor')[0],
        renderingConfig: {
            codeSyntaxHighlighting: true
        },
        placeholder: 'Markdown supported!',
        // 内容为空时的灰色提示信息

        autoDownloadFontAwesome: false,
        // 不自动下载 fontAwesome, 卡比

        spellChecker: false,
        // 不检查拼写错误
        autofocus: true,
        // 加载完毕自动置焦点

        // autosave: {
        //     // 自动保存
        //     enabled: true,
        //     uniqueId: "autoSaveKey",
        //     // 自动保存时存储在 localStorage 的 key
        //     delay: 1000,
        //     // 自动保存时间间隔，单位 ms
        // },
        tabSize: 4,
        // tab 长度 
    });



    inlineAttachment.editors.codemirror4.attach(simplemde.codemirror, {
        uploadUrl: '/userAction/upload',
        //后端上传图片地址

        uploadFieldName: 'img',
        //上传的文件名

        jsonFieldName: 'img',
        //返回结果中图片地址对应的字段名称

        progressText: '![图片上传中...]()',
        //上传过程中用户看到的文字

        errorText: '图片上传失败',
        //上传失败后用户看到的文字

        urlText: '\n![图片描述]({filename})\n',
        //上传成功后插入编辑器中的文案，{filename} 会被替换成图片地址
        onFileUploadResponse: function(xhr) {
            console.log(JSON.parse(xhr.responseText).img);
            imgArry.push(JSON.parse(xhr.responseText).img);
        }



    });
}
renderSimplemde();