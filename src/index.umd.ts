import { VennDiagramController, EulerDiagramController } from './controllers';
import { registry } from '@sgratzl/chartjs-esm-facade';
import { ArcSlice } from './elements';

export * from '.';

registry.addControllers(VennDiagramController, EulerDiagramController);
registry.addElements(ArcSlice);
