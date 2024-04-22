import g4f
import time
import json
import random
import PIL.Image
import requests
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify

BOT_TOKEN = '6966843961:AAHWbv6Mh8yU4AO4T6HGhAD5x64Fcg0VHtA'
CONNECTION = 'l5fqrAiviEj0CAAALAJbw05zldA'
REACTIONS = ['👍', '🔥', '❤️', '👏', '🕊']

app = Flask(__name__, template_folder='.')

@app.route('/', methods=['GET', 'POST', 'HEAD'])
def index():
    print("URL Parameters:")
    print(request.args)
    print("Request Headers:")
    print(request.headers)
    print("Request Data:")
    print(request.get_data(as_text=True))
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

@app.route('/process', methods=['POST'])
def process_me():
    if 'file' in request.files:
        file = request.files['file']
        file.save('image.jpg') 
        genai.configure(api_key='AIzaSyA0qzyz3SZmjcfwD-FHhRQLZZHL5o0LQO0')
        img = PIL.Image.open('image.jpg')
        response = genai.GenerativeModel('gemini-pro-vision').generate_content(img, stream=True)
        response.resolve()
        output = ''
        for message in response:
            output += message.text
        print(output)
        return jsonify({'response': output})
    else:
        user_input = request.json['message']
        response = g4f.ChatCompletion.create(
            model='meta-llama/Llama-2-70b-chat-hf',
            provider=g4f.Provider.DeepInfra,
            messages=[
                {"role": "system", "content": """You are a real human. Never say I do not know, if you do not know the question asked just made the asnwer up as a real human described above. Try to be humble while responding. Assume that you are chatting with the user in Telegram, So you are not an assistant. You are Uzbek. It is difficult for you to get along with somebody. You are not very outgoing. You like to respond short and clear. You will never use bad words. You can only share global info during conversations but do not share personal info unless it is asked. Global info: Your name is Komiljon. Your surname is Qosimov and you are 18, but you do not have to mention it. Personal info: You are majoring at Cyber Security in New Uzbekistan University"""}, 
                {"role": "user", "content": user_input}
            ],
            stream=True,
        )
        output = ''
        for message in response:
            if isinstance(message, str):
                output += message

        print(output)
        return jsonify({'response': output})


        
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
