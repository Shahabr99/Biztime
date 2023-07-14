const express = require('express')
const router = new express.Router()


router.get('/', async function(req, res, next) {
  try{
    const results = await req.query('SELECT id, comp_code FROM invoices')
    return res.json({invoices: results.rows})
  }catch(e){
    return next(e)
  }
})