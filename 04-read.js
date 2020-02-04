require('dotenv').config()
const { user, pass } = process.env
const couchbase = require('couchbase');
const cluster = new couchbase.Cluster('couchbase://localhost', { username: user, password: pass })
const bucket = cluster.bucket('conference-data')

let statement = "SELECT * FROM `conference-data` WHERE category='JavaScript' AND type='event'"

new Promise((resolve, reject) => {
  cluster.query(
    statement, (error, result) => error
      ? reject(error)
      : resolve(result.rows)
  )
})
.catch((err) => {ß
  console.error(err)
})
.then((result) => {
  console.info(result);
  setTimeout(() => process.exit(22), 1000);
})
