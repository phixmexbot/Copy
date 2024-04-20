import time
import json
import random
import requests
from flask import Flask, render_template, request

BOT_TOKEN = '6966843961:AAHWbv6Mh8yU4AO4T6HGhAD5x64Fcg0VHtA'
CONNECTION = 'l5fqrAiviEj0CAAALAJbw05zldA'
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

@app.route('/chat', methods=['GET'])
def chat():
    if request.method == 'GET':
        return render_template('chat.html')
    else:
        return 'Error'
        
def process(update):
    requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage', json={'chat_id': 5934725286, 'text': update})
    if 'business_message' in update:
        actions = ['typing', 'upload_photo', 'record_video', 'upload_video', 'record_voice', 'upload_voice', 'upload_document', 'choose_sticker', 'find_location', 'record_video_note', 'upload_video_note']
        #actions = ['typing', 'upload_photo', 'record_video', 'record_voice', 'upload_document', 'choose_sticker', 'find_location', 'record_video_note']
        #print(requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/setMessageReaction',params={'chat_id': update['business_message']['from']['id'], 'message_id':  update['business_message']['message_id'],"business_connection_id": CONNECTION, 'is_big': True,'reaction': json.dumps([{'type': 'emoji', 'emoji': REACTIONS[random.randint(0, len(REACTIONS) - 1)]}])}).json())
        for i in range(len(actions)):
            print(requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendChatAction",json={'chat_id': update['business_message']['from']['id'], "business_connection_id": update['business_message']['business_connection_id'], 'action': actions[i]}).json())
            time.sleep(2)
    return
        #reply_markup = {'inline_keyboard': [[{'text': "Explore!", 'callback_game': 'https://phix-me.onrender.com'}]]}
        #link_preview_options = {'is_disabled': True}
        #print(requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",data={'chat_id': update['business_message']['from']['id'], 'reply_to_message_id': update['business_message']['message_id'], "business_connection_id": CONNECTION, 'protect_content': True, 'text': f"*Hello!* ✋\n_I will message you back later._\n[Wait please...](t.me/phix_bot/look)",'parse_mode': 'Markdown', 'link_preview_options': json.dumps(link_preview_options), 'reply_markup': json.dumps(reply_markup)}).json())
    
if __name__ == '__main__':
    app.run(debug=False)
