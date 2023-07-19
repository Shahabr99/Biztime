const express = require('express')
const router = new express.Router();
const ExpressError = require('../expressError')
const db = require('../db')


router.get('/', async function(req, res, next) {
  try {
    const results = await db.query('SELECT code, name FROM companies');
    return res.json({companies: results.rows})
  }catch(e){
    return next(e)
  }
})


router.get('/:code', async function(req, res, next) {
  try{
    const {code} = req.params
    const results = await db.query("SELECT c.code, c.name, c.description, i.industry FROM companies AS c LEFT JOIN industriesCompanies AS ic ON c.code = ic.comp_code LEFT JOIN industries AS i ON ic.industry_code = i.code WHERE c.code=$1", [code])
    if(results.rows.length === 0) return new ExpressError("Data not found", 404)
    return res.json({company: results.rows[0]})
  }catch(e) {
    return next(e)
  }
})


router.post('/', async function(req, res, next) {
  try {
    const {code, name, description} = req.body;
    const results = await db.query(`INSERT INTO companies(code, name, description) VALUES ($1,$2,$3) RETURNING code, name, description`, [code, name, description]);
    return res.status(201).json({company: results.rows[0]})
  }catch(e){
    return next(e)
  }
})


router.put("/:code", async function(req, res, next) {
  try {
    const {name, description} = req.body;
    const {code} = req.params;

    const result = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING name, description`, [name, description, code])
    if(result.rows.length === 0) return new ExpressError("Data not found", 404)
    return res.json({company: result.rows[0]})
  }catch(e) {
    return next(e)
  }
})

router.delete('/:code', async function(req, res, next) {
  try {
    const {code} = req.params;
    await db.query(`DELETE FROM companies WHERE code=$1`, [code]);
    return res.json({status: "Deleted"})
  }catch(e) {
    return next(e)
  }
})



module.exports = router;