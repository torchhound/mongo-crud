const test = require('tape')
const request = require('supertest')
const express = require('express')

const Document = require('../models/Document')
const app = require('../index')
let documentId

before(done => {
  app.on( 'APP_STARTED', () => {
    done()
  })
})

describe('API Integration Test', () => {
  it('Runs all tests', done => {
    test('/api/documents', assert => {
      request(app)
        .post('/api/documents')
        .send(new Document('test title', 'test user', 'test body'))
        .expect(200)
        .end((err, res) => {
          if (err) return assert.fail(JSON.stringify(res))
          assert.pass('Created a new document successfully, test passed!')
          assert.end()
        })
    })

    test('/api/documents', assert => {
      request(app)
        .get('/api/documents')
        .expect(200)
        .end((err, res) => {
          if (err) return assert.fail(JSON.stringify(res))
          documentId = res.body[0]._id
          assert.pass('Got all documents successfully, test passed!')
          assert.end()
        })
    })

    test('/api/documents/:id', assert => {
      request(app)
        .get(`/api/documents/${documentId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return assert.fail(JSON.stringify(res))
          assert.pass('Got a specific document successfully, test passed!')
          assert.end()
        })
    })

    test('/api/documents/:id', assert => {
      request(app)
        .put(`/api/documents/${documentId}`)
        .send(new Document('test title edit', 'test user edit', 'test body edit'))
        .expect(200)
        .end((err, res) => {
          if (err) return assert.fail(JSON.stringify(res))
          assert.pass('Edited a document successfully, test passed!')
          assert.end()
        })
    })

    test('/api/documents/:id', assert => {
      request(app)
        .delete(`/api/documents/${documentId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return assert.fail(JSON.stringify(res))
          assert.pass('Deleted a specific document successfully, test passed!')
          assert.end()
          done()
        })
    })
  })
})