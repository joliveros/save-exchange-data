import { argv } from 'yargs';
import has from 'lodash/has';
import split2 from 'split2';
import through2 from 'through2';
import InfluxDb from 'influxdb-nodejs';

const {
  DBHOST = 'localhost',
} = argv;

const dbClient = new InfluxDb(`http://${DBHOST}:8086/bitmex`);

dbClient.createDatabase();

async function save({ data, tagKey, tag, filter = [], domain }) {
  // save only when data has [ 'table', 'action', 'data' ]
  if (has(data, filter)) {
    const Tag = data[tagKey] || tag;
    return await dbClient.writePoint(domain, { data: JSON.stringify(data) }, Tag);
  }
  return null;
}

function SaveStream({ domain, filter, tagKey, tag }) {
  const stream = through2({ objectMode: true }, function (chunk, enc, done) {
    const data = JSON.parse(chunk.toString());
    const ctx = this;

    save({ data, tagKey, tag, filter, domain })
      .then(() => {
        ctx.push(chunk);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  return split2()
  .pipe(stream);
}

export default SaveStream;
