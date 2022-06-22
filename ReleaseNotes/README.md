Chewy's Ether Gas Monitor
===

Introduction
===
Exchanges interact with the Ethereum chain constantly throughout the day to carry out various operations such as withdraws, dApp interactions, etc. The cost of one interaction or transaction (transaction fees) in the Ethereum network is calculated
as: Gas used by the transaction * Gas price . While doing these interactions on the chain, it is crucial to ensure that we utilize the chain in an efficient and cost effective manner to reduce the operational costs.

This can be achieved by monitoring the gas prices as provided by a vendor.

Chewy's Ether Gas Monitor aka CWEthGasMon is an application that solves the problem described above by querying a gas provider, and presents the following two API endpoints:

* /gas
* /average

The gas endpoint queries the gas provider for the current gas prices in Gwei,  and returns it to the caller.

The average endpoint queries the redis backend for the requested information, averages the result, then returns it to the caller.

Getting started
===
To build the solution, you're required to have Docker, Nodejs and TypeScript installed. The build scripts are written using Windows command scripts, but it can be easily translated to another shell.

Building the solution
===
To build the solution, you'll need to place an .env file in the GasApp/conf subdirectory, and run the build.cmd script.

*WARNING*: Do not run the build script before you have a .env file in the conf subdirectory.  

There is a sample.env file that is nearly complete, located in the GasApp/conf subdirectory. Just get an Etherscan API key and place it there, then rename your sample.env to .env and place it in the conf file.

This does the following:
 * Switches into the GasApp subdirectory.
 * Pulls in all required Node modules
 * Calls TypeScript to compile the code.
 * Calls Docker to build a Linux image with node 18.4.0 and copies the frontend solution into it.
 * Cleans up the generated Javascript files created by TypeScript from above.
 * Cleans up the Node modules pulled in above.
 * Returns to the project root directory.
 * Deletes any existing Docker subnet and recreate it.
 * Switches into the Redis subdirectory
 * Calls Docker to build a Ubuntu Linux image and installs redis within it.

A screenshot is shown below on what it looks like to build the solution.
![Building the solution](./images/2022-06-22%2018_19_29-Build.png)

 Running the solution
 ===
 To run the solution, simply call the start.cmd script.  
 Note: You have to run start.cmd instead of just start as there is a Start executable on Windows.  

 This launches two Docker containers from the images created in the building section above.

![Running the solution](./images/2022-06-22%2018_24_07-Start.png)

Stopping the solution
===
To stop the solution, simply call the stop.cmd script.

You have to do so in a new shell window.

![Stopping the solution](./images/2022-06-22%2018_28_38-Stop.png)


Testing the solution as an end user
===
Once the solution is running, you can test it using curl as seen below, on both the endpoints.

To call the gas endpoint, simply run  
* curl "localhost:3001/gas"

![Curlling the gas endpoint](./images/2022-06-22%2018_36_57-curl_gas.png)

To call the average endpoint, simply run  
* call "localhost:3001/average?fromTime=\<xxxx\>&toTime=\<yyyy\>"

where xxxx is a numeric value representing the time in [Unix timestamp](https://www.unixtimestamp.com/). xxxx also needs to be a timestamp value larger than the time when the solution started running, since the solution doesn't have gas prices of periods before the solution starting running.
yyyy needs to be a value larger than xxxx and not in the future.

![Curlling the average endpoint](./images/2022-06-22%2018_43_35-curl_average.png)

If xxxx or yyyy are values representing the future, then the solution returns an error.

If both xxxx and yyyy represent valid timestamps, then the server fetches the gas prices covering these blocks and returns them.

Missing blocks are listed in the missingBlocks field, while fetchedBlocks contain the blocks that are used to produce the averageGasPrice result.

Technical details
===
The solution is implemented in TypeScript/Javascript and consists of the server and the database. 

The server runs in one Docker container, while the database runs in another Docker container.

The build script specified earlier uses the docker-compose configuration file to build the two required containers.

When the server starts, it looks for a configuration file named .env, and then configures itself accordingly.

The configuration file lets the user do the folowing:
* Configure the API key to be used for the gas provider
* Choose which gas provider to use (There's only one choice now)
* Specifies which port the server should listen on.
* Specifies how often the server should poll the gas provider for gas prices
* Configure which log provider to use (There's only one choice now)
* Specifies the URL to be used for the database client to connect to the database server. 

It has the following modules:

* GasProvider
* LogProvider  
* Database Client
* Database
* Server
* Tests

Database Client
===
The database client is a Redis client.

Database
===
The database is a Redis server running on a container of its own.

Gas Provider
===
The Gas Provider consists of the following files:
* baseGasProvider
* etherscanGasProvider
* gasProviders
* gasProviderTypes

Log Provider
===
The Log Provider consists of the following files:
* baseLogProvider
* consoleLogProvider
* logProviders

Server
===
The Server consists of the following files:
* server
* main

Testing the solution as a developer
===
The tests are Jests unit tests that cover most scenarios foreseeable and do not achieve 100% coverage.

To run the tests, launch the test.cmd script. 

The test script needs the database container to be running in order to work successfully.

![Testing the solution with tests](./images/2022-06-22%2019_06_40-Running%20tests.png)


Development platform
===
This solution was developed using TypeScript, Nodejs v14.17.0 and Docker Desktop v4.9.1 on Windows and tested with Docker Desktop v3.2.0 on another system.

Future
===
This solution was built with as a REST server, with the gas provider as Etherscan and the database as Redis.

With more time available, the following can be investigated.

Etherscan was chosen since Eth Gas Station is no longer available. However, this solution is built on an extensible framework, so that at any time if a different gas provider is available, it can be added into this solution without much fuss, and reconfigured to use it, simply by updating the configuration file (.env) in the conf directory located under GasApp.

Redis was chosen as the backend database as it's an in-memory data store, so its performance should be snappy (this has not been tested).

A better performant solution would be to build this solution as a WebSocket server since it would be called often (this reducing the server's time to open and close network connections), however, due to time constraints, this has not been done.

The log provider that currently logs to the console has been created with extension in mind, so a new log provider can be created to log to a file, or log to a database, so that troubleshooting can be performed.
