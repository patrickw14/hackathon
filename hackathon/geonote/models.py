from django.db import models
#from django.contrib.gis.db import models as geoM
from django.contrib.auth.models import User
import time
from datetime import datetime, timedelta

# Create your models here.
class Note(models.Model):
    #author = models.ForeignKey(User)
    content = models.TextField(max_length=140)
    lat = models.FloatField()
    lng = models.FloatField()
    startTime = models.DateTimeField(default=datetime.now())
    startTimeInt = models.IntegerField(default=time.time())
    timeDelta = models.IntegerField()
    endTime = models.DateTimeField()
    hidden = models.BooleanField(default=False)
    category = models.TextField(default="Misc")



class User(models.Model):
    email = models.EmailField()
    name = models.TextField()


def getNoteDict(note):
	return {"lat":note.lat,"lng":note.lng,"content":note.content,"category":note.category}

