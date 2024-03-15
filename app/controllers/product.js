const Product = require("../models/product.js");
const Orders = require("../models/product_order.js");
const OrderItems = require("../models/order_items.js");
const Category = require("../models/categories.js");
const AppSettings = require("../models/app_settings.js");
const productImages = require("../models/product_images.js");
const Wishlist = require("../models/wishlist.js");
const moment = require('moment');
const productReview = require("../models/product_review.js");

exports.getProductListing = (req, res) => {
    const { user_id, search_text, product_id,sort_by, min_price, max_price, selected_category_id, page } = req.body;

    var uid = 0

    if (user_id != undefined && user_id != "") {
        uid = user_id;
    }

    var sortBy = ''
    if(sort_by != undefined && sort_by != ""){
        sortBy = sort_by
    }

    var minPrice = ''
    if(min_price != undefined && min_price != ""){
        minPrice = min_price
    }

    var maxPrice = ''
    if(max_price != undefined && max_price != ""){
        maxPrice = max_price
    }

    var selectedCategory = ''
    if(selected_category_id != undefined && selected_category_id != ""){
        selectedCategory = selected_category_id
    }

    var pages = page;

    var limit = '10';

    if (pages == '') {
        pages = '1';
        sp = 0;
    }
    else {
        pages = pages;
        sp = (pages - 1) * limit;
    }

    var searchText = '';
    if (search_text != undefined && search_text != '') {
        searchText = search_text;
    }

    var productId = '';
    if (product_id != undefined && product_id != '') {
        productId = product_id;
    }

    Product.getproductListCount(uid,sortBy,minPrice,maxPrice,selectedCategory,searchText, productId, (err, products) => {
        if (products) {
            var getcount = products.length;
            var totalpage = Math.ceil(getcount / limit);
            Product.getproductList(uid,sortBy,minPrice,maxPrice,selectedCategory,searchText, productId, sp, limit, (err, data) => {
                    var newProducts = [];
                    var proData = data;
                    proData.forEach(function (pro) {
                        var obj = {};
                        obj['id'] = pro.id;
                        obj['category_id'] = pro.category_id;
                        obj['name'] = pro.name;
                        obj['description'] = pro.description;
                        obj['price'] = pro.price;
                        obj['is_available'] = pro.is_available;
                        obj['company_name'] = pro.company_name;
                        obj['avg_rating'] = pro.avg_rating ? pro.avg_rating : 0;
                        obj['total_review'] = pro.total_review ? pro.total_review : 0;
                        obj['category_name'] = pro.category_name;
                        obj['image'] = pro.image;
                        obj['is_favourite'] = pro.is_favourite;
                        obj['total_like'] = pro.total_like;
                        newProducts.push(obj);
                    });
                    return res.send({
                        status: "SUCCESS",
                        message: 'Product List fetch successfully.',
                        data: newProducts,
                        total_page: totalpage,
                        page: pages
                    })
            })
        }
        else {
            return res.send({
                status: "SUCCESS",
                message: "Product List fetch successfully.",
                data: [],
                total_page: 0,
                page: '1'
            })
        }
    })

};

exports.getOrdersListing = (req, res) => {
    const { user_id, unique_order_id, find_order } = req.body;

    let errors = '';

    if (!unique_order_id) {
        errors = 'unique order id is required.';
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    Orders.getordersList(unique_order_id, (err, data) => {
        if (data) {
            var order_id = data.id
            if (find_order == '0') {

            }
            OrderItems.getordersItems(user_id, order_id, (err, order) => {
                if (order.length > 0) {
                    var newOrders = [];
                    var proData = order;
                    proData.forEach(function (pro) {
                        var obj = {};
                        obj['order_id'] = pro.order_id;
                        obj['id'] = pro.id;
                        obj['category_id'] = pro.category_id;
                        obj['price'] = pro.price;
                        obj['quantity'] = pro.quantity;
                        obj['total_price'] = pro.total_price;
                        obj['status'] = pro.status;
                        obj['under_process_date'] = pro.under_process_date ? pro.under_process_date : "";
                        obj['dispatched_date'] = pro.dispatched_date ? pro.dispatched_date : "";
                        obj['received_date'] = pro.received_date ? pro.received_date : "";
                        obj['cancelled_date'] = pro.cancelled_date ? pro.cancelled_date : "";
                        obj['name'] = pro.name;
                        obj['description'] = pro.description;
                        obj['company_name'] = pro.company_name;
                        obj['rating'] = pro.rating ? pro.rating : 0;
                        obj['review'] = pro.review ? pro.review : "";
                        obj['is_rating'] = pro.is_rating;
                        obj['image'] = pro.image;
                        newOrders.push(obj);
                    });

                    OrderItems.checkordersItemsCancel(order_id, (err, cancelItem) => {
                        if (find_order == '0') {
                            OrderItems.getCancelOrdersItems(order_id, (err, cancelp) => {
                                var totalPrice
                                if (cancelp.price !== null) {
                                    totalPrice = cancelp.price
                                }
                                else {
                                    totalPrice = 0;
                                }
                                var Total = parseInt(data.total_price) - parseInt(totalPrice)
                                var orderTotal = parseInt(Total) + parseInt(data.total_shipping)
                                return res.send({
                                    status: "SUCCESS",
                                    message: 'Order List fetch successfully.',
                                    data: newOrders,
                                    total_price: Total,
                                    total_shipping: data.total_shipping,
                                    order_total: orderTotal,
                                    is_cancel: cancelItem.length == 0 ? 1 : 0
                                })
                            })
                        }
                        else {
                            return res.send({
                                status: "SUCCESS",
                                message: 'Order List fetch successfully.',
                                data: newOrders,
                                total_price: data.total_price,
                                total_shipping: data.total_shipping,
                                order_total: data.order_total,
                                is_cancel: cancelItem.length == 0 ? 1 : 0
                            })
                        }
                    })
                }
                else {
                    return res.send({
                        status: "ERROR",
                        message: 'Something went wrong.',
                        data: [],
                    })
                }

            })
        }
        else {
            return res.send({
                status: "ERROR",
                message: 'Order not found.',
                data: [],
            })
        }
    })

};


exports.addOrder = (req, res) => {
    const { name, user_id, phone, address, delivery_instructions, total_shipping, total_price, order_total, product_id, quantity } = req.body;

    let errors = '';

    if (!name) {
        errors = 'Name is required.';
    }
    else if (!user_id) {
        errors = 'user_id is required.';
    }
    else if (!phone) {
        errors = 'Phone number is required.';
    }
    else if (!address) {
        errors = 'Address is required.';
    }
    else if (!total_shipping) {
        errors = 'total shipping is required.';
    }
    else if (!total_price) {
        errors = 'Total price is required.';
    }
    else if (!order_total) {
        errors = 'Order total is required.';
    }
    else if (!quantity) {
        errors = 'quantity is required.';
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }
    var qty = quantity.split(',');
    var unique = new Date().valueOf();
    var val = String(unique).substring(3, 13);
    const orderData = new Orders({
        unique_order_id: val,
        user_id: user_id,
        name: name,
        phone: phone,
        address: address,
        delivery_instructions: delivery_instructions,
        total_shipping: total_shipping,
        total_price: total_price,
        order_total: order_total
    })

    Orders.addOrder(orderData, (err, order) => {
        order_id = order
        Product.getproductsById(product_id, (err, product) => {
            if (product.length > 0) {
                var proData = product;
                for (let i = 0; i < proData.length; i++) {
                    var Price = proData[i].price
                    var orderitems = new OrderItems({
                        order_id: order_id,
                        product_id: proData[i].id,
                        category_id: proData[i].category_id,
                        price: Price,
                        quantity: parseInt(qty[i]),
                        total_price: Price * parseInt(qty[i]),

                    })
                    OrderItems.addordersItems(orderitems, (err, addItems) => {
                    })
                }
                return res.send({
                    status: "SUCCESS",
                    message: '',
                    data: { unique_order_id: val },
                })
            }
            else {
                return res.send({
                    status: "ERROE",
                    message: '',
                    data: {},
                })
            }
        })
    })

};


exports.getCategoriesList = (req, res) => {

    Category.getCategoriesList((err, data) => {
        if (data) {
            return res.send({
                status: "SUCCESS",
                message: 'Categories List fetch successfully.',
                data: data,
            })
        }
        else {
            return res.send({
                status: "ERROR",
                message: 'Something went wrong.',
                data: [],
            })
        }
    })

};


exports.getAppSettings = (req, res) => {

    AppSettings.getAppSettings((err, data) => {
        if (data) {
            return res.send({
                status: "SUCCESS",
                message: '',
                data: data,
            })
        }
        else {
            return res.send({
                status: "ERROR",
                message: '',
                data: {},
            })
        }
    })

};


exports.getProductImages = (req, res) => {
    const { product_id } = req.body;

    let errors = '';

    if (!product_id) {
        errors = 'product id is required.';
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    productImages.getProductImage(product_id, (err, data) => {
        if (data) {
            return res.send({
                status: "SUCCESS",
                message: '',
                data: data
            })
        }
        else {
            return res.send({
                status: "ERROR",
                message: '',
                data: [],
            })
        }
    })

};

exports.getUserOrdersListing = (req, res) => {
    const { user_id, page } = req.body;

    let errors = '';
    if (!user_id) {
        errors = 'User id is required.';
    }
    else if (!page) {
        errors = 'page is required.';
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    var pages = page;

    var limit = '10';

    if (pages == '') {
        pages = 1;
        sp = 0;
    }
    else {
        pages = pages;
        sp = (pages - 1) * limit;
    }


    Orders.getOrdersListCount(user_id, (err, data) => {
        var getcount = data.length;
        var totalpage = Math.ceil(getcount / limit);

        Orders.getOrdersList(user_id, sp, limit, (err, orders) => {
            var newOrders = [];
            var proData = orders;
            proData.forEach(function (pro) {
                var obj = {};

                obj['order_id'] = pro.id;
                obj['unique_order_id'] = pro.unique_order_id;
                obj['user_id'] = pro.user_id;
                obj['delivery_instructions'] = pro.delivery_instructions;
                obj['total_shipping'] = pro.total_shipping;
                obj['total_price'] = pro.total_price;
                obj['order_total'] = pro.order_total;
                obj['address'] = pro.address;
                obj['cancel_order_reason'] = pro.cancel_order_reason ? pro.cancel_order_reason : "";
                obj['status'] = pro.status;
                obj['partially_delivered_date'] = pro.partially_delivered_date ? pro.partially_delivered_date : "";
                obj['delivered_date'] = pro.delivered_date ? pro.delivered_date : "";
                obj['created_at'] = pro.created_at;
                obj['updated_at'] = pro.updated_at;
                obj['full_name'] = pro.full_name;
                obj['email'] = pro.email;
                obj['phone_number'] = pro.phone_number;
                obj['profile_picture'] = pro.profile_picture;
                obj['total_product'] = pro.total_product;
                obj['product_name'] = pro.product_name;
                obj['product_image'] = pro.product_image;
                (pro.total_product > 1) ?
                    obj['is_more_product'] = 1
                    :
                    obj['is_more_product'] = 0
                newOrders.push(obj);
            });
            return res.send({
                status: "SUCCESS",
                message: "",
                data: newOrders,
                total_page: totalpage,
                page: pages
            });

        })
    })
}

exports.addOrRemoveWishlist = (req, res) => {
    const { user_id, product_id } = req.body;

    let errors = '';

    if (!user_id) {
        errors = "user_id is required.";
    }
    else if (!product_id) {
        errors = 'product_id is required.';
    }

    if (errors.length > 0) {

        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    Wishlist.isFavoriteExist(user_id, product_id, (err, data) => {
        if (data) {
            Wishlist.remove(data.id, (err, remove) => {
                var obj = {};
                obj['is_favourite'] = 0;
                return res.send({
                    status: "SUCCESS",
                    message: 'Product remove from wishlist successfully.',
                    data: obj,
                })
            });
        }
        else {
            const wishData = new Wishlist({
                user_id: user_id,
                product_id: product_id
            })
            Wishlist.wishListAdd(wishData, (err, addFav) => {
                var obj = {};
                obj['is_favourite'] = 1;
                return res.send({
                    status: "SUCCESS",
                    message: 'Product added to wishlist successfully.',
                    data: obj,
                })
            })
        }
    })
}

exports.getWishlistProducts = (req, res) => {
    const { user_id, search_text,sort_by,min_price,max_price,selected_category_id,page } = req.body;

    let errors = '';

    if (!user_id) {
        errors = 'user_id is required.';
    }
    else if (!page) {
        errors = 'page is required.';
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    var pages = page;

    var limit = '20';

    if (pages == '') {
        pages = 1;
        sp = 0;
    }
    else {
        pages = pages;
        sp = (pages - 1) * limit;
    }

    var searchText = '';
    if (search_text != undefined && search_text != '') {
        searchText = search_text;
    }

    var sortBy = ''
    if(sort_by != undefined && sort_by != ""){
        sortBy = sort_by
    }

    var minPrice = ''
    if(min_price != undefined && min_price != ""){
        minPrice = min_price
    }

    var maxPrice = ''
    if(max_price != undefined && max_price != ""){
        maxPrice = max_price
    }

    var selectedCategory = ''
    if(selected_category_id != undefined && selected_category_id != ""){
        selectedCategory = selected_category_id
    }

    Wishlist.getWishlistProductsCount(user_id,searchText,sortBy,minPrice,maxPrice,selectedCategory, (err, data) => {
        var getcount = data.length;
        var totalpage = Math.ceil(getcount / limit);

        Wishlist.getWishlistProducts(user_id,searchText,sortBy,minPrice,maxPrice,selectedCategory, sp, limit, (err, products) => {
            var newProduct = [];
            var proData = products
            proData.forEach(function (pro) {
                var obj = {};
                obj['id'] = pro.id;
                obj['category_id'] = pro.category_id;
                obj['company_name'] = pro.company_name;
                obj['name'] = pro.name;
                obj['description'] = pro.description;
                obj['price'] = pro.price;
                obj['is_available'] = pro.is_available;
                obj['avg_rating'] = pro.avg_rating;
                obj['total_review'] = pro.total_review;
                obj['category_name'] = pro.category_name;
                obj['image'] = pro.image;
                obj['is_favourite'] = pro.is_favourite;
                obj['total_like'] = pro.total_like;
                newProduct.push(obj);
            })
            return res.send({
                status: "SUCCESS",
                message: "",
                data: newProduct,
                total_page: totalpage,
                page: pages
            });
        })
    })
}

exports.getOrderProductsListing = (req, res) => {
    const { user_id, page } = req.body

    let errors = '';

    if (!user_id) {
        errors = 'user_id is required.';
    }
    else if (!page) {
        errors = 'page is required.';
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    var pages = page;

    var limit = '10';

    if (pages == '') {
        pages = 1;
        sp = 0;
    }
    else {
        pages = pages;
        sp = (pages - 1) * limit;
    }

    Orders.getOrderProductsListCount(user_id, (err, data) => {
        var getcount = data.length;
        var totalpage = Math.ceil(getcount / limit);
        Orders.getOrderProductsList(user_id, sp, limit, (err, products) => {
            return res.send({
                status: "SUCCESS",
                message: "",
                data: products,
                total_page: totalpage,
                page: pages
            });
        })
    })
}

exports.cancelOrder = (req, res) => {
    const { unique_order_id, cancel_order_reason } = req.body;

    let errors = '';

    if (!unique_order_id) {
        errors = 'unique_order_id is required.';
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    var datetime = new Date();
    let now = moment(datetime);
    var current_date = now.format("YYYY-MM-DD");

    Orders.getordersList(unique_order_id, (err, order) => {
        if (order) {
            var order_id = order.id
            Orders.cancelOrder(order_id, cancel_order_reason, (err, data) => {
                if (data) {
                    OrderItems.addOrdersCancelItems(current_date, order_id, (err, data1) => {
                        return res.send({
                            status: "SUCCESS",
                            message: "Order cancel successfully.",
                            data: {}
                        });
                    })
                }
                else {
                    return res.send({
                        status: "ERROR",
                        message: "Something went wrong.",
                        data: {}
                    });
                }
            })
        }
        else {
            return res.send({
                status: "ERROR",
                message: "Order not found Please check unique_order_id and try again.",
                data: {}
            });
        }
    })
}

exports.cancelProduct = (req, res) => {
    const { product_id, unique_order_id } = req.body;

    let errors = '';

    if (!unique_order_id) {
        errors = 'unique_order_id is required.';
    }
    else if (!product_id) {
        errors = 'product_id is required.';
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    Orders.getordersList(unique_order_id, (err, data) => {
        if (data) {
            var order_id = data.id
            var datetime = new Date();
            let now = moment(datetime);
            var current_date = now.format("YYYY-MM-DD");

            OrderItems.getUniqorderItems(order_id, (err, items) => {
                if (items.length !== 1) {
                    OrderItems.cancelOrdersItems(order_id, product_id, current_date, (err, remove) => {
                        if (remove) {
                            return res.send({
                                status: "SUCCESS",
                                message: "Item has been removed from the order successfully.",
                                data: {}
                            });
                        }
                        else {
                            return res.send({
                                status: "ERROR",
                                message: "Something went wrong.",
                                data: {}
                            });
                        }
                    })
                }
                else {
                    OrderItems.cancelOrdersItems(order_id, product_id, current_date, (err, remove) => {
                        Orders.updateOrderStatus(order_id, (err, cancel) => {
                            if (cancel) {
                                return res.send({
                                    status: "SUCCESS",
                                    message: "Item has been removed from the order successfully.",
                                    data: {}
                                });
                            }
                            else {
                                return res.send({
                                    status: "ERROR",
                                    message: "Something went wrong.",
                                    data: {}
                                });
                            }
                        })
                    })
                }
            })
        }
        else {
            return res.send({
                status: "ERROR",
                message: "Order not found Please check unique_order_id and try again.",
                data: {}
            });
        }
    })
}

exports.addReviewRating = (req, res) => {
    const { user_id, product_id, rating, review } = req.body;

    let errors = '';

    if (!user_id) {
        errors = 'user_id is required.';
    }
    else if (!product_id) {
        errors = 'product_id is required.';
    }
    else if (!rating) {
        errors = 'rating is required.';
    }
    else if (!review) {
        errors = 'rating is required.';
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: {}
        });
    }

    productReview.isUserExist(user_id, (err, data) => {
        if (data) {
            const reviewData = new productReview({
                user_id: user_id,
                product_id: product_id,
                rating: rating,
                review: review
            });

            productReview.reviewAdd(reviewData, (err, reviewData) => {
                productReview.getproductReviewRating(product_id, (err, review) => {
                    if (review) {
                        var total_rating = review.total_rating;
                        var total = review.total;
                    }
                    else {
                        var total_rating = 0;
                        var total = 0;
                    }
                    var average_rating = total_rating / total;
                    productReview.updateProductsRating(product_id, average_rating, total, (err, updata) => {
                        return res.send({
                            status: "SUCCESS",
                            message: 'Rating added successfully.',
                            data: {}
                        });
                    })
                })
            })
        }
        else {
            return res.send({
                status: "ERROR",
                message: 'Something went wrong.',
                data: {}
            });
        }
    })
}

exports.getReviewListing = (req, res) => {
    const { product_id } = req.body;

    let errors = '';

    if (!product_id) {
        errors = 'product_id is required.';
    }

    if (errors.length > 0) {
        return res.send({
            status: "ERROR",
            message: errors,
            data: []
        });
    }

    productReview.reviewListing(product_id, (err, review) => {
        if (review.length > 0) {
            var newAdd = [];
            reviewData = review;
            reviewData.forEach(function (rev) {
                var obj = {};
                obj['id'] = rev.id;
                obj['user_id'] = rev.user_id;
                obj['review'] = rev.review;
                obj['rating'] = rev.rating;
                let now = moment(rev.posted_at);
                var posted_at = now.format("YYYY-MM-DD h:mm:ss");
                obj['posted_at'] = posted_at;
                obj['full_name'] = rev.full_name;
                obj['profile_picture'] = rev.profile_picture;
                newAdd.push(obj);
            });

            return res.send({
                status: "SUCCESS",
                message: "",
                data: newAdd
            });
        }
        else {
            return res.send({
                status: "ERROR",
                message: "",
                data: []
            });
        }
    })
}
