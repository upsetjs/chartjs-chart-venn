import { IRegistryElement, registry, ChartConfiguration } from '@sgratzl/chartjs-esm-facade';

export default function patchController(
  config: Omit<ChartConfiguration, 'type'>,
  controller: IRegistryElement,
  elements: IRegistryElement | IRegistryElement[] = [],
  scales: IRegistryElement | IRegistryElement[] = []
): ChartConfiguration {
  registry.addControllers(controller);
  registry.addControllers(elements);
  registry.addScales(scales);
  const r = config as ChartConfiguration;
  r.type = controller.id;
  return r;
}
