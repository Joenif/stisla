"use strict";
// print modal function
function printOrder() {    
    printElement( document.getElementById('print_order_body') );
}
function printBill() {    
    printElement( document.getElementById('print_bill_body'));
}

function printElement(elem) {
    var domClone = elem.cloneNode(true);

    var $printSection = document.getElementById("printSection");

    if (!$printSection) {
        var $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }

    $printSection.innerHTML = "";
    $printSection.appendChild(domClone);
    window.print();
}

// date function 
var currentDate = function () {
    let x = new Date();
    let date = x.toDateString() + ', ' + x.toLocaleTimeString();
    return date;
}
$('.currentDate').text(currentDate());

// Modal functions: Append modal to body to appear over every elements
$('#customerModal').appendTo('body');
$('#sellGCModal').appendTo('body');
$('#holdModal').appendTo('body');
$('#discountModal').appendTo('body');
$('#registerDetailsModal').appendTo('body');
$('#todaySaleModal').appendTo('body');
$('#closeRgModal').appendTo('body');

$('#add_tax').click(function () {
    $('#orderTaxModal').appendTo('body').modal();
});

$('#cancel-order').click(function () {
    if (carts.length == 0) {
        // show error modal and append to body tag
        $("#actionError").appendTo('body').modal();
    } else {
        // Append modal to body and show modal
        $('#cancelOrder').appendTo('body').modal();
    }
});

$('#payment').click(function () {
    if (carts.length == 0) {
        // show error modal and append to body tag
        $("#actionError").appendTo('body').modal();
    } else {
        // Append modal to body and show modal
        $("#payModal").appendTo('body').modal();
    }
});

$('#print_bill').click(function () {
    if (carts.length == 0) {
        // show error modal and append to body tag
        $("#actionError").appendTo('body').modal();
    } else {
        // Append modal to body and show modal
        $("#printBillModal").appendTo('body').modal();
    }
});

$('#print_order').click(function () {
    if (carts.length == 0) {
        // show error modal and append to body tag
        $("#actionError").appendTo('body').modal();
    } else {
        carts.forEach((cart, index) => {
            index += 1
            $('#order-table > tbody').append(
                `
                <tr class="bb" data-item-id="${index}">
                    <td>#${index} ${cart.item.name} (${cart.item.value})</td>
                    <td>[ ${cart.qty} ]</td>
                </tr>
                `
            );
        });
        // Append modal to body and show modal
        $("#printOrderModal").appendTo('body').modal();
    }
});
// open cart item modal on click
var openCartItem = function(id) {
    editCartItem(id);
    // Append modal to body and show modal
    $('#editCartItem').appendTo('body').modal();
};

// End modal function

// ============================== Testing

// order Tax function
var orderTax = 0.05;
$('#updateTax').click(function () {
    let value = $('#get_tax').val();
    orderTax = parseInt(value) / 100;
    updateOrderData();
    $('#orderTaxModal').modal("hide")
});

// Product function
var products = [
    {
        id: 'product-0101',
        name: 'Minion Hi',
        value: 'TOY01',
        price: 15,
        discount: 0
    },
    {
        id: 'product-0102',
        name: 'Minion Banana',
        value: 'TOY02',
        price: 15,
        discount: 0
    }
];

$('.addProduct').click(function () {
    let btn = $(this);
    let product = $.grep(products, function(p) {
        return p.id === btn.attr('id');
    });
    addToCart(product[0]);
});

// cart function
var carts = [];

function addToCart(product) {
    // if cart is empty
    if (carts.length == 0) {
        carts = [
            {
                item: product,
                qty: 1,
                subTotal: product.price - product.discount,
            }
        ];
        refreshTable();
    } else {
        var itemNotFound = true;
        // prevent item duplicate 
        carts.forEach(cart => {
            // if item exists, update quantity 
            if (cart.item.id === product.id) {
                cart.qty += 1;
                cart.subTotal = cart.qty * (cart.item.price - cart.item.discount)
                itemNotFound = false;
                refreshTable();
            }
        });
        // if item does not exit, add to cart
        if ( itemNotFound ) {
            carts.push({
                item: product,
                qty: 1,
                subTotal: product.price - product.discount,
            });
            refreshTable();
        }
    }
}
function removeItem(id) {
    
    var index = carts.map(x => {
        return x.Id;
      }).indexOf(id);
      
      carts.splice(index, 1);
      
      refreshTable();
      updateOrderData();
      
};
function delAllItem() {

    carts = [];
      
      refreshTable();
      updateOrderData();
      
};
function addCartTable() {
    // Update cart table
    carts.forEach((cart, index ) => {
        index += 1
        $('#posTable > tbody').prepend(
            `<tr data-item-id="${index}">
                <td>
                    <button type="button" data-item-id="${index}" onclick="openCartItem('${cart.item.id}')" class="btn bg-purple btn-block px-0 btn-small">
                        <span class="sname" id="">${cart.item.name} (${cart.item.value})</span>
                    </button>
                </td>
                <td class="text-right">
                    <span class="text-right">${cart.item.price}</span>
                </td>
                <td>
                    <input class="form-control text-center px-0" type="text" value="${cart.qty}" data-item-id="${index}" >
                </td>
                <td class="text-right">
                    <span class="text-right subtotal">${cart.subTotal}</span>
                </td>
                <td class="text-center" onclick="removeItem(${index})">
                    <i class="fa fa-trash pointer" title="Remove"></i>
                </td>
            </tr>`
        );
    });

    updateOrderData();
}
function editCartItem(id) {
    console.log(String(id));
    carts.forEach(cart => {
        console.log(cart.item.id);
        if (cart.item.id == id) {
            let net_price = cart.item.price - cart.item.discount;
            $('#cartItem').append(`
            <div class="modal-header modal-primary">
                <h5 class="modal-title">${cart.item.name}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-times"></i></button>
            </div>
            <div class="modal-body">
                <table class="table table-bordered table-striped">
                    <tbody><tr>
                        <th style="width:25%;">Net Price</th>
                        <th style="width:25%;"><span id="net_price">${cart.net_price}</span></th>
                        <th style="width:25%;">Product Tax</th>
                        <th style="width:25%;"><span id="pro_tax">0.00</span> <span id="pro_tax_method">()</span></th>
                    </tr>
                </tbody></table>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label for="nPrice">Unit Price</label>                            
                            <input type="text" class="form-control input-sm" id="nPrice" value="${cart.item.price}" onclick="this.select();" placeholder="New Price">
                        </div>
                        <div class="form-group">
                            <label for="nDiscount">Discount</label>                            
                            <input type="text" class="form-control input-sm" id="nDiscount" value="${cart.item.discount}" onclick="this.select();" placeholder="Discount">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label for="nQuantity">Quantity</label>                            
                            <input type="text" class="form-control input-sm" id="nQuantity" value="${cart.qty}" onclick="this.select();" placeholder="Current Quantity">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group">
                            <label for="nComment">Comment</label>                            
                            <textarea class="form-control" id="nComment"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>
                <button class="btn btn-success" id="editItem">Update</button>
            </div> 
            `);
        }
    });
};

function updateOrderData() {
    var total = 0;
    var totalItem = 0;
    var totalTax = 0;
    var totalPayable = 0;
    var totalDiscount = 0;
    if (carts.length > 0) {
        // update total 
        let subTotals = carts.map(item => item.subTotal);
        $.each(subTotals, function() { total+=parseFloat(this) || 0;});
        
        // update total item
        let itemsNum = carts.map(cart => cart.qty);
        $.each(itemsNum, function() { totalItem+=parseFloat(this) || 0;});
        
        // update total discount
        let itemDis = carts.map(cart => (cart.item.discount * cart.qty));
        $.each(itemDis, function() { totalDiscount+=parseFloat(this) || 0;});
        
        // update orderTax
        totalTax = totalItem * orderTax;
        
        // update total Payable
        var totalPayable = Number(total + totalTax); 
    }
    $('#total').text(total.toFixed(2));
    $('#count').text(carts.length +'('+ totalItem + ')');
    $('#ts_con').text(totalTax.toFixed(2));
    $('#total-payable').text(totalPayable.toFixed(2));   
    $('#ds_con').text(totalDiscount.toFixed(2));   
}

function refreshTable() {
    $('#posTable > tbody').empty();
    addCartTable();
}

// remove after-footer space on minimized sidebar
$('body').on('DOMSubtreeModified', function(){
    var self = $(this);
    var posFooter = $('footer');
    var top = Number(screen.height) + 90 + 'px';
    if (self.hasClass('sidebar-mini')) {
        posFooter.addClass('footer-bottom');
        posFooter.css('top',top);
    } else if (self.hasClass('sidebar-mini') === false && posFooter.hasClass('footer-bottom')) {
        posFooter.removeClass('footer-bottom');
    }
});