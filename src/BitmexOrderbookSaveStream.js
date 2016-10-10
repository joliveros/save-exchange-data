import keys from 'lodash/keys';
import through2 from 'through2';
import split2 from 'split2';

export default function BitmexOrderbookSaveStream() {
  const stream = through2({ objectMode: true }, function (chunk, enc, done) {
    const data = JSON.parse(JSON.parse(chunk.toString()));

    this.push(data);

    done();
  });

  return split2()
    .pipe(stream);
}
