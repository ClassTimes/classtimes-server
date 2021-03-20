import { Db, MongoClient } from 'mongodb'

export async function up(db: Db, client: MongoClient) {
  await db.collection('events').rename('calendarevents')
  // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
}

export async function down(db, client: MongoClient) {
  await db.collection('calendarevents').rename('events')
  // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
}
