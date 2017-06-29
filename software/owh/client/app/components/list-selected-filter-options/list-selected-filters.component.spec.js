'use strict';

describe('listSelectedFilters component: ', function() {
    var $injector, $templateCache, $httpBackend, $componentController;


    beforeEach(function() {
        module('owh');
        inject(function(_$injector_, _$templateCache_, _$componentController_ ) {
            $injector   = _$injector_;
            $templateCache = _$templateCache_;
            $httpBackend = $injector.get('$httpBackend');
            $componentController = _$componentController_;
        });
        $templateCache.put('app/components/list-selected-filter-options/listSelectedFilters.html', 'app/components/list-selected-filter-options/listSelectedFilters.html');
        $httpBackend.whenGET('app/components/list-selected-filter-options/listSelectedFilters.html').respond( $templateCache.get('app/components/list-selected-filter-options/listSelectedFilters.html'));
    });

    it('should have the controller', inject(function () {
        var filters = [{"key":"race","title":"label.filter.race","primary":false,"value":[],"filterType":"checkbox","autoCompleteOptions":[{"key":"American Indian","title":"American Indian or Alaska Native"},{"key":"Asian or Pacific Islander","title":"Asian or Pacific Islander"},{"key":"Black","title":"Black or African American"},{"key":"White","title":"White"}]},{"key":"gender","title":"label.filter.gender","value":["Female"],"type":"label.filter.group.demographics","filterType":"checkbox","autoCompleteOptions":[{"key":"Female","title":"Female"},{"key":"Male","title":"Male"}]}];
        var sortOrder = ['year', 'gender', 'race', 'hispanicOrigin', 'agegroup', 'autopsy', 'placeofdeath', 'weekday', 'month', 'state', 'ucd-chapter-10', 'mcd-chapter-10'];
        var bindings = {filters:filters, sort: sortOrder};
        var ctrl = $componentController('listSelectedFilters', null, bindings);
        expect(ctrl).toBeDefined();
    }));

    it('should give filter order', inject(function () {
        var filters = [{"key":"race","title":"label.filter.race","primary":false,"value":[],"filterType":"checkbox","autoCompleteOptions":[{"key":"American Indian","title":"American Indian or Alaska Native"},{"key":"Asian or Pacific Islander","title":"Asian or Pacific Islander"},{"key":"Black","title":"Black or African American"},{"key":"White","title":"White"}]},{"key":"gender","title":"label.filter.gender","value":["Female"],"type":"label.filter.group.demographics","filterType":"checkbox","autoCompleteOptions":[{"key":"Female","title":"Female"},{"key":"Male","title":"Male"}]}];
        var sortOrder = ['year', 'gender', 'race', 'hispanicOrigin', 'agegroup', 'autopsy', 'placeofdeath', 'weekday', 'month', 'state', 'ucd-chapter-10', 'mcd-chapter-10'];
        var bindings = {filters:filters, sort: sortOrder};
        var ctrl = $componentController('listSelectedFilters', null, bindings);
        var order = ctrl.getFilterOrder(filters[0]);
        expect(order).toBe(2);
    }));

    it('should give selected filter options of a filter having checkboxes', inject(function () {
        var filters = [{"key":"race","title":"label.filter.race","primary":false,"value":["American Indian", "Black"],"filterType":"checkbox","autoCompleteOptions":[{"key":"American Indian","title":"American Indian or Alaska Native"},{"key":"Asian or Pacific Islander","title":"Asian or Pacific Islander"},{"key":"Black","title":"Black or African American"},{"key":"White","title":"White"}]},{"key":"gender","title":"label.filter.gender","value":[],"type":"label.filter.group.demographics","filterType":"checkbox","autoCompleteOptions":[{"key":"Female","title":"Female"},{"key":"Male","title":"Male"}]}];
        var sortOrder = ['year', 'gender', 'race', 'hispanicOrigin', 'agegroup', 'autopsy', 'placeofdeath', 'weekday', 'month', 'state', 'ucd-chapter-10', 'mcd-chapter-10'];
        var bindings = {filters:filters, sort: sortOrder};
        var ctrl = $componentController('listSelectedFilters', null, bindings);
        var options = ctrl.getSelectedOptionTitlesOfFilter(filters[0]);
        expect(options).toEqual('American Indian or Alaska Native, Black or African American');
    }));

    it('should give selected filter options of a filter having radio options', inject(function () {
        var filters = [{"key":"race","title":"label.filter.race","primary":false,"value":[],"filterType":"checkbox","autoCompleteOptions":[{"key":"American Indian","title":"American Indian or Alaska Native"},{"key":"Asian or Pacific Islander","title":"Asian or Pacific Islander"},{"key":"Black","title":"Black or African American"},{"key":"White","title":"White"}]},{"key":"gender","title":"label.filter.gender","value":"Female","type":"label.filter.group.demographics","filterType":"radio","autoCompleteOptions":[{"key":"Female","title":"Female"},{"key":"Male","title":"Male"}]}];
        var sortOrder = ['year', 'gender', 'race', 'hispanicOrigin', 'agegroup', 'autopsy', 'placeofdeath', 'weekday', 'month', 'state', 'ucd-chapter-10', 'mcd-chapter-10'];
        var bindings = {filters:filters, sort: sortOrder};
        var ctrl = $componentController('listSelectedFilters', null, bindings);
        var options = ctrl.getSelectedOptionTitlesOfFilter(filters[1]);
        expect(options).toEqual('Female');
    }));
});
