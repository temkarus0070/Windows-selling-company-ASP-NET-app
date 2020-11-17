﻿
var i = 1;

var numbersForPrice = Array();


function changeWindow(input, id) {
    var str = input.value;
    var i = str.indexOf(':')
    if (i != -1) {
        var price = parseFloat(str.slice(i + 1, str.Length));
        if (price == NaN)
            price = 0;
        numbersForPrice[id][0] = price;
        CalculatePrice();
    }
}

function changeLength(input, id) {
    var str = input.value;
    var length = parseFloat(str);
    if (length == NaN)
        length = 0;
    numbersForPrice[id][1] = length;
    CalculatePrice();
}

function changeWidth(input, id) {
    var str = input.value;
    var width = parseFloat(str);
    if (width == NaN)
        width = 0;
    numbersForPrice[id][2] = width;
    CalculatePrice();
}


function CalculatePrice() {
    var sum = 0;
    for (var index = 1; index < numbersForPrice.length; index++) {
        var p = numbersForPrice[index][0];
        var s = numbersForPrice[index][1] * numbersForPrice[index][2];
        sum += p * s;
        
    }
    $("#Price").val(sum);
}



function addPositionOrder() {
    numbersForPrice[i] = new Array(3);
    for (var index = 0; index < 3; index++) {
        numbersForPrice[i][index] = 0;
    }
    var table = $("#orderPositions");
    table.append('<tr id=' + '"' + i + '"' + '> <td> <input type="text" list="windows" onchange="changeWindow(this,' + i + ')" /> </td> <td> <input type="text" onchange="changeLength(this,'+i+')" /> </td> <td>  <input type="text" onchange="changeWidth(this,'+i+')" /></td> <td> <button class="btn" type="button" onclick="deleteRow(' + i + ');"' + ' >Удалить  </button> </td> </tr>');
    i++;
}





function deleteRow(rowId) {
    for (var index = 0; index < 2; index++) {
        numbersForPrice[rowId][index] = 0;
    }
  
    $('#' + rowId).remove();
    CalculatePrice();
    i--;
}

function send() {
    var orderPositions = new Array();
    $("#orderPositions TBODY TR").each(function () {
        var row = $(this);
        var orderPosition = {};
        if (row.find("TD").eq(0).children("input")[0] != null) {
            var str = row.find("TD").eq(0).children("input")[0].value;
            var id = $("#windowsList").eq(0).children("li").each(function () {
                var el = $(this).eq(0);
                var value = el.eq(0).prop("textContent");
                if (value === str)
                    orderPosition.WindowId = el.eq(0).prop("id");
            });

            orderPosition.Length = row.find("TD").eq(1).children("input")[0].value;
            orderPosition.Width = row.find("TD").eq(2).children("input")[0].value;
            orderPositions.push(orderPosition);
        }
    }
    );


    var order = {};
    var buyer = $("#buyerId")[0].value;
    $("#buyersList").eq(0).children("li").each(function () {
        var el = $(this).eq(0);
        var text = el.prop("textContent");
        if (text === buyer)
            order.BuyerId = el.eq(0).prop("id");
    });


    var seller = $("#sellerId")[0].value;
    $("#sellersList").eq(0).children("li").each(function () {
        var el = $(this).eq(0);
        var text = el.prop("textContent");
        if (text === seller)
            order.SellerId = el.eq(0).prop("id");
    });

    order.IsDeliver = $("#IsDeliver")[0].checked;
    order.IsSetup = $("#IsSetup")[0].checked;
    order.DeliverDate = $("#DeliverDate")[0].value;
    order.SetupDate = $("#SetupDate")[0].value;
    order.Price = $("#Price")[0].value;

    $.ajax({
        type: "POST",
        url: "/Order/Add",
        data: JSON.stringify({ orderViewModel: order, orderPositions: orderPositions, Price: order.Price }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });

    document.location.href = "../Order/Index";
}