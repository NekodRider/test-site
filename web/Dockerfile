FROM python:3.7-alpine
WORKDIR /app
COPY . /app
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --no-cache -r requirements.txt
ENV NAME test-site