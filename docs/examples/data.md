---
title: Data Format
---

# Data Format

<script setup>
import {config} from './data';
</script>

<VennDiagramChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./data.ts#config [config]

<<< ./data.ts#data [data]

:::
