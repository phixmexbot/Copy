import os
import time
import json
import imaplib
import requests
import PIL.Image
import urllib.parse
from g4f.client import Client
from pymongo import MongoClient
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

INSTRUCTION = """You are a real human. Never say I do not know, if you do not know the question asked just made the asnwer up as a real human described above. Try to be humble while responding. Assume that you are chatting with the user in Telegram, So you are not an assistant. You are Uzbek. It is difficult for you to get along with somebody. You are not very outgoing. You like to respond short and clear. You will never use bad words. You can only share global info during conversations but do not share personal info unless it is asked. Global info: Your name is Komiljon. Your surname is Qosimov and you are 18, but you do not have to mention it. Personal info: You are majoring at Cyber Security in New Uzbekistan University"""
GEMINI_API = 'AIzaSyA0qzyz3SZmjcfwD-FHhRQLZZHL5o0LQO0'
EMAIL = os.environ.get('EMAIL')
EMAIL_PASSWORD = os.environ.get('PASSWORD')
BOT_TOKEN = '6966843961:AAHWbv6Mh8yU4AO4T6HGhAD5x64Fcg0VHtA'
CONNECTION = 'l5fqrAiviEj0CAAALAJbw05zldA'
USERNAME = 'look'
PASSWORD = 'eternal'
GROUP = -1002151725792
BOT_ID = 6966843961
STICKER_INSTRUCTION = 'Based on the text, choose one reaction from the stickers provided and send that sticker only if the message is relevant or impactful enough to warrant a response. If the message is not important or if it feels overwhelming to react, you may choose not to respond and send I which stands for ignore. Remember, like a real human, you don\'t need to react to every message—only those that genuinely resonate or require acknowledgment. Stickers to choose from: 👍👎❤🔥🥰👏😁🤔🤯😱🤬😢🎉🤩🤮💩🙏👌🕊🤡🥱🥴😍🐳❤‍🔥🌚🌭💯🤣⚡🍌🏆💔🤨😐🍓🍾💋🖕😈😴😭🤓👻👨‍💻👀🎃🙈😇😨🤝✍🤗🫡🎅🎄☃💅🤪🗿🆒💘🙉🦄😘💊🙊😎👾🤷‍♂🤷🤷‍♀😡'
CHAT_INSTRUCTION = 'You are a real human. Your name is Phix. You are using Telegram platform and replying to the messages. Make a relevant comment on the user\'s post and make it look like how real human do!'
INITIAL_INSTRUCTION = 'You are a real human. You are using Telegram platform and making comment to the posts that you read. make it look like how real human do.'
ADVANCED_INSTRUCTION = 'You are a real human. Your name is Phix. You are using Telegram platform and reading messages of other members of the group. Chat history will be given to you. At some point there might be conflicts within members or sometimes people ask for something from the group members. Only in this cases make a response like a real human do or when you feel you need to response, otherwise send IGNORE when you decide not to interact to the conversation. If the message is not for you, just ignore, however you can respond if that message is something surprising. You are responding to the last message sender. Note that there are many people in the group, treat each of them separately'
REACTIONS = ['👍', '🔥', '❤️', '👏', '🕊']
DIRECTORIES = ['home', 'about', 'copyright', 'test', 'feedback', 'activities/lightening-flash', 'activities/orbit-around',
               'activities/doodle-rain', 'activities/angry-birds',
               'projects/automatic-attendance', 'projects/ai-navigator', 'projects/exaverse']
# 'services/chat-bot', 'services/home-tab', has been removed temporarily

app = Flask(__name__, template_folder='.')


@app.route('/activate', methods=['GET'])
def activate():
    return "Activation successful!", 200


@app.route('/', methods=['GET', 'POST', 'HEAD'])
def index():
    if request.method == 'GET':
        return render_template('templates/initial.html')
    elif request.method == 'POST':
        process(json.loads(request.get_data()))
        return 'Success'
    else:
        return 'Error'


@app.route('/<path:path>', methods=['GET'])
def router(path):
    try:
        if path in DIRECTORIES:
            return render_template(f'templates/{path}.html')
        else:
            print(DIRECTORIES)
            return render_template('templates/errors/404.html')
    except Exception as e:
        print(f"Error occurred: {e}")
        return render_template('templates/errors/501.html')


@app.route('/process', methods=['POST'])
def process_me():
    if 'feedback' in request.json:
        return email(request.json['email'], request.json['name'], request.json['feedback'])
    elif 'file' in request.files:
        file = request.files['file']
        file.save('image.jpg')
        genai.configure(api_key=GEMINI_API)
        img = PIL.Image.open('image.jpg')
        response = genai.GenerativeModel('gemini-pro-vision').generate_content(img, stream=True)
        response.resolve()
        output = ''
        for message in response:
            output += message.text
        print(requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto',
            data={'chat_id': 5934725286, 'caption': output}, files={'photo': open('image.jpg', 'rb')}).json())
        return jsonify({'response': output})

    elif 'message' in request.json:
        user = database_search({"session_id": request.json['id']})
        chat_history = user['data']
        chat_history.append({"role": "user", "content": request.json['message']})

        client = Client()
        response = client.chat.completions.create(model="mixtral-8x7b", messages=chat_history)
        text = response.choices[0].message.content
        # send to the response text to client

        requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage', json={'chat_id': 5934725286,
                                                                                    'text': f"USER: {user['visitor']} on session: ({user['id']})\n" +
                                                                                            request.json[
                                                                                                'message'] + "\nSYSTEM:\n" + text})
        chat_history.append({"role": "assistant", "content": text})

        query = {"id": request.json['id']}
        updated_data = {"$set": {"data": chat_history}}
        database_update(query, updated_data)

        return jsonify({'response': text})

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

        record = {"id": request.json['visitor'], "session_id": request.json['id'], "info": output_string,
            "data": [{"role": "system", "content": INSTRUCTION}]}
        database_insert(record)

        return str(requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage', json={'chat_id': 5934725286,
                                                                                               'text': "New webapp user (" +
                                                                                                       request.json[
                                                                                                           'visitor'] + ")\n" + output_string}).status_code)
    elif 'stars' in request.json:
        full_data = rating_update(request.json['stars'])
        value = round(full_data['total_stars'] / full_data['total_rates'], 2)
        print(value)
        data = {"averageRating": value}
        return jsonify(data)
    else:
        return 'Error'


def email(to_email, name, feedback):
    try:
        from_email = "noreply@eternal.uz"
        password = "K_973050330_k"

        subject_user = "Thank you for contacting us"
        body_user = f"{name}, Thank you for reaching out to Eternal.uz. We have received your message and will get back to you shortly."

        message_user = MIMEMultipart()
        message_user['From'] = from_email
        message_user['To'] = to_email
        message_user['Subject'] = subject_user
        message_user.attach(MIMEText(body_user, 'plain'))

        to_internal_email = "komiljon@eternal.uz"
        subject_internal = "New Feedback Received"
        body_internal = f"User Name: {name}\nUser Email: {to_email}\nFeedback: {feedback}"

        message_internal = MIMEMultipart()
        message_internal['From'] = from_email
        message_internal['To'] = to_internal_email
        message_internal['Subject'] = subject_internal
        message_internal.attach(MIMEText(body_internal, 'plain'))

        server = smtplib.SMTP('smtp.zoho.com', 587)
        server.starttls()
        server.login(from_email, password)

        server.sendmail(from_email, to_internal_email, message_internal.as_string())
        server.sendmail(from_email, to_email, message_user.as_string())

        server.quit()
        return 'Sent'
    except:
        return 'Error'


def check_unread_emails():
    try:
        if not EMAIL or not PASSWORD:
            raise ValueError("Email or password environment variable not set")

        mail = imaplib.IMAP4_SSL('imap.gmail.com')
        mail.login(EMAIL, PASSWORD)
        mail.select('inbox')

        status, response = mail.search(None, '(UNSEEN)')
        unread_msg_nums = response[0].split()

        mail.logout()
        return len(unread_msg_nums)
    except Exception as e:
        print(f"Error checking emails: {e}")
        return 0


def business(update):
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


def process(update):
    requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage', json={'chat_id': 5934725286, 'text': update})
    if  'message' in update and update['message']['chat']['id'] == GROUP:
        if 'text' in update['message']:
            if update['message']['from']['id'] == 1087968824:
                text = update['message']['text']
                message_id = update['message']['message_id']

                client = Client()

                response = client.chat.completions.create(provider='',  # Replace with your provider
                    model="blackbox",
                    messages=[{'role': 'user', 'content': text}, {'role': 'system', 'content': INITIAL_INSTRUCTION}],
                    stream=True)

                output = ""
                edit_id = requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
                    json={'chat_id': GROUP, 'reply_to_message_id': message_id, 'text': '*Eternal © 2024*',
                          'parse_mode': 'Markdown'}).json()['result']['message_id']

                last_print_time = time.time()
                for chunk in response:
                    if hasattr(chunk, 'choices') and len(chunk.choices) > 0:
                        # Append the chunk to the collected response
                        for choice in chunk.choices:
                            if hasattr(choice, 'delta') and choice.delta is not None and hasattr(choice.delta, 'content'):
                                content = choice.delta.content
                                if content is not None:
                                    output += content

                    # Print the collected response every 2 seconds
                    current_time = time.time()
                    if current_time - last_print_time >= 2:
                        requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/editMessageText',
                            json={'chat_id': GROUP, 'text': f'{output}', 'message_id': edit_id,
                                  'parse_mode': 'Markdown'}).json()
                        last_print_time = current_time
                requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/editMessageText',
                    json={'chat_id': GROUP, 'text': output, 'message_id': edit_id, 'parse_mode': 'Markdown'})
            # elif ('reply_to_message' in update['message'] and update['message']['reply_to_message']['from']['id'] == BOT_ID) or update['message']['text'] == '@phix_bot':
            #     print('second flow')
            #     sticker(update['message']['text'], update['message']['message_id'])
            #     text = update['message']['text']
            #     talker_message_id = update['message']['message_id']
            #     talker_id = update['message']['from']['id']
            #     talker_name = update['message']['from']['first_name']
            #     query = {"id": talker_id}
            #     talker = database_search(query)
            #     if talker != None:
            #         history = talker['data']
            #         history.append({'role': 'user', 'content': text})
            #         query = {"id": talker_id}
            #         updated_data = {"$set": {"data": history}}
            #         database_update(query, updated_data)
            #     else:
            #         history = [{'role': 'user', 'content': text}]
            #         record = {"id": talker_id, "data": history}
            #         database_insert(record)
            #
            #     intructed_histoy = history
            #     intructed_histoy.append({'role': 'system', 'content': CHAT_INSTRUCTION})
            #     client = Client()
            #
            #     response = client.chat.completions.create(provider='',  # Replace with your provider
            #         model="blackbox", messages=intructed_histoy, stream=True)
            #
            #     output = ""
            #     edit_id = requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
            #         json={'chat_id': GROUP, 'reply_to_message_id': talker_message_id, 'text': '*Eternal © 2024*',
            #               'parse_mode': 'Markdown'}).json()['result']['message_id']
            #
            #     last_print_time = time.time()
            #     for chunk in response:
            #         if hasattr(chunk, 'choices') and len(chunk.choices) > 0:
            #             # Append the chunk to the collected response
            #             for choice in chunk.choices:
            #                 if hasattr(choice, 'delta') and choice.delta is not None and hasattr(choice.delta, 'content'):
            #                     content = choice.delta.content
            #                     if content is not None:
            #                         output += content
            #
            #         # Print the collected response every 2 seconds
            #         current_time = time.time()
            #         if current_time - last_print_time >= 2:
            #             requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/editMessageText',
            #                 json={'chat_id': GROUP, 'text': f'{output}', 'message_id': edit_id,
            #                       'parse_mode': 'Markdown'}).json()
            #             last_print_time = current_time
            #     requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/editMessageText',
            #         json={'chat_id': GROUP, 'text': output, 'message_id': edit_id, 'parse_mode': 'Markdown'})
            #
            #     history.append({'role': 'assistant', 'content': output})
            #     query = {"id": talker_id}
            #     updated_data = {"$set": {"data": history}}
            #     database_update(query, updated_data)
            #
            #     query = {
            #         "id": 77777
            #     }
            #     history = database_search(query)['data']
            #
            #     if len(history) >= 30: # later I will terminate this line as it has sufficient 30 messages
            #         history.pop()
            #         history.pop()
            #
            #     history.append({"role": "user", "content": talker_name + " says to Phix, " + text})
            #     history.append({"role": "assistant", "content": output})
            #
            #     query = {"id": 77777}
            #     updated_data = {"$set": {"data": history}}
            #     database_update(query, updated_data)

            else:
                message = update['message']['text']
                message_id = update['message']['message_id']
                sender_name = update['message']['from']['first_name']
                receiver_name = update['message'].get('reply_to_message', {}).get('from', {}).get('first_name', 'group')
                if receiver_name == 'Telegram':
                    receiver_name = 'group'
                query = {
                    "id": 77777
                }
                history = database_search(query)['data']

                if len(history) >= 30: # later I will terminate this line as it has sufficient 30 messages
                    history.pop()
                history.append({"role": "user", "content": sender_name + " says to " + receiver_name + ", " + message})
                copy_history = history
                copy_history.append({'role': 'system', 'content': ADVANCED_INSTRUCTION})

                client = Client()
                response = client.chat.completions.create(provider='',  # Replace with your provider
                    model="blackbox",
                    messages=copy_history,
                    stream=False)

                output = response.choices[0].message.content

                #MAKING THE REQUEST TO AI
                if output[-6:] != "IGNORE":
                    history.append({"role": "assistant", "content": output})
                    requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
                        json={'chat_id': GROUP, 'reply_to_message_id': message_id, 'text': output, 'parse_mode': 'Markdown'})
                    sticker(message, message_id)

                query = {"id": 77777}
                updated_data = {"$set": {"data": history}}
                database_update(query, updated_data)

def sticker(text, message_id):
    client = Client()
    response = client.chat.completions.create(provider='',  # Replace with your provider
        model="blackbox", messages=[{'role': 'user', 'content': text},{'role': 'system', 'content': STICKER_INSTRUCTION}], stream=False)

    params = {'chat_id': GROUP,
        'message_id': message_id, 'is_big': True,
        'reaction': json.dumps([{'type': 'emoji', 'emoji': response.choices[0].message.content[-1]}])}
    requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/setMessageReaction', params=params)

def database_search(query):
    connection_string = f"mongodb+srv://{USERNAME}:{PASSWORD}@core.pur20xh.mongodb.net/?appName=Core"
    client = MongoClient(connection_string)
    db = client['talker']
    collection = db['users']
    return collection.find_one(query)


def database_insert(record):
    connection_string = f"mongodb+srv://{USERNAME}:{PASSWORD}@core.pur20xh.mongodb.net/?appName=Core"
    client = MongoClient(connection_string)
    db = client['talker']
    collection = db['users']
    collection.insert_one(record)


def database_update(query, update):
    connection_string = f"mongodb+srv://{USERNAME}:{PASSWORD}@core.pur20xh.mongodb.net/?appName=Core"
    client = MongoClient(connection_string)
    db = client['talker']
    collection = db['users']
    return collection.update_one(query, update).matched_count

def rating_update(rating):
    connection_string = f"mongodb+srv://{USERNAME}:{PASSWORD}@core.pur20xh.mongodb.net/?appName=Core"
    client = MongoClient(connection_string)
    db = client['phix']
    collection = db['rating']
    query = {'id': 0}
    update = {'$inc': {'total_stars': rating, str(rating): 1, 'total_rates': 1}}
    collection.update_one(query, update)
    return collection.find_one(query)


if __name__ == '__main__':
    app.run(debug=False)
