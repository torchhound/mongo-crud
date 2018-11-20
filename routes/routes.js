const express = require('express')

const Document = require('../models/Document')
const router = express.Router()

router.get('/documents', (req, res, next) => {
  req.app.locals.db.collection('documents').find({}).toArray((err, result) => {
    if (err) {
      res.status(400).send({'error': err})
    }
    if (result === undefined || result.length === 0) {
      res.status(400).send({'error':'No documents in database'})
    } else {
      res.status(200).send(result)
    }
  })
})

router.get('/documents/:id', (req, res, next) => {
  req.app.locals.db.collection('documents').findOne({
    '_id': req.params.id
  }, (err, result) => {
    if (err) {
      res.status(400).send({'error': err})
    }
    if (result === undefined) {
      res.status(400).send({'error':'No document matching that id was found'})
    } else {
      res.status(200).send(result)
    }
  })
})

router.post('/documents', (req, res, next) => {
  const newDocument = new Document(req.body.title, req.body.username, req.body.body)
  req.app.locals.db.collection('documents').insertOne({
    newDocument
  }, (err, result) => {
    if (err) {
      res.status(400).send({'error': err})
    }
    res.status(200).send(result)
  })
})

router.delete('/documents/:id', (req, res, next) => {
  req.app.locals.db.collection('documents').deleteOne({
    '_id': req.params.id
  }, (err, result) => {
    if (err) {
      res.status(400).send({'error': err})
    }
    res.status(200).send(result)
  })
})

router.put('/documents/:id', (req, res, next) => {
  req.app.locals.db.collection('documents').updateOne({
    '_id': req.params.id
  }, 
  {$set:
    {
      title: req.body.title,
      username: req.body.username,
      body: req.body.body
    }
  }, (err, result) => {
    if (err) {
      res.status(400).send({'error': err})
    }
    res.status(200).send(result)
  })
})

module.exports = router