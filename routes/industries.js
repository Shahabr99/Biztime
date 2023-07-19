const db = require('../db')
const express = require('express')
const ExpressError = require('../expressError')
const router = new express.Router

router.get('/industries', async function(req, res, next) {
  const results = await db.query(`SELECT i.code, i.industry, c.code FROM industries AS i LEFT JOIN industriesCompanies AS ic ON i.code = ic.industry_code LEFT JOIN companies AS c ON ic.comp_code=c.code`);
  console.log(results)
  return res.json({industries: results.rows})
})

router.post('/industries', async function(req, res, next) {
  try {
    const {code, industry} = req.body
    const results = await db.query(`INSERT INTO industries(code, industry) VALUES ($1, $2) RETURNING code, industry`, [code, industry]);
    if(results.rows.length === 0) throw new ExpressError("Data not found", 404)
    return res.json({industries: results.rows[0]})
  }catch(e){
    return next(e)
  } 
})


router.put('/indistries/:code', function(req, res, next) {
  const {code} = req.params;
  const results = db.query(`UPDATE industriesCompanies `)
})


module.exports = router