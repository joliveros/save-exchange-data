import { argv } from 'yargs';
import split2 from 'split2';
import through2 from 'through2';
import InfluxDb from 'influxdb-nodejs';
import awaitEach from 'await-each';

const debug = require('debug')('sed:savestream');

const {
  DBHOST = 'localhost',
} = argv;

debug(`http://${DBHOST}:8086/bitmex`);

const dbClient = new InfluxDb(`http://${DBHOST}:8086/bitmex`);

dbClient.createDatabase();

async function save({ data, tagKey, tag, domain, map }) {
  if (!map) {
    return new Error('Map function must be defined.');
  }
  const newData = map(data);
  const timestamp = (new Date()).getTime();


  if (newData) {
    awaitEach(newData, async function (dataItem) { // eslint-disable-line
      const Tag = dataItem[tagKey] || tag;
      const newDataItem = { timestamp, ...dataItem };
      debug(newDataItem);
      await dbClient.writePoint(domain, newDataItem, Tag);
    });
  }

  return null;
}

function SaveStream({ domain, tagKey, tag, map }) {
  const stream = through2({ objectMode: true }, function (chunk, enc, done) {
    const data = JSON.parse(chunk.toString());
    const ctx = this;

    save({ data, tagKey, tag, domain, map })
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
