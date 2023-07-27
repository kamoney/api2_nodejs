'use strict'

require('dotenv').config()

const { Kamoney } = require("./kamoney");

async function pix_order() {
    // obj order sevices default
    let order = {
        payment_slips: [],
        direct_transfers: [],
        digital_products: [],
        pix: {},
    };

    // pix service example
    order.pix[0] = {
        type: 'CPF',
        key: '06998724640',
        amount: 10,
    };

    let asset = 'BTC';
    let network = 'BTC';

    return await Kamoney.OrderCreate(asset, network, order);
}

async function servicesOrderList() {
    return await Kamoney.ServicesOrderList();
}

async function accountGetInfo() {
    return await Kamoney.AccountGetInfo();
}

async function init() {
    // public
    console.log(await servicesOrderList());

    // private
    // console.log(await accountGetInfo());
    // console.log(await pix_order());
}

init();