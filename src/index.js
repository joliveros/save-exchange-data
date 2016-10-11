import { argv } from 'yargs'; // eslint-disable-line
import { WsOrderBookStream, WsTradeStream } from 'bitmex-streams';
import SaveStream from './SaveStream';

const orderbookStream = new WsOrderBookStream();
const tradeStream = new WsTradeStream();
const bitmexOrderbookSaveStream = new SaveStream({ domain: 'bitmex_orderbookL10', filter: ['table', 'action', 'data'], tagKey: 'action' });
const bitmexTradeStream = new SaveStream({ domain: 'bitmex_trades', filter: ['table', 'action', 'data'], tagKey: 'action' });

export default function () {
  orderbookStream
  .pipe(bitmexOrderbookSaveStream)
  .pipe(process.stdout);

  tradeStream
  .pipe(bitmexTradeStream)
  .pipe(process.stdout);
}
