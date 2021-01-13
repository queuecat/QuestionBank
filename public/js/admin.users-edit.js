// 渲染用户列表
$.ajax({
    type: 'GET',
    url: '/admin/users',
    data: {
        page: 1,
        count: 10
    },
    success: (res) => {
        console.log(res);
        var users = template('usersTpl', res);
        $('#usersBox').html(users);
        var page = template('pageTpl', res);
        $('#pageBox').html(page);
        var form = template('createFormTpl', res);
        $('#formBox').html(form);
        // location.href = '/html/admin-question-edit.html';

    },
    error: (xhr) => {
        alert(JSON.parse(xhr.responseText).message);
        console.log(xhr)
    }
});

function ajaxreload() {
    $.ajax({
        type: 'get',
        url: '/admin/users',
        data: {
            page: 1,
            count: 10

        },
        success: (res) => {
            console.log(res);
            var users = template('usersTpl', res);
            $('#usersBox').html(users);
            var page = template('pageTpl', res);
            $('#pageBox').html(page)
            var form = template('createFormTpl', res);
            $('#formBox').html(form);
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
        url: '/admin/users',
        data: {
            page,
            count: 10
        },
        success: (res) => {
            console.log(res);
            var users = template('usersTpl', res);
            $('#usersBox').html(users);
            var page = template('pageTpl', res);
            $('#pageBox').html(page)

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
        }
    });
}
// 头像上传
$('#formBox').on('change', '#avatar', function() {
    var formData = new FormData();
    console.log(this.files[0]);
    var file = this.files[0];
    if (file == undefined) {
        return false;
    }
    if (file.type.indexOf('image') === -1) {

        alert('文件不是图片');

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
            $('.info').html(JSON.parse(xhr.responseText).message);

        }

    });
});
// 新建用户
$('#formBox').on('submit', '#createForm ', function() {
    console.log(formData);
    if ($('#avatarH').val() == '') {
        $('#avatarH').val('/images/default.png');
    }
    var formData = $(this).serialize();
    console.log(formData);

    $.ajax({
        type: 'POST',
        url: '/admin/users',
        data: formData,
        success: (res) => {
            // $('#thumbnail').val(res[0].cover)
            ajaxreload();
        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info').html(JSON.parse(xhr.responseText).message);

        }

    });
    return false;
});
// 删除用户
// 删除事件
$('#usersBox').on('click', '#shanchu', function() {
    var id = $(this).attr('data-id');
    console.log(id);
    if (confirm('是否删除该用户？')) {
        $.ajax({
            type: 'DELETE',
            url: '/admin/users/' + id,

            success: (res) => {

                console.log('删除成功');
                alert('删除成功');
                ajaxreload();

            },
            error: (xhr) => {
                // alert(JSON.parse(xhr.responseText).message);
                $('.info').html(JSON.parse(xhr.responseText).message);

            }
        });
    }

});
var userData = {};
// 修改用户信息
$('#usersBox').on('click', '#xiugai', function() {
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'GET',
        url: '/userAction/users/' + id,
        success: (res) => {
            console.log(res);
            var user = template('userEditTpl', res);
            $('#formBox').html(user);
            userData = res;
        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info').html(JSON.parse(xhr.responseText).message);
            if (JSON.parse(xhr.responseText).message == "请您登陆后进行该操作！") {
                location.reload();
            }

        }
    })

});
// 保存修改信息
$('#formBox').on('submit', '#userEditForm', function() {
    var formData = {};
    if (userData.username != $(this).find('input')[0].value) {
        formData.username = $(this).find('input')[0].value;
    }
    if (userData.email != $(this).find('input')[1].value) {
        formData.email = $(this).find('input')[1].value;
    }
    if (userData.avatar != $(this).find('input')[4].value) {
        formData.avatar = $(this).find('input')[4].value;
    }
    formData.password = $(this).find('input')[2].value;
    console.log(formData);
    var data = "";
    for (const arr in formData) {
        data += arr + "=" + formData[arr] + "&";
    }
    data = data.substr(0, data.length - 1);
    data = encodeURI(data);
    console.log(data);
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'put',
        url: '/admin/users/' + id,
        data: data,
        success: (res) => {
            // $('#thumbnail').val(res[0].cover)
            ajaxreload();
        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info').html(JSON.parse(xhr.responseText).message);

        }

    });
    return false;
})