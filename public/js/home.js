var sort = 2;
// 点击切换排序
// 颜色排他
$('.sort').on('click', function() {
        $('.sort').removeClass("active");
        $(this).addClass("active");
    })
    // 点击不同排行
$('#sortviews').on('click', function() {
    sort = 2;
    reloadqestion();
})
$('#sortnandu').on('click', function() {
    sort = 1;
    reloadqestion();
})
$('#sortnew').on('click', function() {
    sort = 0;
    reloadqestion();
})

// 渲染初始题目函数
function reloadqestion() {
    $.ajax({
        type: 'get',
        url: '/public/questions',
        data: {
            categories: fenleilistId,
            page: 1,
            count: 10,
            sort,
            difficulties: nanduId,
            key

        },
        success: (res) => {

            console.log(res);
            for (const author of res.questions) {
                console.log(author)
                if (author.author == null) {
                    author.author = {
                        username: '无名',
                        role: 'student'
                    }

                }
            }
            var list = template('questionlistTpl', res);
            $('#listBox').html(list);
            var page = template('pageTpl', res);
            $('#pageBox').html(page);
            // var page = template('pageTpl', res);
            // $('#pageBox').html(page);
        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);

            // alert(JSON.parse(xhr.responseText).message);

        }

    });
}
reloadqestion();
// 列表换页函数
function changePageoflist(page, url) {
    console.log(page);
    $.ajax({
        type: 'GET',
        url,
        data: {
            categories: fenleilistId,
            page,
            count: 10,
            sort,
            difficulties: nanduId,
            key
        },
        success: (res) => {
            console.log(res);
            for (const author of res.questions) {
                console.log(author)
                if (author.author == null) {
                    author.author = {
                        username: '无名',
                        role: 'student'
                    }

                }
            }
            var list = template('questionlistTpl', res);
            $('#listBox').html(list);
            var page = template('pageTpl', res);
            $('#pageBox').html(page);

        },
        error: (xhr) => {
            alert(JSON.parse(xhr.responseText).message);
            console.log(xhr)
        }
    });
}
// 渲染分类
$.ajax({
    type: 'get',
    url: '/public/categories',
    success: (res) => {

        console.log(res);
        var fenlei = template('fenleiTpl', { data: res });
        $('#fenleiBox').html(fenlei);
        var minifenlei = template('minifenleiTpl', { data: res });
        $('#minifenleiBox').html(minifenlei);
    },
    error: (xhr) => {
        alert(JSON.parse(xhr.responseText).message);

        // alert(JSON.parse(xhr.responseText).message);

    }

});
// 当分类被选中
var fenleilist = [];
var fenleilistId = [];
$('#fenleiBox').on('change', 'input', function() {
        // console.log($('#fenleiBox').find('input:checked'));

        // $('#fenleiBox').find('input:checked').each((index, dom) => {
        //     console.log(index);
        //     console.log(dom);
        //     var value = $(dom).val();
        //     fenleilist.push(value);
        // })
        console.log(fenleilist.indexOf($(this).val()))
        if (fenleilist.indexOf($(this).val()) != -1) {
            fenleilist.splice(fenleilist.indexOf($(this).val()), 1);
            fenleilistId.splice(fenleilistId.indexOf($(this).attr('data-id')), 1);

        } else {
            fenleilist.push($(this).val());
            fenleilistId.push($(this).attr('data-id'));
        }





        console.log(fenleilist);
        console.log(fenleilistId);
        var list = template('fenleilistTpl', { data: fenleilist });
        $('#fenleilistBox').html(list);
        reloadqestion();
    })
    // 当点击了X号
function outlist(val) {
    console.log(val);
    $('#fenleiBox').find('input:checked').each((index, dom) => {
        if (val == $(dom).val()) {
            console.log($(dom).val());
            $(dom).click();
        }
    });
}
// 渲染难度
$.ajax({
    type: 'get',
    url: '/public/difficulties',
    success: (res) => {

        console.log(res);
        var nandu = template('nanduTpl', { data: res });
        $('#nanduBox').html(nandu);

    },
    error: (xhr) => {
        alert(JSON.parse(xhr.responseText).message);

        // alert(JSON.parse(xhr.responseText).message);

    }

});
// 点击难度渲染
var nanduId = [];
$('#nanduBox').on('click', 'a', function() {
    console.log($(this).html());
    if ($(this).attr('data-id') == 000) {
        nanduId = [];
    } else {
        nanduId = [$(this).attr('data-id')];
        console.log($(this).attr('data-id'));
    }

    $('#fenleicontent').html($(this).html());
    reloadqestion();
});
// 当搜索框点击搜索
var key = ' ';
$('#searchform').on('submit', function() {
    console.log('aa');
    console.log($('#searchinput').val())
    if ($('#searchinput').val().trim().length == 0) {
        return false;
    }
    key = $('#searchinput').val();
    reloadqestion();
    // $('#searchinput').val('');
    return false;
});
// 点击小屏幕排序
$('#pt0').on('click', function() {
    $('#ptcontent').html($(this).html())
    sort = 0;
    reloadqestion();
})
$('#pt1').on('click', function() {
    $('#ptcontent').html($(this).html())
    sort = 1;
    reloadqestion();
})
$('#pt2').on('click', function() {
    $('#ptcontent').html($(this).html())
    sort = 2;
    reloadqestion();
});
// 点击小屏幕分类
$('#minifenleiBox').on('click', 'li', function() {
    console.log(fenleilistId);

    console.log($(this).html());
    if ($(this).html().indexOf('<') != -1) {
        var value = $(this).text();
        console.log(value)
        $(this).html(value);
        fenleilistId.splice(fenleilistId.indexOf($(this).attr('data-id')), 1);
        console.log(fenleilistId);
    } else {
        $(this).html($(this).html() + '<span class="glyphicon glyphicon-ok ok"></span>');
        fenleilistId.push($(this).attr('data-id'));
        console.log(fenleilistId);

    }

    reloadqestion();
});
// 点击小屏幕搜索
$('#searchbtn').on('click', function() {
    if ($('#minisearchinput').val().trim().length == 0) {
        return false;
    }
    key = $('#minisearchinput').val();
    $('#minisearchinput').val('');
    reloadqestion();
})