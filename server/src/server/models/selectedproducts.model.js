var mongoose = require('mongoose');

var selectedProductSchema = mongoose.Schema({
    p_id: String,
    p_quantity: Number
});

var SelectedProducts = mongoose.model('SelectedProducts', selectedProductSchema);

module.exports = SelectedProducts;