const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;
var agent = chai.request.agent("http://localhost:3000");
var sid;

describe("Server Testing", function () {
    it("Should get nothing from /v1/albums");
    it("Should fail to add an album");
    it("Should register a new user");
    it("Should login a user");
});

