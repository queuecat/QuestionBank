// 当前用户id
var id = window.user._id;
var usermessage = null;
// 渲染用户信息
$.ajax({
    type: 'GET',
    url: '/userAction/users/' + id,

    success: (res) => {
        console.log(res);
        // alert('发布成功');
        // location.href = '/html/admin-question-edit.html';
        usermessage = res;
        var user = template('userEditTpl', res);
        $('#userEditBox').html(user);

    },
    error: (xhr) => {
        // alert(JSON.parse(xhr.responseText).message);
        $('.info1').html(JSON.parse(xhr.responseText).message);

        console.log(xhr)
    }
});


function ajaxrender() {
    $.ajax({
        type: 'GET',
        url: '/userAction/users/' + id,

        success: (res) => {
            console.log(res);
            // alert('发布成功');
            // location.href = '/html/admin-question-edit.html';
            usermessage = res;
            var user = template('userEditTpl', res);
            $('#userEditBox').html(user);

        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info1').html(JSON.parse(xhr.responseText).message);

            console.log(xhr)
        }
    });
}
// 头像上传
$('#userEditBox').on('change', '#avatar', function() {
    var formData = new FormData();
    console.log(this.files[0]);
    var file = this.files[0];
    if (file == undefined) {
        return false;
    }
    if (file.type.indexOf('image') === -1) {

        $('.info1').html('上传文件不是图片！');


        return false;
    }
    formData.append('avatar', file);
    $.ajax({
        type: 'POST',
        url: '/userAction/upload',
        data: formData,
        processData: false,
        contentType: false,
        success: (res) => {
            // $('#thumbnail').val(res[0].cover)
            $('#avatarBox').attr('src', res.avatar);
            console.log(res.avatar);
            $("#avatarH").val(res.avatar);
        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info1').html(JSON.parse(xhr.responseText).message);

        }

    });
});
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
// 修改提交

$('#userEditBox').on('submit', function() {
    // console.log(1)
    var formData = serializeToJson($(this));
    console.log(formData);
    console.log(user);
    try {
        if (formData.username == user.username) {
            console.log(1)
            delete formData.username;

        }
        if (formData.email == user.email) {
            console.log(2)
            delete formData.email;
            console.log(2)

        }

        if (formData.avatar.replace(/\\/g, '/') == user.avatar.replace(/\\/g, '/')) {
            console.log(123456)
            delete formData.avatar;
        }
    } catch {
        console.log('???')
    }
    console.log(formData);
    console.log(JSON.stringify(formData));
    if (JSON.stringify(formData) == '{}') {
        // alert('未修改任何参数');
        $('.info1').html('未修改任何参数');

        return false;
    }
    $.ajax({
        type: 'PUT',
        url: '/admin/users/' + id,
        data: formData,

        success: (res) => {
            user.username = res.username;
            user.email = res.email;
            user.avatar = res.avatar;
            // $('#thumbnail').val(res[0].cover)
            $('.info1').css('background-color', '#d0e8a9').html('修改成功');
            setTimeout(function() {
                if (formData.email) {


                    location.href = '/html/login.html';

                } else {
                    ajaxrender();

                }
            }, 1000)
            console.log(res);


        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info1').html(JSON.parse(xhr.responseText).message);

            // alert(JSON.parse(xhr.responseText).message);

        }

    });

    return false;
});
// 渲染总结
var views = 0;
var likes = 0;
$.ajax({
    type: 'get',
    url: '/public/answersall',
    data: {
        userId: id
    },
    success: (res) => {
        // $('#thumbnail').val(res[0].cover)
        // alert('修改成功');
        console.log(res);
        for (value in res.answers) {

            views += res.answers[value].meta.views;
            likes += res.answers[value].meta.likes;
        }
        res.views = views;
        res.likes = likes;
        var html = template('countTpl', res);
        $('#countBox').html(html);
    },
    error: (xhr) => {
        // alert(JSON.parse(xhr.responseText).message);
        $('.info').html(JSON.parse(xhr.responseText).message);


        // alert(JSON.parse(xhr.responseText).message);

    }

});

// 修改密码
$('#passwordBox').on('submit', function() {
    var formData = serializeToJson($(this));
    if (formData.newPwd.trim().length == 0) {
        // alert('请输入新密码');
        $('.info').html('请输入新密码');

        return false;
    }
    if (formData.oldPwd.trim().length == 0) {
        // alert('请输入旧密码');
        $('.info').html('请输入旧密码');

        return false;
    }
    console.log(formData);

    $.ajax({
        type: 'PUT',
        url: '/userAction/users',
        data: formData,

        success: (res) => {
            // $('#thumbnail').val(res[0].cover)
            $('.info').css('background-color', '#d0e8a9').html('修改成功');
            setTimeout(function() {
                ajaxrender();
            }, 1000)

            console.log(res);
            $.ajax({
                type: 'post',
                url: '/userAction/logout',
                success: (res) => {

                    location.href = '/html/login.html';
                },
                error: (res) => {
                    // alert(JSON.parse(res.responseText).message);
                    $('.info').html(JSON.parse(xhr.responseText).message);

                    location.href = '/html/login.html';
                }
            });
        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info').html(JSON.parse(xhr.responseText).message);


            // alert(JSON.parse(xhr.responseText).message);

        }

    });

    return false;
})