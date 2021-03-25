import { registry } from 'chart.js';
import { VennDiagramController, EulerDiagramController } from './controllers';
import { ArcSlice } from './elements';

export * from '.';

registry.addControllers(VennDiagramController, EulerDiagramController);
registry.addElements(ArcSlice);
