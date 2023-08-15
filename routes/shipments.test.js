"use strict";

const shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    // mocking response from shipProduct() to avoid call to external API
    // shipProduct() returns resp.data.receipt.shipId
    shipItApi.shipProduct.mockReturnValue(12345);
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 12345 });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws expected errors when response body is invalid", async function(){
    const resp = await request(app)
    .post("/shipments")
    .send({
      productId: "1000",
      name: "",
      zip: 48594,
      happy: "yes"
    });

    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.productId is not of a type(s) integer",
          "instance.name does not meet minimum length of 1",
          "instance.zip is not of a type(s) string",
          "instance is not allowed to have the additional property \"happy\"",
          `instance requires property \"addr\"`
        ],
        "status": 400
      }
    });
  });

});
