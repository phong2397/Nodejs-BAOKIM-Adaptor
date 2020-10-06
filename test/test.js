//During the test the env variable is set to test
process.env.NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe("Pets", () => {
  beforeEach((done) => {
    //Before each test we empty the database in your case
    done();
  });
  /*
   * Test the /GET route
   */
  describe("/GET ", () => {
    it("it should 404", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it("it should 404", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe("POST /collectAtPoint  ", () => {
    it("Must be success", (done) => {
      let data = {};
      chai
        .request(server)
        .post("/collectAtPoint")
        .send(data)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it("it should 404", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
