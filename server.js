const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const algoliasearch = require('algoliasearch');

app.prepare()
.then(() => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
  server.use(bodyParser.json())
  
  server.listen(8080, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:8080')
  })

  server.post('/webhook', async function (req, res) {
    // webhook payload
    const { event: { op, data }, table: { schema, name } } = req.body;

    // env vars
    const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
    const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;

    var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
    var index = client.initIndex('demo_serverless_etl_app');


    if (op === 'INSERT' && name === 'book') {
      index.addObjects([data.new], function(err, content) {
        if (err) {
          console.error(err);
          res.json({error: true, data: err});
          return;
        }
        console.log(content);
        res.json({error: false, data: content});
      });
    } else {
      // ignore if the trigger name is not matched
      res.json({error: false, data: {message: 'ignored event'}});
    }
  })  

  server.get('*', (req, res) => {
    // console.log("Next App");
    return handle(req, res)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})