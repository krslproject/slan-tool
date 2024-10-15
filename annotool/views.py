from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from database.models import Process, Share, State
# Create your views here.
import random, json
import string
import boto3

# activeRequests = []
# activeResults = {}

def index(request):
    return render(request, 'index.html')

def index_ru(request):
    return render(request, 'index_ru.html')

def upload(request):
    if request.method == 'POST':
        print(request.FILES)
        print(request.POST)
        f = request.FILES['files']
        # def handle_uploaded_file(f):
        filename = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        with open('media/' + filename + '.mp4', 'wb+') as destination:
            for chunk in f.chunks():
                destination.write(chunk)
        upload_s3(filename)
        process = Process(video = filename, model_type = request.POST['type'],
            status = "active")
        process.save()
    return JsonResponse({"status":"ok", "filename": filename})

def upload_s3(filename):
    s3 = None
    while not s3:
        print("hoba")
        try:
            s3 = boto3.resource(
    		    service_name='s3',
    		    region_name='eu-north-1',
    		)
        except:
            s3 = None
    # filename = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    print("here is uploading filename")
    print(filename)
    # path = default_storage.save('media/' + filename, ContentFile(file.read()))
    # print(path)
    s3.Bucket('kslars').upload_file(Filename="media/"+ filename + ".mp4", Key="annotool/" + filename)
    return filename

def share(request):
    if request.method == 'POST':
        ranges = request.POST['ranges']
        print(ranges)
        key = ''.join(random.choices(string.ascii_uppercase + string.digits, k=28))
        Share.objects.create(text=ranges, key=key)
        print(key)
        return JsonResponse({"url": key})
    else:
        key = request.GET.get('key', '')
        print("key", key)
        ranges = Share.objects.filter(key=key).first().text
        return render(request, 'index.html', {'ranges': ranges})

def parse_requests(request):
    processes = Process.objects.filter(status="active")
    if len(processes) > 0:
        return JsonResponse(
            {"status": processes.first().status,
            "filename": processes.first().video,
            "model": processes.first().model_type}
        )
    else:
        return JsonResponse({"status": "null"})

def upload_results(request):
    data = json.loads(request.body)
    process = Process.objects.filter(video=data['filename']).first()
    if process:
        process.results = data['results']
        process.status = "ready"
        process.save()
    return JsonResponse({"status": "ok"})

def parse_results(request):
    import json
    data = request.GET
    process = Process.objects.filter(video=data['filename'], status="ready").first()

    if process:
        process.status = "completed"
        process.save()
        return JsonResponse({
            "status": process.status,
            "model": process.model_type,
            "results": json.loads(process.results.replace("'","\"")),
        })
    else:
        return JsonResponse({"status": "null"})


def state(request):
    if request.method == 'POST':
        print(request.POST)
        state_data = request.POST['state_data']
        token = request.POST.get('token', None)

        if token:
            state = State.objects.filter(token=token).first()
            if state:
                print('updating the state')
                state.data = state_data
                state.save()
            else:
                state = State.objects.create(data=state_data, token=token)
        else:
            state = State.objects.create(data=state_data)
            token = state.token

        return JsonResponse({"token": str(token)})

    elif request.method == 'GET':
        token = request.GET.get('token', '')
        state = State.objects.filter(token=token).first()
        if state:
            return JsonResponse({"state_data": state.data})
        else:
            return JsonResponse({"error": "Invalid token"})