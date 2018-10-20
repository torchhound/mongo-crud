const express = require('express')

const Document = require('./models/Document')

const MongoClient = require('mongodb').MongoClient
const router = express.Router()
const url = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@database:27017`
var db

MongoClient.connect(url, function(err, database) {
  if (err) {
    console.log(`FATAL MONGODB CONNECTION ERROR: ${err}`)
    process.exit(1)
  }
  db = database
})

router.get('/documents/all', function(req, res, next) {
  db.Documents.find({}).then(documents => {
    if (documents === undefined || documents.length === 0) {
      res.status(400).send({'error':'No documents in database'})
    } else {
      res.status(200).send(documents)
    }
  }).catch(err => {
    res.status(400).send({'error':err})
  })
})

router.get('/documents/:id', function(req, res, next) {
  db.Documents.findOne({
    '_id': req.params.id
  }).then(document => {
    if (document === undefined) {
      res.status(400).send({'error':'No document matching that id was found'})
    } else {
      res.status(200).send(document)
    }
  }).catch(err => {
    res.status(400).send({'error':err})
  })
})

router.post('/documents/new', function(req, res, next) {
  const newDocument = new Document()
  db.Documents.insertOne({
    newDocument
  }).then(_ => {
    res.status(200)
  }).catch(err => {
    res.status(400).send({'error':err})
  })
})

router.delete('/documents/delete/:id', function(req, res, next) {
  db.Documents.destroy({
    '_id': req.params.id
  }).then(_ => {
    req.status(200)
  }).catch(err => {
    res.status(400).send({'error':err})
  })
})

router.post('/documents/edit/:id', function(req, res, next) {
  db.Documents.updateOne({
    '_id': req.params.id
  }, {}).then(_ => {
    res.status(200)
  }).catch(err => {
    res.status(400).send({'error':err})
  })
})

module.exports = router