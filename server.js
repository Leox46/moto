var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Moto = require('./moto');

/*************************** INIZIALIZZAZIONE *****************************/
// instantiate express
const app = express();

mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    //user: 'test', // non obbligatori, dato che sono già presenti nell'URI.
    //pass: 'test'
  };
mongoose.connect('mongodb://user:password@ds149865.mlab.com:49865/db_test', options); // MLAB
//mongoose.connect('mongodb://localhost:27017/BEARS', options) // LOCALE
const db = mongoose.connection;
db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;
// get an instance of the express Router
var router = express.Router();
/***************************************************************************/

// test route to make sure everything is working
router.get('/', function (req, res) {
  res.status = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'Welcome to our api!' });
});


router.route('/motos')

  // create a moto
  // accessed at POST http://localhost:8080/api/motos
  .post(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    // create a new instance of the Bear model
    var moto = new Moto();
    // set the moto name (comes from the request)
    moto.motoId = req.body.motoId;
  	moto.manufactor = req.body.manufactor;
  	moto.model = req.body.model;
  	moto.displacement = req.body.displacement;
  	moto.power = req.body.power;

    // save the moto and check for errors
    moto.save(function (err) {
      if (err) { res.send(err); }
      res.json(moto);
    });
  })

  // get all the motos
  // accessed at GET http://localhost:8080/api/motos
  // variante: questo server risponde anche se gli viene specificata come query
  // del GET lo studentId, ritornando tutti gli moto con lo studentId specificato.
  // accessed at GET http://localhost:8080/api/motos/?studentId=177928
  .get(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    if(req.query.studentId == null) { // se NON è specificato lo studentId, allora ritorno tutti gli motos
      Moto.find(function (err, motos) {
        if (err) { res.send(err); }
        res.json(motos);
      });
    }
    else {
      Moto.find( {'studentId': req.query.studentId}, function (err, motos) {
        if (err) { res.send(err); }
        res.json(motos);
      });
    }
  });


// route /motos/moto
router.route('/motos/:moto_id')

  // get the moto with that id
  // (accessed at GET http://localhost:8080/api/motos/:moto_id)
  .get(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    Moto.find( {'motoId': req.params.moto_id}, function (err, moto) {
      if (err) { res.send(err); }
      res.json(moto);
    });
  })

  // update the moto with this id
  // (accessed at PUT http://localhost:8080/api/motos/:moto_id)
  .put(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    // use our bear model to find the bear we want
    // ATTENZIONE!: usare findOne, e non find, altrimenti ritorna una collezione di oggetti, e bisogna estrarre il primo!
    Moto.findOne( {'motoId': req.params.moto_id}, function (err, moto) {
      if (err) { res.send(err); }
      // update the motos info
      moto.motoId = req.body.motoId;
    	moto.manufactor = req.body.manufactor;
    	moto.model = req.body.model;
    	moto.displacement = req.body.displacement;
    	moto.power = req.body.power;
      // save the moto
      Moto.save(function (err) {
        if (err) { res.send(err); }
        res.json(moto);
      });
    });
  })

  // delete the moto with this id
  // (accessed at DELETE http://localhost:8080/api/motos/:moto_id)
  .delete(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    Moto.remove( {'motoId': req.params.moto_id}, function (err, moto) {
      if (err) { res.send(err); }
      res.json({ message: 'Successfully deleted' });
    });
  });




/*************************** MIDDLEWARE CORS ********************************/
// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});
/**************************************************************************/

// register our router on /api
app.use('/api', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});


app.listen(port);
console.log('Magic happens on port ' + port);
module.exports = router;
