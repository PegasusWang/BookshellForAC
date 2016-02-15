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
        
        console.log validation

        # 验证全部通过之后发请求
        if validation
            form_data = $self.serialize() 
            $.ajax({
                url: '/loginpost'
                type: 'POST'
                data: form_data
                dataType: 'json'
                success: (data)->
                    if data.status is 'admin'
                        window.location.href = "/admin?user=" + data.user
                    else if data.status is 'user'
                        window.location.href = "?user=" + data.user
                error: ->
                    $password.focus().next().show()
                    $username.focus().next().show()
            });
