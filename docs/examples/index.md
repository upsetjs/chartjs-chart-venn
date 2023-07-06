---
title: Examples
---

# Examples

<script setup>
import {config} from './basic';
import {config as euler} from './euler';
</script>

## Venn Diagram

<VennDiagramChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./basic.ts#config [config]

<<< ./basic.ts#data [data]

:::


## Euler Diagram

<EulerDiagramChart
  :options="euler.options"
  :data="euler.data"
/>

### Code

:::code-group

<<< ./euler.ts#config [config]

<<< ./euler.ts#data [data]

:::
