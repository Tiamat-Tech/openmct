/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2018, United States Government
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

 define([
     'moment'
 ],
 function (
     Moment
 ) {

    function EntryController (openmct, domainObject) {
        this.openmct = openmct;
        this.domainObject = domainObject;
        this.dndService = this.openmct.$injector.get('dndService');

        this.currentEntryValue = '';

        this.exposedMethods = this.exposedMethods.bind(this);
        this.exposedData = this.exposedData.bind(this);
    }

    EntryController.prototype.entryPosById = function (entryId) {
        var foundId = -1;

        this.domainObject.entries.forEach(function (element, index) {
            if (element.id === entryId) {
                foundId = index;
                return;
            }
        });
        
        return foundId;
    };

    EntryController.prototype.textFocus = function ($event) {
        if ($event.target) {
            this.currentEntryValue = $event.target.innerText;
        } else {
            $event.target.innerText = '';
        }
    };

    EntryController.prototype.textBlur = function ($event, entryId) {
        if ($event.target) {
            var entryPos = this.entryPosById(entryId);
            
            if (this.currentEntryValue !== $event.target.innerText) {
                this.openmct.objects.mutate(this.domainObject, 'entries[' + entryPos + '].text', $event.target.innerText);
            }
        }
    };

    EntryController.prototype.formatTime = function (unixTime, timeFormat) {
        return Moment(unixTime).format(timeFormat);
    };

    EntryController.prototype.triggerDelete = function () {
        this.$emit('delete-entry', this.entry.id);
    };

    EntryController.prototype.dropOnEntry = function (entryId) {
        var selectedObject = this.dndService.getData('mct-domain-object'),
            selectedObjectId = selectedObject.getId(),
            selectedModel = selectedObject.getModel(),
            cssClass = selectedObject.getCapability('type').typeDef.cssClass,
            entryPos = this.entryPosById(entryId),
            currentEntryEmbeds = this.domainObject.entries[entryPos].embeds,
            newEmbed = {
                type: selectedObjectId,
                id: '' + Date.now(),
                cssClass: cssClass,
                name: selectedModel.name,
                snapshot: ''
            };
        
        currentEntryEmbeds.push(newEmbed);
        this.openmct.objects.mutate(this.domainObject, 'entries[' + entryPos + '].embeds', currentEntryEmbeds);
    };

    EntryController.prototype.dragoverOnEntry = function () {
        
    };

    EntryController.prototype.exposedData = function () {
        return {
            openmct: this.openmct,
            domainObject: this.domainObject,
            dndService: this.dndService,
            currentEntryValue: this.currentEntryValue
        };
    };

    EntryController.prototype.exposedMethods = function () {
        return {
            entryPosById: this.entryPosById,
            textFocus: this.textFocus,
            textBlur: this.textBlur,
            formatTime: this.formatTime,
            triggerDelete: this.triggerDelete,
            dropOnEntry: this.dropOnEntry,
            dragoverOnEntry: this.dragoverOnEntry
        };
    };
    return EntryController;
 });