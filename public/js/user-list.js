// 当前用户id
var id = window.user._id;
var page = 1;
// 渲染列表
$.ajax({
    type: 'get',
    url: '/public/answers',
    data: {
        userId: id,
        page: 1,
        count: 10,
        sort: 0
    },
    success: (res) => {
        // $('#thumbnail').val(res[0].cover)
        // alert('修改成功');
        console.log(res);
        page = res.page;
        var list = template('listTpl', res);
        $('#listBox').html(list);
        var page = template('pageTpl', res);
        $('#pageBox').html(page);
    },
    error: (xhr) => {
        alert(JSON.parse(xhr.responseText).message);

        // alert(JSON.parse(xhr.responseText).message);

    }

});

function ajaxreload() {
    $.ajax({
        type: 'get',
        url: '/public/answers',
        data: {
            userId: id,
            page: 1,
            count: 10,
            sort: 0
        },
        success: (res) => {
            // $('#thumbnail').val(res[0].cover)
            // alert('修改成功');
            console.log(res);
            page = res.page;
            var list = template('listTpl', res);
            $('#listBox').html(list);
            var page = template('pageTpl', res);
            $('#pageBox').html(page);
        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);

            // alert(JSON.parse(xhr.responseText).message);

        }

    });
}

function changePage(page) {
    console.log(page);
    $.ajax({
        type: 'get',
        url: '/public/answers',
        data: {
            userId: id,
            page,
            count: 10,
            sort: 0
        },
        success: (res) => {
            page = res.page;
            console.log(res);
            var list = template('listTpl', res);
            $('#listBox').html(list);
            var page = template('pageTpl', res);
            $('#pageBox').html(page);

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
        }
    });
}
// 删除题解
function deleteF(id) {
    if (confirm('是否删除该文章？')) {
        $.ajax({
            type: 'DELETE',
            url: '/userAction/answers/' + id,
            success: (res) => {
                // alert('删除成功');
                changePage(page);

            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
            }
        });
    }
}

function jump(url) {
    location.href = url;
}