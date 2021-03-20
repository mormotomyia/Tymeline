import dayjs from 'dayjs';
import { ContextMenuControl } from './components/control/ContextMenuControl';
import { DataControl } from './components/control/DataControl';
import { MainControl, SharedState } from './components/control/MainControl';
import { TimelineControl } from './components/control/TimelineControl';

import { MormoTable } from './components/mormoTable';
import { MormoDataView } from './components/view/dataView/dataView';
import { MainView } from './components/view/mainView';
import { TimelineView } from './components/view/timeline/TimelineView';

const sharedState = new SharedState();
const root = document.getElementsByTagName('body')[0];
const options = {
    size: { width: 1400, height: 400 },
    colorschema: { text: 'black', background: 'lightblue', borders: 'red' },
};

const timelineOptions = {
    ...options,
    start: dayjs().subtract(7, 'day'),
    end: dayjs().add(7, 'day'),
};
const mainView = new MainView(root, options);

const dataView = new MormoDataView(mainView);
const timelineView = new TimelineView(sharedState.timestep);
const timelineControl = new TimelineControl(
    mainView,
    timelineView,
    sharedState,
    timelineOptions
);
const dataControl = new DataControl(dataView, sharedState);
const contextMenuControl = new ContextMenuControl(mainView, sharedState);

const mainControl = new MainControl(
    mainView,
    contextMenuControl,
    timelineControl,
    dataControl
);

const bg = new MormoTable(root, mainControl, options);
bg.start();

bg.setTable([
    {
        id: 1,
        length: 3600 * 48,
        content: { text: 'OHH YES' },
        start: dayjs().subtract(5, 'day'),
        canChangeLength: true,
        canMove: false,
    },
    {
        id: 2,
        length: 543 * 3600,
        content: { text: '2' },
        start: dayjs().subtract(2, 'day'),
        canChangeLength: false,
        canMove: true,
    },
    {
        id: 3,
        length: 334 * 3600,
        content: { text: '3' },
        start: dayjs().subtract(47, 'hour'),
        canChangeLength: false,
        canMove: false,
    },
    {
        id: 4,
        length: 243 * 3600,
        content: { text: '4' },
        start: dayjs().subtract(123, 'hour'),
        canChangeLength: true,
        canMove: true,
    },
    {
        id: 5,
        length: 234 * 3600,
        content: { text: '5' },
        start: dayjs().subtract(52, 'hour'),
        canChangeLength: true,
        canMove: false,
    },
    {
        id: 6,
        length: 26 * 3600,
        content: { text: '6' },
        start: dayjs().subtract(54, 'hour'),
        canChangeLength: true,
        canMove: true,
    },
]);

// const log = document.createElement('p');
// const input = document.createElement('input');
// rootElement.appendChild(log);
// rootElement.appendChild(input);

// // const log = document.getElementById('values');
// input.oninput = (event) => updateValue(event);
// // input.addEventListener('input', updateValue);

// function updateValue(e) {
//     log.textContent = e.target.value;
// }

// bg.updateTable({1:{length:3600*48,content:{text:'asdff'},start:0},2:{length:500*3600,content:{text:'asdf'},start:5}})
