import tornado.ioloop
import tornado.web
import codecs
import time
import os

PORT = 8080


with codecs.open("index.html", "r") as f:
    index_html = f.read()

settings = {
    'debug': False, 
    'static_path': "./static"}

result_dir = "results"
if not os.path.exists(result_dir) or not os.path.isdir(result_dir):
    os.mkdir(result_dir)


class TTSEvalHandler(tornado.web.RequestHandler):
    def get(self):
        self.finish(index_html)

    def post(self):
        self.set_header("Content-Type", "text/plain")
        save_name = self.request.remote_ip.replace(".", "_") + "-" + time.strftime("%Y_%m_%_d_%H_%M_%S") + ".json"
        with codecs.open(os.path.join(result_dir, save_name), "wb") as f:
            f.write(self.request.body)
        self.write("")


def make_app():
    return tornado.web.Application([
        (r"/", TTSEvalHandler),
        ], **settings)


if __name__ == "__main__":
    app = make_app()
    app.listen(PORT)
    tornado.ioloop.IOLoop.current().start()
