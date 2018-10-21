from __future__ import print_function
from datetime import datetime, timezone, timedelta
from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
# from flask import Flask, render_template, jsonify, redirect, url_for, request, make_response, current_app
# from functools import update_wrapper
import json



#
# app = Flask(__name__)


# If modifying these scopes, delete the file token.json.
SCOPES = 'https://www.googleapis.com/auth/calendar'
event_dict = {}

event_create_dict = {}

weekend_create_dict = {}

# daily = {"daily": [[0, 8], [9, 10], [12.30, 13.30], [15, 16], [19, 20.], [23.30, 24]]}
daily = {}
deadline_year = 0
deadline_month = 0
deadline_date = 0
duration = 0
no_of_blocks = 0

assignment_name = ''
assignment_desc = 'Solving assignment'


# def crossdomain(origin=None, methods=None, headers=None,
#                 max_age=21600, attach_to_all=True,
#                 automatic_options=True):
#     if methods is not None:
#         methods = ', '.join(sorted(x.upper() for x in methods))
#     if headers is not None and not isinstance(headers, str):
#         headers = ', '.join(x.upper() for x in headers)
#     if not isinstance(origin, str):
#         origin = ', '.join(origin)
#     if isinstance(max_age, timedelta):
#         max_age = max_age.total_seconds()
#
#     def get_methods():
#         if methods is not None:
#             return methods
#
#         options_resp = current_app.make_default_options_response()
#         return options_resp.headers['allow']
#
#     def decorator(f):
#         def wrapped_function(*args, **kwargs):
#             if automatic_options and request.method == 'OPTIONS':
#                 resp = current_app.make_default_options_response()
#             else:
#                 resp = make_response(f(*args, **kwargs))
#             if not attach_to_all and request.method != 'OPTIONS':
#                 return resp
#
#             h = resp.headers
#
#             h['Access-Control-Allow-Origin'] = origin
#             h['Access-Control-Allow-Methods'] = get_methods()
#             h['Access-Control-Max-Age'] = str(max_age)
#             if headers is not None:
#                 h['Access-Control-Allow-Headers'] = headers
#             return resp
#
#         f.provide_automatic_options = False
#         return update_wrapper(wrapped_function, f)
#     return decorator
#
# @app.route("/")
# @crossdomain(origin='*')
# def index():
#     return 'You made it'
#
#
# @app.route('/add', methods=['OPTIONS', 'POST','GET'])
# @crossdomain(origin='*')
# def add():
#     print("add")
#     return 'Add works',201, {'Access-Control-Allow-Origin': '*'}
#
#
# def options (self):
#     return {'Allow' : 'PUT' }, 200, \
#     { 'Access-Control-Allow-Origin': '*', \
#       'Access-Control-Allow-Methods' : 'PUT,GET' }


def main():
    """Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    """
    store = file.Storage('token.json')
    creds = store.get()
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
        creds = tools.run_flow(flow, store)
    service = build('calendar', 'v3', http=creds.authorize(Http()))

    # Call the Calendar API
    now = datetime.utcnow().isoformat() + 'Z'
    later = datetime(deadline_year, deadline_month, deadline_date, 0, 0, 0, tzinfo=timezone.utc).isoformat()
    events_result = service.events().list(calendarId='primary', timeMin=now, timeMax=later, singleEvents=True,
                                          orderBy= "startTime").execute()
    events = events_result.get('items', [])
    create_dictionary(events)
    # if not events:
    #     print('No upcoming events found.')
    # for event in events:
    #
    #     start = event['start'].get('dateTime', event['start'].get('date'))
    #     print(start, '  ' + event['summary'])

    print(event_dict)
    create_assignment_events()
    print(event_create_dict)
    print(weekend_create_dict)
    create_event(event_create_dict)
    create_event(weekend_create_dict)


def create_dictionary(events):
    for event in events:
        start = event['start']['dateTime']
        datetime_split = start.split("T")
        date = datetime_split[0]
        start_time = get_time(datetime_split[1].split("-")[0])

        end = event['end']['dateTime']
        datetime_split = end.split("T")
        end_time = get_time(datetime_split[1].split("-")[0])

        if date in event_dict:
            cur_events = event_dict[date]
            cur_events.append([start_time,end_time])
        else:
            val = []
            val.append([start_time,end_time])
            event_dict[date] = val

    print('Dictionary created')


def get_time(full_time):
    parts = full_time.split(":")
    addition = 0
    if parts[1] == "30":
        addition = 0.3
    int_time = int(parts[0]) + addition
    return int_time


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)


def create_assignment_events():
    start_date = datetime(2018, 10, 22)
    end_date = datetime(deadline_year, deadline_month, deadline_date)
    no_event_start = -1
    no_event_end = -1

    for cur_date_in_date in daterange(start_date, end_date):
        cur_date = cur_date_in_date.strftime("%Y-%m-%d")
        if cur_date in event_dict:

            # key exists. Find a suitable time slot
            # merge my daily along with that day's events. Also any intervals overlapping. Merge them too
            calendar_events = event_dict[cur_date]
            daily_work = daily["daily"]
            combined_schedule = merge_schedules(calendar_events, daily_work)
            # got combined schedule. Now find a suitable chunk to add time
            assg_event_start = -1
            assg_event_end = -1
            start_time = 0
            for interval in combined_schedule:

                if interval[0] == start_time:
                    start_time = interval[1]
                else:
                    if interval[0] > start_time:

                        time_diff = interval[0] - start_time
                        decimal_part = time_diff - int(time_diff)
                        if decimal_part != 0:
                            time_diff = int(time_diff) + 0.5
                        if time_diff >= duration:
                            assg_event_start = start_time
                            assg_event_end = start_time + duration
                            break
                        else:
                            start_time = interval[1]

            # if ass_event_start == -1
            # means I did not find any possible fit on that day

            # check if we could find a possible time
            if assg_event_start == -1:
                continue
            else:
                event_create_dict[cur_date] = [assg_event_start, assg_event_end]
                no_slots = no_slots - 1

        else:
            # only daily event present
            # calculate it, if not created then calculate once

            if no_event_start == -1:
                time_slot = get_time_no_event()
                no_event_start = time_slot[0]
                no_event_end = time_slot[1]

            event_create_dict[cur_date] = [no_event_start, no_event_end]
            no_slots = no_slots - 1

            if cur_date_in_date.weekday() >= 5:
                found = get_time_no_event_weekend(cur_date)
                if found:
                    no_slots = no_slots - 1

        if no_slots == 0:
            # send an output saying nope can't find it.
            break


def get_time_no_event():
    start_time = 0
    for interval in daily["daily"]:
        if interval[0] == start_time:
            start_time = interval[1]
        else:
            if interval[0] > start_time:

                time_diff = interval[0] - start_time
                decimal_part = time_diff - int(time_diff)
                if decimal_part != 0:
                    time_diff = int(time_diff) + 0.5
                if time_diff >= duration:
                    assg_event_start = start_time
                    assg_event_end = start_time + duration
                    return [assg_event_start, assg_event_end]
                    break
                else:
                    start_time = interval[1]


def get_time_no_event_weekend(cur_date):
    start_time = 0
    flag = False
    for interval in daily["daily"]:
        if interval[0] == start_time:
            start_time = interval[1]
        else:
            if interval[0] > start_time:

                time_diff = interval[0] - start_time
                decimal_part = time_diff - int(time_diff)
                if decimal_part != 0:
                    time_diff = int(time_diff) + 0.5
                if time_diff >= duration:
                    assg_event_start = start_time
                    assg_event_end = start_time + duration
                    if flag == False:
                        flag = True
                        start_time = interval[1]
                    else:
                        weekend_create_dict[cur_date] = [assg_event_start,assg_event_end]
                        return True
                else:
                    start_time = interval[1]

    return False


def merge_schedules(calendar, daily):
    for e in daily:
        calendar.append(e)
    calendar.sort()
    calendar = overlap_intervals(calendar)
    return calendar


def overlap_intervals(intervals):
    res = [intervals[0]]
    for n in intervals[1:]:
        if n[0] <= res[-1][1]:
            res[-1][1] = max(n[1], res[-1][1])
        else:
            res.append(n)
    return res


def create_event(event_to_be_created):
    for date in event_to_be_created:
        minutes = "00"
        hour = "00"
        time_slot = event_to_be_created[date]
        if (time_slot[0] - int(time_slot[0])) != 0:
            minutes = "30"

        time_slot[0] = int(time_slot[0])
        hour = '{0}'.format(str(time_slot[0]).zfill(2))

        startTime = date + "T" + hour + ":" + minutes + ":00-04:00"
        timeZone = "America/New_York"

        time_slot = event_to_be_created[date]
        if (time_slot[1] - int(time_slot[1]))!= 0:
            minutes = "30"

        time_slot[1] = int(time_slot[1])
        hour = '{0}'.format(str(time_slot[1]).zfill(2))

        endTime = date + "T" + hour + ":" + minutes + ":00-04:00"

        call_google_api(startTime, endTime, timeZone, assignment_name, assignment_desc)


def call_google_api(start, end, timeZone, name, desc):
    event = {
        'summary': name,
        'location': '',
        'description': desc,
        'start': {
            'dateTime': start,
            'timeZone': timeZone,
        },
        'end': {
            'dateTime': end,
            'timeZone': timeZone,
        },
    }

    print(event)

    store = file.Storage('token.json')
    creds = store.get()
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
        creds = tools.run_flow(flow, store)
    service = build('calendar', 'v3', http=creds.authorize(Http()))

    event = service.events().insert(calendarId='primary', body=event).execute()
    print
    'Event created: %s' % (event.get('htmlLink'))


if __name__ == '__main__':
    main()

# if __name__ == "__main__":
#     app.run(debug=True)
