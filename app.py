from flask import Flask, render_template, request, jsonify
from routes import report
from flask_cors import CORS
import config as cfg
import os
import json
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


@app.route('/get_data', methods=['GET'])
def get_data():
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        # start_date_obj = datetime.strptime(start_date, '%Y-%m-%d')
        # end_date_obj = datetime.strptime(end_date, '%Y-%m-%d')

        # formatted_start_date = start_date_obj.strftime('%d-%m-%Y')
        # formatted_end_date = end_date_obj.strftime('%d-%m-%Y')

        print(type(start_date), start_date)
        print(type(end_date), end_date)
        if not start_date or not end_date:
            return jsonify({'error': 'Missing start_date or end_date parameter'}), 400

        data_dir = os.path.join('data', 'json')
        date_dirs = [dir_name for dir_name in os.listdir(data_dir) if start_date <= dir_name <= end_date]
        print(date_dirs)
        result = {}
        for date_dir in date_dirs:
            date_path = os.path.join(data_dir, date_dir)
            print(date_path)
            json_files = [file_name for file_name in os.listdir(date_path) if file_name.endswith('.json')]

            for json_file in json_files:
                file_path = os.path.join(date_path, json_file)
                print(file_path)
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    result.update(data)
                    # print(result)

        return jsonify(result), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@app.route('/login_page')
def login_page():
    return render_template('login_page.html')


@app.route('/login', methods=['POST'])
def login():
    return None


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
