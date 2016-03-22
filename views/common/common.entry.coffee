require('lib/font-awesome/css/font-awesome.min.css');
require('common/common.scss');

require('sweetalert/dist/sweetalert.css');
require('sweetalert');

# nav
window.render_nav = (data) ->
    vm_nav = avalon.define({
      $id: "nav"
      nav_search: false
      uid: data.uid
      user: data.user
      isadmin: data.isadmin
    })

    avalon.ready ->
        # 根据pathname更改当前tag
        navBind = (nav_class) ->
            $nav = $(".nav-list")
            $nav.find("li").removeClass("nav-active")
            $nav.find(".nav-" + nav_class).addClass("nav-active")

        activeTag = window.location.pathname.split('/')[1]

        if not activeTag
            navBind("index")
            vm_nav.nav_search = true
        else if activeTag isnt "auth"
            navBind(activeTag)
        else
            navBind("merge")

        # 全局loading方法
        window.loading = (method)->
            if method is "start"
              $(".loading-bar").stop(true, false).fadeIn()
            else
              $(".loading-bar").fadeOut()
            true