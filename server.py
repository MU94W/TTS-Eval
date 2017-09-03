"""Demonstration of using tornadose EventSource handlers to publish
the Fibonacci sequence to listeners.
"""
import os
import signal
from tornado import gen
from tornado.ioloop import IOLoop
from tornado.options import define, options
from tornado.locks import Event
from tornado.web import Application, RequestHandler, StaticFileHandler
from tornadose.handlers import EventSource
from tornadose.stores import DataStore

define('port', default=8080)

store = DataStore()
finish = Event()


def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = a, b


class MainHandler(RequestHandler):
    def get(self):
        self.render("index.html")


@gen.coroutine
def generate_sequence():
    for number in fibonacci():
        store.submit(number)
        yield gen.sleep(1)
        if finish.is_set():
            break


@gen.coroutine
def main():
    app = Application(
        [
            ('/', MainHandler)
        ],
        static_path=os.path.join(os.path.dirname(__file__),'./static'),
        debug=True
    )
    app.listen(options.port)
    yield generate_sequence()


def shutdown(sig, frame):
    finish.set()
    IOLoop.instance().stop()

if __name__ == "__main__":
    options.parse_command_line()
    signal.signal(signal.SIGINT, shutdown)
    it = IOLoop.instance().run_sync(main)
    print(it)
