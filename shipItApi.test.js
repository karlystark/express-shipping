"use strict";

const AxiosMockAdapter = require(
  "axios-mock-adapter");
const axios = require("axios");
const axiosMock = new AxiosMockAdapter(axios);

const { SHIPIT_SHIP_URL } = require("./shipItApi");


const {
  shipProduct,
} = require("./shipItApi");


test("shipProduct", async function () {
  // mocking response from SHIPIT API to avoid call
  // SHIPIT API returns a receipt object, but we are only testing shipId
  axiosMock.onPost(`${SHIPIT_SHIP_URL}`).reply(201,
    { receipt: { shipId: 12345 }});

  const shipId = await shipProduct({
    productId: 1000,
    name: "Test Tester",
    addr: "100 Test St",
    zip: "12345-6789",
  });

  expect(shipId).toEqual(12345);
});
