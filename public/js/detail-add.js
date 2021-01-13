// 获取表单内容
function serializeToJson(form) {
    // 创建一个空对象存放转换的表单信息
    var result = {};
    // 使用jq提供方法，serializeArray方法获取表单内容，返回一个数组，数组中存储元素为对象，该对象包含表单提交元素内容
    var f = form.serializeArray();
    f.forEach(function(item) {
        result[item.name] = item.value;
    });
    return result;
}

// 当有id传入
if (getUrlParams('questionId') !== -1) {
    $('#questionId').val(getUrlParams('questionId'));
}
// 渲染文本域
var simplemde;
var imgArry = [];


function renderMd(res) {
    // 渲染md
    simplemde = undefined;
    // simpleMDE

    simplemde = new SimpleMDE({
        element: document.getElementById('editor'),
        renderingConfig: {
            codeSyntaxHighlighting: true
        },
        // autofocus: true,
        placeholder: 'Markdown supported!',
        autoDownloadFontAwesome: false,

    });

    function getText(fileName) {
        return (simplemde.value().indexOf('<style>p img {width: 70%;}</style>') == -1 ? '<style>p img {width: 70%;}</style>\n' : '') + '![图片描述](' + fileName.split('\\').join('/') + ')\n';
    }
    var options = {
        uploadUrl: '/userAction/upload', //后端上传图片地址
        uploadFieldName: 'img', //上传的文件名
        jsonFieldName: 'img', //返回结果中图片地址对应的字段名称
        progressText: '![图片上传中...]()', //上传过程中用户看到的文案
        errorText: '图片上传失败',
        urlText: getText, //上传成功后插入编辑器中的文案，{filename} 会被替换成图片地址
        // extraHeaders: {
        //     'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        // },
        onFileUploadResponse: function(xhr) {
            console.log(JSON.parse(xhr.responseText).img);
            imgArry.push(JSON.parse(xhr.responseText).img);
        }
    };
    inlineAttachment.editors.codemirror4.attach(simplemde.codemirror, options);
    if (res) {
        simplemde.value(res.question.md);
    }
    return simplemde;
}
// 页面加载渲染出表单
function ajaxreload() {
    var form = template('createTpl', {});
    $('#formBox').html(form);
    simplemde = renderMd();
}
ajaxreload();
// 新建表单提交
$('#formBox').on('submit', '#createform', function() {
    // var formData = $(this).serialize();
    var formData = serializeToJson($(this));
    console.log(formData);
    var mddvalue = simplemde.value();

    var md = simplemde.markdown(mddvalue);
    console.log(md);
    formData.md = mddvalue;
    formData.content = md;
    formData.image = imgArry;
    console.log(formData);


    var id = formData.id;

    delete formData.id;
    if (id == '') {
        $('.info').html('请输入题号!');
        return false;
    }


    $.ajax({
        type: 'POST',
        url: '/userAction/answers/' + id,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: (res) => {
            console.log(res);
            $('.info').css('background-color', '#d0e8a9').html('发布成功');
            setTimeout(function() {
                    ajaxreload();
                }, 1000)
                // location.href = '/html/admin-question-edit.html';

        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info').html(JSON.parse(xhr.responseText).message);

            console.log(xhr)
        }
    });

    return false;
});

// 修改题目
// 获取题目并写入
if (getUrlParams('answerId') !== -1) {
    // $('#questionId').val(getUrlParams('questionId'));
    // simplemde.value(getUrlParams('answerId'));
    // 根据id查询到题解
    $.ajax({
        type: 'GET',
        url: '/public/answers/' + getUrlParams('answerId'),
        success: (res) => {
            console.log(res);

            // $('#questionId').val(res.answer.question._id);
            // $('#titleBox').val(res.answer.title);
            var form = template('modifyTpl', res);
            $('#formBox').html(form);
            renderMd();
            simplemde.value(res.answer.md);
            imgArry = res.answer.image;
        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info').html(JSON.parse(xhr.responseText).message);

            console.log(xhr)
        }
    });
}
// 修改表单提交
$('#formBox').on('submit', '#modifyform', function() {
    // var formData = $(this).serialize();
    var formData = serializeToJson($(this));
    console.log(formData);
    var mddvalue = simplemde.value();

    var md = simplemde.markdown(mddvalue);
    console.log(md);
    formData.md = mddvalue;
    formData.content = md;
    formData.image = imgArry;
    console.log(formData);



    delete formData.id;



    $.ajax({
        type: 'PUT',
        url: '/userAction/answers/' + getUrlParams('answerId'),
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: (res) => {
            console.log(res);
            $('.info').css('background-color', '#d0e8a9').html('发布成功');
            setTimeout(function() {
                    ajaxreload();
                }, 1000)
                // location.href = '/html/admin-question-edit.html';

        },
        error: (xhr) => {
            $('.info').html(JSON.parse(xhr.responseText).message);

            console.log(xhr)
        }
    });

    return false;
});