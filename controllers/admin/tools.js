var getModel = require('express-waterline').getModels;
var createResponse = require('../../helpers/response').createRes;
var docGenHelper = require('../../helpers/gendoc');
var fileSystem = require('fs');
var mailHelper = require('../../helpers/mail');
var mailConfig = require('../../config/mail').transportConfig;
var nodemailer = require('nodemailer');
var _ = require('underscore');
var async = require('async');

/**
 * Lấy view các công cụ
 * @param req
 * @param res
 */
exports.getView = function (req, res) {

    getModel('session').then(function (Session) {
        Session.getAllAvailableSessions(function (error, sessions) {
            if (error) {
                return res.redirect('/500');
            }

            res.render('./admin/tools/tools.ejs', {
                req: req,
                message: req.flash('errorMessage'),
                sessions: sessions
            })
        })
    })
};

/**
 * Export danh sách học viên - giảng viên hướng dẫn
 * @param req
 * @param res
 */
exports.exportStudentAndTutorListAPI = function (req, res) {
    getModel('thesis').then(function (Thesis) {
        Thesis.getAllPopulatedThesisList({
            faculty: req.user.faculty.id,
            status: 4
        }, function (error, theses) {
            if (error) {
                return res.status(400).send(createResponse(false, null, error.message));
            }

            docGenHelper.genStudentAndTutorList(theses, function (error, buffer) {
                if (error) {
                    return res.status(400).send(createResponse(false, null, error.message));
                }

                res.writeHead(200, {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Length': buffer.byteLength
                });
                res.write(buffer);
                res.end();

            })

        })
    })
};

/**
 * Gửi mail nhắc nộp hồ sơ bảo vệ
 * @param req
 * @param res
 */
exports.sendMailForStudentsNeedSubmitFilesAPI = function (req, res) {
    getModel('thesis').then(function (Thesis) {
        Thesis.getAllPopulatedThesisList({
            faculty: req.user.faculty.id,
            status: 5
        }, function (error, theses) {
            if (error) {
                return res.status(400).send(createResponse(false, null, error.message));
            }

            var mailTransporter = nodemailer.createTransport(mailConfig);

            _.forEach(theses, function (thesis) {
                mailHelper.sendMailForStudentsNeedSubmitFiles(thesis.lecturer.user.email,
                    thesis.title,
                    mailConfig.auth.user,
                    mailTransporter
                )
            });

            return res.send(createResponse(true, null, null));

        })
    })
};

/**
 * Xuất danh sách các sinh viên đủ điều kiện bảo vệ
 * @param req
 * @param res
 * @returns {*}
 */
exports.exportProtectableStudentListAPI = function (req, res) {

    req.checkQuery('session_id', 'Invalid session ID').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(createResponse(false, null, errors[0].msg));
    }

    getModel('thesis').then(function (Thesis) {
        Thesis.getAllPopulatedThesisList({
            faculty: req.user.faculty.id,
            session: req.params.session_id,
            status: 9
        }, function (error, theses) {
            if (error) {
                return res.status(400).send(createResponse(false, null, error.message));
            }

            docGenHelper.genCanDefendThesisList(theses, function (error, buffer) {
                if (error) {
                    return res.status(400).send(createResponse(false, null, error.message));
                }

                res.writeHead(200, {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Length': buffer.byteLength
                });
                res.write(buffer);
                res.end();

            })

        })
    })
};

/**
 * API xuất ra danh sách các khóa luận cùng hội đồng phản biện
 * @param req
 * @param res
 */
exports.exportThesisAndCouncilListAPI = function (req, res) {

    req.checkQuery('session_id', 'Invalud session ID').isSessionIDAvailable();

    req.asyncValidationErrors()
        .then(function () {

            var councils;
            var theses;

            async.parallel([
                function (callback) {
                    getModel('council').then(function (Council) {
                        Council.getAllPopulatedCouncilList({
                            session: req.query.session_id
                        }, function (error, results) {
                            if (error) {
                                return callback(error);
                            }

                            councils = results;
                            return callback();
                        })
                    })
                },

                function (callback) {
                    getModel('thesis').then(function (Thesis) {
                        Thesis.getAllPopulatedThesisList({
                            faculty: req.user.faculty.id,
                            status: 11
                        }, function (error, results) {
                            if (error) {
                                return callback(error);
                            }

                            theses = results;
                            return callback();
                        })
                    })
                }
            ], function (errors) {
                if (errors && errors.length > 0) {
                    return res.status(400).send(createResponse(false, null, errors[0].message));
                }

                docGenHelper.genThesisAndCouncilList(theses,councils,function (error,buffer) {
                    if (error) {
                        return res.status(400).send(createResponse(false, null, error.message));
                    }

                    res.writeHead(200, {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'Content-Length': buffer.byteLength
                    });
                    res.write(buffer);
                    res.end();

                });

            });
        })
        .catch(function (errors) {
            return res.status(400).send(createResponse(false, null, errors[0].message));
        });


};