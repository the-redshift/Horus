import smtplib, ssl
from threading import Thread
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class Email(Thread):
    def __init__(self, group=None, target=None, name=None,
                    args=(), kwargs=None, verbose=None):

        super().__init__()

        self.args = args
        self.kwargs = kwargs
        return

    def run(self):
        port = 465  # For SSL
        smtp_server = "smtp.gmail.com"
        sender_email = "horus.tmc.app@gmail.com"  # Enter your address
        receiver_email = self.kwargs["mail"]
        password = "my-password-here-123!"
        text = """\
        The """ + str(self.kwargs["objects"]) + """ has appeared on your CCTV Camera. Check it out."""

        print(text)

        message = MIMEMultipart("alternative")
        message["Subject"] = "[Important] Activity on your CCTV Camera"
        message["From"] = sender_email
        message["To"] = receiver_email

        part1 = MIMEText(text, "plain")
        message.attach(part1)

        context = ssl.create_default_context()

        with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
            server.login("horus.tmc.app@gmail.com", password)
            server.sendmail(
                sender_email, receiver_email, message.as_string()
            )

