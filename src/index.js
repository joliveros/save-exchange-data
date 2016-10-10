import { argv } from 'yargs'
import { WsOrderBookStream } from 'bitmex-streams';
import BitmexOrderbookSaveStream from './BitmexOrderbookSaveStream';

const {
  key: AWS_KEY,
  secret: AWS_SECRET
} = argv;

const orderbookStream = new WsOrderBookStream();
const bitmexOrderbookSaveStream = new BitmexOrderbookSaveStream();

orderbookStream
  .pipe(bitmexOrderbookSaveStream);
