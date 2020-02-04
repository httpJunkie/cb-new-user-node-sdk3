require('dotenv').config()
const { user, pass } = process.env
const faker = require('faker')

const couchbase = require('couchbase')
const cluster = new couchbase.Cluster('couchbase://localhost', { username: user, password: pass })
const bucket = cluster.bucket('conference-data')
const collection = bucket.defaultCollection()

/* 
  What the data should look like: 

const data = [
  // Event
  { id: '1', name: 'Iuia Speriam', oraganizer: { firstName: 'Warren', lastName: 'nader' }, 
    country: "Turks and Caicos", category: "JavaScript", ticketPrice: "582.55", 
    type: "event" },

  // Attendee
  { id: 1, name: { firstName: "Lisette", lastName: "Bernier" }, 
    preferredCodingLanguage: "JavaScript", favoriteEventId: 1, type: "attendee" },
  { id: 1, name: { firstName: "Geovany", lastName: "Greenholt" }, 
    preferredCodingLanguage: "Rust", favoriteEventId: 1, type: "attendee" },

  // attending
  { id: '1', attendeeId: 1, evenId:  1, type: 'attending'},
  { id: '2', attendeeId: 2, evenId:  1, type: 'attending'}
]
*/

/* Lookups */
const categories = [
  "JavaScript", "Node", "React", "Angular", "Vue"
]
const langs = [
  "JavaScript", "C++", "JavaScript", "Go", "JavaScript", "C#", "JavaScript",
  "JavaScript", "Java", "JavaScript", "Rust", "JavaScript", "JavaScript", "JavaScript"
]

/* Initialize arrays */
const events = []
const attendees = []
const attendings = []

faker.seed(faker.random.number())

for (i = 0; i < 15; i++) {
  events.push({
    id: i + 1,
    name: (faker.lorem.word().charAt(0).toUpperCase()
      + faker.lorem.word().slice(1))
      + " " + (faker.lorem.words(1).charAt(0).toUpperCase()
        + faker.lorem.words(1).slice(1)),
    organizer: { firstName: faker.name.firstName(), lastName: faker.name.lastName() },
    country: faker.address.country(),
    category: categories[Math.floor(Math.random() * categories.length)],
    ticketPrice: faker.commerce.price(),
    startDate: faker.date.future(1, null).toISOString,
    type: "event"
  })
}

async function upsertEvents() {
  await events.reduce(async (promise, event) => {
    await promise
    await collection.upsert(`${event.type}::${event.id}`, event)
    console.info(`doc with key: ${event.type}::${event.id} upserted!`)
  }, Promise.resolve())
    .catch(err => console.error(err))
    .then(() => {
      console.log(`Document upsert complete!\n`)
      setTimeout(() => process.exit(22), 1000)
    })
}

faker.seed(faker.random.number())

for (i = 0; i < 15; i++) {
  attendees.push({
    id: i + 1,
    name: { firstName: faker.name.firstName(), lastName: faker.name.lastName() },
    email: faker.internet.email,
    phone: faker.phone.phoneNumber,
    preferred_language: langs[Math.floor(Math.random() * langs.length)],
    favorite_eventId: events[Math.floor(Math.random() * events.length)].id,
    type: "attendee"
  })
}

async function upsertAttendees() {
  await attendees.reduce(async (promise, attendee) => {
    await promise
    await collection.upsert(`${attendee.type}::${attendee.id}`, attendee)
    console.info(`doc with key: ${attendee.type}::${attendee.id} upserted!`)
  }, Promise.resolve())
    .catch(err => console.error(err))
    .then(() => {
      console.log(`Document upsert complete!\n`)
      setTimeout(() => process.exit(22), 1000)
    })
}

faker.seed(faker.random.number())

for (i = 0; i < 10; i++) {
  attendings.push({
    id: i + 1,
    attendeeId: attendees[Math.floor(Math.random() * attendees.length)].id,
    eventId: events[Math.floor(Math.random() * events.length)].id,
    type: "attending"
  })
}

async function upsertAttendings() {
  await attendings.reduce(async (promise, attending) => {
    await promise
    await collection.upsert(`${attending.type}::${attending.id}`, attending)
    console.info(`doc with key: ${attending.type}::${attending.id} upserted!`)
  }, Promise.resolve())
    .catch(err => console.error(err))
    .then(() => {
      console.log(`Document upsert complete!\n`)
      setTimeout(() => process.exit(22), 1000)
    })
}

upsertEvents()
.catch(e => console.log("~ERROR: " + e))
.then(() => {
  upsertAttendees()
  .catch(e => console.log("~ERROR: " + e))
  .then(() => {
    upsertAttendings()
    .catch(e => console.log("~ERROR: " + e))
  })
})
