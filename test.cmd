pushd Redis
start docker run -it -p 6379:6379 redis
popd
pushd GasApp
call npm ci
call npx jest
rd node_modules /s /q
popd

