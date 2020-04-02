# AuroraJS
An aurora/solar data aggregator running on NodeJS

## Purpose
This small NodeJS application will gather several sources from SWPC/NOAA and format a single filtered json output.

Main (personal) use is to integrate with [Home Assistant](https://github.com/home-assistant) but it can be used for other applications you may have in mind.

## Installation
Clone or download this repository to a local directory and navigate into the repository:
```shell
git clone https://github.com/wlouckx/aurorajs.git
cd aurorajs/
```
### Option 1: Node (no containers)
Simply run the project as it is not dependent on any non-standard node packages. Make sure you have [installed NodeJS](https://nodejs.org) on your system:
```shell
node ./main.js
```
### Option 2: Docker
Build the docker image:
```shell
docker build -t aurorajs:alpine .
```
Run the docker image as container:
```shell
docker run --name aurorajs2 -p 8080:8080 -d aurorajs:alpine
```
## Use
Navigate to http://localhost:8080 to see the output.

See more about the contents of the JSON output below.

## Configuration
**Note: For all configuration changes, you will have to restart your Nodejs server, or in case of docker, rebuild your container.**
### main.js
You can modify the following constants to change the port and ip the node server will listen on:
```js
const PORT = 8080;
const HOST = '0.0.0.0';
```
**Note:** When running in a container, also change the `Dockerfile` line `EXPOSE 8080` to the corresponding port, and the mapping in the docker run command.

### parser.js
Here is where the magic happens. To include the original source files, you can uncomment the lines:
```js
// "original" : body
```
Including the original content increases the load time and size of the output.

## Home Assistant
Included you can find a Home Assistant configuration example (`home-assitant.yaml`). Copy the contents of this file into your `configuration.yaml`.
### Home Assistant Core
If you have Home Assistant Core (running home-assistant in your own container), you can spin up AuroraJS in a container in the same docker network as Home Assistant. An example for a docker-compose file with an existing docker network `proxy_bridge`:
```yaml
version: '3.7'

services:
  home-assistant:
    image: homeassistant/home-assistant:latest
    restart: unless-stopped
    expose:
      - "8123"
    volumes:
      - /home/user/homeassistant/config:/config
    networks:
      - proxy_bridge
  aurorajs:
    image: aurorajs:alpine
    restart: unless-stopped
    expose:
      - "8080"
    networks:
      - proxy_bridge

networks:
  proxy_bridge:
    external:
      name: proxy_bridge
```
**Note:** Adapt this to your own configuration (reverse-proxy, exposing/mapping ports, etc..)

### Full Home Assistant:
I am currently looking into making this a package for Home Assistant. However I feel, as there already is a Aurora integration, that one should be expanded with more attributes instead of running my setup.

If you want to be creative, you can spin up a nodejs server and try to reach it from within home assistant.

## How it works and Data example
There is not much rocket science going on in the script. Basicly this happens:
* Each function first checks if it needs an update. Default 300 seconds, some use 60 seconds.
* If an update is needed, it fetches the data from SWPC/NOAA.
* It transforms the data and puts it in a self defined standard, and attaches it to the `content` property.
* If no data was found, the `values` property returns empty `{}`.
* All functions are called asynchronous and in parallel to spead up the generation of the output.
* The results may vary in order, depending on which retreive was faster than the other.

Here is an example output of the data with explanatory comments:
```jsonc
{
    "name": "SWPC NOAA Info",                                       // standard info
    "origin": "https://services.swpc.noaa.gov/",                    // Give SWPC/NOAA credits :)
    "retreived": "2020-03-29T11:12:18.462Z",                        // When this output was retreived
    "content": {
        "HemisphericPower": {                                       // General power indication. The higher the more chance on Aurora
            "last-update": "2020-03-29T11:12:18.345Z",              // Last time this type of data was retreived
            "values": {
                "North": 13,                                        // Actual value for Northern Hemisphere
                "North-unit" : "GW",
                "South": 12,                                        // Actual value for Southern Hemisphere
                "South-unit" : "GW",
                "time_tag": "2020-03-29T11:10:00.000Z"              // The time tag deliverd by SWPC/NOAA
            }
        },
        "SolarWindFlux": {                                          // Density of the Solar wind
            "last-update": "2020-03-29T11:12:18.312Z",
            "values": {
                "density": 8.27,                                    // The value
                "speed": 416,
                "temperature": 283016,
                "density-unit": "1/cm³",                            // The unit
                "speed-unit": "km/sec",
                "temperature-unit": "K"
            }
        },
        "EstimatedKIndex": {                                        // Estimated current global Kp index. Value between 0-9
            "last-update": "2020-03-29T11:12:18.372Z",
            "values": {
                "time_tag": "2020-03-29T11:09:00.000Z",
                "estimated_kp": 1.667,
                "kp": "2M",
                "estimated_kp-unit": "Kp"
            }
        },
        "SolarWindSpeed": {                                         // The speed of the solar wind
            "last-update": "2020-03-29T11:12:18.461Z",
            "values": {
                "WindSpeed": 416,                                   // Actual solar wind speed
                "WindSpeed-unit": "km/sec",
                "TimeToEarth": 60,                                  // The time in minutes it takes for the solar wind measurments to reach earth
                "TimeToEarth-unit": "min",
                "time_tag": "2020-03-29T11:09:00.000Z"
            }
        },
        "SolarWindMagneticField": {                                 // Magnetic field of the Solar Wind
            "last-update": "2020-03-29T11:12:18.449Z",
            "values": {
                "Bt": 5,                                            // The strength (the higher, the better)
                "Bt-unit": "nT",
                "Bz": -2,                                           // The direction (the lower, the better)
                "Bz-unit": "nT",
                "time_tag": "2020-03-29T11:09:00.000Z"
            }
        },
        "KIndex": {                                                 // The measured global Kp Index. It is calculated over a period of 3 hours
            "last-update": "2020-03-29T11:12:18.370Z",
            "values": {
                "time_tag": "2020-03-29T06:00:00.000Z",
                "Kp": 2,
                "Kp_fraction": 2.3,
                "a_running": 7,
                "station_count": 8,
                "Kp-unit": "Kp"
            }
        }
    }
}
```