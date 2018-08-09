import tornado.ioloop
import tornado.web
import codecs
import time
import os
import logging

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
        user_name, user_result = self.request.body.decode("utf-8").split("_sep_")
        save_name = user_name + "-" + self.request.remote_ip.replace(".", "_") + "-" + time.strftime("%Y_%m_%_d_%H_%M_%S") + ".json"
        with codecs.open(os.path.join(result_dir, save_name), "w", "utf-8") as f:
            f.write(user_result)
        self.write("")


def make_app():
    return tornado.web.Application([
        (r"/", TTSEvalHandler),
        ], **settings)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    app = make_app()
    app.listen(PORT)
    logging.info("开始服务！")
    try:
        tornado.ioloop.IOLoop.current().start()
    except KeyboardInterrupt:
        logging.info("服务正常终止。")
    except Exception as e:
        logging.error(e)
