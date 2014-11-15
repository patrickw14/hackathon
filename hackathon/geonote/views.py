from django.shortcuts import render, render_to_response, RequestContext
from django import forms
from django.http import HttpResponse, HttpResponseRedirect
from models import *
from django.contrib.auth import authenticate, login as auth_login, logout
import json
# Create your views here.


def index(request):
    return HttpResponseRedirect("http://swingbyfood.com")

def getNotes(request):
	if request.method == "POST":
		ne_lat = request.POST["ne_lat"]
		ne_long = request.POST["ne_long"]
		sw_lat = request.POST["sw_lat"]
		sw_long = request.POST["sw_long"]
		#notes = Notes.objects.filter(lat>ne_lat,lat<sw_lat,lng>ne_long,lng<sw_long)
		# test note outputs
		notes_output=[{"author":"hello","lat":20.11,"lng":30.11,"content":"Hola"}]
		#notes_output=[]
		#for note in notes:
	#		notes_output.append({"author":note["author"],"lat":note["lat"],"lng":note["lng"],"content":note["content"]})
		return HttpResponse(json.dumps(notes_output), content_type="application/json")