from flask import Flask, render_template
from routes import report
from flask_cors import CORS
import config as cfg
import os
import sqlite3
# from flask_login import LoginManager

DATABASE = '/tmp/appdb.db'
DEBUG = True
SECRET_KEY = 'secret'

app = Flask(__name__)
app.config.from_object(cfg)
CORS(app)
app.config.update(dict(DATABASE=os.path.join(app.root_path, 'appdb.db')))

# login_manager = LoginManager(app)

app.register_blueprint(report, url_prefix='/reports/')
# app.register_blueprint(bot, url_prefix='/bots')


def connect_db():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn


def create_db():
    db = connect_db()
    with app.open_resource('sq_db.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()
    db.close()
    return None


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login_page')
def login_page():
    return render_template('login_page.html')


@app.route('/login', methods=['POST'])
def login():
    return None


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
