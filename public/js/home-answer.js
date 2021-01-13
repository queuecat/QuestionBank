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
        url: '/public/answers',
        data: {

            page: 1,
            count: 10,
            sort,



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

            page,
            count: 10,
            sort,


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