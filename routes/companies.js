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
    const results = await db.query("SELECT * FROM companies WHERE code=$1", [code])
    return res.json(results.rows[0])
  }catch(e) {
    return next(e)
  }
})


module.exports = router;