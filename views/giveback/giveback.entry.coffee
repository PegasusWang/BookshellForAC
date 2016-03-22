require("giveback/giveback.scss");
# loglist
window.render_log_list = (data) ->
    vm_log_list = avalon.define({
        $id: "log_list"
        data: data
        giveback: (elem)->
            if avalon.vmodels.nav.uid
                book = elem.$model
                console.log elem
                swal({
                        title: "还书确认"
                        text: "《" + book.bname + "》"
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
                                bid: book.bid
                            }
                            success: (data) ->
                                if data.status == 'ok'
                                    swal({
                                        title: "还书成功!"
                                        text: "《" + book.bname + "》"
                                        type: "success" 
                                        },
                                        ->
                                            window.location.reload()
                                    )
                                else 
                                    swal("还书失败!", data.err, "error")
                        })
                )
            else
                window.location.href = "/auth/login"
    })