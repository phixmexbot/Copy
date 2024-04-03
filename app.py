import time
import json
import random
import requests
from flask import Flask, render_template, request

BOT_TOKEN = '6966843961:AAF8aUAVdZaddSeYJnGFcUerketBSvyfFFo'
CONNECTION = 'an7Mx6xZaEgnCQAADkbylrAwsgk'
REACTIONS = ['👍', '🔥', '❤️', '👏', '🕊']

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
        #print(requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/setMessageReaction',params={'chat_id': update['business_message']['from']['id'], 'message_id':  update['business_message']['message_id'],"business_connection_id": CONNECTION, 'is_big': True,'reaction': json.dumps([{'type': 'emoji', 'emoji': REACTIONS[random.randint(0, len(REACTIONS) - 1)]}])}).json())
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendChatAction",json={'chat_id': update['business_message']['from']['id'], "business_connection_id": CONNECTION, 'action': 'typing'})
        time.sleep(5)
        reply_markup = {'inline_keyboard': [[{'text': "Explore!", 'callback_game': 'https://phix-me.onrender.com'}]]}
        link_preview_options = {'is_disabled': True}
        print(requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",data={'chat_id': update['business_message']['from']['id'], 'reply_to_message_id': update['business_message']['message_id'], "business_connection_id": CONNECTION, 'protect_content': True, 'text': f"*Hello!* ✋\n_I will message you back later._\n[Wait please...](t.me/phix_bot/look)",'parse_mode': 'Markdown', 'link_preview_options': json.dumps(link_preview_options), 'reply_markup': json.dumps(reply_markup)}).json())
    requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage', json={'chat_id': 5934725286, 'text': update})
    
if __name__ == '__main__':
    app.run(debug=False)
