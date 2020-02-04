require('dotenv').config()
const { user, pass } = process.env

const couchbase = require('couchbase');
const cluster = new couchbase.Cluster('couchbase://localhost',{username: user, password: pass})
const bucket = cluster.bucket('conference-data')

let statement = "CREATE INDEX adv_category_type ON `conference-data`(`category`) WHERE `type` = 'event'"

new Promise((resolve, reject) => {
  cluster.query(
    statement, (error, result) => error
      ? reject(error)
      : resolve(result.rows)
  )
})
.catch((err) => {
  console.error(err)
})
.then(() => {
  console.log(`primary index created on ${bucket._name}`)
  setTimeout(() => process.exit(22), 1000);
})
