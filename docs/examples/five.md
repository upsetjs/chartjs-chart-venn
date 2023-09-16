---
title: Five Sets
---

# Venn Diagram with Five Sets

<script setup>
import {config} from './five';
</script>

<VennDiagramChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./five.ts#config [config]

<<< ./five.ts#data [data]

:::
