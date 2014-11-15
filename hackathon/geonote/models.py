from django.db import models
#from django.contrib.gis.db import models as geoM
from django.contrib.auth.models import User


# Create your models here.
class note(models.Model):
    author = models.ForeignKey(User)
    content = models.TextField(max_length=140)
    lat = models.FloatField()
    lng = models.FloatField()
    startTime = models.DateTimeField(auto_now_add=True)
    expirationTime = models.IntegerField()

def getNoteDict(note):
	return {"author":note["author"],"lat":note["lat"],"lng":note["lng"],"content":note["content"]}

