// 渲染题目合集
$.ajax({
    type: 'get',
    url: '/public/questions',
    data: {
        page: 1,
        count: 10,
        sort: 0
    },
    success: (res) => {
        console.log(res);
        var questions = template('questionTpl', res);
        $('#questionBox').html(questions);
        var page = template('pageTpl', res);
        $('#pageBox').html(page)

    },
    error: (xhr) => {
        alert(JSON.parse(xhr.responseText).message);
    }
});


// 渲染类型分类
var leixing = '';
var nandu = [];
$.ajax({
    type: 'get',
    url: '/public/categories',
    success: (res) => {
        leixing = res;
        // 获取分类信息

        $.ajax({
            type: 'get',
            url: '/public/difficulties',
            success: (res) => {
                nandu = res;
                // 渲染到表单中
                var form = template('createFormTpl', { nandu, leixing });
                $('#formBox').html(form);
                simplemde = renderMd();
            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
            }
        });
    },
    error: (xhr) => {
        alert(JSON.parse(xhr.responseText).message);
    }
});

function ajaxreload() {
    $.ajax({
        type: 'get',
        url: '/public/questions',
        data: {
            page: 1,
            count: 10,
            sort: 0
        },
        success: (res) => {
            console.log(res);
            var questions = template('questionTpl', res);
            $('#questionBox').html(questions);
            var page = template('pageTpl', res);
            $('#pageBox').html(page);
            var form = template('createFormTpl', { nandu, leixing });
            $('#formBox').html(form);
            simplemde = renderMd();

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
        }
    });
}

function changePage(page) {
    console.log(page);
    $.ajax({
        type: 'get',
        url: '/public/questions',
        data: {
            page,
            count: 10,
            sort: 0
        },
        success: (res) => {
            console.log(res);
            var questions = template('questionTpl', res);
            $('#questionBox').html(questions);
            var page = template('pageTpl', res);
            $('#pageBox').html(page)

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
        }
    });
}
// 搜索事件
function search(obj) {
    var value = $(obj).siblings().val();
    if (value.trim().length == 0) {
        return false;
    }



    $.ajax({
        type: 'get',
        url: '/public/questions',
        data: {
            page: 1,
            count: 10,
            sort: 0,
            key: value
        },
        success: (res) => {
            console.log(res);
            var questions = template('questionTpl', res);
            $('#questionBox').html(questions);
            var page = template('pageTpl', res);
            $('#pageBox').html(page)

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
        }
    });

}
// 渲染md文本函数
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


// var checked = false;
var xiugaiId = '';
var imgArry = [];


// 修改题目
$('#questionBox').on('click', '#xiugai', function() {
        var id = $(this).attr('data-id');
        xiugaiId = id;
        console.log(id)
        $.ajax({
            type: 'GET',
            url: '/public/questions/' + id,

            success: (res) => {
                console.log(res);
                // var questions = template('questionTpl', res);
                // $('#questionBox').html(questions);
                // var page = template('pageTpl', res);
                // $('#pageBox').html(page)
                res.nandu = nandu;
                res.leixing = leixing;
                imgArry = res.question.image;
                var form = template('EditFormTpl', res);
                $('#formBox').html(form);
                // 渲染md
                simplemde = renderMd(res);
                // checked = true;
            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
            }
        });
    })
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
// 创建新题目
$('#formBox').on('submit', '#questionForm', function() {


    var formData = serializeToJson($(this))
    console.log(formData);
    console.log($(this).serialize())
    var labels = $('#leixingBox').find('label');
    var ids = '';
    labels.each((i, d) => {
        if ($(d).children().is(':checked')) {
            ids += '-' + $(d).attr('data-id');
        }
    });
    console.log(ids.slice(1));
    formData.category = ids.slice(1);
    var mddvalue = simplemde.value();

    var md = simplemde.markdown(mddvalue);
    console.log(md);
    formData.md = mddvalue;
    formData.description = md;
    formData.image = imgArry;
    console.log(formData);

    $.ajax({
        type: 'post',
        url: '/teacher/questions',
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
            console.log(xhr);
        }
    });
    return false;
});
// 保存修改
$('#formBox').on('submit', '#questionEditForm', function() {
    var id = $(this).find('#tijiao').attr('data-id');

    var formData = serializeToJson($(this))
    console.log(formData);
    console.log($(this).serialize())
    var labels = $('#leixingBox').find('label');
    var ids = '';
    labels.each((i, d) => {
        if ($(d).children().is(':checked')) {
            ids += '-' + $(d).attr('data-id');
        }
    });
    console.log(ids.slice(1));
    formData.category = ids.slice(1);
    var mddvalue = simplemde.value();

    var md = simplemde.markdown(mddvalue);
    console.log(md);
    formData.md = mddvalue;
    formData.description = md;
    formData.image = imgArry;
    console.log(formData);

    $.ajax({
        type: 'PUT',
        url: '/teacher/questions/' + xiugaiId,
        data: formData,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: (res) => {
            console.log(res);
            $('.info').css('background-color', '#d0e8a9').html('发布成功');
            setTimeout(function() {
                    ajaxreload();

                }, 1000)
                // ajaxreload();
                // location.href = '/html/admin-question-edit.html';
            checked = false;
            xiugaiId = '';
        },
        error: (xhr) => {
            $('.info').html(JSON.parse(xhr.responseText).message);
            console.log(xhr)
        }
    });
    return false;
});
// 删除事件
$('#questionBox').on('click', '#shanchu', function() {
    var id = $(this).attr('data-id');
    console.log(id);
    if (confirm('是否删除该题目？')) {
        $.ajax({
            type: 'DELETE',
            url: '/teacher/questions/' + id,

            success: (res) => {
                // console.log(res);
                // // var questions = template('questionTpl', res);
                // // $('#questionBox').html(questions);
                // // var page = template('pageTpl', res);
                // // $('#pageBox').html(page)
                // res.nandu = nandu;
                // res.leixing = leixing;

                // var form = template('formTpl', res);
                // $('#formBox').html(form);
                // // 渲染md
                // renderMd(res);
                console.log('删除成功');
                alert('删除成功');
                ajaxreload();

            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
            }
        });
    }

});