import telebot

bot = telebot.TeleBot("")

@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Привет чувак")

bot.polling()

import telebot

# Укажите токен своего бота и ID группы
TOKEN = '6038829730:AAHqeBrTAeAFtsBQ2rhizoXx74kYSPIsVBk'
GROUP_ID = '-1001943399575'

# Создаем экземпляр бота
bot = telebot.TeleBot(TOKEN)

# Обработчик команды /start
@bot.message_handler(commands=['start'])
def send_welcome(message):
    # Отправляем приветственное сообщение в личный чат пользователя
    bot.send_message(chat_id=message.chat.id, text='Добро пожаловать! Оставьте заявку на добавление в группу.')

# Обработчик новых заявок
@bot.message_handler(func=lambda message: message.chat.type == 'private')
def add_to_group(message):
    # Пересылаем сообщение с заявкой в группу
    bot.forward_message(chat_id=GROUP_ID, from_chat_id=message.chat.id, message_id=message.message_id)

    # Отправляем сообщение о принятии заявки в личный чат пользователя
    bot.reply_to(message, 'Ваша заявка на добавление в группу принята! В ближайшее время мы свяжемся с вами.')

# Запускаем бота
bot.polling()

