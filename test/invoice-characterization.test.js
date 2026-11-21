'use strict';

var assert = require('node:assert/strict');
var test = require('node:test');

var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');
var reports = require('../lib/reports');

function makeOrder(items, coupon) {
  var totals = pricing.computeTotals(items, coupon || '');
  return {
    id: 42,
    date: '17/11/2021',
    customer: 'In-memory test customer',
    paymentMode: 'cash',
    status: 'completed',
    items: items,
    coupon: coupon || '',
    subtotal: totals.subtotal,
    discount: totals.discount,
    tax: totals.tax,
    total: totals.total
  };
}

function rice(price) {
  return {
    id: 1,
    sku: 'RICE-TEST',
    name: 'Test rice',
    hsn: '1006',
    price: price,
    qty: 1
  };
}

test('order pricing applies the HSN slab and calculates GST after coupon discount', function () {
  var totals = pricing.computeTotals([rice(1000)], 'SAVE10');

  assert.equal(totals.subtotal, 1000);
  assert.equal(totals.discount, 100);
  assert.equal(totals.taxable, 900);
  assert.equal(totals.tax, 45);
  assert.equal(totals.cgst, 22.5);
  assert.equal(totals.sgst, 22.5);
  assert.equal(totals.total, 945);
  assert.equal(totals.lines[0].gstPercent, 5);
});

test('CURRENT BEHAVIOUR: invoice uses default 18% GST when order line has HSN but no gstRate', function () {
  var order = makeOrder([rice(1000)], '');
  var figures = invoice.computeInvoiceFigures(order);
  var reconciliation = reports.getGstReconciliation({ orders: [order] });
  var markup = invoice.render(order);

  assert.equal(order.tax, 50);
  assert.equal(order.total, 1050);
  assert.equal(figures.rows[0].gstPercent, 18);
  assert.equal(figures.tax, 180);
  assert.equal(figures.cgst, 90);
  assert.equal(figures.sgst, 90);
  assert.equal(figures.total, 1180);
  assert.equal(reconciliation.mismatchCount, 1);
  assert.equal(reconciliation.rows[0].delta, 130);
  assert.equal(reconciliation.totalDelta, 130);
  assert.match(markup, /Accountant Reconciliation Notice/);
  assert.match(markup, /1180\.00/);
});

test('CURRENT BEHAVIOUR: invoice percent coupon uses pre-discount invoice tax and ignores maxDiscount', function () {
  var order = makeOrder([rice(5000)], 'SAVE10');
  var figures = invoice.computeInvoiceFigures(order);
  var reconciliation = reports.getGstReconciliation({ orders: [order] });

  assert.equal(order.discount, 150);
  assert.equal(order.tax, 242.5);
  assert.equal(order.total, 5092.5);
  assert.equal(figures.tax, 900);
  assert.equal(figures.discount, 590);
  assert.equal(figures.total, 5310);
  assert.equal(reconciliation.rows[0].delta, 217.5);
  assert.equal(reconciliation.totalDelta, 217.5);
});
