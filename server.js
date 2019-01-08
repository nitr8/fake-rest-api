const jsonServer = require('json-server')
const axios = require('axios')
const server = jsonServer.create()
const router = jsonServer.router('buildScripts/db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/user/:id', function(req, res) {
  var url = 'https://postman-echo.com/post';
  var header = {headers: {'Content-Type':'application/json'}};
  var body = {"user":{"id":req.params.id}};

  axios.post(url,body,header)
  .then((resp) => {
    res.send(resp.data)
    console.log("Posted: ", url,body,header);
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  })
});

server.get('/tfs/build/start/:id', (req, res) => {
  var url = 'https://postman-echo.com/post';
  var header = {
    headers: {
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin': '*'}
    };
  var body = {
    "definition":{
      "id":req.params.id}
    };

  axios.post(url,body,header)
    .then((resp) => {
      res.send(resp.data)
    })
    .catch((err) => {
      console.log("AXIOS ERROR: ", err);
    })
})

server.get('/log', (req, res) => {
  res.send("/log called")
  console.log("/log called")
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
//curl -d "param1=value1&param2=value2" -X POST http://localhost:3000/echo/123
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
