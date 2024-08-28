FROM python:3.11-slim

WORKDIR /backend-userauthentication

COPY requirements.txt /backend-userauthentication/
RUN pip3 install -r /backend-userauthentication/requirements.txt

COPY . .


CMD ["python", "manage.py", "runserver", "0.0.0.0:8005"]

