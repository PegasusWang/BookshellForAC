require("admin/book.scss");

# 添加图书
# 主要完成2个工作:
#   1.单本添加工作 √
#   2.Excel导入
$(document).ready ->
    # task:1
    $("#add-submit").click ->
        $self = $(this)
        validation = true
        $(".fa-check-circle").hide()
        
        $self.parent().find(".aclib-form-item").each( ->
            # 判断 ‘数量’ 是否为数字
            if $(this).find("input").attr("name") is "count"
                if !$.isNumeric($(this).find("input").val())
                    $(this).find("input").focus()
                    $(this).find(".aclib-form-tip").show()
                    validation = false
                    false
                else 
                    $(this).find(".aclib-form-tip").hide()
            else
                # 判断每个字段是否为空
                if !$.trim($(this).find("input").val())
                    $(this).find("input").focus()
                    $(this).find(".aclib-form-tip").show()
                    validation = false
                    false
                else
                    $(this).find(".aclib-form-tip").hide()
        )
        
        # 验证全部通过之后发请求
        if validation
            $(".fa-spinner").show()
            form_data = $self.parent().serialize() 
            $.ajax({
                url: '/admin/addbook'
                type: 'POST'
                data: form_data
                dataType: 'json'
                success: ->
                    $(".fa-spinner").hide()
                    $(".fa-check-circle").show()
            });
        
    # task:2
    $("#excel").change ->
        # 触发submit
        $(this).parent().submit()