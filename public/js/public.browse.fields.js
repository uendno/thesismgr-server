var lecturers = {};
var hash = window.location.hash;
var page = 1;
var numberOfPages = $("#number-of-pages").text();
var unitID = $("#field-id").text();

$(document).ready(function () {

    if (hash && hash.substring(0, 5) == '#page') {
        page = parseInt(hash.substring(6));
    }

    $('#pagination').pagination({
        items: numberOfPages,
        itemOnPage: 8,
        currentPage: page,
        cssStyle: '',
        prevText: '<span aria-hidden="true">&laquo;</span>',
        nextText: '<span aria-hidden="true">&raquo;</span>',
        onInit: function () {
            // fire first page loading
            getData();
        },
        onPageClick: function (currentPage, evt) {
            // some code
            page = currentPage;
            window.location.hash = "#page-" + page;
            console.log(page);
            if (lecturers[page] == null) {
                getData();
            } else {
                setDataToTable();
            }
        }
    });
});

var success = function (response) {

    NProgress.done();

    if (response.status == true) {

        console.log(response);

        lecturers[page] = [];

        response.data.forEach(function (lecturer) {
            lecturers[page].push(lecturer);
        });

        setDataToTable((page - 1) * 10, response.data.length);

    } else {
        showError(response.message)
    }
};

var getData = function () {

    var data = {
        page: page,
        field_id: unitID
    };

    NProgress.start();

    $.ajax({
        url: "/api/get_lecturers_in_field",
        method: "GET",
        data: data,
        success: success,
        error: errorHandler
    });
};

var setDataToTable = function () {
    $('#lecturer-list').children().remove();

    if (!lecturers[page]) {
        return;
    }

    lecturers[page].forEach(function (lecturer) {
        if (lecturer.lecturer != null) {

            var rank = "";
            if (lecturer.lecturer.rank) {
                rank = lecturer.lecturer.rank;
            }

            var fieldsHTML = "";
            if (lecturer.lecturer.fields && lecturer.lecturer.fields.length > 0) {
                lecturer.lecturer.fields.forEach(function (field) {
                    fieldsHTML = fieldsHTML.concat("<p> - " + field.name + "</p>");
                })
            }

            $('#lecturer-list').append('<div class="col-lg-3 col-md-4">' +
                '<div class="panel panel-primary">' +
                '<div class="panel-heading">' + lecturer.fullName + '</div>' +
                '<div class="panel-body">' +
                '<p><strong>Mã giảng viên: </strong>' + lecturer.officerNumber + '</p>' +
                '<p><strong>Học hàm/ học vị: </strong>' + rank + '</p>' +
                '<p><strong>Các lĩnh vực nghiên cứu: </strong>' + fieldsHTML + '</p>' +
                '</div>' +
                '<div class="panel-footer">' +
                '<a href="/lecturers/' + lecturer.officerNumber + '">Xem thông tin</a>' +
                '</div>' +
                '</div>' +
                '</div>'
            )

        }
    });
};
