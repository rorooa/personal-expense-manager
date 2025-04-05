import pdfplumber
import re
import pymongo

def connect_to_db():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["expense_manager"]
    return db["expenses"]

def extract_transactions_from_pdf(pdf_path):
    transactions = []
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                matches = re.findall(r"(\w+ \d{1,2}, \d{4})\s+(DEBIT|CREDIT)\s+₹([0-9,.]+)\s+([\w\s]+)", text)
                for match in matches:
                    date, txn_type, amount, details = match
                    transactions.append({
                        "date": date,
                        "type": txn_type,
                        "amount": float(amount.replace(',', '')),
                        "details": details.strip()
                    })
    
    return transactions

def save_to_db(transactions, user_email):
    expenses_collection = connect_to_db()
    for txn in transactions:
        if txn['type'] == 'DEBIT':
            expense_data = {
                "user_email": user_email,
                "category": txn['details'],
                "amount": txn['amount'],
                "date": txn['date']
            }
            expenses_collection.insert_one(expense_data)

def parse_and_save(pdf_path, user_email):
    transactions = extract_transactions_from_pdf(pdf_path)
    if transactions:
        print(f"Extracted {len(transactions)} transactions.")
        save_to_db(transactions, user_email)
        print(f"Transactions saved to database for {user_email}")
    else:
        print("No transactions found.")

if __name__ == "__main__":
    pdf_path = input("Enter PDF path: ")
    user_email = input("Enter your email: ")
    parse_and_save(pdf_path, user_email)
