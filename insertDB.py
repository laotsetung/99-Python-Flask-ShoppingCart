import sqlite3
import pandas as pd

con = sqlite3.connect('alphaCentauri/static/database.db')

cur = con.cursor()

table = pd.read_sql_query("SELECT name FROM sqlite_master", con)
print(table)

txt = """INSERT INTO produtos (id, produto, descricao, tipo, valor, img)
VALUES (1, 'Pan Galactic Gargle Blaster','Agua ardente jinx','Bebida','666.66','img');
"""
cur.execute(txt)

txt = """INSERT INTO produtos (id, produto, descricao, tipo, valor)
VALUES (2, 'Guia do mochileiro das galaxias','Enciclopedia galactica','Livro','666.66','img');
"""
cur.execute(txt)
txt = """INSERT INTO produtos (id, produto, descricao, tipo, valor)
VALUES (3, 'Sabre de luz','Arma de feixe','Arma','666.66','img');
"""
cur.execute(txt)

con.commit()