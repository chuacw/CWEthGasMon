pushd GasApp
call tsc --build
call docker build . -t node
popd
pushd Redis
call docker build . -t redis
popd
