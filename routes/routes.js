const express = require('express')

const Document = require('../models/Document')
const MongoClient = require('mongodb').MongoClient
const router = express.Router()
const dbName = process.env.NODE_ENV === 'dev' ? 'database-test' : 'database' 
const url = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${dbName}:27017?authMechanism=SCRAM-SHA-1&authSource=admin`
const options = {
  useNewUrlParser: true, 
  reconnectTries: 60, 
  reconnectInterval: 1000
}
let db

MongoClient.connect(url, options, function(err, database) {
  if (err) {
    console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`)
    process.exit(1)
  }
  db = database.db('api')
})

router.get('/documents/all', function(req, res, next) {
  db.collection('documents').find({}).toArray((err, result) => {
    if (err) {
      res.status(400).send({'error':err})
    }
    if (result === undefined || result.length === 0) {
      res.status(400).send({'error':'No documents in database'})
    } else {
      res.status(200).send(result)
    }
  })
})

router.get('/documents/:id', function(req, res, next) {
  db.collection('documents').findOne({
    '_id': req.params.id
  }).toArray((err, result) => {
    if (err) {
      res.status(400).send({'error':err})
    }
    if (result === undefined) {
      res.status(400).send({'error':'No document matching that id was found'})
    } else {
      res.status(200).send(result)
    }
  })
})

router.post('/documents/new', function(req, res, next) {
  const newDocument = new Document(req.body.title, req.body.username, req.body.body)
  db.collection('documents').insertOne({
    newDocument
  }).toArray((err, result) => {
    if (err) {
      res.status(400).send({'error':err})
    }
    res.status(200)
  })
})

router.delete('/documents/delete/:id', function(req, res, next) {
  db.collection('documents').destroy({
    '_id': req.params.id
  }).toArray((err, result) => {
    if (err) {
      res.status(400).send({'error':err})
    }
    res.status(200)
  })
})

router.post('/documents/edit/:id', function(req, res, next) {
  db.collection('documents').updateOne({
    '_id': req.params.id
  }, 
  {$set:
    {
      title: req.body.title,
      username: req.body.username,
      body: req.body.body
    }
  }).toArray((err, result) => {
    if (err) {
      res.status(400).send({'error':err})
    }
    res.status(200)
  })
})

module.exports = router