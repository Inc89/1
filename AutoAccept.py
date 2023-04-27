from aiogram import Bot, Dispatcher, executor, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from database import Database

import asyncio
import aiogram

bot = Bot(token="TOKEN", parse_mode='HTML')
admin_id = ID
group_id = -CHAT_ID

storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)
db = Database()

@dp.chat_join_request_handler()
async def start1(update: types.ChatJoinRequest):
    await update.approve()
    existing_user = db.get_user(update.from_user.id)
    if existing_user is not None:
        await bot.send_message(chat_id=update.from_user.id, text="<b>☁️ WHSoft Cloud 👉 https://t.me/+hDc6HaNkf5Q3N. Спасибо за слив. Распространил: CONFF.ORG")
        await bot.send_message(chat_id=admin_id, text=f"<b>✅Приняли повторно в канал пользователя:</b> @{update.from_user.username} [<code>{update.from_user.id}</code>]")
    else:
        await bot.send_message(chat_id=update.from_user.id, text="<b>☁️ WHSoft Cloud 👉 https://t.me/+hDc6HaNkf5Q3N. Спасибо за слив. Распространил: CONFF.ORG")
        await bot.send_message(chat_id=admin_id, text=f"<b>✅Приняли в канал пользователя:</b> @{update.from_user.username} [<code>{update.from_user.id}</code>]")
        db.add_user(update.from_user.id)

@dp.message_handler(commands=['start'])
async def start(message: types.Message):
    existing_user = db.get_user(message.from_user.id)
    if existing_user is not None:
        await bot.send_message(chat_id=message.from_user.id, text="<b>☁️ WHSoft Cloud 👉 https://t.me/+hDc6HaNkf5Q3N. Спасибо за слив. Распространил: CONFF.ORG")
    else:
        await bot.send_message(chat_id=message.from_user.id, text="<b>☁️ WHSoft Cloud 👉 https://t.me/+hDc6HaNkf5Q3N. Спасибо за слив. Распространил: CONFF.ORG. Спасибо за слив. Распространил: CONFF.ORG")
        db.add_user(message.from_user.id)

@dp.message_handler(content_types="new_chat_members")
async def on_user_join(message: types.Message):
    await message.delete()
    await bot.send_message(chat_id=admin_id, text=f'✅ Новый участник в чате:\n\n'
                                               f'{message.from_user.get_mention()} | {message.from_user.full_name}\n'
                                               f'Id: {message.from_user.id}\n'
                                               f'Username: @{message.from_user.username}\n'
                                               )
    new_msg = await message.answer(f'{message.from_user.get_mention()} добро пожаловать в чат!', disable_web_page_preview=True)
    await asyncio.sleep(15)
    try:
        await new_msg.delete()
    except Exception as e:
        pass

@dp.message_handler(content_types="left_chat_member")
async def on_user_join(message: types.Message):
    await message.delete()

@dp.message_handler(content_types="new_chat_title")
async def on_user_join(message: types.Message):
    await message.delete()

@dp.message_handler(content_types="new_chat_photo")
async def on_user_join(message: types.Message):
    await message.delete()

@dp.message_handler(content_types="delete_chat_photo")
async def on_user_join(message: types.Message):
    await message.delete()

@dp.message_handler(commands=['send_all'])
async def send_all_users(message: types.Message):
    if message.from_user.id == admin_id:
        users = db.get_users()
        successful_sends = 0
        failed_sends = 0
        for user in users:
            try:
                await bot.send_message(chat_id=user[0], text=message.text.replace("/send_all ", ""))
                await asyncio.sleep(0.5)
                successful_sends += 1
            except aiogram.utils.exceptions.TelegramAPIError as e:
                failed_sends += 1
        await bot.send_message(chat_id=admin_id, text=f"Рассылка завершена!\n\nУспешно отправлено сообщений: {successful_sends}\nСообщений с ошибками: {failed_sends}")

@dp.message_handler(content_types=['photo', 'video', 'document', 'text'], chat_id=group_id)
async def handle_comment(message: types.Message):
    if message.from_user.id != 777000:
        pass
    elif message.chat.id != group_id:
        pass
    else:
        await message.reply(f'🔥 Канал WHSoft Cloud: <a href="https://t.me/+hDc6HaNkf5Q3N">тык</a> и канал CONFF <a href="https://t.me/conff_org">тык</a>\n\n'
                            #f'☁️ Наши проекты:\n'
                            #f'- <a href="link">CrinzeShop</a> <i>магазин цифровых товаров</i>\n'
                            #f'- <a href="link">VkShortsAuto</a> <i>софт для загрузки клипов(шортс) в ВКонтакте</i>\n'
                            #f'- <a href="link">Crinze News</a> <i>канал с новостями и розыгрышами</i>\n'
                            , disable_web_page_preview=True)

if __name__ == '__main__':
    try:
        executor.start_polling(dp, skip_updates=True)
    finally:
        db.close()