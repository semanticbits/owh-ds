import json
import os
import uuid
from random import *
from locust import HttpLocust, TaskSet, task

class OWHTaskSet(TaskSet):

    def update_random_filter(self, primary_filter):

        primary_filter['value'] = []

        for x in range(len(primary_filter['sideFilters'][0]['sideFilters'])-1):
            filter_indx = randint(0, len(primary_filter['sideFilters'][0]['sideFilters'])-1)

            side_filter = primary_filter['sideFilters'][0]['sideFilters'][filter_indx]

            primary_filter['value'].append(side_filter)

            #update grouping
            if side_filter['allowGrouping']:
                side_filter['filters']['groupBy'] = side_filter['filters']['defaultGroup']

            #option_indx = randint(0, len(side_filter['filters']['autoCompleteOptions']) - 1)

            for i in range(len(side_filter['filters']['autoCompleteOptions'])-2):
                filter_option = side_filter['filters']['autoCompleteOptions'][i]
                #Apply filters
                # for multi-select(checkboxes filter)
                if isinstance(side_filter['filters']['value'], list):
                    if filter_option['key'] not in side_filter['filters']['value']:
                        side_filter['filters']['value'].append(filter_option['key'])
                else:#for single select(radio filters)
                    side_filter['filters']['value'] = filter_option['key']

    @task(1)
    def home_page(self):
        print "Homepage request.."
        response = self.client.get("/")
        print ("Home page request status code:", response.status_code)
        print "Homepage request completed"
        print "---------------------------------------------------------------"

    @task(2)
    def search(self):
        x = randint(0, 4)  # Pick a random number between 0 and 4.
        with open(os.path.join(os.path.dirname(__file__), "./query.json")) as jf:
            self.DATA = json.load(jf, encoding="utf8")

        print ("Search page request for dataset:", self.DATA[x]['q']['key'])
        self.update_random_filter(self.DATA[x]['q'])

        self.DATA[x]['qID'] = str(uuid.uuid4())

        response = self.client.post("/search", data = None, json = self.DATA[x])
        print("Search request status code:", response.status_code)
        print "----------------------------------------------------------------"


class OWHLocust(HttpLocust):
    task_set = OWHTaskSet
    min_wait = 5000
    max_wait = 15000
