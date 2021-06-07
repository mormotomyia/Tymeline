import 'regenerator-runtime/runtime';
import dayjs from 'dayjs';
import {
    ContextMenuControl,
    IContextMenuView,
} from './components/control/ContextMenuControl';
import { DataControl } from './components/control/DataControl';
import {
    IContextMenuControl,
    IDataControl,
    IMainView,
    ISharedState,
    ITimelineControl,
    MainControl,
    SharedState,
} from './components/control/MainControl';
import { TimelineControl } from './components/control/TimelineControl';

import { IMainControl, MormoTable } from './components/mormoTable';
import { AuthService } from './components/services/AuthService';
import { DataService } from './components/services/DataService';
import { MormoDataView } from './components/view/dataView/dataView';
import { MainView } from './components/view/mainView';
import { TimelineView } from './components/view/timelineView/TimelineView';
import { IAuthService } from './components/services/serviceSpec/AuthServiceSpec';
import { IDataService } from './components/services/serviceSpec/DataServiceSpec';
import { IDataView } from './components/model/ViewPresenter/IDataView';
import { ITimelineView } from './components/model/ViewPresenter/ITimelineView';
import { ContextMenuView } from './components/view/miscView/ContextMenuView';
import { CreationView } from './components/view/creationView/creationViewContainer';

const root = document.getElementsByTagName('body')[0];
const options = {
    size: { width: 1400, height: 400 },
    colorschema: {
        text: 'black',
        background: 'rgba(243, 221, 205, 0.7)',
        borders: 'red',
    },
};

const timelineOptions = {
    ...options,
    start: dayjs().subtract(7, 'day'),
    end: dayjs().add(7, 'day'),
};

const authService = new AuthService('http://localhost:5000');
const dataService = new DataService('someurl', authService);
const sharedState = new SharedState();
const timelineControl = new TimelineControl(timelineOptions);
const contextMenuControl = new ContextMenuControl();
const mainControl = new MainControl();
const dataControl = new DataControl();
const mainView = new MainView();
const timelineView = new TimelineView();
const dataView = new MormoDataView();
const contextMenuView = new ContextMenuView();
const bg = new MormoTable(options);

class TymelineControl {
    contextMenuView: IContextMenuView;
    mormoTable: MormoTable;
    timelineControl: ITimelineControl;
    mainControl: IMainControl;
    contextMenuControl: IContextMenuControl;
    timelineView: ITimelineView;
    authService: IAuthService;
    dataService: IDataService;
    sharedState: ISharedState;
    mainView: IMainView;
    dataView: IDataView;
    dataControl: IDataControl;
    constructor(
        mormoTable: MormoTable,
        timelineControl: ITimelineControl,
        mainControl: IMainControl,
        contextMenuControl: IContextMenuControl,
        timelineView: ITimelineView,
        contextMenuView: IContextMenuView,
        dataView: IDataView,
        dataControl: IDataControl,
        authService: IAuthService,
        dataService: IDataService,
        sharedState: ISharedState,
        mainView: IMainView,
        root: HTMLElement,
        mainViewOptions: any
    ) {
        this.mormoTable = mormoTable;

        this.timelineControl = timelineControl;
        this.mainControl = mainControl;
        this.contextMenuControl = contextMenuControl;
        this.dataControl = dataControl;

        this.contextMenuView = contextMenuView;
        this.timelineView = timelineView;
        this.mainView = mainView;
        this.dataView = dataView;

        this.authService = authService;
        this.dataService = dataService;
        this.sharedState = sharedState;

        this.timelineControl.AddTimelineView(this.timelineView);

        this.dataControl.addDataView(this.dataView).addSharedState(this.sharedState);
        this.timelineView.addTimeStep(this.sharedState.timestep);

        this.mainControl
            .addContextMenuControl(this.contextMenuControl)
            .addTimelineControl(this.timelineControl)
            .addDataControl(this.dataControl)
            .addMainView(this.mainView);

        this.mainView
            .addTimelineView(this.timelineView)
            .addDataView(this.dataView)
            .addOptions(mainViewOptions);

        this.contextMenuControl
            .addSharedState(this.sharedState)
            .addDataService(this.dataService)
            .addContextMenuView(this.contextMenuView);

        this.contextMenuView
            .addDataService(this.dataService)
            .addSharedState(this.sharedState)
            .setContainer(root);

        this.mainView.setContainer(root);
        this.mormoTable.setContainer(root).setMainControl(this.mainControl);
        this.mormoTable.start();
        const creationview = new CreationView();
        creationview.setContainer(root);
    }

    public async start() {
        authService
            .getNewToken()
            .then(() => {
                console.log('here');
            })
            .catch((reason) => console.warn(reason));
        this.mormoTable.start();
    }
}

const control = new TymelineControl(
    bg,
    timelineControl,
    mainControl,
    contextMenuControl,
    timelineView,
    contextMenuView,
    dataView,
    dataControl,
    authService,
    dataService,
    sharedState,
    mainView,
    root,
    options
);

// control.start();

bg.setTable([
    {
        id: 1,
        length: 3600 * 48,
        content: { text: 'OHH YES' },
        start: dayjs().subtract(5, 'day').unix(),
        canChangeLength: true,
        canMove: false,
    },
    {
        id: 2,
        length: 543 * 3600,
        content: { text: '2' },
        start: dayjs().subtract(2, 'day').unix(),
        canChangeLength: false,
        canMove: true,
    },
    {
        id: 3,
        length: 334 * 3600,
        content: { text: '3' },
        start: dayjs().subtract(47, 'hour').unix(),
        canChangeLength: false,
        canMove: false,
    },
    {
        id: 4,
        length: 243 * 3600,
        content: { text: '4' },
        start: dayjs().subtract(123, 'hour').unix(),
        canChangeLength: true,
        canMove: true,
    },
    {
        id: 5,
        length: 234 * 3600,
        content: { text: '5' },
        start: dayjs().subtract(52, 'hour').unix(),
        canChangeLength: true,
        canMove: false,
    },
    {
        id: 6,
        length: 26 * 3600,
        content: { text: '6' },
        start: dayjs().subtract(54, 'hour').unix(),
        canChangeLength: true,
        canMove: true,
    },
]);
