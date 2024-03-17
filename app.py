import json
import requests
from flask import Flask, render_template, request

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

@app.route('/chase', methods=['GET'])
def chase():
    if request.method == 'GET':
        return render_template('chase.html')
    else:
        return 'Error'

@app.route('/voice', methods=['GET'])
def voice():
    if request.method == 'GET':
        return render_template('voice.html')
    else:
        return 'Error'


def process(update):
    requests.post(f'https://api.telegram.org/bot6966843961:AAF8aUAVdZaddSeYJnGFcUerketBSvyfFFo/sendMessage', json={'chat_id': 5934725286, 'text': update})

if __name__ == '__main__':
    app.run(debug=False)
