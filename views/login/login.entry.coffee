require("login/login.scss")

$(document).ready ->
    $(".aclib-form").submit (e)->
        e.preventDefault()

        $self = $(this)
        validation = true

        $username = $self.find("input[name='username']");
        $password = $self.find("input[name='password']");

        # password
        if !$.trim($password.val())
            $password.focus().next().show()
            validation = false
            false
        else
            $password.next().hide()

        # username
        if !$.trim($username.val())
            $username.focus().next().show()
            validation = false
            false
        else
            $username.next().hide()

        # 验证全部通过之后发请求
        if validation
            form_data = {
                username: $username.val()
                password: hex_md5($password.val())
            }
            $.ajax({
                url: '/auth/login'
                type: 'POST'
                data: form_data
                dataType: 'json'
                success: (data)->
                    if (data.status == 'admin')
                        window.location.href = "/admin"
                    else
                        window.location.href = "/"
                error: ->
                    $username.focus().next().show()
                    $password.val("").focus().next().show()
            });
