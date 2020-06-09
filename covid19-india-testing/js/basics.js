var statenames = ["Ladakh", "Arunachal Pradesh", "Assam", "Chandigarh", "Karnataka", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Punjab", "Rajasthan", "Sikkim", "Tripura", "Uttarakhand", "Telangana", "Bihar", "Kerala", "Madhya Pradesh", "Andaman and Nicobar Islands", "Gujarat", "Odisha", "Dadra and Nagar Haveli and Daman and Diu", "Jammu and Kashmir", "Chhattisgarh", "Goa", "Haryana", "Himachal Pradesh", "Jharkhand", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Andhra Pradesh", "Puducherry", "Maharashtra", "Delhi"]

var color = d3.scaleQuantize([0, 10], d3.schemeBlues[5])
var altcolor = d3.scaleQuantize([0, 10], d3.schemeOranges[5])
var alt2color = d3.scaleQuantize([0, 10], d3.schemeReds[5])

class CovidTestingData {
    constructor(updatedon, statename, testPositivity, sources = []) {
        this.updatedon = updatedon
        this.statename = statename
        this.testPositivity = testPositivity
        this.id = 0
        this.sources = sources

        var date_split = updatedon.split('/')
        var date = parseInt(date_split[0])
        var month = parseInt(date_split[1]) - 1
        var year = parseInt(date_split[2])
        this.epoch = Date.UTC(year, month, date)
        this.date = new Date(year, month, date)
    }

    testPositivityNum() {
        if (this.testPositivity === "") {
            return 0.0
        }
    
        return parseFloat(this.testPositivity.replace('%', ''))
    }
}

class StatewiseTestingData {
    constructor(all, recent, all_flat) {
        this.all = all
        this.recent = recent
        this.all_flat = all_flat
    }
}