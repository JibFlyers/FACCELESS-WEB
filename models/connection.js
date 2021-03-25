var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://facelessadmin:fl32kju122D@cluster0.7hc88.mongodb.net/Faceless?retryWrites=true&w=majority',
    options,
    function(err){
      if(err){
        console.log(err);
      } else {
        console.log('*******DATABASE OK*********')
      }
    }
)

module.exports = mongoose