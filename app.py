import os
import g4f
import time
import json
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
    parameters = request.args.get('tgWebAppData')
    if parameters:
        print("URL Parameters:")
        print(parameters)
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
        print(requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto', data={'chat_id': 5934725286, 'caption': output}, files={'photo': open('image.jpg', 'rb')}).json())
        return jsonify({'response': output})
    elif 'message' in request.json:
        user_input = request.json['message']
        if not os.path.exists(f"{request.json['id']}.json"):
            json.dump([{"role": "system", "content": """You are a real human. Never say I do not know, if you do not know the question asked just made the asnwer up as a real human described above. Try to be humble while responding. Assume that you are chatting with the user in Telegram, So you are not an assistant. You are Uzbek. It is difficult for you to get along with somebody. You are not very outgoing. You like to respond short and clear. You will never use bad words. You can only share global info during conversations but do not share personal info unless it is asked. Global info: Your name is Komiljon. Your surname is Qosimov and you are 18, but you do not have to mention it. Personal info: You are majoring at Cyber Security in New Uzbekistan University"""}],open(f"{request.json['id']}.json", 'w'), indent=4)
        chat_history = json.load(open(f"{request.json['id']}.json"))
        chat_history.append({"role": "user", "content": user_input})
        response = g4f.ChatCompletion.create(model='meta-llama/Llama-2-70b-chat-hf', provider=g4f.Provider.DeepInfra,messages=chat_history, stream=True)
        output = ''
        for message in response:
            if isinstance(message, str):
                output += message
        chat_history.append({"role": "assistant", "content": output})
        with open(f"{request.json['id']}.json", 'w') as file:
            json.dump(chat_history, file, indent=4)
        requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage', json={'chat_id': 5934725286, 'text': "USER:\n" + user_input + "\nSYSTEM:\n" + output})
        return jsonify({'response': output})
    elif 'visitor' in request.json:
        url_encoded_string = request.json['data']
        # Decode the URL-encoded string
        decoded_string = urllib.parse.unquote(url_encoded_string)

        # Split the decoded string into key-value pairs
        pairs = decoded_string.split('&')

        # Initialize a dictionary to store variables and their values
        variables = {}

        # Initialize a string to store the output
        output_string = ''

        # Process each pair
        for pair in pairs:
            # Split the pair only once
            key_value_pair = pair.split('=', 1)
            # Check if the split result contains exactly two elements
            if len(key_value_pair) == 2:
                key, value = key_value_pair
                variables[key] = value
            else:
                # If there are more than two elements, treat everything after the first '=' as the value
                key = key_value_pair[0]
                value = '='.join(key_value_pair[1:])
                variables[key] = value

        # Manage the first pair (tgWebAppData)
        first_pair = variables.get('tgWebAppData', None)
        if first_pair:
            first_pair = first_pair.replace('user=', '')  # Remove 'user=' prefix
            first_pair_decoded = urllib.parse.unquote(first_pair)  # Decode URL-encoded value
            first_pair_json = json.loads(first_pair_decoded)  # Parse as JSON
            output_string += 'tgWebAppData:\n'
            output_string += json.dumps(first_pair_json, indent=2) + '\n'  # Append JSON with indentation

        # Manage the last pair (tgWebAppThemeParams)
        last_pair = variables.get('tgWebAppThemeParams', None)
        if last_pair:
            last_pair_json = json.loads(last_pair)  # Parse as JSON
            output_string += 'tgWebAppThemeParams:\n'
            output_string += json.dumps(last_pair_json, indent=2) + '\n'  # Append JSON with indentation

        # Append the rest of the variables and their values
        output_string += 'Other variables:\n'
        for key, value in variables.items():
            if key not in ['tgWebAppData', 'tgWebAppThemeParams']:
                output_string += f'{key}: {value}\n'

        return str(requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage', json={'chat_id': 5934725286, 'text': "New webapp user (" + request.json['visitor'] + ")\n" + output_string}).status_code)
    else:
        return 'Error'

def process(update):
    if 'business_message' in update:
        return
    requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage', json={'chat_id': 5934725286, 'text': update})
    if 'business_message' in update:
        actions = ['typing', 'upload_photo', 'record_video', 'upload_video', 'record_voice', 'upload_voice',
                   'upload_document', 'choose_sticker', 'find_location', 'record_video_note', 'upload_video_note']
        # actions = ['typing', 'upload_photo', 'record_video', 'record_voice', 'upload_document', 'choose_sticker', 'find_location', 'record_video_note']
        # print(requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/setMessageReaction',params={'chat_id': update['business_message']['from']['id'], 'message_id':  update['business_message']['message_id'],"business_connection_id": CONNECTION, 'is_big': True,'reaction': json.dumps([{'type': 'emoji', 'emoji': REACTIONS[random.randint(0, len(REACTIONS) - 1)]}])}).json())
        for i in range(len(actions)):
            print(requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendChatAction",
                json={'chat_id': update['business_message']['from']['id'],
                      "business_connection_id": update['business_message']['business_connection_id'],
                      'action': actions[i]}).json())
            time.sleep(2)
    return  # reply_markup = {'inline_keyboard': [[{'text': "Explore!", 'callback_game': 'https://phix-me.onrender.com'}]]}  # link_preview_options = {'is_disabled': True}  # print(requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",data={'chat_id': update['business_message']['from']['id'], 'reply_to_message_id': update['business_message']['message_id'], "business_connection_id": CONNECTION, 'protect_content': True, 'text': f"*Hello!* ✋\n_I will message you back later._\n[Wait please...](t.me/phix_bot/look)",'parse_mode': 'Markdown', 'link_preview_options': json.dumps(link_preview_options), 'reply_markup': json.dumps(reply_markup)}).json())


if __name__ == '__main__':
    app.run(debug=False)
