define(['../src/SummaryWidget', 'zepto'], function (SummaryWidget, $) {
    describe('The Summary Widget', function () {
        var summaryWidget,
            mockDomainObject,
            mockOldDomainObject,
            mockOpenMCT,
            mockObjectService,
            mockStatusCapability,
            mockComposition,
            mockContainer,
            listenCallback,
            listenCallbackSpy;

        beforeEach(function () {
            mockDomainObject = {
                identifier: {
                    key: 'testKey'
                },
                name: 'testName',
                composition: [],
                configuration: {}
            };
            mockComposition = jasmine.createSpyObj('composition', [
                'on',
                'off',
                'load'
            ]);
            mockStatusCapability = jasmine.createSpyObj('statusCapability', [
                'get',
                'listen',
                'triggerCallback'
            ]);

            listenCallbackSpy = jasmine.createSpy('listenCallbackSpy', function () {});
            mockStatusCapability.get.andReturn([]);
            mockStatusCapability.listen.andCallFake(function (callback) {
                listenCallback = callback;
                return listenCallbackSpy;
            });
            mockStatusCapability.triggerCallback.andCallFake(function () {
                listenCallback(['editing']);
            });

            mockOldDomainObject = {};
            mockOldDomainObject.getCapability = jasmine.createSpy('capability');
            mockOldDomainObject.getCapability.andReturn(mockStatusCapability);

            mockObjectService = {};
            mockObjectService.getObjects = jasmine.createSpy('objectService');
            mockObjectService.getObjects.andReturn(new Promise(function (resolve, reject) {
                resolve({
                    testKey: mockOldDomainObject
                });
            }));
            mockOpenMCT = jasmine.createSpyObj('openmct', [
                '$injector',
                'composition',
                'objects'
            ]);
            mockOpenMCT.$injector.get = jasmine.createSpy('get');
            mockOpenMCT.$injector.get.andReturn(mockObjectService);
            mockOpenMCT.composition = jasmine.createSpyObj('composition', [
                'get',
                'on'
            ]);
            mockOpenMCT.composition.get.andReturn(mockComposition);
            mockOpenMCT.objects.mutate = jasmine.createSpy('mutate');

            summaryWidget = new SummaryWidget(mockDomainObject, mockOpenMCT);
            mockContainer = document.createElement('div');
            summaryWidget.show(mockContainer);
        });

        it('adds its DOM element to the view', function () {
            expect(mockContainer.getElementsByClassName('w-summary-widget').length).toBeGreaterThan(0);
        });

        it('initialzes a default rule', function () {
            expect(mockDomainObject.configuration.ruleConfigById.default).toBeDefined();
            expect(mockDomainObject.configuration.ruleOrder).toEqual(['default']);
        });

        it('builds rules and rule placeholders in view from configuration', function () {
            expect($('.l-widget-rule', summaryWidget.ruleArea).get().length).toEqual(2);
        });

        it('allows initializing a new rule with a particular identifier', function () {
            summaryWidget.initRule('rule0', 'Rule');
            expect(mockDomainObject.configuration.ruleConfigById.rule0).toBeDefined();
        });

        it('allows adding a new rule with a unique identifier to the configuration and view', function () {
            summaryWidget.addRule();
            expect(mockDomainObject.configuration.ruleOrder.length).toEqual(2);
            mockDomainObject.configuration.ruleOrder.forEach(function (ruleId) {
                expect(mockDomainObject.configuration.ruleConfigById[ruleId]).toBeDefined();
            });
            summaryWidget.addRule();
            expect(mockDomainObject.configuration.ruleOrder.length).toEqual(3);
            mockDomainObject.configuration.ruleOrder.forEach(function (ruleId) {
                expect(mockDomainObject.configuration.ruleConfigById[ruleId]).toBeDefined();
            });
            expect($('.l-widget-rule', summaryWidget.ruleArea).get().length).toEqual(6);
        });

        it('allows duplicating a rule from source configuration', function () {
            var sourceConfig = JSON.parse(JSON.stringify(mockDomainObject.configuration.ruleConfigById.default));
            summaryWidget.duplicateRule(sourceConfig);
            expect(Object.keys(mockDomainObject.configuration.ruleConfigById).length).toEqual(2);
        });

        it('does not duplicate an existing rule in the configuration', function () {
            summaryWidget.initRule('default', 'Default');
            expect(Object.keys(mockDomainObject.configuration.ruleConfigById).length).toEqual(1);
        });

        it('uses mutate when updating the domain object', function () {
            summaryWidget.updateDomainObject();
            expect(mockOpenMCT.objects.mutate).toHaveBeenCalled();
        });

        it('shows configuration interfaces when in edit mode, and hides them otherwise', function () {
            setTimeout(function () {
                summaryWidget.onEdit([]);
                expect(summaryWidget.editing).toEqual(false);
                expect(summaryWidget.ruleArea.css('display')).toEqual('none');
                expect(summaryWidget.testDataArea.css('display')).toEqual('none');
                expect(summaryWidget.addRuleButton.css('display')).toEqual('none');
                summaryWidget.onEdit(['editing']);
                expect(summaryWidget.editing).toEqual(true);
                expect(summaryWidget.ruleArea.css('display')).not.toEqual('none');
                expect(summaryWidget.testDataArea.css('display')).not.toEqual('none');
                expect(summaryWidget.addRuleButton.css('display')).not.toEqual('none');
            }, 100);
        });

        it('unregisters any registered listeners on a destroy', function () {
            setTimeout(function () {
                summaryWidget.destroy();
                expect(listenCallbackSpy).toHaveBeenCalled();
            }, 100);
        });

        it('allows reorders of rules', function () {
            summaryWidget.initRule('rule0');
            summaryWidget.initRule('rule1');
            summaryWidget.domainObject.configuration.ruleOrder = ['default', 'rule0', 'rule1'];
            summaryWidget.reorder({
                draggingId: 'rule1',
                dropTarget: 'default'
            });
            expect(summaryWidget.domainObject.configuration.ruleOrder).toEqual(['default', 'rule1', 'rule0']);
        });
    });
});
