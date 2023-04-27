import telebot

# Ваш токен бота
TOKEN = '6038829730:AAHqeBrTAeAFtsBQ2rhizoXx74kYSPIsVBk'

# Создание объекта бота
bot = telebot.TeleBot(TOKEN)

# Обработка команды /start
@bot.message_handler(commands=['start'])
def send_welcome(message):
    # Отправка приветственного сообщения в личку пользователя
    bot.send_message(message.chat.id, 'Приветствую! Отправьте вашу заявку в канал @название_канала.')

# Обработка новых сообщений в канале
@bot.channel_post_handler(func=lambda message: True)
def handle_channel_post(message):
    # Отправка приветственного сообщения в личку автора сообщения в канале
    bot.send_message(message.sender_chat.id, 'Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.')

# Запуск бота
bot.polling()
