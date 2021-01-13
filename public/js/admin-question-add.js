// 渲染分类
$.ajax({
    type: 'get',
    url: '/public/difficulties',
    success: (res) => {
        console.log(res);
        var nandu = template('nanduTpl', { res });
        $('#nanduBox').html(nandu);

    },
    error: (xhr) => {
        alert(JSON.parse(xhr.responseText).message);
    }
});
$.ajax({
    type: 'get',
    url: '/public/categories',
    success: (res) => {
        console.log(res);
        var leixing = template('leixingTpl', { res });
        $('#leixingBox').html(leixing);

    },
    error: (xhr) => {
        alert(JSON.parse(xhr.responseText).message);
    }
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
$('#question').on('submit', function() {
    // var formData = $(this).serialize();
    var formData = serializeToJson($(this))

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
    console.log(formData);

    $.ajax({
        type: 'POST',
        url: '/teacher/questions',
        data: formData,
        success: (res) => {
            console.log(res);
            // alert('发布成功');
            $('.info').css('background-color', '#d0e8a9').html('发布成功');
            setTimeout(function() {
                location.href = '/html/admin-question-edit.html';

            }, 1000)

        },
        error: (xhr) => {
            // alert(JSON.parse(xhr.responseText).message);
            $('.info').html(JSON.parse(xhr.responseText).message);
            console.log(xhr)
        }
    });

    return false;
})