var urlPath = location.pathname;
console.log(urlPath);
$('.teacher').css('display', 'none');
$('.admin').css('display', 'none');
$('.userlogin').on('click', function() {
    location.href = '/html/login.html';
})
var role = window.user.role;
console.log(role);
if (window.isLogin) {
    if (role == 'admin') {
        $('.admin').css('display', 'block');
        console.log('admin');
        $('.mininav').html(`
        
        <li><a href="/html/admin-question-add.html">题目发布</a></li>
                            <li><a href="/html/admin-question-edit.html">题目管理</a></li>
                            <li><a href="/html/admin-label.html">分类管理</a></li>
                            <li><a href="/html/admin-users-edit.html">用户管理</a></li>
        `);
        $('#bignav').html(`                        <li><a href="/html/admin-question-edit.html">题目管理</a></li>

        <li><a href="/html/admin-label.html">分类管理</a></li>
        <li><a href="/html/admin-users-edit.html">用户管理</a></li>`);
    }
    if (role == 'teacher') {
        $('.teacher').css('display', 'block');
        console.log('teacher');
        $('.mininav').html(`<li><a href="/html/admin-question-add.html">题目发布</a></li>
<li><a href="/html/admin-label.html">分类管理</a></li>`);
        $('#bignav').html(`                        <li><a href="/html/admin-question-edit.html">题目管理</a></li>

<li><a href="/html/admin-label.html">分类管理</a></li>
`);
    }
    $('.userlogin').html('<a style="color: #64BF68;" href="/html/user-index.html" class="dropdown-toggle " data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">个人中心</span></a>');
    $('.userlogin').on('click', function() {
        location.href = '/html/user-index.html';
    })


} else {
    $('.userlogin').on('click', function() {
        location.href = '/html/login.html';
    })
}






// 页面跳转函数
function jump(url) {
    location.href = url;
}

function jumpPost(url) {
    $.ajax({
        type: 'post',
        url,
        success: (res) => {
            alert(res.message);
            location.href = '/html/index.html';
        },
        error: (res) => {
            alert(JSON.parse(res.responseText).message);
        }
    })
}
// 获取页面地址中的参数
function getUrlParams(name) {
    var paramsAry = location.search.substr(1).split('&')
    for (var i = 0; i < paramsAry.length; i++) {
        if (paramsAry[i].split('=')[0] == name) {
            return paramsAry[i].split('=')[1]
        }
    }
    return -1;
}