require("index/index.scss");

# booklist
window.render_book_list = (data) ->
    $book_panel = $(".book-panel")

    $(window).scroll ->
        $book_panel.fadeOut(300)

    vm_book = avalon.define({
        $id: "book"
        data: undefined
        action: ""
        borrow: ->
            if avalon.vmodels.nav.$model.uid 
                book = vm_book.data.$model
                swal(
                    {
                        title: "借阅确认"
                        text: "《" + book.title + "》"
                        type: "info"
                        showCancelButton: true
                        confirmButtonText: "确认借阅"
                        cancelButtonText: "取消"
                        closeOnConfirm: false
                        html: false
                    }, 
                    -> 
                        $.ajax({
                            url: '/book/borrow'
                            method: 'POST'
                            data: {
                                bid: book._id
                            }
                            success: (data) ->
                                console.log data
                                if data.status == 'ok'
                                    book.locate = data.locate
                                    vm_book.action = "giveback"
                                    swal("借阅成功!", "《" + book.title + "》", "success" )
                                    vm_book.hide()
                                else 
                                    swal("借阅失败!", data.err, "error")
                        })
                )
            else
                window.location.href = "/auth/login"

        giveback: ->
            if avalon.vmodels.nav.uid
                book = vm_book.data.$model
                swal(
                    {
                        title: "还书确认"
                        text: "《" + book.title + "》"
                        type: "info"
                        showCancelButton: true
                        confirmButtonText: "确认还书"
                        cancelButtonText: "取消"
                        closeOnConfirm: false
                        html: false
                    }, 
                    -> 
                        $.ajax({
                            url: '/book/giveback'
                            method: 'POST'
                            data: {
                                bid: book._id
                            }
                            success: (data) ->
                                if data.status == 'ok'
                                    book.locate = data.locate
                                    vm_book.action = "borrow"
                                    swal("还书成功!", "《" + book.title + "》", "success" )
                                else 
                                    swal("还书失败!", data.err, "error")
                        })
                )
            else
                window.location.href = "/auth/login"
    })

    vm_book_list = avalon.define({
        $id: "book_list"
        data: data
        search_data: []
        searching: false
        go: (item) ->
            if vm_book.data and item.$model._id == vm_book.data.$model._id
                $book_panel.fadeToggle(100)
            else
                vm_book.data = item
                $book_panel.fadeIn(100)

            if vm_book.data.locate.indexOf(avalon.vmodels.nav.uid) < 0
                vm_book.action = "borrow"
            else
                vm_book.action = "giveback"
    })

    avalon.ready ->
        # 下拉加载
        scrollLoad = ->
            domHeight = $(document).height()
            scrollTop = $(document).scrollTop()
            winHeight = $(window).height()

            if scrollTop + 200 + winHeight >= domHeight
                # 加载更多
                $(document).unbind("scroll")
                window.loading('start')
                $.ajax({
                    url: '/loadmore'
                    method: 'POST'
                    data: {
                        skip: vm_book_list.data.$model.length
                    }
                    success: (data) ->
                        window.loading('end')
                        vm_book_list.data.pushArray(data.data_books)

                        if data.data_books.length == 30
                            $(document).scroll scrollLoad
                        else
                            $(".nomore").show()
                })
        $(document).scroll scrollLoad

    $(document).ready ->

        search = (query) ->  
            if query
                if($(".nomore"))
                    $(".nomore").hide()
                vm_book_list.searching = true
                window.loading('start')
                
                $.ajax({
                    url: '/search'
                    method: 'POST'
                    data: {
                        q: query
                    }
                    success: (data) ->
                        vm_book_list.search_data = data.data_books

                        $(".noresult").hide()

                        if data.data_books.length == 0
                            $(".noresult").show()

                        window.loading('end')
                })
            else
                vm_book_list.searching = false  
                if($(".nomore"))
                    $(".nomore").show()

        # 输入搜索
        $(".nav-search-input input").keyup ->
            search($(this).val())

        # 分类
        $(".cat-link").parent().click ->
            if !$(this).hasClass("active")
                $(this).siblings().removeClass("active")
                $(this).addClass("active")

                query = $(this).find(".cat-link").text()

                if query is "全部"
                    query = ""
                
                search(query)
