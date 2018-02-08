var express = require('express')
var app = express()
var hogan = require('hogan-express')
var fs = require('fs')
var _ = require('lodash')
app.engine('html', hogan)
app.set('port', (process.env.PORT || 3000))
app.use('/', express.static(__dirname + '/public/'))
var filename = process.env.BUCKET_FILE || 'bucket.json'
app.get('/', function(req, res) {
  fs.readFile(__dirname + '/' + filename, 'utf8', function(err, data) {
    if (err) throw err;
    var json = JSON.parse(data);
    var obj = {};
    var objects = json.bucket.objects;
    obj.objects = {};
    obj.objects.all = objects;
    obj.objects.type = _.groupBy(objects, 'type_slug');
    obj.object = _.map(objects, keyMetafields);
    obj.object = _.keyBy(obj.object, 'slug');
    var steps = obj.objects.type.steps
    res.locals.steps = steps;
    res.render('index.html')
  });
});
app.listen(app.get('port'))

// Functions
function keyMetafields(object){
  var metafields = object.metafields;
  if(metafields){
    object.metafield = _.keyBy(metafields, 'key');
  }
  return object;
}