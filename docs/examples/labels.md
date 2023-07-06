---
title: Venn Diagram Labels
---

# Venn Diagram Labels

<script setup>
import {config} from './labels';
</script>

<VennDiagramChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./labels.ts#config [config]

<<< ./basic.ts#data [data]

:::
