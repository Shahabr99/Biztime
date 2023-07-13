const express = require('express')
const router = new express.Router();
const db = require('../db')


router.get('/companies', async function(req, res, next) {
  try {
    const results = await db.query('SELECT code, name FROM companies');
    return res.json({companies: results.rows})
  }catch(e){
    return next(e)
  }
})


module.exports = router;