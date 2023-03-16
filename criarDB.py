import sqlite3

con = sqlite3.connect('alphaCentauri/static/database.db')

cur = con.cursor()

x = input("!!!!!!DESEJA APAGAR A TABELA PRODUTOS?????!!!!! (S)")

if (x == 'S' or x == 's'):
    cur.execute("DROP TABLE produtos")
    con.commit()

##  TABELA DE PRODUTOS
tabela_produtos = """CREATE TABLE produtos(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    produto VARCHAR(150) NOT NULL,
    descricao VARCHAR(1500),
    tipo VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    img VARCHAR(100) NOT NULL
);
"""
cur.execute(tabela_produtos)