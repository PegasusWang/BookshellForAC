require("index/index.scss");

# avalon
window.render_book_list = (data) ->
    vm_book_list = avalon.define({
        $id: "book_list"
        data: data
        search_data: []
        searching: false
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
                window.loading(50, 1000)
                $.ajax({
                    url: '/loadmore'
                    method: 'POST'
                    data: {
                        skip: vm_book_list.data.$model.length
                    }
                    success: (data) ->
                        window.loading(100, 400)
                        vm_book_list.data.pushArray(data.data_books)
                        
                        

                        if data.data_books.length == 30
                            $(document).scroll scrollLoad
                        else
                            $(".book-list").after("<p class='nomore'>╮(╯_╰)╭只有这些了，再翻也没有啦</p>")
                })
        $(document).scroll scrollLoad

    $(document).ready ->
        # 输入搜索
        $(".nav-search-input input").keyup ->
            query = $(this).val()
            
            if query
                if($(".nomore"))
                    $(".nomore").hide()
                vm_book_list.searching = true
                window.loading(50, 1000)
                $.ajax({
                    url: '/search'
                    method: 'POST'
                    data: {
                        q: query
                    }
                    success: (data) ->
                        window.loading(100, 400)
                        vm_book_list.search_data = data.data_books
                        console.log data.data_books

                        if($(".noresult"))
                            $(".noresult").remove()

                        console.log(data.data_books.length)
                        if data.data_books.length == 0
                            $(".search-results").after("<p class='noresult'>╮(╯_╰)╭没搜到啊~，换个词试试</p>")
                })
            else
                vm_book_list.searching = false  
                if($(".nomore"))
                    $(".nomore").show()      
