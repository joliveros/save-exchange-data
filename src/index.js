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
  tagKey: 'action',
  map: (data) => {
    let newData;
    const requiredKeys = ['table', 'action', 'data'];
    if (requiredKeys.every(k => k in data)) {
      newData = data.data.map((item) => {
        const newItem = item;
        newItem.action = data.action;
        delete newItem.symbol;
        return item;
      });
    }
    return newData;
  },
});

const bitmexTradeStream = new SaveStream({
  domain: 'bitmex_trades',
  tagKey: 'action',
  map: (data) => {
    let newData;
    const requiredKeys = ['table', 'action', 'data'];
    if (requiredKeys.every(k => k in data)) {
      newData = data.data.map((item) => {
        const newItem = item;
        newItem.action = data.action;
        delete newItem.symbol;
        return item;
      });
    }
    return newData;
  },
});

function init() {
  orderbookStream
  .pipe(bitmexOrderbookSaveStream)
  .pipe(process.stdout);

  tradeStream
  .pipe(bitmexTradeStream)
  .pipe(process.stdout);
}

export default () => {
  setTimeout(init, delay);
};
