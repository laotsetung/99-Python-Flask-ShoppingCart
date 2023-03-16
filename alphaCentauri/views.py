#Aqui vamos colocar as rotas de acesso para o site
from flask import Blueprint, render_template, request
import sqlite3
import os
from flask_wtf import FlaskForm
from wtforms import FileField
from werkzeug.utils import secure_filename

print('abre views.py')
views = Blueprint('views', __name__)
id = 0

class uploadFile(FlaskForm):
    file = FileField("File")

def abreTabela():
    con = sqlite3.connect('alphaCentauri/static/database.db')
    cur = con.cursor()
    cur.execute("SELECT * FROM produtos")
    tabela = cur.fetchall()
    con.commit()
    return tabela

def ultimoID():
    con = sqlite3.connect('alphaCentauri/static/database.db')
    cur = con.cursor()
    slect_id = "SELECT id FROM produtos ORDER BY id DESC LIMIT 1;"
    cur.execute(slect_id)
    tab=cur.fetchone()
    id=tab[0]
    return id

id = 0
@views.route('/descricao/<id>')
def verProduto(id):
    con = sqlite3.connect('alphaCentauri/static/database.db')
    cur = con.cursor()
    slc_desc = f"SELECT * FROM produtos WHERE id = '{id}'"
    cur.execute(slc_desc)
    tab=cur.fetchone()
    nome=tab[1]
    desc=tab[2]
    tipo=tab[3]
    valor=tab[4]
    img=tab[5]

    arr = [nome,desc,tipo,valor]
    return render_template("verProduto.html", nome=nome,desc=desc,tipo=tipo,valor=valor,img=img)

@views.route('/')
def home():
    tabela = abreTabela()
    return render_template("home.html", result=tabela)

@views.route('/admin/')
def admin():
    tabela = abreTabela()
    return render_template("admin.html", result=tabela)

@views.route('/admin/add', methods=['GET','POST'])
def admin_add():
    data = request.form
    tabela = abreTabela()
    id=ultimoID()

    if data:
        con = sqlite3.connect('alphaCentauri/static/database.db')
        cur = con.cursor()


        try:
            produto = data['produto']
            descricao = data['descricao']
            valor = data['valor']
            tipo = data['tipo']

            arq = request.files['file']
            form = uploadFile()
            arq1 = form.file.data
            img = arq1.filename
        except:
            return render_template("error_add.html", msg='Não foi possível resgatar os valores do formulário, tente novamente!')

        print(arq1)
        try:
            arq1.save(os.path.join(os.path.abspath(os.path.dirname(__file__)),'static/imgs/produtos',secure_filename(img)))
        except Exception as e: 
            print(e)
            return render_template("error_add.html", msg='Não foi possível resgatar a foto do formulário, tente novamente!')

        try:
            insert_registro = f"INSERT INTO produtos (id, produto, descricao, tipo, valor, img) VALUES('{id+1}','{produto}','{descricao}','{tipo}','{valor}','{img}');"
            print(insert_registro)
            cur.execute(insert_registro)
            con.commit()
            return render_template("admin_sucess.html", msg="Registro Incluido com Sucesso!")
        except Exception as e: 
            print(e)
            return render_template("error_add.html", msg='Não foi possível inserir na base de dados, por favor tente novamente!')

        print('id: ', id , 'produto: ',produto,' / desc: ',descricao, '$$$: ', valor, ' / imagem: ', img)


    return render_template("admin_add.html", result=tabela, ultimo_id=(id+1))

@views.route('/admin/edit/<id>', methods=['GET','POST'])
def admin_edit(id):
    print(id)
    met = request.method

    if met == "GET":
        con = sqlite3.connect('alphaCentauri/static/database.db')
        cur = con.cursor()
        select = f"SELECT * FROM produtos WHERE id = {id}"
        cur.execute(select)
        tab = cur.fetchone()

        return render_template("admin_edit.html", result=tab)
    else:
        data = request.form
        if data:
            id = data['id_1']
            produto = data['produto']
            descricao = data['descricao']
            valor = data['valor']
            tipo = data['tipo']
            img = data['file']

            con = sqlite3.connect('alphaCentauri/static/database.db')
            cur = con.cursor()

            upd = f"UPDATE produtos SET produto = '{produto}', descricao = '{descricao}', valor = '{valor}', tipo='{tipo}', img='{img}' WHERE id = {id} "
            try:
                cur.execute(upd)
                con.commit()
                return render_template("admin_sucess.html", msg="Registro Atualizado com Sucesso!")
            except Exception as e:
                print(e)
                return render_template("error_edit.html", msg='Não foi possível inserir na base de dados, por favor tente novamente!')

    return render_template("admin.html")

@views.route('/admin/remove/<id>', methods=['GET','POST'])
def admin_rmv(id):
    met = request.method
    if met == "GET":
        con = sqlite3.connect('alphaCentauri/static/database.db')
        cur = con.cursor()
        select = f"SELECT * FROM produtos WHERE id = {id}"
        cur.execute(select)
        tab = cur.fetchone()

        return render_template("remove.html", result=tab)
    else:
        data = request.form
        if data:
            print(data)
            id = data['id_1']
            produto = data['produto']

            con = sqlite3.connect('alphaCentauri/static/database.db')
            cur = con.cursor()
            select = f"DELETE FROM produtos WHERE id = {id}"
            cur.execute(select)
            con.commit()
        
            return render_template("admin_sucess.html", msg=f"Registro '{produto}' foi REMOVIDO!!!")