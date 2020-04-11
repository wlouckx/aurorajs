const https = require('https');

class Parser {
    res

    constructor(_arg) {  
        this.res = {
            "name" : "SWPC NOAA Info",
            "origin" : "https://services.swpc.noaa.gov/",
            "retreived" : '',
            "content": {}
        };
    };

    async getKIndex() {
        return new Promise(ok => {
            var ret;
            const url = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";
            if (this.needUpdate(this.res.content.KIndex)) {
                https.get(url, res => {
                    res.setEncoding("utf8");
                    let body = "";
                    res.on("data", data => {
                      body += data;
                    });
                    res.on("end", () => {
                        try {
                            body = JSON.parse(body);
                        }
                        catch(err) {
                            console.log(err);
                            if (this.res.content.KIndex == undefined) {
                                ret = {
                                    "last-update" : new Date(),
                                    "values" : {},
                                };
                                this.res.content.KIndex = ret;
                                ok(ret);
                            } else {
                                ret = this.res.content.KIndex;
                                ok(ret);
                            };
                        }
                        if (Array.isArray(body)) {
                            var header = body[0];
                            var latest = body[body.length - 1];
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                                // "original" : body
                            };
                            header.forEach(function(value, index){
                                if (value === 'time_tag') {
                                    ret.values[value] = new Date(latest[index].concat('Z'));
                                } else if (value ==='Kp_fraction') {
                                    ret.values[value] = parseFloat(latest[index]);
                                } else {
                                    ret.values[value] = parseInt(latest[index]);
                                };
                            });
                            ret.values['Kp-unit'] = 'Kp';
                            this.res.content.KIndex = ret;
                            ok(ret);
                        } else {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                                // "original" : body
                            };
                            this.res.content.KIndex = ret;
                            ok(ret);
                        };
                    });
                    res.on('error', (e) => {
                        console.log('Error handled for KIndex: '.concat(e.message));
                        if (this.res.content.KIndex == undefined) {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                            };
                            this.res.content.KIndex = ret;
                            ok(ret);
                        } else {
                            ret = this.res.content.KIndex;
                            ok(ret);
                        };
                    });
                });
            } else {
                ret = this.res.content.KIndex;
                ok(ret);
            }
        });
    };

    async getEstimatedKIndex() {
        return new Promise(ok => {
            var ret;
            const url = "https://services.swpc.noaa.gov/products/noaa-estimated-planetary-k-index-1-minute.json";
            if (this.needUpdate(this.res.content.EstimatedKIndex, 60)) {
                https.get(url, res => {
                    res.setEncoding("utf8");
                    let body = "";
                    res.on("data", data => {
                      body += data;
                    });
                    res.on("end", () => {
                        try {
                            body = JSON.parse(body);
                        }
                        catch(err) {
                            console.log(err);
                            if (this.res.content.EstimatedKIndex == undefined) {
                                ret = {
                                    "last-update" : new Date(),
                                    "values" : {},
                                };
                                this.res.content.EstimatedKIndex = ret;
                                ok(ret);
                            } else {
                                ret = this.res.content.EstimatedKIndex;
                                ok(ret);
                            };
                        }
                        if (Array.isArray(body)) {
                            var header = body[0];
                            var latest = body[body.length - 1];
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                                // "original" : body
                            };
                            header.forEach(function(value, index){
                                if (value === 'time_tag') {
                                    ret.values[value] = new Date(latest[index].concat('Z'));
                                } else if (value === 'estimated_kp') {
                                    ret.values[value] = parseFloat(latest[index]);
                                } else {
                                    ret.values[value] = latest[index];
                                };
                            });
                            ret.values['estimated_kp-unit'] = 'Kp';
                            this.res.content.EstimatedKIndex = ret;
                            ok(ret);
                        } else {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                                // "original" : body
                            };
                            this.res.content.EstimatedKIndex = ret;
                            ok(ret);
                        };
                    });
                    res.on('error', (e) => {
                        console.log('Error handled for EstimatedKIndex: '.concat(e.message));
                        if (this.res.content.EstimatedKIndex == undefined) {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                            };
                            this.res.content.EstimatedKIndex = ret;
                            ok(ret);
                        } else {
                            ret = this.res.content.EstimatedKIndex;
                            ok(ret);
                        };
                    });
                });
            } else {
                ret = this.res.content.EstimatedKIndex;
                ok(ret);
            }
        });
    };

    async getSolarWindSpeed() {
        return new Promise(ok => {
            const l1 = 1500000
            var ret;
            const url = "https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json";
            if (this.needUpdate(this.res.content.SolarWindSpeed), 60) {
                https.get(url, res => {
                    res.setEncoding("utf8");
                    let body = "";
                    res.on("data", data => {
                      body += data;
                    });
                    res.on("end", () => {
                        try {
                            body = JSON.parse(body);
                        }
                        catch(err) {
                            console.log(err);
                            if (this.res.content.SolarWindSpeed == undefined) {
                                ret = {
                                    "last-update" : new Date(),
                                    "values" : {},
                                };
                                this.res.content.SolarWindSpeed = ret;
                                ok(ret);
                            } else {
                                ret = this.res.content.SolarWindSpeed;
                                ok(ret);
                            };
                        }
                        if (body.TimeStamp != undefined) {
                            ret = {
                                    "last-update" : new Date(),
                                    "values" : {},
                                    // "original" : body
                            };
                            ret.values['WindSpeed'] = parseInt(body.WindSpeed);
                            ret.values['WindSpeed-unit'] = 'km/sec';
                            ret.values['TimeToEarth'] = parseInt(l1/body.WindSpeed/60, 10);
                            ret.values['TimeToEarth-unit'] = 'min';
                            ret.values['time_tag'] = new Date(body.TimeStamp.concat('Z'));
                            this.res.content.SolarWindSpeed = ret;
                            ok(ret);
                        } else {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                            };
                            this.res.content.SolarWindSpeed = ret;
                            ok(ret);
                        };
                    });
                    res.on('error', (e) => {
                        console.log('Error handled for SolarWindSpeed: '.concat(e.message));
                        if (this.res.content.SolarWindSpeed == undefined) {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                            };
                            this.res.content.SolarWindSpeed = ret;
                            ok(ret);
                        } else {
                            ret = this.res.content.SolarWindSpeed;
                            ok(ret);
                        };
                    });
                });
            } else {
                ret = this.res.content.SolarWindSpeed;
                ok(ret);
            }
        });
    };

    async getSolarWindMagneticField() {
        return new Promise(ok => {
            var ret;
            const url = "https://services.swpc.noaa.gov/products/summary/solar-wind-mag-field.json";
            if (this.needUpdate(this.res.content.SolarWindMagneticField), 60) {
                https.get(url, res => {
                    res.setEncoding("utf8");
                    let body = "";
                    res.on("data", data => {
                      body += data;
                    });
                    res.on("end", () => {
                        try {
                            body = JSON.parse(body);
                        }
                        catch(err) {
                            console.log(err);
                            if (this.res.content.SolarWindMagneticField == undefined) {
                                ret = {
                                    "last-update" : new Date(),
                                    "values" : {},
                                };
                                this.res.content.SolarWindMagneticField = ret;
                                ok(ret);
                            } else {
                                ret = this.res.content.SolarWindMagneticField;
                                ok(ret);
                            };
                        }
                        if (body.TimeStamp != undefined) {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                                // "original" : body
                            };
                            ret.values['Bt'] = parseInt(body.Bt);
                            ret.values['Bt-unit'] = 'nT';
                            ret.values['Bz'] = parseInt(body.Bz);
                            ret.values['Bz-unit'] = 'nT';
                            ret.values['time_tag'] = new Date(body.TimeStamp.concat('Z'));
                            this.res.content.SolarWindMagneticField = ret;
                            ok(ret);  
                        } else {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                            };
                            this.res.content.SolarWindMagneticField = ret;
                            ok(ret);
                        };
                    });
                    res.on('error', (e) => {
                        console.log('Error handled for SolarWindMagneticField: '.concat(e.message));
                        if (this.res.content.SolarWindMagneticField == undefined) {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                            };
                            this.res.content.SolarWindMagneticField = ret;
                            ok(ret);
                        } else {
                            ret = this.res.content.SolarWindMagneticField;
                            ok(ret);
                        };
                    });
                });
            } else {
                ret = this.res.content.SolarWindMagneticField;
                ok(ret);
            }
        });
    };

    async getSolarWindFlux() {
        return new Promise(ok => {
            var ret;
            const url = "https://services.swpc.noaa.gov/products/solar-wind/plasma-5-minute.json";
            if (this.needUpdate(this.res.content.SolarWindFlux, 60)) {
                https.get(url, res => {
                    res.setEncoding("utf8");
                    let body = "";
                    res.on("data", data => {
                      body += data;
                    });
                    res.on("end", () => {
                        try {
                            body = JSON.parse(body);
                        }
                        catch(err) {
                            console.log(err);
                            if (this.res.content.SolarWindFlux == undefined) {
                                ret = {
                                    "last-update" : new Date(),
                                    "values" : {},
                                };
                                this.res.content.SolarWindFlux = ret;
                                ok(ret);
                            } else {
                                ret = this.res.content.SolarWindFlux;
                                ok(ret);
                            };
                        }
                        if (Array.isArray(body)) {
                            var header = body[0];
                            var latest = body[body.length - 1];
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                                // "original" : body
                            };
                            header.forEach(function(value, index){
                                if (value === 'time_tag') {
                                    ret.values[value] = new Date(latest[index].concat('Z'));
                                } else if (value === 'density' || value === 'speed') {
                                    ret.values[value] = parseFloat(latest[index]);
                                } else {
                                    ret.values[value] = parseInt(latest[index]);
                                };
                            });
                            ret.values['density-unit'] = '1/cm\u00B3';
                            ret.values['speed-unit'] = 'km/sec';
                            ret.values['temperature-unit'] = 'K';
                            this.res.content.SolarWindFlux = ret;
                            ok(ret);
                        } else {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                            };
                            this.res.content.SolarWindFlux = ret;
                            ok(ret);
                        }; 
                    });
                    res.on('error', (e) => {
                        console.log('Error handled for SolarWindFlux: '.concat(e.message));
                        if (this.res.content.SolarWindFlux == undefined) {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                            };
                            this.res.content.SolarWindFlux = ret;
                            ok(ret);
                        } else {
                            ret = this.res.content.SolarWindFlux;
                            ok(ret);
                        };
                    });
                });
            } else {
                ret = this.res.content.SolarWindFlux;
                ok(ret);
            }
        });
    };

    async getHemisphericPower() {
        return new Promise(ok => {
            var ret;
            const url = "https://services.swpc.noaa.gov/text/aurora-nowcast-hemi-power.txt";
            if (this.needUpdate(this.res.content.HemisphericPower)) {
                https.get(url, res => {
                    res.setEncoding("utf8");
                    let body = "";
                    res.on("data", data => {
                      body += data;
                    });
                    res.on("end", () => {
                        var lines = body.trim().split('\n');
                        if (lines.length > 16) {
                            var currentline = lines[lines.length - 6];
                            var currentlineparts = currentline.split(/\s+/);
                            var timestamp = currentlineparts[0].concat('T', currentlineparts[1], ':00.000Z');
                            var north = currentlineparts[2];
                            var south = currentlineparts[3];
                            ret = {
                                    "last-update" : new Date(),
                                    "values" : {},
                                    // "original" : body
                            };
                            ret.values['North'] = parseInt(north);
                            ret.values['North-unit'] = 'GW';
                            ret.values['South'] = parseInt(south);
                            ret.values['South-unit'] = 'GW';
                            ret.values['time_tag'] = new Date(timestamp);
                            this.res.content.HemisphericPower = ret;
                            ok(ret);
                        } else {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                            };
                            this.res.content.HemisphericPower = ret;
                            ok(ret);
                        };
                    });
                    res.on('error', () => {
                        if (this.res.content.HemisphericPower == undefined) {
                            ret = {
                                "last-update" : new Date(),
                                "values" : {},
                            };
                            this.res.content.HemisphericPower = ret;
                            ok(ret);
                        } else {
                            ret = this.res.content.HemisphericPower;
                            ok(ret);
                        };
                        console.log('Error handled for HemispherisPower');
                    });
                });
            } else {
                ret = this.res.content.HemisphericPower;
                ok(ret);
            }
        });
    };
    
    async getAll() {
        let promises = [
            this.getKIndex(),
            this.getEstimatedKIndex(),
            this.getSolarWindSpeed(),
            this.getSolarWindMagneticField(),
            this.getSolarWindFlux(),
            this.getHemisphericPower(),
        ];
        let results = promises.map(async (job) => await job);
        let finalResult;
        for (const result of results) {
            finalResult += (await result);
        }
        return this.res;
    }

    needUpdate(time, timeout = null) {
        if (time == undefined) {
            return true;
        }
        if (timeout == null) {
            timeout = 300;
        }
        const now = new Date();
        let before = new Date(time['last-update']);
        before.setSeconds(before.getSeconds() + timeout);
        if (now > before) {
            return true;
        } else {
            return false;
        }
    }
};

module.exports = Parser;