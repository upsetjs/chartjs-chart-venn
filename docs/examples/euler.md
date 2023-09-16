---
title: Euler Diagram
---

# Euler Diagram

<script setup>
import {config} from './euler';
</script>

<EulerDiagramChart
  :options="config.options"
  :data="config.data"
/>

### Code

:::code-group

<<< ./euler.ts#config [config]

<<< ./euler.ts#data [data]

:::
