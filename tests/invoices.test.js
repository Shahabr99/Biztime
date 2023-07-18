process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require('../app');
const db = require('../db');

let invoiceTest;
beforeEach(async function() {
  await db.query("INSERT INTO companies(code, name, description) VALUES ('Verizon','Verizon','Cellular Service') RETURNING code, name, description")
  await db.query("INSERT INTO companies(code, name, description) VALUES ('ATT', 'ATT', 'Cellular Service') RETURNING code, name, description")
  let testInvoice = await db.query("INSERT INTO invoices(id, amt,comp_code, paid_date) VALUES (1, 2.4, 'Verizon', \'2022-01-01\') RETURNING amt, comp_code, paid_date");
  invoiceTest = testInvoice.rows[0];
}) 
  

afterEach(async function() {
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM invoices")
})


afterAll(async function() {
  await db.end()
})


describe("GET /invoices", function() {
  test("should return all the invoices", async function(){
    const resp = await request(app).get('/invoices');
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({invoices: expect.any(Array)})
  })
})

describe('GET /invoices/:id', function() {
  test("should return an invoice for a company", async function() {
    const result = await request(app).get("/invoices/1")
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual({invoices: expect.any(Object)})
  })
})


describe("POST /invoices", function() {
  test("should add a new invocie", async function() {
    
    const response = await request(app).post('/invoices').send({"comp_code":"Verizon", "amt": 4.5});
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({invoice: expect.any(Object)})
  })
})


describe('PUT /invoices/:id', function(){
  test('Should update an invoice', async function() {
    const resp = await request(app).put('/invoices/1').send({"amt": 3.5})
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual(expect.any(Object))
  })
})


describe('DELETE /invoices/:id', function() {
  test("it should delete a specific invoice", async function() {
    const resp = await request(app).delete('/invoices/1')
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({status: "Deleted"});
  })
})