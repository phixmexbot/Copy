from flask import Flask, render_template

app = Flask(__name__, template_folder='.')

@app.route('/')
def index():
    if request.method == 'GET':
        return render_template('index.html')
    elif request.method == 'POST':
        process(json.loads(request.get_data()))

def process(update):
    return

if __name__ == '__main__':
    app.run(debug=False)
