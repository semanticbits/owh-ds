import json
import os
import uuid
from random import *
from locust import HttpLocust, TaskSet, task

class OWHTaskSet(TaskSet):

    def get_side_filter_from_list(self, filter_list, filter):
        for x in filter_list:
            if x['key'] == filter['filters']['key']:
                return x

    def update_random_filter(self, primary_filter):

        primary_filter['value'] = []

        #apply 50% of the filters
        filters_limit = randint(0, len(primary_filter['sideFilters'][0]['sideFilters']) - 1)/2

        if primary_filter['key'] == 'natality':
            filters_limit = 6

        for x in range(filters_limit):
            filter_indx = randint(0, len(primary_filter['sideFilters'][0]['sideFilters'])-1)

            side_filter = primary_filter['sideFilters'][0]['sideFilters'][filter_indx]

            primary_filter['value'].append(side_filter)

            filter = self.get_side_filter_from_list(primary_filter['allFilters'], side_filter)

            #update grouping
            if side_filter['allowGrouping']:
                side_filter['filters']['groupBy'] = side_filter['filters']['defaultGroup']
                filter['groupBy'] = filter['defaultGroup']

            #select 50% of the options
            options_limit = randint(0, len(side_filter['filters']['autoCompleteOptions'])/2)
            for i in range(options_limit):
                filter_option = side_filter['filters']['autoCompleteOptions'][i]
                #Apply filters
                # for multi-select(checkboxes filter)
                if isinstance(side_filter['filters']['value'], list):
                    if filter_option['key'] not in side_filter['filters']['value']:
                        side_filter['filters']['value'].append(filter_option['key'])
                        filter['value'].append(filter_option['key'])
                else:#for single select(radio filters)
                    side_filter['filters']['value'] = filter_option['key']
                    filter['value'] = filter_option['key']

    @task
    def search(self):
        QUERIES = []
        with open(os.path.join(os.path.dirname(__file__), "./non_stats_query.json")) as jf:
            QUERIES = json.load(jf, encoding="utf8")
            jf.close()

        x = randint(0, len(QUERIES)-1)
        print ("Search page request for dataset:", QUERIES[x]['q']['key'])
        self.update_random_filter(QUERIES[x]['q'])

        QUERIES[x]['qID'] = str(uuid.uuid4())

        response = self.client.post("/search", data = None, json = QUERIES[x], auth=("owh-user", "Password@123!"))
        print("Search request status code:", response.status_code)
        res_data = response.json()
        if len(res_data['data']['resultData']['nested']['table']) == 0:
            response.failure("No data")

        print "----------------------------------------------------------------"


class OWHLocust(HttpLocust):
    task_set = OWHTaskSet
    min_wait = 15000
    max_wait = 70000
