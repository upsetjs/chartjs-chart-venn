---
title: Venn Diagram
---

# Venn Diagram

<script setup>
import {config} from './basic';
</script>

<VennDiagramChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./basic.ts#config [config]

<<< ./basic.ts#data [data]

:::
