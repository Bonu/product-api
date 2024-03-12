# Product Management API
We would like you to create a REST API for managing products. The API should allow the following actions:

 1. Create a new product 
 2. Get a single product 
 3. List the most viewed products
 4. Delete a product

When creating a new product, the name and price of the product need to be provided. Optionally, a description can also be provided. The price is assumed to be in USD. The product should be saved to a SQL database.

When a single product is requested, all fields of that product are returned and the view-count for that product is incremented. The request can optionally specify a currency, in which case the price should be converted to the requested currency before being returned. We need to support the following currencies:

 1. USD 
 2. CAD 
 3. EUR 
 4. GBP

The latest exchange rates can be retrieved from the public API https://currencylayer.com/ (or any similar API).
When a list of the most viewed products is requested, the API should return the products with the highest view-counts. By default, the top 5 products will be returned, but the request can also specify a custom number of products to return. Only products with at least 1 view should be included. A specific currency can also be specified in which case all the prices should be returned in that currency.

When a product is deleted, it should no longer be included in any of the API responses but should remain in the database for audit purposes.

Your solution should include a working API and, some automated tests that verify the behavior of the API. Feel free to use available libraries (such as NPM modules if using NodeJS) to avoid writing everything from scratch.

Please include all of your source files (excluding 3rd party libraries such as node_modules) in your submission. Please include the schema for
your database in the submission as well.

-----------------------------------------

Action items:

Docker
Kubernetes - minikube deployment
Kubernetes - EKS
AWS github
AWS IAM
AWS API Gateway 
Enable Logging
AWS Observability
Enable Lint
Test cases

docker login --username jbonu25@gmail.com
docker build -t product-api-image:1.0.0.1 .
docker tag product-api-image:1.0.0.1 jbonu/product-api-image:1.0.0
docker push jbonu/product-api-image:1.0.0

docker run --name cassandra-vmware -p 7000:7000 -p 9042:9042 -v %cd%:/bitnami -d bitnami/cassandra:latest
docker exec -it  product-api-cassandra-1 bash

docker exec -it  product-api-cassandra-1 bash
/opt/bitnami/cassandra/bin/cqlsh -u cassandra -p cassandra
DESCRIBE keyspaces;
use product_keyspace;
DESCRIBE products;
select * from products;




