from asyncio import selector_events
from email.policy import default
from select import select
from django.http import JsonResponse
from rest_framework.decorators import api_view
import requests
import re
from pprint import pprint
from base.utils.fishwatchdefault import default_fish

CLEANR = re.compile('<.*?>') 

FIELDS = [
    'Biology',
    'Color',
    'Habitat',
    'Health Benefits',
    'Physical Description',
    'Protein',
    'Scientific Name',
    'Species Name',
    'Taste'
]

def cleanhtml(raw_html):
  cleantext = re.sub(CLEANR, '', raw_html)
  cleantext = re.sub('\n', '', cleantext)
  return cleantext

@api_view(['GET'])
def getFishWatchAPI(request, id):
    url = 'https://www.fishwatch.gov/api/species'
    header = {
    "Content-Type":"application/json"
    }
    result = requests.get(url, headers=header)
    selected_fish = result.json()[int(id)]
    response = {}
    try: 
        if not selected_fish['Image Gallery']:
            selected_fish = result.json()[int(id)+1]

        for field in FIELDS:
            if field== 'Species Name':
                response['Biology'] = cleanhtml(str(selected_fish[field]))

        response['images'] = selected_fish['Species Illustration Photo']['src']

        # for image in selected_fish['Image Gallery']:
        #     if not image['src']:
        #         continue
        #     else:
        #         response['images'].append(image['src'])
    except:
        response = default_fish
    
    return JsonResponse({'data': response })
