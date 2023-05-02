import telebot
import time

bot = telebot.TeleBot("6038829730:AAHqeBrTAeAFtsBQ2rhizoXx74kYSPIsVBk")

@bot.channel_post_handler()
def handle_channel_post(message):
    bot.send_message(message.chat.id, "Здравствуйте, " + message.chat.first_name + "! Благодарим Вас за подписку на наш канал!")

bot.polling(none_stop=True)


