from django.db import models
#from django.contrib.gis.db import models as geoM
from django.contrib.auth.models import User
import time
from datetime import datetime, timedelta

# Create your models here.
class Note(models.Model):
    author = models.ForeignKey(User)
    content = models.TextField(max_length=140)
    lat = models.FloatField()
    lng = models.FloatField()
    startTime = models.DateTimeField(default=datetime.now())
    timeDelta = models.IntegerField()
    endTime = models.DateTimeField()
    hidden = models.BooleanField(default=False)

    def __init__(self, lat=0, lng=0,content="Empty note", timeDelta=30):
        if timeDelta != 30:
            self.endTime = datetime.now()+timedelta(minutes=timeDelta)
        else:
            self.endTime = datetime.now()+timedelta(minutes=30)
        self.lat = lat
        self.lng = lng
        self.content = content
        self.save()


class User(models.Model):
    email = models.EmailField()
    name = models.TextField()


def getNoteDict(note):
	return {"author":note["author"],"lat":note["lat"],"lng":note["lng"],"content":note["content"]}

