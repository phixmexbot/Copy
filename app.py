import time
import json
import requests
from flask import Flask, render_template, request
BOT_TOKEN = '6966843961:AAF8aUAVdZaddSeYJnGFcUerketBSvyfFFo'
CONNECTION = 'an7Mx6xZaEgnCQAADkbylrAwsgk'

app = Flask(__name__, template_folder='.')

@app.route('/', methods=['GET', 'POST', 'HEAD'])
def index():
    if request.method == 'GET':
        return render_template('index.html')
    elif request.method == 'POST':
        process(json.loads(request.get_data()))
        return 'Success'
    else:
        return 'Error'

@app.route('/interactive', methods=['GET'])
def interactive():
    if request.method == 'GET':
        return render_template('interactive.html')
    else:
        return 'Error'

@app.route('/orbit', methods=['GET'])
def orbit():
    if request.method == 'GET':
        return render_template('orbit.html')
    else:
        return 'Error'

@app.route('/bouble', methods=['GET'])
def bouble():
    if request.method == 'GET':
        return render_template('bouble.html')
    else:
        return 'Error'

@app.route('/voice', methods=['GET'])
def voice():
    if request.method == 'GET':
        return render_template('voice.html')
    else:
        return 'Error'
        
def process(update):
    if 'business_message' in update:
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendChatAction",json={'chat_id': update['business_message']['from']['id'], "business_connection_id": CONNECTION, 'action': 'typing'})
        time.sleep(5)
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",data={'chat_id': update['business_message']['from']['id'], "business_connection_id": CONNECTION, 'text': f"*Hello!* ✋\n_I will message you back._",'parse_mode': 'Markdown'})
    requests.post(f'https://api.telegram.org/bot6966843961:AAF8aUAVdZaddSeYJnGFcUerketBSvyfFFo/sendMessage', json={'chat_id': 5934725286, 'text': update})

if __name__ == '__main__':
    app.run(debug=False)
