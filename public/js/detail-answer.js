var questionId = getUrlParams('questionId');
console.log(questionId);
if (getUrlParams('aid') != -1) {
    // alert('触发了')
    $('.tijb').addClass('active').siblings().removeClass('active');
    $('.tijm').addClass('now').siblings().removeClass('now');
    answerIdreload(getUrlParams('aid'))
}
// if (questionId == -1) {
//     questionId = prompt('请输入题号');
//     // questionId = '5eabeac7008e6d42a8740229';
// }
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
// 图标点击排他
$('.pt').on('click', function() {
    $('.pt').removeClass("now");
    $(this).addClass("now");
});
$('.ptn').on('click', function() {
    $('.pt').removeClass("now");
    $(this).addClass("active").siblings().removeClass("active");
});
// 页面加载渲染题目
function questionreload() {
    $.ajax({
        type: 'GET',
        url: '/public/questions/' + questionId,
        success: (res) => {
            console.log(res);
            if (res.question.difficulty == null) {
                res.question.difficulty = { title: '常规' };
            }
            if (res.question.category.length == 0) {
                res.question.category = ['常规'];
            }

            if (res.question.author == null) {
                res.question.author = {
                    username: '无名',
                    role: 'student'
                }

            }

            var html = template('questionTpl', res);
            $('#contentBox').html(html);
            // location.href = '/html/admin-question-edit.html';
        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            console.log(xhr)
        }
    });
}
questionreload();
// 点击点赞，对题目进行点赞
$('#contentBox').on('click', '#questionlike', function() {
        console.log(1);
        $.ajax({
            type: 'POST',
            url: '/userAction/likes/questions/' + questionId,
            success: (res) => {
                console.log(res);
                $(this).css('color', 'orange').removeClass('glyphicon glyphicon-heart-empty').addClass('glyphicon glyphicon glyphicon-heart');
                // location.href = '/html/admin-question-edit.html';
                questionreload();
            },
            error: (xhr) => {
                // alert(JSON.parse(xhr.responseText).message);
                // console.log(xhr)
                if (JSON.parse(xhr.responseText).message == "请您登陆后进行该操作！") {
                    // alert('???')
                    var url = location.href;
                    location.href = '/html/login.html?back=' + url;
                }
                $.ajax({
                    type: 'DELETE',
                    url: '/userAction/likes/questions/' + questionId,
                    success: (res) => {
                        console.log(res);
                        $(this).css('color', '#64BF68').removeClass('glyphicon glyphicon glyphicon-heart').addClass('glyphicon glyphicon-heart-empty');
                        questionreload();

                        // location.href = '/html/admin-question-edit.html';
                    },
                    error: (xhr) => {
                        // alert(JSON.parse(xhr.responseText).message);
                        // console.log(xhr)
                        if (JSON.parse(xhr.responseText).message == "请您登陆后进行该操作！") {
                            // alert('???')
                            var url = location.href;
                            location.href = '/html/login.html?back=' + url;
                        }

                    }
                });
            }
        });
    })
    // 点击题目
$('#q').on('click', function() {
    console.log('q');
    console.log(this);
    questionreload();
})

// 点击题解
$('#a').on('click', function() {
        console.log('a');
        $.ajax({
            type: 'GET',
            url: '/public/answers',
            data: {
                questionId,
                page: 1,
                count: 10,
                sort: 0
            },
            success: (res) => {
                console.log(res);

                var html = template('answerlistTpl', res);
                $('#contentBox').html(html);


            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
                console.log(xhr)
            }
        });
    })
    // 点击最优解
$('#pa').on('click', function() {
        console.log('pa');
        // 获取评论
        pareload();
    })
    // 点击发布题解
$('#ada').on('click', function() {
    console.log('ada');
    var html = template('addTpl');
    $('#contentBox').html(html);
    renderMd();
    $('#questionId').val(questionId);
})



// 点击题目
$('li #q').on('click', function() {
    console.log('q');
    questionreload();
    console.log(this)
})

// 点击题解
$('li #a').on('click', function() {
        console.log('a');
        $.ajax({
            type: 'GET',
            url: '/public/answers',
            data: {
                questionId,
                page: 1,
                count: 10,
                sort: 0
            },
            success: (res) => {
                console.log(res);
                for (const author of res.answers) {
                    console.log(author)
                    if (author.author == null) {
                        author.author = {
                            username: '无名',
                            role: 'student'
                        }

                    }
                }
                var html = template('answerlistTpl', res);
                $('#contentBox').html(html);


            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
                console.log(xhr)
            }
        });
    })
    // 选择题解渲染
$('#contentBox').on('click', '#clickanswer', function() {
    console.log('a');

    $.ajax({
        type: 'GET',
        url: '/public/answers/' + $(this).attr('data-id'),
        success: (res) => {
            console.log(res);
            var answer = res;

            $.ajax({
                type: 'GET',
                url: '/public/comments',
                data: {
                    answerId: answer.answer._id,
                    page: 1,
                    count: 10
                },
                success: (res) => {
                    console.log(res);
                    answer.comment = res;
                    console.log(answer);
                    var html = template('answerTpl2', answer);
                    $('#contentBox').html(html);

                },
                error: (xhr) => {
                    alert(JSON.parse(xhr.responseText).message);
                    console.log(xhr)
                }
            });

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
            console.log(xhr)
        }
    });
})

// 指定题解Id渲染
function answerIdreload(Id) {
    $.ajax({
        type: 'GET',
        url: '/public/answers/' + Id,
        success: (res) => {
            console.log(res);
            var answer = res;
            questionId = res.answer.question._id;
            // alert(questionId)
            $.ajax({
                type: 'GET',
                url: '/public/comments',
                data: {
                    answerId: answer.answer._id,
                    page: 1,
                    count: 10
                },
                success: (res) => {
                    console.log(res);
                    answer.comment = res;
                    console.log(answer);
                    var html = template('answerTpl2', answer);
                    $('#contentBox').html(html);

                },
                error: (xhr) => {
                    alert(JSON.parse(xhr.responseText).message);
                    console.log(xhr)
                }
            });

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
            console.log(xhr)
        }
    });
}
// 题解列表换页函数
function changePageoflist(page) {
    console.log(page);
    $.ajax({
        type: 'GET',
        url: '/public/answers',
        data: {
            questionId,
            page,
            count: 10,
            sort: 1
        },
        success: (res) => {
            console.log(res);
            for (const author of res.answers) {
                console.log(author)
                if (author.author == null) {
                    author.author = {
                        username: '无名',
                        role: 'student'
                    }

                }
            }
            var html = template('answerlistTpl', res);
            $('#contentBox').html(html);


        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
            console.log(xhr)
        }
    });
}
// 点击最优解
function pareload() {
    $.ajax({
        type: 'GET',
        url: '/public/answers',
        data: {
            questionId,
            role: 'admin',
            page: 1,
            count: 10,
            sort: 1
        },
        success: (res) => {
            console.log(res);
            var html = template('answerlistTpl', res);
            $('#contentBox').html(html);
        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
            console.log(xhr)
        }
    });
}
$('li #pa').on('click', function() {
        console.log('pa');
        // 获取评论
        pareload();

    })
    // 题解评论
$('#contentBox').on('submit', '#commentform', function() {
        $.ajax({
            type: 'POST',
            url: '/userAction/comments/' + $(this).attr('data-id'),
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                answerIdreload($(this).attr('data-id'));

            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
                console.log(xhr)
            }
        });
        return false;
    })
    // 题解点赞
$('#contentBox').on('click', '#answerlike', function() {
        console.log(11);
        $.ajax({
            type: 'POST',
            url: '/userAction/likes/answers/' + $(this).attr('data-id'),
            success: (res) => {
                console.log(res);
                $(this).css('color', 'orange').removeClass('glyphicon glyphicon-heart-empty').addClass('glyphicon glyphicon glyphicon-heart');
                // location.href = '/html/admin-question-edit.html';
                answerIdreload($(this).attr('data-id'));

            },
            error: (xhr) => {
                // alert(JSON.parse(xhr.responseText).message);
                // console.log(xhr)
                if (JSON.parse(xhr.responseText).message == "请您登陆后进行该操作！") {
                    // alert('???')
                    var url = location.href;
                    location.href = '/html/login.html?back=' + url;
                }
                $.ajax({
                    type: 'DELETE',
                    url: '/userAction/likes/answers/' + $(this).attr('data-id'),
                    success: (res) => {
                        console.log(res);
                        $(this).css('color', '#64BF68').removeClass('glyphicon glyphicon glyphicon-heart').addClass('glyphicon glyphicon-heart-empty');
                        answerIdreload($(this).attr('data-id'));


                        // location.href = '/html/admin-question-edit.html';
                    },
                    error: (xhr) => {
                        // alert(JSON.parse(xhr.responseText).message);
                        // console.log(xhr)
                        if (JSON.parse(xhr.responseText).message == "请您登陆后进行该操作！") {
                            // alert('???')
                            var url = location.href;
                            location.href = '/html/login.html?back=' + url;
                        }
                    }
                });
            }
        });
    })
    // 题解评论换页函数
function changePage(page, id) {
    console.log(page);
    // alert(id)
    $.ajax({
        type: 'GET',
        url: '/public/answers/' + id,

        success: (res) => {
            console.log(res)
            var answer = res;

            $.ajax({
                type: 'GET',
                url: '/public/comments',
                data: {
                    answerId: answer.answer._id,
                    page,
                    count: 10
                },
                success: (res) => {
                    console.log(res);
                    answer.comment = res;
                    var html = template('answerTpl', answer);
                    $('#contentBox').html(html);

                },
                error: (xhr) => {
                    alert(JSON.parse(xhr.responseText).message);
                    console.log(xhr)
                }
            });

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
            console.log(xhr)
        }
    });
}
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

// 点击发布题解
$('li #ada').on('click', function() {
    console.log('ada');
    var html = template('addTpl');
    $('#contentBox').html(html);
    renderMd();
    $('#questionId').val(questionId);
});

// 发布题解表单提交
$('#contentBox').on('submit', '#createform', function() {
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



    $.ajax({
        type: 'POST',
        url: '/userAction/answers/' + id,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: (res) => {
            console.log(res);
            // alert('发布成功');
            $('.info').css('background-color', '#d0e8a9').html('发布成功');
            setTimeout(function() {
                    $('li #ada').click();
                }, 1000)
                // location.href = '/html/admin-question-edit.html';

        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info').html(JSON.parse(xhr.responseText).message);
            if (JSON.parse(xhr.responseText).message == "请您登陆后进行该操作！") {
                // alert('???')
                var url = location.href;
                location.href = '/html/login.html?back=' + url;
            }
            console.log(xhr)
        }
    });

    return false;
});