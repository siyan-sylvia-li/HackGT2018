from __future__ import print_function
from datetime import datetime, timezone, timedelta
from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools

# If modifying these scopes, delete the file token.json.
SCOPES = 'https://www.googleapis.com/auth/calendar'
event_dict = {}

event_create_dict = {}

daily = {"daily": [[0, 8], [9, 10], [12.30, 13.30], [15, 16], [19, 20.], [23.30, 24]]}


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
    later = datetime(2018, 10, 27, 0, 0, 0, tzinfo=timezone.utc).isoformat()
    print(later)
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
    create_event()


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


def get_time(full_time):
    parts = full_time.split(":")
    addition = 0
    if parts[1] == "30":
        addition = 0.3
    int_time = int(parts[0]) + addition
    return int_time


def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days)):
        yield start_date + timedelta(n)


def create_assignment_events():
    start_date = datetime(2018, 10, 21)
    end_date = datetime(2018, 10, 28)
    no_event_start = -1
    no_event_end = -1
    no_slots = 6
    duration = 3

    for cur_date_in_date in daterange(start_date, end_date):
        cur_date = cur_date_in_date.strftime("%Y-%m-%d")
        print(cur_date_in_date)
        print(cur_date_in_date.weekday())

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

            # if assg_event_start == -1
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
                time_slot = get_time_no_event(duration)
                no_event_start = time_slot[0]
                no_event_end = time_slot[1]

            event_create_dict[cur_date] = [no_event_start,no_event_end]
            no_slots = no_slots - 1

        if no_slots == 0:
            # send an output saying nope can't find it.
            break


def get_time_no_event(duration):
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


def create_event():
    print(event_create_dict)
    assignment_name = "Assignment for TEST 212"
    assignment_desc = "Test description"
    for date in event_create_dict:
        minutes = "00"
        hour = "00"
        time_slot = event_create_dict[date]
        if (time_slot[0] - int(time_slot[0]))!= 0:
            minutes = "30"

        time_slot[0] = int(time_slot[0])
        hour = '{0}'.format(str(time_slot[0]).zfill(2))

        startTime = date + "T" + hour + ":" + minutes + ":00-04:00"
        timeZone = "America/New_York"

        time_slot = event_create_dict[date]
        if (time_slot[1] - int(time_slot[1]))!= 0:
            minutes = "30"

        time_slot[1] = int(time_slot[1])
        hour = '{0}'.format(str(time_slot[1]).zfill(2))

        endTime = date + "T" + hour + ":" + minutes + ":00-04:00"
        print(startTime)
        print(endTime)

        #call_google_api(startTime, endTime, timeZone, assignment_name, assignment_desc)


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