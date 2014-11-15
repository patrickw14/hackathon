from django.shortcuts import render, render_to_response, RequestContext
from django import forms
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login as auth_login, logout
import json
from annoying.decorators import ajax_request
import datetime
from models import *
# Create your views here.


def index(request):
    #unhidden = Note.objects.filter(hidden=False)
    #for n in unhidden:
    #    if n.endTime < datetime.now():
    #        n.hidden = True
    #        n.save()

    return render(request, 'index.html')

@ajax_request
def getNotes(request):
    if request.method == "GET":
        ne_lat = request.GET.get("ne_lat")
        ne_long = request.GET.get("ne_long")
        sw_lat = request.GET.get("sw_lat")
        sw_long = request.GET.get("sw_long")
        notes = Note.objects.all()
        # test note outputs
        #notes_output=[{"author":"hello","lat":20.11,"lng":30.11,"content":"Hola"}]
        notes_output=[]
        for note in notes:
            notes_output.append(getNoteDict(note))
        return HttpResponse(json.dumps(notes_output), content_type="application/json")

@ajax_request
def getRecentNotes(request):
    if request.method == "GET":
        ne_lat = request.GET.get("ne_lat")
        ne_long = request.GET.get("ne_long")
        sw_lat = request.GET.get("sw_lat")
        sw_long = request.GET.get("sw_long")
        ts = request.GET.get("timestamp")
        notes = Note.objects.filter(startTime__gt=ts)
        # test note outputs
        #notes_output=[{"author":"hello","lat":20.11,"lng":30.11,"content":"Hola"}]
        notes_output=[]
        for note in notes:
            notes_output.append(getNoteDict(note))
        return HttpResponse(json.dumps(notes_output), content_type="application/json")

def createNote(request):
    if request.method == "GET":
        content = request.GET.get("content")
        lat = request.GET.get("lat")
        lng = request.GET.get("lng")
        #author = request.POST["author"]
        endTime = datetime.now()+timedelta(minutes=30)
        new_note = Note(content=content,lat=lat,lng=lng,endTime=endTime,timeDelta=30)
        new_note.save()
        return HttpResponse(json.dumps(getNoteDict(new_note)), content_type="application/json")
