from django.conf.urls import patterns, include, url
from django.contrib import admin
from geonote import views


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'hackathon.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^get_notes/',views.getNotes,name='getNotes'),
    url(r'^',views.index,name='index'),
)
