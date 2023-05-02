import telebot

bot = telebot.TeleBot("6038829730:AAHqeBrTAeAFtsBQ2rhizoXx74kYSPIsVBk")

@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Привет")

bot.polling()



