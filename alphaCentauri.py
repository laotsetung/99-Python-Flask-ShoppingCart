from alphaCentauri import create_app

app = create_app()
app.config['SECRET_KEY'] = 'chavesecreta'
app.config['UPLOAD_FOLDER'] = 'static/imgs/produtos'

if __name__ == '__main__':
    app.run(debug=True)
    #app.run()