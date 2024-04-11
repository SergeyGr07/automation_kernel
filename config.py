from loguru._logger import Core as _Core
from loguru._logger import Logger
import os
import sys
from dotenv import load_dotenv

load_dotenv()


DATABASE = '/tmp/appdb.db'
DEBUG = True
SECRET_KEY = 'secret'

details_map = {
    "Труба": {"col": 3, "row": 11},
    "Кронштей": {"col": 3, "row": 6},
    "Крышка": {"col": 3, "row": 16},
    "Тройник": {"col": 3, "row": 7}
}


LOG_PATH = os.getenv('LOG_PATH')


def add_logger(logger_name: str, script_name: str):
    logger_name = Logger(
        core=_Core(),
        exception=None,
        depth=0,
        record=False,
        lazy=False,
        colors=False,
        raw=False,
        capture=True,
        patchers=[],
        extra={},
    )

    logger_name.add(f"{LOG_PATH}/{script_name}.log", level="DEBUG", rotation="9:00")
    logger_name.add(sys.stdout, level="DEBUG")
    return logger_name


script_name = os.path.splitext(os.path.basename(__file__))[0]
logger = add_logger(f'logger_{script_name}', script_name)
