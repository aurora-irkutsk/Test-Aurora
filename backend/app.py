from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# Токены Telegram
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")

@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.json
        work = data.get('work')
        address = data.get('address')
        phone = data.get('phone')

        message = f"🔔 Новая заявка через чат-бот!\n\n" \
                  f"Вид работ: {work}\n" \
                  f"Адрес: {address}\n" \
                  f"Телефон: {phone}"

        # Отправка в Telegram
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {"chat_id": CHAT_ID, "text": message}
        response = requests.post(url, json=payload)

        return jsonify({"status": "ok"}), 200
    except Exception as e:
        print("Ошибка:", e)
        return jsonify({"status": "error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)