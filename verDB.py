import sqlite3
import pandas as pd

con = sqlite3.connect('alphaCentauri/static/database.db')

cur = con.cursor()

table = pd.read_sql_query("SELECT * FROM produtos", con)

cur.execute("SELECT * FROM produtos")

tabela = cur.fetchall()

for linha in tabela:
    print(linha)
