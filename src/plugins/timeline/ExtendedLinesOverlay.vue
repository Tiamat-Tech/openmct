<!--
 Open MCT, Copyright (c) 2014-2024, United States Government
 as represented by the Administrator of the National Aeronautics and Space
 Administration. All rights reserved.

 Open MCT is licensed under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations
 under the License.

 Open MCT includes source code licensed under additional open source
 licenses. See the Open Source Licenses file (LICENSES.md) included with
 this source code distribution or the Licensing information page available
 at runtime from the About dialog for additional information.
-->
<template>
  <div class="c-timeline__overlay-lines">
    <div
      v-for="(lines, key) in extendedLinesPerKey"
      :key="key"
      class="c-timeline__event-line--extended-container"
    >
      <div
        v-for="(line, index) in lines"
        :id="line.id"
        :key="`${index - line.id}`"
        class="c-timeline__event-line--extended"
        :class="[
          line.limitClass,
          {
            '--hilite':
              (hoveredLineId && hoveredKeyString === key && line.id === hoveredLineId) ||
              (selectedLineId && selectedKeyString === key && line.id === selectedLineId)
          }
        ]"
        :style="{ left: `${line.x + leftOffset}px`, height: `${height}px` }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExtendedLinesOverlay',
  props: {
    extendedLinesPerKey: {
      type: Object,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    leftOffset: {
      type: Number,
      default: 0
    },
    extendedLineHover: {
      type: Object,
      required: true
    },
    extendedLineSelection: {
      type: Object,
      required: true
    }
  },
  computed: {
    hoveredLineId() {
      return this.extendedLineHover.id || null;
    },
    hoveredKeyString() {
      return this.extendedLineHover.keyString || null;
    },
    selectedLineId() {
      return this.extendedLineSelection.id || null;
    },
    selectedKeyString() {
      return this.extendedLineSelection.keyString || null;
    }
  }
};
</script>
