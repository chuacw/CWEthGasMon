pushd Redis
start docker run -it -p 6379:6379 redis
popd
pushd GasApp
call npx jest
popd

