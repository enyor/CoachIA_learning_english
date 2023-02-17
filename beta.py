from flask import Flask, render_template
import sys

app = Flask(__name__, static_folder='static')

@app.route('/doc')
def doc():
    # Documentation
    return render_template('documentation.html')

@app.route('/')
def beta1():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0')
