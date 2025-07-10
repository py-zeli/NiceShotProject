import requests

# URL do seu Apps Script (a mesma que você usa no fetch do JS)
url = "https://script.google.com/macros/s/AKfycbzuvvhDf94oWRkFdLVy1KpjB85ZbXyFx-RLif9_79zytRDyk4R96TGxDByPk1A4aJBlsQ/exec"

try:
    response = requests.get(url)
    response.raise_for_status()  # Lança erro se o status não for 200
    dados = response.json()
    print("✅ Dados recebidos:")
    for fornecedor in dados:
        print(fornecedor)
except requests.exceptions.RequestException as e:
    print("❌ Erro na requisição:", e)
except ValueError:
    print("❌ Erro ao decodificar JSON")