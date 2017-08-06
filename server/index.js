var app = require('express')();
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var path = require('path');
config = require('./config');

mongoose.connect(config.database);

var restaurantSchema = {
    name: String,
    type: String,
    address: String,
    image: String
}

var Restaurant = mongoose.model('Restaurant', restaurantSchema, 'restaurant');

app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'api-docs.html'))
});

app.get('/restaurant', function(req, res) {
    Restaurant.find().exec(function(err, doc) {
        res.send(doc);
    })
});

app.get('/restaurant/:id', function(req, res) {
    Restaurant.findById(req.params.id, function(err, doc) {
        res.send(doc);
    });
});

app.post('/restaurant', function(req, res) {
    console.log(req.body)
    var newRestaurant = new Restaurant(req.body);
    newRestaurant.save(function(err, doc) {
        res.send(doc);
    });
});

app.put('/restaurant/:id', function(req, res) {
    Restaurant.update({_id: req.params.id}, {$set: {
        "name": req.body.name,
        "type": req.body.type,
        "address": req.body.address,
        "image": req.body.image
    }}, function(err, doc) {
       res.send(doc)
    });
});

app.delete('/restaurant/:id', function(req, res) {
    Restaurant.remove({_id: req.params.id}, function(err, doc) {
        res.send(doc)
    })
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});