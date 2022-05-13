import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import secrets
from dotenv import load_dotenv


def sendOTP(email):
    if not os.environ.get("PRODUCTION"):
        load_dotenv()
    OTP = str(secrets.randbits(17))
    print(os.getenv('MAIN_EMAIL'),'email')
    message = Mail(
        from_email=os.getenv('MAIN_EMAIL'),
        to_emails=email,
        subject='Your OTP for email verification',
        html_content='<h3>From FishnWire registration form: Your OTP is ' + OTP + '</h3> <h4> Please copy this over to the registration form for FishNWire</h4>')
    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)
        
    except Exception as e:
        print(e.message)
        return e.message
    return OTP

