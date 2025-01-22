from dotenv import load_dotenv
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import secrets

def sendOrderEmail(email_1, email_2, pk):
    if not os.environ.get("PRODUCTION"):
        load_dotenv()
    URL = os.getenv('BASE_URL')
    link = str(URL)+'/orders/'+str(pk)
    OTP = str(secrets.randbits(17))
    message = Mail(
        from_email=os.getenv('MAIN_EMAIL'),
        to_emails=[email_1, email_2],
        subject='Your order information',
        html_content='<h3>Thank you for your order. Please refer to this link for updates: <a href='+link+'>ORDER</a></h3>')
    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)

    except Exception as e:
        print(e.message)
        return e.message
    return OTP
