from django.shortcuts import render, render_to_response, RequestContext
from django import forms
from django.http import HttpResponse, HttpResponseRedirect
from models import *
from django.contrib.auth import authenticate, login as auth_login, logout
# Create your views here.


def index(request):
    return HttpResponseRedirect("http://swingbyfood.com")