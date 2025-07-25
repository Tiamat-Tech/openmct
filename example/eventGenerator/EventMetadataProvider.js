/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2024, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

class EventMetadataProvider {
  constructor() {
    this.METADATA_BY_TYPE = {
      eventGenerator: {
        values: [
          {
            key: 'name',
            name: 'Name',
            format: 'string'
          },
          {
            key: 'utc',
            name: 'Time',
            format: 'utc',
            hints: {
              domain: 1
            }
          },
          {
            key: 'message',
            name: 'Message',
            format: 'string',
            hints: {
              // this is used in the EventTimelineView to provide a title for the event
              // label can be changed to other properties for the title (e.g., the `name` property)
              label: 0
            }
          }
        ]
      }
    };

    const inPlaceUpdateMetadataValue = {
      key: 'messageId',
      name: 'row identifier',
      format: 'string',
      useToUpdateInPlace: true
    };
    const eventAcknowledgeMetadataValue = {
      key: 'acknowledge',
      name: 'Acknowledge',
      format: 'string'
    };

    const eventGeneratorWithAcknowledge = structuredClone(this.METADATA_BY_TYPE.eventGenerator);
    eventGeneratorWithAcknowledge.values.push(inPlaceUpdateMetadataValue);
    eventGeneratorWithAcknowledge.values.push(eventAcknowledgeMetadataValue);

    this.METADATA_BY_TYPE.eventGeneratorWithAcknowledge = eventGeneratorWithAcknowledge;
  }

  supportsMetadata(domainObject) {
    return Object.prototype.hasOwnProperty.call(this.METADATA_BY_TYPE, domainObject.type);
  }

  getMetadata(domainObject) {
    return Object.assign({}, domainObject.telemetry, this.METADATA_BY_TYPE[domainObject.type]);
  }
}

export default EventMetadataProvider;
