from django.shortcuts import render, render_to_response, RequestContext
from django import forms
from django.http import HttpResponse, HttpResponseRedirect
from models import *
from django.contrib.auth import authenticate, login as auth_login, logout
import json
from annoying.decorators import ajax_request
# Create your views here.


def index(request):
    unhidden = note.objects.filter(hidden=False)
    for note in unhidden:
        if note.endTime < datetime.now():
            note.hidden = True
            note.save()

    return render(request, 'index.html')

@ajax_request
def getNotes(request):
	if request.method == "GET":
		ne_lat = request.GET.get("ne_lat")
		ne_long = request.GET.get("ne_long")
		sw_lat = request.GET.get("sw_lat")
		sw_long = request.GET.get("sw_long")
		#notes = note.objects.filter(lat>ne_lat,lat<sw_lat,lng>ne_long,lng<sw_long)
		# test note outputs
		notes_output=[{"author":"hello","lat":20.11,"lng":30.11,"content":"Hola"}]
		#notes_output=[]
		#for note in notes:
	#		notes_output.append(getNoteDict(note))
		return HttpResponse(json.dumps(notes_output), content_type="application/json")



def createNote(request):
	if request.method == "POST":
		content = request.POST["content"]
		lat = request.POST["lat"]
		lng = request.POST["lng"]
		#author = request.POST["author"]
		new_note = note(content=content,lat=lat,lng=lng)
		new_note.save()
		#returns new note
		return HttpResponse(json.dumps(getNoteDict(new_note)), content_type="application/json")
