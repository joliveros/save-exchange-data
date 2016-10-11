import { argv } from 'yargs'; // eslint-disable-line
import { WsOrderBookStream, WsTradeStream } from 'bitmex-streams';
import SaveStream from './SaveStream';

const {
  delay = 3000,
} = argv;

const orderbookStream = new WsOrderBookStream();
const tradeStream = new WsTradeStream();

const bitmexOrderbookSaveStream = new SaveStream({
  domain: 'bitmex_orderbookL10',
  filter: ['table', 'action', 'data'],
  tagKey: 'action',
});

const bitmexTradeStream = new SaveStream({
  domain: 'bitmex_trades',
  filter: ['table', 'action', 'data'],
  tagKey: 'action',
});

export default () => {
  setTimeout(() => {
    orderbookStream
    .pipe(bitmexOrderbookSaveStream)
    .pipe(process.stdout);

    tradeStream
    .pipe(bitmexTradeStream)
    .pipe(process.stdout);
  }, delay);
};
