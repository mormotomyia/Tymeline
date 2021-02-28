import { IDomItems } from '../../interfaces/IObject';

export class DomItems implements IDomItems {
    legendMajor: Array<any>;
    // legendMinor: Array<HTMLElement>
    redundantLegendMajor: Array<any>;
    // redundantLegendMinor: Array<HTMLElement>

    constructor() {
        this.legendMajor = [];
        this.redundantLegendMajor = [];
    }

    clear(): void {
        this.redundantLegendMajor = this.legendMajor;
        this.legendMajor = [];
    }
}
