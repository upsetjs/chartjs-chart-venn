---
title: Styled Venn Diagram
---

# Styled Venn Diagram

<script setup>
import {config} from './styles';
</script>

<VennDiagramChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./styles.ts#config [config]

<<< ./basic.ts#data [data]

:::
