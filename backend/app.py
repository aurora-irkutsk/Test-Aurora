from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)  # Разрешает запросы с любого домена

# Получаем секреты из переменных окружения
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")

@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.json
        work = data.get('work', 'Не указано')
        address = data.get('address', 'Не указано')
        phone = data.get('phone', 'Не указано')

        message = f"🔔 Новая заявка через чат-бот!\n\n" \
                  f"Что интересует: {work}\n" \
                  f"Адрес: {address}\n" \
                  f"Телефон: {phone}"

        # Отправка в Telegram
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {"chat_id": CHAT_ID, "text": message}
        response = requests.post(url, json=payload)

        if response.status_code == 200:
            return jsonify({"status": "ok"}), 200
        else:
            return jsonify({"status": "error", "telegram_error": response.text}), 500

    except Exception as e:
        print(f"Ошибка сервера: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)