jQuery.fn.extend({
    buildThesisProcesses: function (thesisID, status, role, redirectURL) {

        var o = $(this[0]);

        status.responder.forEach(function (responder, index) {

            if (responder == role) {

                o.append('' +
                    '<button class="btn btn-default" onclick="moveThesisToNextStep(\'' + thesisID + '\', \'' + status.id + '\', \'' + index + '\', \'' + redirectURL + '\', \'' + role + '\')">' + status.buttonTitles[index] + '</button>' +
                    '')
            }
        })

    }
});

function moveThesisToNextStep(thesisID, statusID, selectionIndex, redirectURL, role) {

    if (statusID == 9) {

    }

    var url;
    if (role == 'lecturer' || role == 'student') {
        url = '/theses/api/move-thesis-to-next-status';
    } else {
        url = '/admin/theses/api/move-thesis-to-next-status';
    }

    console.log(url);

    $.ajax({
        data: {
            thesis_id: thesisID,
            index: selectionIndex
        },
        url: url,
        success: function (response) {

            console.log(response.data);

            if (response.status == true) {
                if (redirectURL != 'undefined' && redirectURL != undefined && redirectURL != null) {
                    console.log('a ' + redirectURL);
                    window.location.href = redirectURL;
                } else {
                    console.log('b');
                    window.location.reload();
                }

            } else {
                showError();
            }
        },

        error: errorHandler
    })
}