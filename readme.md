1.  `docker pull couchbase` 

2.  `git clone https://github.com/httpJunkie/couchbase-server-lt && cd couchbase-server-lt && chmod +x configure.sh`  

3.  `docker build -t couchbase-server-lt .`  

4.  `docker run -d -p 8091-8094:8091-8094 -p 11210:11210 -e CB_ADMIN_USER=Administrator -e CB_ADMIN_PASS=password -e CB_BUCKET=conference-data -e CB_BUCKET_PASS= --name cbs1 couchbase-server-lt`  

At this point, we can visit [localhost:8091](http:/localhost:8091) and login with `Administrator` and `password`.  
We should have 1 server, 1 node, 1 bucket named `conference-data`!

Create a simple Node application to connect to Couchbase, insert data, add primary and custom index and execute secondary lookup query:  

5.  `cd .. && mkdir node-cb-app && cd $_ && npm init -y && npm i couchbase dotenv`  

7.  `touch .env && echo -e "user=Administrator \npass=123456 \n" >> .env && touch 01-upsert.js 02-index.js 03-index.js 04-read.js && code .`  

8.  Update file: `01-upsert.js`
    Add code from GIST: [#01 Upsert](https://gist.github.com/httpJunkie/cb-new-user-node-sdk3/blob/master/01-upsert.js)

9.  Update file: `02-index.js`
    Add code from GIST: [#02 Index](https://gist.github.com/httpJunkie/cb-new-user-node-sdk3/blob/master/02-index.js)

10. Update file: `03-index.js`
    Add code from GIST: [#03 Index](https://gist.github.com/httpJunkie/cb-new-user-node-sdk3/blob/master/03-index.js)

11. Update file: `04-read.js`
    Add code from GIST: [#04 Read](https://gist.github.com/httpJunkie/cb-new-user-node-sdk3/blob/master/04-read.js)

Now we can run each node file using the following commands:  

12. run `node 01-upsert`

    This will add three diferent types of documents to our data bucket

13. run `node 02-index`

    This will add a Primary Index to Couchbase Server. This first index is a wide net and may not be performant in a production scneario. Therefore the next index we add is more specifc, if you need help building indexes, check out the couchbase documentation on [Create Index](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/createindex.html).

14. run `node 03-index`

    This will add a custom Index to Couchbase Server, with this type of index you can optimize based on the relationships and how different types of data within a bucket can be indexed for faster results.

15. run `node 04-read`

    This will execute a query using our more performant index N1QL and return the result in the console.

## Recap

Walked through setting up Couchbase with Docker, creating a basic Node app that connects to Couchbase and a specific bucket using a user role, inserts data into a specified bucket created as we provisioned the server and finally adds an index, secondary index and then queries the server and returns ata on a secondary lookup.

**__ADDITIOANL RESEARCH, NOTES & RESOURCES__**
- Install Couchbase Server Using Docker  
    [Getting Started With Docker](https://docs.couchbase.com/server/current/install/getting-started-docker.html)  
    [Couchbase With Docker, Deploying Containerized NoSQL Cluster](https://www.youtube.com/watch?v=MtelW_belIA)  
    [Containerize Node App Communicating with Couchbase Server](https://www.youtube.com/watch?v=vQB8Xs8hJ6o)  

- Insert documents & KV operations  
    https://docs.couchbase.com/nodejs-sdk/3.0/howtos/kv-operations.html  

- Basic Indexes with N1QL (if you understand SQL, you got this!)    
    [N1QL Query Docs](https://docs.couchbase.com/nodejs-sdk/3.0/concept-docs/n1ql-query.html) 
