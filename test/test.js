//During the test the env variable is set to test
process.env.NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);
//Our parent block
describe("BAOKIM", () => {
  beforeEach((done) => {
    //Before each test we empty the database in your case
    done();
  });
  /*
   * Test the /GET route
   */
  context("/GET ", () => {
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
  context("POST /collectAtPoint  ", () => {
    it("Must be success", (done) => {
      let data = {
        RequestId: "BK5F7AEC006D41F191L9",
        RequestTime: "2020-10-05 16:48:48",
        PartnerCode: "BAOKIM",
        AccNo: "900300028135",
        Signature:
          "25mzhCTyLlDw2DIcF3LYNsc5T9YXYMyeVSEQj3bAv816sK++K+7RXHbFC8czOZ5tb6F0FAAPpXqs4K5toPvtkwZohG8lq6FcGUTj8gohoThPg8Wmc3mWJxBkIp11wy+8vNbJyZoCiTvmjbq30TPBlDWVkkzVXsO4g2W7prOTUtg=",
      };
      chai
        .request(server)
        .post("/collectAtPoint")
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.ResponseCode).to.equal(200);
          expect(res.body.ResponseMessage).to.equal("Success");
          expect(res.body.AccNo).to.equal("900300028135");
          expect(res.body.AccName).to.equal("BK VAYSV");
          expect(res.body.ClientIdNo).to.equal("900300028135");
          expect(res.body.OrderId).to.equal("OD20201005161003");
          expect(res.body.CollectAmount).to.equal("100000");
          expect(res.body.CollectAmountMin).to.equal(100000);
          expect(res.body.CollectAmountMax).to.equal(9500000);
          expect(JSON.stringify(res.body.Info)).to.equal(JSON.stringify({}));
          expect(res.body.Signature).to.equal(
            "iPJ5adhNViiGuWHifaDiWh925alqkzJrg8IGu/Ikya4v2hiwANa4M70jo36EETQlVW81eSGxszAl29/k3aTTLpDBI11jhr4IOYqCWSxljxGS+Cp0Bk2HmJV2H13fRHYWxyPX6xFoP2HKyGHiWnzN1zIgHa3t8dVL0EoCc3c+Ack="
          );
          done();
        });
    });
    it("Must be fail - Signature is incorrect", (done) => {
      let data = {
        RequestId: "BK5F7AEC006D41F191L9",
        RequestTime: "2020-10-05 16:48:48",
        PartnerCode: "BAOKIM",
        AccNo: "900300028135",
        Signature:
          "26mzhCTyLlDw2DIcF3LYNsc5T9YXYMyeVSEQj3bAv816sK++K+7RXHbFC8czOZ5tb6F0FAAPpXqs4K5toPvtkwZohG8lq6FcGUTj8gohoThPg8Wmc3mWJxBkIp11wy+8vNbJyZoCiTvmjbq30TPBlDWVkkzVXsO4g2W7prOTUtg=",
      };
      chai
        .request(server)
        .post("/collectAtPoint")
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.ResponseCode).to.equal(120);
          expect(res.body.ResponseMessage).to.equal("Signature is incorrect");
          done();
        });
    });
  });
  context("POST /notifyCollection  ", () => {
    it("Must be success", (done) => {
      let data = {
        RequestId: "BK4c3fe101e2742fa",
        RequestTime: "2020-10-05 16:56:14",
        PartnerCode: "BAOKIM",
        AccNo: "900300028108",
        ClientIdNo: null,
        TransId: "5f77004e0bd71",
        TransAmount: 500000,
        TransTime: "2020-10-02 17:26:22",
        BefTransDebt: 10000000,
        AffTransDebt: 9500000,
        AccountType: 2,
        OrderId: "OD20201002111034",
        Signature:
          "A3wSx359qHRtecZYXSc//OM7nfCyQcNR9ot5Vo4bqNIUMoyJDp201AuwdmmgyB4ZsQuEtU8dAvGT2fh/IUe2maIRkrC8/6mip304j/a1pNzz4Bh2/KC0Tknt8uQjLCJ4Nuk+Gf10ITH/hGv+F3yV/t8njXqNd3Bu1D2dpaxASEY=",
      };
      chai
        .request(server)
        .post("/notifyCollection")
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.ResponseCode).to.equal(200);
          expect(res.body.ResponseMessage).to.equal("Success");
          done();
        });
    });
    it("Must be fail - Signature is incorrect", (done) => {
      let data = {
        RequestId: "BK4c3fe101e2742fa",
        RequestTime: "2020-10-05 16:56:14",
        PartnerCode: "BAOKIM",
        AccNo: "900300028108",
        ClientIdNo: null,
        TransId: "5f77004e0bd71",
        TransAmount: 500000,
        TransTime: "2020-10-02 17:26:22",
        BefTransDebt: 10000000,
        AffTransDebt: 9500000,
        AccountType: 2,
        OrderId: "OD20201002111034",
        Signature:
          "B3wSx359qHRtecZYXSc//OM7nfCyQcNR9ot5Vo4bqNIUMoyJDp201AuwdmmgyB4ZsQuEtU8dAvGT2fh/IUe2maIRkrC8/6mip304j/a1pNzz4Bh2/KC0Tknt8uQjLCJ4Nuk+Gf10ITH/hGv+F3yV/t8njXqNd3Bu1D2dpaxASEY=",
      };
      chai
        .request(server)
        .post("/notifyCollection")
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.ResponseCode).to.equal(120);
          expect(res.body.ResponseMessage).to.equal("Signature is incorrect");
          done();
        });
    });
  });
  context("POST /notifyBankSwitch ", () => {
    it("Must be success", (done) => {
      let data = {
        RequestId: "BKf7690e177a641f1",
        RequestTime: "2020-10-06 10:47:22",
        PartnerCode: "BAOKIM",
        AccName: "BK VAYSV",
        AccNo: "00837997608",
        ExpireDate: "2020-10-01 12:18:35",
        OrderId: "OD20200930120918",
        BankSortName: "VPBANK",
      };
      chai
        .request(server)
        .post("/notifyBankSwitch")
        .set({
          Signature:
            "NgAaXjFlFR4RqZuEoZ7sQLEm+/j9jAmvsNvS3+DokSfgJ0EYyrWZ1JJu4wEJQdHErZjN4xtvX5F6q3HQJEmneJ4BDk+YSEnKuPwBbGFpyb2YdbAoKj4ASw8J+igps/W9Qze7HX1Hpu5EG452YcWx6BOlJm16DZ3LPImIlLviAsE=",
        })
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);

          expect(res.body.ResponseCode).to.equal(200);
          expect(res.body.ResponseMessage).to.equal("Success");
          expect(res.body.AccNo).to.equal("00837997608");
          expect(res.body.Signature).to.equal(
            "af70deZff3hVlg+HUEp9cVcYdz2g9mzseVTbBEsVbfWWadNh/IY67tzPRbAxNqhfOtzilnSeD9slKu19e2pJNK5I0qEZKtQ7IR8HQ/WD/nVYxGEPlVFhk+9XNgsyPWanRE6BBNQ+1TlhYCx9dWDbUR3DzDNBKB5FRU3+cuBoN3w="
          );
          done();
        });
    });
    it("Must be fail - Signature Incorrect", (done) => {
      let data = {
        RequestId: "BKf7690e177a641f1",
        RequestTime: "2020-10-06 10:47:22",
        PartnerCode: "BAOKIM",
        AccName: "BK VAYSV",
        AccNo: "00837997608",
        ExpireDate: "2020-10-01 12:18:35",
        OrderId: "OD20200930120918",
        BankSortName: "VPBANK",
      };
      chai
        .request(server)
        .post("/notifyBankSwitch")
        .set({
          Signature:
            "SgAaXjFlFR4RqZuEoZ7sQLEm+/j9jAmvsNvS3+DokSfgJ0EYyrWZ1JJu4wEJQdHErZjN4xtvX5F6q3HQJEmneJ4BDk+YSEnKuPwBbGFpyb2YdbAoKj4ASw8J+igps/W9Qze7HX1Hpu5EG452YcWx6BOlJm16DZ3LPImIlLviAsE=",
        })
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);

          expect(res.body.ResponseCode).to.equal(120);
          expect(res.body.ResponseMessage).to.equal("Signature is incorrect");
          done();
        });
    });
  });
});
