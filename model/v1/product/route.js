var express = require('express');
const { request } = require('http');
var router = express.Router();
var middleware = require('../../../middleware/validation');
var multer = require('multer');
var path = require('path');
var auth = require('./product');
const { encryption } = require('../../../middleware/validation');




router.post('/addproduct', function (req, res) {
    // var request = req.body;
    middleware.decryption(req.body, function (request) {

        var rules = {
            category_id: 'required',
            product_name: 'required',
            product_price: 'required',
            product_description: 'required'
        }

        var message = {
            require: req.language.reset_keyword_required_message
        }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.addproduct(request, function (code, message, data) {
                middleware.send_response(req, res, code, message, data)
            })
        }

    })
})

router.post('/addrating', function (req, res) {
    // var request = req.body;
    middleware.decryption(req.body, function (request) {

        var rules = {
            product_id: 'required',
            user_id: 'required',
            product_rating: 'required|numeric|between:1,5'
        }

        var message = {
            require: req.language.reset_keyword_required_message
        }
        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.addProductRating(request, function (code, message, data) {
                middleware.send_response(req, res, code, message, data);
            })
        }
    })
})

router.post('/home', function (req, res) {
    // var request = req.body;
    middleware.decryption(req.body, function (request) {
        var rules = {
            id: 'required'
        }

        var message = {
            require: req.language.reset_keyword_required_message
        }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.homeCategory(request, function (code, message, data) {
                middleware.send_response(req, res, code, message, data)
            })
        }
    })
})

router.post('/listing', function (req, res) {
    // var request = req.body;
    middleware.decryption(req.body, function (request) {
        console.log(request)
        var rules = {
            id: 'required'
        }

        var message = {
            require: req.language.reset_keyword_required_message
        }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.listingGlasses(request, function (code, message, data) {
                middleware.send_response(req, res, code, message, data)
            })
        }
    })
})

router.post('/productdetail', function (req, res) {
    // var request = req.body;
    middleware.decryption(req.body, function (request) {
        console.log(request);
        var rules = {
            id: 'required'
        }

        var message = {
            require: req.language.reset_keyword_required_message
        }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.getProductDetail(request, function (code, message, data) {
                middleware.send_response(req, res, code, message, data);
            })
        }
    })
})

router.post('/search',function(req,res){
    var request = req.body;
    auth.searchIteam(request,function(code,message,data){
        middleware.send_response(req,res,code,message,data);
    })
})

module.exports = router;

// incryption
// productdetail
// listing
// home
// addrating