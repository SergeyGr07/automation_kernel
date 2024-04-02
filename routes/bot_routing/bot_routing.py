from flask import Blueprint, request
from telegram import Bot, Update
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext
import requests

bot = Blueprint("bot", __name__)

TELEGRAM_BOT_TOKEN = "TELEGRAM_BOT_TOKEN"


@bot.route('/get_data', methods=['POST'])
def get_data():
    data = request.json

    return 'Data received successfully'


def send_data_to_flask(update: Update, context: CallbackContext):
    user_input = update.message.text
    response = requests.post('http://127.0.0.1:5000/get_data', json={'user_input': user_input})
    update.message.reply_text('Data sent to Flask successfully')


updater = Updater(token=TELEGRAM_BOT_TOKEN, use_context=True)
dispatcher = updater.dispatcher

dispatcher.add_handler(CommandHandler("send_data", send_data_to_flask))

updater.start_polling()
updater.idle()
