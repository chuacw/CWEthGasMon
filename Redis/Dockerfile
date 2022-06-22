FROM ubuntu:18.04

# COPY ["conf/redis_6379.sh", "/etc/init.d/"]

# Install redis
RUN apt update -y && apt-get install redis -y

# set up my own config
COPY ["conf/redis.conf", "/etc/redis/"]

CMD ["redis-server", "/etc/redis/redis.conf"]