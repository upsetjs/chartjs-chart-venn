---
title: Customizing Venn Diagram Labels
---

# Customizing Venn Diagram Labels

<script setup>
import {config} from './cb';
</script>

<VennDiagramChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./cb.ts#config [config]

<<< ./basic.ts#data [data]

:::
