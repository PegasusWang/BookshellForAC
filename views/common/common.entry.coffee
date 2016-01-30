require('lib/font-awesome/css/font-awesome.min.css');
require('common/common.scss');

$(document).ready ->
    # 根据pathname更改当前tag
    navBind = (nav_class) ->
        $nav = $(".nav-list")
        $nav.find("li").removeClass("nav-active")
        $nav.find(".nav-" + nav_class).addClass("nav-active")

    activeTag = window.location.pathname.split('/')[1]

    if not activeTag or activeTag is "index"
        navBind("index")
    else if activeTag is "about"
        navBind("about")

    # 全局loading方法
    window.loading = (progress, speed)->
        $loadingbar = $(".loading-bar")
        currentWidth = $loadingbar.css("width")
    
        # 如果已经执行完毕那么重置进度
        if currentWidth is $loadingbar.parent().css("width")
          currentWidth = 0
        # 如果当前progress不是100% 则不隐藏
        if progress isnt 100 && currentWidth is 0
          $loadingbar.css({width: 0})
                   .stop(true, true)
                   .show()
                   .animate({width: progress + "%"}, speed, null)
        else
          $loadingbar.animate({width: progress + "%"}, speed, null)
                   .fadeOut(400)
        true