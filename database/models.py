from django.db import models

class Process(models.Model):
    model_type = models.CharField(max_length=30)
    video = models.CharField(max_length=30)
    status = models.CharField(max_length=30)
    results = models.CharField(max_length=10000)

class Share(models.Model):
    text = models.TextField()
    key = models.CharField(max_length=28)

class State(models.Model):
    data = models.TextField()
    video = models.CharField(max_length=250)
    token = models.CharField(max_length=28)
    
