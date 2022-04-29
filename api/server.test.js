const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiJDJiJDA0JHFBVTA1U2huWHVIbGZnOGtrc1ppaS5oalJIWktIMHM3WHFraWRqNDAyY0ZtZ0tXdnBnSTl5IiwiaWF0IjoxNjUxMjYzMTQyfQ.MSoK2qyxu8WWTDPB77iBANzpQsgub_prT1RHFNSvkOs'


beforeAll(async ()=>{
  await db('users').truncate()
})

test('sanity',()=>{
  expect(!!1).toBe(true)
})


describe('[POST] /api/auth/register',()=>{
  test('Missing username OR password results in the proper error',async ()=>{
    const noPass = await request(server).post('/api/auth/register').send({"username":"admin"})
    expect(noPass.status).toBe(400)
    expect(noPass.body.message).toBe('username and password required')
    const noUserName = await request(server).post('/api/auth/register').send({"password":"admin"})
    expect(noUserName.status).toBe(400)
    expect(noUserName.body.message).toBe('username and password required')
    const goodReq = await request(server).post('/api/auth/register').send({username:'admin',password:'1234'})
    expect(goodReq.body.id).toBeDefined()
    expect(goodReq.body.username).toBeDefined()
    expect(goodReq.body.password).toBeDefined()
  })
  test('Username taken results in proper error',async ()=> {
    const userExists = await request(server).post('/api/auth/register').send({username:'admin',password:'1234'})
    expect(userExists.status).toBe(400)
    expect(userExists.body.message).toBe('username taken')
  })
})

describe('[POST] /api/auth/login',()=>{
  test('Invalid credentials results in proper error',async ()=>{
    const badSignIn = await  request(server).post('/api/auth/login').send({'username':'admin','password':'12345'})
    expect(badSignIn.status).toBe(403)
    expect(badSignIn.body.message).toBe('invalid credentials')
  })
  
  test('Proper credentials returns a JSONwebtoken',async ()=>{
    const badSignIn = await  request(server).post('/api/auth/login').send({'username':'admin','password':'1234'})
    expect(badSignIn.body.token).toBeDefined()
  })
})

describe('[GET] /api/jokes',()=>{
  test('Missing or incorrect token results in proper error',async ()=>{
    const noToken = await request(server).get('/api/jokes')
    expect(noToken.status).toBe(403)
    expect(noToken.body.message).toBe('token required')
    const badToken = await request(server).get('/api/jokes').set({Authorization:'random token'})
    expect(badToken.status).toBe(403)
    expect(badToken.body.message).toBe('token invalid')
  })
  test('Working token results in jokes being returned',async ()=>{
    const goodToken = await request(server).get('/api/jokes').set({Authorization:TOKEN})
    expect(goodToken.body[1]).toBeDefined()
  })
})