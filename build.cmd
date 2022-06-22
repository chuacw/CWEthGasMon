pushd GasApp
call npm ci
call tsc --build
call docker build . -t cwethgasmon_node
call tsc --build --clean
rd node_modules /s /q
echo "Removing existing subnet (CWEthGasMon_subnet) if any"
call docker network rm CWEthGasMon_subnet
call docker network create --gateway 172.16.1.1 --subnet 172.16.1.0/24 CWEthGasMon_subnet
popd
pushd Redis
call docker build . -t cwethgasmon_redis
popd
