process.env.NODE_ENV = 'test';
const request = require('supertest');
const db = require('./db')
const app = require('./app')

let testCompany;
beforeEach(async function() {
  let result = await db.query(`INSERT INTO companies(code, name, description)VALUES('ATT', 'AT&T', 'Cellular service') RETURNING code, name, description`)
  testCompany = result.rows[0]
})


afterEach(async function() {
  await db.query('DELETE FROM companies');
})


afterAll(async function() {
  await db.end()
})

describe('/GET companies', function(){
  test("Should get the only company", async function() {
    const resp = await request(app).get('/companies');
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      companies: expect.any(Array)
    })
  })
})


describe('/GET company', function() {
  test('should return a specific company', async function() {
    const resp = await request(app).get('/companies/ATT')
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({company: {code: "ATT",
    description: "Cellular service",
    name: "AT&T"
  }})
  })
})


describe('/POST company', function() {
  test('Should add one company to table', async function() {
    const resp = await request(app).post('/companies').send({"code":"Adidas", "name": "Adidas", "description": "Athletes footwear"});
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({company: {code:"Adidas", name: "Adidas", description:"Athletes footwear"}})
  })
})


describe("/PUT company", function() {
  test("it should update info of a company", async() => {
    const resp = await request(app).put('/companies/ATT').send({"name": "Verizon", "description": "Cellular service"})
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({company: expect.any(Object)})
  })
})


describe("/DELETE company", function() {
  test("it should delete a company", async function() {
    const resp = await request(app).delete('/companies/ATT')
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({status: "Deleted"})
  })
})