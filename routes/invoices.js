const express = require('express')
const ExpressError = require('../expressError')
const db = require('../db')
const router = new express.Router()


router.get('/invoices', async function(req, res, next) {
  try{
    const results = await req.query('SELECT id, comp_code FROM invoices')
    return res.json({invoices: results.rows})
  }catch(e){
    return next(e)
  }
})


router.get('/invoices/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const results = await db.query(`SELECT invoices.id, invoices.amt, invoices.paid, invoices.add_date, invoices.paid_date, companies.code, companies.name, companies.description 
    FROM invoices 
    JOIN companies 
    ON invoices.comp_code = companies.code 
    WHERE invoices.id = $1`, [id])
    if(results.rows.length === 0) throw new ExpressError("data not found", 404)
    return res.json({
      invoices: results.rows[0]
    })
  }catch(e){
    return next(e)
  }
})


router.post('/invoices', async (req, res, next) {
  try{
    const {comp_code, amt} = req.body;
    const results = await db.query(`INSERT INTO invoices(comp_code, amt)VALUES(comp_code=$1, amt=$2)`, [comp_code, amt])
    return res.json({invoice: results.rows[0]})
  }catch(e){
    return next(e)
  }
})


router.put('/invoices/:id', async(req, res, next) {
  try {
    const {amt} = req.body;
    const {id} = req.params;
    const results = await db.query(`UPDATE invoices SET amt=$1 WHERE invoices.id=$2`, [amt, id])
    if(results.rows.length == 0) throw new ExpressError("Data cannot be found", 404)
    return res.json(results.rows[0])
  }catch(e){
    return next(e)
  }
})


router.delete('/invoices/:id', async function(req, res, next) {
  const {id} = req.params;
  await db.query('DELETE FROM invoices WHERE id = $1', [id])
  return res.json({status: "Deleted"})
})



module.exports = router