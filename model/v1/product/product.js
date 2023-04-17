const common = require('../../../config/common');
var con = require('../../../config/database');
// var global = require('../../../config/constant');
var asyncLoop = require('node-async-loop');

var product = {

    addproduct: function (request, callback) {
        console.log("reuest", request);
        var code = common.productCodeGenerator();
        var productDetail = {
            category_id: request.category_id,
            color_id: request.color_id,
            dimension_id: request.dimension_id,
            product_name: request.product_name,
            code: code,
            product_price: request.product_price,
            discount_type: (request.discount_type == undefined) ? '' : request.discount_type,
            discount_value: (request.discount_value == undefined) ? '0' : request.discount_value,
            product_description: request.product_description
        }

        con.query(`INSERT INTO tbl_product SET ?`, [productDetail], function (error, result) {
            if (!error) {
                var id = result.insertId;
                console.log("insertedid", id);
                product.getProduct(id, function (product_data) {
                    if (product_data.length > 0) {
                        // common.sendEmail(request.email, "Welcome to Hotel", `<h4>${request.first_name}You are signup successfully in Hotel</h4>`, function (isSent) {
                        callback('1', 'reset_keyword_success_message', product_data);
                        // })
                    } else {
                        callback('0', "reset_keyword_something_wrong_message", null)
                    }
                })
            } else {
                callback("0", 'reset_keyword_something_wrong_message', null);
            }
        })
    },

    getProduct: function (id, callback) {
        console.log("getproductdetail", id);
        con.query(`SELECT * FROM tbl_product WHERE id = ?`, [id], function (error, result) {
            if (!error) {
                callback(result);
            } else {
                callback(null);
            }
        })
    },

    addProductRating: function (request, callback) {
        var productRating = {
            product_id: request.product_id,
            user_id: request.user_id,
            product_rating: request.product_rating
        }

        con.query(`INSERT INTO tbl_product_rating SET ?`, [productRating], function (error, result) {
            if (!error) {
                callback("1", "reset_keyword_add_message", result);
            } else {
                console.log(error)
                callback("0", "rating not add, Pls try againe later", null)
            }
        })
    },

    // homeCategory: function (request, callback) {
    //     con.query(`SELECT * FROM tbl_category WHERE id = ${request.id}`, function (error, result) {
    //         if (!error) {
    //             con.query(`SELECT * FROM tbl_category WHERE parent_id = ${result[0].id}`, function (error, category) {
    //                 if (!error) {
    //                     result[0].category = category;
    //                     callback("1", "reset_keyword_success_message", result)
    //                 } else {
    //                     callback("0", "reset_keyword_something_wrong_message", null);
    //                 }
    //             })
    //         } else {
    //             callback("0", "reset_keyword_data_not_found", null)
    //         }
    //     })
    // },

    homeCategory: function (request, callback) {
        console.log("request", request);
        // var homeCatVal = {
        //     id: (request.id == undefined || request.id == "") ? '' : request.id
        // }
        // console.log('id', homeCatVal.id);
        // var homeSearch = {
        //     search: (request.search == undefined) ? "" : request.search
        // }
        con.query(`SELECT * FROM tbl_category WHERE id = ${request.id} OR category_type LIKE %${request.search}%`, function (error, result) {
            if (!error) {
                // con.query(`SELECT * FROM tbl_category WHERE parent_id = ${result[0].id}`, function (error, category) {
                // if (!error) {
                // result[0].category = category;
                callback("1", "reset_keyword_success_message", result)
                // } else {
                // console.log(error)
                // callback("0", "reset_keyword_something_wrong_message", null);
                // }
                // })
            } else {
                console.log(error)
                callback("0", "reset_keyword_data_not_found", null)
            }
        })
    },

    listingGlasses: function (request, callback) {
        con.query(`SELECT * FROM tbl_category WHERE id = ${request.id}`, function (error, category) {
            if (!error) {
                con.query(`SELECT p.* FROM tbl_product p WHERE p.category_id = ?`, [category[0].id], function (error, glasses) {
                    if (!error) {
                        category[0].no_of_product = glasses.length;
                        category[0].glasses = glasses;
                        callback("1", "reset_keyword_success_message", category);
                    } else {
                        callback("0", "reset_keyword_something_wrong_message", null);
                    }
                })
            } else {
                callback("0", "reset_keyword_something_wrong_message", null);
            }
        })
    },

    getProductDetail: function (request, callback) {
       con.query(`SELECT * FROM tbl_product WHERE id = ${request.id}`,function(error,result){
        if(!error){
            con.query(`SELECT pi.id,pi.product_image FROM tbl_product p JOIN tbl_product_image pi ON p.id = pi.product_id WHERE p.id = ${request.id}`,function(error,image){
                if(!error){
                    result[0].image = image;
                    con.query(`SELECT d.id,d.product_size,d.product_width FROM tbl_product_size ps JOIN tbl_dimension d ON ps.dimesion_id =d.id where ps.product_id = ${request.id}`,function(error,size){
                        if(!error){
                            result[0].product_size = size;
                            con.query(`SELECT c.id,c.color_name,c.color_image FROM tbl_product_color pc JOIN tbl_color c ON pc.color_id = c.id where pc.product_id = ${request.id}`,function(error,color){
                                if(!error){
                                    result[0].product_color = color;
                                    callback("1","success",result)
                                }else{
                                    callback("0","color not found",null);
                                }
                            })
                            // callback("1","success",result);
                        }else{
                            callback("0","size no found",null)
                        }
                    })
                }else{
                    callback("0","image not found",null);
                }
            })
        }else{
            callback("0","data note found",null);
        }
       })
    }
}

module.exports = product;


// SELECT p.*, c.category_type, pd.product_size, pd.product_width, pc.color_name, pc.color_image FROM `tbl_product` p join tbl_category c
// ON p.category_id = c.id
// JOIN product_dimension pd
// ON p.dimension_id = pd.id
// JOIN product_color pc
// ON p.color_id = pc.id
// WHERE p.id = 1;