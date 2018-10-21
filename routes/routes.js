const express = require('express')
const promiseRetry = require('promise-retry')

const Document = require('../models/Document')

const MongoClient = require('mongodb').MongoClient
const router = express.Router()
const url = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@database:27017`
const options = {
  useNewUrlParser: true, 
  reconnectTries: 60, 
  reconnectInterval: 1000
}
const promiseRetryOptions = {
  retries: options.reconnectTries,
  factor: 2,
  minTimeout: options.reconnectInterval,
  maxTimeout: 5000
}
let db

promiseRetry((retry, number) => {
  logger.info(`MongoClient connecting to ${url} - retry number: ${number}`)
  return MongoClient.connect(url, options, function(err, database) {
    if (err) {
      console.log(`FATAL MONGODB CONNECTION ERROR: ${err}`)
      process.exit(1)
    }
    db = database
  }).catch(retry)
}, promiseRetryOptions)

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
  }, {$set:
    {
      title: req.body.title,
      username: req.body.username,
      body: req.body.body
    }}).then(_ => {
    res.status(200)
  }).catch(err => {
    res.status(400).send({'error':err})
  })
})

module.exports = router