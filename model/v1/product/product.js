const common = require('../../../config/common');
var con = require('../../../config/database');
// var global = require('../../../config/constant');
var asyncLoop = require('node-async-loop');

var product = {

    addproduct: function (request, callback) {
        var code = common.productCodeGenerator();
        var productDetail = {
            category_id: request.category_id,
            color_id: request.color_id,
            dimension_id: request.dimension_id,
            product_name: request.product_name,
            code:code,
            product_price: request.product_price,
            discount_type: (request.discount_type == undefined)?'':request.discount_type,
            discount_value: (request.discount_value == undefined)?'0':request.discount_value,
            product_description: request.product_description
        }

        con.query(`INSERT INTO tbl_product SET ?`, [productDetail], function (error, result) {
            if (!error) {
                var id = result.insertId;
                console.log("AAAAAAAA",id);
                product.getProductDetail(id, function (product_data) {
                    // common.sendEmail(request.email, "Welcome to Hotel", `<h4>${request.first_name}You are signup successfully in Hotel</h4>`, function (isSent) {
                    callback('1', 'reset_keyword_success_message', product_data);
                    // })
                })
            } else {
                callback("0", 'reset_keyword_something_wrong_message', error);
            }
        })
    },

    getProductDetail: function(id,callback){
        con.query(`SELECT * FROM tbl_product WHERE id = ?`,[id],function(error,result){
            if(!error){
                callback(result);
            }else{
                callback(null);
            }
        })
    },

    addProductRating: function (request, callback) {
        // console.log(request);
        var productRating = {
            product_id: request.product_id,
            user_id: request.user_id,
            product_rating: request.product_rating
        }

        con.query(`INSERT INTO tbl_product_rating SET ?`, [productRating], function (error, result) {
            if (!error) {
                // con.query(`UPDATE tbl_product SET total_review = (SELECT COUNT(id) FROM tbl_restuarant_rating WHERE resturant_id = tbl_restaurant.id),average_rating = (SELECT AVG(rasturant_rating) FROM tbl_restuarant_rating WHERE resturant_id = tbl_restaurant.id) WHERE id = (SELECT resturant_id FROM tbl_restuarant_rating WHERE resturant_id = tbl_restaurant.id LIMIT 1)`)
                callback("1", "reset_keyword_add_message", result);
            } else {
                console.log(error)
                callback("0", "rating not add, Pls try againe later", null)
            }
        })
    },
}

module.exports = product;