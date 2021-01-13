// 渲染难度分类
var nandu = '';

function reloadnandu() {
    $.ajax({
        type: 'get',
        url: '/public/difficulties',
        success: (res) => {
            console.log(res);
            nandu = '';
            nandu += template('nanduTpl', { res });
            $('#nanduBox').html(nandu);

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
        }
    });
}
reloadnandu();
// 渲染类型分类
var leixing = '';

function reloadleixing() {
    $.ajax({
        type: 'get',
        url: '/public/categories',
        success: (res) => {
            console.log(res);
            leixing = '';
            leixing += template('leixingTpl', { res });
            $('#leixingBox').html(leixing);

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
        }
    });
}
reloadleixing();

// 添加难度分类
function addnandu() {
    console.log($('#addnanduInp').val());
    if ($('#addnanduInp').val().trim().length == 0) {
        // alert('请填写内容');
        console.log('未填写内容');
        return false;
    }
    $.ajax({
        type: 'post',
        url: '/teacher/difficulties',
        data: {
            title: $('#addnanduInp').val()
        },
        success: (res) => {
            console.log(res);
            nandu += `<li class="list-group-item">
            <div style="width: 100%; overflow: hidden;">
                <div style="float: left;">${res.title}</div>
                <div style="float: right;">
                    <div class="btn-group btn-group-xs" role="group" aria-label="..."><button type="button" class="btn btn-success">修改</button></div>
                    <div class="btn-group btn-group-xs" role="group" aria-label="..."><button type="button" class="btn btn-danger">删除</button></div>
                </div>
            </div>
        </li>`;
            $('#nanduBox').html(nandu)

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
        }
    });
}

// 添加类型分类
function addleixing() {
    console.log($('#addleixingInp').val());
    if ($('#addleixingInp').val().trim().length == 0) {
        // alert('请填写内容');
        console.log('未填写内容');
        return false;
    }
    $.ajax({
        type: 'post',
        url: '/teacher/categories',
        data: {
            title: $('#addleixingInp').val()
        },
        success: (res) => {
            console.log(res);
            leixing += `<li class="list-group-item">
            <div style="width: 100%; overflow: hidden;">
                <div style="float: left;">${res.title}</div>
                <div style="float: right;">
                    <div class="btn-group btn-group-xs" role="group" aria-label="..."><button type="button" class="btn btn-success">修改</button></div>
                    <div class="btn-group btn-group-xs" role="group" aria-label="..."><button type="button" class="btn btn-danger">删除</button></div>
                </div>
            </div>
        </li>`;
            $('#leixingBox').html(leixing)

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
        }
    });
}

// 分类修改
// 分类修改
$('#nanduBox').on('click', '#nanduxiugai', function() {

    var value = $(this).parent().siblings().html();
    if (value.slice(0, 6) == '<input') {
        var id = $(this).attr('data-id');
        console.log($(this).parent().siblings().children().val())
        $.ajax({
            type: 'PUT',
            url: '/teacher/difficulties/' + id,
            data: { title: $(this).parent().siblings().children().val() },
            success: (res) => {
                console.log(res);
                reloadnandu();
            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
            }
        });
        return false;
    }
    $(this).parent().siblings().html(`<input id='nanduinput' type="text" class="form-control" placeholder="添加分类" aria-describedby="basic-addon2" id='addleixingInp'>`);
    $(this).parent().siblings().children().val(value).focus();
});
$('#nanduBox').on('blur', '#nanduinput', function() {
    $(this).parent().siblings().children('#nanduxiugai').click();


})
$('#nanduBox').on('keyup', '#nanduinput', function(e) {
    console.log(e.keyCode)
    if (e.keyCode == 13) {
        $(this).parent().siblings().children('#nanduxiugai').click();

    }

});
// 删除难度
$('#nanduBox').on('click', '#nandudelete', function() {
    console.log(1);
    var id = $(this).attr('data-id');
    if (confirm('是否删除该分类？')) {
        $.ajax({
            type: 'DELETE',
            url: '/admin/difficulties/' + id,
            success: (res) => {
                console.log(res);
                reloadnandu();
            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
            }
        });
    }
});
$('#leixingBox').on('click', '#nanduxiugai', function() {

    var value = $(this).parent().siblings().html();
    if (value.slice(0, 6) == '<input') {
        var id = $(this).attr('data-id');
        console.log($(this).parent().siblings().children().val())
        $.ajax({
            type: 'PUT',
            url: '/teacher/categories/' + id,
            data: { title: $(this).parent().siblings().children().val() },
            success: (res) => {
                console.log(res);
                reloadleixing();


            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
            }
        });
        return false;
    }
    $(this).parent().siblings().html(`<input id='leixinginput' type="text" class="form-control" placeholder="添加分类" aria-describedby="basic-addon2" id='addleixingInp'>`);
    $(this).parent().siblings().children().val(value).focus();
});
$('#leixingBox').on('blur', '#leixinginput', function() {
    $(this).parent().siblings().children('#nanduxiugai').click();

    console.log($(this).parent().siblings().children('#nanduxiugai').click())
});
$('#leixingBox').on('keyup', '#leixinginput', function(e) {
    console.log(e.keyCode)
    if (e.keyCode == 13) {
        $(this).parent().siblings().children('#nanduxiugai').click();

    }

});
$('#leixingBox').on('click', '#leixinglete', function() {
    console.log(1);
    var id = $(this).attr('data-id');
    if (confirm('是否删除该分类？')) {
        $.ajax({
            type: 'DELETE',
            url: ' /admin/categories/' + id,
            success: (res) => {
                console.log(res);
                reloadleixing();
            },
            error: (xhr) => {
                alert(JSON.parse(xhr.responseText).message);
            }
        });
    }
});