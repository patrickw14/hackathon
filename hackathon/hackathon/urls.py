from django.conf.urls import patterns, include, url
from django.contrib import admin
from geonote import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'hackathon.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^get_notes',views.getNotes,name='getNotes'),
    url(r'^create_note/', views.createNote, name='createNote'),
    url(r'^get_recent_notes', views.getRecentNotes, name='getRecentNotes'),
    url(r'^',views.index,name='index'),


)