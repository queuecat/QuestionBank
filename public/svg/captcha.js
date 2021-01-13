// 获取页面地址中的参数
function getUrlParams() {
    var paramsAry = location.search.substr(1).split('back=')

    if (paramsAry.length > 1) {
        return paramsAry[1]
    }

    return -1;
}
$.ajax({
    type: 'get',
    url: '/public/captcha',
    success: (res) => {
        // console.log(res);
        $('#captcha').html(res)
    }
});
$('#captcha').on('click', 'svg', function() {
    $.ajax({
        type: 'get',
        url: '/public/captcha',
        success: (res) => {
            // console.log(res);
            $('#captcha').html(res)
        }
    });

});
// 将表单内容转换为对象
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
$('#loginForm').on('submit', function() {
    var result = serializeToJson($(this))
    console.log(result);

    if (result.email.trim().length == 0) //用户没有输入
    {

        // alert('请输入邮箱地址');
        $('.tips').html('请输入邮箱地址');

        // 阻止程序向下执行
        return false;
    }
    if (result.password.trim().length == 0) {
        // alert('请输入密码');
        $('.tips').html('请输入密码');

        // 阻止程序向下执行
        return false;
    }
    if (result.verification.trim().length == 0) {
        // alert('请输入验证码');
        $('.tips').html('请输入验证码');

        // 阻止程序向下执行
        return false;
    }
    var formData = $(this).serialize();
    console.log(formData);
    $.ajax({
        type: 'post',
        url: '/public/login',
        data: formData,
        success: (res) => {
            // 
            console.log('登录成功');
            if (getUrlParams() != -1) {
                // alert(getUrlParams())
                location.href = getUrlParams();
            } else {
                location.href = '/html/index.html';

            }
        },
        error: (xhr) => {
            $('.tips').html(JSON.parse(xhr.responseText).message);
            $('#captcha svg').click();
            // alert(xhr.responseText)
        }
    });
    return false;
});
$('#registerForm').on('submit', function() {
    var result = serializeToJson($(this))
    console.log(result);
    if (result.username.trim().length == 0) //用户没有输入
    {

        // alert('请输入邮箱地址');
        $('.tips').html('请输入邮箱地址');


        // 阻止程序向下执行
        return false;
    }
    if (result.email.trim().length == 0) //用户没有输入
    {

        // alert('请输入邮箱地址');
        $('.tips').html('请输入邮箱地址');


        // 阻止程序向下执行
        return false;
    }
    if (result.password.trim().length == 0) {
        // alert('请输入密码');
        $('.tips').html('请输入密码');

        // 阻止程序向下执行
        return false;
    }
    if (result.verification.trim().length == 0) {
        // alert('请输入验证码');
        $('.tips').html('请输入验证码');

        // 阻止程序向下执行
        return false;
    }
    var formData = $(this).serialize();
    console.log(formData);
    $.ajax({
        type: 'post',
        url: '/public/register',
        data: formData,
        success: (res) => {
            // 
            console.log('注册成功');
            location.href = '/html/login.html';
        },
        error: (xhr) => {
            $('.tips').html(JSON.parse(xhr.responseText).message);
            $('#captcha svg').click();
            // alert(xhr.responseText)
        }
    });
    return false;
});