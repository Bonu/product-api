const chai = require('chai');
const chaiHttp = require('chai-http');
const supertest = require('supertest');
const server = require('../../app')
const {expect} = require("chai");
chai.use(chaiHttp);
const sinon = require('sinon');

describe('Product API', () => {
    // ... other test cases for different functionalities (if any)

    let request;
    let fetchDataStub;
    beforeEach(() => {
        request = supertest(server); // Create a new SuperAgent instance
        fetchDataStub = sinon.stub().resolves({ name: 'John Doe' });
    });

    describe('POST /api/v1/products', () => {


        it('should create a new product with valid data', (done) => {
            const newProduct = {
                name: 'Test Product',
                price: 12.34,
            };

            request.post('/api/v1/products')
                .send(newProduct)
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);

                    // expect(res.body).to.have.property('message').to.equal('Product created successfully');
                    console.log(res.body);
                    expect(res.body).to.have.property('productId').to.be.a('number');
                    done();
                });
        });

        it('should return a 400 error for missing name', (done) => {
            const invalidProduct = { price: 12.34 };

            request.post('/api/v1/products')
                .send(invalidProduct)
                .expect(400)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('message').to.equal('Name and price are required');
                    done();
                });
        });

        it('should return a 400 error for missing price', (done) => {
            const invalidProduct = { name: 'Test Product' };

            request.post('/api/v1/products')
                .send(invalidProduct)
                .expect(400)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body).to.have.property('message').to.equal('Name and price are required');

                    done();
                });
        });
    });

    describe('GET /api/v1/products/most-viewed', () => {
        it('should return top 5 most viewed products', (done) => {
            chai.request(server)
                .get('/api/v1/products/most-viewed')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(5); // Default limit: 5
                    done();
                });
        });

        it('should return products with view count greater than 0', (done) => {
            // Simulate adding some products with varying view counts
            // (implementation omitted for brevity)

            chai.request(server)
                .get('/api/v1/products/most-viewed')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.every(product => product.viewCount > 0)).to.be.true;
                    done();
                });
        });

        it('should honor a custom limit parameter', (done) => {
            chai.request(server)
                .get('/api/v1/products/most-viewed?limit=3')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });

        it('should return empty array if no products have been viewed', (done) => {
            // Simulate a scenario where no products have been viewed yet
            // (implementation omitted for brevity)
            chai.request(server)
                .get('/api/v1/products/most-viewed')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(0);
                    done();
                });
        });

        // Add a test for currency conversion (if implemented):
        it('should return prices in the specified currency (if provided)', (done) => {
            // Simulate adding a product with a price
            // (implementation omitted for brevity)
            chai.request(server)
                .get('/api/v1/products/most-viewed?currency=EUR')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    // Assert that prices are in EUR (implementation depends on your logic)
                    done();
                });
        });
    });

    describe('DELETE /api/v1/products/:id', () => {
        it('should delete a product by ID', (done) => {
            const productId = 123; // Replace with a valid product ID
            // Make the DELETE request
            chai.request(server)
                .delete(`/api/v1/products/${productId}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.deep.equal({ message: 'Product deleted successfully' });
                    done();
                });
        });

        it('should return error for non-existent product ID', (done) => {
            const invalidId = 999; // Replace with an invalid product ID
            chai.request(server)
                .delete(`/api/v1/products/${invalidId}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(500);
                    expect(res.body).to.have.property('message', 'Error deleting product');
                    done();
                });
        });
    });
});


