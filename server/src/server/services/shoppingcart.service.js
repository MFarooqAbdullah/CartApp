
var express = require('express');

// Models
var Products = require('../models/products.model.js');
var SelectedProducts = require('../models/selectedproducts.model.js');
var Payment = require('../models/payment.model.js');



var calculatePaybleAmount = function (productId, mode, quantity_new, quantity_old) {
    var price = 0;
    Products.findOne({ p_id: productId }, function (err, product) {
        var oldquanitity = 0;
        var quanitity = parseInt(quantity_new);
        var subTotal = 0;

        if (!err) {
            if (product) {
                price = parseFloat(product.price);
                Payment.findOne({}, function (err, obj) {
                    if (!err) {
                        if (!obj && mode == "ADD") {
                            subTotal = ((parseFloat(price) * quanitity)).toString();
                            var net_quantity = parseInt(quanitity);
                            obj = new Payment({ subtotal: subTotal, quantity: net_quantity });
                            obj.save(function (err) { console.log('large: Size saved successfully'); });
                        }
                        else {
                            var oldquanitity = (parseInt(obj.quantity) - 0);
                            var q_old = parseInt(quantity_old);
                            var q_new = parseInt(quantity_new);
                            if (mode == "ADD") {
                                quanitity = parseInt(quanitity);
                                subTotal = (parseFloat(obj.subtotal) + (parseFloat(price) * quanitity)).toString();
                                quanitity = quanitity + oldquanitity;
                            }
                            else if (mode == "EDIT") {
                                quanitity = oldquanitity + q_new - q_old;
                                console.log('quant-calcu: oldquanitity' + oldquanitity + ' q_new:' + q_new + '  q_old:' + q_old);
                                subTotal = (parseFloat(obj.subtotal) + (parseFloat(price) * q_new) - (parseFloat(price) * q_old)).toString();
                            }
                            else {// REMOVE
                                subTotal = (parseFloat(obj.subtotal) - (parseFloat(price) * quanitity)).toString();
                                quanitity = (parseInt(obj.quantity) - 0) - quanitity;
                            }


                            Payment.findOneAndUpdate({ quantity: oldquanitity }, { $set: { quantity: quanitity, subtotal: subTotal } }, { upsert: true, new: true }, function (err, doc) {
                                if (err) {
                                    console.log("Something wrong when updating data!");
                                }

                                console.log("updated" + JSON.stringify(doc));
                            });
                        }

                    }
                });
            }
        }
    });




}

module.exports = function (app) {
    'use strict';

    // get all products
    app.get('/products', function (req, res) {
        Products.find({}, function (err, docs) {
            if (err) return console.error(err);
            res.json(docs);
        });
    });

    app.get('/products/:id', function (req, res) {
        Products.findOne({ p_id: req.params.id }, function (err, obj) {
            if (err) return console.error(err);
            res.json(obj);
        })
    });

    // get all selected products
    app.get('/selectedproducts', function (req, res) {
        var productsArr = [];
        var productsList = [];
        Products.find({}).lean().exec(function (err, productInfo) {
            productsArr = productInfo;
            SelectedProducts.find({}).lean().exec(function (err, products) {
                for (var i = 0; i < products.length; i++) {
                    for (var j in productsArr) {
                        if (productsArr[j].p_id == products[i].p_id) {
                            products[i].info = productsArr[j];
                        }
                    }
                }
                productsList = products;
                console.log('LIST', productsList);
                return res.end(JSON.stringify(productsList));
            });
        });
    });

    // create
    app.post('/selectedproducts', function (req, res) {
        console.log('selectedproducts Body::::', req.body);
        var productId = req.body._id;
        console.log('selectedproducts Body::::', productId);
        var quantity = req.body.p_quantity;

        SelectedProducts.findOne({ _id: productId }, function (err, product) {

            if (!err) {
                if (!product) {
                    product = new SelectedProducts({ _id: productId, p_quantity: quantity });
                    console.log('product2:' + JSON.stringify(product))
                    product.save(function (err) {
                        if (!err) {
                            calculatePaybleAmount(productId, "ADD", quantity);
                            console.log('product  saved successfully');
                        }
                    });
                }
                else {
                    console.log('product2:' + JSON.stringify(product));
                    var quant = parseInt(quantity);
                    var old_quant = parseInt(product.p_quantity);
                    console.log('quantity:' + quant);

                    SelectedProducts.findOneAndUpdate({ _id: productId }, { $set: { p_quantity: quant } }, { upsert: true, new: true }, function (err, doc) {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                        calculatePaybleAmount(productId, "EDIT", quant, old_quant);
                        console.log("updated" + JSON.stringify(doc));
                        console.log('product  updated successfully');

                    });
                }
            }
        });
        res.sendStatus(200);
    });

    // update products
    app.post('/updateselectedproducts', function (req, res) {

        var productId = req.body.p_id;
        var quant_old = req.body.old_p_quantity;
        var quant_new = req.body.new_p_quantity;

        //console.log("old" + JSON.stringify(req.body));

        SelectedProducts.findOneAndUpdate({ p_id: productId }, { $set: { p_quantity: quant_new } }, { upsert: true, new: true }, function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            calculatePaybleAmount(productId, "EDIT", quant_new, quant_old);
            console.log("updated" + JSON.stringify(doc));
            console.log('product  updated successfully');

        });

        res.sendStatus(200);
    });

    // delete products
    app.post('/deleteselectedproducts', function (req, res) {

        var productId = req.body.p_id;
        var sizeCode = req.body.p_sizecode;
        var colorCode = req.body.p_colorcode;
        var quantity = req.body.p_quantity;

        SelectedProducts.findOneAndRemove({ p_id: productId }, function (err) {
            if (err) return console.error(err);
            calculatePaybleAmount(productId, "REMOVE", quantity);
            res.sendStatus(200);
        });
    });


    app.get('/calculateTotal', function (req, res) {

        var _subTotal = 0;
        var _netAmount = 0;
        var _quantity = 0;
        Payment.findOne({}, function (err, obj) {
            if (!err) {
                if (obj) {
                    console.log(obj);
                    _subTotal = parseFloat(obj.subtotal);
                    _quantity = parseInt(obj.quantity);
                    _netAmount = parseFloat(_subTotal);
                    _subTotal = parseFloat(_subTotal).toFixed(2);
                    res.status(200).json({ subTotal: _subTotal.toString(), netAmount: _netAmount.toString() });
                }
            }
        });
        res.status(200);
    });

};

