import { ISharedState } from '../components/control/MainControl';
import { CustomButton } from '../components/custom-components/customButton';
import { IContextMenuView } from '../components/view/miscView/ContextMenuView';
import { IObserver } from '../observer/Observer';

export interface IContextMenuControl extends IObserver {
    contextMenuView: IContextMenuView;
    menuLocation: HTMLElement | undefined;
    sharedState: ISharedState;
    // viewOptions: Array<{ name: string; kind: typeof CustomButton }>;
    setContextMenu(
        event: MouseEvent,
        args: Array<{ name: string; kind: typeof CustomButton }>
    ): void;
    hide(): void;
}
