$(document).ready(function () {

    $(".category-item.delete").click(function (e) {

        var a = $(this);

        bootbox.confirm({
            title: "Remove field?",
            message: "All of its descendants will also be removed.",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function (result) {
                if (result == true) {
                    window.location.href = "/categories/courses/delete?id=" + a.attr("data-id");
                    e.preventDefault();
                }
            }
        });
    });

    $(".category-item.edit").click(function (e) {
        var a = $(this);

        bootbox.prompt(
            "Change course name.",
            function (result) {

                post("/categories/courses/update", {
                    id: a.attr("data-id"),
                    name: result
                });

            });
    })
});