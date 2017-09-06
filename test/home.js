//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../build/app');
var should = chai.should();

chai.use(chaiHttp);

describe("GET \"/\"", function(){
  // done is a callback when the response has been recieved
  it("it should exist", function(done){
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  })
})
