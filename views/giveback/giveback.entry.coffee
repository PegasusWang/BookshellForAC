require("giveback/giveback.scss");
# loglist
window.render_log_list = (data) ->
    vm_log_list = avalon.define({
        $id: "log_list"
        data: data
    })