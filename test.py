import os
from dotenv import dotenv_values
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
config = dotenv_values(".env")

message = Mail(
    from_email='',
    to_emails='ddague77@gmail.com',
    subject='Sending with Twilio SendGrid is Fun',
    html_content='<strong>and easy to do anywhere, even with Python</strong>')
try:
    sg = SendGridAPIClient(config['SENDGRID_API_KEY'])
    response = sg.send(message)
    print(response.status_code)
    print(response.body)
    print(response.headers)
except Exception as e:
    print(e.message)